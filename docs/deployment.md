# Deployment (Hostinger)

Production target: **Hostinger Node.js**. Do not configure this product for Vercel.

GitHub remains the source-code repository.

## Hostinger application settings

| Field | Value |
| --- | --- |
| Application type | `next` |
| Build script | `build` |
| Output directory | `.next` |
| Start command | Hostinger default for Next.js (do not use a static `out/` folder) |

## Environment variables

Set these in **Website → Environment variables**:

| Variable | Required | Notes |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Yes (prod) | Canonical origin, e.g. `https://your-domain.com` |
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes* | Public anon key (*or publishable key) |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Yes* | Alternate public key |
| `ADMIN_EMAIL` | Yes | Server-only primary admin allowlist |
| `OWNER_ADMIN_EMAIL` | Optional | Defaults to `ADMIN_EMAIL`; marks the owner of the preserved production site |
| `NEXT_SERVER_ACTIONS_ENCRYPTION_KEY` | Yes | `openssl rand -base64 32` — required at **build** and runtime |
| `PORTFOLIO_SITE_SLUG` | Optional | Deploy pin when Host is not in `portfolio_site_domains` |

Public routing: Host → `portfolio_site_domains` → `PORTFOLIO_SITE_SLUG` → owner site (`is_owner_site`). Website name / brand fields are content only and never change domain routing.

Apply `009_site_isolation.sql` before multi-customer demos. Never grant customers onto the owner/`default` site — use `supabase/seeds/grant_admin.example.sql`.

## Redeploy vs restart

After changing `NEXT_SERVER_ACTIONS_ENCRYPTION_KEY` or other env vars, use Hostinger **Redeploy** (full rebuild), not only Restart.

Then hard-refresh `/admin/login` so the browser is not posting a stale Server Action ID.

## Setup Wizard Name step (branding columns)

If Admin → Setup wizard fails with:

`Could not find the 'brand_name' column of 'portfolio_settings' in the schema cache`

the production database is missing branding columns. Apply:

`supabase/migrations/008_portfolio_settings_branding.sql`

Then reload the API schema:

```sql
NOTIFY pgrst, 'reload schema';
```

Verify (from a machine with Hostinger env vars):

```bash
npx tsx scripts/verify-settings-schema.ts
```

This migration is additive and does not wipe personal production CMS content.

## Supabase production checklist

1. Migrations applied (`001`–`008`)
2. Admin Auth user created
3. Admin grant SQL applied for that email
4. Public sign-up disabled
5. Storage bucket `portfolio-media` present (created by migrations)
6. Branding columns verified (`npx tsx scripts/verify-settings-schema.ts`)

## Existing personal site

If this codebase powers an existing personal portfolio, deploy the branch that contains the productization changes and apply only additive migrations. Existing CMS rows remain the source of truth — demo seed must not replace them.
