import {
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { CaretLeft, CaretRight } from "@phosphor-icons/react";
import { buildPaginationItems, getPageSlice } from "./paginationUtils";

interface PaginatedGridProps<T> {
  ariaLabel: string;
  className: string;
  getKey: (item: T) => string;
  itemLabel: string;
  items: readonly T[];
  pageSize: number;
  renderItem: (item: T) => ReactNode;
}

export function PaginatedGrid<T>({
  ariaLabel,
  className,
  getKey,
  itemLabel,
  items,
  pageSize,
  renderItem,
}: PaginatedGridProps<T>) {
  const [currentPage, setCurrentPage] = useState(1);
  const previousPageSize = useRef(pageSize);
  const gridRef = useRef<HTMLDivElement>(null);
  const totalPages = Math.max(1, Math.ceil(items.length / pageSize));
  const safePage = Math.min(currentPage, totalPages);
  const visibleItems = getPageSlice(items, safePage, pageSize);
  const rangeStart = items.length ? (safePage - 1) * pageSize + 1 : 0;
  const rangeEnd = Math.min(items.length, safePage * pageSize);

  useEffect(() => {
    const formerPageSize = previousPageSize.current;

    previousPageSize.current = pageSize;
    setCurrentPage((page) => {
      const firstVisibleIndex = (page - 1) * formerPageSize;
      const nextPage = Math.floor(firstVisibleIndex / pageSize) + 1;

      return Math.min(Math.max(1, nextPage), totalPages);
    });
  }, [pageSize, totalPages]);

  const changePage = (page: number) => {
    const nextPage = Math.min(totalPages, Math.max(1, page));

    if (nextPage === safePage) {
      return;
    }

    setCurrentPage(nextPage);
    window.requestAnimationFrame(() => {
      gridRef.current?.scrollIntoView({
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
          ? "auto"
          : "smooth",
        block: "start",
      });
    });
  };

  return (
    <>
      <div
        className={className}
        role="list"
        aria-label={ariaLabel}
        ref={gridRef}
      >
        {visibleItems.map((item) => (
          <div
            className="paginated-grid__item"
            key={getKey(item)}
            role="listitem"
          >
            {renderItem(item)}
          </div>
        ))}
      </div>

      {totalPages > 1 ? (
        <nav className="pagination" aria-label={ariaLabel}>
          <p className="pagination__status" aria-live="polite">
            <span>
              {rangeStart}-{rangeEnd} of {items.length} {itemLabel}
            </span>
            <span>
              Page {safePage} / {totalPages}
            </span>
          </p>

          <div className="pagination__controls">
            <button
              type="button"
              onClick={() => changePage(safePage - 1)}
              disabled={safePage === 1}
              aria-label="Previous page"
            >
              <CaretLeft size={14} weight="bold" aria-hidden="true" />
            </button>

            {buildPaginationItems(safePage, totalPages).map((item) =>
              typeof item === "number" ? (
                <button
                  className="pagination__page"
                  type="button"
                  key={item}
                  onClick={() => changePage(item)}
                  aria-label={`Page ${item}`}
                  aria-current={item === safePage ? "page" : undefined}
                >
                  {item}
                </button>
              ) : (
                <span className="pagination__ellipsis" key={item} aria-hidden="true">
                  ...
                </span>
              ),
            )}

            <button
              type="button"
              onClick={() => changePage(safePage + 1)}
              disabled={safePage === totalPages}
              aria-label="Next page"
            >
              <CaretRight size={14} weight="bold" aria-hidden="true" />
            </button>
          </div>
        </nav>
      ) : null}
    </>
  );
}
