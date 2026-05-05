import Link from 'next/link';
import { FaTruck, FaUndo, FaShieldAlt, FaHeadset } from 'react-icons/fa';
import { FaFacebookF, FaTwitter, FaInstagram, FaYoutube } from 'react-icons/fa';
import { MdPhone, MdEmail, MdLocationOn } from 'react-icons/md';
import { BsCreditCard2Front } from 'react-icons/bs';

const features = [
  { icon: <FaTruck className="w-5 h-5 text-green-600" />, title: 'Free Shipping', subtitle: 'On orders over 500 EGP' },
  { icon: <FaUndo className="w-5 h-5 text-green-600" />, title: 'Easy Returns', subtitle: '14-day return policy' },
  { icon: <FaShieldAlt className="w-5 h-5 text-green-600" />, title: 'Secure Payment', subtitle: '100% secure checkout' },
  { icon: <FaHeadset className="w-5 h-5 text-green-600" />, title: '24/7 Support', subtitle: 'Contact us anytime' },
];

const footerLinks = [
  {
    title: 'Shop',
    links: [
      { label: 'All Products', href: '/products' },
      { label: 'Categories', href: '/categories' },
      { label: 'Brands', href: '/brands' },
      { label: 'Electronics', href: '/categories/electronics' },
      { label: "Men's Fashion", href: '/categories/mens-fashion' },
      { label: "Women's Fashion", href: '/categories/womens-fashion' },
    ],
  },
  {
    title: 'Account',
    links: [
      { label: 'My Account', href: '/account' },
      { label: 'Order History', href: '/orders' },
      { label: 'Wishlist', href: '/wishlist' },
      { label: 'Shopping Cart', href: '/cart' },
      { label: 'Sign In', href: '/signin' },
      { label: 'Create Account', href: '/signup' },
    ],
  },
  {
    title: 'Support',
    links: [
      { label: 'Contact Us', href: '/contact' },
      { label: 'Help Center', href: '/help' },
      { label: 'Shipping Info', href: '/shipping' },
      { label: 'Returns & Refunds', href: '/returns' },
      { label: 'Track Order', href: '/track' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { label: 'Privacy Policy', href: '/privacy' },
      { label: 'Terms of Service', href: '/terms' },
      { label: 'Cookie Policy', href: '/cookies' },
    ],
  },
];

const socials = [
  { icon: <FaFacebookF className="w-4 h-4" />, href: '#', label: 'Facebook' },
  { icon: <FaTwitter className="w-4 h-4" />, href: '#', label: 'Twitter' },
  { icon: <FaInstagram className="w-4 h-4" />, href: '#', label: 'Instagram' },
  { icon: <FaYoutube className="w-4 h-4" />, href: '#', label: 'YouTube' },
];

export default function Footer() {
  return (
    <footer>
      {/* Feature Strip */}
      <div className="bg-green-50 border-t border-green-100 px-4 sm:px-6 lg:px-10 py-7">
        <div className="max-w-8xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map((f, idx) => (
            <div key={idx} className="flex items-center gap-3">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center  shrink-0">
                {f.icon}
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-800">{f.title}</p>
                <p className="text-xs font-medium text-gray-500">{f.subtitle}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Footer */}
      <div className="bg-gray-900 px-4 sm:px-6 lg:px-4 pt-14 pb-8">
        <div className="max-w-8xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-10">

            {/* Brand Column */}
            <div className="lg:col-span-2 flex flex-col gap-5">
              {/* Logo */}
                <Link href="/" className="flex items-center gap-2 shrink-0 mb-2">
                  <div className=" text-white py-2 px-4 rounded-lg bg-white">
                    <img className="" src="https://freshcart-route.vercel.app/_next/static/media/freshcart-logo.49f1b44d.svg" alt="logo" />
                  </div>
                </Link>

              {/* Description */}
              <p className="text-gray-400 text-sm font-medium leading-relaxed">
                FreshCart is your one-stop destination for quality products. From fashion to electronics, we bring you the best brands at competitive prices with a seamless shopping experience.
              </p>

              {/* Contact */}
              <div className="flex flex-col gap-3">
                <a href="tel:+18001234567" className="flex font-medium items-center gap-2.5 text-gray-400 hover:text-green-400 transition-colors text-sm">
                  <MdPhone className="w-4 h-4 text-green-500 shrink-0" />
                  +1 (800) 123-4567
                </a>
                <a href="mailto:support@freshcart.com" className="flex font-medium items-center gap-2.5 text-gray-400 hover:text-green-400 transition-colors text-sm">
                  <MdEmail className="w-4 h-4 text-green-500 shrink-0" />
                  support@freshcart.com
                </a>
                <div className="flex items-start gap-2.5 font-medium text-gray-400 text-sm">
                  <MdLocationOn className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                  123 Commerce Street, New York, NY 10001
                </div>
              </div>

              {/* Socials */}
              <div className="flex items-center gap-2">
                {socials.map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    aria-label={s.label}
                    className="w-10 h-10 rounded-full bg-gray-800 hover:bg-green-500 text-gray-400 hover:text-white flex items-center justify-center transition-all duration-200"
                  >
                    {s.icon}
                  </a>
                ))}
              </div>
            </div>

            {/* Link Columns */}
            {footerLinks.map((col) => (
              <div key={col.title} className="flex flex-col gap-4">
                <h3 className="text-white font-semibold text-lg">{col.title}</h3>
                <ul className="flex flex-col gap-2.5">
                  {col.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="text-gray-400 hover:text-green-400 text-sm font-medium transition-colors"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Divider */}
          <div className="border-t border-gray-800 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-gray-500 text-sm font-medium">
              © {new Date().getFullYear()} FreshCart. All rights reserved.
            </p>

            {/* Payment Methods */}
            <div className="flex items-center gap-4 text-gray-500 text-sm">
              <div className="flex items-center gap-1.5">
                <BsCreditCard2Front className="w-5 h-5" />
                <span className='font-medium'>Visa</span>
              </div>
              <div className="flex items-center gap-1.5">
                <BsCreditCard2Front className="w-5 h-5" />
                <span className='font-medium'>Mastercard</span>
              </div>
              <div className="flex items-center gap-1.5">
                <BsCreditCard2Front className="w-5 h-5" />
                <span className='font-medium'>PayPal</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}