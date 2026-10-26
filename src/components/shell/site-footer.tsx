import Link from 'next/link';
import { getI18n } from '@/i18n/server';
import { APP_NAME, PUBLIC_PAGES } from '@/lib/constants';

export async function SiteFooter({ className = '' }: { className?: string }) {
  const { t } = await getI18n();
  return (
    <footer className={`border-t border-border/70 ${className}`}>
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-4 gap-y-1 px-4 py-3 text-xs text-muted sm:justify-between">
        <nav className="flex flex-wrap justify-center gap-x-4 gap-y-1">
          {PUBLIC_PAGES.map((p) => (
            <Link key={p.href} href={p.href} className="hover:text-primary-ink transition-colors">
              {t.footer[p.key]}
            </Link>
          ))}
        </nav>
        <p>
          © {new Date().getFullYear()} {APP_NAME}
        </p>
        <p className="w-full text-center text-[11px] text-muted/80">{t.footer.note}</p>
      </div>
    </footer>
  );
}
