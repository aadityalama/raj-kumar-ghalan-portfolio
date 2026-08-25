import { cache } from "react";
import { brandDisplayName } from "@/lib/cms/branding";
import { defaultGallery, fallbackPortfolio } from "@/lib/cms/defaults";
import {
  enrichOwnerSettings,
  isOwnerSite,
  ownerCareerStages,
  ownerExperiencePhotos,
  ownerExperienceStages,
  ownerPortfolio,
} from "@/lib/cms/owner-defaults";
import { resolvePublicSite } from "@/lib/cms/site";
import type {
  ContactRow,
  ExperiencePhotoRow,
  ExperienceRow,
  JourneyStageRow,
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

function ownerAwareFallback(site: PublicPortfolio["site"]): PublicPortfolio {
  if (site?.is_owner_site) {
    return { ...ownerPortfolio(), site };
  }
  return { ...fallbackPortfolio(), site: site ?? null };
}

function finalizePortfolio(
  portfolio: PublicPortfolio,
  site: PublicPortfolio["site"],
): PublicPortfolio {
  const next = { ...portfolio, site };
  if (isOwnerSite(next)) {
    next.settings = enrichOwnerSettings(next.settings);
    if (!next.journeyStages.length) {
      next.journeyStages = [...ownerCareerStages(), ...ownerExperienceStages()];
    }
    if (!next.experiencePhotos.length) {
      next.experiencePhotos = ownerExperiencePhotos();
    }
  }
  return next;
}

export const getPublicGallery = cache(async (): Promise<import("@/lib/cms/types").GalleryRow[]> => {
  if (!hasSupabaseEnv()) {
    const site = await resolvePublicSite();
    if (site?.is_owner_site) return ownerPortfolio().gallery;
    return defaultGallery();
  }

  try {
    const site = await resolvePublicSite();
    if (!site?.id) {
      if (site?.is_owner_site) return ownerPortfolio().gallery;
      return defaultGallery();
    }

    const supabase = await createSupabaseServerClient();
    const { data } = await withSiteFilter(
      supabase.from("portfolio_gallery").select("*").eq("visible", true).order("sort_order"),
      site.id,
    );

    if (data && data.length > 0) return data as import("@/lib/cms/types").GalleryRow[];
    if (site.is_owner_site) return ownerPortfolio().gallery;
    return defaultGallery();
  } catch {
    return defaultGallery();
  }
});

export const getPublicPortfolio = cache(async (): Promise<PublicPortfolio> => {
  const site = await resolvePublicSite();
  const fallback = ownerAwareFallback(site);

  if (!hasSupabaseEnv()) {
    return finalizePortfolio({ ...fallback, gallery: [] }, site);
  }

  try {
    if (!site?.id) {
      return finalizePortfolio({ ...fallback, gallery: [] }, site);
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
      journeyStagesRes,
      experiencePhotosRes,
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
      withSiteFilter(
        supabase.from("portfolio_experience").select("*").eq("visible", true).order("sort_order"),
        siteId,
      ),
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
      withSiteFilter(
        supabase
          .from("portfolio_journey_stages")
          .select("*")
          .eq("visible", true)
          .order("sort_order"),
        siteId,
      ),
      withSiteFilter(
        supabase
          .from("portfolio_experience_photos")
          .select("*")
          .eq("visible", true)
          .order("sort_order"),
        siteId,
      ),
    ]);

    const hasCms = settingsRes.data || (sectionsRes.data && sectionsRes.data.length > 0);

    if (!hasCms) {
      return finalizePortfolio({ ...fallback, gallery: [] }, site);
    }

    const productCardsError = Boolean(productCardsRes.error);
    const productFeaturesError = Boolean(productFeaturesRes.error);
    const journeyStagesError = Boolean(journeyStagesRes.error);
    const experiencePhotosError = Boolean(experiencePhotosRes.error);

    const ownerFallback = site.is_owner_site ? ownerPortfolio() : fallback;

    return finalizePortfolio(
      {
        settings: (settingsRes.data as SettingsRow) || ownerFallback.settings,
        sections: ((sectionsRes.data as SectionRow[]) || ownerFallback.sections).filter(
          (item) => item.visible,
        ),
        gallery: [],
        projects: (projectsRes.data as ProjectRow[]) || ownerFallback.projects,
        experience: (experienceRes.data as ExperienceRow[]) || ownerFallback.experience,
        skills: (skillsRes.data as SkillRow[]) || ownerFallback.skills,
        socials: ((socialsRes.data as SocialRow[]) || ownerFallback.socials).filter((item) => item.href),
        contact: (contactRes.data as ContactRow) || ownerFallback.contact,
        seo: (seoRes.data as SeoRow) || ownerFallback.seo,
        productSettings:
          (productSettingsRes.data as ProductSettingsRow) || ownerFallback.productSettings,
        productCards: productCardsError
          ? ownerFallback.productCards
          : ((productCardsRes.data as ProductCardRow[]) || ownerFallback.productCards),
        productFeatures: productFeaturesError
          ? ownerFallback.productFeatures
          : ((productFeaturesRes.data as ProductFeatureRow[]) || ownerFallback.productFeatures),
        journeyStages: journeyStagesError
          ? ownerFallback.journeyStages
          : ((journeyStagesRes.data as JourneyStageRow[]) || ownerFallback.journeyStages),
        experiencePhotos: experiencePhotosError
          ? ownerFallback.experiencePhotos
          : ((experiencePhotosRes.data as ExperiencePhotoRow[]) || ownerFallback.experiencePhotos),
        source: "cms",
        site,
      },
      site,
    );
  } catch {
    return finalizePortfolio({ ...fallback, gallery: [] }, site);
  }
});

export function isSectionVisible(portfolio: PublicPortfolio, key: string) {
  const match = portfolio.sections.find((item) => item.section_key === key);
  return match ? match.visible : true;
}

export function sectionLabel(portfolio: PublicPortfolio, key: string, fallback: string) {
  return portfolio.sections.find((item) => item.section_key === key)?.label || fallback;
}

export function sectionByKey(portfolio: PublicPortfolio, key: string) {
  return portfolio.sections.find((item) => item.section_key === key);
}

export function sectionMeta(
  portfolio: PublicPortfolio,
  key: string,
  defaults: { eyebrow?: string; title?: string; description?: string } = {},
) {
  const section = sectionByKey(portfolio, key);
  return {
    eyebrow: section?.eyebrow || defaults.eyebrow || "",
    title: section?.title || defaults.title || "",
    description: section?.description || defaults.description || "",
  };
}

export function journeyStagesByKind(portfolio: PublicPortfolio, kind: "career" | "experience") {
  return portfolio.journeyStages
    .filter((item) => item.kind === kind && item.visible)
    .sort((a, b) => a.sort_order - b.sort_order);
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
    src: "",
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
