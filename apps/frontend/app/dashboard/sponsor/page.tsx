import { headers, cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { getUserRole } from '@/lib/auth-helpers';
import { OptimisticCampaignContainer } from './components/optimistic-campaign-container';

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

async function getCampaigns(sponsorId: string) {
  const cookieStore = await cookies();
  const token = cookieStore.get('better-auth.session_token')?.value;

  let baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4291/api';

  if (!baseUrl.endsWith('/api')) {
    baseUrl = `${baseUrl.replace(/\/$/, '')}/api`;
  }

  const finalUrl = `${baseUrl}/campaigns?sponsorId=${sponsorId}`;

  const res = await fetch(finalUrl, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: 'no-store',
  });

  if (!res.ok) {
    console.error(`Fetch failed (${res.status}) for URL: ${finalUrl}`);
    return [];
  }

  return res.json();
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
      <OptimisticCampaignContainer
        initialCampaigns={initialCampaigns}
        sponsorId={roleData.sponsorId}
      />
    </div>
  );
}
