-- A third lesson status, "soon": students see the lesson listed but cannot open it.
-- Its questions stay hidden (questions_select still requires 'published').

alter table public.lessons drop constraint if exists lessons_status_check;
alter table public.lessons
  add constraint lessons_status_check check (status in ('draft', 'published', 'soon'));

drop policy if exists "lessons_select" on public.lessons;
create policy "lessons_select" on public.lessons
  for select using (
    status in ('published', 'soon')
    or public.is_admin_or_owner()
  );
