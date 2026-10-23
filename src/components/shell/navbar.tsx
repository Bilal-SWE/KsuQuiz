'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/lib/supabase/auth-context';
import { APP_NAME } from '@/lib/constants';
import { Button } from '@/components/ui/button';

export function Navbar() {
  const router = useRouter();
  const { profile } = useAuth();
  const isAdmin = profile?.role === 'admin' || profile?.role === 'owner';

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/auth/login');
    router.refresh();
  };

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-surface/95 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
        <Link href="/" className="text-lg font-bold text-primary">
          {APP_NAME}
        </Link>

        <nav className="flex items-center gap-2">
          {isAdmin && (
            <Link href="/admin" className="text-sm text-muted hover:text-foreground transition-colors px-3 py-1.5">
              لوحة التحكم
            </Link>
          )}
          {profile?.role === 'owner' && (
            <Link href="/admin/users" className="text-sm text-muted hover:text-foreground transition-colors px-3 py-1.5">
              المستخدمون
            </Link>
          )}
          <span className="text-sm text-muted hidden sm:inline">{profile?.full_name}</span>
          <Button variant="ghost" onClick={handleLogout} className="text-sm">
            خروج
          </Button>
        </nav>
      </div>
    </header>
  );
}
