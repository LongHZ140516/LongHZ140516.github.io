import { useCallback, useEffect, useRef } from "react";
import { ArrowUpRight } from "@phosphor-icons/react";
import type { NewsItem } from "../content/types";

interface RecentUpdatesProps {
  items: NewsItem[];
}

interface ScrollbarGeometry {
  scrollable: boolean;
  thumbWidth: number;
  thumbOffset: number;
}

export function getScrollbarGeometry(
  viewportWidth: number,
  contentWidth: number,
  scrollLeft: number,
): ScrollbarGeometry {
  const safeViewport = Math.max(0, viewportWidth);
  const safeContent = Math.max(safeViewport, contentWidth);
  const scrollable = safeContent - safeViewport > 1;

  if (!scrollable) {
    return {
      scrollable: false,
      thumbWidth: safeViewport,
      thumbOffset: 0,
    };
  }

  const thumbWidth = Math.min(
    safeViewport,
    Math.max(36, (safeViewport * safeViewport) / safeContent),
  );
  const maxScroll = safeContent - safeViewport;
  const maxOffset = safeViewport - thumbWidth;
  const clampedScroll = Math.min(maxScroll, Math.max(0, scrollLeft));

  return {
    scrollable: true,
    thumbWidth,
    thumbOffset: (clampedScroll / maxScroll) * maxOffset,
  };
}

export function RecentUpdates({ items }: RecentUpdatesProps) {
  const listRef = useRef<HTMLDivElement>(null);
  const scrollbarRef = useRef<HTMLDivElement>(null);
  const thumbRef = useRef<HTMLSpanElement>(null);

  const updateScrollbar = useCallback(() => {
    const list = listRef.current;
    const scrollbar = scrollbarRef.current;
    const thumb = thumbRef.current;

    if (!list || !scrollbar || !thumb) {
      return;
    }

    const geometry = getScrollbarGeometry(
      list.clientWidth,
      list.scrollWidth,
      list.scrollLeft,
    );

    scrollbar.hidden = !geometry.scrollable;
    thumb.style.width = `${geometry.thumbWidth}px`;
    thumb.style.transform = `translateX(${geometry.thumbOffset}px)`;
  }, []);

  useEffect(() => {
    const list = listRef.current;

    if (!list) {
      return;
    }

    updateScrollbar();
    list.addEventListener("scroll", updateScrollbar, { passive: true });

    const resizeObserver = new ResizeObserver(updateScrollbar);
    resizeObserver.observe(list);

    return () => {
      list.removeEventListener("scroll", updateScrollbar);
      resizeObserver.disconnect();
    };
  }, [items, updateScrollbar]);

  return (
    <section className="news-strip" aria-labelledby="news-heading">
      <div className="page-shell news-layout">
        <h2 id="news-heading">Recent updates</h2>
        <div className="news-scroll-shell">
          <div
            className="news-list"
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
            aria-hidden="true"
            ref={scrollbarRef}
            hidden
          >
            <span className="news-scrollbar__thumb" ref={thumbRef} />
          </div>
        </div>
      </div>
    </section>
  );
}
