-- Grant admin access for a commercial / customer install.
-- IMPORTANT: Do NOT attach customer admins to the owner/default site.
-- Each customer gets an isolated portfolio_sites row + membership.
--
-- 1. Create the Auth user in Supabase.
-- 2. Replace YOUR_ADMIN_EMAIL@example.com below.
-- 3. Optionally set a unique slug (must not be 'default').
-- 4. Run this SQL in the Supabase SQL editor.

-- Allowlist for /admin login (shared-DB multi-tenant).
insert into public.portfolio_admins (user_id, email)
select id, email
from auth.users
where lower(email) = lower('YOUR_ADMIN_EMAIL@example.com')
on conflict (user_id) do update set email = excluded.email;

-- Create an isolated customer site (never the owner site).
insert into public.portfolio_sites (slug, name, plan_tier, onboarding_completed, is_owner_site)
select
  'customer-' || substr(replace(u.id::text, '-', ''), 1, 12),
  coalesce(split_part(u.email, '@', 1), 'Customer Portfolio'),
  'starter',
  false,
  false
from auth.users u
where lower(u.email) = lower('YOUR_ADMIN_EMAIL@example.com')
  and not exists (
    select 1
    from public.portfolio_site_members m
    join public.portfolio_sites s on s.id = m.site_id
    where m.user_id = u.id
      and coalesce(s.is_owner_site, false) = false
  )
on conflict (slug) do nothing;

-- Membership on the customer's own site only.
insert into public.portfolio_site_members (site_id, user_id, role)
select s.id, u.id, 'owner'
from auth.users u
join public.portfolio_sites s
  on s.slug = 'customer-' || substr(replace(u.id::text, '-', ''), 1, 12)
where lower(u.email) = lower('YOUR_ADMIN_EMAIL@example.com')
on conflict do nothing;

-- Optional: map a customer custom domain (routing only — not website_name branding).
-- insert into public.portfolio_site_domains (site_id, domain, is_primary)
-- select s.id, 'customer.example.com', true
-- from public.portfolio_sites s
-- where s.slug = 'customer-XXXXXXXXXXXX'
-- on conflict (domain) do nothing;

-- Owner portfolio (rajkumarghalan.com.np) stays on the is_owner_site row.
-- Never run a grant that attaches customers to slug = 'default'.
