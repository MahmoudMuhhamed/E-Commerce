import { Product } from './products';

export interface CartItem {
  product: Product;
  count: number;
}

export interface CartResponse {
  status: string;
  message: string;
  numOfCartItems: number;
  cartId: string;
  data: {
    _id: string;
    cartOwner: string;
    products: CartItem[];
    createdAt: string;
    updatedAt: string;
    __v: number;
    totalCartPrice: number;
  };
}

const API_BASE = 'https://ecommerce.routemisr.com/api/v2';

export async function getCart(token: string): Promise<CartResponse> {
  const response = await fetch(`${API_BASE}/cart`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch cart');
  }

  return response.json();
}

export async function addToCart(token: string, productId: string): Promise<CartResponse> {
  const response = await fetch(`${API_BASE}/cart`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ productId }),
  });

  if (!response.ok) {
    throw new Error('Failed to add product to cart');
  }

  return response.json();
}

export async function updateCartQuantity(token: string, productId: string, count: number): Promise<CartResponse> {
  const response = await fetch(`${API_BASE}/cart/${productId}`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ count }),
  });

  if (!response.ok) {
    throw new Error('Failed to update cart quantity');
  }

  return response.json();
}

export async function removeFromCart(token: string, productId: string): Promise<CartResponse> {
  const response = await fetch(`${API_BASE}/cart/${productId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to remove product from cart');
  }

  return response.json();
}

export async function clearCart(token: string): Promise<CartResponse> {
  const response = await fetch(`${API_BASE}/cart`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to clear cart');
  }

  return response.json();
}