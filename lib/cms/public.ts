import { cache } from "react";
import { defaultGallery, fallbackPortfolio } from "@/lib/cms/defaults";
import type {
  ContactRow,
  ExperienceRow,
  GalleryRow,
  ProjectRow,
  PublicPortfolio,
  SectionRow,
  SeoRow,
  SettingsRow,
  SkillRow,
  SocialRow,
} from "@/lib/cms/types";
import { hasSupabaseEnv } from "@/lib/supabase/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const getPublicGallery = cache(async (): Promise<GalleryRow[]> => {
  if (!hasSupabaseEnv()) return defaultGallery();

  try {
    const supabase = await createSupabaseServerClient();
    const { data } = await supabase
      .from("portfolio_gallery")
      .select("*")
      .eq("visible", true)
      .order("sort_order");

    if (data && data.length > 0) return data as GalleryRow[];
    return defaultGallery();
  } catch {
    return defaultGallery();
  }
});

export const getPublicPortfolio = cache(async (): Promise<PublicPortfolio> => {
  const fallback = fallbackPortfolio();
  if (!hasSupabaseEnv()) {
    return {
      ...fallback,
      // Homepage consumers should not pull the full gallery payload.
      gallery: [],
    };
  }

  try {
    const supabase = await createSupabaseServerClient();
    const [
      settingsRes,
      sectionsRes,
      projectsRes,
      experienceRes,
      skillsRes,
      socialsRes,
      contactRes,
      seoRes,
    ] = await Promise.all([
      supabase.from("portfolio_settings").select("*").eq("id", 1).maybeSingle(),
      supabase.from("portfolio_sections").select("*").eq("visible", true).order("sort_order"),
      supabase.from("portfolio_projects").select("*").eq("published", true).order("sort_order"),
      supabase.from("portfolio_experience").select("*").order("sort_order"),
      supabase.from("portfolio_skills").select("*").eq("visible", true).order("sort_order"),
      supabase.from("portfolio_social_links").select("*").eq("visible", true).order("sort_order"),
      supabase.from("portfolio_contact").select("*").eq("id", 1).maybeSingle(),
      supabase.from("portfolio_seo").select("*").eq("id", 1).maybeSingle(),
    ]);

    const hasCms =
      settingsRes.data ||
      (sectionsRes.data && sectionsRes.data.length > 0);

    if (!hasCms) {
      return {
        ...fallback,
        gallery: [],
      };
    }

    return {
      settings: (settingsRes.data as SettingsRow) || fallback.settings,
      sections: ((sectionsRes.data as SectionRow[]) || fallback.sections).filter((item) => item.visible),
      gallery: [],
      projects: (projectsRes.data as ProjectRow[]) || fallback.projects,
      experience: (experienceRes.data as ExperienceRow[]) || fallback.experience,
      skills: (skillsRes.data as SkillRow[]) || fallback.skills,
      socials: ((socialsRes.data as SocialRow[]) || fallback.socials).filter((item) => item.href),
      contact: (contactRes.data as ContactRow) || fallback.contact,
      seo: (seoRes.data as SeoRow) || fallback.seo,
      source: "cms",
    };
  } catch {
    return {
      ...fallback,
      gallery: [],
    };
  }
});

export function isSectionVisible(portfolio: PublicPortfolio, key: string) {
  const match = portfolio.sections.find((item) => item.section_key === key);
  return match ? match.visible : true;
}

export function sectionLabel(portfolio: PublicPortfolio, key: string, fallback: string) {
  return portfolio.sections.find((item) => item.section_key === key)?.label || fallback;
}

function navHref(item: SectionRow) {
  if (item.section_key === "gallery") return "/gallery";
  if (item.href.startsWith("#") || item.href.startsWith("/")) return item.href;
  return `#${item.section_key}`;
}

function navLabel(item: SectionRow) {
  if (item.section_key === "gallery" && (item.label === "Gallery" || !item.label)) {
    return "Photo Gallery";
  }
  return item.label;
}

export function navItems(portfolio: PublicPortfolio) {
  const preferred = [
    "about",
    "experience",
    "projects",
    "skills",
    "content",
    "gallery",
    "contact",
  ];
  const visible = portfolio.sections.filter((item) => item.visible);
  const fromPreferred = preferred
    .map((key) => visible.find((item) => item.section_key === key))
    .filter((item): item is SectionRow => Boolean(item));

  return (fromPreferred.length ? fromPreferred : visible.slice(0, 7)).map((item) => ({
    label: navLabel(item),
    href: navHref(item),
  }));
}

export function featuredPortrait(portfolio: PublicPortfolio) {
  if (portfolio.settings.hero_image_url) {
    return {
      src: portfolio.settings.hero_image_url,
      alt: "Portrait of Raj Kumar Ghalan",
    };
  }

  return {
    src: "/photos/portrait-hero.jpg",
    alt: "Portrait of Raj Kumar Ghalan",
  };
}

export function socialByPlatform(portfolio: PublicPortfolio, platform: string) {
  return portfolio.socials.find((item) => item.platform.toLowerCase() === platform.toLowerCase());
}

export function groupedSkills(skills: SkillRow[]) {
  return skills.reduce<Record<string, string[]>>((groups, skill) => {
    groups[skill.category] = [...(groups[skill.category] || []), skill.name];
    return groups;
  }, {});
}
