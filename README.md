# Raj Kumar Ghalan

Personal website for Raj Kumar Ghalan — professional, digital builder, and creator.

## Stack

- Next.js (App Router)
- TypeScript
- Tailwind CSS
- Framer Motion
- next-themes
- Supabase (Auth + CMS)

## Content

All personal facts, project links, social profiles, and SEO copy live in [`config/site.ts`](config/site.ts).

Fields marked as placeholders are intentionally empty until a real value exists. Do not invent emails, URLs, dates, or metrics.

## Develop

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Copy [`.env.example`](.env.example) to `.env.local` and fill in local values when working on the CMS.

## Checks

```bash
npm run lint
npm run typecheck
npm run build
```

## Deploy (Hostinger)

Set these in **Website → Environment variables** (not in the client bundle, except `NEXT_PUBLIC_*`):

| Variable | Required | Notes |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Yes (prod) | Canonical origin, e.g. `https://your-domain.com` |
| `NEXT_PUBLIC_SUPABASE_URL` | Yes (CMS/admin) | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes* | Public anon key (`*` or use publishable key below) |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Yes* | Alternate to anon key on newer projects |
| `ADMIN_EMAIL` | Recommended | Server-only allowlist; must match the Supabase Auth admin user and `002_grant_admin.sql`. If unset, the app falls back to `DESIGNATED_ADMIN_EMAIL` in `config/admin.ts`. |
| `NEXT_SERVER_ACTIONS_ENCRYPTION_KEY` | Yes (Hostinger) | Stable base64 AES key (`openssl rand -base64 32`). Must be present at **build** and runtime so Server Action IDs stay consistent across Redeploys. |

Do **not** set `SUPABASE_SERVICE_ROLE_KEY`, passwords, or any admin secret as `NEXT_PUBLIC_*`.

After creating the Auth user for the designated admin email, run the SQL migrations under `supabase/migrations/` (including `002_grant_admin.sql`) in that Supabase project. Disable public sign-up in Supabase Auth.

### Hostinger Node.js settings

| Field | Value |
| --- | --- |
| Application type | `next` |
| Build script | `build` |
| Output directory | `.next` |
| Start command | leave Hostinger default for Next (do not point at a static `out/` folder) |

Deploy from the Git branch that contains `app/admin/` (currently `cursor/personal-portfolio-site` or a PR merged into it).

After adding or changing `NEXT_SERVER_ACTIONS_ENCRYPTION_KEY` (or other env vars), use Hostinger **Redeploy** (full rebuild), not only **Restart**. A restart reuses the old build output and will not embed a new encryption key. After Redeploy completes, hard-refresh `/admin/login` (or close old admin tabs) so the browser is not posting a stale Server Action ID.
