'use client';

import { useFormState, useFormStatus } from 'react-dom'; //
import { createCampaignAction } from '@/app/actions/campaigns';

interface CreateCampaignFormProps {
  sponsorId: string;
  onSuccess: () => void;
}

/**
 * Challenge 5: Form implementation with State and Status hooks
 */
export function CreateCampaignForm({ sponsorId, onSuccess }: CreateCampaignFormProps) {
  // Requirement: Use useFormState for error handling and feedback
  const [state, formAction] = useFormState(createCampaignAction, {
    success: false,
    error: null,
  });

  // Automatically close modal on success
  if (state.success) {
    onSuccess();
  }

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="sponsorId" value={sponsorId} />

      {/* : Error Handling */}
      {state.error && (
        <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm border border-red-200">
          {state.error}
        </div>
      )}

      <div className="space-y-1">
        <label className="text-sm font-medium">Campaign Name</label>
        <input
          name="name"
          required
          className="w-full rounded-lg border border-[--color-border] p-2 focus:ring-2 focus:ring-[--color-primary]"
          placeholder="Summer 2026 Promo"
        />
      </div>

      <div className="space-y-1">
        <label className="text-sm font-medium">Budget ($)</label>
        <input
          name="budget"
          type="number"
          required
          className="w-full rounded-lg border border-[--color-border] p-2"
          placeholder="5000"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-sm font-medium">Start Date</label>
          <input name="startDate" type="date" required className="w-full rounded-lg border p-2" />
        </div>
        <div className="space-y-1">
          <label className="text-sm font-medium">End Date</label>
          <input name="endDate" type="date" required className="w-full rounded-lg border p-2" />
        </div>
      </div>

      <div className="flex justify-end gap-3 mt-6">
        <SubmitButton />
      </div>
    </form>
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
