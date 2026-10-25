import { AuthProvider } from '@/lib/supabase/auth-context';
import { Navbar } from '@/components/shell/navbar';
import { SiteFooter } from '@/components/shell/site-footer';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <Navbar />
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 pt-4 pb-8 sm:pt-6 sm:pb-10">{children}</main>
      <SiteFooter className="mb-20 md:mb-0" />
    </AuthProvider>
  );
}
