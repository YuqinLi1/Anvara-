'use client';

import { useState } from 'react';
import { createCampaignAction } from '@/app/actions/campaigns';

export function CreateCampaignButton({
  sponsorId,
  onAction,
  isPending,
}: {
  sponsorId: string;
  onAction: (data: FormData) => void;
  isPending: boolean;
}) {
  const [isOpen, setIsOpen] = useState(false);

  async function handleSubmit(formData: FormData) {
    const result = await createCampaignAction(formData);
    if (result.success) {
      setIsOpen(false);
    } else {
      alert(result.error);
    }
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="rounded-lg bg-[--color-primary] px-4 py-2 font-medium text-white hover:bg-[--color-primary-hover]"
      >
        + New Campaign
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
            <h2 className="mb-4 text-xl font-bold">Create New Campaign</h2>
            <form action={handleSubmit} className="space-y-4">
              <input type="hidden" name="sponsorId" value={sponsorId} />

              <div>
                <label className="block text-sm font-medium">Campaign Name</label>
                <input
                  name="name"
                  required
                  className="w-full rounded-lg border p-2"
                  placeholder="Summer Sale 2026"
                />
              </div>

              <div>
                <label className="block text-sm font-medium">Budget ($)</label>
                <input
                  name="budget"
                  type="number"
                  required
                  className="w-full rounded-lg border p-2"
                  placeholder="1000"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium">Start Date</label>
                  <input
                    name="startDate"
                    type="date"
                    required
                    className="w-full rounded-lg border p-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">End Date</label>
                  <input
                    name="endDate"
                    type="date"
                    required
                    className="w-full rounded-lg border p-2"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2 text-gray-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="bg-black text-white px-4 py-2 rounded-lg disabled:bg-gray-400"
                >
                  {isPending ? 'Creating...' : 'Create Campaign'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
