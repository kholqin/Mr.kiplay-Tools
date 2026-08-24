import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const installer = readFileSync(new URL("../scripts/install/install.ps1", import.meta.url), "utf8");

describe("Windows PowerShell installer contract", () => {
  it("menyediakan help mode sebelum langkah bootstrap", () => {
    expect(installer).toContain("[switch]$Help");
    expect(installer).toContain("Penggunaan:");
    expect(installer).toContain("exit 0");
    expect(installer.indexOf("if ($Help)")).toBeLessThan(installer.indexOf("pnpm install"));
  });

  it("menyediakan progress feedback interaktif dan marker CI", () => {
    expect(installer).toContain("Write-Progress");
    expect(installer).toContain("$isCi = $env:CI -eq \"true\"");
    expect(installer).toContain("[CI] [$Percent%]");
    expect(installer).toContain("-Completed");
    expect(installer.indexOf("Update-InstallProgress -Status \"Memeriksa Node.js LTS\""))
      .toBeLessThan(installer.indexOf("pnpm install"));
  });

  it("CI memeriksa parser PowerShell dan help mode", () => {
    const workflow = readFileSync(new URL("../.github/workflows/ci.yml", import.meta.url), "utf8");
    expect(workflow).toContain("runs-on: windows-latest");
    expect(workflow).toContain("Verify PowerShell installer help mode");
    expect(workflow).toContain("Parse PowerShell installer");
    expect(workflow).toContain("./scripts/install/install.ps1");
  });
});
