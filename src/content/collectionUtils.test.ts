import { describe, expect, it } from "vitest";
import type { BlogPost, Project, Publication } from "./types";
import {
  collectionRouteFromPath,
  filterBlogs,
  filterProjects,
  filterPublications,
  uniqueOptions,
} from "./collectionUtils";

const publications: Publication[] = [
  {
    slug: "paper-a",
    title: "World Models for 3D Generation",
    venue: "CVPR 2026",
    authors: ["Zilong Huang", "Ada Example"],
    image: "/paper-a.webp",
    imageAlt: "Paper A",
    paperUrl: "https://example.com/paper-a",
    date: "2025-11-12",
    highlight: false,
    tags: ["3D Generation", "World Models"],
  },
  {
    slug: "paper-b",
    title: "Remote Sensing Segmentation",
    venue: "TGRS 2024",
    authors: ["Lin Example"],
    image: "/paper-b.webp",
    imageAlt: "Paper B",
    paperUrl: "https://example.com/paper-b",
    date: "2024-03-02",
    highlight: false,
    tags: ["Remote Sensing"],
  },
];

const projects: Project[] = [
  {
    slug: "tool-a",
    name: "Paper Gallery",
    description: "A visual archive for research papers.",
    tags: ["Frontend", "Research Tools"],
    image: "/tool-a.webp",
    imageAlt: "Tool A",
    link: "https://example.com/tool-a",
    githubRepo: "example/tool-a",
    stars: 12,
  },
];

const blogs: BlogPost[] = [
  {
    slug: "note-a",
    title: "Building a Durable Blog",
    summary: "Notes on a Markdown content pipeline.",
    date: "2026-08-07",
    category: "Site Notes",
    tags: ["Design", "Markdown"],
    readingMinutes: 4,
  },
];

describe("collection archive helpers", () => {
  it("recognises only the three top-level collection routes", () => {
    expect(collectionRouteFromPath("/blog/")).toBe("blog");
    expect(collectionRouteFromPath("/publications")).toBe("publications");
    expect(collectionRouteFromPath("/projects/")).toBe("projects");
    expect(collectionRouteFromPath("/blog/note-a/")).toBeNull();
    expect(collectionRouteFromPath("/")).toBeNull();
  });

  it("searches publication metadata and combines topic and year filters", () => {
    expect(
      filterPublications(publications, {
        query: "world zilong",
        topic: "3D Generation",
        year: "2025",
      }).map((item) => item.slug),
    ).toEqual(["paper-a"]);
    expect(
      filterPublications(publications, {
        query: "",
        topic: "Remote Sensing",
        year: "2025",
      }),
    ).toEqual([]);
  });

  it("searches project and blog copy with their relevant facets", () => {
    expect(
      filterProjects(projects, {
        query: "visual research",
        topic: "Frontend",
      }),
    ).toEqual(projects);
    expect(
      filterBlogs(blogs, {
        query: "markdown pipeline",
        topic: "Design",
        category: "Site Notes",
      }),
    ).toEqual(blogs);
    expect(
      filterBlogs(blogs, {
        query: "markdown",
        topic: "Design",
        category: "Research Notes",
      }),
    ).toEqual([]);
  });

  it("returns sorted, case-insensitive facet values without duplicates", () => {
    expect(uniqueOptions(["Design", "markdown", "design", "3D"])).toEqual([
      "3D",
      "Design",
      "markdown",
    ]);
  });
});
