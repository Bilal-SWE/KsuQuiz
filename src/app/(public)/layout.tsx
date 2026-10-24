import Link from 'next/link';
import { Logo } from '@/components/ui/logo';
import { SiteFooter } from '@/components/shell/site-footer';
import { APP_NAME } from '@/lib/constants';

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 border-b border-border/70 bg-surface/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4">
          <Link href="/" aria-label={APP_NAME} className="press">
            <Logo />
          </Link>
          <div className="flex items-center gap-2">
            <Link href="/auth/login" className="press rounded-xl px-3 py-2 text-sm font-medium hover:bg-surface-hover">
              تسجيل الدخول
            </Link>
            <Link
              href="/auth/signup"
              className="press rounded-xl bg-gradient-to-l from-primary to-violet-500 px-4 py-2 text-sm font-medium text-white shadow-[0_6px_16px_-6px_rgb(109_40_217/0.6)] hover:brightness-110"
            >
              ابدأ مجاناً
            </Link>
          </div>
        </div>
      </header>
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-8">{children}</main>
      <SiteFooter />
    </div>
  );
}
