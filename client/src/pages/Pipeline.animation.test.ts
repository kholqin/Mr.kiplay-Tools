import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

describe("animasi timeline pipeline", () => {
  it("menggunakan transisi perubahan status dan menghormati reduced motion", () => {
    const page = readFileSync(resolve(process.cwd(), "client/src/pages/Pipeline.tsx"), "utf8");
    const styles = readFileSync(resolve(process.cwd(), "client/src/index.css"), "utf8");
    expect(page).toContain("timeline-stage-changed");
    expect(page).toContain("transition-[background-color,border-color,box-shadow,transform]");
    expect(styles).toContain("@media (prefers-reduced-motion: no-preference)");
    expect(styles).toContain("@media (prefers-reduced-motion: reduce)");
    expect(styles).toContain("timeline-stage-change");
  });
});
