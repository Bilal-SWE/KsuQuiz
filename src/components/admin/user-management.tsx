'use client';

import { useState, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { setUserRole } from '@/app/actions/admin';

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

export function UserManagement({ users: initialUsers, currentUserId }: { users: User[]; currentUserId: string }) {
  const [users, setUsers] = useState(initialUsers);
  const [, startTransition] = useTransition();

  const handleRoleChange = async (userId: string, newRole: 'admin' | 'student') => {
    setUsers((prev) => prev.map((u) => u.id === userId ? { ...u, role: newRole } : u));
    startTransition(async () => {
      try {
        await setUserRole(userId, newRole);
      } catch (e: any) {
        setUsers(initialUsers);
        alert(e.message);
      }
    });
  };

  return (
    <div>
      <h1 className="text-xl font-bold mb-6">إدارة المستخدمين</h1>

      <div className="space-y-3">
        {users.map((user) => (
          <div
            key={user.id}
            className="flex items-center justify-between rounded-xl border border-border bg-surface p-4"
          >
            <div>
              <p className="font-medium">{user.full_name || '(بدون اسم)'}</p>
              <Badge variant={roleBadgeVariant[user.role] ?? 'default'}>
                {roleLabels[user.role] ?? user.role}
              </Badge>
            </div>
            <div className="flex gap-2">
              {user.id !== currentUserId && user.role !== 'owner' && (
                <>
                  {user.role === 'student' && (
                    <Button
                      variant="secondary"
                      className="text-sm"
                      onClick={() => handleRoleChange(user.id, 'admin')}
                    >
                      ترقية لمشرف
                    </Button>
                  )}
                  {user.role === 'admin' && (
                    <Button
                      variant="secondary"
                      className="text-sm"
                      onClick={() => handleRoleChange(user.id, 'student')}
                    >
                      إرجاع لطالب
                    </Button>
                  )}
                </>
              )}
              {user.id === currentUserId && (
                <span className="text-xs text-muted">أنت</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
