export type OsintIoc = { kind: "domain" | "ip" | "url" | "email" | "hash"; value: string; source: string; confidence: number };
export type EvidenceTimelineItem = { id: string; observedAt: number; moduleId: string; summary: string; source: string };
export type AssetRelation = { from: string; to: string; relation: "resolves-to" | "uses-certificate" | "redirects-to" | "related-to"; confidence: number };

const privateIp = /^(10\.|127\.|169\.254\.|192\.168\.|172\.(1[6-9]|2\d|3[0-1])\.)/;
const secretLike = /(password|passwd|secret|token|api[_-]?key|authorization|cookie)/i;

export function normalizeIoc(input: OsintIoc): OsintIoc | null {
  const value = input.value.trim().replace(/[\r\n\t]/g, "").slice(0, 512);
  const source = input.source.trim().slice(0, 200);
  const confidence = Math.max(0, Math.min(100, Math.round(input.confidence)));
  if (!value || !source || secretLike.test(value) || (input.kind === "ip" && privateIp.test(value))) return null;
  if (input.kind === "url") {
    try { const url = new URL(value); if (!["http:", "https:"].includes(url.protocol)) return null; return { ...input, value: url.toString(), source, confidence }; } catch { return null; }
  }
  return { ...input, value: value.toLowerCase(), source, confidence };
}

export function buildAssetRelations(items: OsintIoc[]): AssetRelation[] {
  const unique = new Map<string, OsintIoc>();
  for (const item of items) { const normalized = normalizeIoc(item); if (normalized) unique.set(`${normalized.kind}:${normalized.value}`, normalized); }
  const values = Array.from(unique.values());
  const domains = values.filter((item) => item.kind === "domain");
  const ips = values.filter((item) => item.kind === "ip");
  return domains.flatMap((domain) => ips.map((ip) => ({ from: domain.value, to: ip.value, relation: "resolves-to" as const, confidence: Math.min(domain.confidence, ip.confidence) })));
}

export function scoreOsintRisk(input: { exposure: number; confidence: number; freshnessHours: number; manualValidated: boolean }): number {
  const exposure = Math.max(0, Math.min(100, input.exposure));
  const confidence = Math.max(0, Math.min(100, input.confidence));
  const freshnessPenalty = Math.min(25, Math.max(0, input.freshnessHours / 24));
  const validationBonus = input.manualValidated ? 10 : 0;
  return Math.max(0, Math.min(100, Math.round(exposure * 0.55 + confidence * 0.35 + validationBonus - freshnessPenalty)));
}

export function summarizeTimeline(items: EvidenceTimelineItem[]): EvidenceTimelineItem[] {
  return [...items].filter((item) => item.id && item.moduleId && item.summary && item.source).sort((a, b) => b.observedAt - a.observedAt).slice(0, 500);
}

export function osintSummaryCsv(items: Array<{ module: string; asset: string; status: string; confidence: number }>): string {
  const escape = (value: unknown) => `"${String(value).replace(/"/g, '""')}"`;
  return ["modul,aset,status,confidence", ...items.slice(0, 1000).map((item) => [item.module, item.asset, item.status, item.confidence].map(escape).join(","))].join("\n");
}
