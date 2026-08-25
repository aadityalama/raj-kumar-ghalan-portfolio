/**
 * Controlled branding helpers — hex accent only, no arbitrary CSS injection.
 */

const HEX_COLOR = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/;

export function sanitizeAccentColor(value: string | null | undefined, fallback = "#3DDC97") {
  const raw = String(value || "").trim();
  if (!HEX_COLOR.test(raw)) return fallback;
  if (raw.length === 4) {
    const [, r, g, b] = raw;
    return `#${r}${r}${g}${g}${b}${b}`.toLowerCase();
  }
  return raw.toLowerCase();
}

export function brandDisplayName(settings: {
  brand_name?: string;
  website_name?: string;
  hero_title?: string;
}) {
  return (
    settings.brand_name?.trim() ||
    settings.website_name?.trim() ||
    settings.hero_title?.trim() ||
    "Your Name"
  );
}

export function brandWordmark(settings: {
  wordmark?: string;
  brand_name?: string;
  website_name?: string;
  hero_title?: string;
}) {
  const explicit = settings.wordmark?.trim();
  if (explicit) return explicit;
  return brandDisplayName(settings).toUpperCase();
}
