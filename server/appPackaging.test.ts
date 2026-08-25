import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

describe("app packaging contract", () => {
  it("memiliki target Windows dan Android yang reproducible", () => {
    const packageJson = readFileSync(resolve(process.cwd(), "package.json"), "utf8");
    const capacitor = readFileSync(resolve(process.cwd(), "capacitor.config.ts"), "utf8");
    const desktop = readFileSync(resolve(process.cwd(), "desktop/main.cjs"), "utf8");
    const workflow = readFileSync(resolve(process.cwd(), ".github/workflows/apps.yml"), "utf8");
    expect(packageJson).toContain('"desktop:dist"');
    expect(packageJson).toContain('"mobile:apk"');
    expect(capacitor).toContain("com.mrkiplay.securityintel");
    expect(capacitor).toContain('cleartext: false');
    expect(desktop).toContain("contextIsolation: true");
    expect(desktop).toContain("nodeIntegration: false");
    expect(workflow).toContain("windows-latest");
    expect(workflow).toContain("MrKiplay-android-");
  });
});
