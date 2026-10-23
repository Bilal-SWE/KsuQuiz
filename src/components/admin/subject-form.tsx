'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ImageUpload } from '@/components/admin/image-upload';

type Props = {
  onSubmit: (data: { name: string; description?: string; status?: string; cover_image?: string }) => Promise<void>;
  loading?: boolean;
  initial?: { name: string; description: string | null; status: string; cover_image: string | null };
};

export function SubjectForm({ onSubmit, loading, initial }: Props) {
  const [name, setName] = useState(initial?.name ?? '');
  const [description, setDescription] = useState(initial?.description ?? '');
  const [status, setStatus] = useState(initial?.status ?? 'draft');
  const [coverImage, setCoverImage] = useState(initial?.cover_image ?? '');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('اسم المادة مطلوب');
      return;
    }
    setError('');
    await onSubmit({ name, description, status, cover_image: coverImage || undefined });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        id="name"
        label="اسم المادة"
        value={name}
        onChange={(e) => setName(e.target.value)}
        error={error}
      />
      <Textarea
        id="description"
        label="الوصف"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <div>
        <label className="text-sm font-medium text-foreground mb-1.5 block">صورة الغلاف</label>
        <ImageUpload value={coverImage} onChange={setCoverImage} />
      </div>
      <div className="flex items-center gap-3">
        <label className="text-sm font-medium">الحالة:</label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="rounded-lg border border-border bg-surface px-3 py-2 text-sm"
        >
          <option value="draft">مسودة</option>
          <option value="published">منشور</option>
        </select>
      </div>
      <Button type="submit" loading={loading} className="w-full">
        {initial ? 'حفظ التعديلات' : 'إنشاء المادة'}
      </Button>
    </form>
  );
}
