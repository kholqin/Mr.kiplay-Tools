import { randomUUID } from "node:crypto";
import { Worker } from "node:worker_threads";

export type HeavyWorkerTask = "aggregatePortObservations" | "summarizeReconResults";
export type HeavyWorkerStatus = "queued" | "running" | "completed" | "failed" | "cancelled";

export type HeavyWorkerJob = {
  id: string;
  workspaceId: number;
  task: HeavyWorkerTask;
  status: HeavyWorkerStatus;
  createdAt: string;
  startedAt?: string;
  finishedAt?: string;
  result?: unknown;
  error?: string;
};

type QueueItem = { job: HeavyWorkerJob; payload: unknown; timeoutMs: number };
type PersistenceHook = (job: HeavyWorkerJob) => void | Promise<void>;

const MAX_QUEUE = 8;
const MAX_TIMEOUT_MS = 15_000;
const WORKER_SOURCE = `
const { parentPort } = require("node:worker_threads");
const text = (value, max = 160) => String(value ?? "").replace(/[\\u0000-\\u001f\\u007f]/g, " ").replace(/\\s+/g, " ").trim().slice(0, max);
const aggregate = (rows) => {
  const bounded = Array.isArray(rows) ? rows.slice(0, 10000) : [];
  const byState = {};
  for (const row of bounded) {
    const state = text(row && row.state, 32) || "unknown";
    byState[state] = (byState[state] || 0) + 1;
  }
  return { total: bounded.length, byState };
};
const summarize = (results) => {
  const bounded = Array.isArray(results) ? results.slice(0, 1000) : [];
  const byKind = {};
  for (const row of bounded) {
    const kind = text(row && row.kind, 32) || "unknown";
    byKind[kind] = (byKind[kind] || 0) + 1;
  }
  return { total: bounded.length, byKind };
};
parentPort.on("message", ({ task, payload }) => {
  try {
    const result = task === "aggregatePortObservations" ? aggregate(payload && payload.rows) : summarize(payload && payload.results);
    parentPort.postMessage({ ok: true, result });
  } catch (error) {
    parentPort.postMessage({ ok: false, error: text(error && error.message, 200) || "Worker gagal" });
  }
});
`;

export class IsolatedWorkerQueue {
  private readonly queue: QueueItem[] = [];
  private readonly jobs = new Map<string, HeavyWorkerJob>();
  private running = false;
  private persistenceHook?: PersistenceHook;

  setPersistenceHook(hook: PersistenceHook) { this.persistenceHook = hook; }
  private notify(job: HeavyWorkerJob) { try { void this.persistenceHook?.(job); } catch { /* persistence tidak boleh mematikan worker */ } }

  enqueue(workspaceId: number, task: HeavyWorkerTask, payload: unknown, timeoutMs = 10_000) {
    if (this.queue.length >= MAX_QUEUE) throw new Error("Antrean worker penuh; coba lagi setelah job selesai");
    const job: HeavyWorkerJob = { id: randomUUID(), workspaceId, task, status: "queued", createdAt: new Date().toISOString() };
    this.jobs.set(job.id, job);
    this.notify(job);
    this.queue.push({ job, payload, timeoutMs: Math.min(Math.max(Math.trunc(timeoutMs), 1000), MAX_TIMEOUT_MS) });
    void this.drain();
    return job;
  }

  get(jobId: string) {
    return this.jobs.get(jobId) ?? null;
  }

  getForWorkspace(jobId: string, workspaceId: number) {
    const job = this.jobs.get(jobId);
    return job?.workspaceId === workspaceId ? job : null;
  }

  listForWorkspace(workspaceId: number) {
    return Array.from(this.jobs.values()).filter((job) => job.workspaceId === workspaceId).slice(-50).reverse();
  }

  cancel(jobId: string) {
    const job = this.jobs.get(jobId);
    if (!job || job.status !== "queued") return false;
    job.status = "cancelled";
    job.finishedAt = new Date().toISOString();
    this.notify(job);
    return true;
  }

  private async drain() {
    if (this.running) return;
    const next = this.queue.shift();
    if (!next) return;
    if (next.job.status === "cancelled") return void this.drain();
    this.running = true;
    next.job.status = "running";
    next.job.startedAt = new Date().toISOString();
    this.notify(next.job);
    try {
      next.job.result = await runWorker(next.job.task, next.payload, next.timeoutMs);
      next.job.status = "completed";
      this.notify(next.job);
    } catch (error) {
      next.job.status = "failed";
      next.job.error = error instanceof Error ? error.message : "Worker gagal";
      this.notify(next.job);
    } finally {
      next.job.finishedAt = new Date().toISOString();
      this.notify(next.job);
      this.running = false;
      void this.drain();
    }
  }
}

function runWorker(task: HeavyWorkerTask, payload: unknown, timeoutMs: number) {
  return new Promise<unknown>((resolve, reject) => {
    const worker = new Worker(WORKER_SOURCE, { eval: true });
    const timer = setTimeout(() => {
      void worker.terminate();
      reject(new Error("Worker timeout"));
    }, timeoutMs);
    worker.once("message", (message: { ok: boolean; result?: unknown; error?: string }) => {
      clearTimeout(timer);
      void worker.terminate();
      if (message.ok) resolve(message.result);
      else reject(new Error(message.error || "Worker gagal"));
    });
    worker.once("error", (error) => {
      clearTimeout(timer);
      reject(new Error(`Worker error: ${error.message}`));
    });
    worker.once("exit", (code) => {
      if (code !== 0) {
        clearTimeout(timer);
        reject(new Error(`Worker berhenti dengan kode ${code}`));
      }
    });
    worker.postMessage({ task, payload });
  });
}

export const isolatedWorkerQueue = new IsolatedWorkerQueue();
