import { beforeEach, describe, expect, it, vi } from "vitest";

const { getDb, getWorkspace } = vi.hoisted(() => ({ getDb: vi.fn(), getWorkspace: vi.fn() }));
const drizzleMarkers = vi.hoisted(() => ({
  and: (...args: unknown[]) => ({ kind: "and", args }),
  asc: (column: unknown) => ({ kind: "asc", column }),
  count: () => ({ kind: "count" }),
  desc: (column: unknown) => ({ kind: "desc", column }),
  eq: (column: unknown, value: unknown) => ({ kind: "eq", column, value }),
  like: (column: unknown, value: unknown) => ({ kind: "like", column, value }),
}));

vi.mock("drizzle-orm", () => drizzleMarkers);
vi.mock("./db", () => ({ getDb }));
vi.mock("./assessmentDb", () => ({ getWorkspace }));

import { exportPortObservationsCsv, listPortObservationsPage } from "./portScanDb";

function createDb(results: unknown[]) {
  let index = 0;
  const calls = { where: 0, orderBy: 0, limits: [] as number[], offsets: [] as number[], whereArgs: [] as unknown[], orderArgs: [] as unknown[] };
  const db = {
    select: vi.fn(() => {
      const value = results[index++];
      const chain = {
        from: vi.fn(() => chain),
        where: vi.fn((condition: unknown) => { calls.where += 1; calls.whereArgs.push(condition); return chain; }),
        orderBy: vi.fn((order: unknown) => { calls.orderBy += 1; calls.orderArgs.push(order); return chain; }),
        limit: vi.fn((amount: number) => { calls.limits.push(amount); return chain; }),
        offset: vi.fn((amount: number) => { calls.offsets.push(amount); return chain; }),
        then: (resolve: (value: unknown) => unknown) => Promise.resolve(resolve(value)),
      };
      return chain;
    }),
  };
  return { db, calls };
}

describe("port server-side pagination", () => {
  beforeEach(() => {
    getWorkspace.mockResolvedValue({ id: 7, authorizationConfirmed: true });
    getDb.mockReset();
  });

  it("menggunakan count, filter, sort, limit, dan offset untuk halaman yang diminta", async () => {
    const { db, calls } = createDb([
      [{ total: 205 }],
      [{ id: 51, workspaceId: 7, host: "api.example.test", port: 443, state: "open", createdAt: new Date() }],
    ]);
    getDb.mockResolvedValue(db);

    const result = await listPortObservationsPage(11, {
      workspaceId: 7,
      page: 3,
      pageSize: 25,
      host: "api.example.test",
      state: "open",
      sortKey: "port",
      sortDirection: "asc",
    });

    expect(result).toMatchObject({ totalRows: 205, page: 3, pageSize: 25, totalPages: 9 });
    expect(result.rows).toHaveLength(1);
    expect(db.select).toHaveBeenCalledTimes(2);
    expect(calls.where).toBe(2);
    expect(calls.orderBy).toBe(1);
    expect(calls.limits).toEqual([25]);
    expect(calls.offsets).toEqual([50]);
    expect(calls.whereArgs[0]).toMatchObject({ kind: "and", args: expect.arrayContaining([expect.objectContaining({ kind: "like", value: "%api.example.test%" }), expect.objectContaining({ kind: "eq", value: "open" })]) });
    expect(calls.orderArgs[0]).toMatchObject({ kind: "asc" });
  });

  it("menghasilkan CSV server-side dari filter yang sama tanpa memakai halaman UI", async () => {
    const { db, calls } = createDb([[{ id: 1, workspaceId: 7, host: "api.example.test", port: 443, state: "open", createdAt: new Date("2026-01-01T00:00:00.000Z") }, { id: 2, workspaceId: 7, host: "admin.example.test", port: 8443, state: "open", createdAt: new Date("2026-01-02T00:00:00.000Z") }]]);
    getDb.mockResolvedValue(db);

    const csv = await exportPortObservationsCsv(11, {
      workspaceId: 7,
      host: "api.example.test",
      state: "open",
      sortKey: "createdAt",
      sortDirection: "desc",
    });

    expect(csv).toContain("Host,Port,Status,Waktu");
    expect(csv).toContain("api.example.test,443,open");
    expect(csv).toContain("admin.example.test,8443,open");
    expect(db.select).toHaveBeenCalledTimes(1);
    expect(calls.where).toBe(1);
    expect(calls.orderBy).toBe(1);
    expect(calls.limits).toEqual([10000]);
    expect(calls.offsets).toEqual([]);
    expect(calls.whereArgs[0]).toMatchObject({ kind: "and", args: expect.arrayContaining([expect.objectContaining({ kind: "like", value: "%api.example.test%" }), expect.objectContaining({ kind: "eq", value: "open" })]) });
  });
});
