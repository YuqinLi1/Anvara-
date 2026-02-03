import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { getUserRole } from '@/lib/auth-helpers';
import { CampaignList } from './components/campaign-list';
import { CreateCampaignButton } from './components/create-campaign-button';
import { OptimisticCampaignContainer } from './components/optimistic-campaign-container';

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

async function getCampaigns(sponsorId: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/campaigns?sponsorId=${sponsorId}`, {
    cache: 'no-store',
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

  // Await searchParams and get role data
  const [params, roleData] = await Promise.all([searchParams, getUserRole(session.user.id)]);

  // Verify user has 'sponsor' role and ID
  if (roleData.role !== 'sponsor' || !roleData.sponsorId) {
    redirect('/');
  }

  // Initial fetch on the server
  const initialCampaigns = await getCampaigns(roleData.sponsorId);

  const sort = typeof params.sort === 'string' ? params.sort : 'createdAt_desc';
  const page = typeof params.page === 'string' ? params.page : '1';

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">My Campaigns</h1>
        {/*  Add CreateCampaignButton here */}
        <OptimisticCampaignContainer
          initialCampaigns={initialCampaigns}
          sponsorId={roleData.sponsorId}
        />
      </div>

      <CampaignList sponsorId={roleData.sponsorId} sort={sort} page={page} />
    </div>
  );
}
