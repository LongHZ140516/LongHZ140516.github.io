import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import type { Interest } from "../content/types";
import { InterestGallery } from "./InterestGallery";

const interest: Interest = {
  slug: "anime",
  name: "Anime",
  subtitle: "Animation",
  description: "A display-only gallery.",
  href: "https://example.com/anime",
  sourceLabel: "Full anime list",
  duration: 60,
  items: [
    {
      name: "Example title",
      meta: "Example genre",
      image: "https://example.com/cover.jpg",
      imageAlt: "Example cover",
      href: "https://example.com/title",
    },
  ],
};

describe("InterestGallery", () => {
  it("renders interest images without navigation links", () => {
    const html = renderToStaticMarkup(
      <InterestGallery interest={interest} />,
    );

    expect(html).not.toMatch(/<a(?:\s|>)/);
    expect(html).toContain("<figure");
    expect(html).toContain("Example cover");
  });
});
