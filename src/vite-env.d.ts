/// <reference types="vite/client" />

declare module "*.md" {
  export const frontmatter: unknown;
  const body: string;
  export default body;
}
