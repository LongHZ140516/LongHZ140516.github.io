import {
  Children,
  isValidElement,
  type ComponentPropsWithoutRef,
  type ReactNode,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  ArrowUpRight,
  CaretDown,
  Check,
  Copy,
  FileCode,
} from "@phosphor-icons/react";
import ReactMarkdown, { type Components } from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import rehypeKatex from "rehype-katex";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import "katex/dist/katex.min.css";
import {
  buildTableOfContents,
  remarkHeadingAnchors,
  type TableOfContentsItem,
} from "../content/blogMarkdown";
import { assetUrl } from "../content/contentUtils";

function textFromNode(node: ReactNode): string {
  if (typeof node === "string" || typeof node === "number") {
    return String(node);
  }

  if (Array.isArray(node)) {
    return node.map(textFromNode).join("");
  }

  if (isValidElement<{ children?: ReactNode }>(node)) {
    return textFromNode(node.props.children);
  }

  return "";
}

function languageFromChildren(children: ReactNode): string | null {
  const code = Children.toArray(children).find((child) =>
    isValidElement<{ className?: string }>(child),
  );

  if (!isValidElement<{ className?: string }>(code)) {
    return null;
  }

  const match = code.props.className?.match(/language-([\w-]+)/);
  return match?.[1] ?? null;
}

function MarkdownPre({ children, ...props }: ComponentPropsWithoutRef<"pre">) {
  const [copied, setCopied] = useState(false);
  const resetTimer = useRef<number | null>(null);
  const language = languageFromChildren(children);
  const source = textFromNode(children).replace(/\n$/, "");

  useEffect(
    () => () => {
      if (resetTimer.current) {
        window.clearTimeout(resetTimer.current);
      }
    },
    [],
  );

  const copySource = async () => {
    try {
      await navigator.clipboard.writeText(source);
      setCopied(true);
    } catch {
      return;
    }

    if (resetTimer.current) {
      window.clearTimeout(resetTimer.current);
    }

    resetTimer.current = window.setTimeout(() => setCopied(false), 1600);
  };

  return (
    <div className="code-frame">
      <div className="code-frame__toolbar">
        <span className="code-frame__language">
          <FileCode size={14} weight="regular" aria-hidden="true" />
          {language ?? "text"}
        </span>
        <button
          type="button"
          onClick={copySource}
          aria-label={copied ? "Code copied" : "Copy code"}
        >
          {copied ? (
            <Check size={14} weight="regular" aria-hidden="true" />
          ) : (
            <Copy size={14} weight="regular" aria-hidden="true" />
          )}
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <pre {...props}>{children}</pre>
    </div>
  );
}

function useActiveHeading(items: TableOfContentsItem[]): string | null {
  const [activeId, setActiveId] = useState<string | null>(items[0]?.id ?? null);
  const ids = useMemo(() => items.map((item) => item.id), [items]);

  useEffect(() => {
    if (!ids.length) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort(
            (left, right) =>
              left.boundingClientRect.top - right.boundingClientRect.top,
          );

        if (visible[0]) {
          setActiveId(visible[0].target.id);
        }
      },
      { rootMargin: "-96px 0px -68% 0px", threshold: [0, 1] },
    );

    for (const id of ids) {
      const heading = document.getElementById(id);

      if (heading) {
        observer.observe(heading);
      }
    }

    return () => observer.disconnect();
  }, [ids]);

  return activeId;
}

function ArticleToc({ items }: { items: TableOfContentsItem[] }) {
  const activeId = useActiveHeading(items);

  if (!items.length) {
    return null;
  }

  const links = (
    <ol>
      {items.map((item) => (
        <li key={item.id} data-level={item.level}>
          <a
            href={`#${item.id}`}
            aria-current={activeId === item.id ? "location" : undefined}
          >
            {item.text}
          </a>
        </li>
      ))}
    </ol>
  );

  return (
    <>
      <aside
        className="article-toc article-toc--desktop"
        aria-label="Article contents"
      >
        <p>Contents</p>
        {links}
      </aside>
      <details className="article-toc article-toc--mobile">
        <summary>
          <span>Contents</span>
          <CaretDown
            className="article-toc__caret"
            size={15}
            weight="bold"
            aria-hidden="true"
          />
        </summary>
        {links}
      </details>
    </>
  );
}

export function MarkdownArticle({ source }: { source: string }) {
  const toc = useMemo(() => buildTableOfContents(source), [source]);
  const components = useMemo<Components>(
    () => ({
      a({ href = "", children, node: _node, ...props }) {
        const external = /^https?:\/\//.test(href);

        return (
          <a
            {...props}
            href={href}
            target={external ? "_blank" : undefined}
            rel={external ? "noreferrer" : undefined}
          >
            {children}
            {external ? (
              <ArrowUpRight
                className="markdown-external-icon"
                size={12}
                weight="regular"
                aria-hidden="true"
              />
            ) : null}
          </a>
        );
      },
      img({ src = "", alt = "", node: _node, ...props }) {
        const resolvedSource = /^(https?:|data:|\/)/.test(src)
          ? src
          : assetUrl(src);

        return (
          <span className="markdown-figure">
            <img {...props} src={resolvedSource} alt={alt} loading="lazy" />
            {alt ? (
              <span className="markdown-figure__caption">{alt}</span>
            ) : null}
          </span>
        );
      },
      pre: MarkdownPre,
      table({ children, node: _node, ...props }) {
        return (
          <div className="markdown-table-wrap" tabIndex={0}>
            <table {...props}>{children}</table>
          </div>
        );
      },
    }),
    [],
  );

  return (
    <div className="article-content-grid">
      <ArticleToc items={toc} />
      <div className="markdown-body">
        <ReactMarkdown
          remarkPlugins={[remarkGfm, remarkMath, remarkHeadingAnchors]}
          rehypePlugins={[rehypeKatex, rehypeHighlight]}
          components={components}
        >
          {source}
        </ReactMarkdown>
      </div>
    </div>
  );
}
