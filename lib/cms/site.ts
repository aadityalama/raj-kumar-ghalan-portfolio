import { cache } from "react";
import { headers } from "next/headers";
import type { SiteRow } from "@/lib/cms/types";
import { isMissingColumnError } from "@/lib/cms/settings-schema";
import { adminEmail, hasSupabaseEnv } from "@/lib/supabase/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export type ResolvedSite = SiteRow & {
  is_owner_site?: boolean;
};

type SupabaseServer = Awaited<ReturnType<typeof createSupabaseServerClient>>;

const SITE_COLUMNS_CORE = "id,slug,name,plan_tier,onboarding_completed,created_at,updated_at";
const SITE_COLUMNS_WITH_OWNER = `${SITE_COLUMNS_CORE},is_owner_site`;

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

/** Owner site = is_owner_site flag, or legacy slug=default from migration 007. */
export function isOwnerSiteRecord(site: ResolvedSite | null | undefined) {
  if (!site?.id) return false;
  if (site.is_owner_site === true) return true;
  return site.slug === "default";
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

function markOwnerIfDefault(site: ResolvedSite | null): ResolvedSite | null {
  if (!site) return null;
  if (site.is_owner_site == null && site.slug === "default") {
    return { ...site, is_owner_site: true };
  }
  return site;
}

function schemaUnreadableMessage(context: string, message: string) {
  const normalized = message.toLowerCase();
  if (normalized.includes("schema cache") || normalized.includes("does not exist")) {
    return (
      `${context}: ${message}. ` +
      `If migration 007 was applied in the SQL Editor, refresh PostgREST with: NOTIFY pgrst, 'reload schema';`
    );
  }
  return `${context}: ${message}`;
}

/**
 * Load a site by id/slug.
 * Prefer CORE columns (migration 007) so pre-009 databases work; then enrich
 * with is_owner_site when migration 009 is present.
 */
async function fetchSiteRow(
  supabase: SupabaseServer,
  filter: { column: "id" | "slug"; value: string },
): Promise<ResolvedSite | null> {
  // CORE-first: slug/id resolution must not depend on migration 009's is_owner_site.
  const core = await supabase
    .from("portfolio_sites")
    .select(SITE_COLUMNS_CORE)
    .eq(filter.column, filter.value)
    .maybeSingle();

  if (core.error) {
    if (
      core.error.message.toLowerCase().includes("portfolio_sites") ||
      core.error.message.toLowerCase().includes("schema cache")
    ) {
      throw new Error(
        schemaUnreadableMessage(
          `Could not load portfolio site (${filter.column}=${filter.value})`,
          core.error.message,
        ),
      );
    }
    throw new Error(
      `Could not load portfolio site (${filter.column}=${filter.value}): ${core.error.message}`,
    );
  }

  if (!core.data) return null;

  const base = markOwnerIfDefault(core.data as ResolvedSite) as ResolvedSite;

  // Optional enrichment when migration 009 is applied.
  const owned = await supabase
    .from("portfolio_sites")
    .select(SITE_COLUMNS_WITH_OWNER)
    .eq(filter.column, filter.value)
    .maybeSingle();

  if (!owned.error && owned.data) {
    return markOwnerIfDefault(owned.data as ResolvedSite);
  }

  if (owned.error && isMissingColumnError(owned.error.message, "is_owner_site")) {
    return base;
  }

  // Any other enrichment failure: keep the CORE row (owner/default still resolves).
  return base;
}

async function fetchSiteById(supabase: SupabaseServer, siteId: string) {
  return fetchSiteRow(supabase, { column: "id", value: siteId });
}

async function fetchSiteBySlug(supabase: SupabaseServer, slug: string) {
  if (!slug) return null;
  return fetchSiteRow(supabase, { column: "slug", value: slug });
}

/**
 * Existing owner/default site only. Never creates a site.
 *
 * Order matters for production after migration 007 without 009:
 * 1) slug='default' via CORE columns (always present after 007)
 * 2) is_owner_site=true when migration 009 is present
 *
 * Previous code selected is_owner_site first; missing-column / schema-cache
 * errors were misclassified as "table missing" and returned null — so the
 * owner admin never reached the slug=default fallback even when the row existed.
 */
async function fetchOwnerSite(supabase: SupabaseServer): Promise<ResolvedSite | null> {
  const byDefault = await fetchSiteBySlug(supabase, "default");
  if (byDefault) return byDefault;

  const byFlag = await supabase
    .from("portfolio_sites")
    .select(SITE_COLUMNS_WITH_OWNER)
    .eq("is_owner_site", true)
    .order("created_at", { ascending: true })
    .limit(1)
    .maybeSingle();

  if (!byFlag.error && byFlag.data) {
    return markOwnerIfDefault(byFlag.data as ResolvedSite);
  }

  if (byFlag.error && isMissingColumnError(byFlag.error.message, "is_owner_site")) {
    // Pre-009 DB and no slug=default row — nothing else to try.
    return null;
  }

  if (byFlag.error) {
    throw new Error(
      schemaUnreadableMessage("Could not load owner portfolio site", byFlag.error.message),
    );
  }

  return null;
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

/**
 * Seed empty scaffolding for a NEW customer site only.
 * Never call this against the owner / default site — production owner CMS rows stay untouched.
 */
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
 * Owner admins keep the owner site (existing production data) and NEVER fall
 * through to customer-* provisioning.
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

  // --- Owner path: always existing owner/default site; never customer-* ---
  if (isOwnerAdmin) {
    const ownerSite = await fetchOwnerSite(supabase);
    if (!ownerSite?.id) {
      throw new Error(
        "Owner admin could not resolve portfolio_sites slug='default' (migration 007) or is_owner_site=true (migration 009). Refusing to create a customer site for the owner.",
      );
    }

    const { error: memberError } = await supabase.from("portfolio_site_members").upsert({
      site_id: ownerSite.id,
      user_id: user.id,
      role: "owner",
    });
    if (memberError) {
      const { data: membership } = await supabase
        .from("portfolio_site_members")
        .select("site_id")
        .eq("site_id", ownerSite.id)
        .eq("user_id", user.id)
        .maybeSingle();
      if (!membership) {
        throw new Error(
          `Owner admin could not attach to owner site (${ownerSite.slug}): ${memberError.message}. Confirm portfolio_admins grant + portfolio_site_members RLS (migrations 002/007/009).`,
        );
      }
    }

    return { ...ownerSite, is_owner_site: true };
  }

  // --- Customer path: never the owner site ---
  const { data: memberships } = await supabase
    .from("portfolio_site_members")
    .select(
      "site_id, role, portfolio_sites(id,slug,name,plan_tier,onboarding_completed,is_owner_site,created_at,updated_at)",
    )
    .eq("user_id", user.id);

  const sites = (memberships || [])
    .map((row) => {
      const joined = row.portfolio_sites as unknown as ResolvedSite | ResolvedSite[] | null;
      if (Array.isArray(joined)) return joined[0] || null;
      return joined;
    })
    .filter((site): site is ResolvedSite => Boolean(site?.id))
    .map((site) => markOwnerIfDefault(site) as ResolvedSite);

  const ownerSite = sites.find((site) => isOwnerSiteRecord(site)) || (await fetchOwnerSite(supabase));
  const personalSites = sites.filter((site) => !isOwnerSiteRecord(site));

  if (personalSites.length) {
    return personalSites.sort((a, b) => String(a.created_at).localeCompare(String(b.created_at)))[0];
  }

  // Customer incorrectly attached only to the owner site — move them off it.
  if (ownerSite && sites.some((site) => site.id === ownerSite.id)) {
    await supabase
      .from("portfolio_site_members")
      .delete()
      .eq("user_id", user.id)
      .eq("site_id", ownerSite.id);
  }

  const slug = customerSlugForUser(user.id);
  const existing = await fetchSiteBySlug(supabase, slug);
  if (existing) {
    if (isOwnerSiteRecord(existing)) {
      throw new Error("Refusing to use the owner site as a customer workspace.");
    }
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
    .select(SITE_COLUMNS_WITH_OWNER)
    .single();

  if (error || !created) {
    if (error && isMissingColumnError(error.message, "is_owner_site")) {
      const retry = await supabase
        .from("portfolio_sites")
        .insert({
          slug,
          name: "My Portfolio",
          plan_tier: "starter",
          onboarding_completed: false,
        })
        .select(SITE_COLUMNS_CORE)
        .single();
      if (retry.error || !retry.data) {
        throw new Error(retry.error?.message || "Could not create an isolated customer site.");
      }
      const site = retry.data as ResolvedSite;
      await supabase.from("portfolio_site_members").upsert({
        site_id: site.id,
        user_id: user.id,
        role: "owner",
      });
      await seedEmptySiteContent(supabase, site.id);
      return { ...site, is_owner_site: false };
    }
    throw new Error(error?.message || "Could not create an isolated customer site.");
  }

  const createdSite = created as ResolvedSite;
  if (isOwnerSiteRecord(createdSite)) {
    throw new Error("Refusing to treat a newly created site as the owner site.");
  }

  await supabase.from("portfolio_site_members").upsert({
    site_id: createdSite.id,
    user_id: user.id,
    role: "owner",
  });

  await seedEmptySiteContent(supabase, createdSite.id);
  return { ...createdSite, is_owner_site: false };
}

export function assertSiteId(siteId: string | null | undefined): asserts siteId is string {
  if (!siteId || isLegacySiteId(siteId)) {
    throw new Error("A resolved site_id is required. Refusing unscoped portfolio mutation.");
  }
}
