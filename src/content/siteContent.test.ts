import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { parseFrontmatter } from "./frontmatter";
import type { Interest, Profile } from "./types";

const contentRoot = join(process.cwd(), "src/content");

function readMarkdown<T>(path: string): T {
  return parseFrontmatter<T>(readFileSync(path, "utf8")).data;
}

function markdownCount(directory: string): number {
  return readdirSync(join(contentRoot, directory)).filter((file) =>
    file.endsWith(".md"),
  ).length;
}

describe("site content", () => {
  it("keeps the requested academic collections populated", () => {
    expect(markdownCount("publications")).toBeGreaterThanOrEqual(11);
    expect(markdownCount("projects")).toBeGreaterThanOrEqual(3);
  });

  it("includes the current Tencent Hunyuan3D internship", () => {
    const profile = readMarkdown<Profile>(
      join(contentRoot, "profile/about.md"),
    );

    expect(profile.affiliations).toContainEqual(
      expect.objectContaining({
        kind: "work",
        organization: "Tencent Hunyuan3D",
        period: "2026.05 - Present",
      }),
    );
  });

  it("loads scalable interest galleries from Markdown", () => {
    const interests = readdirSync(join(contentRoot, "interests"))
      .filter((file) => file.endsWith(".md"))
      .map((file) =>
        readMarkdown<Interest>(join(contentRoot, "interests", file)),
      );
    const itemCounts = Object.fromEntries(
      interests.map((interest) => [interest.name, interest.items.length]),
    );

    expect(itemCounts).toMatchObject({
      Anime: 4,
      "K-pop": 6,
      Games: 5,
    });

    for (const interest of interests) {
      expect(interest.duration).toBeGreaterThan(0);
      expect(interest.items.every((item) => item.image.startsWith("https://")))
        .toBe(true);
    }
  });
});
