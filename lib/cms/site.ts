import { cache } from "react";
import { headers } from "next/headers";
import type { SiteRow } from "@/lib/cms/types";
import { adminEmail, hasSupabaseEnv } from "@/lib/supabase/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export type ResolvedSite = SiteRow & {
  is_owner_site?: boolean;
};

/** Optional deploy pin. Used only when Host does not match a site domain. */
export function portfolioSiteSlug() {
  return (
    process.env.PORTFOLIO_SITE_SLUG?.trim() ||
    process.env.NEXT_PUBLIC_PORTFOLIO_SITE_SLUG?.trim() ||
    ""
  );
}

/** Owner admin email for the preserved production portfolio (server-only). */
export function ownerAdminEmail() {
  return (
    process.env.OWNER_ADMIN_EMAIL?.trim().toLowerCase() ||
    adminEmail() ||
    ""
  );
}

export function normalizeHost(value: string | null | undefined) {
  const raw = String(value || "")
    .trim()
    .toLowerCase()
    .replace(/:\d+$/, "");
  if (!raw) return "";
  return raw.replace(/^www\./, "") === raw ? raw : raw; // keep www variant as stored
}

export function hostCandidates(host: string) {
  const normalized = String(host || "")
    .trim()
    .toLowerCase()
    .replace(/:\d+$/, "");
  if (!normalized) return [] as string[];
  const candidates = [normalized];
  if (normalized.startsWith("www.")) {
    candidates.push(normalized.slice(4));
  } else {
    candidates.push(`www.${normalized}`);
  }
  return [...new Set(candidates)];
}

async function requestHost() {
  try {
    const h = await headers();
    return (
      h.get("x-forwarded-host")?.split(",")[0]?.trim() ||
      h.get("host")?.trim() ||
      ""
    );
  } catch {
    return "";
  }
}

async function fetchSiteById(
  supabase: Awaited<ReturnType<typeof createSupabaseServerClient>>,
  siteId: string,
) {
  const { data } = await supabase
    .from("portfolio_sites")
    .select("id,slug,name,plan_tier,onboarding_completed,is_owner_site,created_at,updated_at")
    .eq("id", siteId)
    .maybeSingle();
  return (data as ResolvedSite | null) || null;
}

async function fetchSiteBySlug(
  supabase: Awaited<ReturnType<typeof createSupabaseServerClient>>,
  slug: string,
) {
  if (!slug) return null;
  const { data } = await supabase
    .from("portfolio_sites")
    .select("id,slug,name,plan_tier,onboarding_completed,is_owner_site,created_at,updated_at")
    .eq("slug", slug)
    .maybeSingle();
  return (data as ResolvedSite | null) || null;
}

async function fetchOwnerSite(supabase: Awaited<ReturnType<typeof createSupabaseServerClient>>) {
  const { data } = await supabase
    .from("portfolio_sites")
    .select("id,slug,name,plan_tier,onboarding_completed,is_owner_site,created_at,updated_at")
    .eq("is_owner_site", true)
    .order("created_at", { ascending: true })
    .limit(1)
    .maybeSingle();
  if (data) return data as ResolvedSite;
  return fetchSiteBySlug(supabase, "default");
}

async function fetchSiteByHost(
  supabase: Awaited<ReturnType<typeof createSupabaseServerClient>>,
  host: string,
) {
  const candidates = hostCandidates(host);
  if (!candidates.length) return null;

  const { data: domainRow } = await supabase
    .from("portfolio_site_domains")
    .select("site_id,domain")
    .in("domain", candidates)
    .limit(1)
    .maybeSingle();

  if (!domainRow?.site_id) return null;
  return fetchSiteById(supabase, domainRow.site_id);
}

/**
 * Public site resolution:
 * 1) Host / x-forwarded-host → portfolio_site_domains
 * 2) PORTFOLIO_SITE_SLUG
 * 3) Owner site (is_owner_site / default)
 *
 * Never trusts client-provided site_id.
 */
export const resolvePublicSite = cache(async (): Promise<ResolvedSite | null> => {
  if (!hasSupabaseEnv()) return null;

  try {
    const supabase = await createSupabaseServerClient();
    const host = await requestHost();
    const byHost = await fetchSiteByHost(supabase, host);
    if (byHost) return byHost;

    const bySlug = await fetchSiteBySlug(supabase, portfolioSiteSlug());
    if (bySlug) return bySlug;

    return fetchOwnerSite(supabase);
  } catch {
    return null;
  }
});

/** @deprecated Prefer resolvePublicSite / resolveAdminSite. */
export const getCurrentSite = resolvePublicSite;

export function isLegacySiteId(siteId: string | null | undefined) {
  return !siteId || siteId === "legacy-default";
}

function customerSlugForUser(userId: string) {
  return `customer-${userId.replace(/-/g, "").slice(0, 12)}`;
}

async function seedEmptySiteContent(
  supabase: Awaited<ReturnType<typeof createSupabaseServerClient>>,
  siteId: string,
) {
  await supabase.from("portfolio_settings").upsert(
    {
      site_id: siteId,
      hero_title: "Your Name",
      hero_subtitle: "Building meaningful digital experiences.",
      hero_positioning: "Creative Professional",
      website_name: "Your Name",
      brand_name: "Your Name",
      wordmark: "YOUR NAME",
      onboarding_completed: false,
    },
    { onConflict: "site_id" },
  );

  await supabase.from("portfolio_contact").upsert(
    {
      site_id: siteId,
      email: "",
      phone: "",
      location: "",
      message: "If something here resonates, write to me. I read every note.",
    },
    { onConflict: "site_id" },
  );

  await supabase.from("portfolio_seo").upsert(
    {
      site_id: siteId,
      site_title: "Your Name — Creative Professional",
      meta_description:
        "A premium portfolio website for showcasing projects, experience, and creative work.",
      keywords: ["portfolio", "creative professional"],
      og_title: "Your Name — Creative Professional",
      og_description:
        "A premium portfolio website for showcasing projects, experience, and creative work.",
      og_image: "",
    },
    { onConflict: "site_id" },
  );

  await supabase.from("portfolio_product_settings").upsert(
    {
      site_id: siteId,
      section_title: "The Product",
      case_title: "Featured project, in focus",
      visible: true,
    },
    { onConflict: "site_id" },
  );

  const defaultSections = [
    { section_key: "hero", label: "Hero", href: "#top", visible: true, sort_order: 0 },
    { section_key: "about", label: "About", href: "#about", visible: true, sort_order: 10 },
    {
      section_key: "experience",
      label: "Experience",
      href: "#experience",
      visible: true,
      sort_order: 30,
    },
    { section_key: "projects", label: "Projects", href: "#projects", visible: true, sort_order: 50 },
    { section_key: "product", label: "Product", href: "#product", visible: true, sort_order: 55 },
    { section_key: "skills", label: "Skills", href: "#skills", visible: true, sort_order: 60 },
    {
      section_key: "gallery",
      label: "Photo Gallery",
      href: "/gallery",
      visible: true,
      sort_order: 72,
    },
    {
      section_key: "philosophy",
      label: "Philosophy",
      href: "#philosophy",
      visible: true,
      sort_order: 75,
    },
    { section_key: "contact", label: "Contact", href: "#contact", visible: true, sort_order: 80 },
  ];

  for (const section of defaultSections) {
    await supabase.from("portfolio_sections").upsert(
      { ...section, site_id: siteId, title: section.label, description: "" },
      { onConflict: "site_id,section_key" },
    );
  }
}

/**
 * Ensure an authenticated admin has a dedicated editable site.
 * Owner admins keep the owner site (existing production data).
 * Other admins never write the owner site — they get an isolated customer site.
 */
export async function resolveAdminSite(user: {
  id: string;
  email?: string | null;
}): Promise<ResolvedSite> {
  if (!hasSupabaseEnv()) {
    throw new Error("Supabase is not configured.");
  }

  const supabase = await createSupabaseServerClient();
  const email = (user.email || "").toLowerCase();
  const ownerEmail = ownerAdminEmail();
  const isOwnerAdmin = Boolean(ownerEmail && email && email === ownerEmail);

  const { data: memberships } = await supabase
    .from("portfolio_site_members")
    .select("site_id, role, portfolio_sites(id,slug,name,plan_tier,onboarding_completed,is_owner_site,created_at,updated_at)")
    .eq("user_id", user.id);

  const sites = (memberships || [])
    .map((row) => {
      const joined = row.portfolio_sites as unknown as ResolvedSite | ResolvedSite[] | null;
      if (Array.isArray(joined)) return joined[0] || null;
      return joined;
    })
    .filter((site): site is ResolvedSite => Boolean(site?.id));

  const ownerSite = sites.find((site) => site.is_owner_site) || (await fetchOwnerSite(supabase));
  const personalSites = sites.filter((site) => !site.is_owner_site);

  if (isOwnerAdmin) {
    if (ownerSite) {
      await supabase.from("portfolio_site_members").upsert({
        site_id: ownerSite.id,
        user_id: user.id,
        role: "owner",
      });
      return ownerSite;
    }
  }

  if (personalSites.length) {
    return personalSites.sort((a, b) => String(a.created_at).localeCompare(String(b.created_at)))[0];
  }

  // Customer incorrectly attached only to the owner site — move them off it.
  if (!isOwnerAdmin && ownerSite && sites.some((site) => site.id === ownerSite.id)) {
    await supabase
      .from("portfolio_site_members")
      .delete()
      .eq("user_id", user.id)
      .eq("site_id", ownerSite.id);
  }

  const slug = customerSlugForUser(user.id);
  const existing = await fetchSiteBySlug(supabase, slug);
  if (existing) {
    await supabase.from("portfolio_site_members").upsert({
      site_id: existing.id,
      user_id: user.id,
      role: "owner",
    });
    return existing;
  }

  const { data: created, error } = await supabase
    .from("portfolio_sites")
    .insert({
      slug,
      name: "My Portfolio",
      plan_tier: "starter",
      onboarding_completed: false,
      is_owner_site: false,
    })
    .select("id,slug,name,plan_tier,onboarding_completed,is_owner_site,created_at,updated_at")
    .single();

  if (error || !created) {
    throw new Error(error?.message || "Could not create an isolated customer site.");
  }

  await supabase.from("portfolio_site_members").upsert({
    site_id: created.id,
    user_id: user.id,
    role: "owner",
  });

  await seedEmptySiteContent(supabase, created.id);
  return created as ResolvedSite;
}

export function assertSiteId(siteId: string | null | undefined): asserts siteId is string {
  if (!siteId || isLegacySiteId(siteId)) {
    throw new Error("A resolved site_id is required. Refusing unscoped portfolio mutation.");
  }
}
