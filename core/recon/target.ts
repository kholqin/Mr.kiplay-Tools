import { promises as dns } from "node:dns";
import { isIP } from "node:net";
import { isSensitiveTarget, validateTargetForScope } from "../../shared/assessmentPolicy";

export function parsePublicReconUrl(target: string, protocols: Array<"http:" | "https:"> = ["http:", "https:"]) {
  const raw = target.trim();
  const candidate = /^[a-z][a-z\d+.-]*:\/\//i.test(raw) ? raw : `https://${raw}`;
  let url: URL;
  try {
    url = new URL(candidate);
  } catch {
    throw new Error("Target harus berupa URL yang valid");
  }

  if (!protocols.includes(url.protocol as "http:" | "https:")) {
    throw new Error("Protokol target tidak didukung");
  }
  if (url.username || url.password) {
    throw new Error("URL dengan username atau password tidak diizinkan");
  }

  const validation = validateTargetForScope(url.hostname);
  if (!validation.ok || isSensitiveTarget(url.hostname)) {
    throw new Error(validation.ok ? "Target termasuk jaringan sensitif atau endpoint metadata" : validation.reason);
  }

  url.hash = "";
  return url;
}

export function isSensitiveAddress(address: string) {
  const normalized = address.toLowerCase();
  if (isSensitiveTarget(normalized)) return true;
  if (isIP(normalized) === 6) {
    return normalized === "::" || normalized === "::1" || normalized.startsWith("fc") || normalized.startsWith("fd") || normalized.startsWith("fe80:");
  }
  return false;
}

export async function assertPublicResolution(hostname: string, timeoutMs = 5000) {
  const lookup = dns.lookup(hostname, { all: true, verbatim: true });
  const addresses = await Promise.race([
    lookup,
    new Promise<never>((_, reject) => setTimeout(() => reject(new Error("DNS preflight timeout")), timeoutMs)),
  ]);
  if (!addresses.length || addresses.some(({ address }) => isSensitiveAddress(address))) {
    throw new Error("Target mengarah ke jaringan sensitif atau alamat non-publik");
  }
  return addresses.map(({ address }) => address);
}

export function clampReconTimeout(timeoutMs = 5000) {
  return Math.min(Math.max(Math.trunc(timeoutMs), 1000), 15000);
}

export function sanitizeReconText(value: unknown, maxLength = 200) {
  return String(value ?? "").replace(/[\u0000-\u001f\u007f]/g, " ").replace(/\s+/g, " ").trim().slice(0, maxLength);
}
