import { and, desc, eq } from "drizzle-orm";
import {
  assessmentTargets,
  assessmentWorkspaces,
  auditLogs,
  findings,
  scanJobs,
  scanProfiles,
} from "../drizzle/schema";
import { getDb } from "./db";
import { validateTargetForScope } from "../shared/assessmentPolicy";

export async function listWorkspaces(ownerId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(assessmentWorkspaces).where(eq(assessmentWorkspaces.ownerId, ownerId)).orderBy(desc(assessmentWorkspaces.updatedAt));
}

export async function getWorkspace(ownerId: number, workspaceId: number) {
  const db = await getDb();
  if (!db) return undefined;
  const rows = await db.select().from(assessmentWorkspaces).where(and(eq(assessmentWorkspaces.id, workspaceId), eq(assessmentWorkspaces.ownerId, ownerId))).limit(1);
  return rows[0];
}

export async function createWorkspace(ownerId: number, input: { name: string; description?: string }) {
  const db = await getDb();
  if (!db) throw new Error("Database belum tersedia");
  const result = await db.insert(assessmentWorkspaces).values({ ownerId, name: input.name, description: input.description ?? null });
  const id = Number(result[0].insertId);
  await db.insert(auditLogs).values({ workspaceId: id, actorId: ownerId, action: "workspace.created", metadata: { name: input.name } });
  return getWorkspace(ownerId, id);
}

export async function confirmAuthorization(ownerId: number, workspaceId: number, evidenceUrl?: string) {
  const db = await getDb();
  if (!db) throw new Error("Database belum tersedia");
  const workspace = await getWorkspace(ownerId, workspaceId);
  if (!workspace) return undefined;
  await db.update(assessmentWorkspaces).set({ authorizationConfirmed: 1, authorizationEvidenceUrl: evidenceUrl ?? null }).where(eq(assessmentWorkspaces.id, workspaceId));
  await db.insert(auditLogs).values({ workspaceId, actorId: ownerId, action: "authorization.confirmed", metadata: { evidenceProvided: Boolean(evidenceUrl) } });
  return getWorkspace(ownerId, workspaceId);
}

export async function listTargets(ownerId: number, workspaceId: number) {
  const db = await getDb();
  if (!db || !(await getWorkspace(ownerId, workspaceId))) return [];
  return db.select().from(assessmentTargets).where(eq(assessmentTargets.workspaceId, workspaceId)).orderBy(desc(assessmentTargets.createdAt));
}

export async function addTarget(ownerId: number, workspaceId: number, input: { value: string; targetType: "domain" | "url" | "ip" | "cidr" }) {
  const db = await getDb();
  if (!db || !(await getWorkspace(ownerId, workspaceId))) return undefined;
  const validation = validateTargetForScope(input.value);
  if (!validation.ok) throw new Error(validation.reason);
  const normalized = validation.value;
  const result = await db.insert(assessmentTargets).values({ workspaceId, value: normalized, targetType: input.targetType, inScope: 1 });
  await db.insert(auditLogs).values({ workspaceId, actorId: ownerId, action: "target.added", metadata: { value: normalized, targetType: input.targetType } });
  const rows = await db.select().from(assessmentTargets).where(eq(assessmentTargets.id, Number(result[0].insertId))).limit(1);
  return rows[0];
}

export async function listProfiles(ownerId: number, workspaceId: number) {
  const db = await getDb();
  if (!db || !(await getWorkspace(ownerId, workspaceId))) return [];
  return db.select().from(scanProfiles).where(eq(scanProfiles.workspaceId, workspaceId)).orderBy(desc(scanProfiles.createdAt));
}

export async function ensureDefaultProfile(workspaceId: number) {
  const db = await getDb();
  if (!db) return undefined;
  const existing = await db.select().from(scanProfiles).where(eq(scanProfiles.workspaceId, workspaceId)).limit(1);
  if (existing[0]) return existing[0];
  const result = await db.insert(scanProfiles).values({ workspaceId, name: "Baseline Aman", mode: "preview", rateLimit: 25, timeoutSeconds: 180, nmapEnabled: 1, nucleiEnabled: 1 });
  const rows = await db.select().from(scanProfiles).where(eq(scanProfiles.id, Number(result[0].insertId))).limit(1);
  return rows[0];
}

export async function createPreviewJob(ownerId: number, workspaceId: number, profileId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database belum tersedia");
  const workspace = await getWorkspace(ownerId, workspaceId);
  if (!workspace?.authorizationConfirmed) throw new Error("Otorisasi workspace belum dikonfirmasi");
  const targets = await listTargets(ownerId, workspaceId);
  if (targets.length === 0 || targets.some((target) => !target.inScope)) throw new Error("Workspace harus memiliki target yang berada dalam scope");
  const result = await db.insert(scanJobs).values({ workspaceId, profileId, status: "preview", currentStage: "review", targetCount: targets.length, findingCount: 0 });
  const jobId = Number(result[0].insertId);
  await db.insert(auditLogs).values({ workspaceId, actorId: ownerId, action: "scan.preview.created", metadata: { jobId, profileId, targetCount: targets.length } });
  const rows = await db.select().from(scanJobs).where(eq(scanJobs.id, jobId)).limit(1);
  return rows[0];
}

export async function listRecentJobs(ownerId: number, workspaceId: number) {
  const db = await getDb();
  if (!db || !(await getWorkspace(ownerId, workspaceId))) return [];
  return db.select().from(scanJobs).where(eq(scanJobs.workspaceId, workspaceId)).orderBy(desc(scanJobs.createdAt)).limit(10);
}

export async function listFindings(ownerId: number, workspaceId: number) {
  const db = await getDb();
  if (!db || !(await getWorkspace(ownerId, workspaceId))) return [];
  return db.select().from(findings).where(eq(findings.workspaceId, workspaceId)).orderBy(desc(findings.createdAt)).limit(100);
}
