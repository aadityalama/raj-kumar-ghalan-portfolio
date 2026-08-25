import { cache } from "react";
import { brandDisplayName } from "@/lib/cms/branding";
import { defaultGallery, fallbackPortfolio } from "@/lib/cms/defaults";
import { resolvePublicSite } from "@/lib/cms/site";
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
import { hasSupabaseEnv } from "@/lib/supabase/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";

// eslint-disable-next-line @typescript-eslint/no-explicit-any -- Supabase builder generics blow the TS recursion limit
function withSiteFilter(query: any, siteId: string) {
  return query.eq("site_id", siteId);
}

export const getPublicGallery = cache(async (): Promise<GalleryRow[]> => {
  if (!hasSupabaseEnv()) return defaultGallery();

  try {
    const site = await resolvePublicSite();
    if (!site?.id) return defaultGallery();

    const supabase = await createSupabaseServerClient();
    const { data } = await withSiteFilter(
      supabase.from("portfolio_gallery").select("*").eq("visible", true).order("sort_order"),
      site.id,
    );

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
      gallery: [],
    };
  }

  try {
    const site = await resolvePublicSite();
    if (!site?.id) {
      return {
        ...fallback,
        gallery: [],
      };
    }

    const siteId = site.id;
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
      productSettingsRes,
      productCardsRes,
      productFeaturesRes,
    ] = await Promise.all([
      withSiteFilter(supabase.from("portfolio_settings").select("*"), siteId).maybeSingle(),
      withSiteFilter(
        supabase.from("portfolio_sections").select("*").eq("visible", true).order("sort_order"),
        siteId,
      ),
      withSiteFilter(
        supabase.from("portfolio_projects").select("*").eq("published", true).order("sort_order"),
        siteId,
      ),
      withSiteFilter(supabase.from("portfolio_experience").select("*").order("sort_order"), siteId),
      withSiteFilter(
        supabase.from("portfolio_skills").select("*").eq("visible", true).order("sort_order"),
        siteId,
      ),
      withSiteFilter(
        supabase.from("portfolio_social_links").select("*").eq("visible", true).order("sort_order"),
        siteId,
      ),
      withSiteFilter(supabase.from("portfolio_contact").select("*"), siteId).maybeSingle(),
      withSiteFilter(supabase.from("portfolio_seo").select("*"), siteId).maybeSingle(),
      withSiteFilter(supabase.from("portfolio_product_settings").select("*"), siteId).maybeSingle(),
      withSiteFilter(
        supabase.from("portfolio_product_cards").select("*").eq("visible", true).order("sort_order"),
        siteId,
      ),
      withSiteFilter(
        supabase
          .from("portfolio_product_features")
          .select("*")
          .eq("visible", true)
          .order("sort_order"),
        siteId,
      ),
    ]);

    const hasCms = settingsRes.data || (sectionsRes.data && sectionsRes.data.length > 0);

    if (!hasCms) {
      return {
        ...fallback,
        gallery: [],
        site,
      };
    }

    const productCardsError = Boolean(productCardsRes.error);
    const productFeaturesError = Boolean(productFeaturesRes.error);

    return {
      settings: (settingsRes.data as SettingsRow) || fallback.settings,
      sections: ((sectionsRes.data as SectionRow[]) || fallback.sections).filter(
        (item) => item.visible,
      ),
      gallery: [],
      projects: (projectsRes.data as ProjectRow[]) || fallback.projects,
      experience: (experienceRes.data as ExperienceRow[]) || fallback.experience,
      skills: (skillsRes.data as SkillRow[]) || fallback.skills,
      socials: ((socialsRes.data as SocialRow[]) || fallback.socials).filter((item) => item.href),
      contact: (contactRes.data as ContactRow) || fallback.contact,
      seo: (seoRes.data as SeoRow) || fallback.seo,
      productSettings:
        (productSettingsRes.data as ProductSettingsRow) || fallback.productSettings,
      productCards: productCardsError
        ? fallback.productCards
        : ((productCardsRes.data as ProductCardRow[]) || fallback.productCards),
      productFeatures: productFeaturesError
        ? fallback.productFeatures
        : ((productFeaturesRes.data as ProductFeatureRow[]) || fallback.productFeatures),
      source: "cms",
      site,
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
  const visible = portfolio.sections.filter(
    (item) => item.visible && !["hero", "product", "philosophy", "market"].includes(item.section_key),
  );
  const fromPreferred = preferred
    .map((key) => visible.find((item) => item.section_key === key))
    .filter((item): item is SectionRow => Boolean(item));

  return (fromPreferred.length ? fromPreferred : visible.slice(0, 7)).map((item) => ({
    label: navLabel(item),
    href: navHref(item),
  }));
}

export function featuredPortrait(portfolio: PublicPortfolio) {
  const name = brandDisplayName(portfolio.settings);
  if (portfolio.settings.hero_image_url) {
    return {
      src: portfolio.settings.hero_image_url,
      alt: `Portrait of ${name}`,
    };
  }

  return {
    src: "/photos/portrait-hero.jpg",
    alt: `Portrait of ${name}`,
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

export function orderedHomeSections(portfolio: PublicPortfolio) {
  const keys = [
    "about",
    "experience",
    "market",
    "projects",
    "product",
    "skills",
    "content",
    "philosophy",
    "gallery",
    "contact",
  ];
  const byKey = new Map(portfolio.sections.map((item) => [item.section_key, item]));
  return keys
    .map((key) => byKey.get(key))
    .filter((item): item is SectionRow => Boolean(item))
    .sort((a, b) => a.sort_order - b.sort_order);
}
