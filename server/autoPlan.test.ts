import { describe, expect, it } from "vitest";
import { createSafeAutoReconPlan } from "../core/recon/autoPlan";

describe("safe auto recon plan", () => {
  it("membuat tahapan bounded untuk target allowlist berizin", () => {
    const plan = createSafeAutoReconPlan({ target: "https://example.com/path#fragment", authorizationConfirmed: true, allowlisted: true });
    expect(plan.target).toBe("https://example.com/path");
    expect(plan.stages).toEqual(["dns", "http", "certificate", "osint", "ports"]);
    expect(plan.maxHosts).toBe(100);
    expect(plan.maxPorts).toBe(32);
    expect(plan.manualValidationRequired).toBe(true);
  });

  it("menolak otorisasi atau allowlist yang belum lengkap", () => {
    expect(() => createSafeAutoReconPlan({ target: "example.com", authorizationConfirmed: false, allowlisted: true })).toThrow("Otorisasi");
    expect(() => createSafeAutoReconPlan({ target: "example.com", authorizationConfirmed: true, allowlisted: false })).toThrow("allowlist");
  });
});
