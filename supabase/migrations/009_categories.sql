create table public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  color text not null default 'violet',
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

alter table public.categories enable row level security;

create policy "categories_select" on public.categories
  for select using (true);
create policy "categories_insert" on public.categories
  for insert with check (public.is_admin_or_owner());
create policy "categories_update" on public.categories
  for update using (public.is_admin_or_owner());
create policy "categories_delete" on public.categories
  for delete using (public.is_admin_or_owner());

-- Deleting a category leaves its subjects uncategorized
alter table public.subjects
  add column category_id uuid references public.categories(id) on delete set null;

create index subjects_category_id_idx on public.subjects (category_id);
