import { describe, expect, it, vi, afterEach } from "vitest";
import { promises as dns } from "node:dns";
import { runLiveOsint } from "../core/recon/liveOsint";

afterEach(() => { vi.unstubAllGlobals(); vi.restoreAllMocks(); });

describe("live OSINT non-destruktif", () => {
  it("mengambil metadata RDAP publik dan membatasi field output", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response(JSON.stringify({ ldhName: "example.test", status: ["active"], events: [{ eventAction: "registration", eventDate: "2026-01-01" }], nameservers: [{ ldhName: "ns1.example.test" }], entities: [{ vcardArray: ["rahasia"] }] }), { status: 200, headers: { "content-type": "application/json" } })));
    const result = await runLiveOsint("rdap-domain", "https://example.test");
    expect(result.module).toBe("rdap-domain");
    expect(result.data).toMatchObject({ ldhName: "example.test", status: ["active"], nameservers: ["ns1.example.test"] });
    expect(JSON.stringify(result.data)).not.toContain("rahasia");
  });

  it("menolak target privat sebelum request aktif", async () => {
    await expect(runLiveOsint("robots-sitemap", "http://127.0.0.1")).rejects.toThrow(/sensitif|publik|valid/i);
  });

  it("membatasi chain redirect maksimal lima hop", async () => {
    vi.spyOn(dns, "lookup").mockResolvedValue([{ address: "93.184.216.34", family: 4 }] as never);
    vi.stubGlobal("fetch", vi.fn().mockImplementation(async () => new Response(null, { status: 302, headers: { location: "https://example.test/next" } })));
    const result = await runLiveOsint("redirect-chain", "https://example.test");
    expect((result.data as { hops: unknown[] }).hops.length).toBeLessThanOrEqual(5);
  });
});
