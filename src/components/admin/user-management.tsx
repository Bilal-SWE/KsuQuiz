'use client';

import { useMemo, useState, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { deleteUser, setUserRole } from '@/app/actions/admin';

type User = {
  id: string;
  full_name: string;
  role: string;
  created_at: string;
};

const roleLabels: Record<string, string> = {
  owner: 'مالك',
  admin: 'مشرف',
  student: 'طالب',
};

const roleBadgeVariant: Record<string, 'success' | 'warning' | 'default'> = {
  owner: 'success',
  admin: 'warning',
  student: 'default',
};

export function UserManagement({
  users: initialUsers,
  currentUserId,
  currentRole,
}: {
  users: User[];
  currentUserId: string;
  currentRole: string;
}) {
  const [users, setUsers] = useState(initialUsers);
  const [query, setQuery] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [, startTransition] = useTransition();
  const isOwner = currentRole === 'owner';

  const visible = useMemo(() => {
    const q = query.trim();
    return q ? users.filter((u) => (u.full_name ?? '').includes(q)) : users;
  }, [users, query]);

  const canDelete = (u: User) =>
    u.id !== currentUserId && u.role !== 'owner' && (u.role === 'student' || isOwner);

  const handleRoleChange = (userId: string, newRole: 'admin' | 'student') => {
    const before = users;
    setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u)));
    startTransition(async () => {
      try {
        await setUserRole(userId, newRole);
      } catch (e: any) {
        setUsers(before);
        alert(e.message);
      }
    });
  };

  const handleDelete = async (user: User) => {
    if (!confirm(`حذف حساب "${user.full_name || 'بدون اسم'}" نهائياً؟ ستُحذف كل محاولاته ونتائجه ولا يمكن التراجع.`)) return;
    setDeletingId(user.id);
    try {
      await deleteUser(user.id);
      setUsers((prev) => prev.filter((u) => u.id !== user.id));
    } catch (e: any) {
      alert(e.message);
    }
    setDeletingId(null);
  };

  return (
    <div className="animate-fade-up">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">إدارة المستخدمين</h1>
          <p className="text-sm text-muted">{users.length} مستخدم</p>
        </div>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="ابحث بالاسم"
          className="w-full sm:w-64 rounded-xl border border-border bg-surface px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      <div className="space-y-3 stagger">
        {visible.map((user) => (
          <div key={user.id} className="card card-hover flex flex-wrap items-center justify-between gap-3 p-4">
            <div className="flex items-center gap-3 min-w-0">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-light font-bold text-primary">
                {(user.full_name || '?').charAt(0)}
              </div>
              <div className="min-w-0">
                <p className="font-medium truncate">{user.full_name || '(بدون اسم)'}</p>
                <Badge variant={roleBadgeVariant[user.role] ?? 'default'}>{roleLabels[user.role] ?? user.role}</Badge>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {isOwner && user.id !== currentUserId && user.role === 'student' && (
                <Button variant="secondary" className="text-sm" onClick={() => handleRoleChange(user.id, 'admin')}>
                  ترقية لمشرف
                </Button>
              )}
              {isOwner && user.id !== currentUserId && user.role === 'admin' && (
                <Button variant="secondary" className="text-sm" onClick={() => handleRoleChange(user.id, 'student')}>
                  إرجاع لطالب
                </Button>
              )}
              {canDelete(user) && (
                <Button
                  variant="danger"
                  className="text-sm"
                  loading={deletingId === user.id}
                  onClick={() => handleDelete(user)}
                >
                  حذف الحساب
                </Button>
              )}
              {user.id === currentUserId && <span className="text-xs text-muted self-center">أنت</span>}
            </div>
          </div>
        ))}
        {visible.length === 0 && <p className="text-center text-sm text-muted py-8">لا يوجد مستخدم بهذا الاسم</p>}
      </div>
    </div>
  );
}
