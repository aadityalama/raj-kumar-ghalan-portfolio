import {
  experience,
  gallery,
  market,
  philosophy,
  projects,
  site,
  skills,
  socials,
  youtubeFocus,
} from "@/config/site";
import type {
  ContactRow,
  ExperienceRow,
  GalleryRow,
  ProductCardRow,
  ProductFeatureRow,
  ProductSettingsRow,
  ProjectRow,
  PublicPortfolio,
  SectionRow,
  SeoRow,
  SettingsRow,
  SkillRow,
  SocialRow,
} from "@/lib/cms/types";

export function defaultSettings(): SettingsRow {
  return {
    hero_title: site.name,
    hero_subtitle: site.headline,
    hero_positioning: site.positioning,
    hero_body: "Building meaningful digital experiences.",
    about_title: "About your work.\nAbout your craft.\nAbout what you build.",
    about_body:
      "Introduce yourself in a few sentences. Share what you do, who you help, and what makes your work distinctive.",
    about_body_secondary:
      "Add a second paragraph for context — background, approach, or the themes that connect your projects.",
    about_experience_label: site.experienceLabel,
    journey_title: "Professional journey",
    journey_description: "A short overview of how your career has unfolded.",
    philosophy,
    content_title: "Beyond the work. I create.",
    content_description:
      "Describe any content, teaching, or community work that sits alongside your projects.",
    content_youtube_title: youtubeFocus.title,
    content_youtube_body: youtubeFocus.body,
    market_title: market.title,
    market_description: market.description,
    market_profile: market.profile,
    market_note: market.note,
    market_followers: market.stats[0]?.value || "",
    market_posts: market.stats[1]?.value || "",
    market_facebook_url: market.facebook.href,
    hero_image_url: site.portrait.src,
    website_name: site.name,
    brand_name: site.name,
    wordmark: site.wordmark,
    logo_url: "",
    favicon_url: "",
    accent_color: "#3DDC97",
    theme_preference: "dark",
    copyright_text: "",
    site_url: "",
    onboarding_completed: false,
  };
}

export function defaultSections(): SectionRow[] {
  return [
    {
      id: "hero",
      section_key: "hero",
      label: "Hero",
      href: "#top",
      title: "Hero",
      description: "Opening introduction.",
      visible: true,
      sort_order: 0,
    },
    {
      id: "about",
      section_key: "about",
      label: "About",
      href: "#about",
      title: "About",
      description: "Your story and background.",
      visible: true,
      sort_order: 10,
    },
    {
      id: "experience",
      section_key: "experience",
      label: "Experience",
      href: "#experience",
      title: "Experience",
      description: "Roles and professional history.",
      visible: true,
      sort_order: 30,
    },
    {
      id: "market",
      section_key: "market",
      label: "Spotlight",
      href: "#market",
      title: "Spotlight",
      description: "Optional focus or specialty section.",
      visible: false,
      sort_order: 40,
    },
    {
      id: "projects",
      section_key: "projects",
      label: "Projects",
      href: "#projects",
      title: "Projects",
      description: "Selected work.",
      visible: true,
      sort_order: 50,
    },
    {
      id: "product",
      section_key: "product",
      label: "Product",
      href: "#product",
      title: "Featured work",
      description: "Signature product or case study.",
      visible: true,
      sort_order: 55,
    },
    {
      id: "skills",
      section_key: "skills",
      label: "Skills",
      href: "#skills",
      title: "Skills",
      description: "Capabilities and tools.",
      visible: true,
      sort_order: 60,
    },
    {
      id: "content",
      section_key: "content",
      label: "Content",
      href: "#content",
      title: "Content",
      description: "Optional content or media section.",
      visible: false,
      sort_order: 70,
    },
    {
      id: "gallery",
      section_key: "gallery",
      label: "Photo Gallery",
      href: "/gallery",
      title: "Gallery",
      description: "Homepage gallery call-to-action.",
      visible: true,
      sort_order: 72,
    },
    {
      id: "philosophy",
      section_key: "philosophy",
      label: "Philosophy",
      href: "#philosophy",
      title: "Philosophy",
      description: "A short guiding statement.",
      visible: true,
      sort_order: 75,
    },
    {
      id: "contact",
      section_key: "contact",
      label: "Contact",
      href: "#contact",
      title: "Contact",
      description: "How people can reach you.",
      visible: true,
      sort_order: 80,
    },
  ];
}

export function defaultGallery(): GalleryRow[] {
  return gallery.map((photo, index) => ({
    id: `fallback-gallery-${index}`,
    title: photo.caption,
    description: photo.alt,
    category: "Professional",
    image_path: null,
    image_url: photo.src,
    featured: index === 0,
    visible: true,
    sort_order: (index + 1) * 10,
  }));
}

export function defaultProjects(): ProjectRow[] {
  return [
    {
      id: "fallback-featured",
      title: projects.featured.name,
      description: projects.featured.description,
      category: projects.featured.category,
      technologies: [...projects.featured.technologies],
      live_url: projects.featured.href,
      github_url: "",
      youtube_url: "",
      image_url: projects.featured.image,
      image_path: null,
      featured: true,
      published: true,
      sort_order: 10,
    },
    {
      id: "fallback-secondary",
      title: projects.secondary.name,
      description: projects.secondary.description,
      category: projects.secondary.category,
      technologies: [...projects.secondary.technologies],
      live_url: projects.secondary.href,
      github_url: "",
      youtube_url: "",
      image_url: projects.secondary.image,
      image_path: null,
      featured: false,
      published: true,
      sort_order: 20,
    },
  ];
}

export function defaultExperience(): ExperienceRow[] {
  return [
    {
      id: "fallback-experience",
      company: experience.company,
      position: experience.role,
      start_year: "",
      end_year: "Present",
      description: experience.summary,
      technologies: ["Craft", "Collaboration"],
      featured: true,
      sort_order: 10,
    },
  ];
}

export function defaultSkills(): SkillRow[] {
  return Object.entries(skills).flatMap(([category, items], categoryIndex) =>
    items.map((name, index) => ({
      id: `fallback-skill-${category}-${index}`,
      name,
      category,
      level: "",
      visible: true,
      sort_order: categoryIndex * 100 + (index + 1) * 10,
    })),
  );
}

export function defaultSocials(): SocialRow[] {
  return Object.entries(socials).map(([platform, item], index) => ({
    id: `fallback-social-${platform}`,
    platform,
    label: item.label,
    href: item.href,
    note: item.note,
    visible: Boolean(item.href),
    sort_order: (index + 1) * 10,
  }));
}

export function defaultContact(): ContactRow {
  return {
    email: site.email,
    phone: "",
    location: site.location,
    message: "If something here resonates, write to me. I read every note.",
  };
}

export function defaultSeo(): SeoRow {
  return {
    site_title: site.title,
    meta_description: site.description,
    keywords: [...site.keywords],
    og_title: site.title,
    og_description: site.description,
    og_image: site.portrait.src,
  };
}

export function defaultProductSettings(): ProductSettingsRow {
  return {
    section_title: "The Product",
    case_title: "Featured project, in focus",
    case_eyebrow: "Featured work",
    live_url: "",
    category: "Product",
    short_description: "A short summary of your signature product or case study.",
    problem_title: "The Problem",
    problem_body: "Describe the problem your audience faces.",
    vision_title: "The Vision",
    vision_body: "Describe the outcome you set out to create.",
    built_title: "What I Built",
    built_body: "Summarize what you shipped and why it matters.",
    tech_title: "Technology",
    tech_body: "Built as a modern web product with a mobile-first architecture.",
    philosophy_title: "Product philosophy",
    philosophy_body: "Technology should simplify decisions, not make them harder.",
    technologies: [...projects.featured.technologies],
    visible: true,
    sort_order: 0,
  };
}

export function defaultProductCards(): ProductCardRow[] {
  return [];
}

export function defaultProductFeatures(): ProductFeatureRow[] {
  return projects.featured.productAreas.map((title, index) => ({
    id: `fallback-feature-${index}`,
    title,
    description: "",
    visible: true,
    sort_order: (index + 1) * 10,
  }));
}

export function fallbackPortfolio(): PublicPortfolio {
  return {
    settings: defaultSettings(),
    sections: defaultSections().filter((item) => item.visible),
    gallery: defaultGallery(),
    projects: defaultProjects(),
    experience: defaultExperience(),
    skills: defaultSkills(),
    socials: defaultSocials().filter((item) => item.visible && item.href),
    contact: defaultContact(),
    seo: defaultSeo(),
    productSettings: defaultProductSettings(),
    productCards: defaultProductCards(),
    productFeatures: defaultProductFeatures(),
    journeyStages: [],
    experiencePhotos: [],
    source: "fallback",
  };
}

export { experience, site };
