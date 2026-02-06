'use client';

import { useActionState, useEffect } from 'react';
import { useFormStatus } from 'react-dom';
import { updateAdSlotAction, type AdSlotActionState } from '@/app/actions/ad-slots';

interface EditAdSlotFormProps {
  adSlot: {
    id: string;
    name: string;
    type: string;
    basePrice: number;
    description?: string | null;
    isAvailable: boolean;
    position: string;
    width?: number | null;
    height?: number | null;
  };
  onSuccess: () => void;
}

export function EditAdSlotForm({ adSlot, onSuccess }: EditAdSlotFormProps) {
  const initialState: AdSlotActionState = {
    success: false,
    error: null,
    validationErrors: {},
  };

  const [state, formAction] = useActionState(updateAdSlotAction, initialState);

  useEffect(() => {
    if (state.success) {
      onSuccess();
    }
  }, [state.success, onSuccess]);

  return (
    <div className="relative">
      <form action={formAction} className="space-y-4">
        {/* Hidden ID field for the PATCH request  */}
        <input type="hidden" name="id" value={adSlot.id} />
        <input type="hidden" name="type" value={adSlot.type} />

        {state.error && (
          <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm border border-red-200">
            {state.error}
          </div>
        )}

        {/* Name */}
        <div className="space-y-1">
          <label className="text-sm font-medium">Slot Name</label>
          <input
            name="name"
            defaultValue={adSlot.name}
            className={`w-full border p-2 rounded ${
              state.validationErrors?.name ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {state.validationErrors?.name && (
            <p className="text-red-500 text-xs">{state.validationErrors.name}</p>
          )}
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium">Description</label>
          <textarea
            name="description"
            defaultValue={adSlot.description || ''}
            className="w-full border p-2 rounded h-20"
          />
        </div>

        {/* Position  */}
        <div className="space-y-1">
          <label className="text-sm font-medium">Position (Required)</label>
          <input
            name="position"
            defaultValue={adSlot.position}
            className={`w-full border p-2 rounded ${
              state.validationErrors?.position ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {state.validationErrors?.position && (
            <p className="text-red-500 text-xs">{state.validationErrors.position}</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-sm font-medium">Width (px)</label>
            <input
              name="width"
              type="number"
              defaultValue={adSlot.width || ''}
              className="w-full border p-2 rounded"
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium">Height (px)</label>
            <input
              name="height"
              type="number"
              defaultValue={adSlot.height || ''}
              className="w-full border p-2 rounded"
            />
          </div>
        </div>

        {/* Price */}
        <div className="space-y-1">
          <label className="text-sm font-medium">Price ($/mo)</label>
          <input
            name="basePrice"
            type="number"
            defaultValue={adSlot.basePrice}
            className={`w-full rounded-lg border p-2 ${
              state.validationErrors?.basePrice ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {state.validationErrors?.basePrice && (
            <p className="text-red-500 text-xs">{state.validationErrors.basePrice}</p>
          )}
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
    </div>
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
