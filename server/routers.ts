import { COOKIE_NAME } from "@shared/const";
import { z } from "zod";
import { assertReconAuthorization } from "../shared/assessmentPolicy";
import { protectedProcedure } from "./_core/trpc";
import { addTarget, confirmAuthorization, createPreviewJob, createWorkspace, ensureDefaultProfile, getWorkspace, listFindings, listProfiles, listRecentJobs, listTargets, listWorkspaces, saveAuthorizationEvidence } from "./assessmentDb";
import { buildReport } from "./reporting";
import { moduleCatalog } from "../core/modules/catalog";
import { collectDnsRecords, discoverSubdomains } from "../core/recon/dns";
import { fingerprintHttp } from "../core/recon/httpFingerprint";
import { inventoryCertificate } from "../core/recon/certificateInventory";
import { runLiveOsint, type LiveOsintModule } from "../core/recon/liveOsint";
import { isolatedWorkerQueue } from "../core/worker/isolatedWorker";
import { listPersistedWorkerJobs, persistWorkerJob } from "./workerDb";
import { cancelPipeline, getPipeline, listPipelines, startPipeline } from "./pipelineProgress";

isolatedWorkerQueue.setPersistenceHook(persistWorkerJob);
import { exportReconResults, listReconResults, saveReconResult } from "./reconDb";
import { createPortScanPlan, scanOpenPorts } from "../core/recon/portScan";
import { listDiscoveredSubdomains, exportPortObservationsCsv, listPortObservations, listPortObservationsPage, savePortObservations } from "./portScanDb";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  modules: publicProcedure.query(() => moduleCatalog),

  assessment: router({
    workspaces: protectedProcedure.query(({ ctx }) => listWorkspaces(ctx.user.id)),
    getWorkspace: protectedProcedure.input(z.object({ workspaceId: z.number().int().positive() })).query(({ ctx, input }) => getWorkspace(ctx.user.id, input.workspaceId)),
    createWorkspace: protectedProcedure.input(z.object({ name: z.string().trim().min(3).max(160), description: z.string().trim().max(1000).optional() })).mutation(({ ctx, input }) => createWorkspace(ctx.user.id, input)),
    confirmAuthorization: protectedProcedure.input(z.object({ workspaceId: z.number().int().positive(), evidenceUrl: z.string().url().optional() })).mutation(({ ctx, input }) => confirmAuthorization(ctx.user.id, input.workspaceId, input.evidenceUrl)),
    uploadAuthorizationEvidence: protectedProcedure.input(z.object({ workspaceId: z.number().int().positive(), filename: z.string().min(1).max(120), mimeType: z.enum(["application/pdf", "image/png", "image/jpeg", "text/plain"]), base64: z.string().min(1).max(2_700_000) })).mutation(({ ctx, input }) => saveAuthorizationEvidence(ctx.user.id, input.workspaceId, input)),
    targets: protectedProcedure.input(z.object({ workspaceId: z.number().int().positive() })).query(({ ctx, input }) => listTargets(ctx.user.id, input.workspaceId)),
    addTarget: protectedProcedure.input(z.object({ workspaceId: z.number().int().positive(), value: z.string().trim().min(1).max(255), targetType: z.enum(["domain", "url", "ip", "cidr"]) })).mutation(({ ctx, input }) => addTarget(ctx.user.id, input.workspaceId, input)),
    profiles: protectedProcedure.input(z.object({ workspaceId: z.number().int().positive() })).query(async ({ ctx, input }) => {
      await ensureDefaultProfile(input.workspaceId);
      return listProfiles(ctx.user.id, input.workspaceId);
    }),
    previewScan: protectedProcedure.input(z.object({ workspaceId: z.number().int().positive(), profileId: z.number().int().positive() })).mutation(({ ctx, input }) => createPreviewJob(ctx.user.id, input.workspaceId, input.profileId)),
    jobs: protectedProcedure.input(z.object({ workspaceId: z.number().int().positive() })).query(({ ctx, input }) => listRecentJobs(ctx.user.id, input.workspaceId)),
    findings: protectedProcedure.input(z.object({ workspaceId: z.number().int().positive() })).query(({ ctx, input }) => listFindings(ctx.user.id, input.workspaceId)),
    report: protectedProcedure.input(z.object({ workspaceId: z.number().int().positive(), format: z.enum(["json", "html"]) })).query(({ ctx, input }) => buildReport(ctx.user.id, input.workspaceId, input.format)),
    reconResults: protectedProcedure.input(z.object({ workspaceId: z.number().int().positive(), kind: z.enum(["dns", "subdomain"]).optional() })).query(({ ctx, input }) => listReconResults(ctx.user.id, input.workspaceId, input.kind)),
    reconExport: protectedProcedure.input(z.object({ workspaceId: z.number().int().positive(), format: z.enum(["csv", "pdf"]) })).query(({ ctx, input }) => exportReconResults(ctx.user.id, input.workspaceId, input.format)),
    dnsLookup: protectedProcedure.input(z.object({ workspaceId: z.number().int().positive(), targetId: z.number().int().positive(), preview: z.boolean().default(true), resolver: z.string().max(64).default("system"), cacheTtlSeconds: z.number().int().min(5).max(3600).default(60), bypassCache: z.boolean().default(false) })).mutation(async ({ ctx, input }) => {
      const workspace = await getWorkspace(ctx.user.id, input.workspaceId);
      if (!workspace?.authorizationConfirmed) throw new Error("Otorisasi workspace belum dikonfirmasi");
      const target = (await listTargets(ctx.user.id, input.workspaceId)).find((item) => item.id === input.targetId);
      if (!target) throw new Error("Target tidak ditemukan dalam daftar izin");
      const result = await collectDnsRecords(target.value, { preview: input.preview, timeoutMs: 5000, rateLimitPerSecond: 2, resolver: input.resolver, cacheTtlSeconds: input.cacheTtlSeconds, bypassCache: input.bypassCache });
      return saveReconResult(ctx.user.id, input.workspaceId, target.id, "dns", target.value, result);
    }),
    subdomainDiscovery: protectedProcedure.input(z.object({ workspaceId: z.number().int().positive(), targetId: z.number().int().positive(), candidates: z.array(z.string().trim().min(1).max(63)).min(1).max(100), preview: z.boolean().default(true), resolver: z.string().max(64).default("system"), cacheTtlSeconds: z.number().int().min(5).max(3600).default(60), bypassCache: z.boolean().default(false) })).mutation(async ({ ctx, input }) => {
      const workspace = await getWorkspace(ctx.user.id, input.workspaceId);
      if (!workspace?.authorizationConfirmed) throw new Error("Otorisasi workspace belum dikonfirmasi");
      const target = (await listTargets(ctx.user.id, input.workspaceId)).find((item) => item.id === input.targetId);
      if (!target) throw new Error("Target tidak ditemukan dalam daftar izin");
      const result = await discoverSubdomains(target.value, input.candidates, { preview: input.preview, timeoutMs: 5000, rateLimitPerSecond: 2, resolver: input.resolver, cacheTtlSeconds: input.cacheTtlSeconds, bypassCache: input.bypassCache });
      return saveReconResult(ctx.user.id, input.workspaceId, target.id, "subdomain", target.value, result);
    }),
    discoveredSubdomains: protectedProcedure.input(z.object({ workspaceId: z.number().int().positive() })).query(({ ctx, input }) => listDiscoveredSubdomains(ctx.user.id, input.workspaceId)),
    portObservations: protectedProcedure.input(z.object({ workspaceId: z.number().int().positive(), page: z.number().int().min(1).default(1), pageSize: z.number().int().min(1).max(100).default(25), host: z.string().max(255).optional(), state: z.enum(["all", "open", "closed", "timeout", "error"]).default("all"), sortKey: z.enum(["host", "port", "state", "createdAt"]).default("createdAt"), sortDirection: z.enum(["asc", "desc"]).default("desc") })).query(({ ctx, input }) => listPortObservationsPage(ctx.user.id, input)),
    portObservationsCsv: protectedProcedure.input(z.object({ workspaceId: z.number().int().positive(), host: z.string().max(255).optional(), state: z.enum(["all", "open", "closed", "timeout", "error"]).default("all"), sortKey: z.enum(["host", "port", "state", "createdAt"]).default("createdAt"), sortDirection: z.enum(["asc", "desc"]).default("desc") })).query(({ ctx, input }) => exportPortObservationsCsv(ctx.user.id, input)),
    portScanFromSubdomains: protectedProcedure.input(z.object({ workspaceId: z.number().int().positive(), ports: z.array(z.number().int().min(1).max(65535)).min(1).max(32).default([80, 443, 8080, 8443]), preview: z.boolean().default(true) })).mutation(async ({ ctx, input }) => {
      const workspace = await getWorkspace(ctx.user.id, input.workspaceId);
      if (!workspace?.authorizationConfirmed) throw new Error("Otorisasi workspace belum dikonfirmasi");
      const hosts = await listDiscoveredSubdomains(ctx.user.id, input.workspaceId);
      assertReconAuthorization(workspace.authorizationConfirmed, hosts.length);
      const plan = createPortScanPlan(hosts, { ports: input.ports, preview: input.preview, maxHosts: 100, timeoutMs: 3000, rateLimitPerSecond: 2 });
      if (input.preview) return { plan, observations: [] };
      const result = await scanOpenPorts(hosts, { ports: input.ports, preview: false, maxHosts: 100, timeoutMs: 3000, rateLimitPerSecond: 2 });
      const saved = await savePortObservations(ctx.user.id, input.workspaceId, null, result.observations);
      return { plan: result.plan, observations: saved };
    }),
    httpFingerprint: protectedProcedure.input(z.object({ workspaceId: z.number().int().positive(), targetId: z.number().int().positive(), preview: z.boolean().default(true) })).mutation(async ({ ctx, input }) => {
      const workspace = await getWorkspace(ctx.user.id, input.workspaceId);
      if (!workspace?.authorizationConfirmed) throw new Error("Otorisasi workspace belum dikonfirmasi");
      const target = (await listTargets(ctx.user.id, input.workspaceId)).find((item) => item.id === input.targetId);
      if (!target) throw new Error("Target tidak ditemukan dalam daftar izin");
      const result = await fingerprintHttp(target.value, { preview: input.preview, timeoutMs: 5000, rateLimitPerSecond: 1 });
      return saveReconResult(ctx.user.id, input.workspaceId, target.id, "http", target.value, result);
    }),
    certificateInventory: protectedProcedure.input(z.object({ workspaceId: z.number().int().positive(), targetId: z.number().int().positive(), preview: z.boolean().default(true) })).mutation(async ({ ctx, input }) => {
      const workspace = await getWorkspace(ctx.user.id, input.workspaceId);
      if (!workspace?.authorizationConfirmed) throw new Error("Otorisasi workspace belum dikonfirmasi");
      const target = (await listTargets(ctx.user.id, input.workspaceId)).find((item) => item.id === input.targetId);
      if (!target) throw new Error("Target tidak ditemukan dalam daftar izin");
      const result = await inventoryCertificate(target.value, { preview: input.preview, timeoutMs: 5000 });
      return saveReconResult(ctx.user.id, input.workspaceId, target.id, "certificate", target.value, result);
    }),
    liveOsint: protectedProcedure.input(z.object({ workspaceId: z.number().int().positive(), targetId: z.number().int().positive(), module: z.enum(["rdap-domain", "ct-inventory", "robots-sitemap", "favicon-hash", "email-security", "mx-infrastructure", "nameserver-infrastructure", "redirect-chain", "archive-metadata", "public-repository-metadata"]) })).mutation(async ({ ctx, input }) => {
      const workspace = await getWorkspace(ctx.user.id, input.workspaceId);
      if (!workspace?.authorizationConfirmed) throw new Error("Otorisasi workspace belum dikonfirmasi");
      const target = (await listTargets(ctx.user.id, input.workspaceId)).find((item) => item.id === input.targetId);
      if (!target) throw new Error("Target tidak ditemukan dalam daftar izin");
      const result = await runLiveOsint(input.module as LiveOsintModule, target.value);
      return saveReconResult(ctx.user.id, input.workspaceId, target.id, "osint", target.value, result);
    }),
    enqueueWorker: protectedProcedure.input(z.object({ workspaceId: z.number().int().positive(), task: z.enum(["aggregatePortObservations", "summarizeReconResults"]) })).mutation(async ({ ctx, input }) => {
      const workspace = await getWorkspace(ctx.user.id, input.workspaceId);
      if (!workspace?.authorizationConfirmed) throw new Error("Otorisasi workspace belum dikonfirmasi");
      const payload = input.task === "aggregatePortObservations" ? { rows: await listPortObservations(ctx.user.id, input.workspaceId) } : { results: await listReconResults(ctx.user.id, input.workspaceId) };
      return isolatedWorkerQueue.enqueue(input.workspaceId, input.task, payload, 10000);
    }),
    workerJobs: protectedProcedure.input(z.object({ workspaceId: z.number().int().positive() })).query(async ({ ctx, input }) => {
      if (!(await getWorkspace(ctx.user.id, input.workspaceId))) throw new Error("Workspace tidak ditemukan");
      const persisted = await listPersistedWorkerJobs(input.workspaceId);
      return persisted.length ? persisted : isolatedWorkerQueue.listForWorkspace(input.workspaceId);
    }),
    workerJob: protectedProcedure.input(z.object({ workspaceId: z.number().int().positive(), jobId: z.string().uuid() })).query(async ({ ctx, input }) => {
      if (!(await getWorkspace(ctx.user.id, input.workspaceId))) throw new Error("Workspace tidak ditemukan");
      const job = isolatedWorkerQueue.getForWorkspace(input.jobId, input.workspaceId);
      if (!job) throw new Error("Job worker tidak ditemukan");
      return job;
    }),
    cancelWorker: protectedProcedure.input(z.object({ workspaceId: z.number().int().positive(), jobId: z.string().uuid() })).mutation(async ({ ctx, input }) => {
      if (!(await getWorkspace(ctx.user.id, input.workspaceId))) throw new Error("Workspace tidak ditemukan");
      const job = isolatedWorkerQueue.getForWorkspace(input.jobId, input.workspaceId);
      if (!job) throw new Error("Job worker tidak ditemukan");
      return { cancelled: isolatedWorkerQueue.cancel(input.jobId) };
    }),
    startPipeline: protectedProcedure.input(z.object({ workspaceId: z.number().int().positive(), targetId: z.number().int().positive(), mode: z.enum(["preview", "active"]).default("preview") })).mutation(async ({ ctx, input }) => {
      const workspace = await getWorkspace(ctx.user.id, input.workspaceId);
      if (!workspace?.authorizationConfirmed) throw new Error("Otorisasi workspace belum dikonfirmasi");
      const target = (await listTargets(ctx.user.id, input.workspaceId)).find((item) => item.id === input.targetId && item.inScope);
      if (!target) throw new Error("Target tidak ditemukan dalam allowlist workspace");
      return startPipeline({ ownerId: ctx.user.id, workspaceId: input.workspaceId, targetId: target.id, target: target.value, targetType: target.targetType, mode: input.mode });
    }),
    pipelineProgress: protectedProcedure.input(z.object({ workspaceId: z.number().int().positive(), jobId: z.string().uuid() })).query(async ({ ctx, input }) => {
      if (!(await getWorkspace(ctx.user.id, input.workspaceId))) throw new Error("Workspace tidak ditemukan");
      const snapshot = getPipeline(input.jobId, input.workspaceId);
      if (!snapshot) throw new Error("Pipeline tidak ditemukan atau sudah kedaluwarsa");
      return snapshot;
    }),
    pipelineHistory: protectedProcedure.input(z.object({ workspaceId: z.number().int().positive() })).query(async ({ ctx, input }) => {
      if (!(await getWorkspace(ctx.user.id, input.workspaceId))) throw new Error("Workspace tidak ditemukan");
      return listPipelines(input.workspaceId);
    }),
    cancelPipeline: protectedProcedure.input(z.object({ workspaceId: z.number().int().positive(), jobId: z.string().uuid() })).mutation(async ({ ctx, input }) => {
      if (!(await getWorkspace(ctx.user.id, input.workspaceId))) throw new Error("Workspace tidak ditemukan");
      return cancelPipeline(input.jobId, input.workspaceId);
    }),
  }),
});

export type AppRouter = typeof appRouter;
