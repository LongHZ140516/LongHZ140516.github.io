import { describe, expect, it } from "vitest";
import {
  blogHref,
  blogSlugFromPath,
  createHeadingSlugger,
  estimateReadingMinutes,
  formatBlogDate,
} from "./blogUtils";
import { buildTableOfContents } from "./blogMarkdown";

describe("blog content helpers", () => {
  it("builds stable table-of-contents anchors from Markdown syntax", () => {
    const toc = buildTableOfContents(`
# First idea
First *idea*
------------
### A smaller part
\`\`\`md
## Not a real heading
\`\`\`
## A [linked heading][guide] & entity

[guide]: https://example.com
`);

    expect(toc).toEqual([
      { id: "first-idea-2", text: "First idea", level: 2 },
      { id: "a-smaller-part", text: "A smaller part", level: 3 },
      {
        id: "a-linked-heading-entity",
        text: "A linked heading & entity",
        level: 2,
      },
    ]);
  });

  it("keeps IDs unique across every heading level", () => {
    const slug = createHeadingSlugger();

    expect([slug("Shared"), slug("Shared"), slug("Shared")]).toEqual([
      "shared",
      "shared-2",
      "shared-3",
    ]);
  });

  it("keeps blog routes compatible with static GitHub Pages paths", () => {
    expect(blogHref("small-notes")).toBe("/blog/small-notes/");
    expect(blogSlugFromPath("/blog/small-notes/")).toBe("small-notes");
    expect(blogSlugFromPath("/blog/small-notes")).toBe("small-notes");
    expect(blogSlugFromPath("/projects/small-notes/")).toBeNull();
  });

  it("estimates reading time for English and CJK writing", () => {
    expect(estimateReadingMinutes("A short note.")).toBe(1);
    expect(estimateReadingMinutes("word ".repeat(450))).toBe(3);
    expect(estimateReadingMinutes("思考".repeat(360))).toBe(3);
  });

  it("formats dates without shifting across local time zones", () => {
    expect(formatBlogDate("2026-08-07")).toBe("August 7, 2026");
  });
});
