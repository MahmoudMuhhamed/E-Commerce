const API_V1 = 'https://ecommerce.routemisr.com/api/v1';
const API_V2 = 'https://ecommerce.routemisr.com/api/v2';

export interface ShippingAddressPayload {
  details: string;
  phone: string;
  city: string;
  postalCode?: string;
}

export interface ApiOrder {
  _id: string;
  id?: number;
  shippingAddress?: {
    details?: string;
    phone?: string;
    city?: string;
    postalCode?: string;
  };
  taxPrice?: number;
  shippingPrice?: number;
  totalOrderPrice?: number;
  paymentMethodType?: string;
  isPaid?: boolean;
  isDelivered?: boolean;
  cartItems?: Array<{
    count: number;
    price?: number;
    product?: {
      _id?: string;
      title?: string;
      imageCover?: string;
    };
  }>;
  createdAt?: string;
  paidAt?: string;
}

export async function fetchUserOrders(
  token: string,
  userId: string
): Promise<ApiOrder[]> {
  const res = await fetch(`${API_V1}/orders/user/${userId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: 'no-store',
  });

  if (!res.ok) {
    throw new Error('Failed to load orders');
  }

  const data = await res.json();
  if (Array.isArray(data)) return data;
  return data.data ?? [];
}

export async function createCashOrderFromCart(
  token: string,
  cartId: string,
  shippingAddress: ShippingAddressPayload
): Promise<Response> {
  return fetch(`${API_V2}/orders/${cartId}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ shippingAddress }),
  });
}

/** Stripe checkout session — returns URL to redirect */
export async function createCheckoutSession(
  token: string,
  cartId: string,
  callbackUrl: string
): Promise<{ session?: { url?: string }; url?: string }> {
  const url = `${API_V1}/orders/checkout-session/${cartId}?url=${encodeURIComponent(callbackUrl)}`;
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.message || 'Checkout session failed');
  }
  return data;
}
