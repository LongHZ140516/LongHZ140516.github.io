import { useEffect, useState } from "react";
import { pageSizeFromGrid } from "./paginationUtils";

export function useResponsivePageSize(
  columnVariable: string,
  rowVariable: string,
  fallback: number,
) {
  const readPageSize = () => {
    if (typeof window === "undefined") {
      return fallback;
    }

    const rootStyles = window.getComputedStyle(document.documentElement);
    const columns = Number.parseFloat(rootStyles.getPropertyValue(columnVariable));
    const rows = Number.parseFloat(rootStyles.getPropertyValue(rowVariable));

    return pageSizeFromGrid(columns, rows, fallback);
  };
  const [pageSize, setPageSize] = useState(readPageSize);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(() => setPageSize(readPageSize()));
    };

    window.addEventListener("resize", update);
    update();

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("resize", update);
    };
  }, [columnVariable, fallback, rowVariable]);

  return pageSize;
}
