-- READ-ONLY diagnostics for owner Admin showing demo Experience content.
-- Safe: SELECT only. Do NOT run any INSERT/UPDATE/DELETE from this file.
-- Paste results back to the agent before any remediation.

-- 1) Schema: isolation columns / tables present?
select
  exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'portfolio_sites' and column_name = 'is_owner_site'
  ) as has_is_owner_site,
  to_regclass('public.portfolio_site_domains') as portfolio_site_domains,
  exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'portfolio_experience' and column_name = 'site_id'
  ) as experience_has_site_id;

-- 2) Sites / tenants
select id, slug, name, plan_tier, is_owner_site, onboarding_completed, created_at
from public.portfolio_sites
order by created_at;

-- 3) Domain → site map (public routing)
select id, site_id, domain, is_primary, created_at
from public.portfolio_site_domains
order by domain;

-- 4) Memberships (who can edit which site)
select m.site_id, s.slug, s.is_owner_site, m.user_id, m.role, m.created_at
from public.portfolio_site_members m
left join public.portfolio_sites s on s.id = m.site_id
order by m.created_at;

-- 5) Settings per site (look for Raj Kumar vs Your Name)
select id, site_id, hero_title, brand_name, website_name, hero_positioning, onboarding_completed, updated_at
from public.portfolio_settings
order by id;

-- 6) Experience rows (look for KP Electric / Season Co / Example Studio)
select id, site_id, company, position, start_year, end_year, featured, sort_order,
       left(description, 80) as description_preview, technologies
from public.portfolio_experience
order by sort_order, company;

-- 7) NULL site_id orphans (pre-multitenant leftovers)
select 'portfolio_experience' as tbl, count(*) as null_site_id
from public.portfolio_experience where site_id is null
union all
select 'portfolio_projects', count(*) from public.portfolio_projects where site_id is null
union all
select 'portfolio_skills', count(*) from public.portfolio_skills where site_id is null
union all
select 'portfolio_gallery', count(*) from public.portfolio_gallery where site_id is null
union all
select 'portfolio_social_links', count(*) from public.portfolio_social_links where site_id is null
union all
select 'portfolio_settings', count(*) from public.portfolio_settings where site_id is null;

-- 8) Counts by site
select s.slug, s.is_owner_site, s.id as site_id,
  (select count(*) from public.portfolio_experience e where e.site_id = s.id) as experience_n,
  (select count(*) from public.portfolio_projects p where p.site_id = s.id) as projects_n,
  (select count(*) from public.portfolio_skills k where k.site_id = s.id) as skills_n,
  (select count(*) from public.portfolio_gallery g where g.site_id = s.id) as gallery_n,
  (select count(*) from public.portfolio_social_links l where l.site_id = s.id) as socials_n
from public.portfolio_sites s
order by s.created_at;
