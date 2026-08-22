/**
 * Central content + SEO configuration for Raj Kumar Ghalan.
 * Update placeholders here instead of scattering facts across components.
 *
 * PLACEHOLDER fields are intentionally null or empty until a real value exists.
 * Do not invent emails, social profiles, URLs, dates, or metrics.
 */

export const site = {
  name: "Raj Kumar Ghalan",
  wordmark: "RAJ KUMAR GHALAN",
  shortName: "RKG",
  positioning: "Market Analyst · Technical Analyst · Digital Builder · Creator",
  headline: "Building ideas into real-world digital products.",
  location: "South Korea",
  origin: "Nepal",
  experienceYears: "14+",
  experienceLabel: "14+ Years of Professional Experience",
  title: "Raj Kumar Ghalan — Market Analyst, Technical Analyst, Digital Builder, Creator",
  description:
    "Personal website of Raj Kumar Ghalan — a NEPSE market analyst, technical analyst, investor, trader, and digital builder based in South Korea.",
  keywords: [
    "Raj Kumar Ghalan",
    "NEPSE",
    "market analyst",
    "technical analysis",
    "Nepal Stock Exchange",
    "digital builder",
    "FIRE Nepal",
    "financial technology",
    "personal finance",
    "South Korea",
    "Nepal",
    "digital products",
    "content creator",
  ],
  /**
   * PLACEHOLDER: set NEXT_PUBLIC_SITE_URL in production.
   * Falls back to localhost so metadata/canonical still work in development.
   */
  get url() {
    return (
      process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/+$/, "") ||
      "http://localhost:3000"
    );
  },
  email: "aadityalama853@gmail.com",
  portrait: {
    src: "/photos/portrait-hero.jpg",
    alt: "Portrait of Raj Kumar Ghalan",
  },
  /**
   * PLACEHOLDER: add a resume PDF path (e.g. "/raj-kumar-ghalan-resume.pdf")
   * after the file is placed in /public.
   */
  resumeUrl: "",
  locale: "en_US",
} as const;

export const socials = {
  youtube: {
    label: "YouTube",
    href: "https://www.youtube.com/@Firenepal853",
    note: "FIRE Nepal channel",
  },
  facebook: {
    label: "Facebook",
    href: "https://www.facebook.com/share/1AuV3FkbDN/?mibextid=wwXIfr",
    note: "FIRE Nepal",
  },
  instagram: {
    label: "Instagram",
    href: "https://www.instagram.com/firenepal",
    note: "FIRE Nepal",
  },
  tiktok: {
    label: "TikTok",
    href: "https://www.tiktok.com/@firenepal4",
    note: "FIRE Nepal",
  },
  /**
   * PLACEHOLDER: personal LinkedIn profile URL.
   */
  linkedin: {
    label: "LinkedIn",
    href: "",
    note: "PLACEHOLDER — add personal LinkedIn URL",
  },
} as const;

export const navigation = [
  { label: "About", href: "#about" },
  { label: "Experience", href: "#experience" },
  { label: "Projects", href: "#projects" },
  { label: "Skills", href: "#skills" },
  { label: "Content", href: "#content" },
  { label: "Contact", href: "#contact" },
] as const;

export const gallery = [
  {
    src: "/photos/portrait-hero.jpg",
    alt: "Portrait of Raj Kumar Ghalan",
    caption: "Portrait",
  },
  {
    src: "/photos/life-01-building.jpg",
    alt: "Laptop open to FIRE Nepal during product work",
    caption: "Building FIRE Nepal",
  },
  {
    src: "/photos/life-02-dashboard.jpg",
    alt: "FIRE Nepal dashboard on a laptop",
    caption: "Product work",
  },
  {
    src: "/photos/life-03-portfolio.jpg",
    alt: "FIRE Nepal portfolio workspace on a laptop",
    caption: "Workspace",
  },
] as const;

export const experience = {
  company: "KP Electric",
  role: "Cast Resin Transformer / Transformer Machine Operator / Transformer Technician",
  tenure: "14+ years",
  logo: "/experience/kp-electric.png",
  /**
   * Workplace photos were not among the supplied image set.
   * Add files under public/experience and list them here.
   */
  photos: [] as readonly { src: string; alt: string; caption: string }[],
  summary:
    "Hands-on technical work in transformer manufacturing — precision, process discipline, and responsibility for real industrial equipment.",
  stages: [
    {
      label: "2020s",
      title: "Professional expertise",
      body: "Deepening technical craft inside a manufacturing environment where quality and consistency matter.",
    },
    {
      label: "Craft",
      title: "Technical experience",
      body: "Years of working with transformer systems, machines, and production standards.",
    },
    {
      label: "Shift",
      title: "Digital transformation",
      body: "A growing interest in technology, product thinking, and building software that people can actually use.",
    },
    {
      label: "Now",
      title: "Product building",
      body: "Turning that curiosity into real digital products, NEPSE market analysis, and financial content.",
    },
  ],
} as const;

export const projects = {
  fireNepal: {
    number: "01",
    name: "FIRE Nepal",
    category: "FinTech · Personal Finance · AI · SaaS",
    href: "https://www.firenepal.com",
    description:
      "A financial life platform designed to help Nepalis track wealth, understand their finances, plan for retirement, and work toward Financial Independence and Early Retirement.",
    features: [
      "FIRE Calculator",
      "Net Worth Tracking",
      "Portfolio Analytics",
      "Savings Tracker",
      "Expense Tracking",
      "Financial Intelligence",
      "AI Financial Guidance",
      "Retirement Analysis",
      "Multi-currency support",
      "Nepal-focused financial tools",
    ],
    productAreas: [
      "Dashboard",
      "FIRE Calculator",
      "Portfolio",
      "Cashflow",
      "Savings",
      "FIRE Biz",
      "FIRE AI",
      "Retirement Analysis",
    ],
    technologies: [
      "Next.js",
      "TypeScript",
      "Supabase",
      "PostgreSQL",
      "Vercel",
      "AI integrations",
    ],
    image: "/projects/fire-nepal-cashflow.jpg",
    visuals: [
      {
        src: "/projects/fire-nepal-home.jpg",
        alt: "FIRE Nepal homepage",
        caption: "Home",
      },
      {
        src: "/projects/fire-nepal-cashflow.jpg",
        alt: "FIRE Nepal cashflow dashboard",
        caption: "Cashflow",
      },
      {
        src: "/projects/fire-nepal-tools.jpg",
        alt: "FIRE Nepal tools on mobile",
        caption: "Tools",
      },
      {
        src: "/projects/fire-nepal-return.jpg",
        alt: "FIRE Nepal return planner",
        caption: "Return planner",
      },
      {
        src: "/projects/fire-nepal-banner.jpg",
        alt: "FIRE Nepal brand banner",
        caption: "Brand",
      },
    ],
    accent: "emerald",
  },
  uvelyGlow: {
    number: "02",
    name: "Uvely Glow",
    category: "E-commerce · Beauty Technology",
    /**
     * PLACEHOLDER: add a public production URL when the storefront is live.
     */
    href: "",
    description:
      "A premium Korean beauty e-commerce concept — Seoul-inspired storefront, product discovery, and a skincare quiz for matching routines.",
    technologies: ["Next.js", "TypeScript", "Tailwind CSS", "Supabase"],
    image: "/projects/uvely-glow-home.jpg",
    accent: "rose",
  },
  nepDealz: {
    number: "03",
    name: "NepDealz",
    category: "E-commerce · Digital Commerce",
    /**
     * PLACEHOLDER: add a public URL when the project is published.
     */
    href: "",
    description:
      "An e-commerce and digital commerce project exploring practical online business for real customers.",
    technologies: ["Digital Commerce", "E-commerce"],
    image: "",
    accent: "amber",
  },
} as const;

export const skills = {
  "Digital Product": [
    "Product thinking",
    "UI/UX",
    "Responsive design",
    "SaaS concepts",
  ],
  Technology: [
    "Next.js",
    "React",
    "TypeScript",
    "Tailwind CSS",
    "Supabase",
    "PostgreSQL",
    "GitHub",
    "Vercel",
  ],
  AI: [
    "AI product integration",
    "AI-assisted workflows",
    "Financial AI concepts",
    "AI-powered product experiences",
  ],
  Content: [
    "Social media content",
    "YouTube content",
    "Financial education content",
    "Digital storytelling",
  ],
  Markets: [
    "NEPSE Market Analysis",
    "Technical Analysis",
    "Market Trend Analysis",
    "Trading & Investment",
    "Investor Education",
    "Financial Content Creation",
  ],
} as const;

export const market = {
  eyebrow: "Market & Investment",
  title: "Reading the Nepal market with discipline",
  description:
    "I analyze the Nepal Stock Exchange (NEPSE) with a focus on technical analysis, market trends, trading strategies, and investor education. Through my content and analysis, I share practical insights for Nepali investors and traders navigating the stock market.",
  capabilities: [
    "NEPSE Market Analysis",
    "Technical Analysis",
    "Market Trend Analysis",
    "Trading & Investment",
    "Investor Education",
    "Financial Content Creation",
  ],
  note: "Educational analysis and content for investors and traders — not licensed financial advice.",
} as const;

export const contentFocus = {
  title: "NEPSE Technical Analysis",
  body: "Market analysis, technical setups, trading ideas, market trends and educational content for Nepali investors and traders.",
  stats: [
    { value: "11K+", label: "Followers" },
    { value: "231+", label: "Posts" },
  ],
  context: "NEPSE / technical analysis Facebook page",
} as const;

export const contentThemes = [
  "NEPSE Technical Analysis",
  "Market analysis",
  "Trading ideas",
  "Financial education",
  "Personal finance",
  "Nepal",
  "Korea",
  "Career and life",
  "Digital products",
] as const;

export const careerJourney = [
  {
    stage: "01",
    title: "Nepal",
    body: "Roots, values, and the beginning of a long professional path.",
  },
  {
    stage: "02",
    title: "South Korea",
    body: "Living and working abroad — building a career far from home.",
  },
  {
    stage: "03",
    title: "Professional Experience",
    body: "14+ years of technical work, discipline, and industrial craft.",
  },
  {
    stage: "04",
    title: "Digital Builder",
    body: "Learning modern product tools and turning ideas into software.",
  },
  {
    stage: "05",
    title: "Market Analyst",
    body: "Technical analysis, NEPSE market trends, and investor education for Nepali traders.",
  },
  {
    stage: "06",
    title: "Product Creator",
    body: "Shipping platforms and stories that help people make better decisions.",
  },
] as const;

export const philosophy =
  "Build things that make life simpler, smarter, and more independent.";

export function resolvedSocials() {
  return Object.values(socials).filter((item) => Boolean(item.href));
}

export function emailHref() {
  return site.email ? `mailto:${site.email}` : "";
}
