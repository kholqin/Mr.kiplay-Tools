import { escapeHtml } from "../shared/reporting";
import { listFindings, listRecentJobs, listTargets, getWorkspace } from "./assessmentDb";

export async function buildReport(ownerId: number, workspaceId: number, format: "json" | "html") {
  const workspace = await getWorkspace(ownerId, workspaceId);
  if (!workspace) return undefined;
  const [targets, jobs, findings] = await Promise.all([
    listTargets(ownerId, workspaceId),
    listRecentJobs(ownerId, workspaceId),
    listFindings(ownerId, workspaceId),
  ]);
  const payload = { generatedAt: new Date().toISOString(), workspace, targets, jobs, findings };
  if (format === "json") return { format, content: JSON.stringify(payload, null, 2), filename: `mrkiplay-workspace-${workspaceId}.json` };
  const rows = findings.map((finding) => `<tr><td>${escapeHtml(finding.severity)}</td><td>${escapeHtml(finding.title)}</td><td>${escapeHtml(finding.target)}</td><td>${escapeHtml(finding.confidence)}</td><td>${escapeHtml(finding.remediation ?? "Validasi manual diperlukan")}</td></tr>`).join("");
  const content = `<!doctype html><html lang="id"><meta charset="utf-8"><title>Laporan Mr.Kiplay</title><style>body{font:15px system-ui;background:#0b0c10;color:#f5f5f5;padding:32px}h1{color:#ef4444}table{border-collapse:collapse;width:100%}td,th{border:1px solid #333;padding:10px;text-align:left}th{color:#fecaca}</style><h1>Laporan Assessment Mr.Kiplay</h1><p>Workspace: ${escapeHtml(workspace.name)}</p><p>Target: ${targets.length} · Job: ${jobs.length} · Temuan: ${findings.length}</p><table><thead><tr><th>Severity</th><th>Temuan</th><th>Target</th><th>Confidence</th><th>Remediasi</th></tr></thead><tbody>${rows || "<tr><td colspan=5>Belum ada temuan.</td></tr>"}</tbody></table></html>`;
  return { format, content, filename: `mrkiplay-workspace-${workspaceId}.html` };
}
