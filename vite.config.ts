import { mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { basename, join } from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { parseFrontmatter } from "./src/content/frontmatter";
import { blogHref, estimateReadingMinutes } from "./src/content/blogUtils";

const profilePath = fileURLToPath(
  new URL("./src/content/profile/about.md", import.meta.url),
);
const blogDirectory = fileURLToPath(
  new URL("./src/content/blogs", import.meta.url),
);
const outputDirectory = fileURLToPath(new URL("./dist", import.meta.url));
const siteOrigin = "https://longhz140516.github.io";

interface BlogBuildMetadata {
  title: string;
  summary: string;
  date: string;
  updated?: string;
  cover?: string;
  draft?: boolean;
}

const collectionPages = [
  {
    path: "blog",
    title: "Blog | Zilong Huang",
    description:
      "Notes on research, building, and ideas by Zilong Huang.",
  },
  {
    path: "publications",
    title: "Publications | Zilong Huang",
    description:
      "Research publications by Zilong Huang across 3D vision, generative models, visual reasoning, and remote sensing.",
  },
  {
    path: "projects",
    title: "Projects | Zilong Huang",
    description:
      "Open-source tools and research experiments built by Zilong Huang.",
  },
] as const;

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function escapeXml(value: string): string {
  return escapeHtml(value).replaceAll("'", "&apos;");
}

function blogSlug(filename: string): string {
  return basename(filename, ".md");
}

function absoluteBlogUrl(slug: string): string {
  return `${siteOrigin}${blogHref(slug)}`;
}

function blogOutputDirectory(slug: string): string {
  return join(outputDirectory, ...blogHref(slug).split("/").filter(Boolean));
}

function collectionHref(path: string): string {
  return `/${path}/`;
}

interface PageMetadata {
  canonical: string;
  description: string;
  title: string;
}

function applyPageMetadata(
  sourceHtml: string,
  metadata: PageMetadata,
): string {
  let html = sourceHtml
    .replace(
      /<title>[^<]*<\/title>/,
      `<title>${escapeHtml(metadata.title)}</title>`,
    )
    .replace(
      /<link rel="canonical" href="[^"]*" \/>/,
      `<link rel="canonical" href="${metadata.canonical}" />`,
    )
    .replace(/\s*<link\s+rel="preload"[\s\S]*?fetchpriority="high"\s*\/>/, "");

  html = replaceMetaContent(html, "name", "description", metadata.description);
  html = replaceMetaContent(html, "property", "og:title", metadata.title);
  html = replaceMetaContent(
    html,
    "property",
    "og:description",
    metadata.description,
  );

  return html;
}

function makeCollectionHtml(
  sourceHtml: string,
  page: (typeof collectionPages)[number],
): string {
  return applyPageMetadata(sourceHtml, {
    canonical: `${siteOrigin}${collectionHref(page.path)}`,
    description: page.description,
    title: page.title,
  });
}

function blogFiles(): string[] {
  return readdirSync(blogDirectory)
    .filter((filename) => filename.endsWith(".md"))
    .sort();
}

function replaceMetaContent(
  html: string,
  attribute: "name" | "property",
  key: string,
  content: string,
): string {
  const expression = new RegExp(
    `<meta\\s+${attribute}="${key}"\\s+content="[^"]*"\\s*\\/>`,
  );

  return html.replace(
    expression,
    `<meta ${attribute}="${key}" content="${escapeHtml(content)}" />`,
  );
}

function makeBlogHtml(
  sourceHtml: string,
  slug: string,
  metadata: BlogBuildMetadata,
): string {
  const canonical = absoluteBlogUrl(slug);
  const title = `${metadata.title} | Zilong Huang`;
  let html = applyPageMetadata(sourceHtml, {
    canonical,
    description: metadata.summary,
    title,
  });
  html = replaceMetaContent(html, "property", "og:type", "article");

  const articleMeta = `\n    <meta property="article:published_time" content="${escapeHtml(metadata.date)}" />`;
  html = html.replace(
    '<meta property="og:type" content="article" />',
    `<meta property="og:type" content="article" />${articleMeta}`,
  );

  if (metadata.cover) {
    const coverUrl = metadata.cover.startsWith("http")
      ? metadata.cover
      : `${siteOrigin}/${metadata.cover.replace(/^\.?\//, "")}`;
    html = html.replace(
      articleMeta,
      `${articleMeta}\n    <meta property="og:image" content="${escapeHtml(coverUrl)}" />`,
    );
  }

  if (metadata.updated) {
    html = html.replace(
      articleMeta,
      `${articleMeta}\n    <meta property="article:modified_time" content="${escapeHtml(metadata.updated)}" />`,
    );
  }

  return html;
}

function staticBlogPages() {
  return {
    name: "static-blog-pages",
    closeBundle() {
      const indexPath = join(outputDirectory, "index.html");
      const sourceHtml = readFileSync(indexPath, "utf8");
      const sitemapEntries: string[] = [];

      for (const page of collectionPages) {
        const pageDirectory = join(outputDirectory, page.path);
        mkdirSync(pageDirectory, { recursive: true });
        writeFileSync(
          join(pageDirectory, "index.html"),
          makeCollectionHtml(sourceHtml, page),
        );
        sitemapEntries.push(
          [
            "  <url>",
            `    <loc>${escapeXml(`${siteOrigin}${collectionHref(page.path)}`)}</loc>`,
            "    <changefreq>monthly</changefreq>",
            "    <priority>0.8</priority>",
            "  </url>",
          ].join("\n"),
        );
      }

      for (const filename of blogFiles()) {
        const slug = blogSlug(filename);
        const source = readFileSync(join(blogDirectory, filename), "utf8");
        const { data } = parseFrontmatter<BlogBuildMetadata>(source);

        if (data.draft) {
          continue;
        }

        if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
          throw new Error(
            `Blog filename "${filename}" must use a lowercase kebab-case slug.`,
          );
        }

        const articleDirectory = blogOutputDirectory(slug);
        mkdirSync(articleDirectory, { recursive: true });
        writeFileSync(
          join(articleDirectory, "index.html"),
          makeBlogHtml(sourceHtml, slug, data),
        );
        sitemapEntries.push(
          [
            "  <url>",
            `    <loc>${escapeXml(absoluteBlogUrl(slug))}</loc>`,
            `    <lastmod>${escapeXml(data.updated ?? data.date)}</lastmod>`,
            "    <changefreq>monthly</changefreq>",
            "    <priority>0.7</priority>",
            "  </url>",
          ].join("\n"),
        );
      }

      const sitemapPath = join(outputDirectory, "sitemap.xml");
      const sitemap = readFileSync(sitemapPath, "utf8").replace(
        "</urlset>",
        `${sitemapEntries.join("\n")}\n</urlset>`,
      );
      writeFileSync(sitemapPath, sitemap);
    },
  };
}

function markdownFrontmatter() {
  return {
    name: "markdown-frontmatter",
    enforce: "pre" as const,
    transform(source: string, id: string) {
      const cleanId = id.split("?", 1)[0];

      if (!cleanId.includes("/src/content/") || !cleanId.endsWith(".md")) {
        return null;
      }

      const { data: frontmatter, body } =
        parseFrontmatter<Record<string, unknown>>(source);

      if (cleanId.includes("/src/content/blogs/")) {
        frontmatter.readingMinutes = estimateReadingMinutes(body);
      }

      const exports = [
        `export const frontmatter = ${JSON.stringify(frontmatter)};`,
      ];

      if (!id.includes("?metadata")) {
        exports.push(`export default ${JSON.stringify(body)};`);
      }

      return {
        code: exports.join("\n"),
        map: null,
      };
    },
    transformIndexHtml(html: string) {
      const profileSource = readFileSync(profilePath, "utf8");
      const { data } = parseFrontmatter<{ name: string; bio: string }>(
        profileSource,
      );

      return html
        .replaceAll("__PROFILE_NAME__", escapeHtml(data.name))
        .replaceAll("__PROFILE_BIO__", escapeHtml(data.bio));
    },
  };
}

export default defineConfig({
  // LongHZ140516.github.io is a user site, so GitHub Pages serves it at `/`.
  base: "/",
  plugins: [markdownFrontmatter(), react(), staticBlogPages()],
  build: {
    target: "es2022",
    cssCodeSplit: true,
    sourcemap: true,
  },
});
