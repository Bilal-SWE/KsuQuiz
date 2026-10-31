-- Allow students to see 'soon' subjects (greyed out, not clickable)
drop policy if exists "subjects_select" on public.subjects;
create policy "subjects_select" on public.subjects
  for select using (
    status in ('published', 'soon') or public.is_admin_or_owner()
  );
