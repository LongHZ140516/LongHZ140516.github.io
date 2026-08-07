import { describe, expect, it } from "vitest";
import {
  buildPaginationItems,
  getPageSlice,
  pageSizeFromGrid,
} from "./paginationUtils";

describe("PaginatedGrid helpers", () => {
  it("builds a compact pagination model around the current page", () => {
    expect(buildPaginationItems(1, 12)).toEqual([1, 2, 3, 4, 5, "end", 12]);
    expect(buildPaginationItems(6, 12)).toEqual([
      1,
      "start",
      5,
      6,
      7,
      "end",
      12,
    ]);
    expect(buildPaginationItems(12, 12)).toEqual([
      1,
      "start",
      8,
      9,
      10,
      11,
      12,
    ]);
  });

  it("returns every page number when the result is short", () => {
    expect(buildPaginationItems(2, 5)).toEqual([1, 2, 3, 4, 5]);
  });

  it("slices a collection without leaking items from adjacent pages", () => {
    expect(getPageSlice([1, 2, 3, 4, 5, 6, 7], 2, 3)).toEqual([4, 5, 6]);
  });

  it("derives page capacity from the responsive grid dimensions", () => {
    expect(pageSizeFromGrid(4, 3, 12)).toBe(12);
    expect(pageSizeFromGrid(3, 3, 12)).toBe(9);
    expect(pageSizeFromGrid(2, 3, 12)).toBe(6);
    expect(pageSizeFromGrid(1, 4, 12)).toBe(4);
    expect(pageSizeFromGrid(Number.NaN, 3, 12)).toBe(12);
  });
});
