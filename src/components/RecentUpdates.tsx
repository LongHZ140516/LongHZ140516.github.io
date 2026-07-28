import { ArrowUpRight } from "@phosphor-icons/react";
import type { NewsItem } from "../content/types";
import { useHorizontalScrollbar } from "./useHorizontalScrollbar";

interface RecentUpdatesProps {
  items: NewsItem[];
}

export function RecentUpdates({ items }: RecentUpdatesProps) {
  const {
    listRef,
    scrollbarRef,
    thumbRef,
    handlePointerDown,
    handlePointerMove,
    finishPointerDrag,
    handleScrollbarKeyDown,
  } = useHorizontalScrollbar(items.length);

  return (
    <section className="news-strip" aria-labelledby="news-heading">
      <div className="page-shell news-layout">
        <h2 id="news-heading">Recent updates</h2>
        <div className="news-scroll-shell">
          <div
            className="news-list"
            id="recent-updates-list"
            aria-label="All recent updates"
            ref={listRef}
          >
            {items.map((item) => (
              <a
                key={`${item.date}-${item.title}`}
                href={item.href}
                target="_blank"
                rel="noreferrer"
              >
                <time>{item.date}</time>
                <span>{item.title}</span>
                <ArrowUpRight
                  size={15}
                  weight="regular"
                  aria-hidden="true"
                />
              </a>
            ))}
          </div>
          <div
            className="news-scrollbar"
            role="scrollbar"
            aria-label="Scroll recent updates"
            aria-controls="recent-updates-list"
            aria-orientation="horizontal"
            aria-valuemin={0}
            aria-valuemax={0}
            aria-valuenow={0}
            ref={scrollbarRef}
            tabIndex={0}
            hidden
            onKeyDown={handleScrollbarKeyDown}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={finishPointerDrag}
            onPointerCancel={finishPointerDrag}
            onLostPointerCapture={finishPointerDrag}
          >
            <span className="news-scrollbar__thumb" ref={thumbRef} />
          </div>
        </div>
      </div>
    </section>
  );
}
