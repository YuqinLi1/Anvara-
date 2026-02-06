'use client';

import { useActionState, useEffect } from 'react';
import { useFormStatus } from 'react-dom';
import { createCampaignAction, type CampaignActionState } from '@/app/actions/campaigns';

interface CreateCampaignFormProps {
  sponsorId: string;
  onSuccess: () => void;
}

export function CreateCampaignForm({ sponsorId, onSuccess }: CreateCampaignFormProps) {
  const initialState: CampaignActionState = {
    success: false,
    error: null,
    validationErrors: {},
  };

  const [state, formAction] = useActionState(createCampaignAction, {
    success: false,
    error: null,
  });

  useEffect(() => {
    if (state.success) {
      onSuccess();
    }
  }, [state.success, onSuccess]);

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
        <input type="hidden" name="sponsorId" value={sponsorId} />

        {/* : Error Handling */}
        {state.error && (
          <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm border border-red-200">
            {state.error}
          </div>
        )}

        {/* Name*/}
        <div className="space-y-1">
          <label className="text-sm font-medium">Campaign Name</label>
          <input
            name="name"
            placeholder="Summer 2026 Promo"
            className={`w-full rounded-lg border p-2 ${
              state.validationErrors?.name ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {state.validationErrors?.name && (
            <p className="text-red-500 text-xs">{state.validationErrors.name}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            name="description"
            placeholder="Optional campaign details..."
            className="mt-1 w-full rounded-md border border-gray-300 p-2 shadow-sm h-20"
          />
        </div>

        {/* Budget */}
        <div className="space-y-1">
          <label className="text-sm font-medium">Budget ($)</label>
          <input
            name="budget"
            type="number"
            placeholder="1000"
            className={`w-full rounded-lg border p-2 ${
              state.validationErrors?.budget ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {state.validationErrors?.budget && (
            <p className="text-red-500 text-xs">{state.validationErrors.budget}</p>
          )}
        </div>

        {/* date */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-sm font-medium">Start Date</label>
            <input
              name="startDate"
              type="date"
              required
              className={`w-full rounded-lg border p-2 ${
                state.validationErrors?.startDate ? 'border-red-500' : 'border-gray-300'
              }`}
            />

            {state.validationErrors?.startDate && (
              <p className="text-red-500 text-xs">{state.validationErrors.startDate}</p>
            )}
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium">End Date</label>
            <input
              name="endDate"
              type="date"
              required
              className={`w-full rounded-lg border p-2 ${
                state.validationErrors?.endDate ? 'border-red-500' : 'border-gray-300'
              }`}
            />

            {state.validationErrors?.endDate && (
              <p className="text-red-500 text-xs">{state.validationErrors.endDate}</p>
            )}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Category (comma separated)
            </label>
            <input
              name="targetCategories"
              type="text"
              placeholder="Tech, Lifestyle"
              className="mt-1 w-full rounded-md border border-gray-300 p-2 shadow-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Regions (comma separated)
            </label>
            <input
              name="targetRegions"
              type="text"
              placeholder="e.g. US, EU, Asia"
              className="mt-1 w-full rounded-md border border-gray-300 p-2 shadow-sm"
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <SubmitButton />
        </div>
      </form>
    </div>
  );
}

// Use useFormStatus for pending states (Loading Button)

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-lg bg-black px-6 py-2 font-medium text-white transition-opacity hover:opacity-90 disabled:bg-gray-400"
    >
      {pending ? 'Creating...' : 'Create Campaign'}
    </button>
  );
}
