import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { getUserRole } from '@/lib/auth-helpers';
import { OptimisticCampaignContainer } from './components/optimistic-campaign-container';

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

async function getCampaigns(sponsorId: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/campaigns?sponsorId=${sponsorId}`, {
    cache: 'no-store', // Ensures fresh data on every request
  });
  return res.ok ? res.json() : [];
}

export default async function SponsorDashboard({ searchParams }: PageProps) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect('/login');
  }

  // Await searchParams and get role data in parallel
  const [params, roleData] = await Promise.all([searchParams, getUserRole(session.user.id)]);

  // Verify user has 'sponsor' role and associated sponsorId
  if (roleData.role !== 'sponsor' || !roleData.sponsorId) {
    redirect('/');
  }

  // Initial fetch on the server to pass to the client container
  const initialCampaigns = await getCampaigns(roleData.sponsorId);

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      {/* OptimisticCampaignContainer now handles the "Create" button, 
          the "Edit/Delete" cards, and the optimistic state management 
      */}
      <OptimisticCampaignContainer
        initialCampaigns={initialCampaigns}
        sponsorId={roleData.sponsorId}
      />
    </div>
  );
}
