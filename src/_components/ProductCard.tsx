import Link from "next/link";
import { FaHeart, FaStar, FaStarHalfAlt, FaRegStar, FaEye, FaPlus } from "react-icons/fa";
import { FaArrowsRotate } from "react-icons/fa6";
import { FaRegHeart } from "react-icons/fa6";
import { FaRegEye } from "react-icons/fa6";
import WishlistButton from "@/_components/WishlistButton";
import { Card } from "@/_components/ClientCard";



interface CategoryType {
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

async function getAllProducts(): Promise<ProductType[] | null> {
  try {
    const res = await fetch(`https://ecommerce.routemisr.com/api/v1/products`, {
      next: { revalidate: 3600 },
    });
    const data = await res.json();
    console.log(data.data);

    return data.data;
  } catch (error) {
    console.error("Error fetching products:", error);
    return null;
  }
}

export default async function ProductCard() {
  const allProducts = await getAllProducts();

  if (!allProducts) {
    return (
      <div className="flex items-center justify-center min-h-75">
        <p className="text-gray-500 text-sm">Failed to load products. Please try again later.</p>
      </div>
    );
  }

  if (allProducts.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-75">
        <p className="text-gray-500 text-sm">No products found.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {allProducts.map((product) => (
        <Card key={product.id ?? product._id} product={product} />
      ))}
    </div>
  );
}