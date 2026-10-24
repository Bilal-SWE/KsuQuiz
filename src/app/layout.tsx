import type { Metadata } from 'next';
import { IBM_Plex_Sans_Arabic } from 'next/font/google';
import { APP_NAME } from '@/lib/constants';
import { I18nProvider } from '@/i18n/client';
import { getI18n } from '@/i18n/server';
import { dirOf } from '@/i18n/config';
import './globals.css';

const ibmPlexArabic = IBM_Plex_Sans_Arabic({
  subsets: ['arabic', 'latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-ibm-plex-arabic',
});

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getI18n();
  return { title: APP_NAME, description: t.landing.metaDescription };
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const { locale } = await getI18n();
  return (
    <html lang={locale} dir={dirOf(locale)} className={`h-full ${ibmPlexArabic.variable}`}>
      <body className="min-h-full flex flex-col antialiased font-sans">
        <I18nProvider locale={locale}>{children}</I18nProvider>
      </body>
    </html>
  );
}
