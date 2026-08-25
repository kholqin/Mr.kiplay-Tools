export type ReconExportRow = { module: string; target: string; status: string; observedAt: number | Date; summary: string };

const SECRET_KEY = /(password|passwd|secret|token|api[_-]?key|authorization|cookie|private[_-]?key)/i;
const FORMULA_PREFIX = /^[=+\-@]/;
const MAX_ROWS = 1000;

export function sanitizeReconText(value: unknown, maxLength = 500): string {
  const text = String(value ?? "").replace(/[\r\n\t]+/g, " ").trim().slice(0, maxLength);
  return FORMULA_PREFIX.test(text) ? `'${text}` : text;
}

export function summarizeReconPayload(payload: unknown): string {
  if (!payload || typeof payload !== "object") return sanitizeReconText(payload || "Metadata tersedia");
  const entries = Object.entries(payload as Record<string, unknown>).filter(([key]) => !SECRET_KEY.test(key)).slice(0, 8);
  return sanitizeReconText(entries.map(([key, value]) => `${key}: ${typeof value === "object" ? JSON.stringify(value) : String(value)}`).join("; ") || "Metadata tersedia");
}

export function reconRowsFromResults(results: Array<{ kind: string; target: string; createdAt: number | Date; payload: unknown }>): ReconExportRow[] {
  return results.slice(0, MAX_ROWS).map((item) => ({
    module: sanitizeReconText(item.kind, 80),
    target: sanitizeReconText(item.target, 255),
    status: "tersimpan",
    observedAt: item.createdAt,
    summary: summarizeReconPayload(item.payload),
  }));
}

export function reconRowsToCsv(rows: ReconExportRow[]): string {
  const quote = (value: unknown) => `"${sanitizeReconText(value).replace(/"/g, '""')}"`;
  const header = ["modul", "target", "status", "waktu", "ringkasan"].map(quote).join(",");
  const lines = rows.slice(0, MAX_ROWS).map((row) => [row.module, row.target, row.status, new Date(row.observedAt).toISOString(), row.summary].map(quote).join(","));
  return [header, ...lines].join("\n");
}

function escapeHtml(value: unknown): string {
  return sanitizeReconText(value).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}

export function reconRowsToPrintableHtml(rows: ReconExportRow[], workspaceLabel = "Workspace terotorisasi"): string {
  const body = rows.slice(0, MAX_ROWS).map((row) => `<tr><td>${escapeHtml(row.module)}</td><td>${escapeHtml(row.target)}</td><td>${escapeHtml(row.status)}</td><td>${escapeHtml(new Date(row.observedAt).toLocaleString("id-ID"))}</td><td>${escapeHtml(row.summary)}</td></tr>`).join("");
  return `<!doctype html><html lang="id"><head><meta charset="utf-8"><title>Laporan Recon OSINT</title><style>body{font-family:Arial,sans-serif;color:#161616;margin:32px}h1{margin:0 0 8px}p{color:#555;font-size:12px}table{border-collapse:collapse;width:100%;font-size:11px}th,td{border:1px solid #ccc;padding:7px;text-align:left;vertical-align:top}th{background:#f2f2f2}@media print{body{margin:18mm}thead{display:table-header-group}}</style></head><body><h1>Laporan Recon OSINT</h1><p>${escapeHtml(workspaceLabel)} · Dibuat ${escapeHtml(new Date().toLocaleString("id-ID"))} · Maksimal 1.000 baris</p><p>Data merupakan metadata hasil assessment berizin dan wajib ditinjau manual.</p><table><thead><tr><th>Modul</th><th>Target</th><th>Status</th><th>Waktu</th><th>Ringkasan tersanitasi</th></tr></thead><tbody>${body || '<tr><td colspan="5">Belum ada hasil recon.</td></tr>'}</tbody></table><script>window.addEventListener('load',()=>window.print())</script></body></html>`;
}

export const RECON_EXPORT_MAX_ROWS = MAX_ROWS;
