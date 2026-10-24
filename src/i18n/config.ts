export const LOCALES = ['ar', 'en'] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = 'ar';
export const LOCALE_COOKIE = 'lang';

export function isLocale(value: string | undefined | null): value is Locale {
  return !!value && (LOCALES as readonly string[]).includes(value);
}

export const dirOf = (locale: Locale) => (locale === 'ar' ? 'rtl' : 'ltr');
