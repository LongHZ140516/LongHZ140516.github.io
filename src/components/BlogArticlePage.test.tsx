import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { MarkdownArticle } from "./MarkdownArticle";

describe("MarkdownArticle", () => {
  it("keeps generated footnote labels connected for assistive technology", () => {
    const html = renderToStaticMarkup(
      <MarkdownArticle
        source={`A note with a footnote.[^detail]

Setext section
--------------

[^detail]: Supporting detail.`}
      />,
    );

    expect(html).toContain('id="setext-section"');
    expect(html).toContain('aria-describedby="footnote-label"');
    expect(html).toContain('id="footnote-label"');
  });
});
