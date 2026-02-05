'use server';

import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';

const API_URL = 'http://127.0.0.1:4291/api';

export async function createCampaignAction(prevState: any, formData: FormData) {
  const cookieStore = await cookies();
  const token = cookieStore.get('better-auth.session_token')?.value;

  const categories =
    formData
      .get('targetCategories')
      ?.toString()
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean) || [];
  const regions =
    formData
      .get('targetRegions')
      ?.toString()
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean) || [];
  // Extract data from form
  const name = formData.get('name');
  if (!name || name.toString().length < 3) {
    return {
      success: false,
      error: 'Campaign name is too short',
      fieldErrors: { name: 'Min 3 chars' },
    };
  }
  const data = {
    name: formData.get('name'),
    description: formData.get('description'),
    budget: Number(formData.get('budget')),
    startDate: new Date(formData.get('startDate') as string).toISOString(),
    endDate: new Date(formData.get('endDate') as string).toISOString(),
    sponsorId: formData.get('sponsorId'),
    status: 'ACTIVE',
    targetCategories: categories,
    targetRegions: regions,
  };
  const res = await fetch(`${API_URL}/campaigns`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    return { success: false, error: 'Failed to create campaign' };
  }

  //  Revalidate the dashboard path to show new data
  revalidatePath('/dashboard/sponsor');
  return { success: true, error: null };
}

export async function deleteCampaignAction(campaignId: string) {
  const cookieStore = await cookies();
  const token = cookieStore.get('better-auth.session_token')?.value;

  if (!token) return { success: false, error: 'Unauthorized' };

  const API_ADDR = 'http://127.0.0.1:4291/api';

  try {
    const res = await fetch(`${API_ADDR}/campaigns/${campaignId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (res.ok) {
      revalidatePath('/dashboard/sponsor');
      return { success: true };
    }

    return { success: false, error: 'Delete failed' };
  } catch (e) {
    return { success: false, error: 'Network error' };
  }
}

export async function updateCampaignAction(prevState: any, formData: FormData) {
  const cookieStore = await cookies();
  const token = cookieStore.get('better-auth.session_token')?.value;
  const campaignId = formData.get('id');

  const categories =
    formData
      .get('targetCategories')
      ?.toString()
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean) || [];
  const regions =
    formData
      .get('targetRegions')
      ?.toString()
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean) || [];

  const data = {
    name: formData.get('name'),
    description: formData.get('description'),
    budget: Number(formData.get('budget')),
    startDate: new Date(formData.get('startDate') as string).toISOString(),
    endDate: new Date(formData.get('endDate') as string).toISOString(),
    status: formData.get('status'),
    targetCategories: categories,
    targetRegions: regions,
  };
  const res = await fetch(`${API_URL}/campaigns/${campaignId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    return { success: false, error: 'Failed to update campaign' };
  }

  revalidatePath('/dashboard/sponsor');
  return { success: true, error: null };
}
