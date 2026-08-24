export type PortFilterRow = { host: string; state: string };

export function filterPortRows<T extends PortFilterRow>(rows: T[], hostQuery: string, status: string) {
  const query = hostQuery.trim().toLowerCase();
  return rows.filter((row) => row.host.toLowerCase().includes(query) && (status === "all" || row.state === status));
}
