# Admin guide

## Navigation

- Dashboard
- Homepage
- Homepage sections
- Experience
- Projects
- Skills
- Gallery
- Product / Featured Work
- Spotlight
- Social
- SEO
- Contact
- Settings
- Setup wizard
- Preview checklist

## Publishing model

Edits save to Supabase and revalidate the public site immediately. Use **Preview checklist** and **Preview site** before sharing.

## First-time setup

1. Log in at `/admin/login`
2. Open Setup wizard (`/admin/onboarding`)
3. Add name → photo → title → about → social → theme → first project
4. Preview → Finish setup

## Gallery

- Manage uploads under Admin → Gallery
- Homepage shows a lightweight Gallery CTA
- Full gallery lives at `/gallery`

## Featured work

Admin → Product / Featured Work controls:

- Case study titles and chapter copy
- Live URL / category
- Product image cards (order, visibility, replace/delete)
- Feature list
- Technologies and philosophy

## Branding

Admin → Settings controls website/person name, wordmark, logo, favicon, accent hex, theme preference, site URL, and copyright text.

## Security notes

- Admin access requires Supabase Auth + `ADMIN_EMAIL` allowlist + DB membership / `portfolio_admins`
- RLS blocks cross-site writes when `site_id` membership is enforced
- Uploads are limited to approved image types and 5MB
- Do not share service-role keys with the browser
