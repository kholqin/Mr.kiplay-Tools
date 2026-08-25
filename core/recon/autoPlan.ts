import { parsePublicReconUrl } from "./target";

export type AutoReconPlan = {
  target: string;
  stages: Array<"dns" | "http" | "certificate" | "osint" | "ports">;
  maxHosts: number;
  maxPorts: number;
  manualValidationRequired: true;
};

export function createSafeAutoReconPlan(input: { target: string; authorizationConfirmed: boolean; allowlisted: boolean }): AutoReconPlan {
  if (!input.authorizationConfirmed) throw new Error("Otorisasi workspace belum dikonfirmasi");
  if (!input.allowlisted) throw new Error("Target belum masuk allowlist workspace");
  const target = parsePublicReconUrl(input.target).toString();
  return { target, stages: ["dns", "http", "certificate", "osint", "ports"], maxHosts: 100, maxPorts: 32, manualValidationRequired: true };
}
