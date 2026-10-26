'use client';

import { createContext, useContext } from 'react';
import type { Locale } from './config';
import { ar, type Dictionary } from './dictionaries/ar';
import { en } from './dictionaries/en';

const I18nContext = createContext<{ locale: Locale; t: Dictionary }>({ locale: 'ar', t: ar });

export function I18nProvider({ locale, children }: { locale: Locale; children: React.ReactNode }) {
  return <I18nContext.Provider value={{ locale, t: locale === 'en' ? en : ar }}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  return useContext(I18nContext);
}
