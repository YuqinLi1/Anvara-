'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useTransition } from 'react';

export function MarketplaceFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const handleFilterChange = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    // Reset to page 1 on new filter
    params.delete('page');

    startTransition(() => {
      router.push(`/marketplace?${params.toString()}`);
    });
  };

  return (
    <div className={`flex flex-wrap gap-4 items-end ${isPending ? 'opacity-50' : ''}`}>
      {/* Search Input */}
      <div className="flex flex-col gap-1">
        <label className="text-xs font-bold uppercase text-gray-500">Search</label>
        <input
          type="text"
          placeholder="Search slots..."
          className="border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
          onChange={(e) => handleFilterChange('search', e.target.value)}
          defaultValue={searchParams.get('search') || ''}
        />
      </div>

      {/* Type Filter */}
      <div className="flex flex-col gap-1">
        <label className="text-xs font-bold uppercase text-gray-500">Type</label>
        <select
          className="border rounded-lg px-3 py-2 text-sm outline-none"
          onChange={(e) => handleFilterChange('type', e.target.value)}
          defaultValue={searchParams.get('type') || ''}
        >
          <option value="">All Types</option>
          <option value="DISPLAY">Display</option>
          <option value="VIDEO">Video</option>
          <option value="NATIVE">Native</option>
        </select>
      </div>

      {/* Price Range */}
      <div className="flex flex-col gap-1">
        <label className="text-xs font-bold uppercase text-gray-500">Max Price</label>
        <input
          type="number"
          placeholder="Any"
          className="border rounded-lg px-3 py-2 text-sm w-24 outline-none"
          onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
          defaultValue={searchParams.get('maxPrice') || ''}
        />
      </div>
    </div>
  );
}
