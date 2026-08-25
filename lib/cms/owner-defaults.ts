/**
 * Original Raj Kumar Ghalan portfolio defaults — used ONLY as fallbacks for the owner site.
 * Never used for customer onboarding or empty customer sites.
 */
import type {
  ExperiencePhotoRow,
  JourneyStageRow,
  ProjectRow,
  PublicPortfolio,
  SettingsRow,
} from "@/lib/cms/types";
import { defaultContact, defaultProductSettings, defaultSeo, defaultSkills, defaultSocials } from "@/lib/cms/defaults";

export function ownerSettings(): SettingsRow {
  return {
    hero_title: "Raj Kumar Ghalan",
    hero_subtitle: "Building ideas into real-world digital products.",
    hero_positioning: "Market Analyst · Technical Analyst · Digital Builder · Creator",
    hero_body:
      "Experienced professional based in South Korea — a NEPSE market analyst and technical analyst, investor and trader, and a builder of digital products around financial independence and content.",
    about_title: "A professional career.\nA market analyst's eye.\nA builder's mindset.",
    about_body:
      "I have spent more than a decade working as a professional in South Korea — learning discipline, precision, and how real systems operate. Alongside that career, I analyze the Nepal Stock Exchange as a market analyst, technical analyst, investor, and trader, and I build digital products: tools for financial independence, commerce, and everyday decisions.",
    about_body_secondary:
      "The through-line is practical. I care about markets that people can read more clearly, technology they can use, and stories that travel between Nepal, Korea, and the work of making things.",
    about_experience_label: "14+ Years of Professional Experience",
    journey_title: "Professional journey",
    journey_description: "Industrial craft first. Digital products next. The same standard: do the work carefully.",
    philosophy: "Build things that make life simpler, smarter, and more independent.",
    content_title: "Beyond Code. I Create.",
    content_description:
      "I also make digital and social content around NEPSE technical analysis, financial education, personal finance, Nepal, Korea, career, and the products I am building.",
    content_youtube_title: "FIRE Nepal on YouTube",
    content_youtube_body:
      "Financial education, personal finance, and stories around the FIRE Nepal product — on the official FIRE Nepal channel.",
    market_title: "Reading the Nepal market with discipline",
    market_description:
      "I analyze the Nepal Stock Exchange (NEPSE) with a focus on technical analysis, market trends, trading strategies, and investor education. Through my content and analysis, I share practical insights for Nepali investors and traders navigating the stock market.",
    market_profile:
      "I am a Nepali share market investor and NEPSE market analyst. My technical analysis Facebook page has 11K+ followers. I publish NEPSE technical analysis, follow Nepal share market trends, and actively invest and trade — educational work for investors and traders, not profit or return guarantees.",
    market_note:
      "Educational analysis and content for investors and traders — not licensed financial advice, and not a promise of profits or returns.",
    market_followers: "11K+",
    market_posts: "231+",
    market_facebook_url: "https://www.facebook.com/share/14ufXJ5qRDG/?mibextid=wwXIfr",
    hero_image_url: "/photos/portrait-hero.jpg",
    website_name: "Raj Kumar Ghalan",
    brand_name: "Raj Kumar Ghalan",
    wordmark: "RAJ KUMAR GHALAN",
    logo_url: "",
    favicon_url: "",
    accent_color: "#3DDC97",
    theme_preference: "dark",
    copyright_text: "",
    site_url: "",
    onboarding_completed: true,
    hero_primary_cta_text: "View My Work",
    hero_primary_cta_href: "#projects",
    hero_secondary_cta_text: "Let's Connect",
    hero_secondary_cta_href: "#contact",
    gallery_page_eyebrow: "Photo Gallery",
    gallery_page_title: "Moments from the work, the journey, and the build.",
    gallery_page_description:
      "A collection of photographs from projects, professional life, and experiences — managed from the admin gallery and kept current as new frames are published.",
    gallery_cta_label: "View Photo Gallery",
    gallery_cta_href: "/gallery",
    career_timeline_eyebrow: "Path",
    career_timeline_title: "The journey so far",
    market_eyebrow: "Market & Investment",
    market_followers_label: "Followers",
    market_posts_label: "Posts",
    market_facebook_cta: "Follow NEPSE Market Analyst",
    content_eyebrow: "Creator",
    content_youtube_context: "YouTube / FIRE Nepal",
    content_youtube_cta: "Watch on YouTube",
    content_themes: [
      "NEPSE Technical Analysis",
      "Market analysis",
      "Trading ideas",
      "Financial education",
      "Personal finance",
      "Nepal",
      "Korea",
      "Career",
      "Product building",
    ],
    market_capabilities: [
      "NEPSE Market Analysis",
      "Technical Analysis",
      "Market Trend Analysis",
      "Trading & Investment",
      "Nepali Share Market Investor",
      "Investor Education",
      "Financial Content Creation",
    ],
    other_projects_eyebrow: "More work",
    other_projects_title: "Other projects",
    about_eyebrow: "01 / About",
    about_known_experience_heading: "Known experience",
  };
}

export function ownerCareerStages(): JourneyStageRow[] {
  return [
    { id: "owner-career-1", kind: "career", stage_label: "01", title: "Nepal", body: "Roots, values, and the beginning of a long professional path.", visible: true, sort_order: 10 },
    { id: "owner-career-2", kind: "career", stage_label: "02", title: "South Korea", body: "Living and working abroad — building a career far from home.", visible: true, sort_order: 20 },
    { id: "owner-career-3", kind: "career", stage_label: "03", title: "Professional Experience", body: "14+ years of technical work, discipline, and industrial craft.", visible: true, sort_order: 30 },
    { id: "owner-career-4", kind: "career", stage_label: "04", title: "Digital Builder", body: "Learning modern product tools and turning ideas into software.", visible: true, sort_order: 40 },
    { id: "owner-career-5", kind: "career", stage_label: "05", title: "Market Analyst", body: "Technical analysis, NEPSE market trends, and investor education for Nepali traders.", visible: true, sort_order: 50 },
    { id: "owner-career-6", kind: "career", stage_label: "06", title: "Product Creator", body: "Shipping platforms and stories that help people make better decisions.", visible: true, sort_order: 60 },
  ];
}

export function ownerExperienceStages(): JourneyStageRow[] {
  return [
    { id: "owner-exp-1", kind: "experience", stage_label: "2020s", title: "Professional expertise", body: "Deepening technical craft inside a manufacturing environment where quality and consistency matter.", visible: true, sort_order: 10 },
    { id: "owner-exp-2", kind: "experience", stage_label: "Craft", title: "Technical experience", body: "Years of working with transformer systems, machines, and production standards.", visible: true, sort_order: 20 },
    { id: "owner-exp-3", kind: "experience", stage_label: "Shift", title: "Digital transformation", body: "A growing interest in technology, product thinking, and building software that people can actually use.", visible: true, sort_order: 30 },
    { id: "owner-exp-4", kind: "experience", stage_label: "Now", title: "Product building", body: "Turning that curiosity into real digital products, NEPSE market analysis, and financial content.", visible: true, sort_order: 40 },
  ];
}

export function ownerExperiencePhotos(): ExperiencePhotoRow[] {
  return [];
}

export function ownerProjects(): ProjectRow[] {
  return [
    {
      id: "owner-fire-nepal",
      title: "FIRE Nepal",
      description:
        "A financial life platform designed to help Nepalis track wealth, understand their finances, plan for retirement, and work toward Financial Independence and Early Retirement.",
      category: "FinTech · Personal Finance · AI · SaaS",
      technologies: ["Next.js", "TypeScript", "Supabase", "PostgreSQL", "Vercel", "AI integrations"],
      live_url: "https://www.firenepal.com",
      github_url: "",
      youtube_url: "",
      image_url: "/projects/fire-nepal-cashflow.jpg",
      image_path: null,
      featured: true,
      published: true,
      sort_order: 10,
    },
    {
      id: "owner-uvely-glow",
      title: "Uvely Glow",
      description:
        "A premium Korean beauty e-commerce concept — Seoul-inspired storefront, product discovery, and a skincare quiz for matching routines.",
      category: "E-commerce · Beauty Technology",
      technologies: ["Next.js", "TypeScript", "Tailwind CSS", "Supabase"],
      live_url: "",
      github_url: "",
      youtube_url: "",
      image_url: "/projects/uvely-glow-home.jpg",
      image_path: null,
      featured: false,
      published: true,
      sort_order: 20,
    },
    {
      id: "owner-nepdealz",
      title: "NepDealz",
      description: "An e-commerce and digital commerce project exploring practical online business for real customers.",
      category: "E-commerce · Digital Commerce",
      technologies: ["Digital Commerce", "E-commerce"],
      live_url: "",
      github_url: "",
      youtube_url: "",
      image_url: "",
      image_path: null,
      featured: false,
      published: true,
      sort_order: 30,
    },
  ];
}

export function ownerGallery(): import("@/lib/cms/types").GalleryRow[] {
  return [
    { id: "owner-g1", title: "Portrait", description: "Portrait of Raj Kumar Ghalan", category: "Professional", image_path: null, image_url: "/photos/portrait-hero.jpg", featured: true, visible: true, sort_order: 10 },
    { id: "owner-g2", title: "Building FIRE Nepal", description: "Laptop open to FIRE Nepal during product work", category: "FIRE Nepal", image_path: null, image_url: "/photos/life-01-building.jpg", featured: false, visible: true, sort_order: 20 },
    { id: "owner-g3", title: "Product work", description: "FIRE Nepal dashboard on a laptop", category: "FIRE Nepal", image_path: null, image_url: "/photos/life-02-dashboard.jpg", featured: false, visible: true, sort_order: 30 },
    { id: "owner-g4", title: "Workspace", description: "FIRE Nepal portfolio workspace on a laptop", category: "Projects", image_path: null, image_url: "/photos/life-03-portfolio.jpg", featured: false, visible: true, sort_order: 40 },
    { id: "owner-g5", title: "FIRE Nepal", description: "FIRE Nepal homepage", category: "FIRE Nepal", image_path: null, image_url: "/projects/fire-nepal-home.jpg", featured: false, visible: true, sort_order: 50 },
    { id: "owner-g6", title: "Cashflow", description: "FIRE Nepal cashflow dashboard", category: "FIRE Nepal", image_path: null, image_url: "/projects/fire-nepal-cashflow.jpg", featured: false, visible: true, sort_order: 60 },
    { id: "owner-g7", title: "Tools", description: "FIRE Nepal tools on mobile", category: "FIRE Nepal", image_path: null, image_url: "/projects/fire-nepal-tools.jpg", featured: false, visible: true, sort_order: 70 },
    { id: "owner-g8", title: "Uvely Glow", description: "Uvely Glow storefront", category: "Projects", image_path: null, image_url: "/projects/uvely-glow-home.jpg", featured: false, visible: true, sort_order: 80 },
  ];
}

export function ownerPortfolio(): PublicPortfolio {
  const settings = ownerSettings();
  return {
    settings,
    sections: [],
    gallery: ownerGallery(),
    projects: ownerProjects(),
    experience: [
      {
        id: "owner-kp-electric",
        company: "KP Electric",
        position: "Cast Resin Transformer / Transformer Machine Operator / Transformer Technician",
        location: "",
        start_year: "",
        end_year: "Present",
        description:
          "Hands-on technical work in transformer manufacturing — precision, process discipline, and responsibility for real industrial equipment.",
        technologies: ["Transformer systems", "Production standards", "Industrial craft"],
        logo_url: "/experience/kp-electric.png",
        logo_path: null,
        featured: true,
        visible: true,
        sort_order: 10,
      },
    ],
    skills: defaultSkills(),
    socials: defaultSocials(),
    contact: defaultContact(),
    seo: defaultSeo(),
    productSettings: defaultProductSettings(),
    productCards: [],
    productFeatures: [],
    journeyStages: [...ownerCareerStages(), ...ownerExperienceStages()],
    experiencePhotos: ownerExperiencePhotos(),
    source: "fallback",
    site: { id: "owner-fallback", slug: "default", name: "Raj Kumar Ghalan", plan_tier: "pro", onboarding_completed: true, is_owner_site: true },
  };
}

/** Fill empty CMS string fields from owner defaults on the owner site only. */
export function enrichOwnerSettings(settings: SettingsRow): SettingsRow {
  const owner = ownerSettings();
  const next = { ...settings };
  for (const key of Object.keys(owner) as (keyof SettingsRow)[]) {
    const value = next[key];
    const fallback = owner[key];
    if ((value === "" || value == null) && fallback != null && fallback !== "") {
      (next as Record<string, unknown>)[key] = fallback;
    }
    if (Array.isArray(value) && value.length === 0 && Array.isArray(fallback) && fallback.length > 0) {
      (next as Record<string, unknown>)[key] = fallback;
    }
  }
  return next;
}

export function isOwnerSite(portfolio: Pick<PublicPortfolio, "site">) {
  return Boolean(portfolio.site?.is_owner_site);
}
