import { useEffect, useState } from "react";
import { ArrowLeft, ArrowUpRight } from "@phosphor-icons/react";
import { formatBlogDate } from "../content/blogUtils";
import { loadBlogArticle } from "../content/loadContent";
import type { BlogPost } from "../content/types";
import { BlogCover } from "./BlogCover";
import { MarkdownArticle } from "./MarkdownArticle";

interface BlogArticlePageProps {
  post?: BlogPost;
  slug: string;
}

function ArticleLoadError({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="article-state" role="alert">
      <h2>The article could not be loaded.</h2>
      <p>Please check the connection and try once more.</p>
      <button
        className="button button--secondary"
        type="button"
        onClick={onRetry}
      >
        Try again
      </button>
    </div>
  );
}

export default function BlogArticlePage({ post, slug }: BlogArticlePageProps) {
  const [source, setSource] = useState<string | null>(null);
  const [error, setError] = useState(false);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    if (!post) {
      return;
    }

    let active = true;
    setSource(null);
    setError(false);

    loadBlogArticle(slug)
      .then((article) => {
        if (active) {
          setSource(article);
        }
      })
      .catch(() => {
        if (active) {
          setError(true);
        }
      });

    return () => {
      active = false;
    };
  }, [attempt, post, slug]);

  useEffect(() => {
    if (!post) {
      return;
    }

    const previousTitle = document.title;
    document.title = `${post.title} | Zilong Huang`;
    return () => {
      document.title = previousTitle;
    };
  }, [post]);

  if (!post) {
    return (
      <section className="article-state article-state--not-found page-shell">
        <p className="eyebrow">Not found</p>
        <h1>This page has no article.</h1>
        <a className="button button--primary" href="/#blog">
          Back to Blog
        </a>
      </section>
    );
  }

  return (
    <article className="blog-article" id="article-top">
      <header className="article-hero page-shell">
        <a className="article-back-link" href="/#blog">
          <ArrowLeft size={16} weight="regular" aria-hidden="true" />
          Blog
        </a>
        <div className="article-hero__meta">
          <span>{post.category}</span>
          <time dateTime={post.date}>{formatBlogDate(post.date)}</time>
          {post.updated ? (
            <span>Updated {formatBlogDate(post.updated)}</span>
          ) : null}
          <span>{post.readingMinutes} min read</span>
        </div>
        <h1>{post.title}</h1>
        <p>{post.summary}</p>
        <div className="article-hero__cover">
          <BlogCover post={post} priority />
        </div>
      </header>

      <div className="article-reading page-shell">
        {error ? (
          <ArticleLoadError onRetry={() => setAttempt((value) => value + 1)} />
        ) : source ? (
          <MarkdownArticle source={source} />
        ) : (
          <div className="article-loading" aria-label="Loading article">
            <span />
            <span />
            <span />
            <span />
          </div>
        )}
      </div>

      <div className="article-end page-shell">
        <p>End of article</p>
        <a href="/#blog">
          All writing
          <ArrowUpRight size={15} weight="regular" aria-hidden="true" />
        </a>
      </div>
    </article>
  );
}
