-- Admins delete students; owners also delete admins. Owners and yourself are never deletable.
-- Authored content is reassigned to the caller so the delete isn't blocked by FKs.
create or replace function public.admin_delete_user(p_user_id uuid)
returns void
language plpgsql security definer set search_path = '' as $$
declare
  caller_role text;
  target_role text;
begin
  select role into caller_role from public.profiles where id = auth.uid();
  select role into target_role from public.profiles where id = p_user_id;

  if caller_role is null or caller_role not in ('admin', 'owner') then
    raise exception 'غير مصرح';
  end if;
  if p_user_id = auth.uid() then
    raise exception 'لا يمكنك حذف حسابك';
  end if;
  if target_role is null then
    raise exception 'المستخدم غير موجود';
  end if;
  if target_role = 'owner' then
    raise exception 'لا يمكن حذف حساب المالك';
  end if;
  if target_role = 'admin' and caller_role <> 'owner' then
    raise exception 'فقط المالك يمكنه حذف المشرفين';
  end if;

  update public.subjects set created_by = auth.uid() where created_by = p_user_id;
  update public.subjects set updated_by = auth.uid() where updated_by = p_user_id;
  update public.lessons set created_by = auth.uid() where created_by = p_user_id;
  update public.lessons set updated_by = auth.uid() where updated_by = p_user_id;
  update public.questions set created_by = auth.uid() where created_by = p_user_id;
  update public.questions set updated_by = auth.uid() where updated_by = p_user_id;

  delete from auth.users where id = p_user_id;
end;
$$;

revoke execute on function public.admin_delete_user(uuid) from public, anon;
grant execute on function public.admin_delete_user(uuid) to authenticated;
