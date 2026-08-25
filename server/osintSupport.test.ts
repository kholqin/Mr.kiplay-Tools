import { describe, expect, it } from "vitest";
import { buildAssetRelations, normalizeIoc, osintSummaryCsv, scoreOsintRisk, summarizeTimeline } from "../shared/osintSupport";

describe("helper pendukung OSINT", () => {
  it("menolak nilai rahasia dan IP privat", () => {
    expect(normalizeIoc({ kind: "ip", value: "192.168.1.10", source: "uji", confidence: 90 })).toBeNull();
    expect(normalizeIoc({ kind: "domain", value: "secret-token", source: "uji", confidence: 90 })).toBeNull();
  });

  it("menormalisasi IOC dan membangun relasi domain ke IP publik", () => {
    const relations = buildAssetRelations([
      { kind: "domain", value: "Example.COM", source: "rdap", confidence: 90 },
      { kind: "ip", value: "203.0.113.5", source: "dns", confidence: 80 },
    ]);
    expect(relations).toEqual([{ from: "example.com", to: "203.0.113.5", relation: "resolves-to", confidence: 80 }]);
  });

  it("menghitung skor bounded dan timeline terbaru lebih dahulu", () => {
    expect(scoreOsintRisk({ exposure: 100, confidence: 100, freshnessHours: 0, manualValidated: true })).toBe(100);
    expect(summarizeTimeline([
      { id: "lama", observedAt: 1, moduleId: "osint.rdap-domain", summary: "a", source: "rdap" },
      { id: "baru", observedAt: 2, moduleId: "osint.rdap-domain", summary: "b", source: "rdap" },
    ])[0].id).toBe("baru");
  });

  it("menghasilkan CSV dengan batas baris dan escaping", () => {
    expect(osintSummaryCsv([{ module: "RDAP", asset: 'example.com,prod', status: 'OK', confidence: 90 }])).toContain('"example.com,prod"');
  });
});
