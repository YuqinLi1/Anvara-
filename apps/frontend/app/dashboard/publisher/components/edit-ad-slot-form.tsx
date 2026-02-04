'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { updateAdSlotAction } from '@/app/actions/ad-slots';

interface EditAdSlotFormProps {
  adSlot: {
    id: string;
    name: string;
    type: string;
    basePrice: number;
    description?: string;
    isAvailable: boolean;
  };
  onSuccess: () => void;
}

export function EditAdSlotForm({ adSlot, onSuccess }: EditAdSlotFormProps) {
  const [state, formAction] = useActionState(updateAdSlotAction, {
    success: false,
    error: null,
  });

  if (state.success) {
    onSuccess();
  }

  return (
    <form action={formAction} className="space-y-4">
      {/* Hidden ID field for the PATCH request  */}
      <input type="hidden" name="id" value={adSlot.id} />

      {state.error && (
        <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm border border-red-200">
          {state.error}
        </div>
      )}

      <div className="space-y-1">
        <label className="text-sm font-medium">Slot Name</label>
        <input
          name="name"
          defaultValue={adSlot.name}
          required
          className="w-full rounded-lg border p-2"
        />
      </div>

      <div className="space-y-1">
        <label className="text-sm font-medium">Price ($/mo)</label>
        <input
          name="basePrice"
          type="number"
          defaultValue={adSlot.basePrice}
          required
          className="w-full rounded-lg border p-2"
        />
      </div>

      <div className="space-y-1">
        <label className="text-sm font-medium">Status</label>
        <select
          name="isAvailable"
          defaultValue={String(adSlot.isAvailable)}
          className="w-full rounded-lg border p-2"
        >
          <option value="true">Available</option>
          <option value="false">Booked</option>
        </select>
      </div>

      <div className="flex justify-end gap-3 mt-6">
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
      className="rounded-lg bg-black px-6 py-2 font-medium text-white disabled:bg-gray-400"
    >
      {pending ? 'Updating...' : 'Save Changes'}
    </button>
  );
}
