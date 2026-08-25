-- Grant admin access for a commercial install.
-- 1. Create the Auth user in Supabase.
-- 2. Replace YOUR_ADMIN_EMAIL@example.com below.
-- 3. Run this SQL.

insert into public.portfolio_admins (user_id, email)
select id, email
from auth.users
where lower(email) = lower('YOUR_ADMIN_EMAIL@example.com')
on conflict (user_id) do update set email = excluded.email;

insert into public.portfolio_site_members (site_id, user_id, role)
select s.id, a.user_id, 'owner'
from public.portfolio_sites s
cross join public.portfolio_admins a
where s.slug = 'default'
  and lower(a.email) = lower('YOUR_ADMIN_EMAIL@example.com')
on conflict do nothing;
