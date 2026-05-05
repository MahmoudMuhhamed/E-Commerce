import Link from 'next/link';
import ProductActions from '@/_components/ProductActions';
import { FaStar, FaStarHalfAlt, FaRegStar, FaShoppingCart, FaBolt, FaHeart, FaShareAlt, FaTruck, FaUndo, FaShieldAlt, FaCheck, FaHome, FaChevronRight } from 'react-icons/fa';

export interface CategoryType {
  _id: string;
  name: string;
  slug: string;
  image: string;
}

export interface ProductType {
  id: string;
  _id?: string;
  title: string;
  price: number;
  priceAfterDiscount?: number;
  originalPrice?: number;
  imageCover: string;
  images?: string[];
  description: string;
  reviews: number;
  category: CategoryType;
  subcategory?: { name: string };
  brand?: { name: string };
  sold?: number;
  quantity?: number;
  inStock: boolean;
  rating?: number;
  ratingsAverage?: number;
  ratingsQuantity?: number;
}

function StarRating({ rating, reviews }: { rating: number; reviews: number }) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => {
          if (rating >= star) return <FaStar key={star} className="w-4.5 h-4.5 text-yellow-400" />;
          if (rating >= star - 0.5) return <FaStarHalfAlt key={star} className="w-4.5 h-4.5 text-yellow-400" />;
          return <FaRegStar key={star} className="w-4.5 h-4.5 text-yellow-400" />;
        })}
      </div>
      <span className="text-sm text-gray-600 font-medium">{rating} ({reviews} reviews)</span>
    </div>
  );
}

async function getRelatedProducts(categoryId: string): Promise<ProductType[]> {
  try {
    const res = await fetch(
      `https://ecommerce.routemisr.com/api/v1/products?category=${categoryId}&limit=5`,
      { next: { revalidate: 3600 } }
    );
    const data = await res.json();
    return data.data ?? [];
  } catch {
    return [];
  }
}

export default async function ProductDetailPage(props: {
  params: Promise<{ id: string }>;
}) {
  const params = await props.params;
  const id = params.id;

  async function getProduct(): Promise<ProductType | undefined> {
    try {
      const res = await fetch(`https://ecommerce.routemisr.com/api/v1/products/${id}`);
      const data = await res.json();
      return data.data;
    } catch {
      return undefined;
    }
  }

  const product = await getProduct();

  if (!product) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-gray-400">Product not found.</p>
      </div>
    );
  }

  const rating = product.ratingsAverage ?? product.rating ?? 0;
  const reviews = product.ratingsQuantity ?? product.reviews ?? 0;
  const productId = product._id ?? product.id;
  const hasDiscount =
    product.priceAfterDiscount !== undefined &&
    product.priceAfterDiscount > 0 &&
    product.priceAfterDiscount < product.price;
  const displayPrice = hasDiscount ? product.priceAfterDiscount! : product.price;

  const allImages = product.images?.length
    ? product.images
    : [product.imageCover, product.imageCover, product.imageCover];

  const related = await getRelatedProducts(product.category._id);

  return (
    <div className="min-h-screen">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-4 py-4">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-sm text-gray-500 font-medium mb-6 flex-wrap">
          <Link href="/" className="flex items-center gap-1 hover:text-green-600 transition-colors">
            <FaHome className="w-3.5 h-3.5" /> Home
          </Link>
          <FaChevronRight className="w-2.5 h-2.5" />
          <Link href="/categories" className="hover:text-green-600 transition-colors">
            {product.category?.name}
          </Link>
          
              <span className="hover:text-green-600 transition-colors cursor-pointer">
                {product.subcategory?.name}
              </span>
          <FaChevronRight className="w-2.5 h-2.5" />
          <span className="text-gray-700 font-medium truncate max-w-50">{product.title}</span>
        </nav>

        {/* Main Product Section */}
        <div className="flex flex-col lg:flex-row gap-8 px-1 py-3 mb-8">

          {/* Left: Image Gallery */}
          <div className="lg:w-1/4 sticky top-0 grid shadow-sm max-w-125 max-h-150 overflow-hidden rounded-xl border border-gray-50 
          grid-cols-1 pb-4">
            {/* Main Image */}
            <div className="relative w-full h-full pb-1 overflow-hidden">
              <img
                src={product.imageCover}
                alt={product.title}
                className="w-full h-full object-contain pt-4 px-3"
              />
              
            </div>
            {/* Thumbnails */}
            <div className='pe-3 m-auto lg:m-0'>
            <div className="flex gap-2 overflow-hidden px-3">
              {allImages.slice(0, 4).map((img, idx) => (
                <div
                  key={idx}
                  className={`w-23 h-35 rounded-lg cursor-pointer shrink-0 transition-all ${
                    idx === 2 ? 'border-green-500' : ' hover:border-green-300'
                  }`}
                >
                  <img src={img} alt={`thumb-${idx}`} className="w-full h-full object-contain py-1.5" />
                </div>
              ))}
            </div>
            </div>
          </div>

          {/* Right: Product Info */}
          <div className="flex p-7 lg:w-3/4 flex-col gap-2.5 bg-white shadow-sm rounded-2xl border border-gray-100">
            {/* Tags */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-medium text-green-700 bg-green-50  px-3 py-1.5 rounded-full">
                {product.category?.name}
              </span>
              {product.brand && (
                <span className="text-xs font-medium text-gray-700 bg-gray-100 px-3 py-1.5 rounded-full">
                  {product.brand.name}
                </span>
              )}
            </div>

            {/* Title */}
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 leading-snug">
              {product.title}
            </h1>

            {/* Rating */}
            <StarRating rating={rating} reviews={reviews} />

            {/* Price */}
            <div className="flex items-center gap-3 my-2">
              <span className="text-3xl font-extrabold text-gray-900">{displayPrice} EGP</span>
              {hasDiscount && (
                <span className="text-lg text-gray-400 font-medium line-through">{product.price} EGP</span>
              )}
              {hasDiscount && (
                <div className=" bg-red-500 text-white font-medium text-sm px-2 py-1 rounded-full">
                  Save {Math.round(((product.price - product.priceAfterDiscount!) / product.price) * 100)}%
                </div>
              )}
            </div>

            {/* Stock */}
            <div className='mt-2'>
              {product.inStock ? (
                <span className="inline-flex items-center gap-1.5 bg-green-50 py-1.5 px-3 rounded-full text-green-600 text-sm font-medium">
                  <span className="w-2 h-2 bg-green-500 rounded-full inline-block"></span>
                  In Stock
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 bg-green-50 py-1.5 px-3 rounded-full text-green-600 text-sm font-medium">
                  <span className="w-2 h-2 bg-green-500 rounded-full inline-block"></span>
                  In Stock
                </span>
              )}
            </div>
            <div className='h-px w-full bg-gray-100 my-3'></div>

            {/* Description */}
            <p className="font-medium text-gray-600 leading-relaxed">{product.description}</p>

            {/* Quantity + Total — client component */}
            <div>
            <h1 className='text-sm font-medium text-gray-700 my-2'>Quantity</h1>
            <ProductActions product={product} />

             {/* <p>{product.quantity}</p> */}
            </div>

            {/* Wishlist + Share */}


            {/* Perks */}
            <div className="grid grid-cols-3 gap-3 border-t border-gray-100 pt-5">
              {[
                { icon: <FaTruck className="w-5 h-5 text-green-500" />, title: 'Free Delivery', sub: 'Orders over $50' },
                { icon: <FaUndo className="w-5 h-5 text-green-500" />, title: '30 Days Return', sub: 'Money back' },
                { icon: <FaShieldAlt className="w-5 h-5 text-green-500" />, title: 'Secure Payment', sub: '100% Protected' },
              ].map((p) => (
                <div key={p.title} className="flex flex-col items-center text-center gap-1">
                  {p.icon}
                  <p className="text-xs font-semibold text-gray-700">{p.title}</p>
                  <p className="text-[10px] text-gray-400">{p.sub}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tabs Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 mb-8 overflow-hidden">
          <div className="flex border-b border-gray-100">
            {['Product Details', `Reviews (${reviews})`, 'Shipping & Returns'].map((tab, i) => (
              <button
                key={tab}
                className={`flex items-center gap-2 px-5 py-4 text-sm font-medium transition-all border-b-2 ${
                  i === 0
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {i === 0 && <span className="w-2 h-2 bg-green-500 rounded-full" />}
                {tab}
              </button>
            ))}
          </div>

          <div className="p-6 sm:p-8">
            <h3 className="text-base font-semibold text-gray-800 mb-3">About this Product</h3>
            <p className="text-sm text-gray-500 mb-6">{product.description}</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Product Info Table */}
              <div className="bg-gray-50 rounded-xl p-5">
                <h4 className="text-sm font-semibold text-gray-700 mb-4">Product Information</h4>
                <div className="flex flex-col gap-2.5">
                  {[
                    { label: 'Category', value: product.category?.name },
                    { label: 'Subcategory', value: product.subcategory?.name },
                    { label: 'Brand', value: product.brand?.name },
                    { label: 'Items Sold', value: product.sold ? `${product.sold}+ sold` : '—' },
                  ].map((row) => row.value && (
                    <div key={row.label} className="flex justify-between text-sm">
                      <span className="text-gray-400">{row.label}</span>
                      <span className="font-medium text-gray-700">{row.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Key Features */}
              <div className="bg-gray-50 rounded-xl p-5">
                <h4 className="text-sm font-semibold text-gray-700 mb-4">Key Features</h4>
                <div className="flex flex-col gap-2.5">
                  {[
                    'Premium Quality Product',
                    '100% Authentic Guarantee',
                    'Fast & Secure Packaging',
                    'Quality Tested',
                  ].map((feat) => (
                    <div key={feat} className="flex items-center gap-2 text-sm text-gray-600">
                      <FaCheck className="w-3.5 h-3.5 text-green-500 shrink-0" />
                      {feat}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {related.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <span className="w-1 h-5 bg-green-500 rounded-full" />
                You May Also <span className="text-green-500 ml-1">Like</span>
              </h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {related.map((rel) => {
                const relId = rel._id ?? rel.id;
                const relRating = rel.ratingsAverage ?? rel.rating ?? 0;
                const relReviews = rel.ratingsQuantity ?? rel.reviews ?? 0;
                const relHasDiscount =
                  rel.priceAfterDiscount !== undefined &&
                  rel.priceAfterDiscount > 0 &&
                  rel.priceAfterDiscount < rel.price;
                return (
                  <Link
                    key={relId}
                    href={`/products/${relId}`}
                    className="group bg-white rounded-2xl border border-gray-100 hover:border-green-200 hover:shadow-md transition-all duration-300 overflow-hidden"
                  >
                    <div className="relative bg-gray-50 h-40 flex items-center justify-center p-4">
                      {relHasDiscount && (
                        <div className="absolute top-2 left-2 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-md">
                          -{Math.round(((rel.price - rel.priceAfterDiscount!) / rel.price) * 100)}%
                        </div>
                      )}
                      <img
                        src={rel.imageCover}
                        alt={rel.title}
                        className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-2 right-2 flex flex-col gap-1.5">
                        <button className="w-7 h-7 bg-white rounded-full shadow flex items-center justify-center text-gray-400 hover:text-red-500 transition-colors">
                          <FaHeart className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                    <div className="p-3">
                      <p className="text-[10px] text-gray-400 mb-0.5">{rel.category?.name}</p>
                      <p className="text-xs font-semibold text-gray-800 line-clamp-2 mb-1.5">{rel.title}</p>
                      <div className="flex items-center gap-1 mb-2">
                        {[1,2,3,4,5].map(s => (
                          relRating >= s
                            ? <FaStar key={s} className="w-3 h-3 text-yellow-400" />
                            : <FaRegStar key={s} className="w-3 h-3 text-gray-300" />
                        ))}
                        <span className="text-[10px] text-gray-400 ml-1">{relRating} ({relReviews})</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-gray-900">
                          {relHasDiscount ? rel.priceAfterDiscount : rel.price} EGP
                        </span>
                        <button className="w-7 h-7 bg-green-500 hover:bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold transition-colors">
                          +
                        </button>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}