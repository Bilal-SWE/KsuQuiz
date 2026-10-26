import { DEFAULT_LOCALE, type Locale } from './config';
import { ar } from './dictionaries/ar';
import { en } from './dictionaries/en';

// The site is Arabic only; the language switch was removed, so an old "lang" cookie is ignored.
// The English dictionary stays in the code in case the switch comes back.
export async function getLocale(): Promise<Locale> {
  return DEFAULT_LOCALE;
}

export function dictionaryFor(locale: Locale) {
  return locale === 'en' ? en : ar;
}

export async function getI18n() {
  const locale = await getLocale();
  return { locale, t: dictionaryFor(locale) };
}
