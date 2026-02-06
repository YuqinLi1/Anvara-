'use client';

import { useOptimistic, useTransition, useState } from 'react';
import { CampaignCard } from './campaign-card';
import { CreateCampaignButton } from './create-campaign-button';
import { deleteCampaignAction, updateCampaignAction } from '@/app/actions/campaigns';
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

  // Updated optimistic logic to handle  CREATE, UPDATE, DELETE
  const [optimisticCampaigns, updateOptimistic] = useOptimistic(
    initialCampaigns,
    (state, { action, payload }: { action: 'CREATE' | 'DELETE' | 'UPDATE'; payload: any }) => {
      switch (action) {
        case 'CREATE':
          return [{ ...payload, id: 'temp-' + Date.now(), spent: 0, status: 'ACTIVE' }, ...state];
        case 'DELETE':
          return state.filter((c) => c.id !== payload);
        case 'UPDATE':
          return state.map((c) => (c.id === payload.id ? { ...c, ...payload.data } : c));
        default:
          return state;
      }
    }
  );
  const handleDelete = async (id: string) => {
    startTransition(async () => {
      updateOptimistic({ action: 'DELETE', payload: id });

      const result = await deleteCampaignAction(id);

      if (!result.success) {
        alert(`Delete failed: ${result.error}`);
      }
    });
  };
  const handleUpdate = async (formData: FormData) => {
    const id = formData.get('id') as string;
    startTransition(async () => {
      updateOptimistic({
        action: 'UPDATE',
        payload: {
          id,
          data: {
            name: formData.get('name'),
            budget: Number(formData.get('budget')),
            status: formData.get('status'),
            description: formData.get('description'),
            startDate: formData.get('startDate') as string,
            endDate: formData.get('endDate') as string,
          },
        },
      });
      const prevState = { success: false, error: null, validationErrors: {} };
      await updateCampaignAction(prevState, formData);
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">My Campaigns</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="rounded-lg bg-black px-4 py-2 text-white font-medium hover:bg-gray-800 transition-colors"
        >
          + New Campaign
        </button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {optimisticCampaigns.map((campaign) => (
          <CampaignCard
            key={campaign.id}
            campaign={campaign}
            onDelete={() => handleDelete(campaign.id)}
            onUpdate={handleUpdate}
          />
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-xl">
            {' '}
            <h2 className="mb-6 text-xl font-bold">Create New Campaign</h2>
            <CreateCampaignForm sponsorId={sponsorId} onSuccess={() => setIsModalOpen(false)} />
          </div>
        </div>
      )}
    </div>
  );
}
