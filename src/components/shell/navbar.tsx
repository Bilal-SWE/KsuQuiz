'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BookMarked, Compass, Crown, FolderOpen, LayoutDashboard, Trophy, User, Users } from 'lucide-react';
import { useState } from 'react';
import { PlansDialog } from '@/components/shell/plans-dialog';
import { Logo } from '@/components/ui/logo';
import { useAuth } from '@/lib/supabase/auth-context';
import { APP_NAME } from '@/lib/constants';
import { useI18n } from '@/i18n/client';

export function Navbar() {
  const pathname = usePathname();
  const { user, profile } = useAuth();
  const [plansOpen, setPlansOpen] = useState(false);
  const { t } = useI18n();
  const isAdmin = profile?.role === 'admin' || profile?.role === 'owner';

  const links = isAdmin
    ? [
        { href: '/admin', label: t.nav.dashboard, icon: LayoutDashboard, exact: false },
        { href: '/admin/categories', label: t.nav.categories, icon: FolderOpen, exact: true },
        { href: '/admin/users', label: t.nav.users, icon: Users, exact: true },
        { href: '/leaderboard', label: t.nav.leaderboard, icon: Trophy, exact: true },
      ]
    : [
        { href: '/', label: t.nav.explore, icon: Compass, exact: true },
        { href: '/my-subjects', label: t.nav.mySubjects, icon: BookMarked, exact: true },
        { href: '/leaderboard', label: t.nav.leaderboard, icon: Trophy, exact: true },
      ];

  const isActive = (href: string, exact: boolean) => {
    if (href === '/my-subjects') return pathname === href || pathname.startsWith('/subjects');
    if (href === '/admin')
      return pathname.startsWith('/admin') && !pathname.startsWith('/admin/users') && !pathname.startsWith('/admin/categories');
    return exact ? pathname === href : pathname.startsWith(href);
  };

  const initial = (profile?.full_name || '?').trim().charAt(0);

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-border/70 bg-surface/80 backdrop-blur-xl">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between gap-2 px-4 sm:h-16 sm:gap-3">
          <Link href={isAdmin ? '/admin' : '/'} className="press" aria-label={APP_NAME}>
            <Logo markClassName="h-8 w-8 sm:h-9 sm:w-9" textClassName="text-lg sm:text-xl" />
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
              <button
                type="button"
                onClick={() => setPlansOpen(true)}
                title={t.nav.subscribe}
                aria-label={t.nav.subscribe}
                aria-haspopup="dialog"
                className="press flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-accent-light text-accent-ink hover:bg-accent hover:text-ink transition-colors"
              >
                <Crown className="h-[18px] w-[18px]" />
              </button>
            )}
            <Link
              href="/profile"
              title={t.common.myAccount}
              aria-label={t.common.myAccount}
              className={`press ms-1 flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold transition-colors ${
                pathname === '/profile' ? 'bg-primary text-on-primary' : 'bg-primary-light text-primary-ink hover:bg-pastel-teal'
              }`}
            >
              {initial}
            </Link>
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
      <PlansDialog userId={user?.id} open={plansOpen} onClose={() => setPlansOpen(false)} />
    </>
  );
}
