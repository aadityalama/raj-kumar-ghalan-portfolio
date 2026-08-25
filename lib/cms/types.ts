export const GALLERY_CATEGORIES = [
  "Professional",
  "Work",
  "Projects",
  "Travel",
  "Events",
  "Personal",
  "Other",
] as const;

export type GalleryCategory = (typeof GALLERY_CATEGORIES)[number];

export type ThemePreference = "dark" | "light" | "system";

export type SiteRow = {
  id: string;
  slug: string;
  name: string;
  plan_tier: "demo" | "starter" | "pro" | "agency";
  onboarding_completed: boolean;
  is_owner_site?: boolean;
  created_at?: string;
  updated_at?: string;
};

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
  website_name?: string;
  brand_name?: string;
  wordmark?: string;
  logo_url?: string;
  favicon_url?: string;
  accent_color?: string;
  theme_preference?: ThemePreference | string;
  copyright_text?: string;
  site_url?: string;
  onboarding_completed?: boolean;
  hero_primary_cta_text?: string;
  hero_primary_cta_href?: string;
  hero_secondary_cta_text?: string;
  hero_secondary_cta_href?: string;
  gallery_page_eyebrow?: string;
  gallery_page_title?: string;
  gallery_page_description?: string;
  gallery_cta_label?: string;
  gallery_cta_href?: string;
  career_timeline_eyebrow?: string;
  career_timeline_title?: string;
  market_eyebrow?: string;
  market_followers_label?: string;
  market_posts_label?: string;
  market_facebook_cta?: string;
  content_eyebrow?: string;
  content_youtube_context?: string;
  content_youtube_cta?: string;
  content_themes?: string[];
  market_capabilities?: string[];
  other_projects_eyebrow?: string;
  other_projects_title?: string;
  about_eyebrow?: string;
  about_known_experience_heading?: string;
  site_id?: string;
  updated_at?: string;
};

export type SectionRow = {
  id: string;
  section_key: string;
  label: string;
  href: string;
  title?: string;
  description?: string;
  eyebrow?: string;
  visible: boolean;
  sort_order: number;
  site_id?: string;
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
  site_id?: string;
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
  site_id?: string;
  created_at?: string;
  updated_at?: string;
};

export type ExperienceRow = {
  id: string;
  company: string;
  position: string;
  location?: string;
  start_year: string;
  end_year: string;
  description: string;
  technologies: string[];
  logo_url?: string;
  logo_path?: string | null;
  featured: boolean;
  visible?: boolean;
  sort_order: number;
  site_id?: string;
  created_at?: string;
  updated_at?: string;
};

export type JourneyStageRow = {
  id: string;
  kind: "career" | "experience";
  stage_label: string;
  title: string;
  body: string;
  visible: boolean;
  sort_order: number;
  site_id?: string;
  created_at?: string;
  updated_at?: string;
};

export type ExperiencePhotoRow = {
  id: string;
  image_url: string;
  image_path?: string | null;
  alt: string;
  caption: string;
  visible: boolean;
  sort_order: number;
  site_id?: string;
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
  site_id?: string;
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
  site_id?: string;
  created_at?: string;
  updated_at?: string;
};

export type ContactRow = {
  email: string;
  phone: string;
  location: string;
  message: string;
  site_id?: string;
  updated_at?: string;
};

export type SeoRow = {
  site_title: string;
  meta_description: string;
  keywords: string[];
  og_title: string;
  og_description: string;
  og_image: string;
  site_id?: string;
  updated_at?: string;
};

export type ProductSettingsRow = {
  section_title: string;
  case_title?: string;
  case_eyebrow?: string;
  live_url?: string;
  category?: string;
  short_description?: string;
  problem_title?: string;
  problem_body?: string;
  vision_title?: string;
  vision_body?: string;
  built_title?: string;
  built_body?: string;
  tech_title?: string;
  tech_body?: string;
  philosophy_title?: string;
  philosophy_body?: string;
  technologies?: string[];
  visible?: boolean;
  sort_order?: number;
  site_id?: string;
  updated_at?: string;
};

export type ProductCardRow = {
  id: string;
  title: string;
  description: string;
  image_url: string;
  image_path: string | null;
  link_url: string;
  category?: string;
  visible: boolean;
  sort_order: number;
  site_id?: string;
  created_at?: string;
  updated_at?: string;
};

export type ProductFeatureRow = {
  id: string;
  title: string;
  description: string;
  visible: boolean;
  sort_order: number;
  site_id?: string;
  created_at?: string;
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
  productSettings: ProductSettingsRow;
  productCards: ProductCardRow[];
  productFeatures: ProductFeatureRow[];
  journeyStages: JourneyStageRow[];
  experiencePhotos: ExperiencePhotoRow[];
  source: "cms" | "fallback";
  site?: SiteRow | null;
};
