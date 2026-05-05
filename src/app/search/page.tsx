import { Suspense } from 'react';
import SearchResultsClient from './SearchResultsClient';
import { fetchAllProducts, fetchCategories } from '@/lib/ecommerceApi';
import type { ProductType } from '@/_components/ProductCard';

type PageProps = {
  searchParams: Promise<{ q?: string }>;
};

export default async function SearchPage({ searchParams }: PageProps) {
  const q = (await searchParams).q ?? '';
  const [products, categories] = await Promise.all([
    fetchAllProducts(),
    fetchCategories(),
  ]);

  return (
    <Suspense
      fallback={
        <div className="flex min-h-[50vh] items-center justify-center bg-gray-50 text-gray-500">
          Loading search…
        </div>
      }
    >
      <SearchResultsClient
        initialQuery={q}
        products={products as unknown as ProductType[]}
        categories={categories}
      />
    </Suspense>
  );
}
