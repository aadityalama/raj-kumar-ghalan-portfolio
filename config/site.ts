/**
 * Neutral product defaults for Portfolio CMS.
 * Customer-facing sites should load content from Supabase CMS.
 * These values are demo placeholders only — never invent credentials.
 */

export const PRODUCT_NAME = "Portfolio CMS";

export const site = {
  name: "Your Name",
  wordmark: "YOUR NAME",
  shortName: "YN",
  positioning: "Creative Professional",
  headline: "Building meaningful digital experiences.",
  location: "",
  origin: "",
  experienceYears: "",
  experienceLabel: "Professional Experience",
  title: "Your Name — Creative Professional",
  description:
    "A premium portfolio website for showcasing projects, experience, and creative work.",
  keywords: [
    "portfolio",
    "creative professional",
    "digital products",
    "projects",
    "experience",
  ],
  get url() {
    return (
      process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/+$/, "") ||
      "http://localhost:3000"
    );
  },
  email: "",
  portrait: {
    src: "",
    alt: "Profile photo",
  },
  resumeUrl: "",
  locale: "en_US",
} as const;

export const socials = {
  youtube: {
    label: "YouTube",
    href: "",
    note: "YouTube channel",
  },
  facebook: {
    label: "Facebook",
    href: "",
    note: "Facebook",
  },
  instagram: {
    label: "Instagram",
    href: "",
    note: "Instagram",
  },
  tiktok: {
    label: "TikTok",
    href: "",
    note: "TikTok",
  },
  linkedin: {
    label: "LinkedIn",
    href: "",
    note: "LinkedIn",
  },
  github: {
    label: "GitHub",
    href: "",
    note: "GitHub",
  },
  email: {
    label: "Email",
    href: "",
    note: "Direct email",
  },
} as const;

export const navigation = [
  { label: "About", href: "#about" },
  { label: "Experience", href: "#experience" },
  { label: "Projects", href: "#projects" },
  { label: "Skills", href: "#skills" },
  { label: "Photo Gallery", href: "/gallery" },
  { label: "Contact", href: "#contact" },
] as const;

export const gallery = [
  {
    src: "/photos/portrait-hero.jpg",
    alt: "Demo profile portrait placeholder",
    caption: "Portrait",
    kind: "Professional",
  },
] as const;

export const experience = {
  company: "Example Studio",
  role: "Creative Professional",
  tenure: "",
  logo: "",
  photos: [] as readonly { src: string; alt: string; caption: string }[],
  summary:
    "Add your professional experience here — company, role, and a short summary of your work.",
  stages: [
    {
      label: "Start",
      title: "Foundation",
      body: "Describe how your career began.",
    },
    {
      label: "Craft",
      title: "Growing expertise",
      body: "Highlight the skills and disciplines you developed.",
    },
    {
      label: "Shift",
      title: "New direction",
      body: "Share a meaningful transition in your work.",
    },
    {
      label: "Now",
      title: "Current focus",
      body: "Explain what you are building or creating today.",
    },
  ],
} as const;

export const projects = {
  featured: {
    number: "01",
    name: "Featured Project",
    category: "Product · Design · Technology",
    href: "",
    description:
      "Showcase your signature project — what it is, who it helps, and why it matters.",
    features: ["Feature one", "Feature two", "Feature three", "Feature four"],
    productAreas: ["Overview", "Experience", "Tools", "Insights"],
    technologies: ["Next.js", "TypeScript", "Supabase"],
    image: "",
    visuals: [] as readonly { src: string; alt: string; caption: string }[],
    accent: "emerald",
  },
  secondary: {
    number: "02",
    name: "Secondary Project",
    category: "Design · Development",
    href: "",
    description: "A second project to demonstrate breadth of work.",
    technologies: ["React", "TypeScript"],
    image: "",
    accent: "rose",
  },
} as const;

export const skills = {
  "Digital Product": ["Product thinking", "UI/UX", "Responsive design"],
  Technology: ["Next.js", "React", "TypeScript", "Tailwind CSS"],
  Content: ["Storytelling", "Visual communication"],
} as const;

export const market = {
  eyebrow: "Spotlight",
  title: "Share a professional focus area",
  description:
    "Use this section for a market profile, specialty, or any spotlight topic your audience cares about.",
  profile: "Add a short profile that explains your focus and credibility.",
  facebook: {
    label: "Learn more",
    href: "",
    cta: "Open profile",
  },
  stats: [
    { value: "—", label: "Metric" },
    { value: "—", label: "Metric" },
  ],
  capabilities: ["Capability one", "Capability two", "Capability three"],
  note: "Optional disclaimer or supporting note.",
} as const;

export const contentFocus = {
  title: "Content focus",
  body: "Describe the themes you create content around.",
  href: "",
  stats: [
    { value: "—", label: "Metric" },
    { value: "—", label: "Metric" },
  ],
  context: "Content profile",
} as const;

export const youtubeFocus = {
  title: "Video content",
  body: "Link your channel and describe what viewers will find.",
  href: "",
  cta: "Open channel",
  context: "Video channel",
} as const;

export const contentThemes = [
  "Product",
  "Design",
  "Technology",
  "Career",
  "Education",
] as const;

export const careerJourney = [
  {
    stage: "01",
    title: "Beginnings",
    body: "Where your story started.",
  },
  {
    stage: "02",
    title: "Experience",
    body: "Professional growth and craft.",
  },
  {
    stage: "03",
    title: "Building",
    body: "Turning ideas into real work.",
  },
  {
    stage: "04",
    title: "Today",
    body: "What you are creating now.",
  },
] as const;

export const philosophy = "Build work that is clear, useful, and lasting.";

export function resolvedSocials() {
  return Object.values(socials).filter((item) => Boolean(item.href));
}

export function emailHref() {
  return site.email ? `mailto:${site.email}` : "";
}
