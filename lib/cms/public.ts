import { cache } from "react";
import { brandDisplayName } from "@/lib/cms/branding";
import { emptyResolvedPortfolio, fallbackPortfolio } from "@/lib/cms/defaults";
import {
  contentHasSiteId,
  isOwnerSiteRecord,
  resolvePublicSite,
} from "@/lib/cms/site";
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

const SITE_ID_REQUIRED =
  "Database is missing site_id isolation columns. Apply supabase/migrations/007_productize_multitenant.sql (additive; does not delete owner content), then NOTIFY pgrst, 'reload schema'.";

// eslint-disable-next-line @typescript-eslint/no-explicit-any -- Supabase builder generics blow the TS recursion limit
function withSiteFilter(query: any, siteId: string) {
  return query.eq("site_id", siteId);
}

export const getPublicGallery = cache(async (): Promise<GalleryRow[]> => {
  if (!hasSupabaseEnv()) return [];

  try {
    if (!(await contentHasSiteId())) {
      console.error("[cms] public gallery:", SITE_ID_REQUIRED);
      return [];
    }

    const site = await resolvePublicSite();
    if (!site?.id) return [];

    const supabase = await createSupabaseServerClient();
    const { data, error } = await withSiteFilter(
      supabase.from("portfolio_gallery").select("*").eq("visible", true).order("sort_order"),
      site.id,
    );

    if (error) {
      console.error("[cms] public gallery query failed:", error.message);
      return [];
    }

    return (data as GalleryRow[]) || [];
  } catch (error) {
    console.error(
      "[cms] public gallery resolution failed:",
      error instanceof Error ? error.message : error,
    );
    return [];
  }
});

export const getPublicPortfolio = cache(async (): Promise<PublicPortfolio> => {
  // Demo TypeScript defaults are only for local/dev when Supabase env is absent.
  if (!hasSupabaseEnv()) {
    return {
      ...fallbackPortfolio(),
      gallery: [],
      resolutionError: "Supabase is not configured on this deployment.",
    };
  }

  try {
    if (!(await contentHasSiteId())) {
      return emptyResolvedPortfolio(null, SITE_ID_REQUIRED);
    }

    const site = await resolvePublicSite();
    if (!site?.id) {
      return emptyResolvedPortfolio(
        null,
        "Could not resolve a public portfolio site. Confirm portfolio_sites / portfolio_site_domains (migrations 007–009) and owner domain mapping for rajkumarghalan.com.np.",
      );
    }

    const siteId = site.id;
    const supabase = await createSupabaseServerClient();
    const ownerSite = isOwnerSiteRecord(site);

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
        supabase
          .from("portfolio_social_links")
          .select("*")
          .eq("visible", true)
          .order("sort_order"),
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

    const errors = [
      settingsRes.error?.message,
      sectionsRes.error?.message,
      projectsRes.error?.message,
      experienceRes.error?.message,
      skillsRes.error?.message,
      socialsRes.error?.message,
      contactRes.error?.message,
      seoRes.error?.message,
    ].filter(Boolean) as string[];

    const hasCms = settingsRes.data || (sectionsRes.data && sectionsRes.data.length > 0);

    // Never silently paint neutral demo company/role placeholders over a resolved site.
    if (!hasCms || errors.length) {
      const message =
        errors.join(" | ") ||
        (ownerSite
          ? `Owner site ${siteId} resolved but CMS rows were empty for this site_id. Confirm migration 007 backfilled owner content onto the default/owner site — refusing neutral TypeScript demo fallback.`
          : `Site ${siteId} resolved but CMS rows were empty.`);
      console.error("[cms] public portfolio unavailable:", message);
      const blank = emptyResolvedPortfolio(site, message);
      return {
        ...blank,
        settings: (settingsRes.data as SettingsRow) || blank.settings,
        sections: ((sectionsRes.data as SectionRow[]) || []).filter((item) => item.visible),
        projects: (projectsRes.data as ProjectRow[]) || [],
        experience: (experienceRes.data as ExperienceRow[]) || [],
        skills: (skillsRes.data as SkillRow[]) || [],
        socials: ((socialsRes.data as SocialRow[]) || []).filter((item) => item.href),
        contact: (contactRes.data as ContactRow) || blank.contact,
        seo: (seoRes.data as SeoRow) || blank.seo,
        productSettings:
          (productSettingsRes.data as ProductSettingsRow) || blank.productSettings,
        productCards: productCardsRes.error
          ? []
          : ((productCardsRes.data as ProductCardRow[]) || []),
        productFeatures: productFeaturesRes.error
          ? []
          : ((productFeaturesRes.data as ProductFeatureRow[]) || []),
        source: "error",
        site,
        resolutionError: message,
      };
    }

    return {
      settings: settingsRes.data as SettingsRow,
      sections: ((sectionsRes.data as SectionRow[]) || []).filter((item) => item.visible),
      gallery: [],
      projects: (projectsRes.data as ProjectRow[]) || [],
      experience: (experienceRes.data as ExperienceRow[]) || [],
      skills: (skillsRes.data as SkillRow[]) || [],
      socials: ((socialsRes.data as SocialRow[]) || []).filter((item) => item.href),
      contact: (contactRes.data as ContactRow) || emptyResolvedPortfolio(site, "").contact,
      seo: (seoRes.data as SeoRow) || emptyResolvedPortfolio(site, "").seo,
      productSettings:
        (productSettingsRes.data as ProductSettingsRow) ||
        emptyResolvedPortfolio(site, "").productSettings,
      productCards: productCardsRes.error
        ? []
        : ((productCardsRes.data as ProductCardRow[]) || []),
      productFeatures: productFeaturesRes.error
        ? []
        : ((productFeaturesRes.data as ProductFeatureRow[]) || []),
      source: "cms",
      site,
    };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Public portfolio site resolution failed.";
    console.error("[cms] public portfolio resolution failed:", message);
    return emptyResolvedPortfolio(null, message);
  }
});

export function isSectionVisible(portfolio: PublicPortfolio, key: string) {
  const match = portfolio.sections.find((item) => item.section_key === key);
  if (portfolio.source === "error" && portfolio.sections.length === 0) {
    return match ? match.visible : false;
  }
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
