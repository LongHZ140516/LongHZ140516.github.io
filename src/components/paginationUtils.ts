export type PaginationItem = number | "start" | "end";

export function pageSizeFromGrid(
  columns: number,
  rows: number,
  fallback: number,
) {
  if (!Number.isFinite(columns) || !Number.isFinite(rows)) {
    return fallback;
  }

  const safeColumns = Math.floor(columns);
  const safeRows = Math.floor(rows);

  return safeColumns > 0 && safeRows > 0
    ? safeColumns * safeRows
    : fallback;
}

export function getPageSlice<T>(items: readonly T[], page: number, size: number) {
  const safeSize = Math.max(1, size);
  const safePage = Math.max(1, page);
  const start = (safePage - 1) * safeSize;

  return items.slice(start, start + safeSize);
}

export function buildPaginationItems(
  currentPage: number,
  totalPages: number,
): PaginationItem[] {
  if (totalPages <= 7) {
    return Array.from({ length: Math.max(0, totalPages) }, (_, index) => index + 1);
  }

  const current = Math.min(totalPages, Math.max(1, currentPage));

  if (current <= 4) {
    return [1, 2, 3, 4, 5, "end", totalPages];
  }

  if (current >= totalPages - 3) {
    return [
      1,
      "start",
      totalPages - 4,
      totalPages - 3,
      totalPages - 2,
      totalPages - 1,
      totalPages,
    ];
  }

  return [
    1,
    "start",
    current - 1,
    current,
    current + 1,
    "end",
    totalPages,
  ];
}
