import { describe, expect, it } from "vitest";
import { getScrollbarGeometry } from "./RecentUpdates";

describe("getScrollbarGeometry", () => {
  it("keeps the thumb proportional to the visible news width", () => {
    expect(getScrollbarGeometry(900, 1500, 300)).toEqual({
      scrollable: true,
      thumbWidth: 540,
      thumbOffset: 180,
    });
  });

  it("hides the indicator when every update is already visible", () => {
    expect(getScrollbarGeometry(900, 900, 0)).toEqual({
      scrollable: false,
      thumbWidth: 900,
      thumbOffset: 0,
    });
  });
});
