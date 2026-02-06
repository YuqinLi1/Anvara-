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
    <div className="relative">
      <button
        onClick={onSuccess}
        type="button"
        className="absolute -top-2 -right-2 p-2 text-gray-400 hover:text-gray-600 transition-colors"
        aria-label="Close form"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </button>
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
          <label className="block text-xs font-bold text-gray-400 uppercase mb-1">
            Description
          </label>
          <textarea
            name="description"
            defaultValue={campaign.description}
            className="w-full rounded-lg border p-2 text-sm h-20"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          {/* Budget */}
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase mb-1">
              Budget ($)
            </label>
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

        {/* date */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase mb-1">
              Start Date
            </label>
            <input
              name="startDate"
              type="date"
              defaultValue={formatDateForInput(campaign.startDate)}
              required
              className={`w-full rounded-lg border p-2 text-sm ${
                state.validationErrors?.startDate ? 'border-red-500' : 'border-gray-200'
              }`}
            />
            {state.validationErrors?.startDate && (
              <p className="mt-1 text-xs text-red-500 font-medium">
                {state.validationErrors.startDate}
              </p>
            )}
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase mb-1">End Date</label>
            <input
              name="endDate"
              type="date"
              defaultValue={formatDateForInput(campaign.endDate)}
              required
              className={`w-full rounded-lg border p-2 text-sm ${
                state.validationErrors?.endDate ? 'border-red-500' : 'border-gray-200'
              }`}
            />

            {state.validationErrors?.endDate && (
              <p className="mt-1 text-xs text-red-500 font-medium">
                {state.validationErrors.endDate}
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase mb-1">
              Categories
            </label>
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
    </div>
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
