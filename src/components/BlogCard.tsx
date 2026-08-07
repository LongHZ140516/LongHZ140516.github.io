import { ArrowUpRight } from "@phosphor-icons/react";
import { blogHref, formatBlogDate } from "../content/blogUtils";
import type { BlogPost } from "../content/types";
import { BlogCover } from "./BlogCover";

export function BlogCard({ post }: { post: BlogPost }) {
  const href = blogHref(post.slug);

  return (
    <article
      className={`blog-card${post.featured ? " blog-card--featured" : ""}`}
    >
      <a
        className="blog-card__cover"
        href={href}
        aria-label={`Read ${post.title}`}
      >
        <BlogCover post={post} />
      </a>
      <div className="blog-card__copy">
        <div className="blog-card__meta">
          <time dateTime={post.date}>{formatBlogDate(post.date)}</time>
          <span>{post.readingMinutes} min read</span>
        </div>
        <h3>
          <a href={href}>{post.title}</a>
        </h3>
        <p>{post.summary}</p>
        <div className="blog-card__footer">
          <div className="tag-list" aria-label="Article topics">
            {post.tags.map((tag) => (
              <span key={tag}>{tag}</span>
            ))}
          </div>
          <a
            className="blog-card__link"
            href={href}
            aria-label={`Read ${post.title}`}
          >
            Read
            <ArrowUpRight size={15} weight="regular" aria-hidden="true" />
          </a>
        </div>
      </div>
    </article>
  );
}
