-- Buddy (shared) subscriptions: one payer covers 1 or 2 friends.
-- The payer's own access comes from their row in public.subscriptions (same as solo).
-- Each buddy gets a row here; has_active_subscription checks both tables.

create table if not exists public.buddy_subscriptions (
  id uuid primary key default gen_random_uuid(),
  subscription_user_id uuid not null references public.profiles(id) on delete cascade,
  buddy_email text not null,
  buddy_user_id uuid references public.profiles(id) on delete set null,
  plan text not null check (plan in ('duo', 'trio')),
  created_at timestamptz not null default now()
);

create index if not exists buddy_subs_sub_user on public.buddy_subscriptions(subscription_user_id);
create index if not exists buddy_subs_buddy_user on public.buddy_subscriptions(buddy_user_id);
create index if not exists buddy_subs_buddy_email on public.buddy_subscriptions(buddy_email);

alter table public.buddy_subscriptions enable row level security;

drop policy if exists "buddy_subs_select" on public.buddy_subscriptions;
create policy "buddy_subs_select" on public.buddy_subscriptions
  for select using (
    subscription_user_id = auth.uid()
    or buddy_user_id = auth.uid()
    or public.is_admin_or_owner()
  );

-- When a new user signs up whose email matches a buddy row, link them automatically.
create or replace function public.link_buddy_on_profile_insert()
returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  update public.buddy_subscriptions
  set buddy_user_id = new.id
  where lower(buddy_email) = lower(
    (select email from auth.users where id = new.id)
  )
  and buddy_user_id is null;
  return new;
end;
$$;

drop trigger if exists trg_link_buddy on public.profiles;
create trigger trg_link_buddy
  after insert on public.profiles
  for each row execute function public.link_buddy_on_profile_insert();

-- Look up a user id by email (used by the webhook to link buddies at checkout time).
-- Only callable by service_role (the admin client in the webhook).
create or replace function public.find_user_id_by_email(p_email text)
returns uuid
language sql stable security definer set search_path = '' as $$
  select id from auth.users where lower(email) = lower(p_email) limit 1;
$$;

revoke execute on function public.find_user_id_by_email(text) from public, anon, authenticated;

-- Check whether an email is registered (safe for authenticated users — returns boolean only).
create or replace function public.email_exists(p_email text)
returns boolean
language sql stable security definer set search_path = '' as $$
  select exists (select 1 from auth.users where lower(email) = lower(p_email));
$$;

revoke execute on function public.email_exists(text) from public, anon;
grant execute on function public.email_exists(text) to authenticated;

-- Update has_active_subscription to also grant access to buddies.
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
  )
  or exists (
    select 1
    from public.buddy_subscriptions b
    join public.subscriptions s on s.user_id = b.subscription_user_id
    where b.buddy_user_id = p_user_id
      and (
        s.status in ('active', 'on_trial', 'past_due')
        or (s.status = 'cancelled' and s.ends_at > now())
      )
  );
$$;
