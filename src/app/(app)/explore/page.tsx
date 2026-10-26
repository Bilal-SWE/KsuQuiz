import { redirect } from 'next/navigation';

// Explore now lives at the home page; keep old links working.
export default async function ExploreRedirect({
  searchParams,
}: {
  searchParams: Promise<Record<string, string>>;
}) {
  const query = new URLSearchParams(await searchParams).toString();
  redirect(query ? `/?${query}` : '/');
}
