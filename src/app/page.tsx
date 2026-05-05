import Delivery from '@/_components/Delivery';
import Hero from '@/_components/Hero';
import HomeCategory from '@/_components/HomeCategory';
import Navbar from '@/_components/Navbar';
import ProductCard from '@/_components/ProductCard';
import PromoBanners from '@/_components/PromoBanners';
import Link from 'next/link';
import { FaTruck, FaShieldAlt, FaUndo, FaHeadset } from 'react-icons/fa';


const features = [
  {
    icon: <FaTruck className="w-6 h-6 text-blue-500" />,
    bg: 'bg-blue-50',
    title: 'Free Shipping',
    subtitle: 'On orders over 500 EGP',
  },
  {
    icon: <FaShieldAlt className="w-6 h-6 text-green-500" />,
    bg: 'bg-green-50',
    title: 'Secure Payment',
    subtitle: '100% secure transactions',
  },
  {
    icon: <FaUndo
    className="w-5 h-5 text-orange-500" />,
    bg: 'bg-orange-50',
    title: 'Easy Returns',
    subtitle: '14-day return policy',
  },
  {
    icon: <FaHeadset className="w-6 h-6 text-purple-500" />,
    bg: 'bg-purple-50',
    title: '24/7 Support',
    subtitle: 'Dedicated support team',
  },
];



export default function Home() {
  // const featuredProducts = products.slice(0, 6);

  return (

    <div className="flex flex-col bg-white">
      {/* Hero Section */}
      <Hero />

      {/* Feature Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 px-4 sm:px-6 lg:px-8 py-8 bg-gray-50">
        {features.map((f, idx) => (
          <div
            key={idx}
            className="flex items-center gap-3 bg-white rounded-xl border border-gray-100 px-4 py-4 shadow-sm hover:shadow-md transition-all duration-200"
          >
            <div className={`w-11 h-11 rounded-full ${f.bg} flex items-center justify-center shrink-0`}>
              {f.icon}
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-800">{f.title}</p>
              <p className="text-xs text-gray-400 mt-0.5">{f.subtitle}</p>
            </div>
          </div>
        ))}
      </div>
      {/* Featured Categories */}
      <section className="py-12 sm:py-16 lg:py-10">
        <HomeCategory />
      </section>
      <section className="px-6 sm:px-6 lg:px-10 mb-4 lg:mb-10">
        <PromoBanners />
      </section>

      {/* Featured Products */}
      <section className="py-12 sm:py-16 lg:py-20">
        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-zinc-900 dark:text-black flex items-center">
              <span className="w-1.5 h-8 bg-green-600 rounded-full inline-block me-2"></span>
              Featured <span className='text-green-600 ms-1'> Products</span>
            </h2>
          </div>
          <div>
            <ProductCard />
          </div>
        </div>
      </section>

      {/* Delivery Section */}
      <section>
        <Delivery />
      </section>

    </div>
  );
}
