import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-black">
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center gap-2 text-sm">
          <Link href="/" className="text-blue-600 dark:text-blue-400 hover:underline">
            Home
          </Link>
          <span className="text-zinc-400">/</span>
          <span className="text-zinc-600 dark:text-zinc-400">About</span>
        </div>
      </div>

      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold mb-4">About ShopHub</h1>
          <p className="text-xl opacity-90">
            Your trusted partner for premium products and exceptional service
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Story Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
          <div>
            <h2 className="text-3xl font-bold text-zinc-900 dark:text-white mb-6">Our Story</h2>
            <p className="text-zinc-600 dark:text-zinc-400 mb-4 leading-relaxed">
              ShopHub was founded in 2020 with a simple mission: to bring the best products from around the world to your doorstep. What started as a small idea has grown into a thriving online marketplace serving thousands of customers.
            </p>
            <p className="text-zinc-600 dark:text-zinc-400 mb-4 leading-relaxed">
              We believe in quality, transparency, and customer satisfaction. Every product in our catalog is carefully selected to meet our high standards.
            </p>
            <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Today, we're proud to offer a diverse range of categories including electronics, fashion, accessories, and more.
            </p>
          </div>

          <div className="bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 rounded-lg p-8 flex items-center justify-center min-h-64">
            <div className="text-center">
              <div className="text-6xl mb-4">🛍️</div>
              <p className="text-zinc-700 dark:text-zinc-300 text-lg font-semibold">
                Trusted by thousands of customers worldwide
              </p>
            </div>
          </div>
        </div>

        {/* Values Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-zinc-900 dark:text-white mb-12 text-center">
            Our Values
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: '⭐',
                title: 'Quality',
                desc: 'We curate products that meet the highest standards of quality and durability.',
              },
              {
                icon: '🤝',
                title: 'Trust',
                desc: 'Your satisfaction is our priority. We stand behind every product we sell.',
              },
              {
                icon: '🚀',
                title: 'Innovation',
                desc: 'We continuously improve our platform to enhance your shopping experience.',
              },
            ].map((value, i) => (
              <div
                key={i}
                className="bg-zinc-50 dark:bg-zinc-900 rounded-lg p-8 text-center hover:shadow-lg transition-shadow"
              >
                <div className="text-5xl mb-4">{value.icon}</div>
                <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-3">
                  {value.title}
                </h3>
                <p className="text-zinc-600 dark:text-zinc-400">{value.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Stats Section */}
        <div className="bg-zinc-50 dark:bg-zinc-950 rounded-lg p-12 mb-16">
          <h2 className="text-3xl font-bold text-zinc-900 dark:text-white mb-12 text-center">
            By The Numbers
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { number: '10K+', label: 'Products' },
              { number: '50K+', label: 'Happy Customers' },
              { number: '99.9%', label: 'Satisfaction Rate' },
              { number: '24/7', label: 'Customer Support' },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                  {stat.number}
                </div>
                <p className="text-zinc-600 dark:text-zinc-400">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-blue-600 dark:bg-blue-900 text-white rounded-lg p-12 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Shop?</h2>
          <p className="text-lg opacity-90 mb-8">
            Explore our collection of premium products and find exactly what you're looking for.
          </p>
          <Link
            href="/products"
            className="inline-block bg-white text-blue-600 font-bold py-3 px-8 rounded-lg hover:bg-zinc-100 transition-colors"
          >
            Start Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
