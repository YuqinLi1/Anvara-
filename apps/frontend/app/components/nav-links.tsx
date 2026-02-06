'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function NavLinks({ session, role }: { session: any; role: string | null }) {
  const pathname = usePathname();

  const getLinkStyle = (href: string) => {
    const isActive = pathname === href;
    return `text-sm font-medium transition-colors ${
      isActive
        ? 'text-[--color-foreground] border-b-2 border-[--color-primary] py-1'
        : 'text-[--color-muted] hover:text-[--color-foreground]'
    }`;
  };

  return (
    <div className="hidden md:flex items-center gap-6">
      <Link href="/marketplace" className={getLinkStyle('/marketplace')}>
        Marketplace
      </Link>
      {session && role === 'sponsor' && (
        <Link href="/dashboard/sponsor" className={getLinkStyle('/dashboard/sponsor')}>
          My Campaigns
        </Link>
      )}
      {session && role === 'publisher' && (
        <Link href="/dashboard/publisher" className={getLinkStyle('/dashboard/publisher')}>
          My Ad Slots
        </Link>
      )}
    </div>
  );
}
