'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LuUserRound } from 'react-icons/lu';
import { FaWallet, FaArrowRight } from 'react-icons/fa';

export default function AccountHero() {
  const pathname = usePathname();
  const isOrders = pathname?.startsWith('/account/orders');

  if (isOrders) {
    return (
      <div className="bg-linear-to-r from-green-600 to-green-500 text-white py-10">
        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-4">
          <div className="flex items-center gap-2 text-sm mb-4 opacity-95">
            <Link href="/" className="hover:opacity-100 opacity-80 transition">
              Home
            </Link>
            <span>/</span>
            <span>My Orders</span>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 sm:w-16 sm:h-16 shrink-0 bg-white/20 rounded-xl flex items-center justify-center">
                <FaWallet className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold">My Orders</h1>
                <p className="text-white/90 text-sm mt-1">
                  Track and manage your orders
                </p>
              </div>
            </div>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 text-white font-semibold hover:underline shrink-0"
            >
              Continue Shopping
              <FaArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-linear-to-r from-green-600 to-green-500 text-white py-12">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-4">
        <div className="flex items-center gap-2 text-sm mb-5 mt-3 opacity-95">
          <Link href="/" className="hover:opacity-100 opacity-80 transition">
            Home
          </Link>
          <span>/</span>
          <span>My Account</span>
        </div>
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 sm:w-20 sm:h-20 shrink-0 bg-white rounded-2xl flex items-center justify-center shadow-md">
            <LuUserRound className="w-8 h-8 sm:w-10 sm:h-10 text-gray-500" />
          </div>
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold mb-1">My Account</h1>
            <p className="text-lg opacity-95">
              Manage your addresses and account settings
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
