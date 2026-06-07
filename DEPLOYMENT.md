# Transformers Salon Deployment

## Folder Structure

- `src/app`: Next.js App Router pages, admin route, and server actions.
- `src/components`: reusable site shell, motion sections, service cards, booking form, and shadcn-style UI primitives.
- `src/data`: editable seed defaults used before Supabase content is connected.
- `src/lib/supabase`: typed browser/server clients.
- `supabase/schema.sql`: PostgreSQL schema, RLS, indexes, triggers, storage buckets, and seed rows.
- `public/brand`: imported salon fox/logo/marketing assets.

## Supabase Setup

1. Create a Supabase project.
2. Open SQL Editor and run `supabase/schema.sql`.
3. Create the first admin user in Supabase Auth.
4. Promote that user:

```sql
insert into public.roles (user_id, role)
values ('USER_UUID_FROM_AUTH', 'admin')
on conflict do nothing;
```

5. Upload service, offer, and gallery images to the configured storage buckets.

## Environment Variables

Create `.env.local` for local development and add the same values to Vercel:

```bash
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=YOUR_SUPABASE_PUBLISHABLE_OR_ANON_KEY
```

## Auth Flow

- Public visitors can view pages and submit appointment requests.
- `/login` uses Supabase Auth email/password.
- `/admin` is protected by middleware and checks `roles.role = 'admin'` before mutations.
- Admin actions revalidate public and dashboard routes after changes.

## Deploy To Vercel

1. Push this repository to GitHub.
2. Import the project in Vercel.
3. Set the environment variables above.
4. Deploy.
5. In Supabase Auth settings, add the Vercel production URL to allowed redirect URLs.

## Future Modules

The dashboard already reserves navigation/data boundaries for billing, invoice generation, customer management, loyalty rewards, inventory, staff attendance, and multi-branch support. Add each as its own table group, RLS policy set, and route under `src/app/admin`.

## Creating the initial admin user (seed)

Two safe options are provided to create/promote an admin user.

- Quick manual (recommended):

	1. Create a user in the Supabase Auth dashboard (email/password).
	2. Run the SQL in `supabase/seed-admin.sql` replacing `USER_UUID` with the user's id.

- Automated script (requires Supabase service role key):

	1. Set the following environment variables locally before running the script:

```bash
SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
SUPABASE_SERVICE_ROLE_KEY=YOUR_SUPABASE_SERVICE_ROLE_KEY
```

	2. Run the script:

```bash
node scripts/seed-admin.mjs
```

	3. The script will prompt for an email and password, create the user via the Supabase Admin API, and insert an `admin` row into `public.roles`.

Security note: the automated script requires the Supabase service role key (powerful secret). Run it only in a secure environment, remove or rotate the key after use, and avoid committing secrets to version control.
