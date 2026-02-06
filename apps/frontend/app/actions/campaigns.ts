'use server';

import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';

const API_URL = 'http://127.0.0.1:4291/api';

export type CampaignActionState = {
  success: boolean;
  error: string | null;
  validationErrors?: {
    name?: string;
    budget?: string;
    startDate?: string;
    endDate?: string;
  };
};

/**
 * Create Campaign Action
 */
export async function createCampaignAction(
  prevState: CampaignActionState,
  formData: FormData
): Promise<CampaignActionState> {
  const cookieStore = await cookies();
  const token = cookieStore.get('better-auth.session_token')?.value;

  if (!token) {
    return { success: false, error: 'Authentication required', validationErrors: {} };
  }

  const rawName = formData.get('name') as string;
  const rawBudget = formData.get('budget');
  const budget = Number(rawBudget);
  const rawStartDate = formData.get('startDate') as string;
  const rawEndDate = formData.get('endDate') as string;

  const validationErrors: CampaignActionState['validationErrors'] = {};
  if (!rawName || rawName.trim().length < 3) {
    validationErrors.name = 'Campaign name must be at least 3 characters';
  }
  if (!rawBudget || isNaN(budget) || budget <= 0) {
    validationErrors.budget = 'Budget must be a positive number';
  }
  if (!rawStartDate) validationErrors.startDate = 'Start date is required';
  if (!rawEndDate) validationErrors.endDate = 'End date is required';

  // check date logic
  if (rawStartDate && rawEndDate) {
    const start = new Date(rawStartDate);
    const end = new Date(rawEndDate);
    if (end < start) {
      validationErrors.endDate = 'End date cannot be earlier than start date'; //
    }
  }

  if (Object.keys(validationErrors).length > 0) {
    return { success: false, error: 'Please fix the errors below', validationErrors };
  }

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

/**
 * Delete Campaign Action
 */
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

/**
 * Update Campaign Action
 */
export async function updateCampaignAction(
  prevState: CampaignActionState,
  formData: FormData
): Promise<CampaignActionState> {
  const cookieStore = await cookies();
  const token = cookieStore.get('better-auth.session_token')?.value;
  const campaignId = formData.get('id');

  if (!token) {
    return { success: false, error: 'Authentication required', validationErrors: {} };
  }

  const rawName = formData.get('name') as string;
  const rawBudget = formData.get('budget');
  const budget = Number(rawBudget);
  const rawStartDate = formData.get('startDate') as string;
  const rawEndDate = formData.get('endDate') as string;

  const validationErrors: CampaignActionState['validationErrors'] = {};
  if (!rawName || rawName.trim() === '') {
    validationErrors.name = 'Campaign name cannot be empty';
  } else if (rawName.trim().length < 3) {
    validationErrors.name = 'Campaign name must be at least 3 characters';
  }
  if (!rawBudget || isNaN(budget) || budget <= 0) {
    validationErrors.budget = 'Budget must be a positive number';
  }
  if (!rawStartDate) validationErrors.startDate = 'Start date is required';
  if (!rawEndDate) validationErrors.endDate = 'End date is required';

  // check date logic
  if (rawStartDate && rawEndDate) {
    const start = new Date(rawStartDate);
    const end = new Date(rawEndDate);
    if (end < start) {
      validationErrors.endDate = 'End date cannot be earlier than start date'; //
    }
  }

  if (Object.keys(validationErrors).length > 0) {
    return { success: false, error: 'Please fix the errors below', validationErrors };
  }
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
