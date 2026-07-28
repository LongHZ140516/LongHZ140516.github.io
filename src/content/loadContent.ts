import type {
  Interest,
  Profile,
  Project,
  Publication,
  SiteContent,
} from "./types";
import { slugFromPath } from "./contentUtils";

const profileModules = import.meta.glob("./profile/*.md", {
  eager: true,
  import: "frontmatter",
}) as Record<string, Profile>;

const publicationModules = import.meta.glob("./publications/*.md", {
  eager: true,
  import: "frontmatter",
}) as Record<string, Omit<Publication, "slug">>;

const projectModules = import.meta.glob("./projects/*.md", {
  eager: true,
  import: "frontmatter",
}) as Record<string, Omit<Project, "slug">>;

const interestModules = import.meta.glob("./interests/*.md", {
  eager: true,
  import: "frontmatter",
}) as Record<string, Omit<Interest, "slug">>;

function loadCollection<T extends object>(
  modules: Record<string, T>,
): Array<T & { slug: string }> {
  return Object.entries(modules).map(([path, frontmatter]) => ({
    ...frontmatter,
    slug: slugFromPath(path),
  }));
}

const profileData = Object.values(profileModules)[0];

if (!profileData) {
  throw new Error("Expected one profile Markdown file in src/content/profile.");
}

export const siteContent: SiteContent = {
  profile: profileData,
  publications: loadCollection(publicationModules).sort(
    (left, right) =>
      new Date(right.date).getTime() - new Date(left.date).getTime(),
  ),
  projects: loadCollection(projectModules),
  interests: loadCollection(interestModules).sort(
    (left, right) => left.name.localeCompare(right.name),
  ),
};
