'use client';

import { useWishlist } from '@/context/WishlistContext';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FaTrash, FaShoppingCart, FaArrowLeft, FaHeart, FaArrowRight, FaRegHeart } from 'react-icons/fa';
import { useToast } from '@/context/ToastContext';

export default function WishlistPage() {
  const { items, isLoading, removeFromWishlist, error } = useWishlist();
  const { addToCart } = useCart();
  const { user } = useAuth();
  const { addToast } = useToast();
  const router = useRouter();

  const handleRemoveFromWishlist = async (productId: string) => {
    try {
      await removeFromWishlist(productId);
      addToast('Removed from wishlist', 'success');
    } catch (err) {
      addToast('Failed to remove from wishlist', 'error');
    }
  };

  const handleAddToCart = (product: any, quantity: number = 1) => {
    addToCart(product, quantity);
    addToast('Added to cart', 'success');
  };



  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
          <p className="mt-4 text-gray-600 font-medium">Loading your wishlist...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <p className="text-red-700 font-medium">{error}</p>
            <Link href="/products" className="text-red-600 hover:text-red-700 mt-4 inline-block">
              Back to products
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="bg-gray-50 py-12">
        <div className="max-w-md mx-auto px-4">
          <div className="text-center ">
            <div className="text-xl flex justify-center items-center mb-4">
              <div className='bg-gray-100 rounded-full p-8'>
                <FaRegHeart className="svg-inline--fa fa-box-open text-xl h-15 w-15 text-gray-300"/>
              </div>
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Your cart is empty</h1>
            <p className="text-gray-500 font-medium text-sm mb-6">Looks like you haven't added anything to your cart yet. <br />Start exploring our products!</p>
            <div className='flex flex-col items-center justify-cevter gap-3'>
            <Link
              href="/products"
              className="flex w-full justify-center items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
            >
              Browse Products
              <FaArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/signin"
              className="flex w-full justify-center border border-gray-200 gap-2 bg-white hover:bg-gray-50  font-semibold px-6 py-3 rounded-lg transition-colors"
            >
              Sign In
            </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 flex items-center gap-3">
            <FaHeart className="text-red-500" />
            My Wishlist
          </h1>
          <p className="text-gray-600 mt-2">{items.length} item{items.length !== 1 ? 's' : ''} saved</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {items.map((product) => {
            const rawId = product.id ?? product._id;
            if (rawId === undefined || rawId === null) return null;
            const productId = String(rawId);
            const productImage = product.imageCover || product.image || product.images?.[0];
            const productTitle = product.title || product.name;

            return (
              <div
                key={productId}
                className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-lg transition-all group"
              >
                {/* Image Container */}
                <Link href={`/products/${productId}`} className="relative block overflow-hidden bg-gray-100 h-48">
                  <img
                    src={productImage}
                    alt={productTitle}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute top-2 right-2">
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        handleRemoveFromWishlist(productId);
                      }}
                      className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-full transition-colors"
                    >
                      <FaTrash className="w-4 h-4" />
                    </button>
                  </div>
                </Link>

                {/* Product Details */}
                <div className="p-4">
                  <Link href={`/products/${productId}`} className="hover:text-green-600 transition-colors">
                    <h3 className="font-semibold text-gray-900 line-clamp-2 mb-2">
                      {productTitle}
                    </h3>
                  </Link>

                  {/* Rating */}
                  {product.ratingsAverage && (
                    <div className="flex items-center gap-1 mb-3">
                      <div className="flex text-yellow-400">
                        {[...Array(5)].map((_, i) => (
                          <span key={i} className="text-sm">
                            {i < Math.round(product.ratingsAverage!) ? '★' : '☆'}
                          </span>
                        ))}
                      </div>
                      <span className="text-xs text-gray-500">({product.ratingsQuantity})</span>
                    </div>
                  )}

                  {/* Price */}
                  <div className="mb-4">
                    <p className="text-green-600 font-bold text-lg">
                      EGP {product.price?.toFixed(2)}
                    </p>
                    {product.priceAfterDiscount && (
                      <p className="text-gray-500 line-through text-sm">
                        EGP {product.priceAfterDiscount?.toFixed(2)}
                      </p>
                    )}
                  </div>

                  {/* Add to Cart Button */}
                  <button
                    onClick={() => handleAddToCart(product)}
                    className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded-lg transition-colors"
                  >
                    <FaShoppingCart className="w-4 h-4" />
                    Add to Cart
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Continue Shopping Link */}
        <div className="text-center mt-12">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 text-green-600 hover:text-green-700 font-semibold"
          >
            <FaArrowLeft className="w-4 h-4" />
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
