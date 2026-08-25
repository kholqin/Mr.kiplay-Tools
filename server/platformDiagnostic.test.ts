import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const diagnosticSource = readFileSync(new URL("../scripts/diagnose.mjs", import.meta.url), "utf8");
const workspaceConfig = readFileSync(new URL("../pnpm-workspace.yaml", import.meta.url), "utf8");
const unixInstaller = readFileSync(new URL("../scripts/install/install.sh", import.meta.url), "utf8");
const ciWorkflow = readFileSync(new URL("../.github/workflows/ci.yml", import.meta.url), "utf8");
const packageManifest = JSON.parse(readFileSync(new URL("../package.json", import.meta.url), "utf8")) as {
  scripts?: Record<string, string>;
};

describe("diagnostik platform", () => {
  it("terdaftar sebagai command package dan tidak menjalankan scanner", () => {
    expect(packageManifest.scripts?.diagnose).toBe("node scripts/diagnose.mjs");
    expect(diagnosticSource).toContain("tidak melakukan request jaringan atau scanning target");
    expect(diagnosticSource).not.toMatch(/nmap|nuclei|subfinder|masscan/i);
  });

  it("memastikan konfigurasi pnpm berada di workspace config yang didukung", () => {
    expect(workspaceConfig).toContain("patchedDependencies:");
    expect(workspaceConfig).toContain("wouter@3.7.1: patches/wouter@3.7.1.patch");
    expect(workspaceConfig).toContain("overrides:");
    expect(workspaceConfig).toContain("tailwindcss>nanoid: 3.3.7");
    expect(readFileSync(new URL("../package.json", import.meta.url), "utf8")).not.toContain('"pnpm": {');
  });

  it("menjaga installer Unix idempoten untuk Kali dan Termux", () => {
    expect(unixInstaller).toContain('SCRIPT_DIR="$(cd --');
    expect(unixInstaller).toContain('PROJECT_ROOT="$(cd -- "$SCRIPT_DIR/../.." && pwd)"');
    expect(unixInstaller).toContain("pnpm install --frozen-lockfile");
    expect(unixInstaller).toContain("pnpm diagnose");
    expect(unixInstaller).toContain("TERMUX_VERSION");
    expect(unixInstaller).toContain("Kali/BlackArch");
  });

  it("mengarsipkan log installer Windows dengan retention terbatas", () => {
    expect(ciWorkflow).toContain("actions/upload-artifact@v4");
    expect(ciWorkflow).toContain(".mrkiplay/logs/install.log");
    expect(ciWorkflow).toContain("retention-days: 7");
    expect(ciWorkflow).toContain("if: always()");
  });

  it("memeriksa file manifest dan installer lintas platform", () => {
    expect(diagnosticSource).toContain('"package.json"');
    expect(diagnosticSource).toContain('"pnpm-lock.yaml"');
    expect(diagnosticSource).toContain('"installer Unix"');
    expect(diagnosticSource).toContain('"installer PowerShell"');
  });

  it("berjalan dari root project dan mengembalikan ringkasan yang dapat dibaca", () => {
    const output = execFileSync("node", ["scripts/diagnose.mjs"], {
      cwd: process.cwd(),
      encoding: "utf8",
    });
    expect(output).toContain("Mr.Kiplay diagnostic");
    expect(output).toContain("Project     : mrkiplay-platform");
    expect(output).toContain("Environment :");
  });
});
