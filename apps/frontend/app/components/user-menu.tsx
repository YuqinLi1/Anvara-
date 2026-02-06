'use client';

import { authClient } from '@/auth-client';
import { useRouter } from 'next/navigation';

export function UserMenu({ session, role }: { session: any; role: string | null }) {
  const router = useRouter();

  const handleLogout = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push('/login');
          router.refresh();
        },
      },
    });
  };

  return (
    <div className="flex items-center gap-4">
      <span className="text-sm text-[--color-muted] hidden sm:inline">
        {session.user.email} {role && `(${role})`}
      </span>
      <button
        onClick={handleLogout}
        className="rounded bg-gray-600 px-3 py-1.5 text-sm text-white hover:bg-gray-500 transition-colors"
      >
        Logout
      </button>
    </div>
  );
}
