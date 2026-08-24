import { relations } from "drizzle-orm";
import { assessmentTargets, assessmentWorkspaces, auditLogs, evidence, findings, scanJobs, scanProfiles, users } from "./schema";

export const workspaceRelations = relations(assessmentWorkspaces, ({ many, one }) => ({
  owner: one(users, { fields: [assessmentWorkspaces.ownerId], references: [users.id] }),
  targets: many(assessmentTargets),
  profiles: many(scanProfiles),
  jobs: many(scanJobs),
  findings: many(findings),
  evidence: many(evidence),
  auditLogs: many(auditLogs),
}));

export const jobRelations = relations(scanJobs, ({ many, one }) => ({
  workspace: one(assessmentWorkspaces, { fields: [scanJobs.workspaceId], references: [assessmentWorkspaces.id] }),
  profile: one(scanProfiles, { fields: [scanJobs.profileId], references: [scanProfiles.id] }),
  findings: many(findings),
  evidence: many(evidence),
}));

export const findingRelations = relations(findings, ({ one, many }) => ({
  workspace: one(assessmentWorkspaces, { fields: [findings.workspaceId], references: [assessmentWorkspaces.id] }),
  job: one(scanJobs, { fields: [findings.scanJobId], references: [scanJobs.id] }),
  evidence: many(evidence),
}));

export const evidenceRelations = relations(evidence, ({ one }) => ({
  workspace: one(assessmentWorkspaces, { fields: [evidence.workspaceId], references: [assessmentWorkspaces.id] }),
  job: one(scanJobs, { fields: [evidence.scanJobId], references: [scanJobs.id] }),
  finding: one(findings, { fields: [evidence.findingId], references: [findings.id] }),
}));
