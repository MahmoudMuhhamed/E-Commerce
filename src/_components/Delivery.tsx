'use client';

import { useState } from 'react';
import { MdEmail } from 'react-icons/md';
import { FaTruck, FaTag, FaStar, FaMobileAlt } from 'react-icons/fa';
import { FaApple, FaGooglePlay } from 'react-icons/fa';
import { FaLeaf } from "react-icons/fa";
import { FaArrowRightLong } from "react-icons/fa6";


const perks = [
  { icon: <FaLeaf className="w-3 h-3 text-emerald-600 " />, label: 'Fresh Picks Weekly' },
  { icon: <FaTruck className="w-3.5 h-3.5 text-emerald-600" />, label: 'Free Delivery Codes' },
  { icon: <FaTag className="w-3 h-3 text-emerald-600" />, label: 'Members-Only Deals' },
];

export default function Delivery() {
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // handle subscription
    setEmail('');
  };

  return (
    <section className="x-4 sm:px-6 lg:px-10 py-10 mb-8">
      <div className="max-w-8xl shadow-2xl shadow-emerald-500/10 mx-auto bg-linear-to-br rounded-[2.5rem] from-emerald-50 via-white to-teal-50 border py-16 px-15 border-green-50">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

          {/* ── Newsletter Card ── */}
          <div className="lg:col-span-3 flex flex-col gap-6">

            {/* Badge */}
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-linear-to-br shadow-lg shadow-emerald-200 from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center shrink-0">
                <MdEmail className="w-6 h-6 text-white" />
              </div>
              <div className="flex flex-col gap-3">
                <p className="text-emerald-600 text-sm font-semibold tracking-widest uppercase">Newsletter</p>
                <p className="text-gray-500 text-xs font-medium">50,000+ subscribers</p>
              </div>
            </div>

            {/* Heading */}
            <div className='my-3'>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl mb-3 font-extrabold text-gray-900 leading-tight">
                Get the Freshest Updates{' '}
                <span className="text-emerald-600">Delivered Free</span>
              </h2>
              <p className="text-gray-500 text-lg font-medium lg:mt-7 mt-4">
                Weekly recipes, seasonal offers & exclusive member perks.
              </p>
            </div>

            {/* Perks */}
            <div className="flex flex-wrap gap-2">
              {perks.map((p) => (
                <div
                  key={p.label}
                  className="flex items-center shadow gap-2 bg-white border border-emerald-100 rounded-full px-4 py-2.5 text-sm text-gray-700"
                >
                    <p className='h-7 w-7 rounded-full flex justify-center items-center bg-emerald-100'>

                  {p.icon}
                    </p>
                  {p.label}
                </div>
              ))}
            </div>

            {/* Input + Button */}
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="flex-1 border-2 border-gray-200 rounded-xl px-4 py-4 font-medium shadow-md text text-gray-700 placeholder-gray-400 focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-100 transition-all"
              />
              <button
                type="submit"
                className="group flex items-center justify-center gap-3 px-8 py-4 rounded-2xl font-semibold text-base transition-all duration-300 shadow-lg bg-linear-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-teal-500  shadow-emerald-500/30 hover:shadow-emerald-500/40 hover:scale-[1.02] bg-green-500 hover:bg-green-600 text-white active:scale-95"
              >
                Subscribe
                <FaArrowRightLong className="w-4 h-4" />
              </button>
            </form>

            {/* Disclaimer */}
            <p className="flex items-center gap-1.5 text-xs font-medium text-gray-400">
              ✨
              Unsubscribe anytime. No spam, ever.
            </p>
          </div>

          {/* ── Mobile App Card ── */}
          <div className='lg:border-l lg:col-span-2 lg:border-emerald-100 lg:pl-8 max-w-130 lg:w  xl:w-130'>

          <div className="lg:col-span-2  bg-gray-900 rounded-3xl px-8 py-10 flex flex-col gap-6 relative overflow-hidden">
            {/* Decorative glow */}
            <div className="absolute -top-10 -right-10 w-48 h-48 bg-green-600/20 rounded-full blur-2xl" />
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-teal-600/20 rounded-full blur-2xl" />

            {/* Badge */}
            <div className="relative z-10 flex items-center gap-2 bg-green-500/20 border border-green-500/30 rounded-full w-fit px-3 py-1">
              
              <span className="text-green-400 text-xs font-bold tracking-widest uppercase">📱 Mobile App</span>
            </div>

            {/* Heading */}
            <div className="relative z-10">
              <h2 className="text-2xl font-extrabold text-white leading-tight">
                Shop Faster on Our App
              </h2>
              <p className="text-gray-400 font-medium text-sm mt-2">
                Get app-exclusive deals & 15% off your first order.
              </p>
            </div>

            {/* Store Buttons */}
            <div className="relative z-10 flex flex-col gap-3">
              <a
                href="#"
                className="flex items-center gap-4 bg-gray-800 hover:scale-102 hover:bg-gray-700 border border-gray-700 rounded-xl px-5 py-3.5 transition-all group"
              >
                <FaApple className="w-6 h-6 text-white shrink-0" />
                <div>
                  <p className="text-gray-400 text-[10px] uppercase tracking-widest">Download on</p>
                  <p className="text-white font-semibold text-sm">App Store</p>
                </div>
              </a>

              <a
                href="#"
                className="flex items-center hover:scale-102 gap-4 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-xl px-5 py-3.5 transition-all group"
              >
                <FaGooglePlay className="w-5 h-5 text-white shrink-0" />
                <div>
                  <p className="text-gray-400 text-[10px] uppercase tracking-widest">Get it on</p>
                  <p className="text-white font-semibold text-sm">Google Play</p>
                </div>
              </a>
            </div>

            {/* Rating */}
            <div className="relative z-10 flex items-center gap-2">
              <div className="flex items-center gap-0.5">
              <p className='text-xs'>⭐⭐⭐⭐⭐</p>
              </div>
              <span className="text-gray-400 font-medium text-sm">4.9 · 100K+ downloads</span>
            </div>
          </div>

          </div>

        </div>
      </div>
    </section>
  );
}