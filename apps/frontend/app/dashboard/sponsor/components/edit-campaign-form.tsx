'use client';

import { useActionState, useEffect } from 'react';
import { useFormStatus } from 'react-dom';
import { updateCampaignAction } from '@/app/actions/campaigns';

interface EditCampaignFormProps {
  campaign: {
    id: string;
    name: string;
    description?: string | null;
    budget: number;
    status: string;
    startDate: string;
    endDate: string;
  };
  onSuccess: () => void;
}

const formatDateForInput = (dateString: string) => {
  if (!dateString) return '';
  return new Date(dateString).toISOString().split('T')[0];
};

export function EditCampaignForm({ campaign, onSuccess, onUpdate }: any) {
  const [state, formAction] = useActionState(updateCampaignAction, null);

  useEffect(() => {
    if (state?.success) {
      onSuccess();
    }
  }, [state, onSuccess]);
  return (
    <form
      action={async (formData) => {
        onUpdate(formData);
        await formAction(formData);
        onSuccess();
      }}
      className="space-y-4"
    >
      <input type="hidden" name="id" value={campaign.id} />

      <div>
        <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Name</label>
        <input
          name="name"
          defaultValue={campaign.name}
          required
          className="w-full rounded-lg border p-2 text-sm"
        />
      </div>

      <div>
        <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Description</label>
        <textarea
          name="description"
          defaultValue={campaign.description}
          className="w-full rounded-lg border p-2 text-sm h-20"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Budget ($)</label>
          <input
            name="budget"
            type="number"
            step="0.01"
            defaultValue={campaign.budget}
            required
            className="w-full rounded-lg border p-2 text-sm"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Status</label>
          <select
            name="status"
            defaultValue={campaign.status}
            className="w-full rounded-lg border p-2 text-sm"
          >
            <option value="DRAFT">Draft</option>
            <option value="ACTIVE">Active</option>
            <option value="PAUSED">Paused</option>
            <option value="COMPLETED">Completed</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Start Date</label>
          <input
            name="startDate"
            type="date"
            defaultValue={formatDateForInput(campaign.startDate)}
            required
            className="w-full rounded-lg border p-2 text-sm"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-400 uppercase mb-1">End Date</label>
          <input
            name="endDate"
            type="date"
            defaultValue={formatDateForInput(campaign.endDate)}
            required
            className="w-full rounded-lg border p-2 text-sm"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Categories</label>
          <input
            name="targetCategories"
            type="text"
            defaultValue={campaign.targetCategories?.join(', ')}
            placeholder="Tech, Lifestyle"
            className="w-full rounded-lg border p-2 text-sm"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Regions</label>
          <input
            name="targetRegions"
            type="text"
            defaultValue={campaign.targetRegions?.join(', ')}
            placeholder="US, EU, Asia"
            className="w-full rounded-lg border p-2 text-sm"
          />
        </div>
      </div>

      <div className="flex justify-end gap-3 mt-4">
        <button
          type="button"
          onClick={onSuccess}
          className="px-4 py-2 text-sm font-bold text-gray-400"
        >
          Cancel
        </button>
        <SubmitButton />
      </div>
    </form>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-lg bg-black px-6 py-2 font-medium text-white transition-all hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed"
    >
      {pending ? 'Saving Changes...' : 'Save Changes'}
    </button>
  );
}
