import type { CartItem } from '@/context/CartContext';
import {
  addToCart,
  clearCart,
  getCart,
  updateCartQuantity,
} from '@/lib/cartApi';

/**
 * Replace server cart with local items and return cartId for checkout.
 */
export async function syncLocalCartToServer(
  token: string,
  items: CartItem[]
): Promise<{ cartId: string }> {
  try {
    await clearCart(token);
  } catch {
    /* ignore empty clear errors */
  }

  for (const item of items) {
    const pid = String(item.product.id ?? item.product._id ?? '');
    if (!pid) continue;
    await addToCart(token, pid);
    if (item.quantity > 1) {
      await updateCartQuantity(token, pid, item.quantity);
    }
  }

  const cart = await getCart(token);
  return { cartId: cart.cartId };
}
