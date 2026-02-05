'use client';

import { useState } from 'react';
import { CreateCampaignForm } from './create-campaign-form';

export function CreateCampaignButton({ sponsorId }: { sponsorId: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="rounded-lg bg-black px-4 py-2 font-medium text-white hover:bg-gray-800"
      >
        + New Campaign
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Create New Campaign</h2>
              <button onClick={() => setIsOpen(false)} className="text-gray-400">
                ✕
              </button>
            </div>

            <CreateCampaignForm sponsorId={sponsorId} onSuccess={() => setIsOpen(false)} />
          </div>
        </div>
      )}
    </>
  );
}
