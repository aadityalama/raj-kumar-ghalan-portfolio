# Portfolio CMS

Premium Portfolio CMS — a reusable, white-label portfolio website + admin product for Hostinger Node.js deployments.

Customers manage name, profile, projects, experience, skills, gallery, featured work, SEO, contact, and branding from `/admin` without editing code.

## Features

- Public premium dark portfolio (responsive, animated, green accent system)
- Admin CMS for homepage, about, experience, projects, skills, gallery, product/featured work, social, SEO, contact, settings
- Homepage section visibility + order manager
- Dedicated `/gallery` page with homepage CTA
- Reusable featured product / case study section
- First-time onboarding wizard
- Preview checklist
- Multi-tenant-ready schema (`portfolio_sites` + `site_id` + membership RLS)
- Hostinger-oriented deployment (not Vercel)

## Tech stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- Framer Motion
- next-themes
- Supabase (Auth + Postgres + Storage + RLS)

## Quick start

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and [http://localhost:3000/admin](http://localhost:3000/admin).

## Environment variables

See [`.env.example`](.env.example) and [`docs/deployment.md`](docs/deployment.md).

Never put secrets in `NEXT_PUBLIC_*` variables. Keep `NEXT_SERVER_ACTIONS_ENCRYPTION_KEY` and `ADMIN_EMAIL` server-side only.

## Supabase setup

1. Create a Supabase project.
2. Run migrations in order under `supabase/migrations/` (`001` … `007`).
3. Create an Auth user for the admin email.
4. Grant admin access (edit email in `002_grant_admin.sql` or use `supabase/seeds/grant_admin.example.sql`).
5. Disable public sign-up in Supabase Auth.
6. For a fresh commercial install, optionally load `supabase/seeds/demo_content.sql` **or** use the admin onboarding wizard.

Existing personal production sites: apply `007_productize_multitenant.sql` only. Do **not** run demo seed on a live personal database — it is for new installs.

## Admin setup

1. Set `ADMIN_EMAIL` to the Auth user email.
2. Visit `/admin/login`.
3. Complete `/admin/onboarding` or edit content from the dashboard.
4. Use **Preview checklist** before sharing the site.

## Documentation

- [`docs/installation.md`](docs/installation.md)
- [`docs/customization.md`](docs/customization.md)
- [`docs/deployment.md`](docs/deployment.md)
- [`docs/admin-guide.md`](docs/admin-guide.md)
- [`docs/licensing.md`](docs/licensing.md)

## Checks

```bash
npm run lint
npm run typecheck
npm run build
```

## License

See [`docs/licensing.md`](docs/licensing.md). Customer public sites display the customer brand — not the product vendor brand.
