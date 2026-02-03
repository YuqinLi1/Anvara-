'use server';

import { string } from 'better-auth';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4291/api';

/**
 * Create Ad Slot Server Action
 */
export async function createAdSlotAction(prevState: any, formData: FormData) {
  const cookieStore = await cookies();
  const token = cookieStore.get('better-auth.session-token')?.value;

  const data = {
    name: formData.get('name'),
    type: formData.get('type'),
    basePrice: Number(formData.get('basePrice')),
    description: formData.get('description'),
    publisherId: formData.get('publisherId'),
    isAvailable: true,
  };

  const res = await fetch(`${API_URL}/ad-slots`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    return { success: false, error: 'Failed to create ad slot' };
  }

  // Trigger cache revalidation for the publisher dashboard
  revalidatePath('/dashboard/publisher');
  return { success: true, error: null };
}

/**
 * Delete Ad Slot Server Action
 */
export async function deleteAdSlotAction(slotId: string) {
  const cookieStore = await cookies();
  const token = cookieStore.get('better-auth.session-token')?.value;

  const res = await fetch(`${API_URL}/ad-slots/${slotId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    return { success: false, error: 'Failed to delete ad slot' };
  }

  // Immediately refresh the data on the server side
  revalidatePath('/dashboard/publisher');
  return { success: true, error: null };
}

export async function updateAdSlotAction(prevState: any, formData: FormData) {
  const cookieStore = await cookies();
  const token = cookieStore.get('better-auth.session-token')?.value;
  const slotId = formData.get('id');

  const data = {
    name: formData.get('name'),
    type: formData.get('type'),
    basePrice: Number(formData.get('basePrice')),
    isAvailable: formData.get('isAvailable') === 'true',
  };

  const res = await fetch(`${API_URL}/ad-slots/${slotId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    return { success: false, error: 'Failed to update ad slot' };
  }

  revalidatePath('/dashboard/publisher');
  return { success: true, error: null };
}
