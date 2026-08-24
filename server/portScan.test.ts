import { describe, expect, it } from "vitest";
import { createPortScanPlan, normalizePorts, validateSubdomainHosts } from "../core/recon/portScan";

describe("subdomain to port scan", () => {
  it("normalizes and deduplicates allowed ports", () => {
    expect(normalizePorts([443, 80, 443, 70000])).toEqual([443, 80]);
  });

  it("creates a preview plan from discovered subdomains", () => {
    const plan = createPortScanPlan(["api.example.com", "api.example.com", "dev.example.com"], { ports: [80, 443], preview: true });
    expect(plan.hosts).toEqual(["api.example.com", "dev.example.com"]);
    expect(plan.mode).toBe("preview");
  });

  it("rejects sensitive hosts and caps the target list", () => {
    expect(() => validateSubdomainHosts(["127.0.0.1"])).toThrow();
    expect(validateSubdomainHosts(Array.from({ length: 120 }, (_, index) => `host${index}.example.com`))).toHaveLength(100);
  });
});
