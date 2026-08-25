-- Optional DEMO content for NEW commercial installs only.
-- Do NOT run this against an existing personal production database.
-- Prefer the admin onboarding wizard when possible.

update public.portfolio_settings
set
  hero_title = 'Your Name',
  hero_subtitle = 'Building meaningful digital experiences.',
  hero_positioning = 'Creative Professional',
  hero_body = 'A short introduction to your work, craft, and the products you build.',
  about_title = E'About your work.\nAbout your craft.\nAbout what you build.',
  about_body = 'Introduce yourself in a few sentences. Share what you do, who you help, and what makes your work distinctive.',
  about_body_secondary = 'Add a second paragraph for context — background, approach, or the themes that connect your projects.',
  about_experience_label = 'Professional Experience',
  journey_title = 'Professional journey',
  journey_description = 'A short overview of how your career has unfolded.',
  philosophy = 'Build work that is clear, useful, and lasting.',
  content_title = 'Beyond the work. I create.',
  content_description = 'Describe any content or community work that sits alongside your projects.',
  content_youtube_title = 'Video content',
  content_youtube_body = 'Link your channel and describe what viewers will find.',
  market_title = 'Share a professional focus area',
  market_description = 'Use this optional spotlight section for a specialty topic.',
  market_profile = 'Add a short profile that explains your focus.',
  market_note = '',
  market_followers = '',
  market_posts = '',
  market_facebook_url = '',
  hero_image_url = '',
  website_name = 'Your Name',
  brand_name = 'Your Name',
  wordmark = 'YOUR NAME',
  accent_color = '#3DDC97',
  theme_preference = 'dark',
  copyright_text = 'Your Name',
  onboarding_completed = false
where id = 1;

update public.portfolio_contact
set
  email = '',
  phone = '',
  location = '',
  message = 'If something here resonates, write to me. I read every note.'
where id = 1;

update public.portfolio_seo
set
  site_title = 'Your Name — Creative Professional',
  meta_description = 'A premium portfolio website for showcasing projects, experience, and creative work.',
  keywords = array['portfolio', 'creative professional', 'projects'],
  og_title = 'Your Name — Creative Professional',
  og_description = 'A premium portfolio website for showcasing projects, experience, and creative work.',
  og_image = ''
where id = 1;

update public.portfolio_product_settings
set
  section_title = 'The Product',
  case_title = 'Featured project, in focus',
  case_eyebrow = 'Featured work',
  short_description = 'A short summary of your signature product or case study.',
  problem_body = 'Describe the problem your audience faces.',
  vision_body = 'Describe the outcome you set out to create.',
  built_body = 'Summarize what you shipped and why it matters.',
  tech_body = 'Built as a modern web product with a mobile-first architecture.',
  philosophy_body = 'Technology should simplify decisions, not make them harder.',
  technologies = array['Next.js', 'TypeScript', 'Supabase'],
  visible = true
where id = 1;

delete from public.portfolio_social_links;
delete from public.portfolio_projects;
delete from public.portfolio_experience;
delete from public.portfolio_skills;
delete from public.portfolio_gallery;
delete from public.portfolio_product_cards;
delete from public.portfolio_product_features;

insert into public.portfolio_projects (title, description, category, technologies, live_url, featured, published, sort_order)
values (
  'Featured Project',
  'Showcase your signature project — what it is, who it helps, and why it matters.',
  'Product · Design · Technology',
  array['Next.js', 'TypeScript', 'Supabase'],
  '',
  true,
  true,
  10
);

insert into public.portfolio_experience (company, position, end_year, description, technologies, featured, sort_order)
values (
  'Example Studio',
  'Creative Professional',
  'Present',
  'Add your professional experience here — company, role, and a short summary of your work.',
  array['Craft', 'Collaboration'],
  true,
  10
);

insert into public.portfolio_skills (name, category, visible, sort_order) values
  ('Product thinking', 'Digital Product', true, 10),
  ('UI/UX', 'Digital Product', true, 20),
  ('Next.js', 'Technology', true, 30),
  ('TypeScript', 'Technology', true, 40);

insert into public.portfolio_product_features (title, visible, sort_order) values
  ('Overview', true, 10),
  ('Experience', true, 20),
  ('Tools', true, 30),
  ('Insights', true, 40);
