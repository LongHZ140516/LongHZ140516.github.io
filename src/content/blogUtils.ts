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

export interface BlogLinkContext {
  from: "archive" | "home";
  page: number;
}

function safePage(value: number): number {
  return Number.isFinite(value) && value > 0 ? Math.floor(value) : 1;
}

export function blogHref(slug: string, context?: BlogLinkContext): string {
  const href = `${BLOG_ROUTE_PREFIX}${encodeURIComponent(slug)}/`;

  if (!context) {
    return href;
  }

  const search = new URLSearchParams({
    from: context.from,
    blogPage: String(safePage(context.page)),
  });

  return `${href}?${search.toString()}`;
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

export function blogPageFromSearch(search: string): number {
  const value = Number.parseInt(
    new URLSearchParams(search).get("blogPage") ?? "1",
    10,
  );

  return safePage(value);
}

export function blogReturnHref(search: string): string {
  const params = new URLSearchParams(search);
  const page = blogPageFromSearch(search);

  if (params.get("from") === "home") {
    return `/?blogPage=${page}#blog`;
  }

  return params.get("from") === "archive"
    ? `/blog/?blogPage=${page}`
    : "/blog/";
}

export function blogSiblingHref(slug: string, search: string): string {
  const params = new URLSearchParams(search);

  const from = params.get("from");

  return from === "home" || from === "archive"
    ? blogHref(slug, {
        from,
        page: blogPageFromSearch(search),
      })
    : blogHref(slug);
}

export function formatBlogDate(date: string): string {
  return new Intl.DateTimeFormat("en", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${date}T00:00:00Z`));
}
