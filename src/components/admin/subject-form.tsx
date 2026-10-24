'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ImageUpload } from '@/components/admin/image-upload';
import { createClient } from '@/lib/supabase/client';
import type { Category } from '@/lib/categories';

export type SubjectFormData = {
  name: string;
  description?: string;
  status?: string;
  cover_image?: string;
  category_id?: string | null;
};

type Props = {
  onSubmit: (data: SubjectFormData) => Promise<void>;
  loading?: boolean;
  initial?: {
    name: string;
    description: string | null;
    status: string;
    cover_image: string | null;
    category_id?: string | null;
  };
};

export function SubjectForm({ onSubmit, loading, initial }: Props) {
  const [name, setName] = useState(initial?.name ?? '');
  const [description, setDescription] = useState(initial?.description ?? '');
  const [status, setStatus] = useState(initial?.status ?? 'draft');
  const [coverImage, setCoverImage] = useState(initial?.cover_image ?? '');
  const [categoryId, setCategoryId] = useState(initial?.category_id ?? '');
  const [categories, setCategories] = useState<Category[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    createClient()
      .from('categories')
      .select('id, name, color, sort_order')
      .order('sort_order')
      .then(({ data }) => setCategories((data as Category[]) ?? []));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('اسم المادة مطلوب');
      return;
    }
    setError('');
    await onSubmit({ name, description, status, cover_image: coverImage || undefined, category_id: categoryId || null });
  };

  const selectClass =
    'w-full rounded-xl border border-border bg-surface px-3.5 py-2.5 text-sm focus:outline-none focus:ring-4 focus:ring-primary/15 focus:border-primary';

  return (
    <form onSubmit={handleSubmit} className="card space-y-4 p-5">
      <Input id="name" label="اسم المادة" value={name} onChange={(e) => setName(e.target.value)} error={error} />
      <Textarea id="description" label="الوصف" value={description} onChange={(e) => setDescription(e.target.value)} />
      <div>
        <label className="text-sm font-medium text-foreground mb-1.5 block">صورة الغلاف</label>
        <ImageUpload value={coverImage} onChange={setCoverImage} />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="category" className="text-sm font-medium text-foreground mb-1.5 block">التصنيف</label>
          <select id="category" value={categoryId} onChange={(e) => setCategoryId(e.target.value)} className={selectClass}>
            <option value="">بدون تصنيف</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
          <Link href="/admin/categories" className="mt-1 inline-block text-xs text-primary-ink hover:underline">
            إدارة التصنيفات
          </Link>
        </div>
        <div>
          <label htmlFor="status" className="text-sm font-medium text-foreground mb-1.5 block">الحالة</label>
          <select id="status" value={status} onChange={(e) => setStatus(e.target.value)} className={selectClass}>
            <option value="draft">مسودة</option>
            <option value="published">منشور</option>
          </select>
        </div>
      </div>
      <Button type="submit" loading={loading} className="w-full">
        {initial ? 'حفظ التعديلات' : 'إنشاء المادة'}
      </Button>
    </form>
  );
}
