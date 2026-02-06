import Link from 'next/link';
import { authClient } from '@/auth-client';
import { headers } from 'next/headers';
import { NavLinks } from './nav-links';
import { UserMenu } from './user-menu';

export async function Nav() {
  const { data: session } = await authClient.getSession({
    fetchOptions: {
      headers: await headers(),
    },
  });

  let roleData = { role: null, sponsorId: null, publisherId: null };

  if (session?.user?.id) {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4291'}/api/auth/role/${session.user.id}`,
        { next: { revalidate: 3600 } }
      );
      roleData = await res.json();
    } catch (error) {
      console.error('Failed to fetch role server-side:', error);
    }
  }

  return (
    <header className="border-b border-[--color-border] bg-white">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        <div className="flex items-center gap-8">
          <Link href="/" className="text-xl font-bold text-[--color-foreground]">
            Anvara
          </Link>

          <NavLinks session={session} role={roleData.role} />
        </div>

        <div className="flex items-center gap-4">
          {session ? (
            <UserMenu session={session} role={roleData.role} />
          ) : (
            <Link
              href="/login"
              className="rounded bg-[--color-primary] px-4 py-2 text-sm text-white hover:bg-[--color-primary-hover]"
            >
              Login
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
}
