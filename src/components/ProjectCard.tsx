import {
  ArrowUpRight,
  GithubLogo,
  Star,
} from "@phosphor-icons/react";
import type { Project } from "../content/types";
import { assetUrl, formatStarCount } from "../content/contentUtils";

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <article className="project-card">
      <a
        className="project-image"
        href={project.link}
        target="_blank"
        rel="noreferrer"
        aria-label={`Open ${project.name}`}
      >
        <img
          src={assetUrl(project.image)}
          alt={project.imageAlt}
          loading="lazy"
          width="1600"
          height="900"
        />
      </a>

      <div className="project-copy">
        <div className="project-heading">
          <h3>{project.name}</h3>
          <span
            className="star-count"
            aria-label={`${project.stars} GitHub stars`}
          >
            <Star size={17} weight="regular" aria-hidden="true" />
            {formatStarCount(project.stars)}
          </span>
        </div>
        <p>{project.description}</p>
        <div className="tag-list" aria-label="Project topics">
          {project.tags.map((tag) => (
            <span key={tag}>{tag}</span>
          ))}
        </div>
        <a
          className="project-link"
          href={project.link}
          target="_blank"
          rel="noreferrer"
        >
          <GithubLogo size={18} weight="regular" aria-hidden="true" />
          View project
          <ArrowUpRight size={15} weight="regular" aria-hidden="true" />
        </a>
      </div>
    </article>
  );
}
