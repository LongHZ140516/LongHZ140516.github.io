import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  CaretDown,
  MagnifyingGlass,
  X,
} from "@phosphor-icons/react";
import {
  filterBlogs,
  filterProjects,
  filterPublications,
  uniqueOptions,
  type CollectionRoute,
} from "../content/collectionUtils";
import { blogPageFromSearch } from "../content/blogUtils";
import type { BlogPost, Project, Publication } from "../content/types";
import { BlogCard } from "./BlogCard";
import { PaginatedGrid } from "./PaginatedGrid";
import { ProjectCard } from "./ProjectCard";
import { PublicationPoster } from "./PublicationPoster";
import { useResponsivePageSize } from "./useResponsivePageSize";

interface CollectionGalleryPageProps {
  blogs: readonly BlogPost[];
  highlightedAuthor: string;
  kind: CollectionRoute;
  projects: readonly Project[];
  publications: readonly Publication[];
}

const archiveCopy: Record<
  CollectionRoute,
  { description: string; homeHref: string; itemLabel: string; title: string }
> = {
  blog: {
    title: "Blog",
    description:
      "All published notes, ordered from newest to oldest. Search by title, summary, category, or topic.",
    homeHref: "/#blog",
    itemLabel: "articles",
  },
  publications: {
    title: "Publications",
    description:
      "A complete research archive across 3D vision, generative models, visual reasoning, and remote sensing.",
    homeHref: "/#publications",
    itemLabel: "publications",
  },
  projects: {
    title: "Projects",
    description:
      "Open-source tools and experiments, collected in one place for browsing by keyword or topic.",
    homeHref: "/#projects",
    itemLabel: "projects",
  },
};

function ArchiveSelect({
  label,
  onChange,
  options,
  value,
}: {
  label: string;
  onChange: (value: string) => void;
  options: readonly string[];
  value: string;
}) {
  return (
    <label className="archive-field archive-field--select">
      <span>{label}</span>
      <span className="archive-select-wrap">
        <select value={value} onChange={(event) => onChange(event.target.value)}>
          <option value="">All {label.toLocaleLowerCase("en")}</option>
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        <CaretDown size={14} weight="bold" aria-hidden="true" />
      </span>
    </label>
  );
}

export default function CollectionGalleryPage({
  blogs,
  highlightedAuthor,
  kind,
  projects,
  publications,
}: CollectionGalleryPageProps) {
  const copy = archiveCopy[kind];
  const [query, setQuery] = useState("");
  const [topic, setTopic] = useState("");
  const [secondaryFacet, setSecondaryFacet] = useState("");
  const publicationPageSize = useResponsivePageSize(
    "--archive-publication-columns",
    "--archive-publication-rows",
    12,
  );
  const projectPageSize = useResponsivePageSize(
    "--archive-project-columns",
    "--archive-project-rows",
    12,
  );
  const blogPageSize = useResponsivePageSize(
    "--archive-blog-columns",
    "--archive-blog-rows",
    9,
  );

  useEffect(() => {
    const previousTitle = document.title;
    document.title = `${copy.title} | Zilong Huang`;

    return () => {
      document.title = previousTitle;
    };
  }, [copy.title]);

  const topics = useMemo(() => {
    const source =
      kind === "blog" ? blogs : kind === "projects" ? projects : publications;

    return uniqueOptions(source.flatMap((item) => item.tags));
  }, [blogs, kind, projects, publications]);
  const secondaryOptions = useMemo(
    () =>
      kind === "blog"
        ? uniqueOptions(blogs.map((post) => post.category))
        : kind === "publications"
          ? uniqueOptions(
              publications.map((publication) => publication.date.slice(0, 4)),
            ).reverse()
          : [],
    [blogs, kind, publications],
  );
  const filteredBlogs = useMemo(
    () =>
      filterBlogs(blogs, {
        query,
        topic,
        category: kind === "blog" ? secondaryFacet : "",
      }),
    [blogs, kind, query, secondaryFacet, topic],
  );
  const filteredProjects = useMemo(
    () => filterProjects(projects, { query, topic }),
    [projects, query, topic],
  );
  const filteredPublications = useMemo(
    () =>
      filterPublications(publications, {
        query,
        topic,
        year: kind === "publications" ? secondaryFacet : "",
      }),
    [kind, publications, query, secondaryFacet, topic],
  );
  const resultCount =
    kind === "blog"
      ? filteredBlogs.length
      : kind === "projects"
        ? filteredProjects.length
        : filteredPublications.length;
  const hasFilters = Boolean(query || topic || secondaryFacet);
  const filterKey = `${kind}:${query}:${topic}:${secondaryFacet}`;
  const initialBlogPage = blogPageFromSearch(window.location.search);

  const clearFilters = () => {
    setQuery("");
    setTopic("");
    setSecondaryFacet("");
  };

  return (
    <section
      className={`collection-page collection-page--${kind} page-shell`}
      id="archive-top"
    >
      <header className="collection-hero">
        <a className="collection-back-link" href={copy.homeHref}>
          <ArrowLeft size={16} weight="regular" aria-hidden="true" />
          Back to homepage
        </a>
        <h1>{copy.title}</h1>
        <p>{copy.description}</p>
      </header>

      <div className="archive-toolbar" role="search">
        <label className="archive-field archive-field--search">
          <span>Keyword</span>
          <span className="archive-search-wrap">
            <MagnifyingGlass size={17} weight="regular" aria-hidden="true" />
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={`Search ${copy.title.toLocaleLowerCase("en")}`}
            />
            {query ? (
              <button
                type="button"
                onClick={() => setQuery("")}
                aria-label="Clear search"
              >
                <X size={15} weight="regular" aria-hidden="true" />
              </button>
            ) : null}
          </span>
        </label>
        <ArchiveSelect
          label="Topics"
          options={topics}
          value={topic}
          onChange={setTopic}
        />
        {kind !== "projects" ? (
          <ArchiveSelect
            label={kind === "blog" ? "Categories" : "Years"}
            options={secondaryOptions}
            value={secondaryFacet}
            onChange={setSecondaryFacet}
          />
        ) : null}
      </div>

      <div className="archive-results-bar">
        <p aria-live="polite">
          {resultCount} {copy.itemLabel}
        </p>
        {hasFilters ? (
          <button type="button" onClick={clearFilters}>
            Clear filters
          </button>
        ) : null}
      </div>

      {resultCount ? (
        kind === "blog" ? (
          <PaginatedGrid
            key={filterKey}
            ariaLabel="Blog archive pages"
            className="blog-grid archive-grid"
            getKey={(post) => post.slug}
            itemLabel="articles"
            initialPage={hasFilters ? 1 : initialBlogPage}
            items={filteredBlogs}
            pageSize={blogPageSize}
            renderItem={(post, { page }) => (
              <BlogCard post={post} returnFrom="archive" returnPage={page} />
            )}
          />
        ) : kind === "projects" ? (
          <PaginatedGrid
            key={filterKey}
            ariaLabel="Project archive pages"
            className="project-grid archive-grid"
            getKey={(project) => project.slug}
            itemLabel="projects"
            items={filteredProjects}
            pageSize={projectPageSize}
            renderItem={(project) => <ProjectCard project={project} />}
          />
        ) : (
          <PaginatedGrid
            key={filterKey}
            ariaLabel="Publication archive pages"
            className="publication-grid archive-grid"
            getKey={(publication) => publication.slug}
            itemLabel="publications"
            items={filteredPublications}
            pageSize={publicationPageSize}
            renderItem={(publication) => (
              <PublicationPoster
                publication={publication}
                highlightedAuthor={highlightedAuthor}
              />
            )}
          />
        )
      ) : (
        <div className="archive-empty" role="status">
          <h2>No matching work</h2>
          <p>Try a broader keyword or clear the current filters.</p>
          <button className="button button--secondary" onClick={clearFilters}>
            Clear filters
          </button>
        </div>
      )}
    </section>
  );
}
