import { type ReconExportRow, sanitizeReconText } from "../shared/reconExport";

const PAGE_WIDTH = 595;
const PAGE_HEIGHT = 842;
const MAX_LINES_PER_PAGE = 48;

function ascii(value: unknown): string {
  return sanitizeReconText(value, 180).normalize("NFKD").replace(/[^\x20-\x7E]/g, "?");
}

function pdfString(value: string): string {
  return `(${value.replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)")})`;
}

function wrap(value: string, width = 88): string[] {
  const words = ascii(value).split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let current = "";
  for (const word of words) {
    if ((current ? current.length + 1 : 0) + word.length <= width) current = current ? `${current} ${word}` : word;
    else { if (current) lines.push(current); current = word.slice(0, width); }
  }
  if (current) lines.push(current);
  return lines.length ? lines : [""];
}

function pageStream(lines: string[]): string {
  const commands = ["BT", "/F1 9 Tf", "40 800 Td", "11 TL", ...lines.flatMap((line) => [pdfString(line), "Tj", "T*"]), "ET"];
  return commands.join("\n");
}

export function reconRowsToPdf(rows: ReconExportRow[], workspaceLabel = "Workspace terotorisasi"): Buffer {
  const lines: string[] = ["LAPORAN RECON OSINT", `${ascii(workspaceLabel)} | Dibuat ${new Date().toISOString()}`, "Data metadata berizin; wajib ditinjau manual.", ""];
  if (!rows.length) lines.push("Belum ada hasil recon.");
  for (const row of rows.slice(0, 1000)) {
    lines.push(...wrap(`${row.module} | ${row.target} | ${row.status} | ${new Date(row.observedAt).toISOString()}`));
    lines.push(...wrap(`Ringkasan: ${row.summary}`));
    lines.push("");
  }
  const pages: string[][] = [];
  for (let index = 0; index < lines.length; index += MAX_LINES_PER_PAGE) pages.push(lines.slice(index, index + MAX_LINES_PER_PAGE));
  const objects: string[] = [];
  const add = (body: string) => { objects.push(body); return objects.length; };
  const catalogId = add("");
  const pagesId = add("");
  const fontId = add("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>");
  const pageIds: number[] = [];
  for (const page of pages) {
    const stream = pageStream(page);
    const contentId = add(`<< /Length ${Buffer.byteLength(stream, "ascii")} >>\nstream\n${stream}\nendstream`);
    pageIds.push(add(`<< /Type /Page /Parent ${pagesId} 0 R /MediaBox [0 0 ${PAGE_WIDTH} ${PAGE_HEIGHT}] /Resources << /Font << /F1 ${fontId} 0 R >> >> /Contents ${contentId} 0 R >>`));
  }
  objects[catalogId - 1] = `<< /Type /Catalog /Pages ${pagesId} 0 R >>`;
  objects[pagesId - 1] = `<< /Type /Pages /Kids [${pageIds.map((id) => `${id} 0 R`).join(" ")}] /Count ${pageIds.length} >>`;
  let output = "%PDF-1.4\n%\xE2\xE3\xCF\xD3\n";
  const offsets = [0];
  objects.forEach((object, index) => { offsets.push(Buffer.byteLength(output, "binary")); output += `${index + 1} 0 obj\n${object}\nendobj\n`; });
  const xrefOffset = Buffer.byteLength(output, "binary");
  output += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n${offsets.slice(1).map((offset) => `${String(offset).padStart(10, "0")} 00000 n \n`).join("")}trailer\n<< /Size ${objects.length + 1} /Root ${catalogId} 0 R >>\nstartxref\n${xrefOffset}\n%%EOF\n`;
  return Buffer.from(output, "binary");
}
