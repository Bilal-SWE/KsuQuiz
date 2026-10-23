import type { Metadata } from 'next';
import { IBM_Plex_Sans_Arabic } from 'next/font/google';
import { APP_NAME } from '@/lib/constants';
import './globals.css';

const ibmPlexArabic = IBM_Plex_Sans_Arabic({
  subsets: ['arabic', 'latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-ibm-plex-arabic',
});

export const metadata: Metadata = {
  title: APP_NAME,
  description: 'منصة تدريب الطلاب على الأسئلة',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl" className={`h-full ${ibmPlexArabic.variable}`}>
      <body className="min-h-full flex flex-col antialiased font-sans">{children}</body>
    </html>
  );
}
