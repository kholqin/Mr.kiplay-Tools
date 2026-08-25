import { describe, expect, it } from "vitest";
import { reconRowsFromResults, reconRowsToCsv, reconRowsToPrintableHtml } from "../shared/reconExport";

describe("ekspor recon OSINT", () => {
  it("menghasilkan CSV tersanitasi dan tidak memasukkan secret payload", () => {
    const rows = reconRowsFromResults([{ kind: "dns", target: "example.test", createdAt: 0, payload: { records: ["1.2.3.4"], token: "jangan-tampil" } }]);
    const csv = reconRowsToCsv(rows);
    expect(csv).toContain("modul");
    expect(csv).toContain("example.test");
    expect(csv).not.toContain("jangan-tampil");
  });

  it("menghasilkan HTML print-ready dengan escape dan batas baris", () => {
    const rows = reconRowsFromResults(Array.from({ length: 1005 }, (_, index) => ({ kind: "subdomain", target: `host-${index}.test`, createdAt: index, payload: { status: "ok" } })));
    const html = reconRowsToPrintableHtml(rows, "Workspace <aman>");
    expect(html).toContain("window.print");
    expect(html).toContain("Workspace &lt;aman&gt;");
    expect(html.match(/<tr>/g)?.length).toBe(1001);
    expect(html).not.toContain("host-1000.test");
  });
});
