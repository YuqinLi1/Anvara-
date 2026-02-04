'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { createAdSlotAction } from '@/app/actions/ad-slots';

export function CreateAdSlotForm({
  publisherId,
  onSuccess,
}: {
  publisherId: string;
  onSuccess: () => void;
}) {
  const [state, formAction] = useActionState(createAdSlotAction, {
    success: false,
    error: null,
  });

  if (state.success) onSuccess();

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="publisherId" value={publisherId} />
      {state.error && <p className="text-red-500 text-sm">{state.error}</p>}

      <input name="name" placeholder="Slot Name" required className="w-full border p-2 rounded" />
      <select name="type" className="w-full border p-2 rounded">
        <option value="DISPLAY">Display</option>
        <option value="VIDEO">Video</option>
      </select>
      <input
        name="basePrice"
        type="number"
        placeholder="Price"
        required
        className="w-full border p-2 rounded"
      />

      <div className="flex justify-end gap-2">
        <SubmitButton />
      </div>
    </form>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      disabled={pending}
      className="bg-black text-white px-4 py-2 rounded disabled:opacity-50"
    >
      {pending ? 'Saving...' : 'Create Slot'}
    </button>
  );
}
