import { existsSync, readFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { join } from "node:path";
import process from "node:process";

const root = process.cwd();
const packagePath = join(root, "package.json");
const checks = [];

function addCheck(name, ok, detail) {
  checks.push({ name, ok, detail });
}

function commandVersion(command, args = ["--version"]) {
  try {
    return execFileSync(command, args, { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] }).trim();
  } catch {
    return null;
  }
}

const nodeVersion = process.version;
const nodeMajor = Number.parseInt(nodeVersion.slice(1).split(".")[0], 10);
addCheck("Node.js", nodeMajor >= 20, `${nodeVersion} (minimal v20)`);

const pnpmVersion = commandVersion("pnpm");
addCheck("pnpm", Boolean(pnpmVersion), pnpmVersion ?? "tidak ditemukan; aktifkan Corepack");

addCheck("package.json", existsSync(packagePath), packagePath);
addCheck("pnpm-lock.yaml", existsSync(join(root, "pnpm-lock.yaml")), "manifest lockfile");
addCheck("installer Unix", existsSync(join(root, "scripts/install/install.sh")), "scripts/install/install.sh");
addCheck("installer PowerShell", existsSync(join(root, "scripts/install/install.ps1")), "scripts/install/install.ps1");

let packageName = "tidak terbaca";
if (existsSync(packagePath)) {
  try {
    packageName = JSON.parse(readFileSync(packagePath, "utf8")).name ?? packageName;
  } catch {
    addCheck("JSON package", false, "package.json tidak valid");
  }
}

const isTermux = Boolean(process.env.TERMUX_VERSION || process.env.PREFIX?.includes("com.termux"));
const osRelease = existsSync("/etc/os-release") ? readFileSync("/etc/os-release", "utf8") : "";
const isKali = /ID=kali|Kali/i.test(osRelease);
const environment = isTermux ? "Termux" : isKali ? "Kali Linux" : `${process.platform}/${process.arch}`;

console.log("Mr.Kiplay diagnostic");
console.log(`Project     : ${packageName}`);
console.log(`Environment : ${environment}`);
console.log(`Node.js     : ${nodeVersion}`);
console.log(`pnpm        : ${pnpmVersion ?? "tidak ditemukan"}`);
console.log("");
for (const check of checks) {
  console.log(`${check.ok ? "[OK]" : "[FAIL]"} ${check.name}: ${check.detail}`);
}
console.log("");
console.log("Diagnostik ini hanya memeriksa environment lokal; tidak melakukan request jaringan atau scanning target.");

if (checks.some((check) => !check.ok)) {
  process.exitCode = 1;
}
