import { describe, expect, it } from "vitest";
import { moduleCatalog, osintModuleCatalog } from "../core/modules/catalog";

describe("katalog 19 modul OSINT", () => {
  it("memiliki 19 modul OSINT unik", () => {
    expect(osintModuleCatalog).toHaveLength(19);
    expect(new Set(osintModuleCatalog.map((module) => module.id)).size).toBe(19);
    expect(osintModuleCatalog.every((module) => module.group === "intelligence")).toBe(true);
  });

  it("membedakan modul live dan provider-gated dengan guardrail manual", () => {
    const liveIds = new Set(["osint.rdap-domain", "osint.ct-inventory", "osint.robots-sitemap", "osint.favicon-hash", "osint.email-security", "osint.mx-infrastructure", "osint.nameserver-infrastructure", "osint.redirect-chain", "osint.archive-metadata", "osint.public-repository-metadata"]);
    expect(osintModuleCatalog.filter((module) => module.active)).toHaveLength(liveIds.size);
    expect(osintModuleCatalog.filter((module) => module.active).every((module) => liveIds.has(module.id) && module.previewOnly !== true)).toBe(true);
    expect(osintModuleCatalog.filter((module) => !module.active).every((module) => module.previewOnly === true)).toBe(true);
    expect(osintModuleCatalog.every((module) => module.manualValidationRequired === true)).toBe(true);
    expect(osintModuleCatalog.every((module) => Boolean(module.safetyNote))).toBe(true);
  });

  it("tidak menghapus katalog legacy recon dan assessment", () => {
    expect(moduleCatalog.some((module) => module.id === "recon.dns")).toBe(true);
    expect(moduleCatalog.some((module) => module.id === "assessment.headers")).toBe(true);
  });
});
