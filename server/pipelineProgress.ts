import { randomUUID } from "node:crypto";
import { createSafeAutoReconPlan } from "../core/recon/autoPlan";
import { collectDnsRecords } from "../core/recon/dns";
import { fingerprintHttp } from "../core/recon/httpFingerprint";
import { inventoryCertificate } from "../core/recon/certificateInventory";
import { parsePublicReconUrl } from "../core/recon/target";
import { runLiveOsint } from "../core/recon/liveOsint";
import { scanOpenPorts } from "../core/recon/portScan";
import { progressForStages, sanitizePipelineMessage, type PipelineProgressSnapshot, type PipelineStage, type PipelineStageId } from "../shared/pipelineProgress";
import { saveReconResult } from "./reconDb";
import { savePortObservations } from "./portScanDb";

export type StartPipelineInput = {
  ownerId: number;
  workspaceId: number;
  targetId: number;
  target: string;
  targetType: "domain" | "url" | "ip" | "cidr";
  mode: "preview" | "active";
};

type RuntimeJob = { snapshot: PipelineProgressSnapshot; cancelRequested: boolean };
const jobs = new Map<string, RuntimeJob>();
const MAX_RUNTIME_JOBS = 100;

const now = () => new Date().toISOString();
const isCancellationError = (error: unknown) => error instanceof Error && error.message === "PIPELINE_CANCELLED";

function getRuntime(jobId: string, workspaceId: number) {
  const runtime = jobs.get(jobId);
  return runtime?.snapshot.workspaceId === workspaceId ? runtime : undefined;
}

function patchSnapshot(runtime: RuntimeJob, patch: Partial<PipelineProgressSnapshot>) {
  runtime.snapshot = { ...runtime.snapshot, ...patch, updatedAt: now() };
  runtime.snapshot.percent = progressForStages(runtime.snapshot.stages, runtime.snapshot.status);
}

function stage(runtime: RuntimeJob, id: PipelineStageId) {
  return runtime.snapshot.stages.find((item) => item.id === id);
}

function updateStage(runtime: RuntimeJob, id: PipelineStageId, patch: Partial<PipelineStage>) {
  runtime.snapshot.stages = runtime.snapshot.stages.map((item) => item.id === id ? { ...item, ...patch } : item);
  patchSnapshot(runtime, { currentStage: id });
}

function assertNotCancelled(runtime: RuntimeJob) {
  if (runtime.cancelRequested) throw new Error("PIPELINE_CANCELLED");
}

function markCancelled(runtime: RuntimeJob) {
  const finishedAt = now();
  runtime.snapshot.stages = runtime.snapshot.stages.map((item) => item.status === "pending" || item.status === "running" ? { ...item, status: "cancelled" as const, finishedAt } : item);
  patchSnapshot(runtime, { status: "cancelled", finishedAt, message: "Pipeline dibatalkan; tidak ada tahap lanjutan yang dijalankan." });
}

async function executeStage(runtime: RuntimeJob, id: PipelineStageId, work: () => Promise<number | undefined>) {
  assertNotCancelled(runtime);
  updateStage(runtime, id, { status: "running", startedAt: now(), message: "Sedang berjalan…" });
  try {
    const resultCount = await work();
    assertNotCancelled(runtime);
    updateStage(runtime, id, { status: "completed", finishedAt: now(), message: "Tahap selesai.", resultCount });
  } catch (error) {
    if (isCancellationError(error)) throw error;
    const message = sanitizePipelineMessage(error instanceof Error ? error.message : "Tahap gagal");
    updateStage(runtime, id, { status: "failed", finishedAt: now(), message });
    throw new Error(message);
  }
}

async function runPipeline(runtime: RuntimeJob, input: StartPipelineInput) {
  try {
    if (runtime.snapshot.mode === "preview") {
      updateStage(runtime, "preflight", { status: "completed", startedAt: now(), finishedAt: now(), message: "Otorisasi dan allowlist tervalidasi." });
      for (const id of ["dns", "http", "certificate", "osint", "ports"] as const) updateStage(runtime, id, { status: "skipped", finishedAt: now(), message: "Pratinjau: request tidak dikirim." });
      updateStage(runtime, "finalize", { status: "completed", startedAt: now(), finishedAt: now(), message: "Rencana siap ditinjau." });
      patchSnapshot(runtime, { status: "completed", finishedAt: now(), message: "Pratinjau selesai; tidak ada request jaringan yang dikirim." });
      return;
    }

    updateStage(runtime, "preflight", { status: "completed", startedAt: now(), finishedAt: now(), message: "Otorisasi, allowlist, dan target publik tervalidasi." });
    const domainTarget = input.targetType === "ip" ? undefined : input.target;
    if (!domainTarget) {
      updateStage(runtime, "dns", { status: "skipped", startedAt: now(), finishedAt: now(), message: "Target IP tidak diproses sebagai domain.", resultCount: 0 });
    } else {
      await executeStage(runtime, "dns", async () => {
        const result = await collectDnsRecords(domainTarget, { preview: false, timeoutMs: 5000, rateLimitPerSecond: 2, resolver: "system", cacheTtlSeconds: 60 });
        await saveReconResult(input.ownerId, input.workspaceId, input.targetId, "dns", result.target, result);
        return Object.keys(result.records).length;
      });
    }
    await executeStage(runtime, "http", async () => {
      const result = await fingerprintHttp(input.target, { preview: false, timeoutMs: 5000, rateLimitPerSecond: 1 });
      await saveReconResult(input.ownerId, input.workspaceId, input.targetId, "http", input.target, result);
      return Object.keys(result).length;
    });
    await executeStage(runtime, "certificate", async () => {
      const result = await inventoryCertificate(input.target, { preview: false, timeoutMs: 5000 });
      await saveReconResult(input.ownerId, input.workspaceId, input.targetId, "certificate", input.target, result);
      return Object.keys(result).length;
    });
    await executeStage(runtime, "osint", async () => {
      const result = await runLiveOsint("redirect-chain", input.target);
      await saveReconResult(input.ownerId, input.workspaceId, input.targetId, "osint", input.target, result);
      return 1;
    });
    await executeStage(runtime, "ports", async () => {
      const host = parsePublicReconUrl(input.target).hostname;
      const result = await scanOpenPorts([host], { ports: [80, 443, 8080, 8443], preview: false, maxHosts: 1, timeoutMs: 2000, rateLimitPerSecond: 2 });
      if (result.observations.length) await savePortObservations(input.ownerId, input.workspaceId, null, result.observations);
      return result.observations.length;
    });
    await executeStage(runtime, "finalize", async () => 0);
    patchSnapshot(runtime, { status: "completed", finishedAt: now(), message: "Pipeline selesai; hasil tersimpan untuk tinjauan manual." });
  } catch (error) {
    if (isCancellationError(error) || runtime.cancelRequested) {
      markCancelled(runtime);
      return;
    }
    const message = sanitizePipelineMessage(error instanceof Error ? error.message : "Pipeline gagal");
    patchSnapshot(runtime, { status: "failed", finishedAt: now(), error: message, message: "Pipeline berhenti dan memerlukan tinjauan operator." });
  }
}

export function startPipeline(input: StartPipelineInput) {
  createSafeAutoReconPlan({ target: input.target, authorizationConfirmed: true, allowlisted: true });
  if (jobs.size >= MAX_RUNTIME_JOBS) {
    for (const [id, runtime] of Array.from(jobs.entries())) if (["completed", "failed", "cancelled"].includes(runtime.snapshot.status)) jobs.delete(id);
  }
  if (jobs.size >= MAX_RUNTIME_JOBS) throw new Error("Riwayat pipeline aktif penuh; tunggu job terminal selesai.");
  const jobId = randomUUID();
  const createdAt = now();
  const snapshot: PipelineProgressSnapshot = {
    jobId,
    workspaceId: input.workspaceId,
    targetId: input.targetId,
    target: sanitizePipelineMessage(input.target, 253),
    mode: input.mode,
    status: "queued",
    percent: 0,
    currentStage: "preflight",
    createdAt,
    updatedAt: createdAt,
    message: input.mode === "preview" ? "Pratinjau antrean; tidak ada request jaringan." : "Pipeline masuk antrean aman.",
    stages: [
      { id: "preflight", label: "Prapemeriksaan", description: "Memeriksa otorisasi, allowlist, dan resolusi publik.", status: "pending" },
      { id: "dns", label: "DNS", description: "Mengumpulkan metadata DNS terbatas dan terukur.", status: "pending" },
      { id: "http", label: "HTTP pasif", description: "Membaca header dan sinyal teknologi tanpa payload.", status: "pending" },
      { id: "certificate", label: "Sertifikat TLS", description: "Mencatat metadata sertifikat peer tanpa material kunci.", status: "pending" },
      { id: "osint", label: "OSINT publik", description: "Mengambil metadata redirect publik yang dibatasi.", status: "pending" },
      { id: "ports", label: "Port terbatas", description: "Mengobservasi port eksplisit dalam scope, tanpa eksploitasi.", status: "pending" },
      { id: "finalize", label: "Finalisasi", description: "Menyimpan ringkasan hasil dan audit lifecycle job.", status: "pending" },
    ],
  };
  const runtime: RuntimeJob = { snapshot, cancelRequested: false };
  jobs.set(jobId, runtime);
  void (async () => {
    await new Promise((resolve) => setTimeout(resolve, 50));
    if (runtime.cancelRequested) return markCancelled(runtime);
    patchSnapshot(runtime, { status: "running", startedAt: now(), message: input.mode === "preview" ? "Menyiapkan pratinjau…" : "Pipeline berjalan dengan batas aman…" });
    await runPipeline(runtime, input);
  })();
  return snapshot;
}

export function getPipeline(jobId: string, workspaceId: number) {
  return getRuntime(jobId, workspaceId)?.snapshot ?? null;
}

export function listPipelines(workspaceId: number) {
  return Array.from(jobs.values()).map((runtime) => runtime.snapshot).filter((snapshot) => snapshot.workspaceId === workspaceId).sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 20);
}

export function cancelPipeline(jobId: string, workspaceId: number) {
  const runtime = getRuntime(jobId, workspaceId);
  if (!runtime) throw new Error("Pipeline tidak ditemukan");
  if (["completed", "failed", "cancelled"].includes(runtime.snapshot.status)) return { cancelled: false, status: runtime.snapshot.status };
  runtime.cancelRequested = true;
  if (runtime.snapshot.status === "queued") markCancelled(runtime);
  else patchSnapshot(runtime, { message: "Pembatalan diminta; tahap aktif akan dihentikan pada batas aman berikutnya." });
  return { cancelled: true, status: runtime.snapshot.status };
}
