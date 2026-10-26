-- Monthly subscriptions through Lemon Squeezy. The webhook (server, service role key)
-- is the only writer; students can read their own row.

create table if not exists public.subscriptions (
  user_id uuid primary key references public.profiles(id) on delete cascade,
  ls_subscription_id text unique not null,
  ls_customer_id text,
  status text not null,
  renews_at timestamptz,
  ends_at timestamptz,
  customer_portal_url text,
  update_payment_url text,
  updated_at timestamptz not null default now()
);

alter table public.subscriptions enable row level security;

drop policy if exists "subscriptions_select_own" on public.subscriptions;
create policy "subscriptions_select_own" on public.subscriptions
  for select using (user_id = auth.uid() or public.is_admin_or_owner());

-- Active means paid up, or cancelled but still inside the period already paid for.
create or replace function public.has_active_subscription(p_user_id uuid default auth.uid())
returns boolean
language sql stable security definer set search_path = '' as $$
  select exists (
    select 1 from public.subscriptions s
    where s.user_id = p_user_id
      and (
        s.status in ('active', 'on_trial', 'past_due')
        or (s.status = 'cancelled' and s.ends_at > now())
      )
  );
$$;

-- Free students get the first two published lessons of each subject; subscribers
-- and admins get every lesson.
create or replace function public.can_access_lesson(p_lesson_id uuid)
returns boolean
language sql stable security definer set search_path = '' as $$
  select
    public.is_admin_or_owner()
    or public.has_active_subscription(auth.uid())
    or coalesce((
      select ranked.position <= 2
      from (
        select l.id, row_number() over (partition by l.subject_id order by l.sort_order, l.created_at) as position
        from public.lessons l
        where l.status = 'published'
          and l.subject_id = (select subject_id from public.lessons where id = p_lesson_id)
      ) ranked
      where ranked.id = p_lesson_id
    ), false);
$$;

grant execute on function public.has_active_subscription(uuid) to authenticated;
grant execute on function public.can_access_lesson(uuid) to authenticated;
