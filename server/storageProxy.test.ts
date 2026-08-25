import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const source = readFileSync(new URL("./_core/storageProxy.ts", import.meta.url), "utf8");

describe("storage proxy Express 5 contract", () => {
  it("menggunakan named wildcard yang valid pada Express 5", () => {
    expect(source).toContain('app.get("/manus-storage/*splat"');
    expect(source).not.toContain('app.get("/manus-storage/*",');
  });

  it("mendukung wildcard string atau array tanpa mengubah key storage", () => {
    expect(source).toContain("const rawKey =");
    expect(source).toContain("Array.isArray(rawKey) ? rawKey.join(\"/\") : rawKey");
  });
});
