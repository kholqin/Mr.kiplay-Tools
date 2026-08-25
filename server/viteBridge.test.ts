import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const source = readFileSync(new URL("./_core/vite.ts", import.meta.url), "utf8");

describe("Vite bridge Express 5 contract", () => {
  it("menggunakan middleware catch-all tanpa wildcard anonim", () => {
    expect(source).toContain("app.use(async (req, res, next) => {");
    expect(source).toContain("app.use((_req, res) => {");
    expect(source).not.toContain('app.use("*"');
  });
});
