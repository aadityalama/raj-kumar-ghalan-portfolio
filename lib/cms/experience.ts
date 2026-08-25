import type { ExperienceRow } from "@/lib/cms/types";

/** Ensure CMS/fallback experience rows always expose a safe company_logo_url. */
export function normalizeExperienceRows(
  rows: ExperienceRow[] | null | undefined,
  fallback: ExperienceRow[],
): ExperienceRow[] {
  const list = rows ?? fallback;
  return list.map((item) => ({
    ...item,
    company_logo_url: item.company_logo_url || "",
    technologies: Array.isArray(item.technologies) ? item.technologies : [],
  }));
}
