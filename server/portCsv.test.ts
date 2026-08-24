import { describe, expect, it } from "vitest";
import { escapeCsvCell, portRowsToCsv } from "../shared/portCsv";

describe("port CSV export", () => {
  it("escapes commas, quotes, and line breaks", () => {
    expect(escapeCsvCell('host,"uji"')).toBe('"host,""uji"""');
  });

  it("neutralizes spreadsheet formula prefixes", () => {
    expect(escapeCsvCell("=1+1")).toBe("'=1+1");
    expect(escapeCsvCell("@cmd")).toBe("'@cmd");
  });

  it("generates a readable CSV envelope", () => {
    const csv = portRowsToCsv([{ host: "api.example.com", port: 443, state: "open", createdAt: "2026-08-24T00:00:00.000Z" }]);
    expect(csv).toContain("Host,Port,Status,Waktu");
    expect(csv).toContain("api.example.com,443,open");
  });
});
