import {
  ArrowUpRight,
  FileText,
  GithubLogo,
  Globe,
} from "@phosphor-icons/react";
import type { Publication } from "../content/types";
import { assetUrl } from "../content/contentUtils";

interface PublicationPosterProps {
  publication: Publication;
  highlightedAuthor: string;
}

function formatAuthors(authors: string[], highlightedAuthor: string) {
  return authors.map((author, index) => {
    const isCurrentAuthor = author
      .toLowerCase()
      .includes(highlightedAuthor.toLowerCase());
    const separator = index < authors.length - 1 ? ", " : "";

    return (
      <span key={`${author}-${index}`}>
        {isCurrentAuthor ? <strong>{author}</strong> : author}
        {separator}
      </span>
    );
  });
}

export function PublicationPoster({
  publication,
  highlightedAuthor,
}: PublicationPosterProps) {
  const year =
    publication.venue.match(/\b20\d{2}\b/)?.[0] ??
    new Date(publication.date).getUTCFullYear();

  return (
    <article
      className={`publication-poster${
        publication.highlight ? " publication-poster--featured" : ""
      }`}
    >
      <div className="poster-media">
        <a
          href={publication.paperUrl}
          target="_blank"
          rel="noreferrer"
          aria-label={`Read ${publication.title}`}
        >
          <img
            src={assetUrl(publication.image)}
            alt={publication.imageAlt}
            loading="lazy"
            width="1600"
            height="900"
          />
        </a>
      </div>

      <div className="poster-copy">
        <div className="venue-line">
          <span>{publication.venue}</span>
          <span>{year}</span>
        </div>

        <div className="tag-list" aria-label="Research topics">
          {publication.tags.map((tag) => (
            <span key={tag}>{tag}</span>
          ))}
        </div>

        <h3>{publication.title}</h3>
        <p className="authors">
          {formatAuthors(publication.authors, highlightedAuthor)}
        </p>

        <div className="publication-links">
          <a href={publication.paperUrl} target="_blank" rel="noreferrer">
            <FileText size={17} weight="regular" aria-hidden="true" />
            Paper
            <ArrowUpRight size={14} weight="regular" aria-hidden="true" />
          </a>
          {publication.githubUrl && (
            <a href={publication.githubUrl} target="_blank" rel="noreferrer">
              <GithubLogo size={17} weight="regular" aria-hidden="true" />
              Code
              <ArrowUpRight size={14} weight="regular" aria-hidden="true" />
            </a>
          )}
          {publication.projectUrl && (
            <a href={publication.projectUrl} target="_blank" rel="noreferrer">
              <Globe size={17} weight="regular" aria-hidden="true" />
              Project
              <ArrowUpRight size={14} weight="regular" aria-hidden="true" />
            </a>
          )}
        </div>
      </div>
    </article>
  );
}
