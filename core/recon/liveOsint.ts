import { createHash } from "node:crypto";
import { promises as dns } from "node:dns";
import { assertPublicResolution, parsePublicReconUrl, sanitizeReconText } from "./target";

export type LiveOsintModule = "rdap-domain" | "ct-inventory" | "robots-sitemap" | "favicon-hash" | "email-security" | "mx-infrastructure" | "nameserver-infrastructure" | "redirect-chain" | "archive-metadata" | "public-repository-metadata";
export type LiveOsintResult = { module: LiveOsintModule; target: string; observedAt: string; data: unknown; warnings: string[] };
const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
let lastProviderRequestAt = 0;
async function waitForProviderRateLimit() { const now = Date.now(); const delay = Math.max(0, 500 - (now - lastProviderRequestAt)); if (delay) await wait(delay); lastProviderRequestAt = Date.now(); }
const text = (value: unknown, max = 1000) => sanitizeReconText(value, max);
const timeout = (value = 7000) => Math.min(Math.max(value, 1000), 10000);

async function request(url: string, init: RequestInit = {}) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeout());
  try { await waitForProviderRateLimit(); return await fetch(url, { ...init, redirect: "manual", signal: controller.signal, headers: { "user-agent": "MrKiplay/1.0 authorized-security-research", accept: "application/json,text/plain,*/*", ...(init.headers ?? {}) } }); }
  catch (error) { throw new Error(error instanceof Error && error.name === "AbortError" ? "Provider timeout" : "Provider request gagal"); }
  finally { clearTimeout(timer); }
}

function domainOf(value: string) { return parsePublicReconUrl(value).hostname; }
async function assertTarget(value: string) { const url = parsePublicReconUrl(value.includes("://") ? value : `https://${value}`); await assertPublicResolution(url.hostname); return url; }

export async function runLiveOsint(module: LiveOsintModule, target: string): Promise<LiveOsintResult> {
  const observedAt = new Date().toISOString();
  if (module === "rdap-domain") {
    const domain = domainOf(target); const response = await request(`https://rdap.org/domain/${encodeURIComponent(domain)}`); if (!response.ok) throw new Error(`RDAP gagal (${response.status})`); const body = await response.json() as Record<string, unknown>; return { module, target: domain, observedAt, data: { ldhName: text(body.ldhName, 253), status: Array.isArray(body.status) ? body.status.slice(0, 10).map((item) => text(item, 80)) : [], events: Array.isArray(body.events) ? body.events.slice(0, 10) : [], nameservers: Array.isArray(body.nameservers) ? body.nameservers.slice(0, 10).map((item) => text((item as { ldhName?: string }).ldhName, 253)) : [] }, warnings: ["Metadata RDAP publik; data registran personal tidak disalin."] };
  }
  if (module === "ct-inventory") {
    const domain = domainOf(target); const response = await request(`https://crt.sh/?q=%25.${encodeURIComponent(domain)}&output=json`); if (!response.ok) throw new Error(`CT provider gagal (${response.status})`); const body = await response.json() as Array<{ name_value?: string; entry_timestamp?: string }>; const names = Array.from(new Set(body.slice(0, 500).flatMap((item) => (item.name_value ?? "").split("\n").map((name) => text(name.toLowerCase(), 253)).filter((name) => name.endsWith(domain))))).slice(0, 200); return { module, target: domain, observedAt, data: { names, records: body.slice(0, 200).map((item) => ({ name: text(item.name_value, 253), observedAt: text(item.entry_timestamp, 40) })) }, warnings: ["Kandidat CT wajib diverifikasi dan tetap tunduk allowlist."] };
  }
  const url = await assertTarget(target);
  if (module === "robots-sitemap") {
    const base = `${url.protocol}//${url.host}`; const [robots, sitemap] = await Promise.all([request(`${base}/robots.txt`), request(`${base}/sitemap.xml`)]); return { module, target: url.toString(), observedAt, data: { robots: text(await robots.text(), 8000), sitemap: text(await sitemap.text(), 8000), statuses: { robots: robots.status, sitemap: sitemap.status } }, warnings: ["Hanya dua resource metadata publik yang diminta; tidak dilakukan crawling lanjutan."] };
  }
  if (module === "favicon-hash") {
    const response = await request(`${url.protocol}//${url.host}/favicon.ico`); const bytes = new Uint8Array(await response.arrayBuffer()); if (bytes.byteLength > 512 * 1024) throw new Error("Favicon melebihi batas 512 KB"); return { module, target: url.toString(), observedAt, data: { status: response.status, bytes: bytes.byteLength, sha256: createHash("sha256").update(bytes).digest("hex") }, warnings: ["Bytes favicon tidak disimpan."] };
  }
  if (module === "redirect-chain") {
    const hops: Array<{ status: number; host: string; location?: string }> = []; let current = url; for (let index = 0; index < 5; index += 1) { const response = await request(current.toString(), { method: "HEAD" }); const location = response.headers.get("location") ?? undefined; hops.push({ status: response.status, host: current.hostname, location: location ? text(location, 500) : undefined }); if (!location || response.status < 300 || response.status >= 400) break; const next = new URL(location, current); await assertPublicResolution(next.hostname); current = next; await wait(250); } return { module, target: url.toString(), observedAt, data: { hops }, warnings: ["Hop dibatasi lima dan setiap hostname diverifikasi publik."] };
  }
  if (module === "archive-metadata") {
    const response = await request(`https://web.archive.org/cdx/search/cdx?url=${encodeURIComponent(url.hostname)}/*&output=json&fl=timestamp,original,statuscode,mimetype&filter=statuscode:200&collapse=urlkey&limit=100`); if (!response.ok) throw new Error(`Arsip gagal (${response.status})`); const body = await response.json() as unknown[]; return { module, target: url.hostname, observedAt, data: { rows: body.slice(0, 101).map((row) => Array.isArray(row) ? row.slice(0, 4).map((item) => text(item, 500)) : []) }, warnings: ["Hanya metadata indeks; isi arsip tidak diambil massal."] };
  }
  if (module === "public-repository-metadata") { const match = url.pathname.match(/^\/([^/]+)\/([^/]+)/); if (!match) throw new Error("Target repository harus berupa URL github.com/owner/repository"); const response = await request(`https://api.github.com/repos/${encodeURIComponent(match[1])}/${encodeURIComponent(match[2])}`); if (!response.ok) throw new Error(`GitHub API gagal (${response.status})`); const body = await response.json() as Record<string, unknown>; return { module, target: url.toString(), observedAt, data: { fullName: text(body.full_name, 200), htmlUrl: text(body.html_url, 500), language: text(body.language, 80), defaultBranch: text(body.default_branch, 120), updatedAt: text(body.updated_at, 40), stars: typeof body.stargazers_count === "number" ? body.stargazers_count : 0 }, warnings: ["Metadata repository publik saja; tidak membaca file atau secret."] }; }
  const resolver = new dns.Resolver(); resolver.setServers(["1.1.1.1"]);
  if (module === "mx-infrastructure" || module === "email-security" || module === "nameserver-infrastructure") { const domain = url.hostname; const records: Record<string, unknown> = {}; if (module === "mx-infrastructure" || module === "email-security") records.MX = await resolver.resolveMx(domain).catch(() => []); if (module === "nameserver-infrastructure") records.NS = await resolver.resolveNs(domain).catch(() => []); if (module === "email-security") { records.TXT = await resolver.resolveTxt(domain).catch(() => []); records._dmarc = await resolver.resolveTxt(`_dmarc.${domain}`).catch(() => []); } return { module, target: domain, observedAt, data: records, warnings: ["DNS publik; tidak mengirim email dan tidak menguji akun."] }; }
  throw new Error("Modul OSINT live belum tersedia");
}
