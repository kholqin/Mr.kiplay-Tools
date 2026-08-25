import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const examples = ["java_plugin.java", "go_plugin.go", "php_plugin.php", "LaravelMrkiplayAdapter.php", "html_report.html"];

describe("polyglot adapter examples", () => {
  it("memiliki kontrak policy-gated dan tidak menyimpan credential", () => {
    for (const file of examples) {
      const source = readFileSync(resolve(process.cwd(), "plugins/examples", file), "utf8");
      expect(source).toMatch(/policy-gated|policy|otorisasi/i);
      expect(source).not.toMatch(/password\s*[:=]|api[_-]?key\s*[:=]|authorization\s*[:=]/i);
    }
  });
});
