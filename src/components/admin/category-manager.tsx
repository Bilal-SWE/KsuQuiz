'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowDown, ArrowRight, ArrowUp, Check, FolderOpen, Pencil, Plus, Trash2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { EmptyState } from '@/components/ui/empty-state';
import { createCategory, deleteCategory, reorderCategories, updateCategory } from '@/app/actions/admin';
import { CATEGORY_COLORS, categoryColor, type Category } from '@/lib/categories';

function ColorPicker({ value, onChange }: { value: string; onChange: (c: string) => void }) {
  return (
    <div className="flex flex-wrap gap-2">
      {Object.entries(CATEGORY_COLORS).map(([key, c]) => (
        <button
          key={key}
          type="button"
          title={c.label}
          aria-label={c.label}
          onClick={() => onChange(key)}
          className={`flex h-8 w-8 items-center justify-center rounded-full ${c.fill} transition press cursor-pointer ${
            value === key ? 'ring-4 ring-primary/25 scale-110' : 'opacity-80 hover:opacity-100'
          }`}
        >
          {value === key && <Check className="h-4 w-4" />}
        </button>
      ))}
    </div>
  );
}

export function CategoryManager({ initial, counts }: { initial: Category[]; counts: Record<string, number> }) {
  const [categories, setCategories] = useState(initial);
  const [name, setName] = useState('');
  const [color, setColor] = useState('violet');
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editColor, setEditColor] = useState('violet');

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('اكتب اسم التصنيف');
      return;
    }
    setError('');
    setAdding(true);
    try {
      const created = await createCategory({ name, color });
      setCategories((prev) => [...prev, created as Category]);
      setName('');
    } catch (err: any) {
      setError(err.message);
    }
    setAdding(false);
  };

  const startEdit = (c: Category) => {
    setEditingId(c.id);
    setEditName(c.name);
    setEditColor(c.color);
  };

  const saveEdit = async (id: string) => {
    if (!editName.trim()) return;
    const before = categories;
    setCategories((prev) => prev.map((c) => (c.id === id ? { ...c, name: editName.trim(), color: editColor } : c)));
    setEditingId(null);
    try {
      await updateCategory(id, { name: editName, color: editColor });
    } catch (err: any) {
      setCategories(before);
      alert(err.message);
    }
  };

  const handleDelete = async (c: Category) => {
    const n = counts[c.id] ?? 0;
    const msg = n > 0 ? `حذف تصنيف "${c.name}"؟ ستبقى ${n} مادة بدون تصنيف.` : `حذف تصنيف "${c.name}"؟`;
    if (!confirm(msg)) return;
    const before = categories;
    setCategories((prev) => prev.filter((x) => x.id !== c.id));
    try {
      await deleteCategory(c.id);
    } catch (err: any) {
      setCategories(before);
      alert(err.message);
    }
  };

  const move = async (index: number, dir: -1 | 1) => {
    const target = index + dir;
    if (target < 0 || target >= categories.length) return;
    const ordered = [...categories];
    [ordered[index], ordered[target]] = [ordered[target], ordered[index]];
    setCategories(ordered);
    await reorderCategories(ordered.map((c) => c.id));
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6 animate-fade-up">
      <div>
        <Link href="/admin" className="inline-flex items-center gap-1 text-xs text-muted hover:text-primary-ink">
          <ArrowRight className="h-3.5 w-3.5" />
          لوحة التحكم
        </Link>
        <h1 className="mt-1 text-2xl font-bold">التصنيفات</h1>
        <p className="text-sm text-muted">نظّم المواد في تصنيفات تظهر للطلاب في صفحة تصفح المواد.</p>
      </div>

      <form onSubmit={handleAdd} className="card space-y-4 p-5">
        <h2 className="font-bold">تصنيف جديد</h2>
        <Input
          id="category_name"
          placeholder="مثال: كلية العلوم"
          value={name}
          onChange={(e) => setName(e.target.value)}
          error={error}
        />
        <div className="flex flex-wrap items-center justify-between gap-3">
          <ColorPicker value={color} onChange={setColor} />
          <Button type="submit" loading={adding}>
            <Plus className="h-4 w-4" />
            إضافة
          </Button>
        </div>
      </form>

      {categories.length === 0 ? (
        <EmptyState
          icon={<FolderOpen className="h-7 w-7" />}
          title="لا توجد تصنيفات بعد"
          description="أضف أول تصنيف ثم اختره عند إنشاء أو تعديل مادة"
        />
      ) : (
        <div className="space-y-3 stagger">
          {categories.map((c, i) => {
            const col = categoryColor(c.color);
            const isEditing = editingId === c.id;
            return (
              <div key={c.id} className="card p-4">
                {isEditing ? (
                  <div className="space-y-3">
                    <Input value={editName} onChange={(e) => setEditName(e.target.value)} autoFocus />
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <ColorPicker value={editColor} onChange={setEditColor} />
                      <div className="flex gap-2">
                        <Button onClick={() => saveEdit(c.id)} className="text-sm">
                          <Check className="h-4 w-4" />
                          حفظ
                        </Button>
                        <Button variant="secondary" onClick={() => setEditingId(null)} className="text-sm">
                          <X className="h-4 w-4" />
                          إلغاء
                        </Button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <div className="flex flex-col">
                      <button
                        onClick={() => move(i, -1)}
                        disabled={i === 0}
                        aria-label="تحريك لأعلى"
                        className="rounded p-0.5 text-muted hover:text-foreground disabled:opacity-30 cursor-pointer"
                      >
                        <ArrowUp className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => move(i, 1)}
                        disabled={i === categories.length - 1}
                        aria-label="تحريك لأسفل"
                        className="rounded p-0.5 text-muted hover:text-foreground disabled:opacity-30 cursor-pointer"
                      >
                        <ArrowDown className="h-4 w-4" />
                      </button>
                    </div>
                    <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${col.fill}`}>
                      <FolderOpen className="h-5 w-5" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="font-bold truncate">{c.name}</p>
                      <p className="text-xs text-muted">{counts[c.id] ?? 0} مادة</p>
                    </div>
                    <button
                      onClick={() => startEdit(c)}
                      aria-label="تعديل"
                      className="rounded-xl p-2 text-muted hover:bg-surface-hover hover:text-primary-ink press cursor-pointer"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(c)}
                      aria-label="حذف"
                      className="rounded-xl p-2 text-muted hover:bg-error-light hover:text-error press cursor-pointer"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
