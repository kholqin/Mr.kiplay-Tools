export type PortCsvRow = { host: string; port: number; state: string; createdAt?: Date | string };

export function escapeCsvCell(value: unknown) {
  const raw = String(value ?? "");
  const safe = /^[=+\-@]/.test(raw) ? `'${raw}` : raw;
  return /[",\n\r]/.test(safe) ? `"${safe.replaceAll('"', '""')}"` : safe;
}

export function portRowsToCsv(rows: PortCsvRow[]) {
  const header = ["Host", "Port", "Status", "Waktu"].join(",");
  const body = rows.map((row) => [row.host, row.port, row.state, row.createdAt ? new Date(row.createdAt).toISOString() : ""].map(escapeCsvCell).join(","));
  return `\uFEFF${[header, ...body].join("\n")}\n`;
}
