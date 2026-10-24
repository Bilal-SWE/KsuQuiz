'use client';

import { createContext, useContext } from 'react';
import { Languages } from 'lucide-react';
import { LOCALE_COOKIE, type Locale } from './config';
import { ar, type Dictionary } from './dictionaries/ar';
import { en } from './dictionaries/en';

const I18nContext = createContext<{ locale: Locale; t: Dictionary }>({ locale: 'ar', t: ar });

export function I18nProvider({ locale, children }: { locale: Locale; children: React.ReactNode }) {
  return <I18nContext.Provider value={{ locale, t: locale === 'en' ? en : ar }}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  return useContext(I18nContext);
}

export function LanguageToggle({ className = '' }: { className?: string }) {
  const { locale, t } = useI18n();

  const toggle = () => {
    const next: Locale = locale === 'ar' ? 'en' : 'ar';
    document.cookie = `${LOCALE_COOKIE}=${next}; path=/; max-age=31536000; samesite=lax`;
    window.location.reload();
  };

  return (
    <button
      type="button"
      onClick={toggle}
      title={t.common.switchLanguageLabel}
      aria-label={t.common.switchLanguageLabel}
      className={`press inline-flex items-center gap-1.5 rounded-xl px-2.5 py-2 text-sm font-medium text-muted hover:bg-surface-hover hover:text-foreground transition-colors cursor-pointer ${className}`}
    >
      <Languages className="h-4 w-4" />
      <span>{t.common.switchLanguage}</span>
    </button>
  );
}
