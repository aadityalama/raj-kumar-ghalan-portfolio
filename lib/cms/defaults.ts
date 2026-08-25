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
    hero_body:
      "Experienced professional based in South Korea — a NEPSE market analyst and technical analyst, investor and trader, and a builder of digital products around financial independence and content.",
    about_title: "A professional career.\nA market analyst’s eye.\nA builder’s mindset.",
    about_body:
      "I have spent more than a decade working as a professional in South Korea — learning discipline, precision, and how real systems operate. Alongside that career, I analyze the Nepal Stock Exchange as a market analyst, technical analyst, investor, and trader, and I build digital products: tools for financial independence, commerce, and everyday decisions.",
    about_body_secondary:
      "The through-line is practical. I care about markets that people can read more clearly, technology they can use, and stories that travel between Nepal, Korea, and the work of making things.",
    about_experience_label: site.experienceLabel,
    journey_title: "Professional journey",
    journey_description:
      "Industrial craft first. Digital products next. The same standard: do the work carefully.",
    philosophy,
    content_title: "Beyond Code. I Create.",
    content_description:
      "I also make digital and social content around NEPSE technical analysis, financial education, personal finance, Nepal, Korea, career, and the products I am building.",
    content_youtube_title: youtubeFocus.title,
    content_youtube_body: youtubeFocus.body,
    market_title: market.title,
    market_description: market.description,
    market_profile: market.profile,
    market_note: market.note,
    market_followers: market.stats[0]?.value || "11K+",
    market_posts: market.stats[1]?.value || "231+",
    market_facebook_url: market.facebook.href,
    hero_image_url: site.portrait.src,
  };
}

export function defaultSections(): SectionRow[] {
  return [
    { id: "about", section_key: "about", label: "About", href: "#about", visible: true, sort_order: 10 },
    { id: "experience", section_key: "experience", label: "Experience", href: "#experience", visible: true, sort_order: 30 },
    { id: "market", section_key: "market", label: "Market", href: "#market", visible: true, sort_order: 40 },
    { id: "projects", section_key: "projects", label: "Projects", href: "#projects", visible: true, sort_order: 50 },
    { id: "skills", section_key: "skills", label: "Skills", href: "#skills", visible: true, sort_order: 60 },
    { id: "content", section_key: "content", label: "Content", href: "#content", visible: true, sort_order: 70 },
    { id: "gallery", section_key: "gallery", label: "Photo Gallery", href: "/gallery", visible: true, sort_order: 72 },
    { id: "philosophy", section_key: "philosophy", label: "Philosophy", href: "#philosophy", visible: true, sort_order: 75 },
    { id: "contact", section_key: "contact", label: "Contact", href: "#contact", visible: true, sort_order: 80 },
  ];
}

export function defaultGallery(): GalleryRow[] {
  return gallery.map((photo, index) => ({
    id: `fallback-gallery-${index}`,
    title: photo.caption,
    description: photo.alt,
    category: photo.kind === "Personal" ? "Professional" : photo.kind === "Work" ? "FIRE Nepal" : "Projects",
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
      id: "fallback-fire",
      title: projects.fireNepal.name,
      description: projects.fireNepal.description,
      category: projects.fireNepal.category,
      technologies: [...projects.fireNepal.technologies],
      live_url: projects.fireNepal.href,
      github_url: "",
      youtube_url: "",
      image_url: projects.fireNepal.image,
      image_path: null,
      featured: true,
      published: true,
      sort_order: 10,
    },
    {
      id: "fallback-uvely",
      title: projects.uvelyGlow.name,
      description: projects.uvelyGlow.description,
      category: projects.uvelyGlow.category,
      technologies: [...projects.uvelyGlow.technologies],
      live_url: projects.uvelyGlow.href,
      github_url: "",
      youtube_url: "",
      image_url: projects.uvelyGlow.image,
      image_path: null,
      featured: false,
      published: true,
      sort_order: 20,
    },
    {
      id: "fallback-nepdealz",
      title: projects.nepDealz.name,
      description: projects.nepDealz.description,
      category: projects.nepDealz.category,
      technologies: [...projects.nepDealz.technologies],
      live_url: projects.nepDealz.href,
      github_url: "",
      youtube_url: "",
      image_url: projects.nepDealz.image,
      image_path: null,
      featured: false,
      published: true,
      sort_order: 30,
    },
  ];
}

export function defaultExperience(): ExperienceRow[] {
  return [
    {
      id: "fallback-kp",
      company: experience.company,
      position: experience.role,
      start_year: "",
      end_year: "Present",
      description: experience.summary,
      technologies: ["Transformer systems", "Production standards"],
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
    message:
      "If something here resonates, write to me. I read every note — products, NEPSE conversations, collaborations, content, or a simple exchange of ideas.",
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
  };
}

export function defaultProductCards(): ProductCardRow[] {
  return projects.fireNepal.visuals.map((visual, index) => ({
    id: `fallback-product-card-${index}`,
    title: visual.caption,
    description: visual.alt,
    image_url: visual.src,
    image_path: null,
    link_url: "",
    visible: true,
    sort_order: (index + 1) * 10,
  }));
}

export function defaultProductFeatures(): ProductFeatureRow[] {
  return projects.fireNepal.productAreas.map((title, index) => ({
    id: `fallback-product-feature-${index}`,
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
    source: "fallback",
  };
}

export { experience, site };
