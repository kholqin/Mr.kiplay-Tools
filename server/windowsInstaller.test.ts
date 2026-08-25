import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const installerUrl = new URL("../scripts/install/install.ps1", import.meta.url);
const installerPath = fileURLToPath(installerUrl);
const installer = readFileSync(installerUrl, "utf8");
const canRunPowerShell = (() => {
  try {
    execFileSync("pwsh", ["-NoLogo", "-NoProfile", "-Command", "$PSVersionTable.PSVersion.Major"], {
      stdio: "ignore",
    });
    return true;
  } catch {
    return false;
  }
})();

describe("Windows PowerShell installer contract", () => {
  it("menyediakan help mode sebelum langkah bootstrap", () => {
    expect(installer).toContain("[switch]$Help");
    expect(installer).toContain("Penggunaan:");
    expect(installer).toContain("-TestLog");
    expect(installer).toContain("exit 0");
    expect(installer.indexOf("if ($Help)")).toBeLessThan(installer.indexOf("Invoke-PnpmStep"));
  });

  it("mendeteksi root project dan menyediakan log lokal tersanitasi", () => {
    expect(installer).toContain("$projectRoot = (Resolve-Path (Join-Path $scriptRoot \"../..\")).Path");
    expect(installer).toContain(".mrkiplay/logs");
    expect(installer).toContain("Protect-LogMessage");
    expect(installer).toContain("[REDACTED]");
    expect(installer).toContain("Lihat log: $script:LogPath");
  });

  it("mencatat tahap dan error ke log lokal dengan rotasi sederhana", () => {
    expect(installer).toContain("function Write-InstallLog");
    expect(installer).toContain("$script:LogPath.1");
    expect(installer).toContain("$logSize -gt 524288");
    expect(installer).toContain("password|token|secret|api[_-]?key|authorization");
    expect(installer).toContain("Write-InstallLog -Level \"ERROR\"");
    expect(installer).toContain("Log instalasi: $script:LogPath");
    expect(installer).toContain("if ($TestLog)");
    expect(installer).toContain("Log self-test lulus");
  });

  it("menyediakan progress feedback interaktif dan marker CI", () => {
    expect(installer).toContain("Write-Progress");
    expect(installer).toContain("$isCi = $env:CI -eq \"true\"");
    expect(installer).toContain("[CI] [$Percent%]");
    expect(installer).toContain("-Completed");
    expect(installer.indexOf("Update-InstallProgress -Status \"Memeriksa Node.js LTS\"")).toBeLessThan(installer.indexOf("Invoke-PnpmStep -Label \"Instalasi dependency\""));
  });

  it.skipIf(!canRunPowerShell)("self-test runtime membuat log dan meredaksi secret", () => {
    const output = execFileSync("pwsh", ["-NoLogo", "-NoProfile", "-File", installerPath, "-TestLog"], {
      cwd: process.cwd(),
      encoding: "utf8",
    });
    expect(output).toContain("Log self-test lulus");
  });

  it("CI memeriksa parser PowerShell dan help mode", () => {
    const workflow = readFileSync(new URL("../.github/workflows/ci.yml", import.meta.url), "utf8");
    expect(workflow).toContain("runs-on: windows-latest");
    expect(workflow).toContain("Verify PowerShell installer help mode");
    expect(workflow).toContain("Parse PowerShell installer");
    expect(workflow).toContain("Verify PowerShell installer log self-test");
    expect(workflow).toContain("./scripts/install/install.ps1");
  });
});
