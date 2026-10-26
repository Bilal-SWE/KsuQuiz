import Link from 'next/link';
import { Logo } from '@/components/ui/logo';
import { SiteFooter } from '@/components/shell/site-footer';
import { getI18n } from '@/i18n/server';
import { APP_NAME } from '@/lib/constants';

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const { t } = await getI18n();
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 border-b border-border/70 bg-surface/80 backdrop-blur-xl">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-2 px-4 sm:h-16 sm:gap-3">
          <Link href="/" aria-label={APP_NAME} className="press">
            <Logo markClassName="h-8 w-8 sm:h-9 sm:w-9" textClassName="text-lg sm:text-xl" />
          </Link>
          <div className="flex items-center gap-1.5">
            <Link
              href="/auth/signup"
              className="press rounded-full bg-primary px-4 py-1.5 text-sm font-bold text-on-primary hover:bg-primary-hover"
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
