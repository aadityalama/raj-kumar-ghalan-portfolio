-- Tighten admin checks to the granted Auth user_id only.
-- Safe to run after 001_portfolio_cms.sql, including if 001 was applied earlier.

create or replace function public.is_portfolio_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.portfolio_admins
    where user_id = auth.uid()
  );
$$;

drop policy if exists portfolio_admins_self_read on public.portfolio_admins;
create policy portfolio_admins_self_read on public.portfolio_admins
  for select to authenticated
  using (user_id = auth.uid());
