create extension if not exists pgcrypto;

create type public.user_role as enum ('CUSTOMER', 'ADMIN');
create type public.inventory_type as enum ('INDIVIDUAL', 'QUANTITY');
create type public.bird_status as enum ('AVAILABLE', 'RESERVED', 'SOLD', 'UNAVAILABLE');
create type public.payment_status as enum ('PENDING', 'PAID', 'FAILED', 'EXPIRED', 'CANCELLED', 'REFUNDED');
create type public.order_status as enum ('WAITING_PAYMENT', 'PAID', 'PROCESSING', 'READY_TO_SHIP', 'SHIPPED', 'DELIVERED', 'COMPLETED', 'CANCELLED');
create type public.shipping_status as enum ('PENDING', 'READY', 'SHIPPED', 'DELIVERED', 'CANCELLED');
create type public.content_status as enum ('DRAFT', 'PUBLISHED', 'ARCHIVED');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  email text,
  phone text,
  role public.user_role not null default 'CUSTOMER',
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.bird_categories (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  slug text not null unique,
  description text,
  image_url text,
  active boolean not null default true,
  sort_order integer not null default 0 check (sort_order >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.birds (
  id uuid primary key default gen_random_uuid(),
  category_id uuid not null references public.bird_categories(id) on delete restrict,
  name text not null,
  slug text not null unique,
  description text,
  personality text,
  age_value integer check (age_value is null or age_value >= 0),
  age_unit text check (age_unit in ('DAYS', 'WEEKS', 'MONTHS', 'YEARS')),
  gender text not null default 'UNKNOWN' check (gender in ('MALE', 'FEMALE', 'UNKNOWN')),
  color text,
  mutation text,
  price bigint not null check (price >= 0),
  inventory_type public.inventory_type not null,
  stock integer not null default 0 check (stock >= 0),
  status public.bird_status not null default 'AVAILABLE',
  tame_status text,
  ring_code text unique,
  featured boolean not null default false,
  legal_note text,
  archived_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint individual_stock check (inventory_type <> 'INDIVIDUAL' or stock between 0 and 1)
);

create table public.bird_images (
  id uuid primary key default gen_random_uuid(),
  bird_id uuid not null references public.birds(id) on delete cascade,
  image_url text not null,
  alt_text text not null,
  sort_order integer not null default 0 check (sort_order >= 0),
  created_at timestamptz not null default now()
);

create table public.addresses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  receiver_name text not null,
  phone text not null,
  province text not null,
  city text not null,
  district text not null,
  postal_code text not null,
  address text not null,
  notes text,
  is_default boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.shipping_zones (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  province text not null,
  city text,
  area text,
  shipping_method text not null,
  price bigint not null check (price >= 0),
  active boolean not null default true,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.carts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.cart_items (
  id uuid primary key default gen_random_uuid(),
  cart_id uuid not null references public.carts(id) on delete cascade,
  bird_id uuid not null references public.birds(id) on delete cascade,
  quantity integer not null check (quantity > 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (cart_id, bird_id)
);

create table public.orders (
  id uuid primary key default gen_random_uuid(),
  order_number text not null unique,
  user_id uuid not null references auth.users(id) on delete restrict,
  address_snapshot jsonb not null,
  customer_snapshot jsonb not null,
  subtotal bigint not null check (subtotal >= 0),
  shipping_cost bigint not null check (shipping_cost >= 0),
  total bigint not null check (total = subtotal + shipping_cost),
  payment_status public.payment_status not null default 'PENDING',
  order_status public.order_status not null default 'WAITING_PAYMENT',
  shipping_status public.shipping_status not null default 'PENDING',
  shipping_zone_id uuid references public.shipping_zones(id) on delete set null,
  midtrans_order_id text unique,
  notes text,
  inventory_released_at timestamptz,
  inventory_finalized_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  bird_id uuid references public.birds(id) on delete set null,
  bird_name_snapshot text not null,
  category_snapshot text not null,
  price_snapshot bigint not null check (price_snapshot >= 0),
  quantity integer not null check (quantity > 0),
  created_at timestamptz not null default now()
);

create table public.payments (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  provider text not null default 'MIDTRANS' check (provider = 'MIDTRANS'),
  transaction_id text,
  transaction_status text,
  payment_type text,
  gross_amount numeric(14,2) not null check (gross_amount >= 0),
  raw_response jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (provider, transaction_id)
);

create table public.shipments (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null unique references public.orders(id) on delete cascade,
  method text not null,
  tracking_number text,
  status public.shipping_status not null default 'PENDING',
  shipped_at timestamptz,
  delivered_at timestamptz,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.articles (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  excerpt text,
  content text not null,
  cover_image text,
  status public.content_status not null default 'DRAFT',
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.faqs (
  id uuid primary key default gen_random_uuid(),
  question text not null,
  answer text not null,
  active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.site_settings (
  id uuid primary key default gen_random_uuid(),
  key text not null unique,
  value jsonb not null,
  public boolean not null default false,
  updated_at timestamptz not null default now()
);

create index birds_category_id_idx on public.birds(category_id);
create index birds_status_idx on public.birds(status) where archived_at is null;
create index orders_user_id_idx on public.orders(user_id, created_at desc);
create index orders_status_idx on public.orders(order_status, created_at desc);
create index addresses_user_id_idx on public.addresses(user_id);
create index shipping_zones_destination_idx on public.shipping_zones(province, city) where active;

create function public.set_updated_at() returns trigger language plpgsql set search_path = '' as $$
begin new.updated_at = now(); return new; end;
$$;

do $$ declare table_name text; begin
  foreach table_name in array array['profiles','bird_categories','birds','addresses','shipping_zones','carts','cart_items','orders','payments','shipments','articles','faqs','site_settings']
  loop execute format('create trigger set_%I_updated_at before update on public.%I for each row execute function public.set_updated_at()', table_name, table_name); end loop;
end $$;

create function public.handle_new_user() returns trigger language plpgsql security definer set search_path = '' as $$
begin insert into public.profiles (id, email, full_name) values (new.id, new.email, new.raw_user_meta_data ->> 'full_name'); return new; end;
$$;
create trigger on_auth_user_created after insert on auth.users for each row execute function public.handle_new_user();

create function public.is_admin() returns boolean language sql security definer stable set search_path = '' as $$
  select exists(select 1 from public.profiles where id = (select auth.uid()) and role = 'ADMIN');
$$;
revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to anon, authenticated;

create function public.reserve_bird_inventory(p_bird_id uuid, p_quantity integer) returns boolean language plpgsql security definer set search_path = '' as $$
declare affected integer;
begin
  if p_quantity <= 0 then return false; end if;
  update public.birds set
    stock = case when inventory_type = 'QUANTITY' then stock - p_quantity else stock end,
    status = case when inventory_type = 'INDIVIDUAL' then 'RESERVED'::public.bird_status when stock - p_quantity = 0 then 'UNAVAILABLE'::public.bird_status else status end
  where id = p_bird_id and archived_at is null and status = 'AVAILABLE'
    and ((inventory_type = 'INDIVIDUAL' and p_quantity = 1 and stock = 1) or (inventory_type = 'QUANTITY' and stock >= p_quantity));
  get diagnostics affected = row_count;
  return affected = 1;
end;
$$;
revoke all on function public.reserve_bird_inventory(uuid, integer) from public, anon, authenticated;
grant execute on function public.reserve_bird_inventory(uuid, integer) to service_role;

create function public.create_checkout_order(
  p_items jsonb,
  p_shipping_zone_id uuid,
  p_customer_snapshot jsonb,
  p_address_snapshot jsonb,
  p_notes text default null
) returns table (created_order_id uuid, created_order_number text, created_subtotal bigint, created_shipping_cost bigint, created_total bigint)
language plpgsql security definer set search_path = '' as $$
declare
  v_user_id uuid := (select auth.uid());
  v_order_id uuid := gen_random_uuid();
  v_order_number text := 'PH-' || to_char(now(), 'YYYYMMDD') || '-' || upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 8));
  v_subtotal bigint := 0;
  v_shipping bigint;
  v_item jsonb;
  v_bird public.birds%rowtype;
  v_category_name text;
  v_quantity integer;
begin
  if v_user_id is null then raise exception 'AUTH_REQUIRED'; end if;
  if jsonb_typeof(p_items) <> 'array' or jsonb_array_length(p_items) = 0 then raise exception 'EMPTY_CART'; end if;
  select price into v_shipping from public.shipping_zones where id = p_shipping_zone_id and active = true;
  if v_shipping is null then raise exception 'SHIPPING_UNAVAILABLE'; end if;

  for v_item in select value from jsonb_array_elements(p_items)
  loop
    v_quantity := (v_item ->> 'quantity')::integer;
    if v_quantity <= 0 then raise exception 'INVALID_QUANTITY'; end if;
    select * into v_bird from public.birds where id = (v_item ->> 'birdId')::uuid and archived_at is null for update;
    if not found or v_bird.status <> 'AVAILABLE' then raise exception 'BIRD_UNAVAILABLE'; end if;
    if v_bird.inventory_type = 'INDIVIDUAL' and (v_quantity <> 1 or v_bird.stock <> 1) then raise exception 'INDIVIDUAL_QUANTITY_INVALID'; end if;
    if v_bird.inventory_type = 'QUANTITY' and v_bird.stock < v_quantity then raise exception 'INSUFFICIENT_STOCK'; end if;
    v_subtotal := v_subtotal + (v_bird.price * v_quantity);
  end loop;

  insert into public.orders (id, order_number, user_id, address_snapshot, customer_snapshot, subtotal, shipping_cost, total, shipping_zone_id, notes, midtrans_order_id)
  values (v_order_id, v_order_number, v_user_id, p_address_snapshot, p_customer_snapshot, v_subtotal, v_shipping, v_subtotal + v_shipping, p_shipping_zone_id, p_notes, v_order_number);

  for v_item in select value from jsonb_array_elements(p_items)
  loop
    v_quantity := (v_item ->> 'quantity')::integer;
    select * into v_bird from public.birds where id = (v_item ->> 'birdId')::uuid for update;
    select name into v_category_name from public.bird_categories where id = v_bird.category_id;
    insert into public.order_items (order_id, bird_id, bird_name_snapshot, category_snapshot, price_snapshot, quantity)
    values (v_order_id, v_bird.id, v_bird.name, v_category_name, v_bird.price, v_quantity);
    update public.birds set
      stock = case when inventory_type = 'QUANTITY' then stock - v_quantity else stock end,
      status = case when inventory_type = 'INDIVIDUAL' then 'RESERVED'::public.bird_status when stock - v_quantity = 0 then 'UNAVAILABLE'::public.bird_status else status end
    where id = v_bird.id;
  end loop;

  return query select v_order_id, v_order_number, v_subtotal, v_shipping, v_subtotal + v_shipping;
end;
$$;
revoke all on function public.create_checkout_order(jsonb, uuid, jsonb, jsonb, text) from public, anon;
grant execute on function public.create_checkout_order(jsonb, uuid, jsonb, jsonb, text) to authenticated;

create function public.apply_midtrans_payment(p_order_id uuid, p_status public.payment_status)
returns void language plpgsql security definer set search_path = '' as $$
declare v_order public.orders%rowtype; v_item record;
begin
  select * into v_order from public.orders where id = p_order_id for update;
  if not found then raise exception 'ORDER_NOT_FOUND'; end if;
  if p_status = 'PAID' and v_order.payment_status <> 'PAID' then
    for v_item in select oi.quantity, b.id, b.inventory_type from public.order_items oi join public.birds b on b.id = oi.bird_id where oi.order_id = p_order_id
    loop
      if v_item.inventory_type = 'INDIVIDUAL' then update public.birds set status = 'SOLD' where id = v_item.id and status = 'RESERVED'; end if;
    end loop;
    update public.orders set payment_status = 'PAID', order_status = 'PAID', inventory_finalized_at = coalesce(inventory_finalized_at, now()) where id = p_order_id;
  elsif p_status in ('FAILED','EXPIRED','CANCELLED') and v_order.payment_status <> 'PAID' and v_order.inventory_released_at is null then
    for v_item in select oi.quantity, b.id, b.inventory_type from public.order_items oi join public.birds b on b.id = oi.bird_id where oi.order_id = p_order_id
    loop
      if v_item.inventory_type = 'INDIVIDUAL' then
        update public.birds set status = 'AVAILABLE' where id = v_item.id and status = 'RESERVED';
      else
        update public.birds set stock = stock + v_item.quantity, status = case when status = 'UNAVAILABLE' then 'AVAILABLE' else status end where id = v_item.id;
      end if;
    end loop;
    update public.orders set payment_status = p_status, order_status = 'CANCELLED', inventory_released_at = now() where id = p_order_id;
  elsif p_status = 'PENDING' and v_order.payment_status <> 'PAID' then
    update public.orders set payment_status = 'PENDING' where id = p_order_id;
  end if;
end;
$$;
revoke all on function public.apply_midtrans_payment(uuid, public.payment_status) from public, anon, authenticated;
grant execute on function public.apply_midtrans_payment(uuid, public.payment_status) to service_role;

alter table public.profiles enable row level security;
alter table public.bird_categories enable row level security;
alter table public.birds enable row level security;
alter table public.bird_images enable row level security;
alter table public.addresses enable row level security;
alter table public.shipping_zones enable row level security;
alter table public.carts enable row level security;
alter table public.cart_items enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.payments enable row level security;
alter table public.shipments enable row level security;
alter table public.articles enable row level security;
alter table public.faqs enable row level security;
alter table public.site_settings enable row level security;

revoke all on all tables in schema public from anon, authenticated;
grant select on public.bird_categories, public.birds, public.bird_images, public.shipping_zones, public.articles, public.faqs, public.site_settings to anon, authenticated;
grant select on public.profiles to authenticated;
grant update (full_name, phone, avatar_url) on public.profiles to authenticated;
grant select, insert, update, delete on public.addresses, public.carts, public.cart_items to authenticated;
grant select on public.orders, public.order_items, public.payments, public.shipments to authenticated;
grant all on all tables in schema public to service_role;

create policy categories_public_read on public.bird_categories for select to anon, authenticated using (active or (select public.is_admin()));
create policy birds_public_read on public.birds for select to anon, authenticated using ((archived_at is null and status <> 'UNAVAILABLE') or (select public.is_admin()));
create policy bird_images_public_read on public.bird_images for select to anon, authenticated using (exists(select 1 from public.birds b where b.id = bird_id and b.archived_at is null));
create policy shipping_zones_public_read on public.shipping_zones for select to anon, authenticated using (active or (select public.is_admin()));
create policy articles_public_read on public.articles for select to anon, authenticated using ((status = 'PUBLISHED' and published_at <= now()) or (select public.is_admin()));
create policy faqs_public_read on public.faqs for select to anon, authenticated using (active or (select public.is_admin()));
create policy settings_public_read on public.site_settings for select to anon, authenticated using (public or (select public.is_admin()));

create policy profiles_own_read on public.profiles for select to authenticated using ((select auth.uid()) = id or (select public.is_admin()));
create policy profiles_own_update on public.profiles for update to authenticated using ((select auth.uid()) = id) with check ((select auth.uid()) = id);
create policy addresses_own_all on public.addresses for all to authenticated using ((select auth.uid()) = user_id or (select public.is_admin())) with check ((select auth.uid()) = user_id or (select public.is_admin()));
create policy carts_own_all on public.carts for all to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy cart_items_own_all on public.cart_items for all to authenticated using (exists(select 1 from public.carts c where c.id = cart_id and c.user_id = (select auth.uid()))) with check (exists(select 1 from public.carts c where c.id = cart_id and c.user_id = (select auth.uid())));
create policy orders_own_read on public.orders for select to authenticated using ((select auth.uid()) = user_id or (select public.is_admin()));
create policy order_items_own_read on public.order_items for select to authenticated using (exists(select 1 from public.orders o where o.id = order_id and (o.user_id = (select auth.uid()) or (select public.is_admin()))));
create policy payments_own_read on public.payments for select to authenticated using (exists(select 1 from public.orders o where o.id = order_id and (o.user_id = (select auth.uid()) or (select public.is_admin()))));
create policy shipments_own_read on public.shipments for select to authenticated using (exists(select 1 from public.orders o where o.id = order_id and (o.user_id = (select auth.uid()) or (select public.is_admin()))));

insert into storage.buckets (id, name, public) values ('bird-images', 'bird-images', true) on conflict (id) do nothing;
create policy bird_images_storage_public_read on storage.objects for select to anon, authenticated using (bucket_id = 'bird-images');
create policy bird_images_storage_admin_insert on storage.objects for insert to authenticated with check (bucket_id = 'bird-images' and (select public.is_admin()));
create policy bird_images_storage_admin_update on storage.objects for update to authenticated using (bucket_id = 'bird-images' and (select public.is_admin())) with check (bucket_id = 'bird-images' and (select public.is_admin()));
create policy bird_images_storage_admin_delete on storage.objects for delete to authenticated using (bucket_id = 'bird-images' and (select public.is_admin()));
