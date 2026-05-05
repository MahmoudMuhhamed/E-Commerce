import type { Brand } from '@/lib/products';
import Link from 'next/link';

import { FaArrowRightLong, FaTags } from "react-icons/fa6";


const API_URL = 'https://ecommerce.routemisr.com/api/v1/brands';

async function getBrands(): Promise<Brand[]> {
  const res = await fetch(API_URL, {
    next: { revalidate: 3600 },
  });

  if (!res.ok) {
    return [];
  }

  const data = await res.json();
  return data?.data ?? [];
}

export default async function BrandsPage() {
  const brands = await getBrands();

  return (



    <div className="min-h-screen bg-white dark:bg-black">


      <div className="bg-linear-to-br h-60 from-violet-600 via-violet-500 to-purple-400 text-white px-6 sm:px-10 lg:px-4 pt-16 pb-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-white/80 text-sm mb-6">
          <Link href="/" className="hover:text-white transition-colors">Home</Link>
          <span>/</span>
          <span className="text-white font-medium">Brands</span>
        </div>
 
        {/* Title Row */}
        <div className="flex items-center gap-4">
          <div className="w-17 h-17 bg-white/20 rounded-2xl flex items-center justify-center shrink-0 shadow-lg">
            <FaTags className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-white">Top Brands</h1>
            <p className="text-white/80 text mt-1 font-medium">Shop from your favorite brands</p>
          </div>
        </div>
      </div>



      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-4 py-12">
        <div className="grid gap-6 grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          {brands.map((brand) => (
            <Link
              key={brand._id}
              href={`/brands/${brand.slug}`}
              className="group hover:border-violet-200 overflow-hidden border pb-8 border-gray-100 rounded-xl bg-white p-6 shadow transition hover:-translate-y-1 hover:shadow-xl block"
            >
              <div className="flex h-48 p-3 items-center justify-center overflow-hidden rounded-3xl bg-zinc-50">
                <img
                  src={brand.image}
                  alt={brand.name}
                  className="h-full w-full object-cover flex group-hover:scale-105 transition-transform duration-400"
                />
              </div>
              <div className="mt-6 flex flex-col items-center justify-center">
                <h2 className="text-sm font-semibold text-zinc-900 dark:text-white group-hover:text-violet-600">{brand.name}</h2>
                    <p className='group-hover:opacity-100 flex opacity-0 transition-transform duration-300 items-center text-violet-600 text-xs'>View products <FaArrowRightLong className="w-2.5 h-2.5 ms-1"/></p>
              </div>
            </Link>
          ))}

          {brands.length === 0 && (
            <div className="col-span-full rounded-3xl border border-zinc-200 bg-white p-8 text-center text-zinc-600 shadow-sm">
              No brands are available at the moment.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
