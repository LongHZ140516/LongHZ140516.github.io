import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { ArchiveSelect, getNextOptionIndex } from "./ArchiveSelect";

describe("getNextOptionIndex", () => {
  it("wraps through the available options with the arrow keys", () => {
    expect(getNextOptionIndex(3, 4, "ArrowDown")).toBe(0);
    expect(getNextOptionIndex(0, 4, "ArrowUp")).toBe(3);
  });

  it("supports jumping to the beginning and end", () => {
    expect(getNextOptionIndex(2, 4, "Home")).toBe(0);
    expect(getNextOptionIndex(1, 4, "End")).toBe(3);
  });
});

describe("ArchiveSelect", () => {
  it("renders a themed listbox trigger instead of a native select", () => {
    const html = renderToStaticMarkup(
      <ArchiveSelect
        label="Topics"
        options={["3D Generation", "Remote Sensing"]}
        value="Remote Sensing"
        onChange={() => undefined}
      />,
    );

    expect(html).toContain('role="combobox"');
    expect(html).toContain('aria-haspopup="listbox"');
    expect(html).toContain("Remote Sensing");
    expect(html).not.toContain("<select");
  });
});
