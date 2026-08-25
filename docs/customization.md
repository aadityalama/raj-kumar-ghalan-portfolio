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

## Multi-site isolation

`portfolio_sites`, `portfolio_site_members`, `portfolio_site_domains`, and `site_id` columns scope every CMS read/write to one tenant.

- **Branding content** (`website_name`, `brand_name`, wordmark, logo, accent) is per `site_id`.
- **Public routing** uses Host → `portfolio_site_domains` → optional `PORTFOLIO_SITE_SLUG` → owner site (`is_owner_site`).
- Setup Wizard and Admin mutations resolve `site_id` from the authenticated admin — never from form fields or website name.
