-- Additive updates for hero/profile image and tighter storage paths.
-- Safe to run after 001_portfolio_cms.sql.

alter table public.portfolio_settings
  add column if not exists hero_image_url text not null default '';

alter table public.portfolio_projects
  add column if not exists image_path text;

drop policy if exists portfolio_media_admin_insert on storage.objects;
create policy portfolio_media_admin_insert on storage.objects
  for insert to authenticated
  with check (
    bucket_id = 'portfolio-media'
    and public.is_portfolio_admin()
    and split_part(name, '/', 1) in ('gallery', 'projects', 'profile', 'social')
  );

drop policy if exists portfolio_media_admin_update on storage.objects;
create policy portfolio_media_admin_update on storage.objects
  for update to authenticated
  using (
    bucket_id = 'portfolio-media'
    and public.is_portfolio_admin()
    and split_part(name, '/', 1) in ('gallery', 'projects', 'profile', 'social')
  )
  with check (
    bucket_id = 'portfolio-media'
    and public.is_portfolio_admin()
    and split_part(name, '/', 1) in ('gallery', 'projects', 'profile', 'social')
  );

drop policy if exists portfolio_media_admin_delete on storage.objects;
create policy portfolio_media_admin_delete on storage.objects
  for delete to authenticated
  using (
    bucket_id = 'portfolio-media'
    and public.is_portfolio_admin()
    and split_part(name, '/', 1) in ('gallery', 'projects', 'profile', 'social')
  );
