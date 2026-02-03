'use client';

import { useOptimistic, useTransition, useState } from 'react';
import { CampaignCard } from './campaign-card';
import { CreateCampaignButton } from './create-campaign-button';
import { createCampaignAction, deleteCampaignAction } from '@/app/actions/campaigns';
import { CreateCampaignForm } from './create-campaign-form';

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
  const [isModalOpen, setIsModalOpen] = useState(false);

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
        <button
          onClick={() => setIsModalOpen(true)}
          className="rounded-lg bg-[--color-primary] px-4 py-2 text-white"
        >
          + New Campaign
        </button>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {optimisticCampaigns.map((campaign) => (
          <CampaignCard
            key={campaign.id}
            campaign={campaign}
            onDelete={() => handleDelete(campaign.id)}
          />
        ))}
      </div>

      {/* Campaign List using optimisticCampaigns.map ... */}

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
            <h2 className="mb-4 text-xl font-bold">Create New Campaign</h2>
            {/* Integrated the new Form component here */}
            <CreateCampaignForm sponsorId={sponsorId} onSuccess={() => setIsModalOpen(false)} />
          </div>
        </div>
      )}
    </div>
  );
}
