-- Production repair: ensure product CMS tables exist for Feature Card / Product CMS.
-- Final schema matches 006_product_section + 007_productize_multitenant + 009_site_isolation.
--
-- Idempotent. Creates ONLY missing product tables/columns:
--   public.portfolio_product_settings
--   public.portfolio_product_cards
--   public.portfolio_product_features
--
-- Does NOT:
--   - execute automatically (apply manually in Supabase SQL editor)
--   - redefine is_site_editor / is_portfolio_admin / touch_updated_at
--   - touch portfolio_site_members (or any of its RLS policies)
--   - drop constraints via broad name/definition patterns
--   - seed, update, delete, truncate, or reset any CMS content
--   - touch projects, gallery, skills, settings, or other non-product tables

-- ---------------------------------------------------------------------------
-- Preconditions (reuse existing helpers; do not recreate them)
-- ---------------------------------------------------------------------------

do $$
begin
  if to_regprocedure('public.touch_updated_at()') is null then
    raise exception 'Missing public.touch_updated_at(). Apply 001_portfolio_cms.sql first.';
  end if;
  if to_regprocedure('public.is_portfolio_admin()') is null then
    raise exception 'Missing public.is_portfolio_admin(). Apply 001/004 first.';
  end if;
  if to_regprocedure('public.is_site_editor(uuid)') is null then
    raise exception 'Missing public.is_site_editor(uuid). Apply 007/009 first.';
  end if;
  if to_regclass('public.portfolio_sites') is null then
    raise exception 'Missing public.portfolio_sites. Apply 007_productize_multitenant.sql first.';
  end if;
end $$;

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- Tables (full final column set; no legacy check (id = 1))
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
-- Columns added by 007 (no-op when already present)
-- ---------------------------------------------------------------------------

alter table public.portfolio_product_settings
  add column if not exists site_id uuid references public.portfolio_sites (id) on delete cascade;

alter table public.portfolio_product_settings
  add column if not exists case_title text not null default '';

alter table public.portfolio_product_settings
  add column if not exists case_eyebrow text not null default 'Featured work';

alter table public.portfolio_product_settings
  add column if not exists live_url text not null default '';

alter table public.portfolio_product_settings
  add column if not exists category text not null default '';

alter table public.portfolio_product_settings
  add column if not exists short_description text not null default '';

alter table public.portfolio_product_settings
  add column if not exists problem_title text not null default 'The Problem';

alter table public.portfolio_product_settings
  add column if not exists problem_body text not null default '';

alter table public.portfolio_product_settings
  add column if not exists vision_title text not null default 'The Vision';

alter table public.portfolio_product_settings
  add column if not exists vision_body text not null default '';

alter table public.portfolio_product_settings
  add column if not exists built_title text not null default 'What I Built';

alter table public.portfolio_product_settings
  add column if not exists built_body text not null default '';

alter table public.portfolio_product_settings
  add column if not exists tech_title text not null default 'Technology';

alter table public.portfolio_product_settings
  add column if not exists tech_body text not null default '';

alter table public.portfolio_product_settings
  add column if not exists philosophy_title text not null default 'Product philosophy';

alter table public.portfolio_product_settings
  add column if not exists philosophy_body text not null default '';

alter table public.portfolio_product_settings
  add column if not exists technologies text[] not null default '{}';

alter table public.portfolio_product_settings
  add column if not exists visible boolean not null default true;

alter table public.portfolio_product_settings
  add column if not exists sort_order int not null default 0;

alter table public.portfolio_product_cards
  add column if not exists site_id uuid references public.portfolio_sites (id) on delete cascade;

alter table public.portfolio_product_cards
  add column if not exists category text not null default '';

alter table public.portfolio_product_features
  add column if not exists site_id uuid references public.portfolio_sites (id) on delete cascade;

-- Per-site settings id sequence (009). Does not modify row data.
create sequence if not exists public.portfolio_product_settings_id_seq;

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
-- Triggers (existing touch_updated_at only)
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
-- RLS: same pattern as other content tables after 009
-- Write checks call existing security-definer is_site_editor(uuid), which reads
-- portfolio_site_members bypassing RLS — does not recreate site_members policies
-- and does not introduce self-referential RLS recursion.
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
-- Privileges
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

notify pgrst, 'reload schema';
