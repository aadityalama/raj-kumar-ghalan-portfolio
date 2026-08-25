-- Move gallery off the homepage hash section and onto the dedicated /gallery page.
update public.portfolio_sections
set
  label = 'Photo Gallery',
  href = '/gallery',
  sort_order = 72,
  updated_at = now()
where section_key = 'gallery';
