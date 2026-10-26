'use client';

import Link from 'next/link';
import { BookOpenCheck, Trophy, Zap } from 'lucide-react';
import { Logo } from '@/components/ui/logo';
import { useI18n } from '@/i18n/client';
import { APP_NAME } from '@/lib/constants';

const featureIcons = [BookOpenCheck, Zap, Trophy];

export function AuthShell({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
  const { t } = useI18n();
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 py-10">
      <div className="grid w-full max-w-4xl overflow-hidden rounded-3xl bg-surface shadow-[0_30px_80px_-30px_rgb(76_29_149/0.35)] md:grid-cols-2 animate-fade-up">
        <div className="hero hidden md:flex flex-col justify-between rounded-none p-10">
          <Link href="/" className="relative z-10" aria-label={APP_NAME}>
            <Logo variant="light" markClassName="h-10 w-10" textClassName="text-xl" />
          </Link>
          <div className="relative z-10">
            <h2 className="text-3xl font-bold leading-snug">
              {t.auth.headline1}
              <br />
              {t.auth.headline2}
            </h2>
            <ul className="mt-6 space-y-3 stagger">
              {t.auth.features.map((text, i) => {
                const Icon = featureIcons[i] ?? Zap;
                return (
                  <li key={text} className="flex items-center gap-3 text-sm text-white/90">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/15">
                      <Icon className="h-4 w-4" />
                    </span>
                    {text}
                  </li>
                );
              })}
            </ul>
          </div>
          <p className="relative z-10 text-xs text-white/60">© {APP_NAME}</p>
        </div>

        <div className="p-7 sm:p-10">
          <div className="mb-8 md:hidden flex justify-center">
            <Link href="/" aria-label={APP_NAME}>
              <Logo markClassName="h-11 w-11" textClassName="text-2xl" />
            </Link>
          </div>
          <h1 className="text-2xl font-bold">{title}</h1>
          <p className="mt-1 mb-6 text-sm text-muted">{subtitle}</p>
          {children}
        </div>
      </div>
    </div>
  );
}
