'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import {
  fetchUserOrders,
  type ApiOrder,
} from '@/lib/ordersApi';
import {
  FaChevronDown,
  FaChevronUp,
  FaClock,
  FaTruck,
  FaCheckCircle,
  FaCalendarAlt,
  FaBox,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaFileInvoice,
} from 'react-icons/fa';

function getStatus(order: ApiOrder) {
  if (order.isDelivered) {
    return {
      label: 'Delivered',
      Icon: FaCheckCircle,
      className: 'bg-green-100 text-green-800 border-green-200',
    };
  }
  if (order.isPaid && !order.isDelivered) {
    return {
      label: 'On the way',
      Icon: FaTruck,
      className: 'bg-blue-100 text-blue-800 border-blue-200',
    };
  }
  return {
    label: 'Processing',
    Icon: FaClock,
    className: 'bg-orange-100 text-orange-800 border-orange-200',
  };
}

function formatDate(iso?: string) {
  if (!iso) return '—';
  try {
    return new Date(iso).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  } catch {
    return iso;
  }
}

export default function OrdersClient() {
  const { user, token } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<ApiOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openId, setOpenId] = useState<string | null>(null);

  useEffect(() => {
    if (!user || !token) {
      router.replace('/signin');
      return;
    }

    const uid = (user as { _id?: string })._id ?? user.id;
    if (!uid) {
      setLoading(false);
      setError('User id missing');
      return;
    }

    let cancelled = false;
    (async () => {
      try {
        const data = await fetchUserOrders(token, uid);
        if (!cancelled) setOrders(data);
      } catch (e) {
        if (!cancelled) setError('Could not load orders');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [user, token, router]);

  if (!user) return null;

  if (loading) {
    return (
      <div className="py-20 text-center text-gray-500">Loading orders…</div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-red-100 bg-red-50 p-6 text-red-800">
        {error}
      </div>
    );
  }

  return (
    <div>
      <p className="text-gray-500 mb-6">
        Track and manage your {orders.length} order{orders.length === 1 ? '' : 's'}
      </p>

      <div className="space-y-4">
        {orders.map((order) => {
          const status = getStatus(order);
          const StatusIcon = status.Icon;
          const items = order.cartItems ?? [];
          const totalQty = items.reduce((s, i) => s + (i.count ?? 0), 0);
          const linesSubtotal = items.reduce(
            (s, i) => s + (i.count ?? 0) * (i.price ?? 0),
            0
          );
          const firstImg = items[0]?.product?.imageCover;
          const oid = order._id;
          const orderNo = order.id ?? oid.slice(-6);
          const expanded = openId === oid;

          return (
            <div
              key={oid}
              className="rounded-xl border border-gray-100 bg-white shadow-sm overflow-hidden"
            >
              <div className="p-4 sm:p-5">
                <div className="flex flex-wrap gap-4">
                  <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-gray-50">
                    {firstImg ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={firstImg}
                        alt=""
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-gray-300">
                        <FaBox />
                      </div>
                    )}
                    {items.length > 1 && (
                      <span className="absolute -right-1 -top-1 flex h-6 min-w-6 items-center justify-center rounded-full bg-gray-900 px-1 text-[10px] font-bold text-white">
                        +{items.length - 1}
                      </span>
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <span
                        className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-semibold ${status.className}`}
                      >
                        <StatusIcon className="h-3 w-3" />
                        {status.label}
                      </span>
                    </div>
                    <p className="font-bold text-gray-900"># {orderNo}</p>
                    <p className="text-xs text-gray-500 mt-1 flex flex-wrap items-center gap-2">
                      <span className="inline-flex items-center gap-1">
                        <FaCalendarAlt className="h-3 w-3" />
                        {formatDate(order.createdAt ?? order.paidAt)}
                      </span>
                      <span>·</span>
                      <span className="inline-flex items-center gap-1">
                        <FaBox className="h-3 w-3" />
                        {totalQty} items
                      </span>
                      <span>·</span>
                      <span className="inline-flex items-center gap-1">
                        <FaMapMarkerAlt className="h-3 w-3" />
                        {order.shippingAddress?.city ?? '—'}
                      </span>
                    </p>
                  </div>

                  <div className="flex flex-col items-end gap-2 shrink-0">
                    <button
                      type="button"
                      className="rounded border border-gray-200 p-2 text-gray-400 hover:bg-gray-50"
                      aria-label="Invoice"
                    >
                      <FaFileInvoice className="h-4 w-4" />
                    </button>
                    <p className="text-lg font-bold text-gray-900 whitespace-nowrap">
                      {order.totalOrderPrice?.toLocaleString() ?? '—'} EGP
                    </p>
                    <button
                      type="button"
                      onClick={() =>
                        setOpenId(expanded ? null : oid)
                      }
                      className={`inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-sm font-medium transition ${
                        expanded
                          ? 'bg-green-600 text-white'
                          : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                      }`}
                    >
                      {expanded ? (
                        <>
                          Hide <FaChevronUp className="h-3 w-3" />
                        </>
                      ) : (
                        <>
                          Details <FaChevronDown className="h-3 w-3" />
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {expanded && (
                  <div className="mt-6 border-t border-gray-100 pt-6 space-y-6">
                    <div>
                      <h4 className="mb-3 flex items-center gap-2 text-sm font-bold text-gray-900">
                        <span className="flex h-6 w-6 items-center justify-center rounded bg-green-600 text-white text-xs">
                          <FaBox className="h-3 w-3" />
                        </span>
                        Order Items
                      </h4>
                      <div className="space-y-3">
                        {items.map((line, idx) => (
                          <div
                            key={`${oid}-${idx}`}
                            className="flex items-center gap-3 border-b border-gray-50 pb-3 last:border-0"
                          >
                            <div className="h-12 w-12 shrink-0 overflow-hidden rounded-md bg-gray-50">
                              {line.product?.imageCover ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img
                                  src={line.product.imageCover}
                                  alt=""
                                  className="h-full w-full object-cover"
                                />
                              ) : null}
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="font-medium text-gray-900 line-clamp-2">
                                {line.product?.title ?? 'Product'}
                              </p>
                              <p className="text-xs text-gray-500">
                                {line.count} × {line.price?.toLocaleString() ?? '—'} EGP
                              </p>
                            </div>
                            <p className="font-semibold text-gray-900 shrink-0">
                              {((line.count ?? 0) * (line.price ?? 0)).toLocaleString()}{' '}
                              EGP
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="grid gap-6 md:grid-cols-2">
                      <div>
                        <h4 className="mb-2 flex items-center gap-2 text-sm font-bold text-gray-900">
                          <FaMapMarkerAlt className="h-4 w-4 text-blue-500" />
                          Delivery Address
                        </h4>
                        <p className="font-semibold text-gray-900">
                          {order.shippingAddress?.city ?? '—'}
                        </p>
                        <p className="text-sm text-gray-600 mt-1">
                          {order.shippingAddress?.details ?? '—'}
                        </p>
                        <p className="mt-2 flex items-center gap-2 text-sm text-gray-700">
                          <FaPhoneAlt className="h-3 w-3 text-gray-400" />
                          {order.shippingAddress?.phone ?? '—'}
                        </p>
                      </div>
                      <div className="rounded-xl bg-amber-50 border border-amber-100 p-4">
                        <h4 className="mb-3 flex items-center gap-2 text-sm font-bold text-amber-900">
                          <FaClock className="h-4 w-4 text-amber-600" />
                          Order Summary
                        </h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between text-gray-700">
                            <span>Subtotal</span>
                            <span>{linesSubtotal.toLocaleString()} EGP</span>
                          </div>
                          <div className="flex justify-between text-gray-700">
                            <span>Shipping</span>
                            <span className="font-semibold text-green-600">
                              {(order.shippingPrice ?? 0) === 0
                                ? 'Free'
                                : `${order.shippingPrice} EGP`}
                            </span>
                          </div>
                          <div className="flex justify-between border-t border-amber-200 pt-2 font-bold text-gray-900">
                            <span>Total</span>
                            <span>
                              {order.totalOrderPrice?.toLocaleString() ?? '—'} EGP
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {orders.length === 0 && (
        <div className="rounded-xl border border-dashed border-gray-200 bg-white py-16 text-center">
          <p className="text-gray-600 mb-4">You have no orders yet.</p>
          <Link
            href="/products"
            className="font-semibold text-green-600 hover:underline"
          >
            Start shopping
          </Link>
        </div>
      )}
    </div>
  );
}
