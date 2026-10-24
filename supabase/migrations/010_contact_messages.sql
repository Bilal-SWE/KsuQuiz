create table public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 2 and 100),
  email text not null check (char_length(email) between 5 and 200),
  subject text not null default 'general' check (subject in ('general', 'support', 'billing', 'refund', 'other')),
  message text not null check (char_length(message) between 10 and 3000),
  user_id uuid references public.profiles(id) on delete set null,
  is_read boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.contact_messages enable row level security;

-- Anyone (including visitors) can send a message; user_id must be their own or empty
create policy "contact_insert" on public.contact_messages
  for insert with check (user_id is null or user_id = auth.uid());

create policy "contact_select" on public.contact_messages
  for select using (public.is_admin_or_owner());

create policy "contact_update" on public.contact_messages
  for update using (public.is_admin_or_owner());

create policy "contact_delete" on public.contact_messages
  for delete using (public.is_admin_or_owner());
