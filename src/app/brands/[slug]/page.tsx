import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { Card } from '@/_components/ClientCard';
import BrandActiveFilters from '@/_components/BrandActiveFilters';
import { fetchBrandBySlug, fetchProductsByBrandId } from '@/lib/ecommerceApi';
import type { ProductType } from '@/_components/ProductCard';

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const brand = await fetchBrandBySlug(slug);
  if (!brand) return { title: 'Brand | FreshCart' };
  return {
    title: `${brand.name} | FreshCart`,
    description: `Shop ${brand.name} products`,
  };
}

export default async function BrandProductsPage({ params }: PageProps) {
  const { slug } = await params;
  const brand = await fetchBrandBySlug(slug);

  if (!brand) {
    notFound();
  }

  const rawProducts = await fetchProductsByBrandId(brand._id);
  const products = rawProducts as unknown as ProductType[];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero — same gradient language as Contact */}
      <div className="bg-linear-to-r from-green-600 to-green-500 text-white py-12">
        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-4">
          <div className="flex items-center gap-2 text-sm mb-5 mt-3 opacity-95">
            <Link href="/" className="hover:opacity-100 opacity-80 transition">
              Home
            </Link>
            <span>/</span>
            <Link href="/brands" className="hover:opacity-100 opacity-80 transition">
              Brands
            </Link>
            <span>/</span>
            <span>{brand.name}</span>
          </div>

          <div className="flex items-center gap-5 flex-wrap">
            <div className="w-20 h-20 sm:w-24 sm:h-24 shrink-0 bg-white rounded-2xl flex items-center justify-center p-3 shadow-md">
              <img
                src={brand.image}
                alt={brand.name}
                className="max-w-full max-h-full object-contain"
              />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold mb-1">{brand.name}</h1>
              <p className="text-lg opacity-95">Shop {brand.name} products</p>
            </div>
          </div>
        </div>
      </div>

      <BrandActiveFilters brandName={brand.name} />

      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-4 py-8">
        <p className="text-sm text-gray-500 mb-6">
          Showing {products.length} product{products.length === 1 ? '' : 's'}
        </p>

        {products.length === 0 ? (
          <p className="text-gray-500 text-center py-16">
            No products for this brand yet.{' '}
            <Link href="/brands" className="text-green-600 font-medium hover:underline">
              Browse other brands
            </Link>
          </p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-5">
            {products.map((product) => (
              <Card
                key={String(product.id ?? product._id)}
                product={product}
                layout="grid"
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
