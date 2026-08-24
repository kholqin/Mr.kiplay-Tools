import { promises as dns } from "node:dns";
import { DEFAULT_RESOLVER, getCached, setCached, validateResolver } from "./dnsCache";
import { isSensitiveTarget, normalizeTarget, validateTargetForScope } from "../../shared/assessmentPolicy";

export type DnsReconOptions = { timeoutMs?: number; rateLimitPerSecond?: number; preview?: boolean; resolver?: string; cacheTtlSeconds?: number; bypassCache?: boolean };
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
  const resolverName = validateResolver(options.resolver);
  const timeoutMs = Math.min(Math.max(options.timeoutMs ?? 5000, 1000), 15000);
  const cacheKey = `dns:${resolverName}:${domain}`;
  if (!options.preview && !options.bypassCache) { const cached = getCached<Record<string, unknown>>(cacheKey); if (cached) return { target: domain, records: cached, queriedAt: new Date().toISOString(), mode: "active", warnings: ["Hasil diambil dari cache TTL."] }; }
  if (options.preview) return { target: domain, records: {}, queriedAt: new Date().toISOString(), mode: "preview", warnings: ["Pratinjau: tidak ada query DNS dikirim."] };
  const records: Record<string, unknown> = {};
  const client = resolverName === DEFAULT_RESOLVER ? dns : new dns.Resolver();
  if (resolverName !== DEFAULT_RESOLVER) client.setServers([resolverName]);
  const delayMs = getRateDelayMs(options.rateLimitPerSecond);
  const queries: Array<[string, () => Promise<unknown>]> = [
    ["A", () => client.resolve4(domain)], ["AAAA", () => client.resolve6(domain)], ["CNAME", () => client.resolveCname(domain)],
    ["MX", () => client.resolveMx(domain)], ["NS", () => client.resolveNs(domain)], ["TXT", () => client.resolveTxt(domain)],
  ];
  for (const [type, query] of queries) {
    try { records[type] = await withTimeout(query(), timeoutMs); } catch { records[type] = []; }
    await wait(delayMs);
  }
  setCached(cacheKey, records, options.cacheTtlSeconds);
  return { target: domain, records, queriedAt: new Date().toISOString(), mode: "active", warnings: ["Hasil DNS adalah observasi saat query dan perlu ditinjau ulang."] };
}

export async function discoverSubdomains(target: string, candidates: string[], options: DnsReconOptions = {}): Promise<SubdomainResult[]> {
  const domain = validateDomain(target);
  const resolverName = validateResolver(options.resolver);
  const uniqueCandidates = Array.from(new Set(candidates.map((candidate) => candidate.trim().toLowerCase()).filter((candidate) => /^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$/.test(candidate)))).slice(0, 100);
  if (options.preview) return uniqueCandidates.map((candidate) => ({ subdomain: `${candidate}.${domain}`, addresses: [], source: "dns" as const }));
  const cacheKey = `subdomain:${resolverName}:${domain}:${uniqueCandidates.join(",")}`;
  if (!options.bypassCache) { const cached = getCached<SubdomainResult[]>(cacheKey); if (cached) return cached; }
  const client = resolverName === DEFAULT_RESOLVER ? dns : new dns.Resolver();
  if (resolverName !== DEFAULT_RESOLVER) client.setServers([resolverName]);
  const delayMs = getRateDelayMs(options.rateLimitPerSecond);
  const timeoutMs = Math.min(Math.max(options.timeoutMs ?? 5000, 1000), 15000);
  const results: SubdomainResult[] = [];
  for (const candidate of uniqueCandidates) {
    const subdomain = `${candidate}.${domain}`;
    try { const addresses = await withTimeout(client.resolve4(subdomain), timeoutMs); if (addresses.length) results.push({ subdomain, addresses, source: "dns" }); } catch { /* NXDOMAIN/timeout tidak menjadi error global */ }
    await wait(delayMs);
  }
  setCached(cacheKey, results, options.cacheTtlSeconds);
  return results;
}
