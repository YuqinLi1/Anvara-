'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { authClient } from '@/auth-client';
import { useRouter } from 'next/navigation';

type UserRole = 'sponsor' | 'publisher' | null;

export function Nav() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;
  const [role, setRole] = useState<UserRole>(null);

  // TODO: Convert to server component and fetch role server-side
  // Fetch user role from backend when user is logged in
  useEffect(() => {
    // if session is null（logout)）, clear role
    if (!session) {
      setRole(null);
      return;
    }

    const fetchRole = async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/role/${session.user.id}`
      );
      const data = await res.json();
      setRole(data.role);
    };
    fetchRole();
  }, [session]);

  const handleLogout = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          setRole(null);
          router.push('/login');
          router.refresh(); // clear all Server Component
        },
      },
    });
  };

  // TODO: Add active link styling using usePathname() from next/navigation
  // The current page's link should be highlighted differently

  return (
    <header className="border-b border-[--color-border]">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        <div className="flex items-center gap-8">
          <Link href="/" className="text-xl font-bold text-[--color-foreground]">
            Anvara
          </Link>

          <div className="hidden md:flex items-center gap-6">
            <Link
              href="/marketplace"
              className="text-sm text-[--color-muted] hover:text-[--color-foreground]"
            >
              Marketplace
            </Link>
            {user && role === 'sponsor' && (
              <Link
                href="/dashboard/sponsor"
                className="text-sm text-[--color-muted] hover:text-[--color-foreground]"
              >
                My Campaigns
              </Link>
            )}
            {user && role === 'publisher' && (
              <Link
                href="/dashboard/publisher"
                className="text-sm text-[--color-muted] hover:text-[--color-foreground]"
              >
                My Ad Slots
              </Link>
            )}
          </div>
        </div>

        <div className="flex items-center gap-4">
          {isPending ? (
            <span className="text-sm text-[--color-muted]">Checking session...</span>
          ) : user ? (
            <div className="flex items-center gap-4">
              <span className="text-sm text-[--color-muted] hidden sm:inline">
                {user.email} {role && `(${role})`}
              </span>
              <button
                onClick={handleLogout}
                className="rounded bg-gray-600 px-3 py-1.5 text-sm text-white hover:bg-gray-500 transition-colors"
              >
                Logout
              </button>
            </div>
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
