'use client';

import { FaHeart, FaRegHeart } from 'react-icons/fa';
import { useWishlist } from '@/context/WishlistContext';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { useRouter } from 'next/navigation';

interface WishlistButtonProps {
  productId: string;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export default function WishlistButton({
  productId,
  size = 'md',
  showLabel = false,
}: WishlistButtonProps) {
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const { user } = useAuth();
  const { addToast } = useToast();
  const router = useRouter();
  const inWishlist = isInWishlist(productId);

  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      addToast('Please sign in to add to wishlist', 'error');
      router.push('/signin');
      return;
    }

    try {
      if (inWishlist) {
        await removeFromWishlist(productId);
        addToast('Removed from wishlist', 'success');
      } else {
        await addToWishlist(productId);
        addToast('Added to wishlist', 'success');
      }
    } catch (error) {
      addToast(
        inWishlist ? 'Failed to remove from wishlist' : 'Failed to add to wishlist',
        'error'
      );
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`flex items-center gap-2 transition-colors ${
        inWishlist
          ? 'text-red-500 hover:text-red-600'
          : 'text-gray-500 hover:text-red-500'
      }`}
      aria-label={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
    >
      {inWishlist ? (
        <FaHeart className={sizeClasses[size]} />
      ) : (
        <FaRegHeart className={sizeClasses[size]} />
      )}
      {showLabel && (
        <span className="text-sm font-medium">
          {inWishlist ? 'Saved' : 'Save'}
        </span>
      )}
    </button>
  );
}
