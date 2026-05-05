'use client';

import ProductCard from '@/_components/ProductCard';
import { useState } from 'react';
import Link from 'next/link';
import { FaBoxOpen } from "react-icons/fa";


export default function products() {
  const [sortBy, setSortBy] = useState('popular');

  const handleSort = (sortType: string) => {
    setSortBy(sortType);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      {/* Header */}
          <div className="bg-linear-to-br h-56 from-green-600 via-green-500 to-green-400 text-white px-6 sm:px-10 lg:px-4 pt-14 pb-6">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-white/80 text-sm mb-6">
              <Link href="/" className="hover:text-white transition-colors">Home</Link>
              <span>/</span>
              <span className="text-white font-medium">All Products</span>
            </div>
            {/* Title Row */}
            <div className="flex items-center gap-4">
              <div className="w-17 h-17 bg-white/20 rounded-2xl flex items-center justify-center shrink-0 shadow-lg">
                <FaBoxOpen className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold text-white">All Products</h1>
                <p className="text-white/80 text mt-1 font-medium">Explore our complete product collection</p>
              </div>
            </div>
          </div>

      {/* Products Section */}
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-4 py-7">
        {/* Sorting */}
        <div className='mb-7'>

          <h1 className='text-gray-500 font-medium text-sm'>Showing 40 products</h1>
        </div>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <ProductCard />
        </div>


      </div>
    </div>
  );
}
