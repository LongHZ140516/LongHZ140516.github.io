import { existsSync, readFileSync, readdirSync } from "node:fs";
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

function readMarkdownDirectory<T>(directory: string): T[] {
  return readdirSync(join(contentRoot, directory))
    .filter((file) => file.endsWith(".md"))
    .map((file) => readMarkdown<T>(join(contentRoot, directory, file)));
}

describe("site content", () => {
  it("keeps the requested academic collections populated", () => {
    expect(markdownCount("publications")).toBeGreaterThanOrEqual(12);
    expect(markdownCount("projects")).toBeGreaterThanOrEqual(3);
  });

  it("preserves the latest publication and acceptance metadata", () => {
    const publications =
      readMarkdownDirectory<Publication>("publications");

    expect(publications).toContainEqual(
      expect.objectContaining({
        title: "GenClaw: Code-Driven Agentic Image Generation",
        paperUrl: "https://arxiv.org/abs/2605.30248",
        githubUrl: "https://github.com/yejy53/GenClaw",
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
        mentors: expect.arrayContaining([
          expect.objectContaining({
            name: "Yang Li",
            href: "https://yang-l1.github.io/",
          }),
          expect.objectContaining({ name: "Chunchao Guo" }),
        ]),
      }),
    );
    expect(profile.affiliations).toContainEqual(
      expect.objectContaining({
        organization: "Sun Yat-sen University",
        role: "M.S. in Remote Sensing Science and Technology",
        mentors: [
          {
            name: "Yiping Chen",
            href: "https://scholar.google.com/citations?user=e9lv2fUAAAAJ&hl=en",
          },
        ],
      }),
    );
  });

  it("keeps email as a single hero action and exposes useful profile links", () => {
    const profile = readMarkdown<Profile>(
      join(contentRoot, "profile/about.md"),
    );

    expect(profile.profileNotes).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ icon: "education" }),
        expect.objectContaining({ icon: "development" }),
        expect.objectContaining({ icon: "culture" }),
      ]),
    );
    expect(profile.aboutHeading).toBe(
      "3D vision, generative models, and open tools.",
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
    expect(profile.socials).toContainEqual(
      expect.objectContaining({
        kind: "music",
        href: "https://music.163.com/#/user/home?id=305616045",
        primary: true,
      }),
    );
  });

  it("loads scalable interest galleries from Markdown", () => {
    const interests = readMarkdownDirectory<Interest>("interests");
    const itemCounts = Object.fromEntries(
      interests.map((interest) => [interest.name, interest.items.length]),
    );

    expect(Object.keys(itemCounts)).toEqual(
      expect.arrayContaining(["Anime", "K-pop", "Games"]),
    );

    const imageSources = interests.flatMap((interest) =>
      interest.items.map((item) => item.image),
    );

    for (const interest of interests) {
      expect(interest.duration).toBeGreaterThan(0);
      expect(interest.items.length).toBeGreaterThan(0);
      expect(
        interest.items.every(
          (item) =>
            item.image.startsWith("https://") ||
            item.image.startsWith("local:"),
        ),
      ).toBe(true);
    }

    expect(imageSources.some((image) => image.startsWith("local:"))).toBe(true);
    for (const image of imageSources.filter((source) =>
      source.startsWith("local:"),
    )) {
      expect(
        existsSync(
          join(
            process.cwd(),
            "src/assets/interests",
            image.slice("local:".length),
          ),
        ),
      ).toBe(true);
    }
  });
});
