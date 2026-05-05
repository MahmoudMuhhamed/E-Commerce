import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { Card } from '@/_components/ClientCard';
import {
  fetchCategoryBySlug,
  fetchProductsByCategoryId,
  fetchSubCategoriesByCategory,
} from '@/lib/ecommerceApi';
import { Product } from '@/lib/products';

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = await fetchCategoryBySlug(slug);
  if (!category) return { title: 'Category | FreshCart' };
  return {
    title: `${category.name} | FreshCart`,
    description: `Shop ${category.name} products`,
  };
}

export default async function CategoryPage({ params }: PageProps) {
  const { slug } = await params;

  let category = null;
  let products: Product[] = [];
  let subCategories = [];
  let hasError = false;

  try {
    category = await fetchCategoryBySlug(slug);

    if (!category) {
      notFound();
    }

    // Fetch products and subcategories in parallel
    const [productsData, subCategoriesData] = await Promise.all([
      fetchProductsByCategoryId(category._id),
      fetchSubCategoriesByCategory(category._id),
    ]).catch((error) => {
      console.error('Error fetching category data:', error);
      hasError = true;
      return [[], []];
    });

    products = (productsData as Product[]) || [];
    subCategories = subCategoriesData || [];
  } catch (error) {
    console.error('Category page error:', error);
    notFound();
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumb */}



      

      {/* Hero — Green gradient banner */}
      <div className="bg-linear-to-r from-green-600 to-green-500 text-white py-12">
        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-4">
        <div className="flex items-center mb-5 gap-2 text-sm text-gray-400">
          <Link href="/" className="text-gray-300 hover:text-gray-100 transition">
            Home
          </Link>
          <span>/</span>
          <Link href="/categories" className="text-gray-300 hover:text-gray-100 transition">
            Categories
          </Link>
          <span>/</span>
          <span className="text-gray-100 font-medium">{category.name}</span>
        </div>


          <div className="flex items-center gap-4 mb-4">
            {/* Category image in white rounded square */}
            <div className="w-12 h-12 sm:w-16 sm:h-16 shrink-0 bg-green-500 rounded-xl flex items-center justify-center p-3 shadow-md">
              <img
                src={category.image}
                alt={category.name}
                className="max-w-full max-h-full object-contain"
              />
            </div>
            {/* Heading and subtitle */}
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold mb-1">{category.name}</h1>
              <p className="text-lg opacity-95">Browse products in {category.name}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Active Filters Bar */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
              <svg className="w-4 h-4 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-.293.707L12 13.414V15.5a1 1 0 01-.447.894l-2 1A1 1 0 017.5 15.5v-2.086L3.293 6.707A1 1 0 013 6V4z" clipRule="evenodd" />
              </svg>
              Active Filters:
            </div>
            <span className="inline-flex items-center gap-2 bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-.293.707L12 13.414V15.5a1 1 0 01-.447.894l-2 1A1 1 0 017.5 15.5v-2.086L3.293 6.707A1 1 0 013 6V4z" clipRule="evenodd" />
              </svg>
              {category.name}
              <button className="ml-1 hover:text-green-900">×</button>
            </span>
            <Link
              href="/categories"
              className="text-sm text-gray-500 hover:text-gray-700 underline"
            >
              Clear all
            </Link>
          </div>
        </div>
      </div>

      {/* SubCategories — if available */}
      {subCategories.length > 0 && (
        <div className="bg-gray-50 border-b border-gray-200 py-8">
          <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Subcategories</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {subCategories.map((subCat) => (
                <Link
                  key={subCat._id}
                  href={`/subcategories/${subCat._id}`}
                  className="flex flex-col items-center gap-2 p-3 bg-white rounded-lg border border-gray-200 hover:shadow-md transition"
                >
                  {subCat.image && (
                    <img
                      src={subCat.image}
                      alt={subCat.name}
                      className="w-16 h-16 object-cover rounded"
                    />
                  )}
                  <span className="text-sm text-center font-medium text-gray-800">
                    {subCat.name}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Products Section */}
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {products.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-500 mb-4">No products for this category yet.</p>
            <Link href="/categories" className="text-green-600 font-medium hover:underline">
              Browse other categories
            </Link>
          </div>
        ) : (
          <>
            <p className="text-sm text-gray-500 mb-6">
              Showing {products.length} product{products.length === 1 ? '' : 's'}
            </p>
            {/* Product Grid: 5 columns on desktop, responsive on mobile */}
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-5">
              {products.map((product: Product) => (
                <Card
                  key={String(product.id ?? product._id)}
                  product={product as any}
                  layout="grid"
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
