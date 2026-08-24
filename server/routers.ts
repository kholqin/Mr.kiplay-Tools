import { COOKIE_NAME } from "@shared/const";
import { z } from "zod";
import { protectedProcedure } from "./_core/trpc";
import { addTarget, confirmAuthorization, createPreviewJob, createWorkspace, ensureDefaultProfile, getWorkspace, listFindings, listProfiles, listRecentJobs, listTargets, listWorkspaces, saveAuthorizationEvidence } from "./assessmentDb";
import { buildReport } from "./reporting";
import { moduleCatalog } from "../core/modules/catalog";
import { collectDnsRecords, discoverSubdomains } from "../core/recon/dns";
import { listReconResults, saveReconResult } from "./reconDb";
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
  }),
});

export type AppRouter = typeof appRouter;
