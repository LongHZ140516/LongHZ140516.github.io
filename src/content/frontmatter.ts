import { parse } from "yaml";

export interface ParsedFrontmatter<T> {
  data: T;
  body: string;
}

export function parseFrontmatter<T>(source: string): ParsedFrontmatter<T> {
  const normalized = source.replace(/\r\n/g, "\n");

  if (!normalized.startsWith("---\n")) {
    throw new Error("Content file must begin with YAML frontmatter.");
  }

  const closingDelimiter = normalized.indexOf("\n---", 4);

  if (closingDelimiter === -1) {
    throw new Error("Content file is missing its closing frontmatter delimiter.");
  }

  const frontmatter = normalized.slice(4, closingDelimiter);
  const bodyStart = closingDelimiter + 4;

  return {
    data: parse(frontmatter) as T,
    body: normalized.slice(bodyStart).trim(),
  };
}
