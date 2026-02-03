import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { getUserRole } from '@/lib/auth-helpers';
import { AdSlotList } from './components/ad-slot-list';
import { OptimisticAdSlotContainer } from './components/optimistic-ad-slot-container';

async function getInitialAdSlots(publisherId: string) {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4291/api';
  const res = await fetch(`${baseUrl}/ad-slots?publisherId=${publisherId}`, {
    cache: 'no-store', // fetch data
  });
  return res.ok ? res.json() : [];
}

export default async function PublisherDashboard() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect('/login');
  }

  // Verify user has 'publisher' role
  const roleData = await getUserRole(session.user.id);
  if (roleData.role !== 'publisher' || !roleData.publisherId) {
    redirect('/');
  }

  const initialAdSlots = await getInitialAdSlots(roleData.publisherId);
  return (
    <div className="space-y-6">
      <OptimisticAdSlotContainer
        initialAdSlots={initialAdSlots}
        publisherId={roleData.publisherId}
      />
    </div>
  );
}
