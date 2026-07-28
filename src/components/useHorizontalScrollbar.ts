import {
  useCallback,
  useEffect,
  useRef,
  type KeyboardEvent as ReactKeyboardEvent,
  type PointerEvent as ReactPointerEvent,
} from "react";

export interface ScrollbarGeometry {
  scrollable: boolean;
  scrollLeft: number;
  maxScroll: number;
  thumbWidth: number;
  thumbOffset: number;
}

interface DragState {
  pointerId: number;
  startClientX: number;
  startScrollLeft: number;
}

export function getScrollbarGeometry(
  viewportWidth: number,
  contentWidth: number,
  scrollLeft: number,
): ScrollbarGeometry {
  const safeViewport = Math.max(0, viewportWidth);
  const safeContent = Math.max(safeViewport, contentWidth);
  const maxScroll = safeContent - safeViewport;
  const clampedScroll = Math.min(maxScroll, Math.max(0, scrollLeft));
  const scrollable = maxScroll > 1;

  if (!scrollable) {
    return {
      scrollable: false,
      scrollLeft: 0,
      maxScroll: 0,
      thumbWidth: safeViewport,
      thumbOffset: 0,
    };
  }

  const thumbWidth = Math.min(
    safeViewport,
    Math.max(36, (safeViewport * safeViewport) / safeContent),
  );
  const maxOffset = safeViewport - thumbWidth;

  return {
    scrollable: true,
    scrollLeft: clampedScroll,
    maxScroll,
    thumbWidth,
    thumbOffset: (clampedScroll / maxScroll) * maxOffset,
  };
}

export function getScrollLeftFromThumbDrag(
  startScrollLeft: number,
  pointerDelta: number,
  viewportWidth: number,
  contentWidth: number,
): number {
  const geometry = getScrollbarGeometry(
    viewportWidth,
    contentWidth,
    startScrollLeft,
  );
  const maxThumbOffset = Math.max(0, viewportWidth - geometry.thumbWidth);

  if (!geometry.scrollable || maxThumbOffset === 0) {
    return 0;
  }

  const nextScrollLeft =
    geometry.scrollLeft +
    pointerDelta * (geometry.maxScroll / maxThumbOffset);

  return Math.min(geometry.maxScroll, Math.max(0, nextScrollLeft));
}

export function getScrollLeftFromKey(
  key: string,
  scrollLeft: number,
  viewportWidth: number,
  contentWidth: number,
): number | undefined {
  const geometry = getScrollbarGeometry(
    viewportWidth,
    contentWidth,
    scrollLeft,
  );
  const step = Math.max(80, viewportWidth / 3);

  switch (key) {
    case "ArrowLeft":
    case "PageUp":
      return Math.max(0, geometry.scrollLeft - step);
    case "ArrowRight":
    case "PageDown":
      return Math.min(geometry.maxScroll, geometry.scrollLeft + step);
    case "Home":
      return 0;
    case "End":
      return geometry.maxScroll;
    default:
      return undefined;
  }
}

export function useHorizontalScrollbar(itemCount: number) {
  const listRef = useRef<HTMLDivElement>(null);
  const scrollbarRef = useRef<HTMLDivElement>(null);
  const thumbRef = useRef<HTMLSpanElement>(null);
  const dragStateRef = useRef<DragState | null>(null);

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
    scrollbar.setAttribute("aria-valuemax", String(geometry.maxScroll));
    scrollbar.setAttribute(
      "aria-valuenow",
      String(Math.round(geometry.scrollLeft)),
    );
    scrollbar.setAttribute(
      "aria-valuetext",
      `${Math.round(
        (geometry.scrollLeft / Math.max(1, geometry.maxScroll)) * 100,
      )}%`,
    );
    thumb.style.width = `${geometry.thumbWidth}px`;
    thumb.style.transform = `translateX(${geometry.thumbOffset}px)`;
  }, []);

  const handlePointerDown = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      const list = listRef.current;
      const scrollbar = scrollbarRef.current;

      if (!list || !scrollbar || event.button !== 0) {
        return;
      }

      const geometry = getScrollbarGeometry(
        list.clientWidth,
        list.scrollWidth,
        list.scrollLeft,
      );

      if (!geometry.scrollable) {
        return;
      }

      if (event.target === event.currentTarget) {
        const trackBounds = scrollbar.getBoundingClientRect();
        const maxThumbOffset = scrollbar.clientWidth - geometry.thumbWidth;
        const desiredThumbOffset = Math.min(
          maxThumbOffset,
          Math.max(
            0,
            event.clientX - trackBounds.left - geometry.thumbWidth / 2,
          ),
        );

        list.scrollLeft =
          maxThumbOffset > 0
            ? (desiredThumbOffset / maxThumbOffset) * geometry.maxScroll
            : 0;
      }

      dragStateRef.current = {
        pointerId: event.pointerId,
        startClientX: event.clientX,
        startScrollLeft: list.scrollLeft,
      };
      list.dataset.dragging = "true";
      scrollbar.dataset.dragging = "true";
      scrollbar.setPointerCapture(event.pointerId);
      event.preventDefault();
    },
    [],
  );

  const handlePointerMove = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      const list = listRef.current;
      const dragState = dragStateRef.current;

      if (!list || !dragState || dragState.pointerId !== event.pointerId) {
        return;
      }

      list.scrollLeft = getScrollLeftFromThumbDrag(
        dragState.startScrollLeft,
        event.clientX - dragState.startClientX,
        list.clientWidth,
        list.scrollWidth,
      );
      event.preventDefault();
    },
    [],
  );

  const finishPointerDrag = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      const list = listRef.current;
      const scrollbar = scrollbarRef.current;
      const dragState = dragStateRef.current;

      if (!scrollbar || !dragState || dragState.pointerId !== event.pointerId) {
        return;
      }

      if (scrollbar.hasPointerCapture(event.pointerId)) {
        scrollbar.releasePointerCapture(event.pointerId);
      }

      delete list?.dataset.dragging;
      delete scrollbar.dataset.dragging;
      dragStateRef.current = null;
      updateScrollbar();
    },
    [updateScrollbar],
  );

  const handleScrollbarKeyDown = useCallback(
    (event: ReactKeyboardEvent<HTMLDivElement>) => {
      const list = listRef.current;

      if (!list) {
        return;
      }

      const nextScrollLeft = getScrollLeftFromKey(
        event.key,
        list.scrollLeft,
        list.clientWidth,
        list.scrollWidth,
      );

      if (nextScrollLeft === undefined) {
        return;
      }

      event.preventDefault();
      list.scrollLeft = nextScrollLeft;
    },
    [],
  );

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
  }, [itemCount, updateScrollbar]);

  return {
    listRef,
    scrollbarRef,
    thumbRef,
    handlePointerDown,
    handlePointerMove,
    finishPointerDrag,
    handleScrollbarKeyDown,
  };
}
