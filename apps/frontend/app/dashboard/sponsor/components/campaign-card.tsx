'use client';

import { useState } from 'react';
import Link from 'next/link';
import { EditCampaignForm } from './edit-campaign-form';

interface CampaignCardProps {
  campaign: {
    id: string;
    name: string;
    description?: string;
    budget: number;
    spent: number;
    status: string;
    startDate: string;
    endDate: string;
  };
  onDelete: () => void;
}
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  return `${year}/${month}/${day}`;
};

const statusColors: Record<string, string> = {
  DRAFT: 'bg-gray-100 text-gray-600',
  ACTIVE: 'bg-green-100 text-green-700',
  PAUSED: 'bg-yellow-100 text-yellow-700',
  COMPLETED: 'bg-blue-100 text-blue-700',
};

export function CampaignCard({
  campaign,
  onDelete,
  onUpdate,
}: {
  campaign: any;
  onDelete: () => void;
  onUpdate: (formData: FormData) => void;
}) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const progress =
    campaign.budget > 0 ? (Number(campaign.spent) / Number(campaign.budget)) * 100 : 0;

  return (
    <div className="group relative rounded-lg border border-gray-200 p-4 transition-all hover:shadow-md bg-white">
      {/* delete */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          if (
            confirm('Are you sure you want to delete this campaign? This action cannot be undone.')
          ) {
            onDelete();
          }
        }}
        className="absolute top-2 right-2 opacity-100 group-hover:opacity-100 p-2 text-red-500 hover:bg-red-50 hover:text-red-700 rounded-full transition-all bg-white/80 shadow-sm border border-transparent hover:border-red-100"
        title="Delete Campaign"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
          />
        </svg>
      </button>

      <div className="mb-2 flex items-start justify-between pr-6">
        <h3 className="font-semibold">{campaign.name}</h3>
        <span
          className={`rounded px-2 py-0.5 text-[10px] font-bold uppercase ${statusColors[campaign.status] || 'bg-gray-100'}`}
        >
          {campaign.status}
        </span>
      </div>

      <p className="mb-3 text-xs text-gray-500 line-clamp-2 h-8">
        {campaign.description || 'No description'}
      </p>

      {/* progress bar */}
      <div className="mb-2">
        <div className="flex justify-between text-[11px] mb-1">
          <span className="text-gray-400 font-medium">BUDGET USAGE</span>
          <span className="font-bold">
            ${Number(campaign.spent).toLocaleString()} / ${Number(campaign.budget).toLocaleString()}
          </span>
        </div>
        <div className="h-1.5 rounded-full bg-gray-100">
          <div
            className="h-1.5 rounded-full bg-black transition-all duration-500"
            style={{ width: `${Math.min(progress, 100)}%` }}
          />
        </div>
      </div>

      <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-50">
        <div className="text-[10px] text-gray-500">
          {formatDate(campaign.startDate)} - {formatDate(campaign.endDate)}
        </div>
        <button
          onClick={() => setIsEditModalOpen(true)}
          className="px-3 py-1 text-xs font-bold bg-black text-white rounded-md hover:bg-gray-800"
        >
          Edit
        </button>
      </div>

      {isEditModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-2xl">
            <h2 className="text-xl font-bold mb-4">Edit Campaign</h2>
            <EditCampaignForm
              campaign={campaign}
              onSuccess={() => setIsEditModalOpen(false)}
              onUpdate={onUpdate}
            />
          </div>
        </div>
      )}
    </div>
  );
}
