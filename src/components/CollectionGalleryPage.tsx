import { useEffect, useMemo, useState, type ReactNode } from "react";
import { ArrowLeft, MagnifyingGlass, X } from "@phosphor-icons/react";
import {
  filterBlogs,
  filterProjects,
  filterPublications,
  uniqueOptions,
  type CollectionRoute,
} from "../content/collectionUtils";
import { blogPageFromSearch } from "../content/blogUtils";
import type { BlogPost, Project, Publication } from "../content/types";
import { ArchiveSelect } from "./ArchiveSelect";
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

interface ArchiveEntry {
  key: string;
  render: (page: number) => ReactNode;
}

interface ArchiveModel {
  ariaLabel: string;
  className: string;
  entries: ArchiveEntry[];
  pageSize: number;
  secondaryFilter?: {
    label: string;
    options: string[];
  };
  topics: string[];
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

  const archive = useMemo<ArchiveModel>(() => {
    switch (kind) {
      case "blog": {
        const entries = filterBlogs(blogs, {
          query,
          topic,
          category: secondaryFacet,
        }).map((post) => ({
          key: post.slug,
          render: (page: number) => (
            <BlogCard post={post} returnFrom="archive" returnPage={page} />
          ),
        }));

        return {
          ariaLabel: "Blog archive pages",
          className: "blog-grid archive-grid",
          entries,
          pageSize: blogPageSize,
          secondaryFilter: {
            label: "Categories",
            options: uniqueOptions(blogs.map((post) => post.category)),
          },
          topics: uniqueOptions(blogs.flatMap((post) => post.tags)),
        };
      }
      case "projects": {
        const entries = filterProjects(projects, { query, topic }).map(
          (project) => ({
            key: project.slug,
            render: () => <ProjectCard project={project} />,
          }),
        );

        return {
          ariaLabel: "Project archive pages",
          className: "project-grid archive-grid",
          entries,
          pageSize: projectPageSize,
          topics: uniqueOptions(projects.flatMap((project) => project.tags)),
        };
      }
      case "publications": {
        const entries = filterPublications(publications, {
          query,
          topic,
          year: secondaryFacet,
        }).map((publication) => ({
          key: publication.slug,
          render: () => (
            <PublicationPoster
              publication={publication}
              highlightedAuthor={highlightedAuthor}
            />
          ),
        }));

        return {
          ariaLabel: "Publication archive pages",
          className: "publication-grid archive-grid",
          entries,
          pageSize: publicationPageSize,
          secondaryFilter: {
            label: "Years",
            options: uniqueOptions(
              publications.map((publication) => publication.date.slice(0, 4)),
            ).reverse(),
          },
          topics: uniqueOptions(
            publications.flatMap((publication) => publication.tags),
          ),
        };
      }
    }
  }, [
    blogPageSize,
    blogs,
    highlightedAuthor,
    kind,
    projectPageSize,
    projects,
    publicationPageSize,
    publications,
    query,
    secondaryFacet,
    topic,
  ]);
  const resultCount = archive.entries.length;
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
          options={archive.topics}
          value={topic}
          onChange={setTopic}
        />
        {archive.secondaryFilter ? (
          <ArchiveSelect
            label={archive.secondaryFilter.label}
            options={archive.secondaryFilter.options}
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
        <PaginatedGrid
          key={filterKey}
          ariaLabel={archive.ariaLabel}
          className={archive.className}
          getKey={(entry) => entry.key}
          itemLabel={copy.itemLabel}
          initialPage={kind === "blog" && !hasFilters ? initialBlogPage : 1}
          items={archive.entries}
          pageSize={archive.pageSize}
          renderItem={(entry, { page }) => entry.render(page)}
        />
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
