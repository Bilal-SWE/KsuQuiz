'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowDown, ArrowRight, ArrowUp, Check, ChevronDown, FolderOpen, Pencil, Plus, Search, Trash2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { EmptyState } from '@/components/ui/empty-state';
import { createCategory, deleteCategory, reorderCategories, setSubjectsCategory, updateCategory } from '@/app/actions/admin';
import { normalizeArabic } from '@/lib/arabic';
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
          className={`flex h-8 w-8 items-center justify-center rounded-full border border-ink/10 ${c.fill} transition press cursor-pointer ${
            value === key ? 'ring-4 ring-primary/25 scale-110' : 'opacity-80 hover:opacity-100'
          }`}
        >
          {value === key && <Check className="h-4 w-4" />}
        </button>
      ))}
    </div>
  );
}

type AdminSubject = { id: string; name: string; status: string; category_id: string | null };

// Checklist of subjects outside this category; ticked ones move in together.
function SubjectPicker({
  subjects,
  categories,
  onAdd,
  onCancel,
}: {
  subjects: AdminSubject[];
  categories: Category[];
  onAdd: (ids: string[]) => Promise<void>;
  onCancel: () => void;
}) {
  const [query, setQuery] = useState('');
  const [picked, setPicked] = useState<Set<string>>(new Set());
  const [saving, setSaving] = useState(false);
  const q = normalizeArabic(query.trim());
  const shown = q ? subjects.filter((s) => normalizeArabic(s.name).includes(q)) : subjects;
  const categoryName = (id: string | null) => categories.find((c) => c.id === id)?.name;

  const toggle = (id: string) =>
    setPicked((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  return (
    <div className="mt-3 space-y-2 rounded-2xl border border-border bg-background p-3">
      <div className="relative">
        <Search className="pointer-events-none absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="ابحث عن مادة"
          autoFocus
          className="w-full rounded-xl border border-border bg-surface py-2 ps-9 pe-3 text-sm outline-none focus:border-primary"
        />
      </div>
      {subjects.length === 0 ? (
        <p className="py-3 text-center text-sm text-muted">كل المواد موجودة في هذا التصنيف</p>
      ) : (
        <div className="max-h-64 space-y-0.5 overflow-y-auto">
          {shown.map((s) => (
            <label
              key={s.id}
              className="flex cursor-pointer items-center gap-2.5 rounded-lg px-2 py-1.5 text-sm hover:bg-surface-hover"
            >
              <input
                type="checkbox"
                checked={picked.has(s.id)}
                onChange={() => toggle(s.id)}
                className="h-4 w-4 accent-primary"
              />
              <span dir="auto" className="min-w-0 flex-1 truncate font-medium">
                {s.name}
              </span>
              <span className="shrink-0 text-xs text-muted">{categoryName(s.category_id) ?? 'بدون تصنيف'}</span>
            </label>
          ))}
          {shown.length === 0 && <p className="py-3 text-center text-sm text-muted">لا توجد نتائج</p>}
        </div>
      )}
      <div className="flex items-center gap-2 pt-1">
        <Button
          onClick={async () => {
            setSaving(true);
            await onAdd([...picked]);
            setSaving(false);
          }}
          disabled={picked.size === 0}
          loading={saving}
          className="text-sm"
        >
          <Plus className="h-4 w-4" />
          {picked.size > 0 ? `إضافة ${picked.size} مادة` : 'إضافة'}
        </Button>
        <Button variant="ghost" onClick={onCancel} className="text-sm">
          إلغاء
        </Button>
      </div>
    </div>
  );
}

export function CategoryManager({ initial, initialSubjects }: { initial: Category[]; initialSubjects: AdminSubject[] }) {
  const [categories, setCategories] = useState(initial);
  const [subjects, setSubjects] = useState(initialSubjects);
  const [openId, setOpenId] = useState<string | null>(null);
  const [pickingId, setPickingId] = useState<string | null>(null);
  const counts: Record<string, number> = {};
  subjects.forEach((s) => {
    if (s.category_id) counts[s.category_id] = (counts[s.category_id] ?? 0) + 1;
  });
  const uncategorized = subjects.filter((s) => !s.category_id);

  const moveSubjects = async (ids: string[], categoryId: string | null) => {
    const before = subjects;
    setSubjects((prev) => prev.map((s) => (ids.includes(s.id) ? { ...s, category_id: categoryId } : s)));
    try {
      await setSubjectsCategory(ids, categoryId);
    } catch (err: any) {
      setSubjects(before);
      alert(err.message);
    }
  };
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
    setSubjects((prev) => prev.map((s) => (s.category_id === c.id ? { ...s, category_id: null } : s)));
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
            const isOpen = openId === c.id;
            const inCategory = subjects.filter((s) => s.category_id === c.id);
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
                    <button
                      type="button"
                      onClick={() => setOpenId(isOpen ? null : c.id)}
                      aria-expanded={isOpen}
                      className="flex min-w-0 flex-1 cursor-pointer items-center gap-3 text-start"
                    >
                      <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${col.fill}`}>
                        <FolderOpen className="h-5 w-5" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block font-bold truncate">{c.name}</span>
                        <span className="text-xs text-muted">{counts[c.id] ?? 0} مادة</span>
                      </span>
                      <ChevronDown className={`h-4 w-4 shrink-0 text-muted transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                    </button>
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

                {isOpen && !isEditing && (
                  <div className="mt-3 border-t border-border pt-3">
                    {inCategory.length === 0 ? (
                      <p className="py-2 text-center text-sm text-muted">لا توجد مواد في هذا التصنيف</p>
                    ) : (
                      <ul className="space-y-1">
                        {inCategory.map((s) => (
                          <li key={s.id} className="flex items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-surface-hover">
                            <Link href={`/admin/subjects/${s.id}`} dir="auto" className="min-w-0 flex-1 truncate text-sm font-medium hover:text-primary-ink">
                              {s.name}
                            </Link>
                            {s.status !== 'published' && (
                              <span className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-medium ${s.status === 'soon' ? 'bg-accent-light text-accent-ink' : 'bg-warning-light text-warning-ink'}`}>
                                {s.status === 'soon' ? 'قريباً' : 'مسودة'}
                              </span>
                            )}
                            <button
                              onClick={() => moveSubjects([s.id], null)}
                              title="إزالة من التصنيف"
                              aria-label={`إزالة ${s.name} من التصنيف`}
                              className="shrink-0 rounded-full p-1 text-muted hover:bg-error-light hover:text-error cursor-pointer"
                            >
                              <X className="h-3.5 w-3.5" />
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}
                    {pickingId === c.id ? (
                      <SubjectPicker
                        subjects={subjects.filter((s) => s.category_id !== c.id)}
                        categories={categories}
                        onAdd={async (ids) => {
                          await moveSubjects(ids, c.id);
                          setPickingId(null);
                        }}
                        onCancel={() => setPickingId(null)}
                      />
                    ) : (
                      <Button variant="ghost" onClick={() => setPickingId(c.id)} className="mt-2 text-sm">
                        <Plus className="h-4 w-4" />
                        إضافة مواد إلى هذا التصنيف
                      </Button>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {categories.length > 0 && uncategorized.length > 0 && (
        <div className="card p-4">
          <p className="font-bold">مواد بدون تصنيف ({uncategorized.length})</p>
          <p className="mt-0.5 text-xs text-muted">هذه المواد لا تظهر تحت أي تصنيف للطلاب. افتح تصنيفاً واضغط «إضافة مواد» لنقلها.</p>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {uncategorized.map((s) => (
              <Link
                key={s.id}
                href={`/admin/subjects/${s.id}`}
                dir="auto"
                className="rounded-full bg-surface-hover px-3 py-1 text-xs font-medium hover:bg-primary-light hover:text-primary-ink"
              >
                {s.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
