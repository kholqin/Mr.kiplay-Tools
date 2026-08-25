import { describe, expect, it } from "vitest";
import { parseLocalFile } from "./OfflineOsintPanel";

describe("parseLocalFile", () => {
  it("membaca JSON array dan membatasi hasil", () => {
    const rows = parseLocalFile(JSON.stringify([{ domain: "example.test" }]), "snapshot.json");
    expect(rows).toEqual([{ domain: "example.test" }]);
  });

  it("membaca CSV sederhana dan membatasi maksimal 1000 baris", () => {
    const rows = parseLocalFile(["a,1,2026-01-01", "b,2,2026-01-02"].join("\n"), "breach.csv");
    expect(rows).toHaveLength(2);
    expect(rows[0]).toEqual({ kind: "a", value: "1", observedAt: "2026-01-01" });
  });
});
