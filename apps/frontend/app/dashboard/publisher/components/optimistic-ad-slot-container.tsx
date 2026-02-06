'use client';

import { useOptimistic, useTransition, useState } from 'react';
import { AdSlotCard } from './ad-slot-card';
import { CreateAdSlotForm } from './create-ad-slot-form';
import { deleteAdSlotAction, updateAdSlotAction } from '@/app/actions/ad-slots';

export function OptimisticAdSlotContainer({
  initialAdSlots,
  publisherId,
}: {
  initialAdSlots: any[];
  publisherId: string;
}) {
  const [isPending, startTransition] = useTransition();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [optimisticAdSlots, updateAdSlots] = useOptimistic(
    initialAdSlots,
    (state, { action, payload }: { action: 'CREATE' | 'DELETE' | 'UPDATE'; payload: any }) => {
      if (action === 'CREATE') {
        return [{ ...payload, id: 'temp-' + Date.now(), isAvailable: true }, ...state];
      }
      if (action === 'DELETE') {
        return state.filter((slot) => slot.id !== payload);
      }
      if (action === 'UPDATE') {
        return state.map((slot: any) =>
          slot.id === payload.id ? { ...slot, ...payload.data } : slot
        );
      }
      return state;
    }
  );

  const handleDelete = async (slotId: string) => {
    startTransition(async () => {
      updateAdSlots({ action: 'DELETE', payload: slotId });
      await deleteAdSlotAction(slotId);
    });
  };

  const handleUpdate = async (formData: FormData) => {
    const slotId = formData.get('id') as string;
    const isAvailable = formData.get('isAvailable') === 'true';

    startTransition(async () => {
      updateAdSlots({
        action: 'UPDATE',
        payload: {
          id: slotId,
          data: {
            isAvailable,
            name: formData.get('name') as string,
            basePrice: Number(formData.get('basePrice')),
          },
        },
      });

      const initialState = { success: false, error: null, validationErrors: {} };
      await updateAdSlotAction(initialState, formData);
    });
  };
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">My Ad Slots</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="rounded-lg bg-black px-4 py-2 text-white text-sm font-medium"
        >
          + New Ad Slot
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {optimisticAdSlots.map((slot) => (
          <AdSlotCard
            key={slot.id}
            adSlot={slot}
            onDelete={() => handleDelete(slot.id)}
            onUpdate={handleUpdate}
          />
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
            <h2 className="mb-4 text-xl font-bold">Create Ad Slot</h2>
            <CreateAdSlotForm publisherId={publisherId} onSuccess={() => setIsModalOpen(false)} />
          </div>
        </div>
      )}
    </div>
  );
}
