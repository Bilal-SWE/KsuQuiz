import { AuthProvider } from '@/lib/supabase/auth-context';
import { Navbar } from '@/components/shell/navbar';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <Navbar />
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-6">{children}</main>
    </AuthProvider>
  );
}
