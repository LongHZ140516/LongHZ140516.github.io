export type Theme = "light" | "dark";
export type SocialKind =
  | "scholar"
  | "github"
  | "email"
  | "x"
  | "bilibili"
  | "music"
  | "website";

export interface SocialLink {
  kind: SocialKind;
  label: string;
  href: string;
  primary?: boolean;
}

export interface Mentor {
  name: string;
  href?: string;
}

export interface Affiliation {
  kind: "education" | "work";
  organization: string;
  role: string;
  period: string;
  description: string;
  logo?: string;
  mentorLabel?: string;
  mentors?: Mentor[];
}

export interface ResearchInterest {
  label: string;
  icon: "cube" | "eye" | "image" | "agent";
}

export interface ProfileNote {
  icon: "education" | "development" | "culture";
  text: string;
}

export interface NewsItem {
  date: string;
  title: string;
  href: string;
}

export interface Profile {
  name: string;
  alias: string;
  role: string;
  avatar: string;
  avatarAlt: string;
  bio: string;
  aboutHeading: string;
  aboutBody: string;
  footerBio: string;
  location: string;
  profileNotes: ProfileNote[];
  researchInterests: ResearchInterest[];
  socials: SocialLink[];
  affiliations: Affiliation[];
  news: NewsItem[];
}

export interface Publication {
  slug: string;
  title: string;
  venue: string;
  authors: string[];
  image: string;
  imageAlt: string;
  paperUrl: string;
  githubUrl?: string;
  projectUrl?: string;
  date: string;
  highlight: boolean;
  tags: string[];
}

export interface Project {
  slug: string;
  name: string;
  description: string;
  tags: string[];
  image: string;
  imageAlt: string;
  link: string;
  githubRepo: string;
  stars: number;
}

export interface InterestItem {
  name: string;
  meta: string;
  image: string;
  imageAlt: string;
  href?: string;
}

export interface Interest {
  slug: string;
  name: string;
  subtitle: string;
  description: string;
  href?: string;
  sourceLabel?: string;
  duration: number;
  items: InterestItem[];
}

export interface SiteContent {
  profile: Profile;
  publications: Publication[];
  projects: Project[];
  interests: Interest[];
}
