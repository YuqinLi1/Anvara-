'use server';

import { string } from 'better-auth';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';

export type AdSlotActionState = {
  success: boolean;
  error: string | null;
  validationErrors?: {
    name?: string;
    position?: string;
    basePrice?: string;
    type?: string;
    publisherId?: string;
  };
};

const API_URL = 'http://127.0.0.1:4291/api';
/**
 * Create Ad Slot Server Action
 */
export async function createAdSlotAction(
  prevState: AdSlotActionState,
  formData: FormData
): Promise<AdSlotActionState> {
  const cookieStore = await cookies();
  const token = cookieStore.get('better-auth.session_token')?.value;

  const allCookies = cookieStore.getAll().map((c) => c.name);

  if (!token) {
    return {
      success: false,
      error: 'Authentication failed: No session token found.',
      validationErrors: {},
    };
  }

  const rawName = formData.get('name') as string;
  const rawPosition = formData.get('position') as string;
  const rawBasePrice = formData.get('basePrice');
  const basePrice = Number(rawBasePrice);

  const validationErrors: AdSlotActionState['validationErrors'] = {};
  if (!rawName || rawName.trim() === '') validationErrors.name = 'Slot name is required';
  if (!rawPosition || rawPosition.trim() === '') validationErrors.position = 'Position is required';
  if (!rawBasePrice || isNaN(basePrice) || basePrice <= 0) {
    validationErrors.basePrice = 'Price must be a positive number';
  }

  // if validat error return
  if (Object.keys(validationErrors).length > 0) {
    return { success: false, error: 'Please fix the highlighted errors', validationErrors };
  }

  const data = {
    name: formData.get('name'),
    description: formData.get('description'),
    type: formData.get('type'),
    position: formData.get('position'),
    width: formData.get('width') ? Number(formData.get('width')) : null,
    height: formData.get('height') ? Number(formData.get('height')) : null,
    basePrice: Number(formData.get('basePrice')),
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
    const errorDetail = await res.json().catch(() => ({}));
    console.error('❌ Backend Error Detail:', errorDetail);

    return { success: false, error: errorDetail.message || 'Failed to create ad slot' };
  }

  revalidatePath('/dashboard/publisher');
  return { success: true, error: null };
}

/**
 * Delete Ad Slot Server Action
 */
export async function deleteAdSlotAction(slotId: string) {
  const cookieStore = await cookies();
  const token = cookieStore.get('better-auth.session_token')?.value;

  if (!token) return { success: false, error: 'No token' };

  try {
    const res = await fetch(`${API_URL}/ad-slots/${slotId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });

    if (res.ok) {
      revalidatePath('/dashboard/publisher');
      return { success: true, error: null };
    }

    const errorData = await res.json().catch(() => ({}));
    return { success: false, error: errorData.message || 'Delete failed' };
  } catch (e) {
    return { success: false, error: 'Network error' };
  }
}

/**
 * Update Ad Slot Server Action
 */
export async function updateAdSlotAction(
  prevState: AdSlotActionState,
  formData: FormData
): Promise<AdSlotActionState> {
  const cookieStore = await cookies();
  const token = cookieStore.get('better-auth.session_token')?.value;
  const slotId = formData.get('id');

  if (!token) {
    return { success: false, error: 'Authentication required', validationErrors: {} };
  }

  const rawName = formData.get('name') as string;
  const rawPosition = formData.get('position') as string;
  const rawBasePrice = formData.get('basePrice');
  const basePrice = Number(rawBasePrice);

  const validationErrors: AdSlotActionState['validationErrors'] = {};
  if (!rawName || rawName.trim() === '') validationErrors.name = 'Slot name is required';
  if (!rawPosition || rawPosition.trim() === '') validationErrors.position = 'Position is required';
  if (!rawBasePrice || isNaN(basePrice) || basePrice <= 0) {
    validationErrors.basePrice = 'Price must be a positive number';
  }

  if (Object.keys(validationErrors).length > 0) {
    return { success: false, error: 'Please fix the validation errors', validationErrors };
  }

  const data = {
    name: formData.get('name'),
    description: formData.get('description'),
    position: formData.get('position'),
    width: formData.get('width') ? Number(formData.get('width')) : null,
    height: formData.get('height') ? Number(formData.get('height')) : null,
    basePrice: Number(formData.get('basePrice')),
    isAvailable: formData.get('isAvailable') === 'true',
  };

  const res = await fetch(`${API_URL}/ad-slots/${slotId}`, {
    method: 'PUT',
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
