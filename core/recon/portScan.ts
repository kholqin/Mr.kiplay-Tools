import { createConnection } from "node:net";
import { isSensitiveTarget, normalizeTarget, validateTargetForScope } from "../../shared/assessmentPolicy";
import { getRateDelayMs } from "./dns";

export type PortScanOptions = { ports?: number[]; timeoutMs?: number; rateLimitPerSecond?: number; preview?: boolean; maxHosts?: number };
export type PortScanPlan = { hosts: string[]; ports: number[]; mode: "preview" | "active"; timeoutMs: number; rateLimitPerSecond: number; warnings: string[] };
export type PortObservation = { host: string; port: number; state: "open" | "closed" | "timeout" | "error" };

const DEFAULT_PORTS = [21, 22, 25, 53, 80, 110, 143, 443, 445, 587, 993, 995, 3306, 5432, 6379, 8080, 8443];

export function normalizePorts(ports = DEFAULT_PORTS) {
  const unique = Array.from(new Set(ports.filter((port) => Number.isInteger(port) && port >= 1 && port <= 65535)));
  if (!unique.length || unique.length > 32) throw new Error("Daftar port harus berisi 1–32 port valid");
  return unique;
}

export function validateSubdomainHosts(hosts: string[], maxHosts = 100) {
  const valid = Array.from(new Set(hosts.map((host) => normalizeTarget(host).split("/")[0]).filter((host) => host && !isSensitiveTarget(host) && /^[a-z0-9](?:[a-z0-9.-]{0,251}[a-z0-9])?$/i.test(host)))).slice(0, Math.min(Math.max(maxHosts, 1), 100));
  if (!valid.length) throw new Error("Tidak ada subdomain valid dalam scope");
  return valid;
}

export function createPortScanPlan(hosts: string[], options: PortScanOptions = {}): PortScanPlan {
  const validatedHosts = validateSubdomainHosts(hosts, options.maxHosts);
  const ports = normalizePorts(options.ports);
  const timeoutMs = Math.min(Math.max(options.timeoutMs ?? 3000, 500), 10000);
  const rateLimitPerSecond = Math.min(Math.max(options.rateLimitPerSecond ?? 2, 1), 10);
  return { hosts: validatedHosts, ports, mode: options.preview ? "preview" : "active", timeoutMs, rateLimitPerSecond, warnings: ["Port terbuka adalah observasi sementara dan wajib divalidasi manual.", "Pemindaian hanya boleh dilakukan pada subdomain yang berasal dari scope terotorisasi."] };
}

function probe(host: string, port: number, timeoutMs: number): Promise<PortObservation> {
  return new Promise((resolve) => {
    const socket = createConnection({ host, port });
    let settled = false;
    const finish = (state: PortObservation["state"]) => { if (settled) return; settled = true; socket.destroy(); resolve({ host, port, state }); };
    socket.setTimeout(timeoutMs, () => finish("timeout"));
    socket.once("connect", () => finish("open"));
    socket.once("error", (error: NodeJS.ErrnoException) => finish(error.code === "ECONNREFUSED" ? "closed" : "error"));
  });
}

export async function scanOpenPorts(hosts: string[], options: PortScanOptions = {}): Promise<{ plan: PortScanPlan; observations: PortObservation[] }> {
  const plan = createPortScanPlan(hosts, options);
  if (plan.mode === "preview") return { plan, observations: [] };
  const observations: PortObservation[] = [];
  const delayMs = getRateDelayMs(plan.rateLimitPerSecond);
  for (const host of plan.hosts) for (const port of plan.ports) { observations.push(await probe(host, port, plan.timeoutMs)); await new Promise((resolve) => setTimeout(resolve, delayMs)); }
  return { plan, observations };
}
