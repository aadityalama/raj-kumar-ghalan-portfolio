-- Portfolio CMS productization: multi-tenant sites, branding, featured work case fields.
-- Safe for existing single-tenant deployments: backfills a default site and preserves content.
-- Does NOT overwrite personal production copy.

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- Sites (workspaces) + membership
-- ---------------------------------------------------------------------------

create table if not exists public.portfolio_sites (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null default 'Portfolio',
  plan_tier text not null default 'starter'
    check (plan_tier in ('demo', 'starter', 'pro', 'agency')),
  onboarding_completed boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.portfolio_site_members (
  site_id uuid not null references public.portfolio_sites (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  role text not null default 'owner'
    check (role in ('owner', 'admin', 'editor')),
  created_at timestamptz not null default now(),
  primary key (site_id, user_id)
);

drop trigger if exists portfolio_sites_touch on public.portfolio_sites;
create trigger portfolio_sites_touch before update on public.portfolio_sites
for each row execute function public.touch_updated_at();

insert into public.portfolio_sites (slug, name, plan_tier, onboarding_completed)
values ('default', 'Portfolio', 'starter', true)
on conflict (slug) do nothing;

-- Link existing allowlisted admins to the default site
insert into public.portfolio_site_members (site_id, user_id, role)
select s.id, a.user_id, 'owner'
from public.portfolio_sites s
cross join public.portfolio_admins a
where s.slug = 'default'
on conflict do nothing;

create or replace function public.current_portfolio_site_id()
returns uuid
language sql
stable
security definer
set search_path = public
as $$
  select id
  from public.portfolio_sites
  where slug = coalesce(nullif(current_setting('app.portfolio_site_slug', true), ''), 'default')
  limit 1;
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
  )
  or public.is_portfolio_admin();
$$;

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
  )
  or public.is_portfolio_admin();
$$;

grant execute on function public.current_portfolio_site_id() to anon, authenticated;
grant execute on function public.is_site_member(uuid) to anon, authenticated;
grant execute on function public.is_site_editor(uuid) to anon, authenticated;

alter table public.portfolio_sites enable row level security;
alter table public.portfolio_site_members enable row level security;

drop policy if exists portfolio_sites_public_read on public.portfolio_sites;
create policy portfolio_sites_public_read on public.portfolio_sites
  for select to anon, authenticated using (true);

drop policy if exists portfolio_sites_member_write on public.portfolio_sites;
create policy portfolio_sites_member_write on public.portfolio_sites
  for all to authenticated
  using (public.is_site_editor(id))
  with check (public.is_site_editor(id));

drop policy if exists portfolio_site_members_self_read on public.portfolio_site_members;
create policy portfolio_site_members_self_read on public.portfolio_site_members
  for select to authenticated
  using (user_id = auth.uid() or public.is_site_member(site_id));

drop policy if exists portfolio_site_members_owner_write on public.portfolio_site_members;
create policy portfolio_site_members_owner_write on public.portfolio_site_members
  for all to authenticated
  using (
    exists (
      select 1 from public.portfolio_site_members m
      where m.site_id = portfolio_site_members.site_id
        and m.user_id = auth.uid()
        and m.role in ('owner', 'admin')
    )
    or public.is_portfolio_admin()
  )
  with check (
    exists (
      select 1 from public.portfolio_site_members m
      where m.site_id = portfolio_site_members.site_id
        and m.user_id = auth.uid()
        and m.role in ('owner', 'admin')
    )
    or public.is_portfolio_admin()
  );

grant select on public.portfolio_sites to anon, authenticated;
grant select on public.portfolio_site_members to authenticated;
grant insert, update, delete on public.portfolio_sites to authenticated;
grant insert, update, delete on public.portfolio_site_members to authenticated;

-- ---------------------------------------------------------------------------
-- Attach site_id to content tables (backfill to default site)
-- ---------------------------------------------------------------------------

do $$
declare
  default_site uuid;
  tbl text;
begin
  select id into default_site from public.portfolio_sites where slug = 'default' limit 1;

  foreach tbl in array array[
    'portfolio_settings',
    'portfolio_contact',
    'portfolio_seo',
    'portfolio_product_settings',
    'portfolio_sections',
    'portfolio_gallery',
    'portfolio_projects',
    'portfolio_experience',
    'portfolio_skills',
    'portfolio_social_links',
    'portfolio_product_cards',
    'portfolio_product_features'
  ]
  loop
    if not exists (
      select 1 from information_schema.columns
      where table_schema = 'public' and table_name = tbl and column_name = 'site_id'
    ) then
      execute format(
        'alter table public.%I add column site_id uuid references public.portfolio_sites (id) on delete cascade',
        tbl
      );
    end if;
    execute format('update public.%I set site_id = $1 where site_id is null', tbl)
    using default_site;
  end loop;
end $$;

-- Unique site_id on singleton tables (allow one row per site)
create unique index if not exists portfolio_settings_site_uidx on public.portfolio_settings (site_id);
create unique index if not exists portfolio_contact_site_uidx on public.portfolio_contact (site_id);
create unique index if not exists portfolio_seo_site_uidx on public.portfolio_seo (site_id);
create unique index if not exists portfolio_product_settings_site_uidx on public.portfolio_product_settings (site_id);

-- Replace global section_key uniqueness with per-site uniqueness
alter table public.portfolio_sections drop constraint if exists portfolio_sections_section_key_key;
create unique index if not exists portfolio_sections_site_key_uidx on public.portfolio_sections (site_id, section_key);

-- ---------------------------------------------------------------------------
-- Brand / site settings columns (controlled branding — no arbitrary CSS)
-- ---------------------------------------------------------------------------

alter table public.portfolio_settings
  add column if not exists website_name text not null default 'Portfolio';

alter table public.portfolio_settings
  add column if not exists brand_name text not null default 'Your Name';

alter table public.portfolio_settings
  add column if not exists wordmark text not null default 'YOUR NAME';

alter table public.portfolio_settings
  add column if not exists logo_url text not null default '';

alter table public.portfolio_settings
  add column if not exists favicon_url text not null default '';

alter table public.portfolio_settings
  add column if not exists accent_color text not null default '#3DDC97';

alter table public.portfolio_settings
  add column if not exists theme_preference text not null default 'dark';

do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'portfolio_settings_theme_preference_check'
  ) then
    alter table public.portfolio_settings
      add constraint portfolio_settings_theme_preference_check
      check (theme_preference in ('dark', 'light', 'system'));
  end if;
exception
  when duplicate_object then null;
end $$;

alter table public.portfolio_settings
  add column if not exists copyright_text text not null default '';

alter table public.portfolio_settings
  add column if not exists site_url text not null default '';

alter table public.portfolio_settings
  add column if not exists onboarding_completed boolean not null default false;

-- Backfill brand fields from existing hero title when still default placeholders
update public.portfolio_settings
set
  brand_name = case when brand_name in ('', 'Your Name') and hero_title <> '' then hero_title else brand_name end,
  wordmark = case when wordmark in ('', 'YOUR NAME') and hero_title <> '' then upper(hero_title) else wordmark end,
  website_name = case when website_name in ('', 'Portfolio') and hero_title <> '' then hero_title else website_name end,
  onboarding_completed = true
where site_id is not null;

-- ---------------------------------------------------------------------------
-- Featured work / product case study fields (reusable for any customer)
-- ---------------------------------------------------------------------------

alter table public.portfolio_product_settings
  add column if not exists case_title text not null default '',
  add column if not exists case_eyebrow text not null default 'Featured work',
  add column if not exists live_url text not null default '',
  add column if not exists category text not null default '',
  add column if not exists short_description text not null default '',
  add column if not exists problem_title text not null default 'The Problem',
  add column if not exists problem_body text not null default '',
  add column if not exists vision_title text not null default 'The Vision',
  add column if not exists vision_body text not null default '',
  add column if not exists built_title text not null default 'What I Built',
  add column if not exists built_body text not null default '',
  add column if not exists tech_title text not null default 'Technology',
  add column if not exists tech_body text not null default '',
  add column if not exists philosophy_title text not null default 'Product philosophy',
  add column if not exists philosophy_body text not null default '',
  add column if not exists technologies text[] not null default '{}',
  add column if not exists visible boolean not null default true,
  add column if not exists sort_order int not null default 0;

-- Category on product cards for filtering/display
alter table public.portfolio_product_cards
  add column if not exists category text not null default '';

-- Section descriptions for homepage builder
alter table public.portfolio_sections
  add column if not exists title text not null default '',
  add column if not exists description text not null default '';

-- Ensure product section exists for homepage builder
insert into public.portfolio_sections (section_key, label, href, visible, sort_order, title, description, site_id)
select
  'product',
  'Product',
  '#product',
  true,
  55,
  'Featured work',
  'Highlight your signature product or case study.',
  s.id
from public.portfolio_sites s
where s.slug = 'default'
  and not exists (
    select 1 from public.portfolio_sections ps
    where ps.section_key = 'product' and ps.site_id = s.id
  );

insert into public.portfolio_sections (section_key, label, href, visible, sort_order, title, description, site_id)
select
  'hero',
  'Hero',
  '#top',
  true,
  0,
  'Hero',
  'Opening introduction.',
  s.id
from public.portfolio_sites s
where s.slug = 'default'
  and not exists (
    select 1 from public.portfolio_sections ps
    where ps.section_key = 'hero' and ps.site_id = s.id
  );

-- ---------------------------------------------------------------------------
-- Tighten write RLS to site membership (public read unchanged for this site)
-- ---------------------------------------------------------------------------

-- Helper macro pattern: replace admin_write policies to also require site match.
-- Existing is_portfolio_admin() remains a fallback for legacy single-admin installs.

drop policy if exists portfolio_settings_admin_write on public.portfolio_settings;
create policy portfolio_settings_admin_write on public.portfolio_settings
  for all to authenticated
  using (public.is_site_editor(site_id))
  with check (public.is_site_editor(site_id));

drop policy if exists portfolio_sections_admin_write on public.portfolio_sections;
create policy portfolio_sections_admin_write on public.portfolio_sections
  for all to authenticated
  using (public.is_site_editor(site_id))
  with check (public.is_site_editor(site_id));

drop policy if exists portfolio_gallery_admin_write on public.portfolio_gallery;
create policy portfolio_gallery_admin_write on public.portfolio_gallery
  for all to authenticated
  using (public.is_site_editor(site_id))
  with check (public.is_site_editor(site_id));

drop policy if exists portfolio_projects_admin_write on public.portfolio_projects;
create policy portfolio_projects_admin_write on public.portfolio_projects
  for all to authenticated
  using (public.is_site_editor(site_id))
  with check (public.is_site_editor(site_id));

drop policy if exists portfolio_experience_admin_write on public.portfolio_experience;
create policy portfolio_experience_admin_write on public.portfolio_experience
  for all to authenticated
  using (public.is_site_editor(site_id))
  with check (public.is_site_editor(site_id));

drop policy if exists portfolio_skills_admin_write on public.portfolio_skills;
create policy portfolio_skills_admin_write on public.portfolio_skills
  for all to authenticated
  using (public.is_site_editor(site_id))
  with check (public.is_site_editor(site_id));

drop policy if exists portfolio_social_admin_write on public.portfolio_social_links;
create policy portfolio_social_admin_write on public.portfolio_social_links
  for all to authenticated
  using (public.is_site_editor(site_id))
  with check (public.is_site_editor(site_id));

drop policy if exists portfolio_contact_admin_write on public.portfolio_contact;
create policy portfolio_contact_admin_write on public.portfolio_contact
  for all to authenticated
  using (public.is_site_editor(site_id))
  with check (public.is_site_editor(site_id));

drop policy if exists portfolio_seo_admin_write on public.portfolio_seo;
create policy portfolio_seo_admin_write on public.portfolio_seo
  for all to authenticated
  using (public.is_site_editor(site_id))
  with check (public.is_site_editor(site_id));

drop policy if exists portfolio_product_settings_admin_write on public.portfolio_product_settings;
create policy portfolio_product_settings_admin_write on public.portfolio_product_settings
  for all to authenticated
  using (public.is_site_editor(site_id))
  with check (public.is_site_editor(site_id));

drop policy if exists portfolio_product_cards_admin_write on public.portfolio_product_cards;
create policy portfolio_product_cards_admin_write on public.portfolio_product_cards
  for all to authenticated
  using (public.is_site_editor(site_id))
  with check (public.is_site_editor(site_id));

drop policy if exists portfolio_product_features_admin_write on public.portfolio_product_features;
create policy portfolio_product_features_admin_write on public.portfolio_product_features
  for all to authenticated
  using (public.is_site_editor(site_id))
  with check (public.is_site_editor(site_id));

-- Allow product/ media folder (and site-prefixed paths: {siteId}/product/...)
drop policy if exists portfolio_media_admin_insert on storage.objects;
create policy portfolio_media_admin_insert on storage.objects
  for insert to authenticated
  with check (
    bucket_id = 'portfolio-media'
    and public.is_portfolio_admin()
    and (
      split_part(name, '/', 1) in ('gallery', 'projects', 'product', 'profile', 'social', 'brand')
      or split_part(name, '/', 2) in ('gallery', 'projects', 'product', 'profile', 'social', 'brand')
    )
  );

drop policy if exists portfolio_media_admin_update on storage.objects;
create policy portfolio_media_admin_update on storage.objects
  for update to authenticated
  using (
    bucket_id = 'portfolio-media'
    and public.is_portfolio_admin()
    and (
      split_part(name, '/', 1) in ('gallery', 'projects', 'product', 'profile', 'social', 'brand')
      or split_part(name, '/', 2) in ('gallery', 'projects', 'product', 'profile', 'social', 'brand')
    )
  )
  with check (
    bucket_id = 'portfolio-media'
    and public.is_portfolio_admin()
    and (
      split_part(name, '/', 1) in ('gallery', 'projects', 'product', 'profile', 'social', 'brand')
      or split_part(name, '/', 2) in ('gallery', 'projects', 'product', 'profile', 'social', 'brand')
    )
  );

drop policy if exists portfolio_media_admin_delete on storage.objects;
create policy portfolio_media_admin_delete on storage.objects
  for delete to authenticated
  using (
    bucket_id = 'portfolio-media'
    and public.is_portfolio_admin()
    and (
      split_part(name, '/', 1) in ('gallery', 'projects', 'product', 'profile', 'social', 'brand')
      or split_part(name, '/', 2) in ('gallery', 'projects', 'product', 'profile', 'social', 'brand')
    )
  );
