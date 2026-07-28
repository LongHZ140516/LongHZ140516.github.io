import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { RecentUpdates } from "./RecentUpdates";
import {
  getScrollLeftFromKey,
  getScrollLeftFromThumbDrag,
  getScrollbarGeometry,
} from "./useHorizontalScrollbar";

describe("RecentUpdates scrollbar", () => {
  it("keeps the thumb proportional to the visible news width", () => {
    expect(getScrollbarGeometry(900, 1500, 300)).toEqual({
      scrollable: true,
      scrollLeft: 300,
      maxScroll: 600,
      thumbWidth: 540,
      thumbOffset: 180,
    });
  });

  it("hides the indicator when every update is already visible", () => {
    expect(getScrollbarGeometry(900, 900, 0)).toEqual({
      scrollable: false,
      scrollLeft: 0,
      maxScroll: 0,
      thumbWidth: 900,
      thumbOffset: 0,
    });
  });

  it("maps thumb dragging to the underlying content scroll range", () => {
    expect(getScrollLeftFromThumbDrag(300, 90, 900, 1500)).toBe(450);
    expect(getScrollLeftFromThumbDrag(0, -90, 900, 1500)).toBe(0);
    expect(getScrollLeftFromThumbDrag(550, 90, 900, 1500)).toBe(600);
  });

  it("clamps scrollbar values during elastic overscroll", () => {
    expect(getScrollbarGeometry(900, 1500, 700)).toEqual(
      expect.objectContaining({
        scrollLeft: 600,
        maxScroll: 600,
        thumbOffset: 360,
      }),
    );
  });

  it("supports keyboard scrolling across the complete range", () => {
    expect(getScrollLeftFromKey("ArrowRight", 0, 900, 1500)).toBe(300);
    expect(getScrollLeftFromKey("End", 0, 900, 1500)).toBe(600);
    expect(getScrollLeftFromKey("Home", 600, 900, 1500)).toBe(0);
    expect(getScrollLeftFromKey("Enter", 300, 900, 1500)).toBeUndefined();
  });

  it("includes the scrollbar ARIA structure in static markup", () => {
    const html = renderToStaticMarkup(
      <RecentUpdates
        items={[
          {
            date: "2026.01",
            title: "Example update",
            href: "https://example.com",
          },
        ]}
      />,
    );

    expect(html).toContain('id="recent-updates-list"');
    expect(html).toContain('role="scrollbar"');
    expect(html).toContain('aria-controls="recent-updates-list"');
    expect(html).toContain('aria-orientation="horizontal"');
    expect(html).toContain('tabindex="0"');
  });
});
