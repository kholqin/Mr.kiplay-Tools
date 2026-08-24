import { promises as dns } from "node:dns";
import { isSensitiveTarget, normalizeTarget, validateTargetForScope } from "../../shared/assessmentPolicy";

export type DnsReconOptions = { timeoutMs?: number; rateLimitPerSecond?: number; preview?: boolean };
export type DnsReconResult = { target: string; records: Record<string, unknown>; queriedAt: string; mode: "preview" | "active"; warnings: string[] };
export type SubdomainResult = { subdomain: string; addresses: string[]; source: "dns" };

export const getRateDelayMs = (rateLimitPerSecond = 2) => Math.ceil(1000 / Math.min(Math.max(rateLimitPerSecond, 1), 10));
const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function withTimeout<T>(operation: Promise<T>, timeoutMs: number): Promise<T> {
  return Promise.race([operation, new Promise<T>((_, reject) => setTimeout(() => reject(new Error("DNS timeout")), timeoutMs))]);
}

function validateDomain(value: string) {
  const normalized = normalizeTarget(value).split("/")[0];
  const validation = validateTargetForScope(normalized);
  if (!validation.ok) throw new Error(validation.reason);
  if (isSensitiveTarget(normalized) || !/^(?=.{1,253}$)([a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,63}$/i.test(normalized)) throw new Error("Target harus berupa domain publik yang valid");
  return normalized;
}

export async function collectDnsRecords(target: string, options: DnsReconOptions = {}): Promise<DnsReconResult> {
  const domain = validateDomain(target);
  const timeoutMs = Math.min(Math.max(options.timeoutMs ?? 5000, 1000), 15000);
  if (options.preview) return { target: domain, records: {}, queriedAt: new Date().toISOString(), mode: "preview", warnings: ["Pratinjau: tidak ada query DNS dikirim."] };
  const records: Record<string, unknown> = {};
  const delayMs = getRateDelayMs(options.rateLimitPerSecond);
  const queries: Array<[string, () => Promise<unknown>]> = [
    ["A", () => dns.resolve4(domain)], ["AAAA", () => dns.resolve6(domain)], ["CNAME", () => dns.resolveCname(domain)],
    ["MX", () => dns.resolveMx(domain)], ["NS", () => dns.resolveNs(domain)], ["TXT", () => dns.resolveTxt(domain)],
  ];
  for (const [type, query] of queries) {
    try { records[type] = await withTimeout(query(), timeoutMs); } catch { records[type] = []; }
    await wait(delayMs);
  }
  return { target: domain, records, queriedAt: new Date().toISOString(), mode: "active", warnings: ["Hasil DNS adalah observasi saat query dan perlu ditinjau ulang."] };
}

export async function discoverSubdomains(target: string, candidates: string[], options: DnsReconOptions = {}): Promise<SubdomainResult[]> {
  const domain = validateDomain(target);
  const uniqueCandidates = Array.from(new Set(candidates.map((candidate) => candidate.trim().toLowerCase()).filter((candidate) => /^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$/.test(candidate)))).slice(0, 100);
  if (options.preview) return uniqueCandidates.map((candidate) => ({ subdomain: `${candidate}.${domain}`, addresses: [], source: "dns" as const }));
  const delayMs = getRateDelayMs(options.rateLimitPerSecond);
  const timeoutMs = Math.min(Math.max(options.timeoutMs ?? 5000, 1000), 15000);
  const results: SubdomainResult[] = [];
  for (const candidate of uniqueCandidates) {
    const subdomain = `${candidate}.${domain}`;
    try { const addresses = await withTimeout(dns.resolve4(subdomain), timeoutMs); if (addresses.length) results.push({ subdomain, addresses, source: "dns" }); } catch { /* NXDOMAIN/timeout tidak menjadi error global */ }
    await wait(delayMs);
  }
  return results;
}
