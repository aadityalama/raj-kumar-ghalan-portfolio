# Customization

## Content (preferred)

Almost all public content is managed in Admin:

- Homepage / About
- Experience, Projects, Skills
- Gallery
- Product / Featured Work
- Spotlight (optional market-style section)
- Social, SEO, Contact
- Settings (branding)
- Homepage sections (visibility + order)

Customers should not need to edit code for day-to-day content.

## Branding controls

Admin → Settings:

- Website name
- Person/brand name
- Wordmark
- Logo / favicon uploads
- Accent color (hex only)
- Theme preference
- Site URL
- Copyright text

Arbitrary CSS injection is intentionally blocked. Accent values are sanitized to `#RGB` / `#RRGGBB`.

## Template defaults

`config/site.ts` and `lib/cms/defaults.ts` contain **neutral demo placeholders** used when Supabase is empty or unavailable.

Do not put customer secrets or personal credentials in those files.

## Design system

The premium dark aesthetic, typography, motion, and green accent system live in:

- `app/globals.css`
- `components/ui/*`
- section components under `components/sections/*`

Preserve these patterns when extending the product.

## Multi-site readiness

`portfolio_sites`, `portfolio_site_members`, and `site_id` columns prepare the schema for future Free / Starter / Pro / Agency plans (custom domains, multiple portfolios, analytics, blog, etc.).

This release still targets one site per Hostinger deployment via `PORTFOLIO_SITE_SLUG` (default `default`).
