/**
 * Admin allowlist fallback for single-site deployments.
 * Prefer server-only ADMIN_EMAIL in production.
 * Leave empty for commercial installs so ADMIN_EMAIL is required.
 */
export const DESIGNATED_ADMIN_EMAIL = "" as const;

/** Internal product name shown in admin chrome (not on customer public sites). */
export const ADMIN_PRODUCT_NAME = "Portfolio CMS" as const;
