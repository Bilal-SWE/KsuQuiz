import Link from 'next/link';
import { Logo } from '@/components/ui/logo';
import { APP_NAME, PUBLIC_PAGES } from '@/lib/constants';

export function SiteFooter({ className = '' }: { className?: string }) {
  return (
    <footer className={`border-t border-border/70 bg-surface/60 ${className}`}>
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-6 text-sm text-muted sm:flex-row sm:items-center sm:justify-between">
        <Link href="/" aria-label={APP_NAME}>
          <Logo markClassName="h-7 w-7" textClassName="text-base" />
        </Link>
        <nav className="flex flex-wrap gap-x-5 gap-y-2">
          {PUBLIC_PAGES.map((p) => (
            <Link key={p.href} href={p.href} className="hover:text-primary transition-colors">
              {p.label}
            </Link>
          ))}
        </nav>
        <p>© {new Date().getFullYear()} {APP_NAME}</p>
      </div>
    </footer>
  );
}
