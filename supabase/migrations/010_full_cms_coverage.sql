-- Full CMS coverage: section chrome, hero CTAs, journey stages, experience media, market/content arrays.
-- Additive and idempotent — backfills owner site only when fields are empty.

-- ---------------------------------------------------------------------------
-- portfolio_settings — additional content fields
-- ---------------------------------------------------------------------------

alter table public.portfolio_settings
  add column if not exists hero_primary_cta_text text not null default 'View My Work',
  add column if not exists hero_primary_cta_href text not null default '#projects',
  add column if not exists hero_secondary_cta_text text not null default 'Let''s Connect',
  add column if not exists hero_secondary_cta_href text not null default '#contact',
  add column if not exists gallery_page_eyebrow text not null default 'Photo Gallery',
  add column if not exists gallery_page_title text not null default '',
  add column if not exists gallery_page_description text not null default '',
  add column if not exists gallery_cta_label text not null default 'View Photo Gallery',
  add column if not exists gallery_cta_href text not null default '/gallery',
  add column if not exists career_timeline_eyebrow text not null default 'Path',
  add column if not exists career_timeline_title text not null default 'The journey so far',
  add column if not exists market_eyebrow text not null default 'Spotlight',
  add column if not exists market_followers_label text not null default 'Followers',
  add column if not exists market_posts_label text not null default 'Posts',
  add column if not exists market_facebook_cta text not null default 'Open profile',
  add column if not exists content_eyebrow text not null default 'Creator',
  add column if not exists content_youtube_context text not null default 'Video channel',
  add column if not exists content_youtube_cta text not null default 'Open channel',
  add column if not exists content_themes text[] not null default '{}',
  add column if not exists market_capabilities text[] not null default '{}',
  add column if not exists other_projects_eyebrow text not null default 'More work',
  add column if not exists other_projects_title text not null default 'Other projects',
  add column if not exists about_eyebrow text not null default '01 / About',
  add column if not exists about_known_experience_heading text not null default 'Known experience';

-- ---------------------------------------------------------------------------
-- portfolio_sections — eyebrow for section headers
-- ---------------------------------------------------------------------------

alter table public.portfolio_sections
  add column if not exists eyebrow text not null default '';

-- ---------------------------------------------------------------------------
-- portfolio_experience — location, logo, visibility
-- ---------------------------------------------------------------------------

alter table public.portfolio_experience
  add column if not exists location text not null default '',
  add column if not exists logo_url text not null default '',
  add column if not exists logo_path text not null default '',
  add column if not exists visible boolean not null default true;

-- ---------------------------------------------------------------------------
-- Journey / timeline stages (career path + experience milestones)
-- ---------------------------------------------------------------------------

create table if not exists public.portfolio_journey_stages (
  id uuid primary key default gen_random_uuid(),
  site_id uuid references public.portfolio_sites (id) on delete cascade,
  kind text not null default 'career' check (kind in ('career', 'experience')),
  stage_label text not null default '',
  title text not null default '',
  body text not null default '',
  visible boolean not null default true,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists portfolio_journey_stages_site_kind_idx
  on public.portfolio_journey_stages (site_id, kind, sort_order);

drop trigger if exists portfolio_journey_stages_touch on public.portfolio_journey_stages;
create trigger portfolio_journey_stages_touch before update on public.portfolio_journey_stages
for each row execute function public.touch_updated_at();

alter table public.portfolio_journey_stages enable row level security;

drop policy if exists portfolio_journey_stages_public_read on public.portfolio_journey_stages;
create policy portfolio_journey_stages_public_read on public.portfolio_journey_stages
  for select to anon, authenticated
  using (visible = true and site_id is not null);

drop policy if exists portfolio_journey_stages_editor_write on public.portfolio_journey_stages;
create policy portfolio_journey_stages_editor_write on public.portfolio_journey_stages
  for all to authenticated
  using (site_id is not null and public.is_site_editor(site_id))
  with check (site_id is not null and public.is_site_editor(site_id));

grant select on public.portfolio_journey_stages to anon, authenticated;
grant insert, update, delete on public.portfolio_journey_stages to authenticated;

-- ---------------------------------------------------------------------------
-- Experience workplace photos
-- ---------------------------------------------------------------------------

create table if not exists public.portfolio_experience_photos (
  id uuid primary key default gen_random_uuid(),
  site_id uuid references public.portfolio_sites (id) on delete cascade,
  image_url text not null default '',
  image_path text,
  alt text not null default '',
  caption text not null default '',
  visible boolean not null default true,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists portfolio_experience_photos_site_idx
  on public.portfolio_experience_photos (site_id, sort_order);

drop trigger if exists portfolio_experience_photos_touch on public.portfolio_experience_photos;
create trigger portfolio_experience_photos_touch before update on public.portfolio_experience_photos
for each row execute function public.touch_updated_at();

alter table public.portfolio_experience_photos enable row level security;

drop policy if exists portfolio_experience_photos_public_read on public.portfolio_experience_photos;
create policy portfolio_experience_photos_public_read on public.portfolio_experience_photos
  for select to anon, authenticated
  using (visible = true and site_id is not null);

drop policy if exists portfolio_experience_photos_editor_write on public.portfolio_experience_photos;
create policy portfolio_experience_photos_editor_write on public.portfolio_experience_photos
  for all to authenticated
  using (site_id is not null and public.is_site_editor(site_id))
  with check (site_id is not null and public.is_site_editor(site_id));

grant select on public.portfolio_experience_photos to anon, authenticated;
grant insert, update, delete on public.portfolio_experience_photos to authenticated;

-- ---------------------------------------------------------------------------
-- Owner site backfill (only when empty — preserves custom CMS edits)
-- ---------------------------------------------------------------------------

update public.portfolio_settings ps
set
  gallery_page_title = 'Moments from the work, the journey, and the build.',
  gallery_page_description = 'A collection of photographs from projects, professional life, and experiences — managed from the admin gallery and kept current as new frames are published.',
  market_eyebrow = 'Market & Investment',
  market_followers_label = 'Followers',
  market_posts_label = 'Posts',
  market_facebook_cta = 'Follow NEPSE Market Analyst',
  content_eyebrow = 'Creator',
  content_youtube_context = 'YouTube / FIRE Nepal',
  content_youtube_cta = 'Watch on YouTube',
  content_themes = array[
    'NEPSE Technical Analysis',
    'Market analysis',
    'Trading ideas',
    'Financial education',
    'Personal finance',
    'Nepal',
    'Korea',
    'Career',
    'Product building'
  ],
  market_capabilities = array[
    'NEPSE Market Analysis',
    'Technical Analysis',
    'Market Trend Analysis',
    'Trading & Investment',
    'Nepali Share Market Investor',
    'Investor Education',
    'Financial Content Creation'
  ],
  other_projects_eyebrow = 'More work',
  other_projects_title = 'Other projects'
from public.portfolio_sites s
where ps.site_id = s.id
  and s.is_owner_site = true
  and (ps.gallery_page_title = '' or ps.gallery_page_title is null);

update public.portfolio_sections sec
set
  eyebrow = case sec.section_key
    when 'about' then '01 / About'
    when 'experience' then '02 / Experience'
    when 'projects' then '03 / Work'
    when 'market' then 'Market & Investment'
    when 'skills' then '06 / Capabilities'
    when 'content' then 'Creator'
    when 'gallery' then 'Photo Gallery'
    when 'philosophy' then 'Philosophy'
    when 'contact' then 'Contact'
    else sec.eyebrow
  end,
  title = case
    when sec.section_key = 'projects' and (sec.title is null or sec.title = '' or sec.title = 'Projects')
      then 'Things I''m Building'
    when sec.section_key = 'skills' and (sec.title is null or sec.title = '' or sec.title = 'Skills')
      then 'What I Work With'
    else sec.title
  end,
  description = case
    when sec.section_key = 'projects' and (sec.description is null or sec.description = '')
      then 'From NEPSE analysis and financial independence to digital commerce, I build products around real-world problems.'
    when sec.section_key = 'skills' and (sec.description is null or sec.description = '')
      then 'A working set of product, technology, markets, AI, and content skills — used to ship real things, not a logo wall.'
    else sec.description
  end
from public.portfolio_sites s
where sec.site_id = s.id
  and s.is_owner_site = true
  and (sec.eyebrow = '' or sec.eyebrow is null);

update public.portfolio_experience ex
set logo_url = '/experience/kp-electric.png'
from public.portfolio_sites s
where ex.site_id = s.id
  and s.is_owner_site = true
  and ex.company ilike 'KP Electric%'
  and (ex.logo_url = '' or ex.logo_url is null);

-- Career journey stages for owner site (insert only if none exist)
insert into public.portfolio_journey_stages (site_id, kind, stage_label, title, body, sort_order)
select s.id, v.kind, v.stage_label, v.title, v.body, v.sort_order
from public.portfolio_sites s
cross join (
  values
    ('career', '01', 'Nepal', 'Roots, values, and the beginning of a long professional path.', 10),
    ('career', '02', 'South Korea', 'Living and working abroad — building a career far from home.', 20),
    ('career', '03', 'Professional Experience', '14+ years of technical work, discipline, and industrial craft.', 30),
    ('career', '04', 'Digital Builder', 'Learning modern product tools and turning ideas into software.', 40),
    ('career', '05', 'Market Analyst', 'Technical analysis, NEPSE market trends, and investor education for Nepali traders.', 50),
    ('career', '06', 'Product Creator', 'Shipping platforms and stories that help people make better decisions.', 60),
    ('experience', '2020s', 'Professional expertise', 'Deepening technical craft inside a manufacturing environment where quality and consistency matter.', 10),
    ('experience', 'Craft', 'Technical experience', 'Years of working with transformer systems, machines, and production standards.', 20),
    ('experience', 'Shift', 'Digital transformation', 'A growing interest in technology, product thinking, and building software that people can actually use.', 30),
    ('experience', 'Now', 'Product building', 'Turning that curiosity into real digital products, NEPSE market analysis, and financial content.', 40)
) as v(kind, stage_label, title, body, sort_order)
where s.is_owner_site = true
  and not exists (
    select 1 from public.portfolio_journey_stages j where j.site_id = s.id
  );
