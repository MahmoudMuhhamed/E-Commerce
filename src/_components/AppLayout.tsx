'use client';

import Navbar from '@/_components/Navbar';
import Footer from '@/_components/Footer';
import { CartProvider } from '@/context/CartContext';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </div>
    </CartProvider>
  );
}
