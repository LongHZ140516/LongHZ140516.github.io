import { ArrowLeft, ArrowRight } from "@phosphor-icons/react";
import { blogSiblingHref } from "../content/blogUtils";
import type { BlogPost } from "../content/types";

interface BlogArticleNavigationProps {
  currentSlug: string;
  posts: readonly BlogPost[];
  returnSearch: string;
}

export function BlogArticleNavigation({
  currentSlug,
  posts,
  returnSearch,
}: BlogArticleNavigationProps) {
  const currentIndex = posts.findIndex((item) => item.slug === currentSlug);
  const newerPost = currentIndex > 0 ? posts[currentIndex - 1] : undefined;
  const olderPost =
    currentIndex >= 0 && currentIndex < posts.length - 1
      ? posts[currentIndex + 1]
      : undefined;

  if (!newerPost && !olderPost) {
    return null;
  }

  return (
    <nav
      className="article-post-navigation page-shell"
      aria-label="More blog articles"
    >
      {newerPost ? (
        <a
          className="article-post-link article-post-link--newer"
          href={blogSiblingHref(newerPost.slug, returnSearch)}
        >
          <ArrowLeft size={17} weight="regular" aria-hidden="true" />
          <span>
            <small>Newer article</small>
            <strong>{newerPost.title}</strong>
          </span>
        </a>
      ) : (
        <span />
      )}
      {olderPost ? (
        <a
          className="article-post-link article-post-link--older"
          href={blogSiblingHref(olderPost.slug, returnSearch)}
        >
          <span>
            <small>Older article</small>
            <strong>{olderPost.title}</strong>
          </span>
          <ArrowRight size={17} weight="regular" aria-hidden="true" />
        </a>
      ) : null}
    </nav>
  );
}
