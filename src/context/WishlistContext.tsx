'use client';
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Product } from '@/lib/products';

interface WishlistContextType {
  items: Product[];
  isLoading: boolean;
  addToWishlist: (productId: string) => Promise<void>;
  removeFromWishlist: (productId: string) => Promise<void>;
  fetchWishlist: () => Promise<void>;
  isInWishlist: (productId: string) => boolean;
  error: string | null;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: ReactNode }) {
  const { token } = useAuth();
  const [items, setItems] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchWishlist = async () => {
    if (!token) {
      setItems([]);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('https://ecommerce.routemisr.com/api/v1/wishlist', {
        headers: {
          'Content-Type': 'application/json',
          token,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setItems(data.data || []);
      } else if (response.status === 401) {
        setItems([]);
      } else {
        setError('Failed to fetch wishlist');
      }
    } catch (err) {
      console.error('Wishlist fetch error:', err);
      setError('Network error');
    } finally {
      setIsLoading(false);
    }
  };

  const addToWishlist = async (productId: string) => {
    if (!token) {
      setError('Authentication required to update wishlist');
      throw new Error('Authentication required to update wishlist');
    }

    try {
      const response = await fetch('https://ecommerce.routemisr.com/api/v1/wishlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          token,
        },
        body: JSON.stringify({ productId }),
      });

      const data = await response.json();

      if (response.ok) {
        await fetchWishlist();
      } else {
        setError(data.message || 'Failed to add to wishlist');
        throw new Error(data.message || 'Failed to add to wishlist');
      }
    } catch (err) {
      console.error('Add to wishlist error:', err);
      throw err;
    }
  };

  const removeFromWishlist = async (productId: string) => {
    if (!token) {
      throw new Error('Not authenticated');
    }

    setError(null);

    try {
      const response = await fetch(
        `https://ecommerce.routemisr.com/api/v1/wishlist/${productId}`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            token,
          },
        }
      );

      const data = await response.json();

      if (response.ok) {
        await fetchWishlist();
      } else {
        setError(data.message || 'Failed to remove from wishlist');
        throw new Error(data.message || 'Failed to remove from wishlist');
      }
    } catch (err) {
      console.error('Remove from wishlist error:', err);
      throw err;
    }
  };

  const isInWishlist = (productId: string) => {
    return items.some((item) => (item.id ?? item._id) === productId);
  };

  useEffect(() => {
    if (token) {
      fetchWishlist();
    } else {
      setItems([]);
    }
  }, [token]);

  return (
    <WishlistContext.Provider
      value={{
        items,
        isLoading,
        addToWishlist,
        removeFromWishlist,
        fetchWishlist,
        isInWishlist,
        error,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error('useWishlist must be used within WishlistProvider');
  }
  return context;
}
