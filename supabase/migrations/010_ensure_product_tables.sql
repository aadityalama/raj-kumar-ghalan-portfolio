-- Ensure product CMS tables exist with the schema expected by the current app
-- (final shape after 006_product_section + 007_productize_multitenant + 009_site_isolation).
--
-- Safe / idempotent repair for production DBs that skipped 006_product_section.sql
-- (or only partially applied it). Creates ONLY:
--   - public.portfolio_product_settings
--   - public.portfolio_product_cards
--   - public.portfolio_product_features
--
-- Does NOT:
--   - seed or update product content
--   - drop / truncate / reset any tables
--   - touch projects, gallery, skills, settings, or other CMS tables
--
-- Do not execute from the app automatically — apply in the Supabase SQL editor,
-- then reload PostgREST (NOTIFY below).

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- Tables (create with full final column set when missing)
-- ---------------------------------------------------------------------------

create table if not exists public.portfolio_product_settings (
  id int primary key,
  site_id uuid references public.portfolio_sites (id) on delete cascade,
  section_title text not null default 'The Product',
  case_title text not null default '',
  case_eyebrow text not null default 'Featured work',
  live_url text not null default '',
  category text not null default '',
  short_description text not null default '',
  problem_title text not null default 'The Problem',
  problem_body text not null default '',
  vision_title text not null default 'The Vision',
  vision_body text not null default '',
  built_title text not null default 'What I Built',
  built_body text not null default '',
  tech_title text not null default 'Technology',
  tech_body text not null default '',
  philosophy_title text not null default 'Product philosophy',
  philosophy_body text not null default '',
  technologies text[] not null default '{}',
  visible boolean not null default true,
  sort_order int not null default 0,
  updated_at timestamptz not null default now()
);

create table if not exists public.portfolio_product_cards (
  id uuid primary key default gen_random_uuid(),
  site_id uuid references public.portfolio_sites (id) on delete cascade,
  title text not null,
  description text not null default '',
  image_url text not null default '',
  image_path text,
  link_url text not null default '',
  category text not null default '',
  visible boolean not null default true,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.portfolio_product_features (
  id uuid primary key default gen_random_uuid(),
  site_id uuid references public.portfolio_sites (id) on delete cascade,
  title text not null,
  description text not null default '',
  visible boolean not null default true,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Columns (no-op when CREATE already included them; fills gaps on partial tables)
-- ---------------------------------------------------------------------------

alter table public.portfolio_product_settings
  add column if not exists site_id uuid references public.portfolio_sites (id) on delete cascade,
  add column if not exists section_title text not null default 'The Product',
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
  add column if not exists sort_order int not null default 0,
  add column if not exists updated_at timestamptz not null default now();

alter table public.portfolio_product_cards
  add column if not exists site_id uuid references public.portfolio_sites (id) on delete cascade,
  add column if not exists title text not null default 'Untitled',
  add column if not exists description text not null default '',
  add column if not exists image_url text not null default '',
  add column if not exists image_path text,
  add column if not exists link_url text not null default '',
  add column if not exists category text not null default '',
  add column if not exists visible boolean not null default true,
  add column if not exists sort_order int not null default 0,
  add column if not exists created_at timestamptz not null default now(),
  add column if not exists updated_at timestamptz not null default now();

alter table public.portfolio_product_features
  add column if not exists site_id uuid references public.portfolio_sites (id) on delete cascade,
  add column if not exists title text not null default 'Untitled',
  add column if not exists description text not null default '',
  add column if not exists visible boolean not null default true,
  add column if not exists sort_order int not null default 0,
  add column if not exists created_at timestamptz not null default now(),
  add column if not exists updated_at timestamptz not null default now();

-- Drop legacy singleton id=1 check from 006 (multi-site allows one row per site).
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

-- Autoincrement id for per-site product settings rows (matches 009).
create sequence if not exists public.portfolio_product_settings_id_seq;

-- Empty table → next nextval() = 1; existing rows → next = max(id)+1.
select setval(
  'public.portfolio_product_settings_id_seq',
  coalesce((select max(id) from public.portfolio_product_settings), 1),
  (select max(id) from public.portfolio_product_settings) is not null
);

alter table public.portfolio_product_settings
  alter column id set default nextval('public.portfolio_product_settings_id_seq');

alter sequence public.portfolio_product_settings_id_seq
  owned by public.portfolio_product_settings.id;

create unique index if not exists portfolio_product_settings_site_uidx
  on public.portfolio_product_settings (site_id);

-- ---------------------------------------------------------------------------
-- updated_at triggers
-- ---------------------------------------------------------------------------

drop trigger if exists portfolio_product_settings_touch on public.portfolio_product_settings;
create trigger portfolio_product_settings_touch before update on public.portfolio_product_settings
for each row execute function public.touch_updated_at();

drop trigger if exists portfolio_product_cards_touch on public.portfolio_product_cards;
create trigger portfolio_product_cards_touch before update on public.portfolio_product_cards
for each row execute function public.touch_updated_at();

drop trigger if exists portfolio_product_features_touch on public.portfolio_product_features;
create trigger portfolio_product_features_touch before update on public.portfolio_product_features
for each row execute function public.touch_updated_at();

-- ---------------------------------------------------------------------------
-- RLS + policies (public read from 006; membership writes from 009)
-- ---------------------------------------------------------------------------

alter table public.portfolio_product_settings enable row level security;
alter table public.portfolio_product_cards enable row level security;
alter table public.portfolio_product_features enable row level security;

drop policy if exists portfolio_product_settings_public_read on public.portfolio_product_settings;
create policy portfolio_product_settings_public_read on public.portfolio_product_settings
  for select to anon, authenticated using (true);

drop policy if exists portfolio_product_settings_admin_write on public.portfolio_product_settings;
create policy portfolio_product_settings_admin_write on public.portfolio_product_settings
  for all to authenticated
  using (site_id is not null and public.is_site_editor(site_id))
  with check (site_id is not null and public.is_site_editor(site_id));

drop policy if exists portfolio_product_cards_public_read on public.portfolio_product_cards;
create policy portfolio_product_cards_public_read on public.portfolio_product_cards
  for select to anon, authenticated using (visible = true or public.is_portfolio_admin());

drop policy if exists portfolio_product_cards_admin_write on public.portfolio_product_cards;
create policy portfolio_product_cards_admin_write on public.portfolio_product_cards
  for all to authenticated
  using (site_id is not null and public.is_site_editor(site_id))
  with check (site_id is not null and public.is_site_editor(site_id));

drop policy if exists portfolio_product_features_public_read on public.portfolio_product_features;
create policy portfolio_product_features_public_read on public.portfolio_product_features
  for select to anon, authenticated using (visible = true or public.is_portfolio_admin());

drop policy if exists portfolio_product_features_admin_write on public.portfolio_product_features;
create policy portfolio_product_features_admin_write on public.portfolio_product_features
  for all to authenticated
  using (site_id is not null and public.is_site_editor(site_id))
  with check (site_id is not null and public.is_site_editor(site_id));

-- ---------------------------------------------------------------------------
-- Privileges (same grants as 006_product_section.sql)
-- ---------------------------------------------------------------------------

grant select on
  public.portfolio_product_settings,
  public.portfolio_product_cards,
  public.portfolio_product_features
to anon, authenticated;

grant insert, update, delete on
  public.portfolio_product_settings,
  public.portfolio_product_cards,
  public.portfolio_product_features
to authenticated;

grant usage, select on sequence public.portfolio_product_settings_id_seq to authenticated;

-- Refresh PostgREST schema cache so the new tables are visible immediately.
notify pgrst, 'reload schema';
