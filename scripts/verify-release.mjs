import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join, relative } from "node:path";
import process from "node:process";

const root = process.cwd();
const failures = [];
const checks = [];
const check = (name, ok, detail) => { checks.push({ name, ok, detail }); if (!ok) failures.push(name); };
const read = (path) => readFileSync(join(root, path), "utf8");

for (const path of ["package.json", "pnpm-lock.yaml", "README.md", "CHANGELOG.md", "LICENSE", "SECURITY.md", "scripts/install/install.sh", "scripts/install/install.ps1"]) check(`file:${path}`, existsSync(join(root, path)), "file release tersedia");

let pkg;
try { pkg = JSON.parse(read("package.json")); check("package.json:valid", true, pkg.name); } catch { check("package.json:valid", false, "JSON tidak valid"); }
if (pkg) {
  check("packageManager:pnpm", /^pnpm@10\.4\.1(?:\+sha512\.[a-f0-9]{128})?$/.test(pkg.packageManager ?? ""), "pnpm pinned ke versi 10.4.1 yang kompatibel dengan Node");
  for (const command of ["check", "test", "build", "diagnose", "release:verify"]) check(`script:${command}`, typeof pkg.scripts?.[command] === "string", "command tersedia");
}

const catalog = read("core/modules/catalog.ts");
const osintCount = (catalog.match(/id: "osint\./g) ?? []).length;
check("catalog:osint-count", osintCount === 19, `${osintCount}/19 modul OSINT`);
check("catalog:preview-only", !/id: "osint\.[^\n]+active: true/.test(catalog), "modul OSINT tidak aktif otomatis");
check("installer:network-safe", /tidak menjalankan|tidak melakukan|scanner/i.test(read("scripts/install/install.sh")), "installer tidak menjalankan scanner");

const suspicious = /(-----BEGIN (RSA|OPENSSH|PRIVATE) KEY-----|ghp_[A-Za-z0-9]{20,}|sk-[A-Za-z0-9]{20,}|password\s*[:=]\s*[^<\s]{12,})/i;
const ignored = new Set(["node_modules", ".git", "dist", ".manus-logs"]);
function scan(dir) {
  for (const entry of readdirSync(join(root, dir), { withFileTypes: true })) {
    if (ignored.has(entry.name)) continue;
    const path = join(dir, entry.name);
    if (entry.isDirectory()) scan(path);
    else if (/\.(ts|tsx|mjs|ps1|sh|md|json|yaml|yml)$/.test(entry.name)) check(`secret-scan:${relative(root, path)}`, !suspicious.test(read(path)), "tidak ada pola secret yang dikenal");
  }
}
for (const dir of ["client", "core", "docs", "integrations", "scripts", "server", "shared"]) if (existsSync(join(root, dir))) scan(dir);

for (const item of checks) console.log(`${item.ok ? "[OK]" : "[FAIL]"} ${item.name}: ${item.detail}`);
console.log(`\nRelease verification: ${failures.length ? "GAGAL" : "LULUS"}. Pemeriksaan pasif saja; tidak ada request jaringan atau scanning target.`);
if (failures.length) process.exitCode = 1;
