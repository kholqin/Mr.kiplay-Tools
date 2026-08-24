import { describe, expect, it } from "vitest";
import { paginatePortRows, sortPortRows } from "../shared/portFilters";

describe("port sorting and pagination", () => {
  const rows = [
    { host: "z.example.com", port: 443, state: "open", createdAt: "2026-08-24T00:00:00.000Z" },
    { host: "api.example.com", port: 80, state: "closed", createdAt: "2026-08-25T00:00:00.000Z" },
    { host: "api.example.com", port: 443, state: "open", createdAt: "2026-08-26T00:00:00.000Z" },
  ];

  it("sorts hosts and ports without mutating input", () => {
    expect(sortPortRows(rows, "host", "asc").map((row) => row.host)).toEqual(["api.example.com", "api.example.com", "z.example.com"]);
    expect(sortPortRows(rows, "port", "asc").map((row) => row.port)).toEqual([80, 443, 443]);
    expect(rows[0]?.host).toBe("z.example.com");
  });

  it("returns bounded pages and clamps invalid page values", () => {
    expect(paginatePortRows(rows, 2, 2)).toMatchObject({ currentPage: 2, totalPages: 2, totalRows: 3 });
    expect(paginatePortRows(rows, 99, 2).currentPage).toBe(2);
    expect(paginatePortRows(rows, 0, 0).pageSize).toBe(1);
  });
});
