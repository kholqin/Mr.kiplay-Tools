import { describe, expect, it } from "vitest";
import { safeOsintErrorMessage } from "../client/src/components/OsintFeedback";

describe("feedback UX OSINT", () => {
  it("memetakan error teknis ke instruksi aman tanpa membocorkan detail", () => {
    expect(safeOsintErrorMessage(new Error("Authorization failed for secret-token=abc"))).toContain("otorisasi");
    expect(safeOsintErrorMessage(new Error("socket timeout at 10.0.0.1:443"))).toContain("batas waktu");
    expect(safeOsintErrorMessage(new Error("unexpected stack / private/path"))).toBe("Modul belum dapat menyelesaikan permintaan. Periksa konfigurasi lalu coba lagi.");
    expect(safeOsintErrorMessage(new Error("secret-token=abc"))).not.toContain("abc");
  });
});
