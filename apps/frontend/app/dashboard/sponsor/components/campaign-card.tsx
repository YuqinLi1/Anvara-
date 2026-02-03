'use client';

import { useState } from 'react';
import Link from 'next/link';
import { EditCampaignForm } from './edit-campaign-form'; // Import the new form

/**
 * Challenge 5 Requirement: Edit functionality
 */
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

const statusColors: Record<string, string> = {
  DRAFT: 'bg-gray-100 text-gray-600',
  ACTIVE: 'bg-green-100 text-green-700',
  PAUSED: 'bg-yellow-100 text-yellow-700',
  COMPLETED: 'bg-blue-100 text-blue-700',
};

export function CampaignCard({ campaign, onDelete }: CampaignCardProps) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const progress =
    campaign.budget > 0 ? (Number(campaign.spent) / Number(campaign.budget)) * 100 : 0;

  return (
    /**
     *  Added 'group relative'
     */
    <div className="group relative rounded-lg border border-[--color-border] p-4 transition-all hover:shadow-md">
      {/* Delete Button (Top Right) */}
      <button
        onClick={(e) => {
          e.preventDefault();
          if (confirm('Are you sure you want to delete this campaign?')) {
            onDelete();
          }
        }}
        
        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 p-1.5 text-red-500 hover:bg-red-50 rounded-md transition-all z-10"
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
          className={`rounded px-2 py-0.5 text-xs ${statusColors[campaign.status] || 'bg-gray-100'}`}
        >
          {campaign.status}
        </span>
      </div>

      {campaign.description && (
        <p className="mb-3 text-sm text-[--color-muted] line-clamp-2">{campaign.description}</p>
      )}

      <div className="mb-2">
        <div className="flex justify-between text-sm">
          <span className="text-[--color-muted]">Budget</span>
          <span>
            ${Number(campaign.spent).toLocaleString()} / ${Number(campaign.budget).toLocaleString()}
          </span>
        </div>
        <div className="mt-1 h-1.5 rounded-full bg-gray-200">
          <div
            className="h-1.5 rounded-full bg-[--color-primary]"
            style={{ width: `${Math.min(progress, 100)}%` }}
          />
        </div>
      </div>

      <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-100">
        <div className="text-[10px] text-[--color-muted] uppercase tracking-wider">
          {new Date(campaign.startDate).toLocaleDateString()} -{' '}
          {new Date(campaign.endDate).toLocaleDateString()}
        </div>

        <div className="flex gap-2">
          <Link
            href={`/dashboard/sponsor/campaigns/${campaign.id}`}
            className="px-3 py-1 text-xs font-medium border rounded hover:bg-gray-50 transition-colors"
          >
            View
          </Link>
          <button
          
            onClick={() => setIsEditModalOpen(true)}
            className="px-3 py-1 text-xs font-medium bg-gray-900 text-white rounded hover:bg-gray-800 transition-colors"
          >
            Edit
          </button>
        </div>
      </div>

      {/* Edit Modal implementation */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-2xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Edit Campaign</h2>
              <button 
                onClick={() => setIsEditModalOpen(false)} 
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            {/* Integrated the Edit Form component */}
            <EditCampaignForm 
              campaign={campaign} 
              onSuccess={() => setIsEditModalOpen(false)} 
            />
          </div>
        </div>
      )}
    </div>
  );
}