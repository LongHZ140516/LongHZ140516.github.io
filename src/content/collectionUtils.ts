import type { BlogPost, Project, Publication } from "./types";

export type CollectionRoute = "blog" | "publications" | "projects";

interface CommonFilter {
  query: string;
  topic: string;
}

export interface PublicationFilter extends CommonFilter {
  year: string;
}

export interface BlogFilter extends CommonFilter {
  category: string;
}

const collectionRoutes = new Set<CollectionRoute>([
  "blog",
  "publications",
  "projects",
]);

export function collectionRouteFromPath(
  pathname: string,
): CollectionRoute | null {
  const match = pathname.match(/^\/(blog|publications|projects)\/?$/);
  const route = match?.[1] as CollectionRoute | undefined;

  return route && collectionRoutes.has(route) ? route : null;
}

function includesQuery(query: string, values: Array<string | number>): boolean {
  const haystack = values.join(" ").toLocaleLowerCase("en");
  const terms = query
    .trim()
    .toLocaleLowerCase("en")
    .split(/\s+/)
    .filter(Boolean);

  return terms.every((term) => haystack.includes(term));
}

function matchesFacet(value: string, candidates: readonly string[]): boolean {
  return !value || candidates.includes(value);
}

export function filterPublications(
  publications: readonly Publication[],
  filter: PublicationFilter,
): Publication[] {
  return publications.filter((publication) => {
    const year = publication.date.slice(0, 4);

    return (
      includesQuery(filter.query, [
        publication.title,
        publication.venue,
        publication.authors.join(" "),
        publication.tags.join(" "),
        year,
      ]) &&
      matchesFacet(filter.topic, publication.tags) &&
      (!filter.year || filter.year === year)
    );
  });
}

export function filterProjects(
  projects: readonly Project[],
  filter: CommonFilter,
): Project[] {
  return projects.filter(
    (project) =>
      includesQuery(filter.query, [
        project.name,
        project.description,
        project.tags.join(" "),
        project.githubRepo,
      ]) && matchesFacet(filter.topic, project.tags),
  );
}

export function filterBlogs(
  blogs: readonly BlogPost[],
  filter: BlogFilter,
): BlogPost[] {
  return blogs.filter(
    (post) =>
      includesQuery(filter.query, [
        post.title,
        post.summary,
        post.category,
        post.tags.join(" "),
        post.date,
      ]) &&
      matchesFacet(filter.topic, post.tags) &&
      (!filter.category || filter.category === post.category),
  );
}

export function uniqueOptions(values: readonly string[]): string[] {
  const unique = new Map<string, string>();

  for (const value of values) {
    const key = value.toLocaleLowerCase("en");

    if (!unique.has(key)) {
      unique.set(key, value);
    }
  }

  return [...unique.values()].sort((left, right) =>
    left.localeCompare(right, "en", { sensitivity: "base" }),
  );
}
