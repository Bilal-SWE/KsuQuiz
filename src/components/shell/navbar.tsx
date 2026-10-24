'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Compass, Crown, FolderOpen, Home, LayoutDashboard, LogOut, Trophy, User, Users } from 'lucide-react';
import { SubscribeButton } from '@/components/shell/subscribe-button';
import { Logo } from '@/components/ui/logo';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/lib/supabase/auth-context';
import { APP_NAME } from '@/lib/constants';
import { LanguageToggle, useI18n } from '@/i18n/client';

export function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const { profile } = useAuth();
  const { t } = useI18n();
  const isAdmin = profile?.role === 'admin' || profile?.role === 'owner';

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/auth/login');
  };

  const links = isAdmin
    ? [
        { href: '/admin', label: t.nav.dashboard, icon: LayoutDashboard, exact: false },
        { href: '/admin/categories', label: t.nav.categories, icon: FolderOpen, exact: true },
        { href: '/admin/users', label: t.nav.users, icon: Users, exact: true },
        { href: '/leaderboard', label: t.nav.leaderboard, icon: Trophy, exact: true },
      ]
    : [
        { href: '/', label: t.nav.mySubjects, icon: Home, exact: true },
        { href: '/explore', label: t.nav.explore, icon: Compass, exact: true },
        { href: '/leaderboard', label: t.nav.leaderboard, icon: Trophy, exact: true },
      ];

  const isActive = (href: string, exact: boolean) => {
    if (href === '/' && !isAdmin) return pathname === '/' || pathname.startsWith('/subjects');
    if (href === '/admin')
      return pathname.startsWith('/admin') && !pathname.startsWith('/admin/users') && !pathname.startsWith('/admin/categories');
    return exact ? pathname === href : pathname.startsWith(href);
  };

  const initial = (profile?.full_name || '?').trim().charAt(0);

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-border/70 bg-surface/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between gap-3 px-4">
          <Link href={isAdmin ? '/admin' : '/'} className="press" aria-label={APP_NAME}>
            <Logo />
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {links.map(({ href, label, icon: Icon, exact }) => {
              const active = isActive(href, exact);
              return (
                <Link
                  key={href}
                  href={href}
                  className={`flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-medium transition-colors ${
                    active ? 'bg-primary-light text-primary-ink' : 'text-muted hover:bg-surface-hover hover:text-foreground'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-1">
            {!isAdmin && (
              <SubscribeButton className="me-1 inline-flex items-center gap-1.5 rounded-xl bg-accent px-3 py-2 text-sm font-bold text-ink shadow-[0_6px_16px_-6px_rgb(255_201_60/0.6)] hover:brightness-110">
                <Crown className="h-4 w-4" />
                <span className="hidden sm:inline">{t.nav.subscribe}</span>
              </SubscribeButton>
            )}
            <LanguageToggle className="hidden sm:inline-flex" />
            <Link
              href="/profile"
              title={t.common.myAccount}
              className={`flex items-center gap-2 rounded-xl px-2 py-1.5 transition-colors press ${
                pathname === '/profile' ? 'bg-primary-light' : 'hover:bg-surface-hover'
              }`}
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-accent text-sm font-bold text-ink">
                {initial}
              </span>
              <span dir="auto" className="hidden sm:inline max-w-28 truncate text-sm font-medium">
                {profile?.full_name}
              </span>
            </Link>
            <button
              onClick={handleLogout}
              title={t.common.logout}
              aria-label={t.common.logout}
              className="rounded-xl p-2 text-muted hover:bg-error-light hover:text-error transition-colors cursor-pointer press"
            >
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      <nav className="md:hidden fixed inset-x-0 bottom-0 z-40 border-t border-border/70 bg-surface/90 backdrop-blur-xl pb-[env(safe-area-inset-bottom)]">
        <div className="mx-auto grid max-w-md" style={{ gridTemplateColumns: `repeat(${links.length + 1}, minmax(0, 1fr))` }}>
          {[...links, { href: '/profile', label: t.common.myAccount, icon: User, exact: true }].map(({ href, label, icon: Icon, exact }) => {
            const active = isActive(href, exact);
            return (
              <Link key={href} href={href} className="flex flex-col items-center gap-0.5 py-2 text-[11px] font-medium press">
                <span
                  className={`flex h-8 w-12 items-center justify-center rounded-full transition-colors ${
                    active ? 'bg-primary-light text-primary-ink' : 'text-muted'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                </span>
                <span className={active ? 'text-primary-ink' : 'text-muted'}>{label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
