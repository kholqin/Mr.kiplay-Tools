import { describe, expect, it } from "vitest";
import { filterPortRows } from "../shared/portFilters";

describe("port table filters", () => {
  const rows = [
    { host: "api.example.com", state: "open" },
    { host: "api.example.com", state: "closed" },
    { host: "dev.example.com", state: "open" },
  ];

  it("filters by host case-insensitively", () => {
    expect(filterPortRows(rows, "API", "all")).toHaveLength(2);
  });

  it("filters by status and combines both filters", () => {
    expect(filterPortRows(rows, "api", "open")).toEqual([{ host: "api.example.com", state: "open" }]);
    expect(filterPortRows(rows, "", "closed")).toHaveLength(1);
  });
});
