import { cache } from "react";
import { createSupabaseServerClient } from "@/lib/supabase/server";

/** Columns present since the original CMS schema (+ hero_image_url from 003). */
export const CORE_SETTINGS_COLUMNS = [
  "id",
  "hero_title",
  "hero_subtitle",
  "hero_positioning",
  "hero_body",
  "about_title",
  "about_body",
  "about_body_secondary",
  "about_experience_label",
  "journey_title",
  "journey_description",
  "philosophy",
  "content_title",
  "content_description",
  "content_youtube_title",
  "content_youtube_body",
  "market_title",
  "market_description",
  "market_profile",
  "market_note",
  "market_followers",
  "market_posts",
  "market_facebook_url",
  "hero_image_url",
  "updated_at",
] as const;

/** Full CMS coverage columns added in 010_full_cms_coverage.sql */
export const CMS_EXTENSION_COLUMNS = [
  "hero_primary_cta_text",
  "hero_primary_cta_href",
  "hero_secondary_cta_text",
  "hero_secondary_cta_href",
  "gallery_page_eyebrow",
  "gallery_page_title",
  "gallery_page_description",
  "gallery_cta_label",
  "gallery_cta_href",
  "career_timeline_eyebrow",
  "career_timeline_title",
  "market_eyebrow",
  "market_followers_label",
  "market_posts_label",
  "market_facebook_cta",
  "content_eyebrow",
  "content_youtube_context",
  "content_youtube_cta",
  "content_themes",
  "market_capabilities",
  "other_projects_eyebrow",
  "other_projects_title",
  "about_eyebrow",
  "about_known_experience_heading",
] as const;

/** Branding columns added in 007/008 for Portfolio CMS. */
export const BRAND_SETTINGS_COLUMNS = [
  "website_name",
  "brand_name",
  "wordmark",
  "logo_url",
  "favicon_url",
  "accent_color",
  "theme_preference",
  "copyright_text",
  "site_url",
  "onboarding_completed",
  "site_id",
] as const;

export type SettingsColumn =
  | (typeof CORE_SETTINGS_COLUMNS)[number]
  | (typeof BRAND_SETTINGS_COLUMNS)[number]
  | (typeof CMS_EXTENSION_COLUMNS)[number];

const MIGRATION_HINT =
  "Database is missing branding columns. Apply supabase/migrations/008_portfolio_settings_branding.sql in the Supabase SQL editor, then reload the API schema (NOTIFY pgrst, 'reload schema';).";

export function isMissingColumnError(message: string, column?: string) {
  const normalized = message.toLowerCase();
  if (!normalized.includes("schema cache") && !normalized.includes("could not find")) {
    return false;
  }
  if (!column) return true;
  return normalized.includes(column.toLowerCase());
}

export function migrationHintForMissingColumn(column = "brand_name") {
  return `${MIGRATION_HINT} Missing column: ${column}.`;
}

/**
 * Probe production/public schema for branding support.
 * Uses a zero-row select so we never depend on localStorage or guessed column sets.
 */
export const getPortfolioSettingsColumns = cache(async (): Promise<Set<string>> => {
  const columns = new Set<string>(CORE_SETTINGS_COLUMNS);
  const supabase = await createSupabaseServerClient();

  const { error } = await supabase
    .from("portfolio_settings")
    .select("brand_name,website_name,wordmark,accent_color,theme_preference,onboarding_completed")
    .limit(1);

  if (!error) {
    for (const column of BRAND_SETTINGS_COLUMNS) {
      if (column !== "site_id") columns.add(column);
    }
    // Probe site_id separately so branding can work before multi-tenant migration.
    const siteProbe = await supabase.from("portfolio_settings").select("site_id").limit(1);
    if (!siteProbe.error) columns.add("site_id");

    const cmsProbe = await supabase
      .from("portfolio_settings")
      .select("hero_primary_cta_text,content_themes,market_capabilities")
      .limit(1);
    if (!cmsProbe.error) {
      for (const column of CMS_EXTENSION_COLUMNS) columns.add(column);
    }

    return columns;
  }

  if (isMissingColumnError(error.message)) {
    // Branding migration not applied yet — stick to core columns only.
    return columns;
  }

  // Unexpected error: still allow core writes.
  return columns;
});

export function pickSettingsPayload(
  payload: Record<string, unknown>,
  columns: Set<string>,
) {
  const next: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(payload)) {
    if (value === undefined) continue;
    if (columns.has(key)) next[key] = value;
  }
  return next;
}

export function assertBrandColumns(columns: Set<string>, required: string[] = ["brand_name", "website_name"]) {
  const missing = required.filter((column) => !columns.has(column));
  if (!missing.length) return null;
  return migrationHintForMissingColumn(missing[0]);
}
