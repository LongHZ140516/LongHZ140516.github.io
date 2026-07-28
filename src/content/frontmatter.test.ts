import { describe, expect, it } from "vitest";
import { parseFrontmatter } from "./frontmatter";
import {
  formatStarCount,
  initialsForName,
  slugFromPath,
} from "./contentUtils";

describe("parseFrontmatter", () => {
  it("parses nested YAML and keeps the optional Markdown body", () => {
    const result = parseFrontmatter<{ name: string; tags: string[] }>(
      "---\nname: Serein\ntags:\n  - Research\n  - 3D\n---\nA short note.",
    );

    expect(result.data).toEqual({
      name: "Serein",
      tags: ["Research", "3D"],
    });
    expect(result.body).toBe("A short note.");
  });

  it("rejects content without frontmatter", () => {
    expect(() => parseFrontmatter("plain Markdown")).toThrow(
      "must begin with YAML frontmatter",
    );
  });
});

describe("content helpers", () => {
  it("derives stable slugs from Markdown paths", () => {
    expect(slugFromPath("/content/publications/Scene4U.md")).toBe("Scene4U");
  });

  it("formats repository stars compactly", () => {
    expect(formatStarCount(43)).toBe("43");
    expect(formatStarCount(1_032)).toBe("1k");
    expect(formatStarCount(23_344)).toBe("23k");
  });

  it("derives a compact monogram from profile content", () => {
    expect(initialsForName("Zilong Huang")).toBe("ZH");
    expect(initialsForName("Serein")).toBe("SE");
  });
});
