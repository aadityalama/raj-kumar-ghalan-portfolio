# Installation

## Requirements

- Node.js 20+
- npm
- A Supabase project (Auth + Postgres + Storage)
- Hostinger Node.js hosting for production

## 1. Install dependencies

```bash
npm install
```

## 2. Configure environment

```bash
cp .env.example .env.local
```

Fill in:

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Canonical public URL |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` or `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Public Supabase key |
| `ADMIN_EMAIL` | Server-only admin allowlist email |
| `NEXT_SERVER_ACTIONS_ENCRYPTION_KEY` | Stable Server Actions key (`openssl rand -base64 32`) |
| `PORTFOLIO_SITE_SLUG` | Optional site slug (default `default`) |

## 3. Apply database migrations

In the Supabase SQL editor, run migrations in order:

1. `001_portfolio_cms.sql`
2. `002_grant_admin.sql` (edit the email first for new customers)
3. `003_hero_image_and_storage_paths.sql`
4. `004_admin_userid_only.sql`
5. `005_table_privileges.sql`
6. `006_gallery_page_nav.sql`
7. `006_product_section.sql`
8. `007_productize_multitenant.sql`

For a **new commercial demo**, optionally run `supabase/seeds/demo_content.sql` after migrations.

For an **existing personal production database**, apply additive migrations only. Do not load demo seed content over live data.

## 4. Create the admin Auth user

1. Supabase → Authentication → Users → Add user
2. Use the same email as `ADMIN_EMAIL`
3. Disable public sign-up

## 5. Run locally

```bash
npm run dev
```

Visit `/admin/login`, then `/admin/onboarding`.

## 6. Verify

```bash
npm run lint
npm run typecheck
npm run build
```
