-- Public counters for the landing page: registered students and site visits.

create table if not exists public.site_counters (
  key text primary key,
  value bigint not null default 0
);

alter table public.site_counters enable row level security;
-- No policies: the table is only reached through the functions below.

insert into public.site_counters (key, value) values ('visits', 0) on conflict (key) do nothing;

-- Counts one visit. The landing page calls it at most once per browser per day.
create or replace function public.record_visit()
returns void
language sql volatile security definer set search_path = '' as $$
  update public.site_counters set value = value + 1 where key = 'visits';
$$;

create or replace function public.get_public_stats()
returns json
language sql stable security definer set search_path = '' as $$
  select json_build_object(
    'students', (select count(*) from public.profiles where role = 'student'),
    'visits', (select value from public.site_counters where key = 'visits')
  );
$$;

grant execute on function public.record_visit() to anon, authenticated;
grant execute on function public.get_public_stats() to anon, authenticated;
