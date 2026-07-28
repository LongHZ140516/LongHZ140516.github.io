import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { parseFrontmatter } from "./src/content/frontmatter";

const profilePath = fileURLToPath(
  new URL("./src/content/profile/about.md", import.meta.url),
);

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function markdownFrontmatter() {
  return {
    name: "markdown-frontmatter",
    enforce: "pre" as const,
    transform(source: string, id: string) {
      if (!id.includes("/src/content/") || !id.endsWith(".md")) {
        return null;
      }

      const { data: frontmatter, body } =
        parseFrontmatter<Record<string, unknown>>(source);

      return {
        code: [
          `export const frontmatter = ${JSON.stringify(frontmatter)};`,
          `export default ${JSON.stringify(body)};`,
        ].join("\n"),
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
  base: "./",
  plugins: [markdownFrontmatter(), react()],
  build: {
    target: "es2022",
    cssCodeSplit: true,
    sourcemap: true,
  },
});
