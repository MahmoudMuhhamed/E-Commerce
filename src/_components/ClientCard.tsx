'use client';

import Link from "next/link";
import { FaStar, FaStarHalfAlt, FaRegStar, FaPlus, FaCheck } from "react-icons/fa";
import { FaArrowsRotate } from "react-icons/fa6";
import { FaRegEye } from "react-icons/fa6";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import WishlistButton from "@/_components/WishlistButton";
import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";

interface CategoryType {
  _id: string;
  name: string;
  slug: string;
  image: string;
}

interface ProductType {
  id: string;
  _id?: string;
  title: string;
  price: number;
  priceAfterDiscount?: number;
  originalPrice?: number;
  imageCover: string;
  description: string;
  reviews: number;
  category: CategoryType;
  inStock: boolean;
  rating?: number;
  ratingsAverage?: number;
  ratingsQuantity?: number;
}

function StarRating({ rating, reviews }: { rating: number; reviews: number }) {
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => {
          if (rating >= star) {
            return <FaStar key={star} className="w-4 h-4 text-yellow-400" />;
          } else if (rating >= star - 0.5) {
            return <FaStarHalfAlt key={star} className="w-4 h-4 text-yellow-400" />;
          } else {
            return <FaRegStar key={star} className="w-4 h-4 text-gray-300" />;
          }
        })}
      </div>
      <span className="text-xs text-gray-500">
        {rating} ({reviews})
      </span>
    </div>
  );
}

export function Card({
  product,
  layout = "grid",
}: {
  product: ProductType;
  layout?: "grid" | "list";
}) {
  const [isAdding, setIsAdding] = useState(false);
  const [isAdded, setIsAdded] = useState(false);
  const { addToCart } = useCart();
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();

  const hasDiscount =
    product.priceAfterDiscount !== undefined &&
    product.priceAfterDiscount > 0 &&
    product.priceAfterDiscount < product.price;

  const discountPercent = hasDiscount
    ? Math.round(((product.price - product.priceAfterDiscount!) / product.price) * 100)
    : 0;

  const rating = product.ratingsAverage ?? product.rating ?? 4.0;
  const reviews = product.ratingsQuantity ?? product.reviews ?? 0;
  const productId = product.id ?? product._id;
  const inWishlist = isInWishlist(productId!);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    setIsAdding(true);

    setTimeout(() => {
      addToCart(product as any, 1);
      setIsAdded(true);
      setIsAdding(false);

      setTimeout(() => {
        setIsAdded(false);
      }, 2500);
    }, 400);
  };

  const handleWishlistToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    try {
      if (inWishlist) {
        await removeFromWishlist(productId!);
      } else {
        await addToWishlist(productId!);
      }
    } catch (err) {
      console.error('Wishlist error:', err);
    }
  };

  const imageBlock = (
    <div
      className={
        layout === "list"
          ? "relative h-44 w-44 shrink-0 overflow-hidden bg-white sm:h-52 sm:w-52"
          : "relative overflow-hidden w-full object-cover"
      }
    >
      {discountPercent > 0 && (
        <div className="absolute top-3 left-3 z-10 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-md">
          -{discountPercent}%
        </div>
      )}

      <Link href={`/products/${productId}`}>
        <div
          className={
            layout === "list"
              ? "flex h-full w-full items-center justify-center bg-gray-50 px-4"
              : "flex h-full w-full items-center justify-center px-10"
          }
        >
          <img
            src={product.imageCover}
            alt={product.title}
            className={
              layout === "list"
                ? "max-h-[85%] max-w-[90%] object-contain"
                : "max-h-full w-[50%] lg:w-[90%] object-cover transition-transform duration-500"
            }
          />
        </div>
      </Link>

      <div className="absolute top-3 right-3 flex flex-col gap-2">
        <button
          onClick={handleWishlistToggle}
          className="w-9 h-9 bg-white rounded-full shadow flex items-center justify-center hover:shadow-md transition-all"
          aria-label="Add to wishlist"
        >
          {inWishlist ? (
            <FaHeart className="w-4 h-4 text-red-500" />
          ) : (
            <FaRegHeart className="w-4 h-4 text-gray-600" />
          )}
        </button>
        <button
          aria-label="Compare"
          className="w-9 h-9 bg-white rounded-full shadow flex items-center justify-center text-gray-600 hover:text-green-600 hover:shadow-md transition-all"
        >
          <FaArrowsRotate className="w-4 h-4" />
        </button>
        <button
          aria-label="Quick view"
          className="w-9 h-9 bg-white rounded-full shadow flex items-center justify-center text-gray-600 hover:text-green-600 hover:shadow-md transition-all"
        >
          <FaRegEye className="w-4 h-4" />
        </button>
      </div>
    </div>
  );

  const bodyBlock = (
    <div className={`${layout === "list" ? "flex flex-1 flex-col justify-center p-4 sm:p-6" : "p-4"}`}>
      <p className="text-xs text-gray-500 mb-1">{product.category?.name}</p>

      <Link href={`/products/${productId}`}>
        <h3
          className={`text-md text-gray-800 transition-colors mb-2 ${
            layout === "list" ? "line-clamp-2 font-semibold" : "line-clamp-1"
          }`}
        >
          {product.title}
        </h3>
      </Link>

      <div className={layout === "list" ? "mb-4" : "mb-3"}>
        <StarRating rating={rating} reviews={reviews} />
      </div>
      <div
        className={`flex items-center ${
          layout === "list" ? "mt-auto justify-between gap-4" : "justify-between"
        }`}
      >
        <div className="flex items-center justify-start gap-2">
          <div>
            <div
              className={`font-bold ${hasDiscount ? "text-green-600" : "text-gray-900"} ${
                layout === "list" ? "text-xl" : "text-lg"
              }`}
            >
              {product.priceAfterDiscount !== undefined && product.priceAfterDiscount > 0
                ? product.priceAfterDiscount.toFixed(2)
                : product.price.toFixed(2)}{" "}
              EGP
            </div>
          </div>
          {hasDiscount && (
            <span className="text-sm text-gray-500 line-through">{product.price} EGP</span>
          )}
        </div>
        <button
          onClick={handleAddToCart}
          disabled={isAdding}
          aria-label="Add to cart"
          className={`shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-white text-xl font-bold transition-all shadow ${
            isAdding
              ? "bg-gray-400 cursor-not-allowed"
              : isAdded
                ? "bg-green-600 hover:bg-green-700"
                : "bg-green-600 hover:bg-green-700 active:scale-95"
          }`}
        >
          {isAdding ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : isAdded ? (
            <FaCheck className="text-lg" />
          ) : (
            <FaPlus className="text-lg" />
          )}
        </button>
      </div>
    </div>
  );

  const outerClass =
    layout === "list"
      ? "group relative flex flex-row bg-white rounded-lg border border-gray-200 hover:shadow-lg transition-all duration-300 overflow-hidden"
      : "group relative bg-white rounded-lg border border-gray-200 hover:shadow-lg transition-all duration-300 overflow-hidden hover:-translate-y-1.5";

  return (
    <div>
      <div className={outerClass}>
        {imageBlock}
        {bodyBlock}
      </div>
    </div>
  );
}
