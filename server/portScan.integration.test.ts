import { describe, expect, it } from "vitest";
import { assertReconAuthorization } from "../shared/assessmentPolicy";
import { createPortScanPlan } from "../core/recon/portScan";

describe("subdomain to port scan integration", () => {
  it("plans bounded port checks from stored discovered hosts", () => {
    const storedSubdomains = ["api.example.com", "api.example.com", "dev.example.com"];
    const plan = createPortScanPlan(storedSubdomains, { ports: [80, 443], preview: true });
    expect(plan.hosts).toEqual(["api.example.com", "dev.example.com"]);
    expect(plan.ports).toEqual([80, 443]);
    expect(plan.mode).toBe("preview");
  });

  it("requires authorization and at least one stored host", () => {
    expect(() => assertReconAuthorization(0, 1)).toThrow("Otorisasi");
    expect(() => assertReconAuthorization(1, 0)).toThrow("hasil recon");
    expect(assertReconAuthorization(1, 2)).toBe(true);
  });
});
