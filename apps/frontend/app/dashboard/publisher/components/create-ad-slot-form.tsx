'use client';
import { useEffect } from 'react';
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

  useEffect(() => {
    if (state.success) {
      onSuccess();
    }
  }, [state.success, onSuccess]);
  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="publisherId" value={publisherId} />
      {state.error && <p className="text-red-500 text-sm">{state.error}</p>}

      <input name="name" placeholder="Slot Name" required className="w-full border p-2 rounded" />
      <textarea
        name="description"
        placeholder="Description (Optional)"
        className="w-full border p-2 rounded h-20"
      />

      <div className="space-y-1">
        <label className="text-sm font-medium">Position (Required)</label>
        <input
          name="position"
          placeholder="e.g. Header, in-content"
          required
          className="w-full border p-2 rounded"
        />
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
      type="submit"
      disabled={pending}
      className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {pending ? <span className="flex items-center gap-2">Saving...</span> : 'Create Ad Slot'}
    </button>
  );
}
