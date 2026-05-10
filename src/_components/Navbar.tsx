'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { useWishlist } from '@/context/WishlistContext';
import { FaGift, FaUserPlus } from 'react-icons/fa';
import { FaTruck } from 'react-icons/fa';
import { FaPhoneAlt } from 'react-icons/fa';
import { LuUser, LuUserRound } from 'react-icons/lu';
import { LuUserRoundPlus } from 'react-icons/lu';
import { FaMagnifyingGlass } from 'react-icons/fa6';
import { FaRegHeart } from 'react-icons/fa6';
import { PiHeadsetFill } from 'react-icons/pi';
import { FaShoppingCart } from 'react-icons/fa';
import { FaRegCircleUser } from "react-icons/fa6";
import { LuMail } from 'react-icons/lu';
import { FaSignOutAlt } from 'react-icons/fa';
import {
  FaBars,
  FaTimes,
  FaUser,
  FaBoxOpen,
  FaMapMarkerAlt,
  FaCog,
  FaQuestionCircle,
  FaChevronDown,
} from 'react-icons/fa';

export default function Navbar() {
  const router = useRouter();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const [drawerCategoriesOpen, setDrawerCategoriesOpen] = useState(false);

  const { items } = useCart();
  const { user, logout } = useAuth();
  const { items: wishlistItems } = useWishlist();

  const cartCount = items.reduce((total, item) => total + item.quantity, 0);

  const submitSearch = () => {
    const q = searchQuery.trim();
    router.push(q ? `/search?q=${encodeURIComponent(q)}` : '/search');
    setDrawerOpen(false);
  };

  useEffect(() => {
    if (drawerOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [drawerOpen]);

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Shop', href: '/products' },
    { name: 'Brands', href: '/brands' },
  ];

  const categories = [
    { name: 'All Categories', href: '/categories' },
    { name: 'Electronics', href: '/categories/electronics' },
    { name: "women's Fashion", href: "/categories/women's-fashion" },
    { name: "Men's Fashion", href: "/categories/men's-fashion" },
    { name: 'Beauty & Health', href: '/categories/beauty-and-health' },
  ];

  const handleLogout = () => {
    logout();
    setDrawerOpen(false);
    setUserMenuOpen(false);
  };

  const SearchField = ({ className = '' }: { className?: string }) => (
    <div className={`relative flex-1 max-w-xl ${className}`}>
      <input
        type="search"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') submitSearch();
        }}
        placeholder="Search for products, brands and more..."
        className="w-full pl-4 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-full text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-100 transition-all"
        aria-label="Search products"
      />
      <button
        type="button"
        onClick={submitSearch}
        className="absolute right-1 top-1/2 -translate-y-1/2 bg-green-600 hover:bg-green-700 text-white rounded-full w-9 h-9 flex items-center justify-center transition-colors"
        aria-label="Search"
      >
        <FaMagnifyingGlass className="w-3.5 h-3.5" />
      </button>
    </div>
  );

  return (
    <header className="w-full shadow-sm">
      {/* Top announcement — tablet+ (green bar, white text) */}
      <div className="hidden md:block text-gray-500 font-medium border-b border-gray-200 p-0.5">
        <div className="max-w-8xl mx-auto px-4 py-2 flex flex-wrap items-center justify-between gap-3 text-xs sm:text-sm">
          <div className="flex flex-wrap items-center gap-6">
            <span className="flex items-center gap-2 font-medium">
              <FaTruck className="w-3.5 h-3.5 shrink-0 text-green-600" />
              Free Shipping on Orders 500 EGP
            </span>
            <span className="flex items-center gap-2 font-medium">
              <FaGift className="w-3 h-3 shrink-0 text-green-600" />
              New Arrivals Daily
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <a
              href="tel:+18001234567"
              className="flex items-center gap-1.5 hover:text-green-600 opacity-95"
            >
              <FaPhoneAlt className="w-3 h-3" />
              +1 (800) 123-4567
            </a>
            <a
              href="mailto:support@freshcart.com"
              className="hidden border-e sm:flex items-center gap-1.5 hover:text-green-600 opacity-95 ps-4 pe-7"
            >
              <LuMail className="w-3.5 h-3" />
              support@freshcart.com
            </a>
            {user ? (
              <>
                <span className="hidden lg:flex items-center hover:text-green-600 justify-center gap-1.5 font-medium border-l border-white/30 pl-4">
                <LuUser className="w-3.5 h-3.5" />
                  {user.name}
                </span>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="hidden hover:text-red-600 lg:inline-flex items-center gap-1 font-medium"
                >
                  <FaSignOutAlt className="w-3 h-3" />
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/signin"
                  className="hidden lg:inline-flex items-center gap-1 hover:text-green-600 font-medium border-l border-white/30 pl-4"
                >
                  <LuUserRound className="w-4 h-4" />
                  Sign In
                </Link>
                <Link href="/signup" className="hidden hover:text-green-600 lg:inline-flex items-center gap-1 font-medium">
                  <FaUserPlus className="w-4 h-4 text-gray-600" />
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      <div className=" bg-white px-4 py-2 sticky! top-0! border-b border-gray-200">
        <div className="max-w-8xl flex flex-col gap-3 ">
          {/* Main toolbar */}
          <div className="flex items-center gap-2 lg:gap-4">
            <Link href="/" className="flex items-center gap-2 shrink-0">
              <img
                src="https://freshcart-route.vercel.app/_next/static/media/freshcart-logo.49f1b44d.svg"
                alt="FreshCart"
                className="h-8 sm:h-9"
              />
            </Link>

            {/* Search — tablet+ */}
            <div className="hidden md:flex flex-1 justify-center min-w-0 px-2">
              <SearchField className="w-full max-w-md lg:max-w-xl" />
            </div>

            {/* Desktop nav — between search and icons */}
            <nav className="hidden lg:flex items-center  gap-2 shrink-0">
                  <Link
                  key='Home'
                  href='/'
                  className="px-2.5 py-2 font-medium text-md text-gray-700 hover:text-green-600 rounded-md transition-all whitespace-nowrap"
                >
                  Home
                </Link>
                  <Link
                  key='Home'
                  href='/products'
                  className="px-2.5 py-2 font-medium text-md text-gray-700 hover:text-green-600 rounded-md transition-all whitespace-nowrap"
                >
                  Shop
                </Link>

              <div className="relative">
                <button
                  type="button"
                  onClick={() => setCategoriesOpen(!categoriesOpen)}
                  className="flex items-center gap-1 px-2.5 py-2 font-medium text-md text-gray-700 hover:text-green-600 rounded-md transition-all"
                >
                  Categories
                  <FaChevronDown
                    className={`w-3 h-3 transition-transform ${categoriesOpen ? 'rotate-180' : ''}`}
                  />
                </button>
                {categoriesOpen && (
                  <div className="absolute top-full left-0 mt-1 w-52 bg-white border border-gray-100 rounded-xl shadow-lg py-2 z-100">
                    {categories.map((cat) => (
                      <Link
                        key={cat.name}
                        href={cat.href}
                        onClick={() => setCategoriesOpen(false)}
                        className="block px-4 py-2 font-medium text-gray-600 hover:text-green-600 transition-colors"
                      >
                        {cat.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
                  <Link
                  key='shop'
                  href='/brands'
                  className="px-2.5 py-2 font-medium text-md text-gray-700 hover:text-green-600 rounded-md transition-all whitespace-nowrap"
                >
                  Brands
                </Link>
            </nav>

            {/* Right cluster */}
            <div className="flex items-center gap-1 sm:gap-2 shrink-0 ml-auto">
              <Link
                href="/contact"
                className="hidden md:flex py-2.5 pe-3 border-e border-gray-200 items-center justify-center gap-1.5 "
                aria-label="Support"
              >
                <div className='rounded-full bg-green-100 p-2.5'>
                <PiHeadsetFill className="w-4 h-4 text-green-700" />
                </div>
                <div className='text-xs font-medium'>
                  <p className='text-gray-400'>Support</p>
                  <span className='text-gray-600'>24/7 Help</span>
                </div>
              </Link>

              <Link
                href="/wishlist"
                className="relative p-3.5 text-gray-500 hover:bg-gray-100 hover:text-green-600 rounded-full"
              >
                <FaRegHeart className="w-5.5 h-5.5" />
                {user && wishlistItems.length > 0 && (
                  <span className="absolute top-0 right-0 bg-red-500 text-white text-[10px] font-bold rounded-full min-w-4.5 h-4.5 flex items-center justify-center px-0.5">
                    {wishlistItems.length > 9 ? '9+' : wishlistItems.length}
                  </span>
                )}
              </Link>

              <Link
                href="/cart"
                className="relative p-3.5 text-gray-500 hover:text-green-600 hover:bg-gray-100 rounded-full"
              >
                <FaShoppingCart className="w-5.5 h-5.5" />
                {cartCount > 0 && (
                  <span className="absolute top-0 right-0 bg-green-500 text-white text-[10px] font-bold rounded-full  min-w-4.5 h-4.5 flex items-center justify-center px-0.5">
                    {cartCount > 9 ? '9+' : cartCount}
                  </span>
                )}
              </Link>

              {/* Desktop user menu */}
              <div className="relative hidden lg:block">
                {user ? (
                  <>
                    <button
                      type="button"
                      onClick={() => setUserMenuOpen(!userMenuOpen)}
                      className="flex items-center justify-center h-12 w-12  hover:text-green-600 hover:bg-gray-100 rounded-full"
                      aria-expanded={userMenuOpen}
                      aria-haspopup="true"
                    >
                      <FaRegCircleUser className="w-5 h-5" />
                    </button>
                    {userMenuOpen && (
                      <>
                        <button
                          type="button"
                          className="fixed inset-0 z-40 cursor-default"
                          aria-label="Close menu"
                          onClick={() => setUserMenuOpen(false)}
                        />
                        <div className="absolute right-0 top-full mt-2 z-50 w-64 rounded-xl border border-gray-100 bg-white shadow-xl py-2">
                          <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-100">
                            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-green-100 text-green-600">
                              <LuUserRound className="w-5 h-5" />
                            </span>
                            <span className="font-semibold text-gray-900 truncate">
                              {user.name}
                            </span>
                          </div>
                          <Link
                            href="/account/settings"
                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
                            onClick={() => setUserMenuOpen(false)}
                          >
                            <FaUser className="w-4 h-4 text-gray-400" /> My Profile
                          </Link>
                          <Link
                            href="/account/orders"
                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
                            onClick={() => setUserMenuOpen(false)}
                          >
                            <FaBoxOpen className="w-4 h-4 text-gray-400" /> My Orders
                          </Link>
                          <Link
                            href="/wishlist"
                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
                            onClick={() => setUserMenuOpen(false)}
                          >
                            <FaRegHeart className="w-4 h-4 text-gray-400" /> My Wishlist
                          </Link>
                          <Link
                            href="/account/addresses"
                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
                            onClick={() => setUserMenuOpen(false)}
                          >
                            <FaMapMarkerAlt className="w-4 h-4 text-gray-400" /> Addresses
                          </Link>
                          <Link
                            href="/account/settings"
                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
                            onClick={() => setUserMenuOpen(false)}
                          >
                            <FaCog className="w-4 h-4 text-gray-400" /> Settings
                          </Link>
                          <button
                            type="button"
                            onClick={() => {
                              handleLogout();
                              setUserMenuOpen(false);
                            }}
                            className="flex w-full items-center gap-3 px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 border-t border-gray-100 mt-1"
                          >
                            <FaSignOutAlt className="w-4 h-4" /> Sign Out
                          </button>
                        </div>
                      </>
                    )}
                  </>
                ) : (
                  <Link
                    href="/signin"
                    className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold px-5 py-2.5 rounded-full transition-colors"
                  >
                    <LuUserRound className="w-4 h-4" />
                    Sign In
                  </Link>
                )}
              </div>

              {/* Hamburger — drawer for &lt; xl */}
              <button
                type="button"
                onClick={() => setDrawerOpen(true)}
                className="lg:hidden flex items-center justify-center h-10 w-10 rounded-full bg-green-600 text-white hover:bg-green-700 shadow-sm"
                aria-label="Open menu"
              >
                <FaBars className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Mobile search row */}
          <div className="md:hidden pb-1">
            <SearchField className="w-full max-w-none" />
          </div>
        </div>
      </div>

      {/* Slide-in drawer */}
      {drawerOpen && (
        <div className="fixed inset-0 z-60 lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            aria-label="Close menu"
            onClick={() => setDrawerOpen(false)}
          />
          <div className="absolute right-0 top-0 h-full w-full max-w-sm bg-white shadow-2xl flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-gray-100">
              <span className="font-bold text-gray-900">Menu</span>
              <button
                type="button"
                onClick={() => setDrawerOpen(false)}
                className="p-2 rounded-lg hover:bg-gray-100 text-gray-600"
                aria-label="Close"
              >
                <FaTimes className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 border-b border-gray-100">
              <SearchField className="max-w-none w-full" />
            </div>

            <div className="flex-1 overflow-y-auto py-2">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setDrawerOpen(false)}
                  className="block px-4 py-3 text-sm font-medium text-gray-800 hover:bg-green-50 hover:text-green-700"
                >
                  {link.name}
                </Link>
              ))}
              <button
                type="button"
                onClick={() => setDrawerCategoriesOpen(!drawerCategoriesOpen)}
                className="flex w-full items-center justify-between px-4 py-3 text-sm font-medium text-gray-800 hover:bg-green-50"
              >
                Categories
                <FaChevronDown
                  className={`w-3 h-3 transition-transform ${drawerCategoriesOpen ? 'rotate-180' : ''}`}
                />
              </button>
              {drawerCategoriesOpen &&
                categories.map((cat) => (
                  <Link
                    key={cat.name}
                    href={cat.href}
                    onClick={() => setDrawerOpen(false)}
                    className="block pl-8 pr-4 py-2 text-sm text-gray-600 hover:text-green-600"
                  >
                    {cat.name}
                  </Link>
                ))}

              <Link
                href="/wishlist"
                onClick={() => setDrawerOpen(false)}
                className="flex items-center justify-between px-4 py-3 text-sm font-medium text-gray-800 hover:bg-green-50 border-t border-gray-100 mt-2"
              >
                <span className="flex items-center gap-2">
                  <FaRegHeart className="text-gray-500" /> Wishlist
                </span>
                {user && wishlistItems.length > 0 && (
                  <span className="bg-red-500 text-white text-[10px] font-bold rounded-full min-w-[20px] h-5 px-1.5 flex items-center justify-center">
                    {wishlistItems.length > 9 ? '9+' : wishlistItems.length}
                  </span>
                )}
              </Link>
              <Link
                href="/cart"
                onClick={() => setDrawerOpen(false)}
                className="flex items-center justify-between px-4 py-3 text-sm font-medium text-gray-800 hover:bg-green-50"
              >
                <span className="flex items-center gap-2">
                  <FaShoppingCart className="text-gray-500" /> Cart
                </span>
                {cartCount > 0 && (
                  <span className="bg-green-500 text-white text-[10px] font-bold rounded-full min-w-[20px] h-5 px-1.5 flex items-center justify-center">
                    {cartCount > 9 ? '9+' : cartCount}
                  </span>
                )}
              </Link>

              {user ? (
                <>
                  <div className="flex items-center gap-2 px-4 py-3 text-sm text-gray-700 border-t border-gray-100 mt-2">
                    <LuUserRound className="text-green-600 w-5 h-5" />
                    <span className="font-semibold truncate">{user.name}</span>
                  </div>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex w-full items-center gap-2 px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50"
                  >
                    <FaSignOutAlt className="w-4 h-4" /> Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/signin"
                    onClick={() => setDrawerOpen(false)}
                    className="block px-4 py-3 text-sm font-medium text-green-600 border-t border-gray-100"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/signup"
                    onClick={() => setDrawerOpen(false)}
                    className="block px-4 py-3 text-sm font-medium text-gray-700"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>

            <div className="p-4 border-t border-gray-100 bg-gray-50">
              <Link
                href="/contact"
                onClick={() => setDrawerOpen(false)}
                className="flex items-start gap-3 text-sm text-gray-700"
              >
                <FaQuestionCircle className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                <span>
                  <span className="font-semibold text-gray-900">Need Help?</span>{' '}
                  Contact Support
                </span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
