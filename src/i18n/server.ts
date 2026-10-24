import { cookies } from 'next/headers';
import { DEFAULT_LOCALE, LOCALE_COOKIE, isLocale, type Locale } from './config';
import { ar } from './dictionaries/ar';
import { en } from './dictionaries/en';

export async function getLocale(): Promise<Locale> {
  const value = (await cookies()).get(LOCALE_COOKIE)?.value;
  return isLocale(value) ? value : DEFAULT_LOCALE;
}

export function dictionaryFor(locale: Locale) {
  return locale === 'en' ? en : ar;
}

export async function getI18n() {
  const locale = await getLocale();
  return { locale, t: dictionaryFor(locale) };
}
