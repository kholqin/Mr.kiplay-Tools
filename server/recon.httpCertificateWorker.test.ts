import { describe, expect, it, vi } from "vitest";

const lookup = vi.hoisted(() => vi.fn(async () => [{ address: "93.184.216.34", family: 4 }]));
vi.mock("node:dns", () => ({ promises: { lookup } }));

import { fingerprintHttp, resetHttpRateLimiterForTests } from "../core/recon/httpFingerprint";
import { inventoryCertificate } from "../core/recon/certificateInventory";
import { IsolatedWorkerQueue } from "../core/worker/isolatedWorker";

describe("HTTP fingerprinting dan inventaris sertifikat", () => {
  it("menghasilkan preview HTTP tanpa request jaringan", async () => {
    const result = await fingerprintHttp("https://example.com/path#fragment", { preview: true });
    expect(result).toMatchObject({ mode: "preview", status: null, headers: {}, technologies: [] });
    expect(result.target).toBe("https://example.com/path");
  });

  it("membaca header terpilih melalui HEAD tanpa mengirim payload", async () => {
    const fetchMock = vi.fn(async () => new Response(null, { status: 200, headers: { server: "nginx", "x-powered-by": "Express", "x-frame-options": "DENY", "set-cookie": "private" } }));
    vi.stubGlobal("fetch", fetchMock);
    const result = await fingerprintHttp("https://example.com", { preview: false });
    expect(fetchMock).toHaveBeenCalledWith("https://example.com/", expect.objectContaining({ method: "HEAD", redirect: "manual" }));
    expect(result).toMatchObject({ mode: "passive", status: 200, technologies: ["Nginx", "Express"] });
    expect(result.headers).toEqual({ server: "nginx", "x-powered-by": "Express", "x-frame-options": "DENY" });
    vi.unstubAllGlobals();
    resetHttpRateLimiterForTests();
  });

  it("menerapkan jeda rate limit pada request HTTP aktif", async () => {
    const fetchMock = vi.fn(async () => new Response(null, { status: 204 }));
    vi.stubGlobal("fetch", fetchMock);
    resetHttpRateLimiterForTests();
    const first = fingerprintHttp("https://example.com", { preview: false, rateLimitPerSecond: 5 });
    const second = fingerprintHttp("https://example.com", { preview: false, rateLimitPerSecond: 5 });
    await new Promise((resolve) => setTimeout(resolve, 20));
    expect(fetchMock).toHaveBeenCalledTimes(1);
    await new Promise((resolve) => setTimeout(resolve, 220));
    await Promise.all([first, second]);
    expect(fetchMock).toHaveBeenCalledTimes(2);
    vi.unstubAllGlobals();
    resetHttpRateLimiterForTests();
  });

  it("menolak HTTP ke alamat loopback atau URL bercredential", async () => {
    await expect(fingerprintHttp("http://127.0.0.1", { preview: true })).rejects.toThrow();
    await expect(fingerprintHttp("https://user:password@example.com", { preview: true })).rejects.toThrow();
  });

  it("menghasilkan preview sertifikat hanya untuk HTTPS", async () => {
    const result = await inventoryCertificate("example.com", { preview: true });
    expect(result).toMatchObject({ mode: "preview", protocol: "https:", port: 443, subjectAltNames: [] });
    await expect(inventoryCertificate("http://example.com", { preview: true })).rejects.toThrow();
  });
});

describe("isolated worker queue", () => {
  it("memproses agregasi di worker terpisah dan membatasi payload", async () => {
    const queue = new IsolatedWorkerQueue();
    const job = queue.enqueue(42, "aggregatePortObservations", { rows: [{ state: "open" }, { state: "closed" }, { state: "open" }] }, 5000);
    for (let attempt = 0; attempt < 50; attempt += 1) {
      if (queue.getForWorkspace(job.id, 42)?.status === "completed") break;
      await new Promise((resolve) => setTimeout(resolve, 20));
    }
    const completed = queue.getForWorkspace(job.id, 42);
    expect(completed?.status).toBe("completed");
    expect(completed?.result).toEqual({ total: 3, byState: { open: 2, closed: 1 } });
  });

  it("mengisolasi status job antar workspace dan membatalkan antrean", () => {
    const queue = new IsolatedWorkerQueue();
    const first = queue.enqueue(1, "summarizeReconResults", { results: [] }, 5000);
    const second = queue.enqueue(2, "summarizeReconResults", { results: [] }, 5000);
    expect(queue.getForWorkspace(first.id, 2)).toBeNull();
    expect(queue.cancel(second.id)).toBe(true);
    expect(queue.getForWorkspace(second.id, 2)?.status).toBe("cancelled");
  });
});
