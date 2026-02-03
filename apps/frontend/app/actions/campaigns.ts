'use server';

import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';

export async function createCampaignAction(prevState: any, formData: FormData) {
  const cookieStore = await cookies();
  const token = cookieStore.get('better-auth.session-token')?.value;

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
    name: name,
    budget: Number(formData.get('budget')),
    startDate: new Date(formData.get('startDate') as string).toISOString(),
    endDate: new Date(formData.get('endDate') as string).toISOString(),
    sponsorId: formData.get('sponsorId'),
    status: 'ACTIVE',
  };

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/campaigns`, {
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
  const token = cookieStore.get('better-auth.session-token')?.value;

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/campaigns/${campaignId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    return { success: false, error: 'Failed to delete campaign' };
  }

  // Revalidate to sync the server-side cache
  revalidatePath('/dashboard/sponsor');
  return { success: true };
}

export async function updateCampaignAction(prevState: any, formData: FormData) {
  const cookieStore = await cookies();
  const token = cookieStore.get('better-auth.session-token')?.value;

  const campaignId = formData.get('id');
  const data = {
    name: formData.get('name'),
    budget: Number(formData.get('budget')),
    startDate: new Date(formData.get('startDate') as string).toISOString(),
    endDate: new Date(formData.get('endDate') as string).toISOString(),
    status: formData.get('status'),
  };

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/campaigns/${campaignId}`, {
    method: 'PATCH',
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
