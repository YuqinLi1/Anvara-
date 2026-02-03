'use client';

import { useState } from 'react';

interface CreateAdSlotButtonProps {
  publisherId: string;
  onAction: (formData: FormData) => Promise<void>;
  isPending: boolean;
}

export function CreateAdSlotButton({ publisherId, onAction, isPending }: CreateAdSlotButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleSubmit = async (formData: FormData) => {
    await onAction(formData);
    setIsOpen(false);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="bg-black text-white px-4 py-2 rounded-lg font-medium"
      >
        + New Ad Slot
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white p-6 rounded-xl w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Create Ad Slot</h2>
            <form action={handleSubmit} className="space-y-4">
              <input type="hidden" name="publisherId" value={publisherId} />
              <input
                name="name"
                placeholder="Slot Name"
                required
                className="w-full border p-2 rounded"
              />
              <select name="type" className="w-full border p-2 rounded">
                <option value="DISPLAY">Display</option>
                <option value="VIDEO">Video</option>
                <option value="NEWSLETTER">Newsletter</option>
              </select>
              <input
                name="basePrice"
                type="number"
                placeholder="Price"
                required
                className="w-full border p-2 rounded"
              />

              <div className="flex justify-end gap-2">
                <button type="button" onClick={() => setIsOpen(false)}>
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="bg-black text-white px-4 py-2 rounded disabled:opacity-50"
                >
                  {isPending ? 'Saving...' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
