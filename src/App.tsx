import {
  ArrowDown,
  ArrowUpRight,
  Briefcase,
  EnvelopeSimple,
  GithubLogo,
  GraduationCap,
  MapPin,
  Sparkle,
  Student,
} from "@phosphor-icons/react";
import { InterestTile } from "./components/InterestTile";
import { ProjectCard } from "./components/ProjectCard";
import { PublicationPoster } from "./components/PublicationPoster";
import { SiteHeader } from "./components/SiteHeader";
import { assetUrl, initialsForName } from "./content/contentUtils";
import { siteContent } from "./content/loadContent";
import type { SocialLink } from "./content/types";

const { profile, publications, projects, interests } = siteContent;

function socialIcon(social: SocialLink) {
  if (social.kind === "github") {
    return <GithubLogo size={17} weight="regular" aria-hidden="true" />;
  }
  if (social.kind === "email") {
    return <EnvelopeSimple size={17} weight="regular" aria-hidden="true" />;
  }
  if (social.kind === "scholar") {
    return <GraduationCap size={17} weight="regular" aria-hidden="true" />;
  }
  return <ArrowUpRight size={16} weight="regular" aria-hidden="true" />;
}

function SocialLinkItem({ social }: { social: SocialLink }) {
  const isExternal = !social.href.startsWith("mailto:");

  return (
    <a
      href={social.href}
      target={isExternal ? "_blank" : undefined}
      rel={isExternal ? "noreferrer" : undefined}
    >
      {socialIcon(social)}
      {social.label}
    </a>
  );
}

export default function App() {
  const primarySocials = profile.socials.filter((social) => social.primary);

  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <SiteHeader name={profile.name} />

      <main id="main">
        <section className="hero page-shell" id="top">
          <div className="hero-copy">
            <p className="eyebrow">{profile.role}</p>
            <h1>{profile.name}</h1>
            <p className="hero-bio">{profile.bio}</p>
            <div className="hero-actions">
              <a className="button button--primary" href="#publications">
                View research
                <ArrowDown size={17} weight="regular" aria-hidden="true" />
              </a>
              <a
                className="button button--secondary"
                href={profile.socials.find((item) => item.kind === "email")?.href}
              >
                Email me
                <EnvelopeSimple
                  size={17}
                  weight="regular"
                  aria-hidden="true"
                />
              </a>
            </div>
          </div>

          <figure className="hero-portrait">
            <div className="portrait-frame">
              <img
                src={assetUrl(profile.avatar)}
                alt={profile.avatarAlt}
                width="400"
                height="400"
                fetchPriority="high"
              />
              <span className="portrait-shape portrait-shape--circle" />
              <span className="portrait-shape portrait-shape--square" />
            </div>
            <figcaption>
              <span>{profile.alias}</span>
              <span className="location">
                <MapPin size={15} weight="regular" aria-hidden="true" />
                {profile.location}
              </span>
            </figcaption>
          </figure>
        </section>

        <section className="news-strip" aria-labelledby="news-heading">
          <div className="page-shell news-layout">
            <h2 id="news-heading">Recent updates</h2>
            <div className="news-list">
              {profile.news.slice(0, 3).map((item) => (
                <a
                  key={`${item.date}-${item.title}`}
                  href={item.href}
                  target="_blank"
                  rel="noreferrer"
                >
                  <time>{item.date}</time>
                  <span>{item.title}</span>
                  <ArrowUpRight
                    size={15}
                    weight="regular"
                    aria-hidden="true"
                  />
                </a>
              ))}
            </div>
          </div>
        </section>

        <section className="about-section page-shell" id="about">
          <div className="about-intro">
            <h2>{profile.aboutHeading}</h2>
            <p>{profile.aboutBody}</p>
            <div className="social-links">
              {primarySocials.map((social) => (
                <SocialLinkItem key={social.label} social={social} />
              ))}
            </div>
          </div>

          <div className="profile-details">
            <div className="research-index">
              <h3>Current focus</h3>
              <div className="focus-grid">
                {profile.tags.map((tag) => (
                  <span key={tag}>
                    <Sparkle size={14} weight="regular" aria-hidden="true" />
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="affiliations">
              <h3>Affiliations</h3>
              {profile.affiliations.map((item) => (
                <article
                  key={`${item.organization}-${item.role}-${item.period}`}
                >
                  <div className="affiliation-logo" aria-hidden="true">
                    {item.logo ? (
                      <img src={assetUrl(item.logo)} alt="" />
                    ) : item.kind === "education" ? (
                      <Student size={25} weight="regular" />
                    ) : (
                      <Briefcase size={25} weight="regular" />
                    )}
                  </div>
                  <div>
                    <div className="affiliation-heading">
                      <h4>{item.organization}</h4>
                      <time>{item.period}</time>
                    </div>
                    <p className="affiliation-role">{item.role}</p>
                    <p>{item.description}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="publication-section page-shell" id="publications">
          <div className="section-heading">
            <h2>Selected research, presented as a working archive.</h2>
            <p>
              {publications.length} publications across 3D vision, image
              generation, visual reasoning, and remote sensing.
            </p>
          </div>
          <div className="publication-grid">
            {publications.map((publication) => (
              <PublicationPoster
                key={publication.slug}
                publication={publication}
                highlightedAuthor={profile.name}
              />
            ))}
          </div>
        </section>

        <section className="project-section page-shell" id="projects">
          <div className="section-heading section-heading--compact">
            <h2>Projects built to be used.</h2>
            <p>
              Open-source experiments that turn research, visual culture, and
              interaction into practical tools.
            </p>
          </div>
          <div className="project-grid">
            {projects.map((project) => (
              <ProjectCard key={project.slug} project={project} />
            ))}
          </div>
        </section>

        <section className="interest-section page-shell" id="interests">
          <div className="section-heading">
            <h2>Outside the lab, images still lead.</h2>
            <p>
              Music, animation, and games are another way to study timing,
              composition, and world-building.
            </p>
          </div>
          <div className="interest-gallery">
            {interests.map((interest) => (
              <InterestTile key={interest.slug} interest={interest} />
            ))}
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="page-shell footer-layout">
          <div>
            <span className="brand-monogram" aria-hidden="true">
              {initialsForName(profile.name)}
            </span>
            <p>
              {profile.name}. {profile.footerBio}
            </p>
          </div>
          <div className="footer-links">
            {profile.socials.map((social) => (
              <SocialLinkItem key={social.label} social={social} />
            ))}
          </div>
          <a className="back-to-top" href="#top">
            Back to top
            <ArrowUpRight size={15} weight="regular" aria-hidden="true" />
          </a>
        </div>
      </footer>
    </>
  );
}
