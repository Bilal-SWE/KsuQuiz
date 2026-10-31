'use server';

import { createClient } from '@/lib/supabase/server';
import { normalizeArabic } from '@/lib/arabic';
import { revalidatePath } from 'next/cache';

async function requireAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('غير مسجل الدخول');

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (profile?.role !== 'admin' && profile?.role !== 'owner') {
    throw new Error('غير مصرح');
  }

  return { supabase, userId: user.id, role: profile.role };
}

// =================== CONTACT MESSAGES ===================

export async function setContactMessageRead(id: string, isRead: boolean) {
  const { supabase } = await requireAdmin();
  const { error } = await supabase.from('contact_messages').update({ is_read: isRead }).eq('id', id);
  if (error) throw new Error('فشل في تحديث الرسالة');
}

export async function deleteContactMessage(id: string) {
  const { supabase } = await requireAdmin();
  const { error } = await supabase.from('contact_messages').delete().eq('id', id);
  if (error) throw new Error('فشل في حذف الرسالة');
  revalidatePath('/admin/messages');
}

// =================== CATEGORIES ===================

const CATEGORY_COLOR_KEYS = ['violet', 'sky', 'emerald', 'orange', 'amber', 'pink'];

export async function createCategory(data: { name: string; color: string }) {
  const { supabase } = await requireAdmin();
  const name = data.name.trim();
  if (!name) throw new Error('اسم التصنيف مطلوب');

  const { data: maxOrder } = await supabase
    .from('categories')
    .select('sort_order')
    .order('sort_order', { ascending: false })
    .limit(1)
    .maybeSingle();

  const { data: category, error } = await supabase
    .from('categories')
    .insert({
      name,
      color: CATEGORY_COLOR_KEYS.includes(data.color) ? data.color : 'violet',
      sort_order: (maxOrder?.sort_order ?? 0) + 1,
    })
    .select('id, name, color, sort_order')
    .single();

  if (error) throw new Error('فشل في إنشاء التصنيف');
  revalidatePath('/admin/categories');
  revalidatePath('/');
  return category;
}

export async function updateCategory(id: string, data: { name?: string; color?: string }) {
  const { supabase } = await requireAdmin();
  const updates: Record<string, any> = {};
  if (data.name !== undefined) {
    if (!data.name.trim()) throw new Error('اسم التصنيف مطلوب');
    updates.name = data.name.trim();
  }
  if (data.color !== undefined && CATEGORY_COLOR_KEYS.includes(data.color)) updates.color = data.color;

  const { error } = await supabase.from('categories').update(updates).eq('id', id);
  if (error) throw new Error('فشل في تحديث التصنيف');
  revalidatePath('/admin/categories');
  revalidatePath('/');
}

export async function deleteCategory(id: string) {
  const { supabase } = await requireAdmin();
  const { error } = await supabase.from('categories').delete().eq('id', id);
  if (error) throw new Error('فشل في حذف التصنيف');
  revalidatePath('/admin/categories');
  revalidatePath('/');
}

export async function reorderCategories(orderedIds: string[]) {
  const { supabase } = await requireAdmin();
  await Promise.all(orderedIds.map((id, i) => supabase.from('categories').update({ sort_order: i + 1 }).eq('id', id)));
  revalidatePath('/admin/categories');
  revalidatePath('/');
}

// Moves several subjects into a category at once (null = uncategorized).
export async function setSubjectsCategory(subjectIds: string[], categoryId: string | null) {
  const { supabase, userId } = await requireAdmin();
  if (subjectIds.length === 0) return;
  const { error } = await supabase
    .from('subjects')
    .update({ category_id: categoryId, updated_by: userId })
    .in('id', subjectIds);
  if (error) throw new Error('فشل في تحديث تصنيف المواد');
  revalidatePath('/admin');
  revalidatePath('/admin/categories');
  revalidatePath('/');
}

// =================== SUBJECTS ===================

export async function createSubject(data: {
  name: string;
  description?: string;
  status?: string;
  cover_image?: string;
  category_id?: string | null;
}) {
  const { supabase, userId } = await requireAdmin();

  const { data: subject, error } = await supabase
    .from('subjects')
    .insert({
      name: data.name,
      name_normalized: normalizeArabic(data.name),
      description: data.description ?? null,
      cover_image: data.cover_image ?? null,
      category_id: data.category_id || null,
      status: (data.status as 'draft' | 'published' | 'soon') ?? 'draft',
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
  data: { name?: string; description?: string; status?: string; cover_image?: string | null; category_id?: string | null },
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
  if (data.category_id !== undefined) updates.category_id = data.category_id || null;

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

export async function updateLessonSettings(
  lessonId: string,
  settings: { shuffle_questions?: boolean; shuffle_options?: boolean; question_seconds?: number },
) {
  const { supabase, userId } = await requireAdmin();
  const updates: Record<string, any> = { updated_by: userId };
  if (settings.shuffle_questions !== undefined) updates.shuffle_questions = settings.shuffle_questions;
  if (settings.shuffle_options !== undefined) updates.shuffle_options = settings.shuffle_options;
  if (settings.question_seconds !== undefined) {
    updates.question_seconds = Math.min(600, Math.max(10, Math.round(settings.question_seconds)));
  }

  const { error } = await supabase.from('lessons').update(updates).eq('id', lessonId);
  if (error) throw new Error('فشل في تحديث إعدادات الدرس');
  revalidatePath('/admin');
}

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
  if (data.status !== undefined) {
    if (!['draft', 'published', 'soon'].includes(data.status)) throw new Error('حالة غير معروفة');
    updates.status = data.status;
  }
  if (data.sort_order !== undefined) updates.sort_order = data.sort_order;

  const { error } = await supabase.from('lessons').update(updates).eq('id', id);
  if (error) {
    throw new Error(/lessons_status_check/.test(error.message) ? 'شغّل ملف التحديث 016 في قاعدة البيانات أولاً' : 'فشل في تحديث الدرس');
  }
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

// Practice/exam placement. Only sent when given, so saving still works before migration 014.
function modeFields(data: { in_practice?: boolean; in_exam?: boolean }) {
  const fields: Record<string, boolean> = {};
  if (data.in_practice !== undefined) fields.in_practice = data.in_practice;
  if (data.in_exam !== undefined) fields.in_exam = data.in_exam;
  if (fields.in_practice === false && fields.in_exam === false) throw new Error('اختر وضعاً واحداً على الأقل للسؤال');
  return fields;
}

function MODE_ERROR_HINT(error: { message?: string }, fallback: string) {
  return /in_practice|in_exam/.test(error.message ?? '') ? 'شغّل ملف التحديث 014 في قاعدة البيانات أولاً' : fallback;
}

// Sets where questions appear (practice, exam, or both) for one or many questions at once.
export async function setQuestionsMode(questionIds: string[], mode: { in_practice?: boolean; in_exam?: boolean }) {
  const { supabase, userId } = await requireAdmin();
  if (questionIds.length === 0) return;
  const { error } = await supabase
    .from('questions')
    .update({ ...modeFields(mode), updated_by: userId } as any)
    .in('id', questionIds);
  if (error) {
    throw new Error(/questions_in_some_mode/.test(error.message) ? 'يجب أن يظهر السؤال في وضع واحد على الأقل' : MODE_ERROR_HINT(error, 'فشل في تحديث وضع الأسئلة'));
  }
  revalidatePath('/admin');
}

export async function createQuestion(
  lessonId: string,
  data: { type: string; content: any; explanation?: string; in_practice?: boolean; in_exam?: boolean },
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
      type: data.type as 'mcq' | 'true_false' | 'fill_blanks',
      content: data.content,
      explanation: data.explanation ?? null,
      ...modeFields(data),
      sort_order: (maxOrder?.sort_order ?? 0) + 1,
      created_by: userId,
      updated_by: userId,
    })
    .select('id')
    .single();

  if (error) throw new Error(MODE_ERROR_HINT(error, 'فشل في إنشاء السؤال'));
  revalidatePath('/admin');
  return question;
}

export async function updateQuestion(
  id: string,
  data: { type?: string; content?: any; explanation?: string; sort_order?: number; in_practice?: boolean; in_exam?: boolean },
) {
  const { supabase, userId } = await requireAdmin();

  const updates: Record<string, any> = { updated_by: userId };
  if (data.type !== undefined) updates.type = data.type;
  if (data.content !== undefined) updates.content = data.content;
  if (data.explanation !== undefined) updates.explanation = data.explanation;
  if (data.sort_order !== undefined) updates.sort_order = data.sort_order;
  Object.assign(updates, modeFields(data));

  const { error } = await supabase.from('questions').update(updates).eq('id', id);
  if (error) throw new Error(MODE_ERROR_HINT(error, 'فشل في تحديث السؤال'));
  revalidatePath('/admin');
}

export async function deleteQuestion(id: string) {
  const { supabase } = await requireAdmin();
  const { error } = await supabase.from('questions').delete().eq('id', id);
  if (error) throw new Error('فشل في حذف السؤال');
  revalidatePath('/admin');
}

// =================== IMAGE UPLOAD ===================

const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const ALLOWED_IMAGE_EXTS = ['jpg', 'jpeg', 'png', 'webp', 'gif'];
const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

export async function uploadImage(formData: FormData): Promise<string> {
  const { supabase } = await requireAdmin();
  const file = formData.get('file') as File;
  if (!file) throw new Error('لم يتم تحديد ملف');
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) throw new Error('نوع الملف غير مسموح');
  if (file.size > MAX_IMAGE_SIZE) throw new Error('حجم الملف أكبر من 5 ميجا');

  const ext = file.name.split('.').pop()?.toLowerCase() ?? 'webp';
  if (!ALLOWED_IMAGE_EXTS.includes(ext)) throw new Error('نوع الملف غير مسموح');
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

export async function deleteUser(userId: string) {
  const { supabase } = await requireAdmin();
  const { error } = await supabase.rpc('admin_delete_user', { p_user_id: userId });
  if (error) throw new Error(error.message || 'فشل في حذف الحساب');
  revalidatePath('/admin/users');
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
