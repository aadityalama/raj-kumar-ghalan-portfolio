-- =============================================================================
-- READ-ONLY owner-site regression diagnostics
-- Paste this ENTIRE block into Supabase → SQL Editor → Run
-- Safe: SELECT only. No INSERT / UPDATE / DELETE / ALTER / migration / seed.
-- =============================================================================

-- A) Schema presence (isolation migration applied?)
select
  'A_schema' as section,
  exists (
    select 1 from information_schema.columns
    where table_schema = 'public'
      and table_name = 'portfolio_sites'
      and column_name = 'is_owner_site'
  ) as has_is_owner_site,
  to_regclass('public.portfolio_site_domains') is not null as has_portfolio_site_domains,
  exists (
    select 1 from information_schema.columns
    where table_schema = 'public'
      and table_name = 'portfolio_experience'
      and column_name = 'site_id'
  ) as experience_has_site_id,
  exists (
    select 1 from information_schema.columns
    where table_schema = 'public'
      and table_name = 'portfolio_settings'
      and column_name = 'site_id'
  ) as settings_has_site_id;

-- B) All portfolio_sites (owner site_id + customer-* detection)
select
  'B_sites' as section,
  id as site_id,
  slug,
  name,
  plan_tier,
  is_owner_site,
  onboarding_completed,
  created_at,
  updated_at,
  (slug like 'customer-%') as is_customer_slug
from public.portfolio_sites
order by created_at;

-- C) Owner site row(s) only
select
  'C_owner_site' as section,
  id as site_id,
  slug,
  name,
  is_owner_site,
  onboarding_completed,
  created_at
from public.portfolio_sites
where is_owner_site = true
order by created_at;

-- D) Domain map for rajkumarghalan.com.np (and www)
select
  'D_domains' as section,
  d.id as domain_row_id,
  d.site_id,
  s.slug as site_slug,
  s.is_owner_site,
  d.domain,
  d.is_primary,
  d.created_at
from public.portfolio_site_domains d
left join public.portfolio_sites s on s.id = d.site_id
where d.domain in ('rajkumarghalan.com.np', 'www.rajkumarghalan.com.np')
   or d.domain ilike '%rajkumarghalan%'
order by d.domain;

-- E) All domains (in case owner domain spelling differs)
select
  'E_all_domains' as section,
  d.site_id,
  s.slug as site_slug,
  s.is_owner_site,
  d.domain,
  d.is_primary
from public.portfolio_site_domains d
left join public.portfolio_sites s on s.id = d.site_id
order by d.domain;

-- F) portfolio_settings + site_id (Raj vs Your Name / demo)
select
  'F_settings' as section,
  id,
  site_id,
  hero_title,
  brand_name,
  website_name,
  wordmark,
  hero_positioning,
  onboarding_completed,
  updated_at
from public.portfolio_settings
order by id;

-- G) portfolio_experience + site_id (KP Electric / Season Co / Example Studio)
select
  'G_experience' as section,
  id,
  site_id,
  company,
  position,
  start_year,
  end_year,
  featured,
  sort_order,
  left(coalesce(description, ''), 120) as description_preview,
  technologies,
  created_at,
  updated_at
from public.portfolio_experience
order by sort_order nulls last, company;

-- H) Flag whether original / demo experience strings exist
select
  'H_experience_flags' as section,
  exists (
    select 1 from public.portfolio_experience
    where company ilike '%KP Electric%'
  ) as has_kp_electric,
  exists (
    select 1 from public.portfolio_experience
    where company ilike '%Season%'
  ) as has_season_co,
  exists (
    select 1 from public.portfolio_experience
    where company ilike '%Example Studio%'
  ) as has_example_studio,
  exists (
    select 1 from public.portfolio_settings
    where coalesce(hero_title, '') ilike '%Raj Kumar%'
       or coalesce(brand_name, '') ilike '%Raj Kumar%'
       or coalesce(website_name, '') ilike '%Raj Kumar%'
  ) as has_raj_in_settings,
  exists (
    select 1 from public.portfolio_settings
    where coalesce(hero_title, '') in ('Your Name', '')
      and coalesce(brand_name, '') in ('Your Name', '', 'YOUR NAME')
  ) as has_neutral_demo_settings;

-- I) portfolio_projects + site_id
select
  'I_projects' as section,
  id,
  site_id,
  title,
  category,
  featured,
  published,
  sort_order,
  left(coalesce(description, ''), 100) as description_preview,
  updated_at
from public.portfolio_projects
order by sort_order nulls last, title;

-- J) portfolio_skills + site_id
select
  'J_skills' as section,
  id,
  site_id,
  name,
  category,
  visible,
  sort_order,
  updated_at
from public.portfolio_skills
order by sort_order nulls last, name;

-- K) Memberships (who is attached to owner vs customer sites)
select
  'K_members' as section,
  m.site_id,
  s.slug as site_slug,
  s.is_owner_site,
  (s.slug like 'customer-%') as is_customer_slug,
  m.user_id,
  m.role,
  m.created_at
from public.portfolio_site_members m
left join public.portfolio_sites s on s.id = m.site_id
order by m.created_at;

-- L) NULL site_id orphans (pre-multitenant leftovers)
select 'L_null_site_id' as section, 'portfolio_experience' as tbl,
  count(*) as null_site_id_count
from public.portfolio_experience where site_id is null
union all
select 'L_null_site_id', 'portfolio_projects', count(*)
from public.portfolio_projects where site_id is null
union all
select 'L_null_site_id', 'portfolio_skills', count(*)
from public.portfolio_skills where site_id is null
union all
select 'L_null_site_id', 'portfolio_settings', count(*)
from public.portfolio_settings where site_id is null
union all
select 'L_null_site_id', 'portfolio_gallery', count(*)
from public.portfolio_gallery where site_id is null
union all
select 'L_null_site_id', 'portfolio_social_links', count(*)
from public.portfolio_social_links where site_id is null;

-- M) Counts per site (empty customer-* vs owner with real content)
select
  'M_counts_by_site' as section,
  s.id as site_id,
  s.slug,
  s.is_owner_site,
  (s.slug like 'customer-%') as is_customer_slug,
  (select count(*) from public.portfolio_settings x where x.site_id = s.id) as settings_n,
  (select count(*) from public.portfolio_experience e where e.site_id = s.id) as experience_n,
  (select count(*) from public.portfolio_projects p where p.site_id = s.id) as projects_n,
  (select count(*) from public.portfolio_skills k where k.site_id = s.id) as skills_n,
  (select count(*) from public.portfolio_gallery g where g.site_id = s.id) as gallery_n,
  (select count(*) from public.portfolio_social_links l where l.site_id = s.id) as socials_n,
  (select count(*) from public.portfolio_site_members m where m.site_id = s.id) as members_n
from public.portfolio_sites s
order by s.created_at;
