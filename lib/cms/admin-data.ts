import { requireAdmin } from "@/lib/cms/admin-auth";
import { emptyResolvedPortfolio } from "@/lib/cms/defaults";
import {
  assertSiteId,
  contentHasSiteId,
  isOwnerSiteRecord,
  resolveAdminSite,
  type ResolvedSite,
} from "@/lib/cms/site";
import type {
  ContactRow,
  ExperienceRow,
  GalleryRow,
  ProductCardRow,
  ProductFeatureRow,
  ProductSettingsRow,
  ProjectRow,
  SectionRow,
  SeoRow,
  SettingsRow,
  SkillRow,
  SocialRow,
} from "@/lib/cms/types";
import { hasSupabaseEnv } from "@/lib/supabase/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const SITE_ID_REQUIRED =
  "Database is missing site_id isolation columns. Apply supabase/migrations/007_productize_multitenant.sql (additive backfill; does not delete owner content), then NOTIFY pgrst, 'reload schema'.";

// eslint-disable-next-line @typescript-eslint/no-explicit-any -- Supabase builder generics blow the TS recursion limit
function scoped(query: any, siteId: string) {
  return query.eq("site_id", siteId);
}

async function adminSiteContext() {
  const user = await requireAdmin();
  if (!hasSupabaseEnv()) {
    return {
      user,
      site: null as ResolvedSite | null,
      siteId: null as string | null,
      supabase: null as null,
      error: "Supabase is not configured.",
    };
  }

  const supabase = await createSupabaseServerClient();
  if (!(await contentHasSiteId())) {
    return {
      user,
      site: null as ResolvedSite | null,
      siteId: null as string | null,
      supabase,
      error: SITE_ID_REQUIRED,
    };
  }

  const site = await resolveAdminSite(user);
  assertSiteId(site.id);

  // Ensure membership (idempotent). Never rewrite content rows.
  await supabase.from("portfolio_site_members").upsert({
    site_id: site.id,
    user_id: user.id,
    role: "owner",
  });

  return { user, site, siteId: site.id, supabase, error: null as string | null };
}

export async function getAdminDashboard() {
  const empty = {
    projects: 0,
    photos: 0,
    skills: 0,
    sections: 0,
    productCards: 0,
    source: "fallback" as const,
    configured: false,
    cmsReady: false,
    adminGranted: false,
    siteId: null as string | null,
    siteSlug: null as string | null,
    isOwnerSite: false,
    resolutionError: null as string | null,
    recent: [] as Array<{ label: string; at: string }>,
  };

  try {
    const { user, site, siteId, supabase, error } = await adminSiteContext();
    if (!siteId || !supabase) {
      return { ...empty, configured: hasSupabaseEnv(), resolutionError: error };
    }

    const [projects, photos, skills, sections, settings, contact, seo, productCards, adminRow] =
      await Promise.all([
        scoped(supabase.from("portfolio_projects").select("id,title,updated_at", { count: "exact" }), siteId),
        scoped(supabase.from("portfolio_gallery").select("id,title,updated_at", { count: "exact" }), siteId),
        scoped(supabase.from("portfolio_skills").select("id,name,updated_at", { count: "exact" }), siteId),
        scoped(supabase.from("portfolio_sections").select("id,label,updated_at", { count: "exact" }), siteId),
        scoped(supabase.from("portfolio_settings").select("updated_at"), siteId).maybeSingle(),
        scoped(supabase.from("portfolio_contact").select("updated_at"), siteId).maybeSingle(),
        scoped(supabase.from("portfolio_seo").select("updated_at"), siteId).maybeSingle(),
        scoped(
          supabase.from("portfolio_product_cards").select("id,title,updated_at", { count: "exact" }),
          siteId,
        ),
        supabase.from("portfolio_admins").select("user_id").eq("user_id", user.id).maybeSingle(),
      ]);

    const queryErrors = [
      projects.error?.message,
      photos.error?.message,
      skills.error?.message,
      sections.error?.message,
      settings.error?.message,
    ].filter(Boolean);

    const recent = [
      ...(projects.data || []).map((item: { title: string; updated_at?: string | null }) => ({
        label: `Project · ${item.title}`,
        at: item.updated_at || "",
      })),
      ...(photos.data || []).map((item: { title: string; updated_at?: string | null }) => ({
        label: `Photo · ${item.title}`,
        at: item.updated_at || "",
      })),
      ...(skills.data || []).map((item: { name: string; updated_at?: string | null }) => ({
        label: `Skill · ${item.name}`,
        at: item.updated_at || "",
      })),
      ...(sections.data || []).map((item: { label: string; updated_at?: string | null }) => ({
        label: `Section · ${item.label}`,
        at: item.updated_at || "",
      })),
      ...(productCards.data || []).map((item: { title: string; updated_at?: string | null }) => ({
        label: `Product · ${item.title}`,
        at: item.updated_at || "",
      })),
      ...(settings.data?.updated_at ? [{ label: "Website content", at: settings.data.updated_at }] : []),
      ...(contact.data?.updated_at ? [{ label: "Contact", at: contact.data.updated_at }] : []),
      ...(seo.data?.updated_at ? [{ label: "SEO", at: seo.data.updated_at }] : []),
    ]
      .filter((item) => item.at)
      .sort((a, b) => (a.at < b.at ? 1 : -1))
      .slice(0, 8);

    return {
      projects: projects.count || 0,
      photos: photos.count || 0,
      skills: skills.count || 0,
      sections: sections.count || 0,
      productCards: productCards.count || 0,
      source: "cms" as const,
      configured: true,
      cmsReady: Boolean(settings.data) && !settings.error,
      adminGranted: Boolean(adminRow.data) && !adminRow.error,
      siteId,
      siteSlug: site?.slug || null,
      isOwnerSite: isOwnerSiteRecord(site),
      resolutionError: queryErrors.length ? queryErrors.join(" | ") : null,
      recent,
    };
  } catch (error) {
    return {
      ...empty,
      configured: hasSupabaseEnv(),
      resolutionError: error instanceof Error ? error.message : "Admin site resolution failed.",
    };
  }
}

export async function getAdminCollections() {
  try {
    const { site, siteId, supabase, error } = await adminSiteContext();
    if (!siteId || !supabase) {
      return {
        ...emptyResolvedPortfolio(null, error || "Admin site could not be resolved."),
        configured: false,
        siteId: null,
        siteSlug: null,
        isOwnerSite: false,
        resolutionError: error || "Admin site could not be resolved.",
        source: "error" as const,
      };
    }

    const ownerSite = isOwnerSiteRecord(site);

    const [
      settings,
      sections,
      gallery,
      projects,
      experience,
      skills,
      socials,
      contact,
      seo,
      productSettings,
      productCards,
      productFeatures,
    ] = await Promise.all([
      scoped(supabase.from("portfolio_settings").select("*"), siteId).maybeSingle(),
      scoped(supabase.from("portfolio_sections").select("*").order("sort_order"), siteId),
      scoped(supabase.from("portfolio_gallery").select("*").order("sort_order"), siteId),
      scoped(supabase.from("portfolio_projects").select("*").order("sort_order"), siteId),
      scoped(supabase.from("portfolio_experience").select("*").order("sort_order"), siteId),
      scoped(supabase.from("portfolio_skills").select("*").order("sort_order"), siteId),
      scoped(supabase.from("portfolio_social_links").select("*").order("sort_order"), siteId),
      scoped(supabase.from("portfolio_contact").select("*"), siteId).maybeSingle(),
      scoped(supabase.from("portfolio_seo").select("*"), siteId).maybeSingle(),
      scoped(supabase.from("portfolio_product_settings").select("*"), siteId).maybeSingle(),
      scoped(supabase.from("portfolio_product_cards").select("*").order("sort_order"), siteId),
      scoped(supabase.from("portfolio_product_features").select("*").order("sort_order"), siteId),
    ]);

    const errors = [
      settings.error?.message,
      sections.error?.message,
      experience.error?.message,
      projects.error?.message,
      skills.error?.message,
    ].filter(Boolean) as string[];

    // NEVER substitute neutral demo company rows for failed/missing reads.
    const blank = emptyResolvedPortfolio(site, errors.join(" | ") || "");

    if (errors.length && ownerSite) {
      return {
        settings: (settings.data as SettingsRow) || blank.settings,
        sections: sections.error ? [] : ((sections.data as SectionRow[]) || []),
        gallery: gallery.error ? [] : ((gallery.data as GalleryRow[]) || []),
        projects: projects.error ? [] : ((projects.data as ProjectRow[]) || []),
        experience: experience.error ? [] : ((experience.data as ExperienceRow[]) || []),
        skills: skills.error ? [] : ((skills.data as SkillRow[]) || []),
        socials: socials.error ? [] : ((socials.data as SocialRow[]) || []),
        contact: (contact.data as ContactRow) || blank.contact,
        seo: (seo.data as SeoRow) || blank.seo,
        productSettings: (productSettings.data as ProductSettingsRow) || blank.productSettings,
        productCards: productCards.error ? [] : ((productCards.data as ProductCardRow[]) || []),
        productFeatures: productFeatures.error
          ? []
          : ((productFeatures.data as ProductFeatureRow[]) || []),
        configured: true,
        siteId,
        siteSlug: site?.slug || null,
        isOwnerSite: true,
        resolutionError: errors.join(" | "),
        source: "error" as const,
      };
    }

    return {
      settings: (settings.data as SettingsRow) || blank.settings,
      sections: (sections.data as SectionRow[]) || [],
      gallery: (gallery.data as GalleryRow[]) || [],
      projects: (projects.data as ProjectRow[]) || [],
      experience: (experience.data as ExperienceRow[]) || [],
      skills: (skills.data as SkillRow[]) || [],
      socials: (socials.data as SocialRow[]) || [],
      contact: (contact.data as ContactRow) || blank.contact,
      seo: (seo.data as SeoRow) || blank.seo,
      productSettings: (productSettings.data as ProductSettingsRow) || blank.productSettings,
      productCards: productCards.error ? [] : ((productCards.data as ProductCardRow[]) || []),
      productFeatures: productFeatures.error
        ? []
        : ((productFeatures.data as ProductFeatureRow[]) || []),
      configured: true,
      siteId,
      siteSlug: site?.slug || null,
      isOwnerSite: ownerSite,
      resolutionError: errors.length ? errors.join(" | ") : null,
      source: "cms" as const,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Admin site resolution failed.";
    return {
      ...emptyResolvedPortfolio(null, message),
      configured: hasSupabaseEnv(),
      siteId: null,
      siteSlug: null,
      isOwnerSite: false,
      resolutionError: message,
      source: "error" as const,
    };
  }
}
