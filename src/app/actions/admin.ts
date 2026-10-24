'use server';

import { createClient } from '@/lib/supabase/server';
import { normalizeArabic } from '@/lib/arabic';
import { revalidatePath } from 'next/cache';

async function requireAdmin() {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) throw new Error('غير مسجل الدخول');

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', session.user.id)
    .single();

  if (profile?.role !== 'admin' && profile?.role !== 'owner') {
    throw new Error('غير مصرح');
  }

  return { supabase, userId: session.user.id, role: profile.role };
}

// =================== SUBJECTS ===================

export async function createSubject(data: {
  name: string;
  description?: string;
  status?: string;
  cover_image?: string;
}) {
  const { supabase, userId } = await requireAdmin();

  const { data: subject, error } = await supabase
    .from('subjects')
    .insert({
      name: data.name,
      name_normalized: normalizeArabic(data.name),
      description: data.description ?? null,
      cover_image: data.cover_image ?? null,
      status: (data.status as 'draft' | 'published') ?? 'draft',
      created_by: userId,
      updated_by: userId,
    })
    .select('id')
    .single();

  if (error) throw new Error('فشل في إنشاء المادة');
  revalidatePath('/admin');
  return subject;
}

export async function updateSubject(
  id: string,
  data: { name?: string; description?: string; status?: string; cover_image?: string | null },
) {
  const { supabase, userId } = await requireAdmin();

  const updates: Record<string, any> = { updated_by: userId };
  if (data.name !== undefined) {
    updates.name = data.name;
    updates.name_normalized = normalizeArabic(data.name);
  }
  if (data.description !== undefined) updates.description = data.description;
  if (data.status !== undefined) updates.status = data.status;
  if (data.cover_image !== undefined) updates.cover_image = data.cover_image;

  const { error } = await supabase.from('subjects').update(updates).eq('id', id);
  if (error) throw new Error('فشل في تحديث المادة');
  revalidatePath('/admin');
}

export async function deleteSubject(id: string) {
  const { supabase, role } = await requireAdmin();
  if (role !== 'owner') throw new Error('فقط المالك يمكنه حذف المواد');

  const { error } = await supabase.from('subjects').delete().eq('id', id);
  if (error) throw new Error('فشل في حذف المادة');
  revalidatePath('/admin');
}

// =================== LESSONS ===================

export async function createLesson(subjectId: string, data: { title: string; status?: string }) {
  const { supabase, userId } = await requireAdmin();

  const { data: maxOrder } = await supabase
    .from('lessons')
    .select('sort_order')
    .eq('subject_id', subjectId)
    .order('sort_order', { ascending: false })
    .limit(1)
    .maybeSingle();

  const { data: lesson, error } = await supabase
    .from('lessons')
    .insert({
      subject_id: subjectId,
      title: data.title,
      sort_order: (maxOrder?.sort_order ?? 0) + 1,
      status: (data.status as 'draft' | 'published') ?? 'draft',
      created_by: userId,
      updated_by: userId,
    })
    .select('id')
    .single();

  if (error) throw new Error('فشل في إنشاء الدرس');
  revalidatePath(`/admin/subjects/${subjectId}`);
  return lesson;
}

export async function updateLesson(
  id: string,
  data: { title?: string; status?: string; sort_order?: number },
) {
  const { supabase, userId } = await requireAdmin();

  const updates: Record<string, any> = { updated_by: userId };
  if (data.title !== undefined) updates.title = data.title;
  if (data.status !== undefined) updates.status = data.status;
  if (data.sort_order !== undefined) updates.sort_order = data.sort_order;

  const { error } = await supabase.from('lessons').update(updates).eq('id', id);
  if (error) throw new Error('فشل في تحديث الدرس');
  revalidatePath('/admin');
}

export async function deleteLesson(id: string) {
  const { supabase } = await requireAdmin();
  const { error } = await supabase.from('lessons').delete().eq('id', id);
  if (error) throw new Error('فشل في حذف الدرس');
  revalidatePath('/admin');
}

export async function reorderLessons(subjectId: string, orderedIds: string[]) {
  const { supabase, userId } = await requireAdmin();

  await Promise.all(
    orderedIds.map((id, i) =>
      supabase
        .from('lessons')
        .update({ sort_order: i + 1, updated_by: userId })
        .eq('id', id),
    ),
  );
  revalidatePath(`/admin/subjects/${subjectId}`);
}

// =================== QUESTIONS ===================

export async function createQuestion(
  lessonId: string,
  data: { type: string; content: any; explanation?: string },
) {
  const { supabase, userId } = await requireAdmin();

  const { data: maxOrder } = await supabase
    .from('questions')
    .select('sort_order')
    .eq('lesson_id', lessonId)
    .order('sort_order', { ascending: false })
    .limit(1)
    .maybeSingle();

  const { data: question, error } = await supabase
    .from('questions')
    .insert({
      lesson_id: lessonId,
      type: data.type as 'mcq' | 'matching' | 'true_false',
      content: data.content,
      explanation: data.explanation ?? null,
      sort_order: (maxOrder?.sort_order ?? 0) + 1,
      created_by: userId,
      updated_by: userId,
    })
    .select('id')
    .single();

  if (error) throw new Error('فشل في إنشاء السؤال');
  revalidatePath('/admin');
  return question;
}

export async function updateQuestion(
  id: string,
  data: { type?: string; content?: any; explanation?: string; sort_order?: number },
) {
  const { supabase, userId } = await requireAdmin();

  const updates: Record<string, any> = { updated_by: userId };
  if (data.type !== undefined) updates.type = data.type;
  if (data.content !== undefined) updates.content = data.content;
  if (data.explanation !== undefined) updates.explanation = data.explanation;
  if (data.sort_order !== undefined) updates.sort_order = data.sort_order;

  const { error } = await supabase.from('questions').update(updates).eq('id', id);
  if (error) throw new Error('فشل في تحديث السؤال');
  revalidatePath('/admin');
}

export async function deleteQuestion(id: string) {
  const { supabase } = await requireAdmin();
  const { error } = await supabase.from('questions').delete().eq('id', id);
  if (error) throw new Error('فشل في حذف السؤال');
  revalidatePath('/admin');
}

// =================== IMAGE UPLOAD ===================

export async function uploadImage(formData: FormData): Promise<string> {
  const { supabase } = await requireAdmin();
  const file = formData.get('file') as File;
  if (!file) throw new Error('لم يتم تحديد ملف');

  const ext = file.name.split('.').pop() ?? 'webp';
  const fileName = `${crypto.randomUUID()}.${ext}`;
  const path = `questions/${fileName}`;

  const { error } = await supabase.storage.from('images').upload(path, file, {
    contentType: file.type,
    cacheControl: '31536000',
  });

  if (error) throw new Error('فشل في رفع الصورة');

  const { data: urlData } = supabase.storage.from('images').getPublicUrl(path);
  return urlData.publicUrl;
}

export async function deleteImage(url: string) {
  const { supabase } = await requireAdmin();
  const path = url.split('/images/')[1];
  if (path) {
    await supabase.storage.from('images').remove([path]);
  }
}

// =================== USER MANAGEMENT ===================

export async function getUsers() {
  const { supabase, role } = await requireAdmin();
  if (role !== 'owner') throw new Error('فقط المالك يمكنه إدارة المستخدمين');

  const { data } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false });

  return data ?? [];
}

export async function setUserRole(userId: string, newRole: 'admin' | 'student') {
  const { supabase, role, userId: myId } = await requireAdmin();
  if (role !== 'owner') throw new Error('فقط المالك يمكنه تغيير الأدوار');
  if (userId === myId) throw new Error('لا يمكنك تغيير دورك');

  // Prevent demoting last owner
  {
    const { data: target } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', userId)
      .single();

    if (target?.role === 'owner') {
      const { count } = await supabase
        .from('profiles')
        .select('id', { count: 'exact', head: true })
        .eq('role', 'owner');
      if ((count ?? 0) <= 1) throw new Error('لا يمكن إزالة آخر مالك');
    }
  }

  const { error } = await supabase
    .from('profiles')
    .update({ role: newRole })
    .eq('id', userId);

  if (error) throw new Error('فشل في تحديث الدور');
  revalidatePath('/admin/users');
}
