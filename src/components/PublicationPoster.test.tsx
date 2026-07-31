import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import type { Publication } from "../content/types";
import { PublicationPoster } from "./PublicationPoster";

const publication: Publication = {
  slug: "example-paper",
  title: "Example Paper",
  venue: "ExampleConf 2026 Oral",
  authors: ["Zilong Huang", "Example Author"],
  image: "./assets/publications/example.webp",
  imageAlt: "Example research result",
  paperUrl: "https://example.com/paper",
  date: "2025-11-29",
  highlight: false,
  tags: ["Example Topic"],
};

describe("PublicationPoster", () => {
  it("shows the paper release year rather than the later venue year", () => {
    const html = renderToStaticMarkup(
      <PublicationPoster
        publication={publication}
        highlightedAuthor="Zilong Huang"
      />,
    );

    expect(html).toContain("ExampleConf 2026 Oral");
    expect(html).toContain("<span>2025</span>");
  });
});
