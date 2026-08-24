import { assertPublicResolution, clampReconTimeout, parsePublicReconUrl, sanitizeReconText } from "./target";

export type HttpFingerprintOptions = {
  preview?: boolean;
  timeoutMs?: number;
  rateLimitPerSecond?: number;
};

export type HttpFingerprintResult = {
  target: string;
  mode: "preview" | "passive";
  status: number | null;
  headers: Record<string, string>;
  technologies: string[];
  redirectedTo: string | null;
  observedAt: string;
  warnings: string[];
};

let nextHttpSlotAt = 0;

export function getHttpRateDelayMs(rateLimitPerSecond = 1) {
  return Math.ceil(1000 / Math.min(Math.max(Math.trunc(rateLimitPerSecond), 1), 5));
}

export function resetHttpRateLimiterForTests() {
  nextHttpSlotAt = 0;
}

async function waitForHttpRateLimit(rateLimitPerSecond = 1) {
  const intervalMs = getHttpRateDelayMs(rateLimitPerSecond);
  const now = Date.now();
  const waitMs = Math.max(0, nextHttpSlotAt - now);
  nextHttpSlotAt = Math.max(now, nextHttpSlotAt) + intervalMs;
  if (waitMs) await new Promise((resolve) => setTimeout(resolve, waitMs));
}

const OBSERVED_HEADERS = [
  "server",
  "x-powered-by",
  "content-type",
  "content-length",
  "strict-transport-security",
  "content-security-policy",
  "x-frame-options",
  "x-content-type-options",
  "referrer-policy",
  "permissions-policy",
  "cache-control",
  "location",
  "via",
] as const;

function inferTechnologies(headers: Record<string, string>) {
  const signal = Object.values(headers).join(" ").toLowerCase();
  const matches: Array<[string, RegExp]> = [
    ["Cloudflare", /cloudflare/],
    ["Nginx", /nginx/],
    ["Apache", /apache/],
    ["Express", /express/],
    ["Next.js", /next\.js|x-nextjs/],
    ["WordPress", /wordpress|wp-/],
  ];
  return matches.filter(([, pattern]) => pattern.test(signal)).map(([label]) => label);
}

export async function fingerprintHttp(target: string, options: HttpFingerprintOptions = {}): Promise<HttpFingerprintResult> {
  const url = parsePublicReconUrl(target);
  const normalizedTarget = url.toString();
  const observedAt = new Date().toISOString();
  if (options.preview) {
    return {
      target: normalizedTarget,
      mode: "preview",
      status: null,
      headers: {},
      technologies: [],
      redirectedTo: null,
      observedAt,
      warnings: ["Pratinjau: tidak ada request HTTP dikirim."],
    };
  }

  const timeoutMs = clampReconTimeout(options.timeoutMs);
  await assertPublicResolution(url.hostname, timeoutMs);
  await waitForHttpRateLimit(options.rateLimitPerSecond);
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(normalizedTarget, {
      method: "HEAD",
      redirect: "manual",
      signal: controller.signal,
      headers: { "user-agent": "MrKiplay-Authorized-Assessment/1.0" },
    });
    const headers: Record<string, string> = {};
    for (const name of OBSERVED_HEADERS) {
      const value = response.headers.get(name);
      if (value) headers[name] = sanitizeReconText(value);
    }
    return {
      target: normalizedTarget,
      mode: "passive",
      status: response.status,
      headers,
      technologies: inferTechnologies(headers),
      redirectedTo: headers.location ? sanitizeReconText(headers.location, 500) : null,
      observedAt,
      warnings: ["Fingerprint hanya membaca metadata respons HEAD; sinyal teknologi tidak dianggap bukti final."],
    };
  } catch (error) {
    const message = error instanceof Error && error.name === "AbortError" ? "HTTP timeout" : "HTTP request gagal";
    throw new Error(message);
  } finally {
    clearTimeout(timer);
  }
}
