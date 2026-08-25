-- Additive branding columns for portfolio_settings.
-- Safe on existing personal production DBs: does NOT overwrite hero/about/project content.
-- Fixes Setup Wizard / Settings saves that require brand_name, website_name, etc.
-- Idempotent: safe if 007 already added these columns.

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

-- Constrain theme_preference without failing when the column already existed.
do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'portfolio_settings_theme_preference_check'
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

-- Only fill brand placeholders from hero_title when still at product defaults.
-- Does not rewrite custom brand values or other personal CMS content.
update public.portfolio_settings
set
  brand_name = hero_title
where coalesce(nullif(trim(brand_name), ''), 'Your Name') = 'Your Name'
  and coalesce(trim(hero_title), '') <> '';

update public.portfolio_settings
set
  wordmark = upper(hero_title)
where coalesce(nullif(trim(wordmark), ''), 'YOUR NAME') = 'YOUR NAME'
  and coalesce(trim(hero_title), '') <> '';

update public.portfolio_settings
set
  website_name = hero_title
where coalesce(nullif(trim(website_name), ''), 'Portfolio') = 'Portfolio'
  and coalesce(trim(hero_title), '') <> '';

-- Existing sites that already have content should not be forced through the wizard.
update public.portfolio_settings
set onboarding_completed = true
where onboarding_completed = false
  and coalesce(trim(hero_title), '') <> ''
  and hero_title not in ('Your Name', 'Portfolio');
