-- Create storage bucket for question images
insert into storage.buckets (id, name, public) values ('images', 'images', true);

-- Anyone can read images (public bucket)
create policy "images_select" on storage.objects
  for select using (bucket_id = 'images');

-- Admins/owners can upload images
create policy "images_insert" on storage.objects
  for insert with check (
    bucket_id = 'images'
    and public.is_admin_or_owner()
  );

-- Admins/owners can update images
create policy "images_update" on storage.objects
  for update using (
    bucket_id = 'images'
    and public.is_admin_or_owner()
  );

-- Admins/owners can delete images
create policy "images_delete" on storage.objects
  for delete using (
    bucket_id = 'images'
    and public.is_admin_or_owner()
  );
