'use client';

interface AdSlotCardProps {
  adSlot: {
    id: string;
    name: string;
    description?: string;
    type: string;
    basePrice: number;
    isAvailable: boolean;
  };
  onDelete: () => void;
  onUpdate: (formData: FormData) => void;
}

const typeColors: Record<string, string> = {
  DISPLAY: 'bg-blue-100 text-blue-700',
  VIDEO: 'bg-red-100 text-red-700',
  NEWSLETTER: 'bg-purple-100 text-purple-700',
  PODCAST: 'bg-orange-100 text-orange-700',
};

export function AdSlotCard({ adSlot, onDelete, onUpdate }: AdSlotCardProps) {
  const handleToggle = () => {
    const formData = new FormData();
    formData.append('name', adSlot.name);
    formData.append('type', adSlot.type);
    formData.append('basePrice', String(adSlot.basePrice));
    formData.append('isAvailable', String(!adSlot.isAvailable));

    onUpdate(formData);
  };

  return (
    <div className="group relative rounded-lg border border-[--color-border] p-4 transition-all hover:shadow-md">
      <button
        onClick={(e) => {
          e.preventDefault();
          if (confirm('Are you sure you want to delete this ad slot?')) {
            onDelete();
          }
        }}
        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 p-1 text-red-500 hover:bg-red-50 rounded transition-all z-10"
        title="Delete Slot"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
          />
        </svg>
      </button>

      <div className="mb-2 flex items-start justify-between pr-6">
        <h3 className="font-semibold">{adSlot.name}</h3>
        <span className={`rounded px-2 py-0.5 text-xs ${typeColors[adSlot.type] || 'bg-gray-100'}`}>
          {adSlot.type}
        </span>
      </div>

      {adSlot.description && (
        <p className="mb-3 text-sm text-[--color-muted] line-clamp-2">{adSlot.description}</p>
      )}

      <div className="flex items-center justify-between">
        <span
          className={`text-sm font-medium ${adSlot.isAvailable ? 'text-green-600' : 'text-gray-400'}`}
        >
          {adSlot.isAvailable ? '● Available' : '○ Booked'}
        </span>
        <span className="font-semibold text-[--color-primary]">
          ${Number(adSlot.basePrice).toLocaleString()}/mo
        </span>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-100 flex gap-2">
        <button
          onClick={() => alert('Edit modal logic goes here')}
          className="text-xs font-medium px-2 py-1 border rounded hover:bg-gray-50 transition-colors"
        >
          Edit
        </button>
        <button
          onClick={handleToggle}
          className="text-xs font-medium px-2 py-1 border rounded hover:bg-gray-50 transition-colors"
        >
          {adSlot.isAvailable ? 'Mark as Booked' : 'Mark as Available'}
        </button>
      </div>
    </div>
  );
}
