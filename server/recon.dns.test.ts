import { describe, expect, it } from "vitest";
import { collectDnsRecords, discoverSubdomains, getRateDelayMs, withTimeout } from "../core/recon/dns";

describe("active DNS recon guardrails", () => {
  it("does not send DNS queries in preview mode", async () => {
    const result = await collectDnsRecords("https://Example.com/", { preview: true });
    expect(result.target).toBe("example.com");
    expect(result.mode).toBe("preview");
    expect(result.records).toEqual({});
  });

  it("deduplicates and limits preview subdomain candidates", async () => {
    const result = await discoverSubdomains("example.com", ["WWW", "www", "api", "bad label"], { preview: true });
    expect(result.map((item) => item.subdomain)).toEqual(["www.example.com", "api.example.com"]);
  });

  it("enforces a conservative DNS rate delay", () => {
    expect(getRateDelayMs(2)).toBe(500);
    expect(getRateDelayMs(100)).toBe(100);
    expect(getRateDelayMs(0)).toBe(1000);
  });

  it("rejects a promise when the timeout is exceeded", async () => {
    await expect(withTimeout(new Promise((resolve) => setTimeout(resolve, 20)), 1)).rejects.toThrow("DNS timeout");
  });

  it("rejects private or malformed domains", async () => {
    await expect(collectDnsRecords("127.0.0.1", { preview: true })).rejects.toThrow();
    await expect(collectDnsRecords("not-a-domain", { preview: true })).rejects.toThrow();
  });
});
