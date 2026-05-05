'use client';

import { useRouter } from 'next/navigation';
import { FaFilter } from 'react-icons/fa';

export default function BrandActiveFilters({ brandName }: { brandName: string }) {
  const router = useRouter();

  const clear = () => {
    router.push('/products');
  };

  return (
    <div className="border-b border-gray-100 bg-white py-4">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-4 flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 text-gray-800">
          <FaFilter className="w-3.5 h-3.5 text-gray-500" />
          <span className="text-sm font-bold">Active Filters:</span>
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-violet-100 px-3 py-1 text-sm font-medium text-violet-800">
          {brandName}
          <button
            type="button"
            onClick={clear}
            className="ml-0.5 rounded-full p-0.5 hover:bg-violet-200/80"
            aria-label={`Remove ${brandName} filter`}
          >
            ×
          </button>
        </span>
        <button
          type="button"
          onClick={clear}
          className="text-sm text-gray-500 underline underline-offset-2 hover:text-gray-800"
        >
          Clear all
        </button>
      </div>
    </div>
  );
}
