import { int, json, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

export const assessmentWorkspaces = mysqlTable("assessment_workspaces", {
  id: int("id").autoincrement().primaryKey(),
  ownerId: int("ownerId").notNull(),
  name: varchar("name", { length: 160 }).notNull(),
  description: text("description"),
  authorizationConfirmed: int("authorizationConfirmed").default(0).notNull(),
  authorizationEvidenceUrl: text("authorizationEvidenceUrl"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export const assessmentTargets = mysqlTable("assessment_targets", {
  id: int("id").autoincrement().primaryKey(),
  workspaceId: int("workspaceId").notNull(),
  value: varchar("value", { length: 255 }).notNull(),
  targetType: mysqlEnum("targetType", ["domain", "url", "ip", "cidr"]).default("domain").notNull(),
  inScope: int("inScope").default(1).notNull(),
  excludedReason: text("excludedReason"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const scanProfiles = mysqlTable("scan_profiles", {
  id: int("id").autoincrement().primaryKey(),
  workspaceId: int("workspaceId").notNull(),
  name: varchar("name", { length: 120 }).notNull(),
  mode: mysqlEnum("mode", ["preview", "safe"]).default("preview").notNull(),
  rateLimit: int("rateLimit").default(25).notNull(),
  timeoutSeconds: int("timeoutSeconds").default(180).notNull(),
  nmapEnabled: int("nmapEnabled").default(1).notNull(),
  nucleiEnabled: int("nucleiEnabled").default(1).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const scanJobs = mysqlTable("scan_jobs", {
  id: int("id").autoincrement().primaryKey(),
  workspaceId: int("workspaceId").notNull(),
  profileId: int("profileId").notNull(),
  status: mysqlEnum("status", ["queued", "preview", "running", "completed", "failed", "cancelled"]).default("queued").notNull(),
  currentStage: varchar("currentStage", { length: 80 }),
  targetCount: int("targetCount").default(0).notNull(),
  findingCount: int("findingCount").default(0).notNull(),
  startedAt: timestamp("startedAt"),
  finishedAt: timestamp("finishedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const findings = mysqlTable("findings", {
  id: int("id").autoincrement().primaryKey(),
  workspaceId: int("workspaceId").notNull(),
  scanJobId: int("scanJobId").notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  category: varchar("category", { length: 80 }).notNull(),
  severity: mysqlEnum("severity", ["critical", "high", "medium", "low", "info"]).default("info").notNull(),
  confidence: mysqlEnum("confidence", ["high", "medium", "low"]).default("low").notNull(),
  target: varchar("target", { length: 255 }).notNull(),
  evidence: text("evidence"),
  remediation: text("remediation"),
  requiresManualValidation: int("requiresManualValidation").default(1).notNull(),
  fingerprint: varchar("fingerprint", { length: 128 }).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const reconResults = mysqlTable("recon_results", {
  id: int("id").autoincrement().primaryKey(),
  workspaceId: int("workspaceId").notNull(),
  targetId: int("targetId").notNull(),
  kind: mysqlEnum("kind", ["dns", "subdomain", "http", "certificate"]).notNull(),
  target: varchar("target", { length: 255 }).notNull(),
  payload: json("payload").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const portScanResults = mysqlTable("port_scan_results", {
  id: int("id").autoincrement().primaryKey(),
  workspaceId: int("workspaceId").notNull(),
  sourceReconId: int("sourceReconId"),
  host: varchar("host", { length: 255 }).notNull(),
  port: int("port").notNull(),
  state: mysqlEnum("state", ["open", "closed", "timeout", "error"]).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const evidence = mysqlTable("evidence", {
  id: int("id").autoincrement().primaryKey(),
  workspaceId: int("workspaceId").notNull(),
  scanJobId: int("scanJobId").notNull(),
  findingId: int("findingId"),
  kind: varchar("kind", { length: 80 }).notNull(),
  content: text("content").notNull(),
  sanitized: int("sanitized").default(1).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const auditLogs = mysqlTable("audit_logs", {
  id: int("id").autoincrement().primaryKey(),
  workspaceId: int("workspaceId").notNull(),
  actorId: int("actorId").notNull(),
  action: varchar("action", { length: 120 }).notNull(),
  metadata: json("metadata"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type AssessmentWorkspace = typeof assessmentWorkspaces.$inferSelect;
export type AssessmentTarget = typeof assessmentTargets.$inferSelect;
export type ScanProfile = typeof scanProfiles.$inferSelect;
export type ScanJob = typeof scanJobs.$inferSelect;
export type Finding = typeof findings.$inferSelect;
export type AuditLog = typeof auditLogs.$inferSelect;
export type Evidence = typeof evidence.$inferSelect;
export type ReconResult = typeof reconResults.$inferSelect;
export type PortScanResult = typeof portScanResults.$inferSelect;