import { isSensitiveTarget, normalizeTarget } from "../../shared/assessmentPolicy";

export type PipelineTarget = { value: string; type: "domain" | "url" | "ip" | "cidr" };
export type PipelineConfig = { dryRun: boolean; rateLimit: number; timeoutSeconds: number; maxTargets: number; excludedTags: string[] };

export const defaultPipelineConfig: PipelineConfig = {
  dryRun: true,
  rateLimit: 25,
  timeoutSeconds: 180,
  maxTargets: 32,
  excludedTags: ["dos", "fuzz", "brute-force", "intrusive"],
};

export function createPipelinePlan(targets: PipelineTarget[], config = defaultPipelineConfig) {
  const normalized = targets.map((target) => ({ ...target, value: normalizeTarget(target.value) }));
  if (normalized.length === 0) throw new Error("Pipeline membutuhkan minimal satu target dalam scope");
  if (normalized.length > config.maxTargets) throw new Error("Jumlah target melebihi batas profil scan");
  const blocked = normalized.find((target) => isSensitiveTarget(target.value));
  if (blocked) throw new Error(`Target sensitif ditolak: ${blocked.value}`);
  if (config.rateLimit < 1 || config.rateLimit > 100) throw new Error("Rate limit harus berada di antara 1 dan 100");
  if (config.timeoutSeconds < 30 || config.timeoutSeconds > 1800) throw new Error("Timeout berada di luar rentang aman");

  return {
    mode: config.dryRun ? "preview" as const : "safe" as const,
    stages: [
      { id: "nmap-discovery", tool: "nmap", targets: normalized, timeoutSeconds: config.timeoutSeconds, rateLimit: config.rateLimit },
      { id: "nuclei-baseline", tool: "nuclei", dependsOn: "nmap-discovery", excludedTags: config.excludedTags, manualValidationRequired: true },
    ],
    safety: { noExploit: true, noOobCallbacks: true, scopeEnforced: true },
  };
}
