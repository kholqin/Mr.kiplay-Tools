import { desc, eq } from "drizzle-orm";
import { workerJobs } from "../drizzle/schema";
import { getDb } from "./db";
import type { HeavyWorkerJob } from "../core/worker/isolatedWorker";

export async function persistWorkerJob(job: HeavyWorkerJob) {
  const db = await getDb();
  if (!db) return;
  const values = { id: job.id, workspaceId: job.workspaceId, task: job.task, status: job.status, createdAt: new Date(job.createdAt), startedAt: job.startedAt ? new Date(job.startedAt) : null, finishedAt: job.finishedAt ? new Date(job.finishedAt) : null, result: job.result && typeof job.result === "object" ? job.result as Record<string, unknown> : null, error: job.error?.slice(0, 255) ?? null };
  const existing = await db.select({ id: workerJobs.id }).from(workerJobs).where(eq(workerJobs.id, job.id)).limit(1);
  if (existing.length) await db.update(workerJobs).set(values).where(eq(workerJobs.id, job.id));
  else await db.insert(workerJobs).values(values);
}

export async function listPersistedWorkerJobs(workspaceId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(workerJobs).where(eq(workerJobs.workspaceId, workspaceId)).orderBy(desc(workerJobs.createdAt)).limit(50);
}
