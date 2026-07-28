import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { parseFrontmatter } from "./frontmatter";
import type { Interest, Profile, Publication } from "./types";

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
    expect(markdownCount("publications")).toBeGreaterThanOrEqual(12);
    expect(markdownCount("projects")).toBeGreaterThanOrEqual(3);
  });

  it("preserves the latest publication and acceptance metadata", () => {
    const publications = readdirSync(join(contentRoot, "publications"))
      .filter((file) => file.endsWith(".md"))
      .map((file) =>
        readMarkdown<Publication>(join(contentRoot, "publications", file)),
      );

    expect(publications).toContainEqual(
      expect.objectContaining({
        title: "GenClaw: Code-Driven Agentic Image Generation",
        paperUrl: "https://arxiv.org/abs/2605.30248",
      }),
    );
    expect(
      publications.find((publication) =>
        publication.title.startsWith("Mind-Brush:"),
      )?.venue,
    ).toBe("SIGGRAPH Asia 2026");
    expect(
      publications.find((publication) =>
        publication.title.startsWith("RealGen:"),
      )?.venue,
    ).toBe("ECCV 2026 Oral");
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

  it("keeps email as a single hero action and exposes useful profile links", () => {
    const profile = readMarkdown<Profile>(
      join(contentRoot, "profile/about.md"),
    );

    expect(
      profile.socials.find((social) => social.kind === "email")?.primary,
    ).not.toBe(true);
    expect(profile.socials).toContainEqual(
      expect.objectContaining({
        kind: "website",
        href: "https://serein-six.vercel.app/about",
        primary: true,
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

    expect(Object.keys(itemCounts)).toEqual(
      expect.arrayContaining(["Anime", "K-pop", "Games"]),
    );

    for (const interest of interests) {
      expect(interest.duration).toBeGreaterThan(0);
      expect(interest.items.length).toBeGreaterThan(0);
      expect(interest.items.every((item) => item.image.startsWith("https://")))
        .toBe(true);
    }

    const itemsByInterest = Object.fromEntries(
      interests.map((interest) => [
        interest.name,
        interest.items.map((item) => item.name),
      ]),
    );

    expect(itemsByInterest.Anime).toEqual(
      expect.arrayContaining([
        "Sonny Boy",
        "Girls Band Cry",
        "Sword Art Online",
        "Tokyo Ghoul",
        "One-Punch Man",
        "The Tatami Galaxy",
        "Tatami Time Machine Blues",
        "Mob Psycho 100",
        "Death Note",
        "JoJo's Bizarre Adventure",
        "Cosmic Princess Kaguya!",
      ]),
    );
    expect(itemsByInterest.Games).toEqual(
      expect.arrayContaining([
        "Stardew Valley",
        "Genshin Impact",
        "Honkai: Star Rail",
        "Zenless Zone Zero",
        "Minecraft",
        "Elden Ring",
      ]),
    );
    expect(itemsByInterest["K-pop"]).toEqual(
      expect.arrayContaining([
        "Giselle",
        "Liz",
        "Yeji",
        "Yuna",
        "Tzuyu",
        "Ian",
        "Jiwoo",
        "Yuha",
        "Stella",
        "Wonhee",
        "Anna",
        "Yena",
      ]),
    );
  });
});
