import { toString } from "mdast-util-to-string";
import type { Root } from "mdast";
import remarkParse from "remark-parse";
import { unified } from "unified";
import { visit } from "unist-util-visit";
import { createHeadingSlugger } from "./blogUtils";

export interface TableOfContentsItem {
  id: string;
  text: string;
  level: 2 | 3;
}

function decorateHeadings(tree: Root): TableOfContentsItem[] {
  const slug = createHeadingSlugger();
  const items: TableOfContentsItem[] = [];

  visit(tree, "heading", (node) => {
    const text = toString(node).trim();

    if (!text) {
      return;
    }

    const id = slug(text);
    node.data = {
      ...node.data,
      hProperties: {
        ...node.data?.hProperties,
        id,
      },
    };

    if (node.depth === 2 || node.depth === 3) {
      items.push({ id, text, level: node.depth });
    }
  });

  return items;
}

export function remarkHeadingAnchors() {
  return (tree: Root) => {
    decorateHeadings(tree);
  };
}

export function buildTableOfContents(markdown: string): TableOfContentsItem[] {
  const tree = unified().use(remarkParse).parse(markdown);
  return decorateHeadings(tree);
}
