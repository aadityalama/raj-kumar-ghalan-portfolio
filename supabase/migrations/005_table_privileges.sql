-- Table privileges required by the anon/authenticated API roles.
-- RLS policies alone are not enough; Postgres also needs GRANT.
-- Safe to run after 001_portfolio_cms.sql.

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
