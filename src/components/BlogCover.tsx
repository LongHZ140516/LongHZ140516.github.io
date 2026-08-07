import { assetUrl } from "../content/contentUtils";
import type { BlogPost } from "../content/types";

function coverSeed(slug: string): number {
  return Array.from(slug).reduce(
    (value, character) => (value * 31 + character.charCodeAt(0)) % 360,
    0,
  );
}

interface BlogCoverProps {
  post: BlogPost;
  priority?: boolean;
}

export function BlogCover({ post, priority = false }: BlogCoverProps) {
  if (post.cover) {
    return (
      <img
        src={assetUrl(post.cover)}
        alt={post.coverAlt ?? `Cover for ${post.title}`}
        width="1200"
        height="720"
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : "auto"}
      />
    );
  }

  const seed = coverSeed(post.slug);
  const circleX = 150 + (seed % 150);
  const circleY = 98 + ((seed * 7) % 96);
  const lineOffset = 80 + ((seed * 11) % 160);

  return (
    <svg
      className="blog-cover-art"
      viewBox="0 0 1200 720"
      role="img"
      aria-label={`Generated geometric cover for ${post.title}`}
      preserveAspectRatio="xMidYMid slice"
    >
      <rect width="1200" height="720" fill="var(--paper-muted)" />
      <rect
        x="62"
        y="54"
        width="1076"
        height="612"
        fill="none"
        stroke="var(--line-strong)"
        strokeWidth="2"
      />
      <path
        d={`M62 ${lineOffset}H1138M${lineOffset + 210} 54V666`}
        fill="none"
        stroke="var(--line)"
        strokeWidth="2"
      />
      <circle
        cx={circleX}
        cy={circleY}
        r="116"
        fill="var(--accent)"
        stroke="var(--ink)"
        strokeWidth="2"
      />
      <rect
        x="530"
        y="164"
        width="446"
        height="322"
        fill="var(--paper-raised)"
        stroke="var(--ink)"
        strokeWidth="2"
        transform={`rotate(${(seed % 7) - 3} 753 325)`}
      />
      <path
        d="M554 530h424M554 558h320M554 586h368"
        fill="none"
        stroke="var(--ink-soft)"
        strokeWidth="9"
      />
      <rect
        x="923"
        y="430"
        width="154"
        height="154"
        fill="var(--accent-soft)"
        stroke="var(--ink)"
        strokeWidth="2"
      />
    </svg>
  );
}
