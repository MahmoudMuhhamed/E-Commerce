import Link from 'next/link';
import { GiFlame } from 'react-icons/gi';
import { PiStarFourFill } from 'react-icons/pi';
import { FaArrowRight } from 'react-icons/fa';

const promos = [
  {
    id: 1,
    badge: { icon: '🔥', label: 'Deal of the Day' },
    title: 'Fresh Organic Fruits',
    subtitle: 'Get up to 40% off on selected organic fruits',
    discount: '40% OFF',
    code: 'ORGANIC40',
    btnLabel: 'Shop Now',
    href: '/products',
    gradient: 'bg-linear-to-br from-emerald-500 to-emerald-700',
    btnColor: 'text-green-600',
    circle1: 'bg-green-400/30',
    circle2: 'bg-green-500/40',
  },
  {
    id: 2,
    badge: { icon: "✨", label: 'New Arrivals' },
    title: 'Exotic Vegetables',
    subtitle: 'Discover our latest collection of premium vegetables',
    discount: '25% OFF',
    code: 'FRESH25',
    btnLabel: 'Explore Now',
    href: '/products',
    gradient: 'bg-linear-to-br from-orange-400 to-rose-500',
    btnColor: 'text-orange-500',
    circle1: 'bg-orange-300/30',
    circle2: 'bg-orange-300/30',
  },
];

export default function PromoBanners() {
  return (

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {promos.map((promo) => (
          <div
            key={promo.id}
            className={`relative overflow-hidden rounded-2xl bg-linear-to-br ${promo.gradient} px-7 py-8 flex flex-col gap-3`}
          >
            {/* Decorative Circles */}
            <div className={`absolute -top-20 -right-20 w-40 h-40 rounded-full ${promo.circle1}`} />
            <div className={`absolute -bottom-16 -left-16 w-32 h-32 rounded-full ${promo.circle2}`} />

            {/* Badge */}
            <div className="relative z-10 mb-8 flex items-center gap-1.5 bg-white/20 backdrop-blur-sm w-fit px-3 py-1 rounded-full">
              {promo.badge.icon}
              <span className="text-white text-sm">{promo.badge.label}</span>
            </div>

            {/* Title */}
            <h2 className="relative z-10 text-2xl sm:text-3xl font-bold text-white leading-tight">
              {promo.title}
            </h2>

            {/* Subtitle */}
            <p className="relative z-10 text-white/85">
              {promo.subtitle}
            </p>

            {/* Discount + Code */}
            <div className="relative z-10 flex items-center gap-3">
              <span className="text-3xl font-extrabold text-white">{promo.discount}</span>
              <span className="text-white/80 text-sm font-medium">
                Use code: <strong className="text-white">{promo.code}</strong>
              </span>
            </div>

            {/* Button */}
            <Link
              href={promo.href}
              className={`relative z-10 mt-2 w-fit flex items-center gap-2 bg-white ${promo.btnColor} font-semibold text px-7 py-3 rounded-full hover:bg-white/90 transition-all shadow`}
            >
              {promo.btnLabel}
              <FaArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        ))}
      </div>




  );
}