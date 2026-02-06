'use client';

import { useActionState, useEffect } from 'react';
import { useFormStatus } from 'react-dom';
import { updateCampaignAction, type CampaignActionState } from '@/app/actions/campaigns';

interface EditCampaignFormProps {
  campaign: {
    id: string;
    name: string;
    description?: string | null;
    budget: number;
    status: string;
    startDate: string;
    endDate: string;
    targetCategories?: string[];
    targetRegions?: string[];
  };
  onSuccess: () => void;
}

const formatDateForInput = (dateString: string) => {
  if (!dateString) return '';
  return new Date(dateString).toISOString().split('T')[0];
};

export function EditCampaignForm({ campaign, onSuccess, onUpdate }: any) {
  const initialState: CampaignActionState = {
    success: false,
    error: null,
    validationErrors: {},
  };
  const [state, formAction] = useActionState(updateCampaignAction, initialState);

  useEffect(() => {
    if (state?.success) {
      onSuccess();
    }
  }, [state?.success, onSuccess]);
  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="id" value={campaign.id} />
      {state.error && (
        <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm border border-red-200">
          {state.error}
        </div>
      )}

      {/* Name */}
      <div>
        <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Name</label>
        <input
          name="name"
          defaultValue={campaign.name}
          className={`w-full rounded-lg border p-2 text-sm ${
            state.validationErrors?.name ? 'border-red-500' : 'border-gray-200'
          }`}
        />
        {state.validationErrors?.name && (
          <p className="mt-1 text-xs text-red-500 font-medium">{state.validationErrors.name}</p>
        )}
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
        {/* Budget */}
        <div>
          <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Budget ($)</label>
          <input
            name="budget"
            type="number"
            defaultValue={campaign.budget}
            className={`w-full rounded-lg border p-2 text-sm ${
              state.validationErrors?.budget ? 'border-red-500' : 'border-gray-200'
            }`}
          />
          {state.validationErrors?.budget && (
            <p className="mt-1 text-xs text-red-500">{state.validationErrors.budget}</p>
          )}
        </div>

        {/* Status */}
        <div>
          <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Status</label>
          <select
            name="status"
            defaultValue={campaign.status}
            className="w-full rounded-lg border p-2 text-sm border-gray-200"
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
