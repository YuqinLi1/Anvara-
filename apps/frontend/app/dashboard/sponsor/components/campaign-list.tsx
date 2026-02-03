import { CampaignCard } from './campaign-card';

interface CampaignListProps {
  sponsorId: string;
  sort: string;
  page: string;
}

// data fetching
async function fetchCampaigns(sponsorId: string, sort: string, page: string) {
  const query = new URLSearchParams({ sponsorId, sort, page }).toString();
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4291/api';

  const res = await fetch(`${baseUrl}/campaigns?${query}`, {
    cache: 'no-store', // Ensures fresh data
  });

  if (!res.ok) return [];
  return res.json();
}

export async function CampaignList({ sponsorId, sort, page }: CampaignListProps) {
  const campaigns = await fetchCampaigns(sponsorId, sort, page);

  if (campaigns.length === 0) {
    return (
      <div className="rounded-lg border border-dashed p-12 text-center text-gray-500">
        No campaigns found.
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {campaigns.map((campaign: any) => (
        <CampaignCard key={campaign.id} campaign={campaign} />
      ))}
    </div>
  );
}
