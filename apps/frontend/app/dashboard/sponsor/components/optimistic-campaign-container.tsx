'use client';

import { useOptimistic, useTransition } from 'react';
import { CampaignCard } from './campaign-card';
import { CreateCampaignButton } from './create-campaign-button';
import { createCampaignAction, deleteCampaignAction } from '@/app/actions/campaigns';

/**
 for optimistic updates in the dashboard.
 */
export function OptimisticCampaignContainer({
  initialCampaigns,
  sponsorId,
}: {
  initialCampaigns: any[];
  sponsorId: string;
}) {
  const [isPending, startTransition] = useTransition();

  // Updated optimistic logic to handle both CREATE and DELETE
  const [optimisticCampaigns, updateOptimisticCampaigns] = useOptimistic(
    initialCampaigns,
    (state, { action, payload }: { action: 'CREATE' | 'DELETE'; payload: any }) => {
      if (action === 'CREATE') {
        return [{ ...payload, id: 'temp', status: 'PENDING...', spent: 0 }, ...state];
      }
      if (action === 'DELETE') {
        return state.filter((c: any) => c.id !== payload);
      }
      return state;
    }
  );

  const handleCreate = async (formData: FormData) => {
    const newCampaign = { name: formData.get('name') };
    startTransition(async () => {
      updateOptimisticCampaigns({ action: 'CREATE', payload: newCampaign });
      await createCampaignAction(formData);
    });
  };

  const handleDelete = async (campaignId: string) => {
    startTransition(async () => {
      // 1. Instantly remove from UI
      updateOptimisticCampaigns({ action: 'DELETE', payload: campaignId });
      // 2. Perform server-side delete
      await deleteCampaignAction(campaignId);
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">My Campaigns</h1>
        <CreateCampaignButton sponsorId={sponsorId} onAction={handleCreate} isPending={isPending} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {optimisticCampaigns.map((campaign) => (
          <CampaignCard
            key={campaign.id}
            campaign={campaign}
            onDelete={() => handleDelete(campaign.id)} // Pass delete handler
          />
        ))}
      </div>
    </div>
  );
}
