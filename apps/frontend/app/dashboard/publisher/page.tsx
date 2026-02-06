import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { getUserRole } from '@/lib/auth-helpers';
import { OptimisticAdSlotContainer } from './components/optimistic-ad-slot-container';

async function getInitialAdSlots(publisherId: string) {
  const baseUrl = 'http://127.0.0.1:4291/api';
  const res = await fetch(`${baseUrl}/ad-slots?publisherId=${publisherId}`, {
    cache: 'no-store', // fetch data
  });
  return res.ok ? res.json() : [];
}

async function getPublisherStats(publisherId: string) {
  const baseUrl = 'http://127.0.0.1:4291/api';
  const res = await fetch(`${baseUrl}/publishers/${publisherId}/stats`, {
    cache: 'no-store',
  });
  return res.ok ? res.json() : { totalRevenue: 0, activeSlots: 0, avgPrice: 0 };
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
    if (roleData.role === 'sponsor') {
      redirect('/dashboard/sponsor');
    }
    redirect('/');
  }

  const [stats, initialAdSlots] = await Promise.all([
    getPublisherStats(roleData.publisherId),
    getInitialAdSlots(roleData.publisherId),
  ]);

  return (
    <div className="space-y-8 p-6">
      {/* Revenue Overview Section */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-[--color-muted]">Total Revenue</p>
          <h2 className="mt-2 text-3xl font-bold">${stats.totalRevenue.toLocaleString()}</h2>
        </div>
        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-[--color-muted]">Active Ad Slots</p>
          <h2 className="mt-2 text-3xl font-bold">{stats.activeSlots}</h2>
        </div>
        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-[--color-muted]">Avg. Monthly Price</p>
          <h2 className="mt-2 text-3xl font-bold">${stats.avgPrice.toLocaleString()}</h2>
        </div>
      </div>

      <div className="mt-8">
        <OptimisticAdSlotContainer
          publisherId={roleData.publisherId}
          initialAdSlots={initialAdSlots}
        />
      </div>
    </div>
  );
}
