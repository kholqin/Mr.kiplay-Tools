import { describe, expect, it } from "vitest";
import { sanitizeForAi } from "./aiInsight";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

describe("AI insight safety contract", () => {
  it("menghapus credential, data personal, dan meredaksi pola token", () => {
    const result = sanitizeForAi({ password: "rahasia", email: "operator@example.test", headers: { authorization: "Bearer abc123", server: "nginx" }, note: "token sk-abcdefghijklmnop disamarkan" }) as Record<string, unknown>;
    expect(result.password).toBeUndefined();
    expect(result.email).toBeUndefined();
    expect(result.headers).toEqual({ server: "nginx" });
    expect(result.note).toBe("[DIREDAKSI]");
  });

  it("membatasi kedalaman dan jumlah data agar payload AI bounded", () => {
    const result = sanitizeForAi({ rows: Array.from({ length: 100 }, (_, index) => ({ index })) }) as { rows: unknown[] };
    expect(result.rows).toHaveLength(50);
    const page = readFileSync(resolve(process.cwd(), "client/src/pages/Settings.tsx"), "utf8");
    const hook = readFileSync(resolve(process.cwd(), "client/src/hooks/useAnimationPreference.ts"), "utf8");
    expect(page).toContain("Penuh");
    expect(page).toContain("Ringan");
    expect(page).toContain("Mati");
    expect(hook).toContain("localStorage");
  });
});
