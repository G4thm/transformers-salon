create extension if not exists "pgcrypto";

create type public.app_role as enum ('admin', 'staff', 'customer');
create type public.appointment_status as enum ('pending', 'confirmed', 'completed', 'cancelled');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  phone text,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  role public.app_role not null default 'customer',
  created_at timestamptz not null default now(),
  unique (user_id, role)
);

create table public.service_categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  display_order integer not null default 0,
  enabled boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint service_categories_slug_format check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$')
);

create table public.services (
  id uuid primary key default gen_random_uuid(),
  category_id uuid not null references public.service_categories(id) on delete restrict,
  name text not null,
  slug text not null unique,
  description text,
  image_path text,
  enabled boolean not null default true,
  display_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint services_slug_format check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$')
);

create table public.offers (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  image_path text,
  expires_at date,
  enabled boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.gallery (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  alt_text text,
  image_path text not null,
  category text,
  enabled boolean not null default true,
  display_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.appointments (
  id uuid primary key default gen_random_uuid(),
  customer_name text not null,
  phone text not null,
  service_id uuid references public.services(id) on delete set null,
  service_name text not null,
  appointment_date date not null,
  appointment_time time not null,
  notes text,
  status public.appointment_status not null default 'pending',
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint appointments_phone_length check (length(phone) >= 7)
);

create table public.settings (
  key text primary key,
  value jsonb not null default '{}'::jsonb,
  updated_by uuid references auth.users(id) on delete set null,
  updated_at timestamptz not null default now()
);

create table public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid references auth.users(id) on delete set null,
  action text not null,
  table_name text not null,
  record_id uuid,
  before_data jsonb,
  after_data jsonb,
  created_at timestamptz not null default now()
);

create index roles_user_id_idx on public.roles(user_id);
create index services_category_id_idx on public.services(category_id);
create index services_enabled_idx on public.services(enabled) where enabled;
create index offers_enabled_expires_idx on public.offers(enabled, expires_at);
create index gallery_enabled_order_idx on public.gallery(enabled, display_order);
create index appointments_status_date_idx on public.appointments(status, appointment_date);
create index appointments_phone_idx on public.appointments(phone);
create index audit_logs_actor_idx on public.audit_logs(actor_id);
create index audit_logs_table_idx on public.audit_logs(table_name, created_at desc);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_updated_at before update on public.profiles for each row execute function public.set_updated_at();
create trigger service_categories_updated_at before update on public.service_categories for each row execute function public.set_updated_at();
create trigger services_updated_at before update on public.services for each row execute function public.set_updated_at();
create trigger offers_updated_at before update on public.offers for each row execute function public.set_updated_at();
create trigger gallery_updated_at before update on public.gallery for each row execute function public.set_updated_at();
create trigger appointments_updated_at before update on public.appointments for each row execute function public.set_updated_at();

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'full_name', new.email));

  insert into public.roles (user_id, role)
  values (new.id, 'customer')
  on conflict do nothing;

  return new;
end;
$$;

create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

create or replace function public.has_role(required_role public.app_role)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.roles
    where user_id = auth.uid()
      and role = required_role
  );
$$;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select public.has_role('admin'::public.app_role);
$$;

create or replace function public.audit_row_change()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.audit_logs(actor_id, action, table_name, record_id, before_data, after_data)
  values (
    auth.uid(),
    tg_op,
    tg_table_name,
    coalesce(new.id, old.id),
    case when tg_op in ('UPDATE', 'DELETE') then to_jsonb(old) else null end,
    case when tg_op in ('INSERT', 'UPDATE') then to_jsonb(new) else null end
  );
  return coalesce(new, old);
end;
$$;

create trigger audit_services after insert or update or delete on public.services for each row execute function public.audit_row_change();
create trigger audit_offers after insert or update or delete on public.offers for each row execute function public.audit_row_change();
create trigger audit_gallery after insert or update or delete on public.gallery for each row execute function public.audit_row_change();
create trigger audit_appointments after insert or update or delete on public.appointments for each row execute function public.audit_row_change();

alter table public.profiles enable row level security;
alter table public.roles enable row level security;
alter table public.service_categories enable row level security;
alter table public.services enable row level security;
alter table public.offers enable row level security;
alter table public.gallery enable row level security;
alter table public.appointments enable row level security;
alter table public.settings enable row level security;
alter table public.audit_logs enable row level security;

create policy "profiles read own or admin" on public.profiles for select using (id = auth.uid() or public.is_admin());
create policy "profiles update own or admin" on public.profiles for update using (id = auth.uid() or public.is_admin()) with check (id = auth.uid() or public.is_admin());

create policy "roles admin read" on public.roles for select using (public.is_admin());
create policy "roles admin write" on public.roles for all using (public.is_admin()) with check (public.is_admin());

create policy "public read enabled categories" on public.service_categories for select using (enabled = true or public.is_admin());
create policy "admin manage categories" on public.service_categories for all using (public.is_admin()) with check (public.is_admin());

create policy "public read enabled services" on public.services for select using (enabled = true or public.is_admin());
create policy "admin manage services" on public.services for all using (public.is_admin()) with check (public.is_admin());

create policy "public read active offers" on public.offers for select using ((enabled = true and (expires_at is null or expires_at >= current_date)) or public.is_admin());
create policy "admin manage offers" on public.offers for all using (public.is_admin()) with check (public.is_admin());

create policy "public read enabled gallery" on public.gallery for select using (enabled = true or public.is_admin());
create policy "admin manage gallery" on public.gallery for all using (public.is_admin()) with check (public.is_admin());

create policy "public create appointments" on public.appointments for insert with check (true);
create policy "users read own appointments" on public.appointments for select using (created_by = auth.uid() or public.is_admin());
create policy "admin manage appointments" on public.appointments for all using (public.is_admin()) with check (public.is_admin());

create policy "public read settings" on public.settings for select using (true);
create policy "admin manage settings" on public.settings for all using (public.is_admin()) with check (public.is_admin());

create policy "admin read audit logs" on public.audit_logs for select using (public.is_admin());

insert into public.service_categories (name, slug, description, display_order)
values
  ('Men', 'men', 'Sharp grooming, clean detailing, and confident finishing.', 1),
  ('Women', 'women', 'Hair artistry, skin rituals, bridal glow, and occasion styling.', 2)
on conflict (slug) do nothing;

insert into public.services (category_id, name, slug, description, display_order)
select c.id, v.name, v.slug, v.description, v.display_order
from public.service_categories c
join (
  values
    ('men', 'Haircuts', 'men-haircuts', 'Precision cuts shaped for face, texture, and daily styling.', 1),
    ('men', 'Beard Styling', 'men-beard-styling', 'Line work, trimming, shaping, and polished beard finishes.', 2),
    ('men', 'Hair Coloring', 'men-hair-coloring', 'Global color, touch-ups, and tone-led transformations.', 3),
    ('men', 'Hair Spa', 'men-hair-spa', 'Repair-focused rituals for scalp comfort and stronger-looking hair.', 4),
    ('men', 'Facial', 'men-facial', 'Skin reset experiences for freshness, texture, and glow.', 5),
    ('women', 'Haircuts', 'women-haircuts', 'Classic and creative shapes with salon-finished movement.', 1),
    ('women', 'Hair Styling', 'women-hair-styling', 'Blowouts, event styling, waves, and polished occasion looks.', 2),
    ('women', 'Hair Coloring', 'women-hair-coloring', 'Gloss, root touch-up, global color, and dimensional color work.', 3),
    ('women', 'Keratin', 'women-keratin', 'Smooth, refined hair rituals designed for lasting manageability.', 4),
    ('women', 'Smoothening', 'women-smoothening', 'Frizz-control transformations with a luxury finishing experience.', 5),
    ('women', 'Makeup', 'women-makeup', 'Soft glam, party makeup, and camera-ready beauty artistry.', 6),
    ('women', 'Bridal Makeup', 'women-bridal-makeup', 'Bridal beauty direction from skin prep to final veil-ready detail.', 7),
    ('women', 'Facial', 'women-facial', 'Glow rituals for hydration, clarity, and a fresh complexion.', 8)
) as v(category_slug, name, slug, description, display_order)
on c.slug = v.category_slug
on conflict (slug) do nothing;

insert into public.settings (key, value)
values (
  'contact',
  jsonb_build_object(
    'phonePrimary', '8825700807',
    'phoneSecondary', '9600450807',
    'whatsapp', '8825700807',
    'email', 'transformerssalon777@gmail.com',
    'instagram', 'transformers_unisex_salon',
    'address', 'No 5, Iyyanar Kovil Street, Pillaithottam, Puducherry - 605013',
    'businessHours', jsonb_build_array(
      jsonb_build_object('day', 'Monday - Saturday', 'hours', '9:00 AM - 9:00 PM'),
      jsonb_build_object('day', 'Sunday', 'hours', '10:00 AM - 7:00 PM')
    )
  )
)
on conflict (key) do nothing;

insert into storage.buckets (id, name, public)
values
  ('brand-assets', 'brand-assets', true),
  ('service-images', 'service-images', true),
  ('offer-images', 'offer-images', true),
  ('gallery-images', 'gallery-images', true)
on conflict (id) do nothing;

create policy "public read salon storage"
on storage.objects for select
using (bucket_id in ('brand-assets', 'service-images', 'offer-images', 'gallery-images'));

create policy "admin manage salon storage"
on storage.objects for all
using (bucket_id in ('brand-assets', 'service-images', 'offer-images', 'gallery-images') and public.is_admin())
with check (bucket_id in ('brand-assets', 'service-images', 'offer-images', 'gallery-images') and public.is_admin());
