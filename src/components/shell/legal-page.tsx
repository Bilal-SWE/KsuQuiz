import type { LucideIcon } from 'lucide-react';

export function LegalPage({
  title,
  subtitle,
  updated,
  icon: Icon,
  children,
}: {
  title: string;
  subtitle?: string;
  updated?: string;
  icon: LucideIcon;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-6">
      <section className="hero p-6 sm:p-8 animate-fade-up">
        <div className="relative z-10 flex items-center gap-4">
          <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/15 ring-1 ring-white/30">
            <Icon className="h-7 w-7" />
          </span>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">{title}</h1>
            {subtitle && <p className="mt-1 text-sm text-white/80">{subtitle}</p>}
            {updated && <p className="mt-1 text-xs text-white/70">آخر تحديث: {updated}</p>}
          </div>
        </div>
      </section>

      <article className="card p-6 sm:p-8 leading-loose text-foreground/90 animate-fade-up [&_h2]:mt-8 [&_h2]:mb-3 [&_h2]:text-lg [&_h2]:font-bold [&_h2]:text-foreground [&_h2:first-child]:mt-0 [&_p]:mb-3 [&_ul]:mb-3 [&_ul]:list-disc [&_ul]:space-y-1.5 [&_ul]:ps-6 [&_a]:text-primary [&_a]:font-medium hover:[&_a]:underline">
        {children}
      </article>
    </div>
  );
}
