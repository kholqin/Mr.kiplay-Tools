import { and, desc, eq } from "drizzle-orm";
import { assessmentTargets, auditLogs, portScanResults, reconResults } from "../drizzle/schema";
import { getDb } from "./db";
import { getWorkspace } from "./assessmentDb";
import type { PortObservation } from "../core/recon/portScan";

export async function listDiscoveredSubdomains(ownerId: number, workspaceId: number) {
  const db = await getDb();
  if (!db || !(await getWorkspace(ownerId, workspaceId))) return [];
  const rows = await db.select().from(reconResults).where(and(eq(reconResults.workspaceId, workspaceId), eq(reconResults.kind, "subdomain"))).orderBy(desc(reconResults.createdAt)).limit(100);
  const hosts = rows.flatMap((row) => {
    const payload = row.payload as unknown;
    if (!Array.isArray(payload)) return [];
    return payload.flatMap((item) => typeof item === "object" && item !== null && "subdomain" in item && typeof item.subdomain === "string" ? [item.subdomain] : []);
  });
  return Array.from(new Set(hosts));
}

export async function savePortObservations(ownerId: number, workspaceId: number, sourceReconId: number | null, observations: PortObservation[]) {
  const db = await getDb();
  if (!db || !(await getWorkspace(ownerId, workspaceId))) return [];
  if (!observations.length) return [];
  await db.insert(portScanResults).values(observations.map((item) => ({ workspaceId, sourceReconId, host: item.host, port: item.port, state: item.state })));
  await db.insert(auditLogs).values({ workspaceId, actorId: ownerId, action: "recon.port_scan.completed", metadata: { sourceReconId, observationCount: observations.length, openCount: observations.filter((item) => item.state === "open").length } });
  return db.select().from(portScanResults).where(eq(portScanResults.workspaceId, workspaceId)).orderBy(desc(portScanResults.createdAt)).limit(100);
}

export async function listPortObservations(ownerId: number, workspaceId: number) {
  const db = await getDb();
  if (!db || !(await getWorkspace(ownerId, workspaceId))) return [];
  return db.select().from(portScanResults).where(eq(portScanResults.workspaceId, workspaceId)).orderBy(desc(portScanResults.createdAt)).limit(200);
}
