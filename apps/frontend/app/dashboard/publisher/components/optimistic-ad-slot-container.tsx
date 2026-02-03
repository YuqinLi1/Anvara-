'use client';

import { useOptimistic, useTransition } from 'react';
import { AdSlotCard } from './ad-slot-card';
import { CreateAdSlotButton } from './create-ad-slot-button';
import { createAdSlotAction, deleteAdSlotAction } from '@/app/actions/ad-slots';

export function OptimisticAdSlotContainer({
  initialAdSlots,
  publisherId,
}: {
  initialAdSlots: any[];
  publisherId: string;
}) {
  const [isPending, startTransition] = useTransition();

  // create delete
  const [optimisticAdSlots, updateAdSlots] = useOptimistic(
    initialAdSlots,
    (state, { action, payload }: { action: 'CREATE' | 'DELETE'; payload: any }) => {
      if (action === 'CREATE') {
        return [{ ...payload, id: 'temp-' + Date.now(), isAvailable: true }, ...state];
      }
      if (action === 'DELETE') {
        return state.filter((slot) => slot.id !== payload);
      }
      return state;
    }
  );

  const handleCreate = async (formData: FormData) => {
    const newSlot = {
      name: formData.get('name'),
      type: formData.get('type'),
      basePrice: Number(formData.get('basePrice')),
    };
    startTransition(async () => {
      updateAdSlots({ action: 'CREATE', payload: newSlot });
      await createAdSlotAction(formData);
    });
  };

  const handleDelete = async (slotId: string) => {
    startTransition(async () => {
      updateAdSlots({ action: 'DELETE', payload: slotId });
      await deleteAdSlotAction(slotId);
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">My Ad Slots</h1>
        <CreateAdSlotButton
          publisherId={publisherId}
          onAction={handleCreate}
          isPending={isPending}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {optimisticAdSlots.map((slot) => (
          <AdSlotCard key={slot.id} adSlot={slot} onDelete={() => handleDelete(slot.id)} />
        ))}
      </div>
    </div>
  );
}
