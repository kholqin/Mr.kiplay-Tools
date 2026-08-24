import { afterEach, describe, expect, it, vi } from "vitest";
import { clearReconCache, getCached, getReconCacheStats, setCached, validateResolver } from "../core/recon/dnsCache";

afterEach(() => { clearReconCache(); vi.useRealTimers(); });

describe("DNS cache", () => {
  it("returns a cached value before TTL expiry", () => {
    setCached("dns:system:example.com", { A: ["203.0.113.10"] }, 60);
    expect(getCached("dns:system:example.com")).toEqual({ A: ["203.0.113.10"] });
    expect(getCached("dns:1.1.1.1:example.com")).toBeUndefined();
  });

  it("expires values and remains bounded", () => {
    vi.useFakeTimers();
    setCached("dns:system:example.com", { A: [] }, 5);
    vi.advanceTimersByTime(5001);
    expect(getCached("dns:system:example.com")).toBeUndefined();
    expect(getReconCacheStats().maxEntries).toBe(256);
  });

  it("accepts system or public IP resolver only", () => {
    expect(validateResolver()).toBe("system");
    expect(validateResolver("1.1.1.1")).toBe("1.1.1.1");
    expect(() => validateResolver("127.0.0.1")).toThrow();
    expect(() => validateResolver("resolver.internal")).toThrow();
  });
});
