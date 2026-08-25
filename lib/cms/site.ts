import { cache } from "react";
import type { SiteRow } from "@/lib/cms/types";
import { hasSupabaseEnv } from "@/lib/supabase/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";

/** Deployment-scoped site slug. Each Hostinger install typically serves one site. */
export function portfolioSiteSlug() {
  return (
    process.env.PORTFOLIO_SITE_SLUG?.trim() ||
    process.env.NEXT_PUBLIC_PORTFOLIO_SITE_SLUG?.trim() ||
    "default"
  );
}

export const getCurrentSite = cache(async (): Promise<SiteRow | null> => {
  if (!hasSupabaseEnv()) return null;

  try {
    const supabase = await createSupabaseServerClient();
    const slug = portfolioSiteSlug();
    const { data } = await supabase
      .from("portfolio_sites")
      .select("id,slug,name,plan_tier,onboarding_completed,created_at,updated_at")
      .eq("slug", slug)
      .maybeSingle();

    if (data) return data as SiteRow;

    // Legacy DBs before migration 007: synthesize a virtual default site.
    return {
      id: "legacy-default",
      slug: "default",
      name: "Portfolio",
      plan_tier: "starter",
      onboarding_completed: true,
    };
  } catch {
    return {
      id: "legacy-default",
      slug: "default",
      name: "Portfolio",
      plan_tier: "starter",
      onboarding_completed: true,
    };
  }
});

export function isLegacySiteId(siteId: string | null | undefined) {
  return !siteId || siteId === "legacy-default";
}
