import Link from 'next/link';
import { Logo } from '@/components/ui/logo';
import { SiteFooter } from '@/components/shell/site-footer';
import { LanguageToggle } from '@/i18n/client';
import { getI18n } from '@/i18n/server';
import { APP_NAME } from '@/lib/constants';

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const { t } = await getI18n();
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 border-b border-border/70 bg-surface/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4">
          <Link href="/" aria-label={APP_NAME} className="press">
            <Logo />
          </Link>
          <div className="flex items-center gap-1 sm:gap-2">
            <LanguageToggle />
            <Link href="/auth/login" className="press hidden sm:inline-flex rounded-xl px-3 py-2 text-sm font-medium hover:bg-surface-hover">
              {t.common.login}
            </Link>
            <Link
              href="/auth/signup"
              className="press rounded-full bg-primary px-4 py-2 text-sm font-medium text-on-primary shadow-[0_6px_16px_-6px_rgb(255_90_54/0.45)] hover:brightness-110"
            >
              {t.common.startFree}
            </Link>
          </div>
        </div>
      </header>
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-8">{children}</main>
      <SiteFooter />
    </div>
  );
}
