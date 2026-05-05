'use client';

import Link from 'next/link';
import { useCallback, useMemo, useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { FaMagnifyingGlass } from 'react-icons/fa6';
import { FaFilter } from 'react-icons/fa';
import { FaTh, FaListUl } from 'react-icons/fa';
import { Card } from '@/_components/ClientCard';
import type { ProductType } from '@/_components/ProductCard';
import type { CategoryListItem } from '@/lib/ecommerceApi';

type SortKey = 'relevance' | 'price-asc' | 'price-desc' | 'newest';

function effectivePrice(p: ProductType): number {
  const after = p.priceAfterDiscount;
  if (after !== undefined && after > 0 && after < p.price) return after;
  return p.price;
}

type Props = {
  initialQuery: string;
  products: ProductType[];
  categories: CategoryListItem[];
};

export default function SearchResultsClient({
  initialQuery,
  products,
  categories,
}: Props) {
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(initialQuery);
  const [selectedCats, setSelectedCats] = useState<Set<string>>(new Set());
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [sort, setSort] = useState<SortKey>('relevance');
  const [view, setView] = useState<'grid' | 'list'>('grid');

  useEffect(() => {
    const q = searchParams.get('q') ?? '';
    setQuery(q);
  }, [searchParams]);

  const toggleCategory = useCallback((id: string) => {
    setSelectedCats((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const removeCategoryPill = useCallback((id: string) => {
    setSelectedCats((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  }, []);

  const clearAllFilters = useCallback(() => {
    setSelectedCats(new Set());
    setMinPrice('');
    setMaxPrice('');
    setQuery('');
    setSort('relevance');
  }, []);

  const parsedMin = minPrice === '' ? null : Number(minPrice);
  const parsedMax = maxPrice === '' ? null : Number(maxPrice);

  const filtered = useMemo(() => {
    let list = [...products];
    const q = query.trim().toLowerCase();

    if (q) {
      list = list.filter((p) => p.title.toLowerCase().includes(q));
    }

    if (selectedCats.size > 0) {
      list = list.filter((p) => {
        const cid = p.category?._id;
        return cid && selectedCats.has(cid);
      });
    }

    if (parsedMin !== null && !Number.isNaN(parsedMin)) {
      list = list.filter((p) => effectivePrice(p) >= parsedMin);
    }
    if (parsedMax !== null && !Number.isNaN(parsedMax)) {
      list = list.filter((p) => effectivePrice(p) <= parsedMax);
    }

    switch (sort) {
      case 'price-asc':
        list.sort((a, b) => effectivePrice(a) - effectivePrice(b));
        break;
      case 'price-desc':
        list.sort((a, b) => effectivePrice(b) - effectivePrice(a));
        break;
      case 'newest': {
        list.sort((a, b) => {
          const da = (a as { createdAt?: string }).createdAt ?? '';
          const db = (b as { createdAt?: string }).createdAt ?? '';
          return db.localeCompare(da);
        });
        break;
      }
      case 'relevance':
      default:
        if (q) {
          list.sort((a, b) => {
            const ia = a.title.toLowerCase().indexOf(q);
            const ib = b.title.toLowerCase().indexOf(q);
            const sa = ia === -1 ? 9999 : ia;
            const sb = ib === -1 ? 9999 : ib;
            return sa - sb;
          });
        }
        break;
    }

    return list;
  }, [products, query, selectedCats, parsedMin, parsedMax, sort]);

  const selectedCount = selectedCats.size;

  const gridClass =
    view === 'grid'
      ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5'
      : 'flex flex-col gap-4';

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-4 py-6">
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
          <Link href="/" className="hover:text-green-600">
            Home
          </Link>
          <span>/</span>
          <span className="text-gray-900 font-medium">Search Results</span>
        </div>

        <div className="relative mb-8">
          <FaMagnifyingGlass className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for products..."
            className="w-full rounded-xl border border-gray-200 bg-white py-3.5 pl-12 pr-4 text-gray-800 placeholder:text-gray-400 shadow-sm focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-100"
            aria-label="Search products"
          />
        </div>

        <div className="flex flex-col gap-8 lg:flex-row lg:items-start">
          {/* Sidebar */}
          <aside className="w-full shrink-0 lg:w-72 xl:w-80">
            <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
              <div className="mb-6 flex items-center justify-between border-b border-gray-100 pb-4">
                <h2 className="text-base font-bold text-gray-900">Categories</h2>
                <span className="text-sm font-semibold text-green-600">
                  {selectedCount} selected
                </span>
              </div>
              <div className="max-h-64 overflow-y-auto pr-1 space-y-2.5">
                {categories.map((cat) => (
                  <label
                    key={cat._id}
                    className="flex cursor-pointer items-center gap-3 text-sm text-gray-700 hover:text-gray-900"
                  >
                    <input
                      type="checkbox"
                      checked={selectedCats.has(cat._id)}
                      onChange={() => toggleCategory(cat._id)}
                      className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
                    />
                    <span className="leading-tight">{cat.name}</span>
                  </label>
                ))}
              </div>

              <div className="mt-8 border-t border-gray-100 pt-6">
                <h2 className="text-base font-bold text-gray-900 mb-4">Price Range</h2>
                <div className="flex gap-3">
                  <div className="flex-1">
                    <label className="text-xs text-gray-500">Min (EGP)</label>
                    <input
                      type="number"
                      min={0}
                      value={minPrice}
                      onChange={(e) => setMinPrice(e.target.value)}
                      placeholder="0"
                      className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="text-xs text-gray-500">Max (EGP)</label>
                    <input
                      type="number"
                      min={0}
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(e.target.value)}
                      placeholder="No limit"
                      className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                    />
                  </div>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setMinPrice('');
                      setMaxPrice('500');
                    }}
                    className="rounded-full bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-200"
                  >
                    Under 500
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setMinPrice('');
                      setMaxPrice('1000');
                    }}
                    className="rounded-full bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-200"
                  >
                    Under 1K
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setMinPrice('');
                      setMaxPrice('5000');
                    }}
                    className="rounded-full bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-200"
                  >
                    Under 5K
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setMinPrice('');
                      setMaxPrice('10000');
                    }}
                    className="rounded-full bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-200"
                  >
                    Under 10K
                  </button>
                </div>
              </div>
            </div>
          </aside>

          {/* Main */}
          <div className="min-w-0 flex-1">
            <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setView('grid')}
                  className={`flex h-10 w-10 items-center justify-center rounded-lg border transition ${
                    view === 'grid'
                      ? 'border-green-600 bg-green-600 text-white'
                      : 'border-gray-200 bg-white text-gray-500 hover:border-gray-300'
                  }`}
                  aria-label="Grid view"
                >
                  <FaTh className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setView('list')}
                  className={`flex h-10 w-10 items-center justify-center rounded-lg border transition ${
                    view === 'list'
                      ? 'border-green-600 bg-green-600 text-white'
                      : 'border-gray-200 bg-white text-gray-500 hover:border-gray-300'
                  }`}
                  aria-label="List view"
                >
                  <FaListUl className="w-4 h-4" />
                </button>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600 whitespace-nowrap">Sort by:</span>
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value as SortKey)}
                  className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-800 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                >
                  <option value="relevance">Relevance</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="newest">Newest</option>
                </select>
              </div>
            </div>

            <div className="mb-6 flex flex-wrap items-center gap-2 rounded-lg bg-white px-3 py-3 shadow-sm border border-gray-100">
              <FaFilter className="w-3.5 h-3.5 text-gray-500 shrink-0" />
              <span className="text-sm font-bold text-gray-800">Active:</span>
              {Array.from(selectedCats).map((id) => {
                const cat = categories.find((c) => c._id === id);
                if (!cat) return null;
                return (
                  <span
                    key={id}
                    className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2.5 py-1 text-xs font-medium text-green-800"
                  >
                    {cat.name}
                    <button
                      type="button"
                      onClick={() => removeCategoryPill(id)}
                      className="font-bold hover:text-green-950"
                      aria-label={`Remove ${cat.name}`}
                    >
                      ×
                    </button>
                  </span>
                );
              })}
              {selectedCats.size === 0 && (
                <span className="text-xs text-gray-400">No category filters</span>
              )}
              <button
                type="button"
                onClick={clearAllFilters}
                className="ml-auto text-sm text-gray-500 underline underline-offset-2 hover:text-gray-800"
              >
                Clear all
              </button>
            </div>

            <p className="text-sm text-gray-500 mb-6">
              Showing {filtered.length} product{filtered.length === 1 ? '' : 's'}
            </p>

            {filtered.length === 0 ? (
              <div className="rounded-xl border border-dashed border-gray-200 bg-white py-16 text-center text-gray-500">
                No products match your filters. Try adjusting search or filters.
              </div>
            ) : (
              <div className={gridClass}>
                {filtered.map((product) => (
                  <Card
                    key={String(product.id ?? product._id)}
                    product={product}
                    layout={view === 'grid' ? 'grid' : 'list'}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
