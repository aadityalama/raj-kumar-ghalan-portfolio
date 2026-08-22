-- Run this AFTER creating the Supabase Auth user for the admin account.
-- Disable public sign-up in Supabase Auth so this email cannot be claimed first.
-- The email must match the server-only ADMIN_EMAIL environment variable.

insert into public.portfolio_admins (user_id, email)
select id, email
from auth.users
where lower(email) = lower('aadityalama853@gmail.com')
on conflict (user_id) do update
set email = excluded.email;
