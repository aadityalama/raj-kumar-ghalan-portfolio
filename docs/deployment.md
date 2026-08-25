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
| `ADMIN_EMAIL` | Yes | Server-only admin allowlist |
| `NEXT_SERVER_ACTIONS_ENCRYPTION_KEY` | Yes | `openssl rand -base64 32` — required at **build** and runtime |
| `PORTFOLIO_SITE_SLUG` | Optional | Defaults to `default` |

Never set `SUPABASE_SERVICE_ROLE_KEY`, passwords, or admin secrets as `NEXT_PUBLIC_*`.

## Redeploy vs restart

After changing `NEXT_SERVER_ACTIONS_ENCRYPTION_KEY` or other env vars, use Hostinger **Redeploy** (full rebuild), not only Restart.

Then hard-refresh `/admin/login` so the browser is not posting a stale Server Action ID.

## Supabase production checklist

1. Migrations applied (`001`–`007`)
2. Admin Auth user created
3. Admin grant SQL applied for that email
4. Public sign-up disabled
5. Storage bucket `portfolio-media` present (created by migrations)

## Existing personal site

If this codebase powers an existing personal portfolio, deploy the branch that contains the productization changes and apply only additive migrations. Existing CMS rows remain the source of truth — demo seed must not replace them.
