'use server';

import { string } from 'better-auth';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';

// const API_URL = process.env.NEXT_PUBLIC_API_URL
//   ? `${process.env.NEXT_PUBLIC_API_URL}/api`
//   : 'http://localhost:4291/api';

const API_URL = 'http://127.0.0.1:4291/api';
/**
 * Create Ad Slot Server Action
 */
export async function createAdSlotAction(prevState: any, formData: FormData) {
  const cookieStore = await cookies();
  const token = cookieStore.get('better-auth.session_token')?.value;

  const allCookies = cookieStore.getAll().map((c) => c.name);

  if (!token) {
    return { success: false, error: 'Authentication failed: No session token found in cookies.' };
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

export async function updateAdSlotAction(prevState: any, formData: FormData) {
  const cookieStore = await cookies();
  const token = cookieStore.get('better-auth.session_token')?.value;
  const slotId = formData.get('id');

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
