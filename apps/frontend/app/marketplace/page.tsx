import { AdSlotGrid } from './components/ad-slot-grid';
import { MarketplaceFilters } from './components/marketplace-filters';
import { Suspense } from 'react';

// 1. Server-side pagination with searchParams
// 2. Filtering by category, price range, slot type
// 3. Search functionality

interface MarketplaceProps {
  searchParams: Promise<{
    page?: string;
    type?: string;
    maxPrice?: string;
    search?: string;
  }>;
}

export default async function MarketplacePage({ searchParams }: MarketplaceProps) {
  const filters = await searchParams;

  // Construct query for the server-side fetch inside AdSlotGrid
  const query = new URLSearchParams({
    available: 'true',
    ...(filters.type && { type: filters.type }),
    ...(filters.maxPrice && { maxPrice: filters.maxPrice }),
    ...(filters.search && { search: filters.search }),
    page: filters.page || '1',
  }).toString();

  return (
    <div className="space-y-8 p-6">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Marketplace</h1>
          <p className="text-[--color-muted]">Browse available ad slots from our publishers</p>
        </div>

        {/* Client Component: Handles inputs and URL updates */}
        <MarketplaceFilters />
      </div>

      {/*  Fetching logic moved to Server Component inside AdSlotGrid */}
      <Suspense key={query} fallback={<MarketplaceSkeleton />}>
        <AdSlotGrid query={query} />
      </Suspense>
    </div>
  );
}

function MarketplaceSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-pulse">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="h-64 bg-gray-100 rounded-xl" />
      ))}
    </div>
  );
}
