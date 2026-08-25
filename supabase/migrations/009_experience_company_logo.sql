-- Optional company logo URL per experience entry.
-- Idempotent: safe to re-run; does not modify existing experience row content.

alter table public.portfolio_experience
  add column if not exists company_logo_url text not null default '';

-- Allow experience logo uploads into the existing portfolio-media bucket.
-- Extends the folder allow-list from 007_productize_multitenant.sql.

drop policy if exists portfolio_media_admin_insert on storage.objects;
create policy portfolio_media_admin_insert on storage.objects
  for insert to authenticated
  with check (
    bucket_id = 'portfolio-media'
    and public.is_portfolio_admin()
    and (
      split_part(name, '/', 1) in ('gallery', 'projects', 'product', 'profile', 'social', 'brand', 'experience')
      or split_part(name, '/', 2) in ('gallery', 'projects', 'product', 'profile', 'social', 'brand', 'experience')
    )
  );

drop policy if exists portfolio_media_admin_update on storage.objects;
create policy portfolio_media_admin_update on storage.objects
  for update to authenticated
  using (
    bucket_id = 'portfolio-media'
    and public.is_portfolio_admin()
    and (
      split_part(name, '/', 1) in ('gallery', 'projects', 'product', 'profile', 'social', 'brand', 'experience')
      or split_part(name, '/', 2) in ('gallery', 'projects', 'product', 'profile', 'social', 'brand', 'experience')
    )
  )
  with check (
    bucket_id = 'portfolio-media'
    and public.is_portfolio_admin()
    and (
      split_part(name, '/', 1) in ('gallery', 'projects', 'product', 'profile', 'social', 'brand', 'experience')
      or split_part(name, '/', 2) in ('gallery', 'projects', 'product', 'profile', 'social', 'brand', 'experience')
    )
  );

drop policy if exists portfolio_media_admin_delete on storage.objects;
create policy portfolio_media_admin_delete on storage.objects
  for delete to authenticated
  using (
    bucket_id = 'portfolio-media'
    and public.is_portfolio_admin()
    and (
      split_part(name, '/', 1) in ('gallery', 'projects', 'product', 'profile', 'social', 'brand', 'experience')
      or split_part(name, '/', 2) in ('gallery', 'projects', 'product', 'profile', 'social', 'brand', 'experience')
    )
  );
