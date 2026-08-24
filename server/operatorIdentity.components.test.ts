import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const homeSource = readFileSync(resolve(process.cwd(), "client/src/pages/Home.tsx"), "utf8");
const layoutSource = readFileSync(resolve(process.cwd(), "client/src/components/DashboardLayout.tsx"), "utf8");

describe("komponen UI identitas operasional", () => {
  it("Home merender greeting generik dari konstanta operasional", () => {
    expect(homeSource).toContain("OPERATOR_IDENTITY.greeting");
    expect(homeSource).not.toContain("user?.name");
    expect(homeSource).not.toContain("user?.email");
  });

  it("DashboardLayout merender avatar dan label generik tanpa data akun", () => {
    expect(layoutSource).toContain("OPERATOR_IDENTITY.avatar");
    expect(layoutSource).toContain("OPERATOR_IDENTITY.label");
    expect(layoutSource).toContain("OPERATOR_IDENTITY.session");
    expect(layoutSource).not.toContain("user?.name");
    expect(layoutSource).not.toContain("user?.email");
  });
});
