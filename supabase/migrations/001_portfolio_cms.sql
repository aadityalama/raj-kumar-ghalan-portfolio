-- Portfolio CMS schema, RLS, storage, and seed data.
-- Apply in the Supabase SQL editor or via the Supabase CLI.

create extension if not exists "pgcrypto";

create table if not exists public.portfolio_admins (
  user_id uuid primary key references auth.users (id) on delete cascade,
  email text unique not null,
  created_at timestamptz not null default now()
);

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

create table if not exists public.portfolio_settings (
  id int primary key default 1 check (id = 1),
  hero_title text not null default 'Raj Kumar Ghalan',
  hero_subtitle text not null default 'Building ideas into real-world digital products.',
  hero_positioning text not null default 'Market Analyst · Technical Analyst · Digital Builder · Creator',
  hero_body text not null default '',
  about_title text not null default '',
  about_body text not null default '',
  about_body_secondary text not null default '',
  about_experience_label text not null default '14+ Years of Professional Experience',
  journey_title text not null default 'Professional journey',
  journey_description text not null default '',
  philosophy text not null default '',
  content_title text not null default 'Beyond Code. I Create.',
  content_description text not null default '',
  content_youtube_title text not null default 'FIRE Nepal on YouTube',
  content_youtube_body text not null default '',
  market_title text not null default 'Reading the Nepal market with discipline',
  market_description text not null default '',
  market_profile text not null default '',
  market_note text not null default '',
  market_followers text not null default '11K+',
  market_posts text not null default '231+',
  market_facebook_url text not null default 'https://www.facebook.com/share/14ufXJ5qRDG/?mibextid=wwXIfr',
  hero_image_url text not null default '',
  updated_at timestamptz not null default now()
);

create table if not exists public.portfolio_sections (
  id uuid primary key default gen_random_uuid(),
  section_key text unique not null,
  label text not null,
  href text not null,
  visible boolean not null default true,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.portfolio_gallery (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null default '',
  category text not null default 'Personal',
  image_path text,
  image_url text not null,
  featured boolean not null default false,
  visible boolean not null default true,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.portfolio_projects (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null default '',
  category text not null default '',
  technologies text[] not null default '{}',
  live_url text not null default '',
  github_url text not null default '',
  youtube_url text not null default '',
  image_url text not null default '',
  image_path text,
  featured boolean not null default false,
  published boolean not null default true,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.portfolio_experience (
  id uuid primary key default gen_random_uuid(),
  company text not null,
  position text not null,
  start_year text not null default '',
  end_year text not null default '',
  description text not null default '',
  technologies text[] not null default '{}',
  featured boolean not null default false,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.portfolio_skills (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category text not null,
  level text not null default '',
  visible boolean not null default true,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.portfolio_social_links (
  id uuid primary key default gen_random_uuid(),
  platform text not null,
  label text not null,
  href text not null default '',
  note text not null default '',
  visible boolean not null default true,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.portfolio_contact (
  id int primary key default 1 check (id = 1),
  email text not null default '',
  phone text not null default '',
  location text not null default '',
  message text not null default '',
  updated_at timestamptz not null default now()
);

create table if not exists public.portfolio_seo (
  id int primary key default 1 check (id = 1),
  site_title text not null default '',
  meta_description text not null default '',
  keywords text[] not null default '{}',
  og_title text not null default '',
  og_description text not null default '',
  og_image text not null default '',
  updated_at timestamptz not null default now()
);

create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists portfolio_settings_touch on public.portfolio_settings;
create trigger portfolio_settings_touch before update on public.portfolio_settings
for each row execute function public.touch_updated_at();

drop trigger if exists portfolio_sections_touch on public.portfolio_sections;
create trigger portfolio_sections_touch before update on public.portfolio_sections
for each row execute function public.touch_updated_at();

drop trigger if exists portfolio_gallery_touch on public.portfolio_gallery;
create trigger portfolio_gallery_touch before update on public.portfolio_gallery
for each row execute function public.touch_updated_at();

drop trigger if exists portfolio_projects_touch on public.portfolio_projects;
create trigger portfolio_projects_touch before update on public.portfolio_projects
for each row execute function public.touch_updated_at();

drop trigger if exists portfolio_experience_touch on public.portfolio_experience;
create trigger portfolio_experience_touch before update on public.portfolio_experience
for each row execute function public.touch_updated_at();

drop trigger if exists portfolio_skills_touch on public.portfolio_skills;
create trigger portfolio_skills_touch before update on public.portfolio_skills
for each row execute function public.touch_updated_at();

drop trigger if exists portfolio_social_links_touch on public.portfolio_social_links;
create trigger portfolio_social_links_touch before update on public.portfolio_social_links
for each row execute function public.touch_updated_at();

drop trigger if exists portfolio_contact_touch on public.portfolio_contact;
create trigger portfolio_contact_touch before update on public.portfolio_contact
for each row execute function public.touch_updated_at();

drop trigger if exists portfolio_seo_touch on public.portfolio_seo;
create trigger portfolio_seo_touch before update on public.portfolio_seo
for each row execute function public.touch_updated_at();

alter table public.portfolio_admins enable row level security;
alter table public.portfolio_settings enable row level security;
alter table public.portfolio_sections enable row level security;
alter table public.portfolio_gallery enable row level security;
alter table public.portfolio_projects enable row level security;
alter table public.portfolio_experience enable row level security;
alter table public.portfolio_skills enable row level security;
alter table public.portfolio_social_links enable row level security;
alter table public.portfolio_contact enable row level security;
alter table public.portfolio_seo enable row level security;

drop policy if exists portfolio_admins_self_read on public.portfolio_admins;
create policy portfolio_admins_self_read on public.portfolio_admins
  for select to authenticated
  using (user_id = auth.uid());

drop policy if exists portfolio_settings_public_read on public.portfolio_settings;
create policy portfolio_settings_public_read on public.portfolio_settings
  for select to anon, authenticated using (true);
drop policy if exists portfolio_settings_admin_write on public.portfolio_settings;
create policy portfolio_settings_admin_write on public.portfolio_settings
  for all to authenticated
  using (public.is_portfolio_admin())
  with check (public.is_portfolio_admin());

drop policy if exists portfolio_sections_public_read on public.portfolio_sections;
create policy portfolio_sections_public_read on public.portfolio_sections
  for select to anon, authenticated using (visible = true or public.is_portfolio_admin());
drop policy if exists portfolio_sections_admin_write on public.portfolio_sections;
create policy portfolio_sections_admin_write on public.portfolio_sections
  for all to authenticated
  using (public.is_portfolio_admin())
  with check (public.is_portfolio_admin());

drop policy if exists portfolio_gallery_public_read on public.portfolio_gallery;
create policy portfolio_gallery_public_read on public.portfolio_gallery
  for select to anon, authenticated using (visible = true or public.is_portfolio_admin());
drop policy if exists portfolio_gallery_admin_write on public.portfolio_gallery;
create policy portfolio_gallery_admin_write on public.portfolio_gallery
  for all to authenticated
  using (public.is_portfolio_admin())
  with check (public.is_portfolio_admin());

drop policy if exists portfolio_projects_public_read on public.portfolio_projects;
create policy portfolio_projects_public_read on public.portfolio_projects
  for select to anon, authenticated using (published = true or public.is_portfolio_admin());
drop policy if exists portfolio_projects_admin_write on public.portfolio_projects;
create policy portfolio_projects_admin_write on public.portfolio_projects
  for all to authenticated
  using (public.is_portfolio_admin())
  with check (public.is_portfolio_admin());

drop policy if exists portfolio_experience_public_read on public.portfolio_experience;
create policy portfolio_experience_public_read on public.portfolio_experience
  for select to anon, authenticated using (true);
drop policy if exists portfolio_experience_admin_write on public.portfolio_experience;
create policy portfolio_experience_admin_write on public.portfolio_experience
  for all to authenticated
  using (public.is_portfolio_admin())
  with check (public.is_portfolio_admin());

drop policy if exists portfolio_skills_public_read on public.portfolio_skills;
create policy portfolio_skills_public_read on public.portfolio_skills
  for select to anon, authenticated using (visible = true or public.is_portfolio_admin());
drop policy if exists portfolio_skills_admin_write on public.portfolio_skills;
create policy portfolio_skills_admin_write on public.portfolio_skills
  for all to authenticated
  using (public.is_portfolio_admin())
  with check (public.is_portfolio_admin());

drop policy if exists portfolio_social_public_read on public.portfolio_social_links;
create policy portfolio_social_public_read on public.portfolio_social_links
  for select to anon, authenticated using (visible = true or public.is_portfolio_admin());
drop policy if exists portfolio_social_admin_write on public.portfolio_social_links;
create policy portfolio_social_admin_write on public.portfolio_social_links
  for all to authenticated
  using (public.is_portfolio_admin())
  with check (public.is_portfolio_admin());

drop policy if exists portfolio_contact_public_read on public.portfolio_contact;
create policy portfolio_contact_public_read on public.portfolio_contact
  for select to anon, authenticated using (true);
drop policy if exists portfolio_contact_admin_write on public.portfolio_contact;
create policy portfolio_contact_admin_write on public.portfolio_contact
  for all to authenticated
  using (public.is_portfolio_admin())
  with check (public.is_portfolio_admin());

drop policy if exists portfolio_seo_public_read on public.portfolio_seo;
create policy portfolio_seo_public_read on public.portfolio_seo
  for select to anon, authenticated using (true);
drop policy if exists portfolio_seo_admin_write on public.portfolio_seo;
create policy portfolio_seo_admin_write on public.portfolio_seo
  for all to authenticated
  using (public.is_portfolio_admin())
  with check (public.is_portfolio_admin());

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'portfolio-media',
  'portfolio-media',
  true,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
on conflict (id) do update
set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists portfolio_media_public_read on storage.objects;
create policy portfolio_media_public_read on storage.objects
  for select to anon, authenticated
  using (bucket_id = 'portfolio-media');

drop policy if exists portfolio_media_admin_insert on storage.objects;
create policy portfolio_media_admin_insert on storage.objects
  for insert to authenticated
  with check (bucket_id = 'portfolio-media' and public.is_portfolio_admin());

drop policy if exists portfolio_media_admin_update on storage.objects;
create policy portfolio_media_admin_update on storage.objects
  for update to authenticated
  using (bucket_id = 'portfolio-media' and public.is_portfolio_admin())
  with check (bucket_id = 'portfolio-media' and public.is_portfolio_admin());

drop policy if exists portfolio_media_admin_delete on storage.objects;
create policy portfolio_media_admin_delete on storage.objects
  for delete to authenticated
  using (bucket_id = 'portfolio-media' and public.is_portfolio_admin());

grant usage on schema public to anon, authenticated;
grant execute on function public.is_portfolio_admin() to anon, authenticated;
grant select on public.portfolio_admins to authenticated;
grant select on
  public.portfolio_settings,
  public.portfolio_sections,
  public.portfolio_gallery,
  public.portfolio_projects,
  public.portfolio_experience,
  public.portfolio_skills,
  public.portfolio_social_links,
  public.portfolio_contact,
  public.portfolio_seo
to anon, authenticated;
grant insert, update, delete on
  public.portfolio_settings,
  public.portfolio_sections,
  public.portfolio_gallery,
  public.portfolio_projects,
  public.portfolio_experience,
  public.portfolio_skills,
  public.portfolio_social_links,
  public.portfolio_contact,
  public.portfolio_seo
to authenticated;

insert into public.portfolio_settings (
  id,
  hero_title,
  hero_subtitle,
  hero_positioning,
  hero_body,
  about_title,
  about_body,
  about_body_secondary,
  about_experience_label,
  journey_title,
  journey_description,
  philosophy,
  content_title,
  content_description,
  content_youtube_title,
  content_youtube_body,
  market_title,
  market_description,
  market_profile,
  market_note,
  market_followers,
  market_posts,
  market_facebook_url,
  hero_image_url
) values (
  1,
  'Raj Kumar Ghalan',
  'Building ideas into real-world digital products.',
  'Market Analyst · Technical Analyst · Digital Builder · Creator',
  'Experienced professional based in South Korea — a NEPSE market analyst and technical analyst, investor and trader, and a builder of digital products around financial independence and content.',
  E'A professional career.\nA market analyst’s eye.\nA builder’s mindset.',
  'I have spent more than a decade working as a professional in South Korea — learning discipline, precision, and how real systems operate. Alongside that career, I analyze the Nepal Stock Exchange as a market analyst, technical analyst, investor, and trader, and I build digital products: tools for financial independence, commerce, and everyday decisions.',
  'The through-line is practical. I care about markets that people can read more clearly, technology they can use, and stories that travel between Nepal, Korea, and the work of making things.',
  '14+ Years of Professional Experience',
  'Professional journey',
  'Industrial craft first. Digital products next. The same standard: do the work carefully.',
  'Build things that make life simpler, smarter, and more independent.',
  'Beyond Code. I Create.',
  'I also make digital and social content around NEPSE technical analysis, financial education, personal finance, Nepal, Korea, career, and the products I am building.',
  'FIRE Nepal on YouTube',
  'Financial education, personal finance, and stories around the FIRE Nepal product — on the official FIRE Nepal channel.',
  'Reading the Nepal market with discipline',
  'I analyze the Nepal Stock Exchange (NEPSE) with a focus on technical analysis, market trends, trading strategies, and investor education. Through my content and analysis, I share practical insights for Nepali investors and traders navigating the stock market.',
  'I am a Nepali share market investor and NEPSE market analyst. My technical analysis Facebook page has 11K+ followers. I publish NEPSE technical analysis, follow Nepal share market trends, and actively invest and trade — educational work for investors and traders, not profit or return guarantees.',
  'Educational analysis and content for investors and traders — not licensed financial advice, and not a promise of profits or returns.',
  '11K+',
  '231+',
  'https://www.facebook.com/share/14ufXJ5qRDG/?mibextid=wwXIfr',
  '/photos/portrait-hero.jpg'
)
on conflict (id) do nothing;

insert into public.portfolio_sections (section_key, label, href, visible, sort_order) values
  ('about', 'About', '#about', true, 10),
  ('gallery', 'Gallery', '#gallery', true, 20),
  ('experience', 'Experience', '#experience', true, 30),
  ('market', 'Market', '#market', true, 40),
  ('projects', 'Projects', '#projects', true, 50),
  ('skills', 'Skills', '#skills', true, 60),
  ('content', 'Content', '#content', true, 70),
  ('philosophy', 'Philosophy', '#philosophy', true, 75),
  ('contact', 'Contact', '#contact', true, 80)
on conflict (section_key) do nothing;

insert into public.portfolio_contact (id, email, phone, location, message) values (
  1,
  'aadityalama853@gmail.com',
  '',
  'South Korea',
  'If something here resonates, write to me. I read every note — products, NEPSE conversations, collaborations, content, or a simple exchange of ideas.'
)
on conflict (id) do nothing;

insert into public.portfolio_seo (
  id, site_title, meta_description, keywords, og_title, og_description, og_image
) values (
  1,
  'Raj Kumar Ghalan — Market Analyst, Technical Analyst, Digital Builder, Creator',
  'Personal website of Raj Kumar Ghalan — a NEPSE market analyst, technical analyst, investor, trader, and digital builder based in South Korea.',
  array['Raj Kumar Ghalan', 'NEPSE', 'market analyst', 'technical analysis', 'FIRE Nepal'],
  'Raj Kumar Ghalan — Market Analyst, Technical Analyst, Digital Builder, Creator',
  'Personal website of Raj Kumar Ghalan — a NEPSE market analyst, technical analyst, investor, trader, and digital builder based in South Korea.',
  '/photos/portrait-hero.jpg'
)
on conflict (id) do nothing;

insert into public.portfolio_social_links (platform, label, href, note, visible, sort_order) values
  ('youtube', 'YouTube', 'https://www.youtube.com/@Firenepal853', 'FIRE Nepal channel', true, 10),
  ('facebook', 'Facebook', 'https://www.facebook.com/share/1AuV3FkbDN/?mibextid=wwXIfr', 'FIRE Nepal', true, 20),
  ('facebookNepse', 'Facebook', 'https://www.facebook.com/share/14ufXJ5qRDG/?mibextid=wwXIfr', 'NEPSE Market Analyst', true, 30),
  ('instagram', 'Instagram', 'https://www.instagram.com/firenepal', 'FIRE Nepal', true, 40),
  ('tiktok', 'TikTok', 'https://www.tiktok.com/@firenepal4', 'FIRE Nepal', true, 50),
  ('linkedin', 'LinkedIn', '', 'LinkedIn', false, 60),
  ('github', 'GitHub', '', 'GitHub', false, 70),
  ('email', 'Email', 'mailto:aadityalama853@gmail.com', 'Direct email', true, 80)
on conflict do nothing;

insert into public.portfolio_experience (company, position, start_year, end_year, description, technologies, featured, sort_order) values
  (
    'KP Electric',
    'Cast Resin Transformer / Transformer Machine Operator / Transformer Technician',
    '',
    'Present',
    'Hands-on technical work in transformer manufacturing — precision, process discipline, and responsibility for real industrial equipment.',
    array['Transformer systems', 'Production standards', 'Industrial craft'],
    true,
    10
  )
on conflict do nothing;

insert into public.portfolio_projects (title, description, category, technologies, live_url, image_url, featured, published, sort_order) values
  (
    'FIRE Nepal',
    'A financial life platform designed to help Nepalis track wealth, understand their finances, plan for retirement, and work toward Financial Independence and Early Retirement.',
    'FinTech · Personal Finance · AI · SaaS',
    array['Next.js', 'TypeScript', 'Supabase', 'PostgreSQL', 'Vercel', 'AI integrations'],
    'https://www.firenepal.com',
    '/projects/fire-nepal-cashflow.jpg',
    true,
    true,
    10
  ),
  (
    'Uvely Glow',
    'A premium Korean beauty e-commerce concept — Seoul-inspired storefront, product discovery, and a skincare quiz for matching routines.',
    'E-commerce · Beauty Technology',
    array['Next.js', 'TypeScript', 'Tailwind CSS', 'Supabase'],
    '',
    '/projects/uvely-glow-home.jpg',
    false,
    true,
    20
  ),
  (
    'NepDealz',
    'An e-commerce and digital commerce project exploring practical online business for real customers.',
    'E-commerce · Digital Commerce',
    array['Digital Commerce', 'E-commerce'],
    '',
    '',
    false,
    true,
    30
  )
on conflict do nothing;

insert into public.portfolio_gallery (title, description, category, image_url, featured, visible, sort_order) values
  ('Portrait', 'Portrait of Raj Kumar Ghalan', 'Professional', '/photos/portrait-hero.jpg', true, true, 10),
  ('Building FIRE Nepal', 'Laptop open to FIRE Nepal during product work', 'FIRE Nepal', '/photos/life-01-building.jpg', false, true, 20),
  ('Product work', 'FIRE Nepal dashboard on a laptop', 'FIRE Nepal', '/photos/life-02-dashboard.jpg', false, true, 30),
  ('Workspace', 'FIRE Nepal portfolio workspace on a laptop', 'Projects', '/photos/life-03-portfolio.jpg', false, true, 40),
  ('FIRE Nepal', 'FIRE Nepal homepage', 'FIRE Nepal', '/projects/fire-nepal-home.jpg', false, true, 50),
  ('Cashflow', 'FIRE Nepal cashflow dashboard', 'FIRE Nepal', '/projects/fire-nepal-cashflow.jpg', false, true, 60),
  ('Tools', 'FIRE Nepal tools on mobile', 'FIRE Nepal', '/projects/fire-nepal-tools.jpg', false, true, 70),
  ('Uvely Glow', 'Uvely Glow storefront', 'Projects', '/projects/uvely-glow-home.jpg', false, true, 80)
on conflict do nothing;

insert into public.portfolio_skills (name, category, level, visible, sort_order) values
  ('Product thinking', 'Digital Product', '', true, 10),
  ('UI/UX', 'Digital Product', '', true, 20),
  ('Responsive design', 'Digital Product', '', true, 30),
  ('SaaS concepts', 'Digital Product', '', true, 40),
  ('Next.js', 'Technology', '', true, 50),
  ('React', 'Technology', '', true, 60),
  ('TypeScript', 'Technology', '', true, 70),
  ('Tailwind CSS', 'Technology', '', true, 80),
  ('Supabase', 'Technology', '', true, 90),
  ('PostgreSQL', 'Technology', '', true, 100),
  ('GitHub', 'Technology', '', true, 110),
  ('Vercel', 'Technology', '', true, 120),
  ('AI product integration', 'AI', '', true, 130),
  ('AI-assisted workflows', 'AI', '', true, 140),
  ('Financial AI concepts', 'AI', '', true, 150),
  ('AI-powered product experiences', 'AI', '', true, 160),
  ('Social media content', 'Content', '', true, 170),
  ('YouTube content', 'Content', '', true, 180),
  ('Financial education content', 'Content', '', true, 190),
  ('Digital storytelling', 'Content', '', true, 200),
  ('NEPSE Market Analysis', 'Markets', '', true, 210),
  ('Technical Analysis', 'Markets', '', true, 220),
  ('Market Trend Analysis', 'Markets', '', true, 230),
  ('Trading & Investment', 'Markets', '', true, 240),
  ('Nepali Share Market Investor', 'Markets', '', true, 250),
  ('Investor Education', 'Markets', '', true, 260),
  ('Financial Content Creation', 'Markets', '', true, 270)
on conflict do nothing;
