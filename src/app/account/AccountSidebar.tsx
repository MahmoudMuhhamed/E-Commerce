'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FaChevronRight, FaMapMarkerAlt, FaCog, FaBoxOpen } from 'react-icons/fa';

const links = [
  { href: '/account/orders', label: 'My Orders', Icon: FaBoxOpen },
  { href: '/account/addresses', label: 'My Addresses', Icon: FaMapMarkerAlt },
  { href: '/account/settings', label: 'Settings', Icon: FaCog },
];

export default function AccountSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-full lg:w-72 shrink-0">
      <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-bold text-gray-900 mb-4">My Account</h2>
        <nav className="flex flex-col gap-2">
          {links.map(({ href, label, Icon }) => {
            const active =
              href === '/account/orders'
                ? pathname?.startsWith('/account/orders')
                : pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center justify-between rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
                  active
                    ? 'bg-green-600 text-white'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <span className="flex items-center gap-3">
                  <Icon className={`h-4 w-4 ${active ? 'text-white' : 'text-gray-400'}`} />
                  {label}
                </span>
                <FaChevronRight className={`h-3 w-3 ${active ? 'text-white' : 'text-gray-300'}`} />
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
