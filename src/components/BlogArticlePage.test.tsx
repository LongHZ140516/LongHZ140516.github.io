import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import type { BlogPost } from "../content/types";
import { BlogArticleNavigation } from "./BlogArticleNavigation";
import { MarkdownArticle } from "./MarkdownArticle";

function post(slug: string, title: string, date: string): BlogPost {
  return {
    slug,
    title,
    summary: `${title} summary`,
    date,
    category: "Site Notes",
    tags: ["Design"],
    readingMinutes: 3,
  };
}

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

  it("labels the table of contents as Contents", () => {
    const html = renderToStaticMarkup(
      <MarkdownArticle source={"## First section\n\nText."} />,
    );

    expect(html).toContain(">Contents<");
    expect(html).not.toContain("On this page");
  });

  it("links to newer and older articles while preserving the return page", () => {
    const posts = [
      post("newer", "Newer note", "2026-08-08"),
      post("current", "Current note", "2026-08-07"),
      post("older", "Older note", "2026-08-06"),
    ];
    const html = renderToStaticMarkup(
      <BlogArticleNavigation
        currentSlug="current"
        posts={posts}
        returnSearch="?from=home&blogPage=2"
      />,
    );

    expect(html).toContain("Newer article");
    expect(html).toContain("Older article");
    expect(html).toContain("/blog/newer/?from=home&amp;blogPage=2");
    expect(html).toContain("/blog/older/?from=home&amp;blogPage=2");
  });
});
