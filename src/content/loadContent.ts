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

const localInterestImageModules = import.meta.glob(
  "../assets/interests/**/*.{avif,jpg,jpeg,png,webp}",
  {
    eager: true,
    import: "default",
    query: "?url",
  },
) as Record<string, string>;

const localInterestImages = new Map(
  Object.entries(localInterestImageModules).map(([path, url]) => [
    path.replace("../assets/interests/", ""),
    url,
  ]),
);

function loadCollection<T extends object>(
  modules: Record<string, T>,
): Array<T & { slug: string }> {
  return Object.entries(modules).map(([path, frontmatter]) => ({
    ...frontmatter,
    slug: slugFromPath(path),
  }));
}

function resolveInterestImage(image: string): string {
  const localPrefix = "local:";

  if (!image.startsWith(localPrefix)) {
    return image;
  }

  const assetPath = image.slice(localPrefix.length).replace(/^\/+/, "");
  const resolvedImage = localInterestImages.get(assetPath);

  if (!resolvedImage) {
    throw new Error(
      `Unknown local interest image "${assetPath}". Add it under src/assets/interests/.`,
    );
  }

  return resolvedImage;
}

function loadInterests(): Interest[] {
  return loadCollection(interestModules)
    .map((interest) => ({
      ...interest,
      items: interest.items.map((item) => ({
        ...item,
        image: resolveInterestImage(item.image),
      })),
    }))
    .sort((left, right) => left.name.localeCompare(right.name));
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
  interests: loadInterests(),
};
