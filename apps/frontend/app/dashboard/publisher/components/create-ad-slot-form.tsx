'use client';
import { useEffect } from 'react';
import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { createAdSlotAction, type AdSlotActionState } from '@/app/actions/ad-slots';

export function CreateAdSlotForm({
  publisherId,
  onSuccess,
}: {
  publisherId: string;
  onSuccess: () => void;
}) {
  const initialState: AdSlotActionState = {
    success: false,
    error: null,
    validationErrors: {},
  };

  const [state, formAction] = useActionState(createAdSlotAction, initialState);

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
        <input type="hidden" name="publisherId" value={publisherId} />

        {/* global error */}
        {state.error && (
          <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm border border-red-200">
            {state.error}
          </div>
        )}

        {/* Name  */}
        <div className="space-y-1">
          <label className="text-sm font-medium">Slot Name</label>
          <input
            name="name"
            placeholder="Slot Name"
            className={`w-full border p-2 rounded ${
              state.validationErrors?.name ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {state.validationErrors?.name && (
            <p className="text-red-500 text-xs">{state.validationErrors.name}</p>
          )}
        </div>

        <textarea
          name="description"
          placeholder="Description (Optional)"
          className="w-full border p-2 rounded h-20"
        />

        {/* Position  */}
        <div className="space-y-1">
          <label className="text-sm font-medium">Position (Required)</label>
          <input
            name="position"
            placeholder="e.g. Header"
            className={`w-full border p-2 rounded ${state.validationErrors?.position ? 'border-red-500' : 'border-gray-300'}`}
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
              placeholder="728"
              className="w-full border p-2 rounded"
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium">Height (px)</label>
            <input
              name="height"
              type="number"
              placeholder="90"
              className="w-full border p-2 rounded"
            />
          </div>
        </div>
        <select name="type" className="w-full border p-2 rounded">
          <option value="DISPLAY">Display</option>
          <option value="VIDEO">Video</option>
          <option value="NATIVE">Native</option>
          <option value="NEWSLETTER">Newsletter</option>
          <option value="PODCAST">Podcast</option>
        </select>
        <div className="space-y-1">
          <label className="text-sm font-medium">Base Price ($)</label>
          <input
            name="basePrice"
            type="number"
            placeholder="Price"
            className={`w-full border p-2 rounded ${
              state.validationErrors?.basePrice ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {state.validationErrors?.basePrice && (
            <p className="text-red-500 text-xs">{state.validationErrors.basePrice}</p>
          )}
        </div>
        <div className="flex justify-end gap-2">
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
      className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {pending ? <span className="flex items-center gap-2">Saving...</span> : 'Create Ad Slot'}
    </button>
  );
}
