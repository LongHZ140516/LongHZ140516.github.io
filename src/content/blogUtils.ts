export function estimateReadingMinutes(markdown: string): number {
  const prose = markdown
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`[^`]+`/g, " ")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/[#>*_~|=-]/g, " ");
  const cjkCharacters =
    prose.match(
      /[\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Hangul}]/gu,
    )?.length ?? 0;
  const latinWords =
    prose
      .replace(
        /[\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Hangul}]/gu,
        " ",
      )
      .match(/[\p{L}\p{N}]+(?:['’-][\p{L}\p{N}]+)*/gu)?.length ?? 0;

  return Math.max(1, Math.ceil(cjkCharacters / 350 + latinWords / 220));
}

export function createHeadingSlugger() {
  const counts = new Map<string, number>();

  return (value: string): string => {
    const base =
      value
        .normalize("NFKC")
        .toLocaleLowerCase("en")
        .replace(/[^\p{L}\p{N}\s-]/gu, "")
        .trim()
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-") || "section";
    const count = counts.get(base) ?? 0;
    counts.set(base, count + 1);

    return count === 0 ? base : `${base}-${count + 1}`;
  };
}

const BLOG_ROUTE_PREFIX = "/blog/";

export function blogHref(slug: string): string {
  return `${BLOG_ROUTE_PREFIX}${encodeURIComponent(slug)}/`;
}

export function blogSlugFromPath(pathname: string): string | null {
  if (!pathname.startsWith(BLOG_ROUTE_PREFIX)) {
    return null;
  }

  const remainder = pathname.slice(BLOG_ROUTE_PREFIX.length);
  const encodedSlug = remainder.endsWith("/")
    ? remainder.slice(0, -1)
    : remainder;

  if (!encodedSlug || encodedSlug.includes("/")) {
    return null;
  }

  try {
    return decodeURIComponent(encodedSlug);
  } catch {
    return null;
  }
}

export function formatBlogDate(date: string): string {
  return new Intl.DateTimeFormat("en", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${date}T00:00:00Z`));
}
