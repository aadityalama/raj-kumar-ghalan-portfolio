-- Site isolation: domain → site mapping, drop singleton id=1 locks, per-site settings rows.
-- Idempotent and non-destructive: preserves existing owner content on the default site.

-- ---------------------------------------------------------------------------
-- Owner flag + domain mapping
-- ---------------------------------------------------------------------------

alter table public.portfolio_sites
  add column if not exists is_owner_site boolean not null default false;

update public.portfolio_sites
set is_owner_site = true
where slug = 'default'
  and not exists (select 1 from public.portfolio_sites where is_owner_site = true);

create table if not exists public.portfolio_site_domains (
  id uuid primary key default gen_random_uuid(),
  site_id uuid not null references public.portfolio_sites (id) on delete cascade,
  domain text not null,
  is_primary boolean not null default false,
  created_at timestamptz not null default now(),
  constraint portfolio_site_domains_domain_format check (domain = lower(domain))
);

create unique index if not exists portfolio_site_domains_domain_uidx
  on public.portfolio_site_domains (domain);

create index if not exists portfolio_site_domains_site_idx
  on public.portfolio_site_domains (site_id);

alter table public.portfolio_site_domains enable row level security;

drop policy if exists portfolio_site_domains_public_read on public.portfolio_site_domains;
create policy portfolio_site_domains_public_read on public.portfolio_site_domains
  for select to anon, authenticated using (true);

drop policy if exists portfolio_site_domains_member_write on public.portfolio_site_domains;
create policy portfolio_site_domains_member_write on public.portfolio_site_domains
  for all to authenticated
  using (public.is_site_editor(site_id))
  with check (public.is_site_editor(site_id));

grant select on public.portfolio_site_domains to anon, authenticated;
grant insert, update, delete on public.portfolio_site_domains to authenticated;

-- Seed owner public domains (data only — routing code is generic).
insert into public.portfolio_site_domains (site_id, domain, is_primary)
select s.id, d.domain, d.is_primary
from public.portfolio_sites s
cross join (
  values
    ('rajkumarghalan.com.np', true),
    ('www.rajkumarghalan.com.np', false)
) as d(domain, is_primary)
where s.is_owner_site = true
on conflict (domain) do nothing;

-- ---------------------------------------------------------------------------
-- Allow multiple settings/contact/seo/product_settings rows (one per site)
-- ---------------------------------------------------------------------------

do $$
declare
  conname text;
begin
  for conname in
    select c.conname
    from pg_constraint c
    join pg_class t on t.oid = c.conrelid
    join pg_namespace n on n.oid = t.relnamespace
    where n.nspname = 'public'
      and t.relname = 'portfolio_settings'
      and pg_get_constraintdef(c.oid) ilike '%id%1%'
  loop
    execute format('alter table public.portfolio_settings drop constraint if exists %I', conname);
  end loop;
end $$;

do $$
declare
  conname text;
begin
  for conname in
    select c.conname
    from pg_constraint c
    join pg_class t on t.oid = c.conrelid
    join pg_namespace n on n.oid = t.relnamespace
    where n.nspname = 'public'
      and t.relname = 'portfolio_contact'
      and pg_get_constraintdef(c.oid) ilike '%id%1%'
  loop
    execute format('alter table public.portfolio_contact drop constraint if exists %I', conname);
  end loop;
end $$;

do $$
declare
  conname text;
begin
  for conname in
    select c.conname
    from pg_constraint c
    join pg_class t on t.oid = c.conrelid
    join pg_namespace n on n.oid = t.relnamespace
    where n.nspname = 'public'
      and t.relname = 'portfolio_seo'
      and pg_get_constraintdef(c.oid) ilike '%id%1%'
  loop
    execute format('alter table public.portfolio_seo drop constraint if exists %I', conname);
  end loop;
end $$;

do $$
declare
  conname text;
begin
  for conname in
    select c.conname
    from pg_constraint c
    join pg_class t on t.oid = c.conrelid
    join pg_namespace n on n.oid = t.relnamespace
    where n.nspname = 'public'
      and t.relname = 'portfolio_product_settings'
      and pg_get_constraintdef(c.oid) ilike '%id%1%'
  loop
    execute format('alter table public.portfolio_product_settings drop constraint if exists %I', conname);
  end loop;
end $$;

create sequence if not exists public.portfolio_settings_id_seq;
create sequence if not exists public.portfolio_contact_id_seq;
create sequence if not exists public.portfolio_seo_id_seq;
create sequence if not exists public.portfolio_product_settings_id_seq;

select setval(
  'public.portfolio_settings_id_seq',
  greatest(coalesce((select max(id) from public.portfolio_settings), 1), 1)
);
select setval(
  'public.portfolio_contact_id_seq',
  greatest(coalesce((select max(id) from public.portfolio_contact), 1), 1)
);
select setval(
  'public.portfolio_seo_id_seq',
  greatest(coalesce((select max(id) from public.portfolio_seo), 1), 1)
);
select setval(
  'public.portfolio_product_settings_id_seq',
  greatest(coalesce((select max(id) from public.portfolio_product_settings), 1), 1)
);

alter table public.portfolio_settings
  alter column id set default nextval('public.portfolio_settings_id_seq');
alter table public.portfolio_contact
  alter column id set default nextval('public.portfolio_contact_id_seq');
alter table public.portfolio_seo
  alter column id set default nextval('public.portfolio_seo_id_seq');
alter table public.portfolio_product_settings
  alter column id set default nextval('public.portfolio_product_settings_id_seq');

alter sequence public.portfolio_settings_id_seq owned by public.portfolio_settings.id;
alter sequence public.portfolio_contact_id_seq owned by public.portfolio_contact.id;
alter sequence public.portfolio_seo_id_seq owned by public.portfolio_seo.id;
alter sequence public.portfolio_product_settings_id_seq owned by public.portfolio_product_settings.id;

create unique index if not exists portfolio_settings_site_uidx on public.portfolio_settings (site_id);
create unique index if not exists portfolio_contact_site_uidx on public.portfolio_contact (site_id);
create unique index if not exists portfolio_seo_site_uidx on public.portfolio_seo (site_id);
create unique index if not exists portfolio_product_settings_site_uidx on public.portfolio_product_settings (site_id);

-- ---------------------------------------------------------------------------
-- Membership-only editors (no global admin bypass for content writes)
-- ---------------------------------------------------------------------------

create or replace function public.is_site_editor(target_site_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.portfolio_site_members
    where site_id = target_site_id
      and user_id = auth.uid()
      and role in ('owner', 'admin', 'editor')
  );
$$;

create or replace function public.is_site_member(target_site_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.portfolio_site_members
    where site_id = target_site_id
      and user_id = auth.uid()
  );
$$;

-- Public read stays open for published content; writes require membership on that site.
drop policy if exists portfolio_settings_admin_write on public.portfolio_settings;
create policy portfolio_settings_admin_write on public.portfolio_settings
  for all to authenticated
  using (site_id is not null and public.is_site_editor(site_id))
  with check (site_id is not null and public.is_site_editor(site_id));

drop policy if exists portfolio_sections_admin_write on public.portfolio_sections;
create policy portfolio_sections_admin_write on public.portfolio_sections
  for all to authenticated
  using (site_id is not null and public.is_site_editor(site_id))
  with check (site_id is not null and public.is_site_editor(site_id));

drop policy if exists portfolio_gallery_admin_write on public.portfolio_gallery;
create policy portfolio_gallery_admin_write on public.portfolio_gallery
  for all to authenticated
  using (site_id is not null and public.is_site_editor(site_id))
  with check (site_id is not null and public.is_site_editor(site_id));

drop policy if exists portfolio_projects_admin_write on public.portfolio_projects;
create policy portfolio_projects_admin_write on public.portfolio_projects
  for all to authenticated
  using (site_id is not null and public.is_site_editor(site_id))
  with check (site_id is not null and public.is_site_editor(site_id));

drop policy if exists portfolio_experience_admin_write on public.portfolio_experience;
create policy portfolio_experience_admin_write on public.portfolio_experience
  for all to authenticated
  using (site_id is not null and public.is_site_editor(site_id))
  with check (site_id is not null and public.is_site_editor(site_id));

drop policy if exists portfolio_skills_admin_write on public.portfolio_skills;
create policy portfolio_skills_admin_write on public.portfolio_skills
  for all to authenticated
  using (site_id is not null and public.is_site_editor(site_id))
  with check (site_id is not null and public.is_site_editor(site_id));

drop policy if exists portfolio_social_admin_write on public.portfolio_social_links;
create policy portfolio_social_admin_write on public.portfolio_social_links
  for all to authenticated
  using (site_id is not null and public.is_site_editor(site_id))
  with check (site_id is not null and public.is_site_editor(site_id));

drop policy if exists portfolio_contact_admin_write on public.portfolio_contact;
create policy portfolio_contact_admin_write on public.portfolio_contact
  for all to authenticated
  using (site_id is not null and public.is_site_editor(site_id))
  with check (site_id is not null and public.is_site_editor(site_id));

drop policy if exists portfolio_seo_admin_write on public.portfolio_seo;
create policy portfolio_seo_admin_write on public.portfolio_seo
  for all to authenticated
  using (site_id is not null and public.is_site_editor(site_id))
  with check (site_id is not null and public.is_site_editor(site_id));

drop policy if exists portfolio_product_settings_admin_write on public.portfolio_product_settings;
create policy portfolio_product_settings_admin_write on public.portfolio_product_settings
  for all to authenticated
  using (site_id is not null and public.is_site_editor(site_id))
  with check (site_id is not null and public.is_site_editor(site_id));

drop policy if exists portfolio_product_cards_admin_write on public.portfolio_product_cards;
create policy portfolio_product_cards_admin_write on public.portfolio_product_cards
  for all to authenticated
  using (site_id is not null and public.is_site_editor(site_id))
  with check (site_id is not null and public.is_site_editor(site_id));

drop policy if exists portfolio_product_features_admin_write on public.portfolio_product_features;
create policy portfolio_product_features_admin_write on public.portfolio_product_features
  for all to authenticated
  using (site_id is not null and public.is_site_editor(site_id))
  with check (site_id is not null and public.is_site_editor(site_id));

-- Portfolio admins may create non-owner sites (customer provisioning).
-- Content writes still require membership on that site (see is_site_editor above).
drop policy if exists portfolio_sites_admin_insert on public.portfolio_sites;
create policy portfolio_sites_admin_insert on public.portfolio_sites
  for insert to authenticated
  with check (
    public.is_portfolio_admin()
    and coalesce(is_owner_site, false) = false
  );

-- Only existing owner-site editors may flip/keep is_owner_site.
create or replace function public.protect_owner_site_flag()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  -- Migrations / SQL editor / service role have no auth.uid().
  if auth.uid() is null then
    return new;
  end if;

  if tg_op = 'UPDATE'
     and new.is_owner_site is distinct from old.is_owner_site
     and not public.is_site_editor(old.id) then
    raise exception 'is_owner_site can only be changed by an owner-site editor';
  end if;
  if tg_op = 'INSERT' and coalesce(new.is_owner_site, false) = true and not public.is_portfolio_admin() then
    raise exception 'Only portfolio admins may create an owner site via SQL grants';
  end if;
  return new;
end;
$$;

drop trigger if exists portfolio_sites_protect_owner on public.portfolio_sites;
create trigger portfolio_sites_protect_owner
  before insert or update on public.portfolio_sites
  for each row execute function public.protect_owner_site_flag();
