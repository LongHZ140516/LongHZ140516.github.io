---
title: "Building a Small, Durable Blog"
summary: "A short note on keeping writing close to the code while making each article pleasant to read."
date: "2026-08-07"
category: "Site Notes"
tags: ["Design", "Markdown", "Frontend"]
featured: true
---

I wanted a place for writing that felt connected to the rest of this site. It should be easy to maintain, calm to read, and simple enough that future changes do not require rebuilding the whole system.

> Words mean nothing without action.

For this blog, that means the writing remains ordinary Markdown. The presentation can be careful, but the source stays portable.

## The content stays separate

Each article lives in `src/content/blogs/`. Its frontmatter holds the information used by the home page, while the Markdown body is loaded only after someone opens the article.

```yaml
---
title: "A clear article title"
summary: "One sentence that explains what the reader will find."
date: "2026-08-07"
category: "Research Notes"
tags: ["3D Vision", "Tools"]
cover: "./assets/blog/my-cover.webp" # optional
coverAlt: "A precise description of the cover"
---
```

If `cover` is omitted, the site draws a geometric SVG cover from the article slug. A local image or an SVG file can be placed under `public/assets/blog/` and referenced with a normal Markdown image path.

![The blog build separates light metadata from the article body and renderer.](/assets/blog/content-pipeline.svg)

## Loading less at the beginning

The home page needs only a small amount of information:

- title and summary
- publication date and category
- tags and estimated reading time
- an optional cover path

The Markdown parser, math renderer, syntax highlighter, and full article body belong to a separate browser chunk. They are requested when the article page opens, not when the portfolio first appears.

### A small performance rule

The loading boundary can be expressed simply:

$$
J_{home} = J_{portfolio} + M_{blog}, \qquad
J_{article} = J_{home} + J_{markdown} + B_{article}
$$

Here, $M_{blog}$ is the lightweight metadata. The larger Markdown renderer $J_{markdown}$ and article body $B_{article}$ arrive later.

## Formats worth supporting

The renderer treats Markdown as a writing surface rather than a plain text dump. It includes considered styles for the formats I am likely to use:

- [x] headings with stable anchor links
- [x] code blocks with syntax highlighting and copy controls
- [x] tables that remain usable on narrow screens
- [x] block quotes, task lists, footnotes, and horizontal rules
- [x] inline and display mathematics
- [x] local, remote, raster, and SVG images

| Format | Purpose | Mobile behavior |
| --- | --- | --- |
| Table of contents | Keeps long notes navigable | Collapses above the article |
| Code block | Records an implementation clearly | Scrolls horizontally |
| Figure | Explains a system visually | Preserves its aspect ratio |

The result is still a static site. Every published article receives a real `/blog/<slug>/` page during the build, so direct links and browser refreshes work on GitHub Pages.

---

The goal is not to make Markdown look complicated. It is to give ideas enough structure that reading them feels deliberate, while keeping the act of writing uncomplicated.[^portable]

[^portable]: The source remains usable even if the visual layer changes later.
