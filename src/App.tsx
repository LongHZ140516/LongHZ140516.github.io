import {
  ArrowDown,
  ArrowUpRight,
  Briefcase,
  Code,
  Cube,
  EnvelopeSimple,
  Eye,
  GithubLogo,
  GlobeSimple,
  GraduationCap,
  ImageSquare,
  MapPin,
  MusicNotesSimple,
  Robot,
  Student,
  TelevisionSimple,
  XLogo,
  type Icon,
} from "@phosphor-icons/react";
import { InterestGallery } from "./components/InterestGallery";
import { ProjectCard } from "./components/ProjectCard";
import { PublicationPoster } from "./components/PublicationPoster";
import { RecentUpdates } from "./components/RecentUpdates";
import { SiteHeader } from "./components/SiteHeader";
import { assetUrl, initialsForName } from "./content/contentUtils";
import { siteContent } from "./content/loadContent";
import type {
  ProfileNote,
  ResearchInterest,
  SocialKind,
  SocialLink,
} from "./content/types";

const { profile, publications, projects, interests } = siteContent;

const socialIcons = {
  scholar: GraduationCap,
  github: GithubLogo,
  email: EnvelopeSimple,
  x: XLogo,
  bilibili: TelevisionSimple,
  music: MusicNotesSimple,
  website: GlobeSimple,
} satisfies Record<SocialKind, Icon>;

const researchIcons = {
  cube: Cube,
  eye: Eye,
  image: ImageSquare,
  agent: Robot,
} satisfies Record<ResearchInterest["icon"], Icon>;

const profileNoteIcons = {
  education: Student,
  development: Code,
  culture: MusicNotesSimple,
} satisfies Record<ProfileNote["icon"], Icon>;

function InlineIcon({
  component: IconComponent,
  size = 17,
}: {
  component: Icon;
  size?: number;
}) {
  return <IconComponent size={size} weight="regular" aria-hidden="true" />;
}

function externalLinkAttributes(href: string) {
  return href.startsWith("mailto:")
    ? {}
    : { target: "_blank" as const, rel: "noreferrer" };
}

function SocialLinkItem({ social }: { social: SocialLink }) {
  return (
    <a href={social.href} {...externalLinkAttributes(social.href)}>
      <InlineIcon component={socialIcons[social.kind]} />
      {social.label}
    </a>
  );
}

function HeroSocialLink({ social }: { social: SocialLink }) {
  return (
    <a
      className="hero-social-link"
      href={social.href}
      {...externalLinkAttributes(social.href)}
      aria-label={social.label}
    >
      <InlineIcon component={socialIcons[social.kind]} />
      <span className="hero-social-tooltip" aria-hidden="true">
        {social.label}
      </span>
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
        <section className="hero page-shell" id="about">
          <div className="hero-copy">
            <div className="hero-intro">
              <p className="eyebrow">{profile.role}</p>
              <h1>{profile.name}</h1>
              <p className="hero-bio">{profile.bio}</p>
              <div className="hero-controls">
                <div className="hero-actions">
                  <a className="button button--primary" href="#publications">
                    Publications
                    <ArrowDown
                      size={17}
                      weight="regular"
                      aria-hidden="true"
                    />
                  </a>
                  <a
                    className="button button--secondary"
                    href={
                      profile.socials.find((item) => item.kind === "email")
                        ?.href
                    }
                  >
                    Email
                    <EnvelopeSimple
                      size={17}
                      weight="regular"
                      aria-hidden="true"
                    />
                  </a>
                </div>
                <nav className="hero-socials" aria-label="Profile links">
                  {primarySocials.map((social) => (
                    <HeroSocialLink key={social.label} social={social} />
                  ))}
                </nav>
              </div>
            </div>

            <div className="hero-research">
              <div className="hero-about">
                <h2>{profile.aboutHeading}</h2>
                <p>{profile.aboutBody}</p>
                <div className="profile-notes" aria-label="Personal notes">
                  {profile.profileNotes.map((note) => (
                    <p className="profile-note" key={note.text}>
                      <span className="profile-note__icon">
                        <InlineIcon
                          component={profileNoteIcons[note.icon]}
                          size={15}
                        />
                      </span>
                      <span>{note.text}</span>
                    </p>
                  ))}
                </div>
              </div>

              <div className="hero-focus">
                <h2>Research interests</h2>
                <div className="focus-grid">
                  {profile.researchInterests.map((interest) => (
                    <span className="focus-item" key={interest.label}>
                      <span className="focus-icon">
                        <InlineIcon
                          component={researchIcons[interest.icon]}
                        />
                      </span>
                      {interest.label}
                    </span>
                  ))}
                </div>
              </div>

            </div>
          </div>

          <aside className="hero-aside" aria-label="Profile and affiliations">
            <figure className="hero-portrait">
              <div className="portrait-frame">
                <img
                  src={assetUrl(profile.avatar)}
                  alt={profile.avatarAlt}
                  width="320"
                  height="360"
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

            <div className="hero-affiliations">
              <h2>Education &amp; experience</h2>
              {profile.affiliations.map((item) => (
                <article
                  key={`${item.organization}-${item.role}-${item.period}`}
                >
                  <div className="affiliation-logo" aria-hidden="true">
                    {item.logo ? (
                      <img src={assetUrl(item.logo)} alt="" />
                    ) : item.kind === "education" ? (
                      <Student size={22} weight="regular" />
                    ) : (
                      <Briefcase size={22} weight="regular" />
                    )}
                  </div>
                  <div>
                    <div className="affiliation-heading">
                      <h3>{item.organization}</h3>
                      <time>{item.period}</time>
                    </div>
                    <p>{item.role}</p>
                    {item.mentors?.length ? (
                      <p className="affiliation-mentors">
                        <span className="mentor-label">
                          {item.mentorLabel ?? "Mentors"}:
                        </span>{" "}
                        {item.mentors.map((mentor, index) => (
                          <span
                            className="affiliation-mentor-item"
                            key={mentor.name}
                          >
                            {index > 0 ? ", " : ""}
                            {mentor.href ? (
                              <a
                                href={mentor.href}
                                target="_blank"
                                rel="noreferrer"
                              >
                                {mentor.name}
                              </a>
                            ) : (
                              mentor.name
                            )}
                          </span>
                        ))}
                      </p>
                    ) : null}
                  </div>
                </article>
              ))}
            </div>
          </aside>
        </section>

        <RecentUpdates items={profile.news} />

        <section className="publication-section page-shell" id="publications">
          <div className="section-heading">
            <h2>Publications</h2>
            <p>
              Peer-reviewed and preprint work across 3D vision, image
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
          <div className="section-heading">
            <h2>Projects</h2>
            <p>
              Open-source tools and experiments that turn research workflows
              into reusable systems.
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
            <h2>Interests</h2>
            <p>
              A visual shelf of the animation, music, and games I return to.
            </p>
          </div>
          <div className="interest-gallery">
            {interests.map((interest) => (
              <InterestGallery key={interest.slug} interest={interest} />
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
          <a className="back-to-top" href="#about">
            Back to top
            <ArrowUpRight size={15} weight="regular" aria-hidden="true" />
          </a>
        </div>
      </footer>
    </>
  );
}
