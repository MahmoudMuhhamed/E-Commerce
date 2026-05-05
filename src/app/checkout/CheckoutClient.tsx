'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/context/ToastContext';
import { syncLocalCartToServer } from '@/lib/syncCartToServer';
import {
  createCashOrderFromCart,
  createCheckoutSession,
} from '@/lib/ordersApi';
import { loadSavedAddresses, type SavedAddress } from '@/lib/savedAddresses';
import {
  FaArrowLeft,
  FaClipboardList,
  FaHome,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaCity,
  FaInfoCircle,
  FaWallet,
  FaMoneyBillWave,
  FaCreditCard,
  FaShieldAlt,
  FaShoppingCart,
  FaTruck,
  FaCheck,
  FaSync,
} from 'react-icons/fa';
import { SiVisa, SiMastercard, SiStripe } from 'react-icons/si';
import { FaPlus } from 'react-icons/fa6';

type PayMethod = 'cod' | 'online';

export default function CheckoutClient() {
  const { user, token } = useAuth();
  const { items, total, clearCart } = useCart();
  const { addToast } = useToast();
  const router = useRouter();

  const [saved, setSaved] = useState<SavedAddress[]>([]);
  const [selectedAddrId, setSelectedAddrId] = useState<string | null>(null);
  const [useNew, setUseNew] = useState(false);

  const [city, setCity] = useState('');
  const [details, setDetails] = useState('');
  const [phone, setPhone] = useState('');
  const [postalCode, setPostalCode] = useState('');

  const [payment, setPayment] = useState<PayMethod>('cod');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!user || !token) {
      router.replace('/signin');
      return;
    }
    const list = loadSavedAddresses();
    setSaved(list);
    if (list.length > 0) {
      setSelectedAddrId(list[0].id);
      setCity(list[0].city);
      setDetails(list[0].details);
      setPhone(list[0].phone);
    }
  }, [user, token, router]);

  useEffect(() => {
    if (!selectedAddrId || useNew) return;
    const a = saved.find((x) => x.id === selectedAddrId);
    if (a) {
      setCity(a.city);
      setDetails(a.details);
      setPhone(a.phone);
    }
  }, [selectedAddrId, saved, useNew]);

  if (!user || !token) return null;

  if (items.length === 0) {
    return (
      <div className="max-w-lg mx-auto py-20 text-center">
        <p className="text-gray-600 mb-4">Your cart is empty.</p>
        <Link href="/products" className="text-green-600 font-semibold hover:underline">
          Continue shopping
        </Link>
      </div>
    );
  }

  const shippingPayload = () => ({
    details: details.trim(),
    phone: phone.trim(),
    city: city.trim(),
    postalCode: postalCode.trim() || undefined,
  });

  const validate = () => {
    if (!city.trim() || !details.trim() || !phone.trim()) {
      addToast('Please fill in city, street address, and phone', 'error');
      return false;
    }
    return true;
  };

  const handlePlaceOrder = async () => {
    if (!validate()) return;
    setSubmitting(true);
    try {
      const { cartId } = await syncLocalCartToServer(token, items);
      const body = shippingPayload();

      if (payment === 'cod') {
        const res = await createCashOrderFromCart(token, cartId, body);
        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
          throw new Error(data.message || data.errors?.[0]?.msg || 'Order failed');
        }
        clearCart();
        addToast('Order placed successfully', 'success');
        router.push('/account/orders');
        return;
      }

      const origin =
        typeof window !== 'undefined' ? window.location.origin : '';
      const sessionData = await createCheckoutSession(
        token,
        cartId,
        `${origin}/cart`
      );
      const payUrl =
        sessionData.session?.url ??
        (sessionData as { url?: string }).url;
      if (payUrl) {
        window.location.href = payUrl;
      } else {
        throw new Error('No payment URL returned');
      }
    } catch (e: unknown) {
      addToast(e instanceof Error ? e.message : 'Checkout failed', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const shippingFree = total >= 500;
  const shippingCost = shippingFree ? 0 : 50;
  const grandTotal = total + shippingCost;

  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      <div className="max-w-8xl mx-auto px-4 py-8">
        <div className="flex flex-wrap items-start justify-between gap-4 mb-8">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Link href="/" className="hover:text-green-600">
              Home
            </Link>
            <span>/</span>
            <Link href="/cart" className="hover:text-green-600">
              Cart
            </Link>
            <span>/</span>
            <span className="text-gray-900">Checkout</span>
          </div>
          <Link
            href="/cart"
            className="inline-flex items-center gap-2 text-green-600 font-semibold hover:underline text-sm"
          >
            <FaArrowLeft className="h-3 w-3" />
            Back to Cart
          </Link>
        </div>

        <div className="flex flex-col lg:flex-row gap-2 mb-8">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-green-600 text-white">
              <FaClipboardList className="h-7 w-7" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                Complete Your Order
              </h1>
              <p className="text-gray-500 text-sm mt-1">
                Review your items and complete your purchase
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 items-start">
          <div className="xl:col-span-2 space-y-6">
            {/* Shipping */}
            <div className="rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden">
              <div className="bg-green-800 px-5 py-4 text-white">
                <div className="flex items-center gap-3">
                  <FaHome className="h-5 w-5" />
                  <div>
                    <h2 className="font-bold text-lg">Shipping Address</h2>
                    <p className="text-white/80 text-sm">
                      Where should we deliver your order?
                    </p>
                  </div>
                </div>
              </div>
              <div className="p-5 space-y-5">
                <div>
                  <p className="text-sm font-semibold text-gray-900 mb-1 flex items-center gap-2">
                    <FaMapMarkerAlt className="text-green-600 h-4 w-4" />
                    Saved Addresses
                  </p>
                  <p className="text-xs text-gray-500 mb-3">
                    Select a saved address or enter a new one below
                  </p>
                  <div className="space-y-3">
                    {saved.map((a) => (
                      <button
                        key={a.id}
                        type="button"
                        onClick={() => {
                          setUseNew(false);
                          setSelectedAddrId(a.id);
                        }}
                        className={`w-full text-left rounded-xl border p-4 flex gap-3 transition ${
                          selectedAddrId === a.id && !useNew
                            ? 'border-green-500 bg-green-50/50 ring-1 ring-green-500'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <FaMapMarkerAlt className="text-gray-400 mt-1 shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-gray-900">{a.label}</p>
                          <p className="text-sm text-gray-600">{a.city}</p>
                          <p className="text-xs text-gray-500">{a.phone}</p>
                        </div>
                        {selectedAddrId === a.id && !useNew && (
                          <FaCheck className="text-green-600 shrink-0" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setUseNew(true);
                    setSelectedAddrId(null);
                  }}
                  className={`w-full rounded-xl border-2 border-dashed border-green-300 bg-green-50/30 p-4 flex items-center gap-4 transition hover:bg-green-50 ${
                    useNew ? 'ring-2 ring-green-500' : ''
                  }`}
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-600 text-white">
                    <FaPlus className="h-5 w-5" />
                  </span>
                  <div className="text-left">
                    <p className="font-bold text-green-700">Use a different address</p>
                    <p className="text-xs text-gray-600">
                      Enter a new shipping address manually
                    </p>
                  </div>
                </button>

                <div className="flex gap-3 rounded-xl bg-blue-50 border border-blue-100 px-4 py-3 text-sm text-blue-900">
                  <FaInfoCircle className="h-5 w-5 shrink-0 mt-0.5" />
                  <p>
                    <span className="font-semibold">Delivery Information</span> — Please
                    ensure your address is accurate for smooth delivery
                  </p>
                </div>

                <div className="grid gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      City <span className="text-red-500">*</span>
                    </label>
                    <div className="relative mt-1">
                      <FaCity className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <input
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder="e.g. Cairo, Alexandria, Giza"
                        className="w-full rounded-xl border border-gray-200 py-3 pl-10 pr-4 text-sm"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      Street Address <span className="text-red-500">*</span>
                    </label>
                    <div className="relative mt-1">
                      <FaMapMarkerAlt className="absolute left-3 top-3 text-gray-400 h-4 w-4" />
                      <textarea
                        value={details}
                        onChange={(e) => setDetails(e.target.value)}
                        placeholder="Street name, building number, floor, apartment..."
                        rows={3}
                        className="w-full rounded-xl border border-gray-200 py-3 pl-10 pr-4 text-sm"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      Phone Number <span className="text-red-500">*</span>
                    </label>
                    <div className="relative mt-1 flex items-center">
                      <FaPhoneAlt className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <input
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="01xxxxxxxxx"
                        className="w-full rounded-xl border border-gray-200 py-3 pl-10 pr-36 text-sm"
                      />
                      <span className="absolute right-3 text-xs text-gray-400 pointer-events-none">
                        Egyptian numbers only
                      </span>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      Postal code (optional)
                    </label>
                    <input
                      value={postalCode}
                      onChange={(e) => setPostalCode(e.target.value)}
                      className="mt-1 w-full rounded-xl border border-gray-200 px-4 py-3 text-sm"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Payment */}
            <div className="rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden">
              <div className="bg-green-800 px-5 py-4 text-white">
                <div className="flex items-center gap-3">
                  <FaWallet className="h-5 w-5" />
                  <div>
                    <h2 className="font-bold text-lg">Payment Method</h2>
                    <p className="text-white/80 text-sm">
                      Choose how you&apos;d like to pay
                    </p>
                  </div>
                </div>
              </div>
              <div className="p-5 space-y-4">
                <button
                  type="button"
                  onClick={() => setPayment('cod')}
                  className={`w-full rounded-xl border-2 p-4 flex items-start gap-4 text-left transition ${
                    payment === 'cod'
                      ? 'border-green-600 bg-green-50/50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-green-600 text-white">
                    <FaMoneyBillWave className="h-5 w-5" />
                  </span>
                  <div className="flex-1">
                    <p className="font-bold text-gray-900">Cash on Delivery</p>
                    <p className="text-sm text-gray-600">
                      Pay when your order arrives at your doorstep
                    </p>
                  </div>
                  {payment === 'cod' ? (
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-green-600 text-white">
                      <FaCheck className="h-3 w-3" />
                    </span>
                  ) : (
                    <span className="h-6 w-6 rounded-full border-2 border-gray-300 shrink-0" />
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setPayment('online')}
                  className={`w-full rounded-xl border-2 p-4 flex items-start gap-4 text-left transition ${
                    payment === 'online'
                      ? 'border-green-600 bg-green-50/50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gray-700 text-white">
                    <FaCreditCard className="h-5 w-5" />
                  </span>
                  <div className="flex-1">
                    <p className="font-bold text-gray-900">Pay Online</p>
                    <p className="text-sm text-gray-600">
                      Secure payment with Credit/Debit Card via Stripe
                    </p>
                    <div className="flex items-center gap-3 mt-2 text-2xl text-gray-600">
                      <SiVisa />
                      <SiMastercard />
                      <SiStripe />
                    </div>
                  </div>
                  {payment === 'online' ? (
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-green-600 text-white">
                      <FaCheck className="h-3 w-3" />
                    </span>
                  ) : (
                    <span className="h-6 w-6 rounded-full border-2 border-gray-300 shrink-0" />
                  )}
                </button>

                <div className="flex gap-3 rounded-xl bg-green-50 border border-green-100 px-4 py-3 text-sm text-green-900">
                  <FaShieldAlt className="h-5 w-5 shrink-0 mt-0.5 text-green-600" />
                  <p>
                    <span className="font-semibold">Secure & Encrypted</span> — Your
                    payment info is protected with 256-bit SSL encryption
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Summary */}
          <div className="xl:col-span-1">
            <div className="sticky top-24 rounded-2xl border border-gray-100 bg-white shadow-lg overflow-hidden">
              <div className="bg-green-800 px-5 py-4 text-white flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FaShoppingCart className="h-5 w-5" />
                  <span className="font-bold">Order Summary</span>
                </div>
                <span className="text-sm bg-white/20 rounded-full px-2 py-0.5">
                  {items.length} items
                </span>
              </div>
              <div className="max-h-72 overflow-y-auto divide-y divide-gray-100 p-4">
                {items.map((item) => {
                  const pid = String(item.product.id ?? item.product._id);
                  const img =
                    item.product.imageCover ||
                    item.product.image ||
                    item.product.images?.[0];
                  const title = item.product.title || item.product.name || 'Product';
                  const line = item.product.price * item.quantity;
                  return (
                    <div key={pid} className="flex gap-3 py-3 first:pt-0">
                      <div className="h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-gray-50">
                        {img ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={img} alt="" className="h-full w-full object-cover" />
                        ) : null}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold text-gray-900 text-sm line-clamp-2">
                          {title}
                        </p>
                        <p className="text-xs text-gray-500">
                          {item.quantity} × {item.product.price.toFixed(2)} EGP
                        </p>
                      </div>
                      <p className="font-bold text-gray-900 text-sm shrink-0">
                        {line.toFixed(2)}
                      </p>
                    </div>
                  );
                })}
              </div>
              <div className="border-t border-gray-100 p-5 space-y-2 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span className="font-semibold">{total.toFixed(2)} EGP</span>
                </div>
                <div className="flex justify-between text-gray-600 items-center">
                  <span className="flex items-center gap-1">
                    <FaTruck className="h-3 w-3" />
                    Shipping
                  </span>
                  <span className="font-bold text-green-600">
                    {shippingFree ? 'FREE' : `${shippingCost} EGP`}
                  </span>
                </div>
                <div className="flex justify-between text-lg font-bold pt-2 border-t border-gray-100">
                  <span>Total</span>
                  <span className="text-green-600">{grandTotal.toFixed(2)} EGP</span>
                </div>
              </div>
              <div className="p-5 pt-0">
                <button
                  type="button"
                  onClick={handlePlaceOrder}
                  disabled={submitting}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-green-600 py-4 font-bold text-white hover:bg-green-700 disabled:opacity-50 transition"
                >
                  <FaShoppingCart className="h-5 w-5" />
                  {submitting ? 'Processing…' : 'Place Order'}
                </button>
                <div className="flex flex-wrap justify-center gap-4 mt-4 text-xs text-gray-600">
                  <span className="inline-flex items-center gap-1">
                    <FaShieldAlt className="text-green-600" /> Secure
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <FaTruck className="text-blue-500" /> Fast Delivery
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <FaSync className="text-orange-500" /> Easy Returns
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
