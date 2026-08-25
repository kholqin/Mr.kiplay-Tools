import { describe, expect, it } from "vitest";
import { moduleCatalog, osintModuleCatalog } from "../core/modules/catalog";

describe("katalog 19 modul OSINT", () => {
  it("memiliki 19 modul OSINT unik", () => {
    expect(osintModuleCatalog).toHaveLength(19);
    expect(new Set(osintModuleCatalog.map((module) => module.id)).size).toBe(19);
    expect(osintModuleCatalog.every((module) => module.group === "intelligence")).toBe(true);
  });

  it("menetapkan mode preview dan validasi manual pada setiap modul", () => {
    expect(osintModuleCatalog.every((module) => module.previewOnly === true)).toBe(true);
    expect(osintModuleCatalog.every((module) => module.active === false)).toBe(true);
    expect(osintModuleCatalog.every((module) => module.manualValidationRequired === true)).toBe(true);
    expect(osintModuleCatalog.every((module) => Boolean(module.safetyNote))).toBe(true);
  });

  it("tidak menghapus katalog legacy recon dan assessment", () => {
    expect(moduleCatalog.some((module) => module.id === "recon.dns")).toBe(true);
    expect(moduleCatalog.some((module) => module.id === "assessment.headers")).toBe(true);
  });
});
