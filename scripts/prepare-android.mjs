import { existsSync } from "node:fs";
import { spawnSync } from "node:child_process";

const pnpm = process.platform === "win32" ? "pnpm.cmd" : "pnpm";
const command = existsSync("android") ? "sync" : "add";
const result = spawnSync(pnpm, ["exec", "cap", command, "android"], {
  stdio: "inherit",
  env: process.env,
});
if (result.error) throw result.error;
process.exit(result.status ?? 1);
