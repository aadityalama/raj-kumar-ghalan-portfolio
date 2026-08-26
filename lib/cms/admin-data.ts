import { requireAdmin } from "@/lib/cms/admin-auth";
import { fallbackPortfolio } from "@/lib/cms/defaults";
import { assertSiteId, resolveAdminSite } from "@/lib/cms/site";
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any -- Supabase builder generics blow the TS recursion limit
function scoped(query: any, siteId: string) {
  return query.eq("site_id", siteId);
}

async function adminSiteContext() {
  const user = await requireAdmin();
  if (!hasSupabaseEnv()) {
    return { user, siteId: null as string | null, siteSlug: null as string | null, supabase: null as null };
  }
  const supabase = await createSupabaseServerClient();
  const site = await resolveAdminSite(user);
  assertSiteId(site.id);
  await supabase.from("portfolio_site_members").upsert({
    site_id: site.id,
    user_id: user.id,
    role: "owner",
  });
  return { user, siteId: site.id, siteSlug: site.slug, supabase };
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
    resolutionError: null as string | null,
    recent: [] as Array<{ label: string; at: string }>,
  };

  try {
    const { user, siteId, siteSlug, supabase } = await adminSiteContext();
    if (!siteId || !supabase) {
      return {
        ...empty,
        configured: hasSupabaseEnv(),
        resolutionError: hasSupabaseEnv()
          ? "Admin site could not be resolved (missing siteId)."
          : "Supabase environment variables are not configured.",
      };
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
    ].filter(Boolean) as string[];

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
      siteSlug,
      resolutionError: queryErrors.length ? queryErrors.join(" | ") : null,
      recent,
    };
  } catch (error) {
    return {
      ...empty,
      configured: hasSupabaseEnv(),
      resolutionError:
        error instanceof Error ? error.message : "Admin site resolution failed.",
    };
  }
}

export async function getAdminCollections() {
  const fallback = fallbackPortfolio();
  const empty = {
    settings: fallback.settings,
    sections: fallback.sections,
    gallery: fallback.gallery,
    projects: fallback.projects,
    experience: fallback.experience,
    skills: fallback.skills,
    socials: fallback.socials,
    contact: fallback.contact,
    seo: fallback.seo,
    productSettings: fallback.productSettings,
    productCards: fallback.productCards,
    productFeatures: fallback.productFeatures,
    configured: false,
    siteId: null as string | null,
  };

  try {
    const { siteId, supabase } = await adminSiteContext();
    if (!siteId || !supabase) return empty;

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

    return {
      settings: (settings.data as SettingsRow) || fallback.settings,
      sections: (sections.data as SectionRow[]) || fallback.sections,
      gallery: (gallery.data as GalleryRow[]) || fallback.gallery,
      projects: (projects.data as ProjectRow[]) || fallback.projects,
      experience: (experience.data as ExperienceRow[]) || fallback.experience,
      skills: (skills.data as SkillRow[]) || fallback.skills,
      socials: (socials.data as SocialRow[]) || fallback.socials,
      contact: (contact.data as ContactRow) || fallback.contact,
      seo: (seo.data as SeoRow) || fallback.seo,
      productSettings: (productSettings.data as ProductSettingsRow) || fallback.productSettings,
      productCards: productCards.error
        ? fallback.productCards
        : ((productCards.data as ProductCardRow[]) || fallback.productCards),
      productFeatures: productFeatures.error
        ? fallback.productFeatures
        : ((productFeatures.data as ProductFeatureRow[]) || fallback.productFeatures),
      configured: true,
      siteId,
    };
  } catch {
    return empty;
  }
}
