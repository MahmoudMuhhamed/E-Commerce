'use client';

import { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { FaShareAlt, FaShoppingCart, FaCheck } from 'react-icons/fa';
import type { Product } from '@/lib/products';
import { FaPlus } from "react-icons/fa6";
import { FaMinus } from "react-icons/fa6";
import { FaBolt } from "react-icons/fa6";
import { FaRegHeart, FaHeart } from "react-icons/fa6";
import { useWishlist } from '@/context/WishlistContext';


function normalizeProductId(product: Product): string {
  const raw = product.id ?? product._id;
  return raw === undefined || raw === null ? '' : String(raw);
}

export default function ProductActions({ product }: { product: Product }) {
  const [quantity, setQuantity] = useState(1);
  const [cartStatus, setCartStatus] = useState<'idle' | 'loading' | 'added'>('idle');
  const [wishlistStatus, setWishlistStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [wishlistMessage, setWishlistMessage] = useState('');
  const { addToCart } = useCart();
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const stockAvailable = product.quantity ? product.quantity > 0 : product.inStock ?? true;
  const inWishlist = isInWishlist(normalizeProductId(product));

  const handleAddToCart = async () => {
    setCartStatus('loading');
    setTimeout(() => {
      addToCart(product, quantity);
      setCartStatus('added');
      setTimeout(() => setCartStatus('idle'), 2500);
    }, 400);
  };

  const handleWishlistToggle = async () => {
    if (wishlistStatus === 'saving') return;

    const productId = normalizeProductId(product);
    if (!productId) {
      setWishlistStatus('error');
      setWishlistMessage('Unable to identify this product.');
      return;
    }

    setWishlistStatus('saving');
    setWishlistMessage('');

    try {
      if (inWishlist) {
        await removeFromWishlist(productId);
      } else {
        await addToWishlist(productId);
      }
      setWishlistStatus('saved');
      setTimeout(() => {
        setWishlistStatus('idle');
        setWishlistMessage('');
      }, 2500);
    } catch (error) {
      setWishlistStatus('error');
      setWishlistMessage(error instanceof Error ? error.message : 'Failed to update wishlist.');
    }
  };


  return (
    <div className="space-y-4">
      <div className=" gap-4">
        <div className='flex items-center gap-4 mb-4'>
        <div className="flex items-center justify-center rounded-md border-2 border-gray-200 bg-white">
          <button
            type="button"
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="h-12 w-12 flex justify-center hover:text-green-600 items-center text-xl font-bold text-zinc-700 transition hover:bg-zinc-200"
          >
            <FaMinus />
          </button>
          <input
            type="number"
            min={1}
            value={quantity}
            onChange={(event) => setQuantity(Math.max(1, Number(event.target.value) || 1))}
            className="w-20 px-4 py-3 text-center font-medium  text-zinc-900 outline-none"
          />
          <button
            type="button"
            onClick={() => setQuantity(quantity + 1)}
            className="h-12 w-12 text-xl hover:text-green-600 font-bold text-zinc-700 flex justify-center items-center transition hover:bg-zinc-200"
          >
            <FaPlus />
          </button>
        </div>
        <h1 className='text-sm font-medium text-gray-500'>{product.quantity} available</h1>
        </div>
        <div className='bg-gray-50 p-4 flex justify-between rounded-lg my-6'>
        <p className='text-gray-600 font-medium'>Total Price:</p>
        <p className='text-xl text-green-600 font-bold'>{quantity * product.price} EGP</p>
        </div>

        <div className='w-full gap-3 sm:flex '>
        <button
          type="button"
          disabled={!stockAvailable || cartStatus === 'loading'}
          onClick={handleAddToCart}
          className={`flex inline-full shadow-lg shadow-green-100 mb-2.5 sm:mb-0 items-center justify-center gap-2 rounded-lg px-6 py-4 font-medium text-white transition ${
            !stockAvailable ? 'bg-zinc-400 cursor-not-allowed' : cartStatus === 'loading' ? 'bg-gray-400 cursor-not-allowed' : cartStatus === 'added' ? 'bg-green-600' : 'bg-green-600 hover:bg-green-700'
          }`}
        >
          {cartStatus === 'loading' ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Adding...
            </>
          ) : cartStatus === 'added' ? (
            <>
              <FaCheck className="w-5 h-5" />
              Added to Cart
            </>
          ) : (
            <>
              <FaShoppingCart />
              Add to Cart
            </>
          )}
        </button>
        <button
        type='button'
        className='flex cursor-pointer hover:bg-gray-800 inline-full items-center justify-center gap-2 rounded-lg px-6 py-3 font-medium bg-gray-900 text-white transition'>
          <FaBolt /> Buy Now
        </button>
        </div>
      </div>

      <div className='flex gap-3'>
      <button
        type="button"
        onClick={handleWishlistToggle}
        disabled={wishlistStatus === 'saving'}
        className={`inline-flex w-full items-center justify-center gap-2 rounded-lg border-2 px-6 py-4 font-medium transition ${
          wishlistStatus === 'saving' ? 'cursor-not-allowed opacity-50 border-gray-200 bg-white'
          : inWishlist ? 'border-red-300 bg-red-50 hover:text-red-600 text-red-600'
          : 'border-gray-200 bg-white hover:text-green-600 hover:border-green-300'
        }`}
      >
        {wishlistStatus === 'saving' ? (
          <>
            <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
            Saving...
          </>
        ) : inWishlist ? (
          <>
            <FaHeart className="h-4 w-4" />
            Remove from Wishlist
          </>
        ) : (
          <>
            <FaRegHeart className="h-4 w-4" />
            Add to Wishlist
          </>
        )}
      </button>

      <div className="flex items-center py-2.5 px-4.5 transition group justify-center border-2 hover:border-green-300 border-gray-200 rounded-xl">
              <button className=" group-hover:text-green-600  text-sm text-gray-600  ">
                <FaShareAlt className="w-4 h-4" />
              </button>
            </div>

      </div>

      {wishlistStatus === 'error' && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {wishlistMessage}
        </div>
      )}

    </div>
  );
}
