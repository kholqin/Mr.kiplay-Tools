import { and, asc, count, desc, eq, like } from "drizzle-orm";
import { assessmentTargets, auditLogs, portScanResults, reconResults } from "../drizzle/schema";
import { getDb } from "./db";
import { getWorkspace } from "./assessmentDb";
import type { PortObservation } from "../core/recon/portScan";
import { portRowsToCsv } from "../shared/portCsv";

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

export type PortObservationSortKey = "host" | "port" | "state" | "createdAt";
export type PortObservationSortDirection = "asc" | "desc";

export async function listPortObservationsPage(ownerId: number, input: { workspaceId: number; page: number; pageSize: number; host?: string; state?: "all" | "open" | "closed" | "timeout" | "error"; sortKey: PortObservationSortKey; sortDirection: PortObservationSortDirection }) {
  const db = await getDb();
  if (!db || !(await getWorkspace(ownerId, input.workspaceId))) return { rows: [], totalRows: 0, page: 1, pageSize: input.pageSize, totalPages: 1 };
  const pageSize = Math.max(1, Math.min(100, Math.floor(input.pageSize)));
  const page = Math.max(1, Math.floor(input.page));
  const conditions = [eq(portScanResults.workspaceId, input.workspaceId)];
  if (input.host?.trim()) conditions.push(like(portScanResults.host, `%${input.host.trim()}%`));
  if (input.state && input.state !== "all") conditions.push(eq(portScanResults.state, input.state));
  const where = and(...conditions);
  const orderColumn = input.sortKey === "host" ? portScanResults.host : input.sortKey === "port" ? portScanResults.port : input.sortKey === "state" ? portScanResults.state : portScanResults.createdAt;
  const order = input.sortDirection === "asc" ? asc(orderColumn) : desc(orderColumn);
  const [{ total }] = await db.select({ total: count() }).from(portScanResults).where(where);
  const totalRows = Number(total ?? 0);
  const totalPages = Math.max(1, Math.ceil(totalRows / pageSize));
  const currentPage = Math.min(page, totalPages);
  const rows = await db.select().from(portScanResults).where(where).orderBy(order).limit(pageSize).offset((currentPage - 1) * pageSize);
  return { rows, totalRows, page: currentPage, pageSize, totalPages };
}

export async function exportPortObservationsCsv(ownerId: number, input: { workspaceId: number; host?: string; state?: "all" | "open" | "closed" | "timeout" | "error"; sortKey: PortObservationSortKey; sortDirection: PortObservationSortDirection }) {
  const db = await getDb();
  if (!db || !(await getWorkspace(ownerId, input.workspaceId))) return portRowsToCsv([]);
  const conditions = [eq(portScanResults.workspaceId, input.workspaceId)];
  if (input.host?.trim()) conditions.push(like(portScanResults.host, `%${input.host.trim()}%`));
  if (input.state && input.state !== "all") conditions.push(eq(portScanResults.state, input.state));
  const where = and(...conditions);
  const orderColumn = input.sortKey === "host" ? portScanResults.host : input.sortKey === "port" ? portScanResults.port : input.sortKey === "state" ? portScanResults.state : portScanResults.createdAt;
  const order = input.sortDirection === "asc" ? asc(orderColumn) : desc(orderColumn);
  const rows = await db.select().from(portScanResults).where(where).orderBy(order).limit(10000);
  return portRowsToCsv(rows);
}

export async function listPortObservations(ownerId: number, workspaceId: number) {
  const result = await listPortObservationsPage(ownerId, { workspaceId, page: 1, pageSize: 100, sortKey: "createdAt", sortDirection: "desc", state: "all" });
  return result.rows;
}
