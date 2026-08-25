import { and, desc, eq } from "drizzle-orm";
import { assessmentTargets, auditLogs, reconResults } from "../drizzle/schema";
import { getDb } from "./db";
import { getWorkspace } from "./assessmentDb";
import { reconRowsFromResults, reconRowsToCsv, reconRowsToPrintableHtml } from "../shared/reconExport";

export async function saveReconResult(ownerId: number, workspaceId: number, targetId: number, kind: "dns" | "subdomain" | "http" | "certificate", target: string, payload: unknown) {
  const db = await getDb();
  if (!db || !(await getWorkspace(ownerId, workspaceId))) return undefined;
  const targetRows = await db.select().from(assessmentTargets).where(and(eq(assessmentTargets.id, targetId), eq(assessmentTargets.workspaceId, workspaceId), eq(assessmentTargets.inScope, 1))).limit(1);
  if (!targetRows[0]) throw new Error("Target tidak ditemukan dalam daftar izin");
  const result = await db.insert(reconResults).values({ workspaceId, targetId, kind, target, payload: payload as Record<string, unknown> });
  const rows = await db.select().from(reconResults).where(eq(reconResults.id, Number(result[0].insertId))).limit(1);
  await db.insert(auditLogs).values({ workspaceId, actorId: ownerId, action: `recon.${kind}.completed`, metadata: { targetId, target } });
  return rows[0];
}

export async function listReconResults(ownerId: number, workspaceId: number, kind?: "dns" | "subdomain") {
  const db = await getDb();
  if (!db || !(await getWorkspace(ownerId, workspaceId))) return [];
  const filters = kind ? and(eq(reconResults.workspaceId, workspaceId), eq(reconResults.kind, kind)) : eq(reconResults.workspaceId, workspaceId);
  return db.select().from(reconResults).where(filters).orderBy(desc(reconResults.createdAt)).limit(100);
}

export async function exportReconResults(ownerId: number, workspaceId: number, format: "csv" | "html") {
  const rows = await listReconResults(ownerId, workspaceId);
  const exportRows = reconRowsFromResults(rows);
  return format === "csv" ? reconRowsToCsv(exportRows) : reconRowsToPrintableHtml(exportRows);
}
