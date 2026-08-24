import { describe, expect, it } from "vitest";
import { deduplicateFindings } from "../shared/reporting";

describe("finding deduplication", () => {
  it("keeps the first finding for each fingerprint", () => {
    const result = deduplicateFindings([{ fingerprint: "a", title: "Pertama" }, { fingerprint: "a", title: "Duplikat" }, { fingerprint: "b", title: "Kedua" }]);
    expect(result.map((item) => item.title)).toEqual(["Pertama", "Kedua"]);
  });
});
