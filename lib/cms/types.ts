export const GALLERY_CATEGORIES = [
  "Professional",
  "KP Electric / Work",
  "NEPSE / Market Analysis",
  "FIRE Nepal",
  "YouTube / Content Creation",
  "Projects",
  "Nepal",
  "Korea",
  "Personal",
] as const;

export type GalleryCategory = (typeof GALLERY_CATEGORIES)[number];

export type SettingsRow = {
  hero_title: string;
  hero_subtitle: string;
  hero_positioning: string;
  hero_body: string;
  about_title: string;
  about_body: string;
  about_body_secondary: string;
  about_experience_label: string;
  journey_title: string;
  journey_description: string;
  philosophy: string;
  content_title: string;
  content_description: string;
  content_youtube_title: string;
  content_youtube_body: string;
  market_title: string;
  market_description: string;
  market_profile: string;
  market_note: string;
  market_followers: string;
  market_posts: string;
  market_facebook_url: string;
  hero_image_url: string;
  updated_at?: string;
};

export type SectionRow = {
  id: string;
  section_key: string;
  label: string;
  href: string;
  visible: boolean;
  sort_order: number;
  updated_at?: string;
};

export type GalleryRow = {
  id: string;
  title: string;
  description: string;
  category: string;
  image_path: string | null;
  image_url: string;
  featured: boolean;
  visible: boolean;
  sort_order: number;
  created_at?: string;
  updated_at?: string;
};

export type ProjectRow = {
  id: string;
  title: string;
  description: string;
  category: string;
  technologies: string[];
  live_url: string;
  github_url: string;
  youtube_url: string;
  image_url: string;
  image_path?: string | null;
  featured: boolean;
  published: boolean;
  sort_order: number;
  created_at?: string;
  updated_at?: string;
};

export type ExperienceRow = {
  id: string;
  company: string;
  position: string;
  start_year: string;
  end_year: string;
  description: string;
  technologies: string[];
  featured: boolean;
  sort_order: number;
  created_at?: string;
  updated_at?: string;
};

export type SkillRow = {
  id: string;
  name: string;
  category: string;
  level: string;
  visible: boolean;
  sort_order: number;
  created_at?: string;
  updated_at?: string;
};

export type SocialRow = {
  id: string;
  platform: string;
  label: string;
  href: string;
  note: string;
  visible: boolean;
  sort_order: number;
  created_at?: string;
  updated_at?: string;
};

export type ContactRow = {
  email: string;
  phone: string;
  location: string;
  message: string;
  updated_at?: string;
};

export type SeoRow = {
  site_title: string;
  meta_description: string;
  keywords: string[];
  og_title: string;
  og_description: string;
  og_image: string;
  updated_at?: string;
};

export type PublicPortfolio = {
  settings: SettingsRow;
  sections: SectionRow[];
  gallery: GalleryRow[];
  projects: ProjectRow[];
  experience: ExperienceRow[];
  skills: SkillRow[];
  socials: SocialRow[];
  contact: ContactRow;
  seo: SeoRow;
  source: "cms" | "fallback";
};
