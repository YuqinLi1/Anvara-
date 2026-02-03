'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { updateCampaignAction } from '@/app/actions/campaigns';

export function EditCampaignForm({
  campaign,
  onSuccess,
}: {
  campaign: any;
  onSuccess: () => void;
}) {
  const [state, formAction] = useActionState(updateCampaignAction, {
    success: false,
    error: null,
  });

  if (state.success) onSuccess();

  return (
    <form action={formAction} className="space-y-4">
      {/* Required for the PATCH request  */}
      <input type="hidden" name="id" value={campaign.id} />

      {state.error && <div className="text-red-600 text-sm">{state.error}</div>}

      <input
        name="name"
        defaultValue={campaign.name}
        required
        className="w-full border p-2 rounded"
      />
      <input
        name="budget"
        type="number"
        defaultValue={campaign.budget}
        required
        className="w-full border p-2 rounded"
      />

      <div className="grid grid-cols-2 gap-2">
        <input
          name="startDate"
          type="date"
          defaultValue={campaign.startDate?.split('T')[0]}
          required
          className="border p-2 rounded"
        />
        <input
          name="endDate"
          type="date"
          defaultValue={campaign.endDate?.split('T')[0]}
          required
          className="border p-2 rounded"
        />
      </div>

      <SubmitButton />
    </form>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      disabled={pending}
      className="w-full bg-black text-white p-2 rounded disabled:opacity-50"
    >
      {pending ? 'Updating...' : 'Save Changes'}
    </button>
  );
}
