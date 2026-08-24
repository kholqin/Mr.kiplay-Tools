export type PortFilterRow = { host: string; state: string; port?: number; createdAt?: Date | string };
export type PortSortKey = "host" | "port" | "state" | "createdAt";
export type PortSortDirection = "asc" | "desc";

export function filterPortRows<T extends PortFilterRow>(rows: T[], hostQuery: string, status: string) {
  const query = hostQuery.trim().toLowerCase();
  return rows.filter((row) => row.host.toLowerCase().includes(query) && (status === "all" || row.state === status));
}

export function sortPortRows<T extends PortFilterRow>(rows: T[], key: PortSortKey, direction: PortSortDirection) {
  const multiplier = direction === "asc" ? 1 : -1;
  return [...rows].sort((left, right) => {
    const leftValue = key === "port" ? (left.port ?? 0) : key === "createdAt" ? new Date(left.createdAt ?? 0).getTime() : (left[key] ?? "");
    const rightValue = key === "port" ? (right.port ?? 0) : key === "createdAt" ? new Date(right.createdAt ?? 0).getTime() : (right[key] ?? "");
    return String(leftValue).localeCompare(String(rightValue), "id", { numeric: true, sensitivity: "base" }) * multiplier;
  });
}

export function paginatePortRows<T>(rows: T[], page: number, pageSize: number) {
  const safePageSize = Math.max(1, Math.min(100, Math.floor(pageSize)));
  const totalPages = Math.max(1, Math.ceil(rows.length / safePageSize));
  const currentPage = Math.max(1, Math.min(totalPages, Math.floor(page)));
  const start = (currentPage - 1) * safePageSize;
  return { rows: rows.slice(start, start + safePageSize), currentPage, pageSize: safePageSize, totalPages, totalRows: rows.length };
}
