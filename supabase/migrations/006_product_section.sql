-- Product section CMS: settings, product image cards, and numbered feature cards.
-- Safe to run after 001–005. Seeds existing FIRE Nepal "The Product" content.

create table if not exists public.portfolio_product_settings (
  id int primary key default 1 check (id = 1),
  section_title text not null default 'The Product',
  updated_at timestamptz not null default now()
);

create table if not exists public.portfolio_product_cards (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null default '',
  image_url text not null default '',
  image_path text,
  link_url text not null default '',
  visible boolean not null default true,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.portfolio_product_features (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null default '',
  visible boolean not null default true,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists portfolio_product_settings_touch on public.portfolio_product_settings;
create trigger portfolio_product_settings_touch before update on public.portfolio_product_settings
for each row execute function public.touch_updated_at();

drop trigger if exists portfolio_product_cards_touch on public.portfolio_product_cards;
create trigger portfolio_product_cards_touch before update on public.portfolio_product_cards
for each row execute function public.touch_updated_at();

drop trigger if exists portfolio_product_features_touch on public.portfolio_product_features;
create trigger portfolio_product_features_touch before update on public.portfolio_product_features
for each row execute function public.touch_updated_at();

alter table public.portfolio_product_settings enable row level security;
alter table public.portfolio_product_cards enable row level security;
alter table public.portfolio_product_features enable row level security;

drop policy if exists portfolio_product_settings_public_read on public.portfolio_product_settings;
create policy portfolio_product_settings_public_read on public.portfolio_product_settings
  for select to anon, authenticated using (true);
drop policy if exists portfolio_product_settings_admin_write on public.portfolio_product_settings;
create policy portfolio_product_settings_admin_write on public.portfolio_product_settings
  for all to authenticated
  using (public.is_portfolio_admin())
  with check (public.is_portfolio_admin());

drop policy if exists portfolio_product_cards_public_read on public.portfolio_product_cards;
create policy portfolio_product_cards_public_read on public.portfolio_product_cards
  for select to anon, authenticated using (visible = true or public.is_portfolio_admin());
drop policy if exists portfolio_product_cards_admin_write on public.portfolio_product_cards;
create policy portfolio_product_cards_admin_write on public.portfolio_product_cards
  for all to authenticated
  using (public.is_portfolio_admin())
  with check (public.is_portfolio_admin());

drop policy if exists portfolio_product_features_public_read on public.portfolio_product_features;
create policy portfolio_product_features_public_read on public.portfolio_product_features
  for select to anon, authenticated using (visible = true or public.is_portfolio_admin());
drop policy if exists portfolio_product_features_admin_write on public.portfolio_product_features;
create policy portfolio_product_features_admin_write on public.portfolio_product_features
  for all to authenticated
  using (public.is_portfolio_admin())
  with check (public.is_portfolio_admin());

grant select on
  public.portfolio_product_settings,
  public.portfolio_product_cards,
  public.portfolio_product_features
to anon, authenticated;
grant insert, update, delete on
  public.portfolio_product_settings,
  public.portfolio_product_cards,
  public.portfolio_product_features
to authenticated;

insert into public.portfolio_product_settings (id, section_title) values
  (1, 'The Product')
on conflict (id) do nothing;

insert into public.portfolio_product_cards (title, description, image_url, link_url, visible, sort_order)
select * from (values
  ('Home', 'FIRE Nepal homepage', '/projects/fire-nepal-home.jpg', '', true, 10),
  ('Cashflow', 'FIRE Nepal cashflow dashboard', '/projects/fire-nepal-cashflow.jpg', '', true, 20),
  ('Tools', 'FIRE Nepal tools on mobile', '/projects/fire-nepal-tools.jpg', '', true, 30),
  ('Return planner', 'FIRE Nepal return planner', '/projects/fire-nepal-return.jpg', '', true, 40),
  ('Brand', 'FIRE Nepal brand banner', '/projects/fire-nepal-banner.jpg', '', true, 50)
) as seed(title, description, image_url, link_url, visible, sort_order)
where not exists (select 1 from public.portfolio_product_cards limit 1);

insert into public.portfolio_product_features (title, description, visible, sort_order)
select * from (values
  ('Dashboard', '', true, 10),
  ('FIRE Calculator', '', true, 20),
  ('Portfolio', '', true, 30),
  ('Cashflow', '', true, 40),
  ('Savings', '', true, 50),
  ('FIRE Biz', '', true, 60),
  ('FIRE AI', '', true, 70),
  ('Retirement Analysis', '', true, 80)
) as seed(title, description, visible, sort_order)
where not exists (select 1 from public.portfolio_product_features limit 1);
