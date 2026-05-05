'use client';

import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FaPlus, FaMinus, FaArrowRight, FaShoppingCart } from 'react-icons/fa';
import { useToast } from '@/context/ToastContext';
import { FaArrowLeftLong, FaCartShopping } from "react-icons/fa6";
import { FaTrash } from "react-icons/fa6";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"






export default function cart() {
  const { items, removeFromCart, updateQuantity, clearCart, total } = useCart();
  const { user } = useAuth();
  const router = useRouter();
  const { addToast } = useToast();

  const handleCheckout = () => {
    if (!user) {
      addToast('Please sign in to checkout', 'error');
      router.push('/signin');
      return;
    }
    router.push('/checkout');
  };

  if (items.length === 0) {
    return (
      <div className="bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center py-20">
            <div className="text-xl flex justify-center items-center mb-4">
              <div className='bg-gray-100 rounded-full p-8'>
                <svg data-prefix="fas" data-icon="box-open" className="svg-inline--fa fa-box-open text-xl h-15 w-15 text-gray-300" 
                role="img" viewBox="0 0 640 512" aria-hidden="true">
                <path fill="currentColor" d="M560.3 237.2c10.4 11.8 28.3 14.4 41.8 5.5 14.7-9.8 18.7-29.7 8.9-44.4l-48-72c-2.8-4.2-6.6-7.7-11.1-10.2L351.4 4.7c-19.3-10.7-42.8-10.7-62.2 0L88.8 116c-5.4 3-9.7 7.4-12.6 12.8L27.7 218.7c-12.6 23.4-3.8 52.5 19.6 65.1l33 17.7 0 53.3c0 23 12.4 44.3 32.4 55.7l176 99.7c19.6 11.1 43.5 11.1 63.1 0l176-99.7c20.1-11.4 32.4-32.6 32.4-55.7l0-117.5zm-240-9.8L170.2 144 320.3 60.6 470.4 144 320.3 227.4zm-41.5 50.2l-21.3 46.2-165.8-88.8 25.4-47.2 161.7 89.8z"></path>
                </svg>
              </div>
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Your cart is empty</h1>
            <p className="text-gray-500 font-medium text-lg mb-6">Looks like you haven't added anything to your cart yet. <br />Start exploring our products!</p>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
            >
              Start Shopping
              <FaArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    );
  }


  return (
    <div className="min-h-screen bg-gray-50 mb-7">
      <div className="max-w-8xl mx-auto px-4">
      <div className="pt-8 pb-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm mb-4">
          <Link href="/" className="font-medium text-gray-500 hover:text-green-600 transition-colors">Home</Link>
          <span>/</span>
          <span className="font-medium">Shopping Cart</span>
        </div>
 
        {/* Title Row */}
        <div className="flex items-start gap-2 flex-col ">
          <div className='flex items-center gap-3 justify-center'>
          <div className="w-12 h-12 bg-green-700 rounded-lg flex items-center justify-center shrink-0 shadow-lg">
            <FaCartShopping className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold ">Shopping Cart</h1>
          </div>
          </div>
          <p className="text-gray-500 text-md font-medium">You have <span className='text-green-600 '> {items.length} item</span> {items.length !== 1 ? 's' : ''} in your cart</p>
        </div>
      </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8  ">
          {/* Cart Items */}
          <div className="lg:col-span-2 ">
            <div className='border-b mb-4 border-gray-200 pb-6'>
              {items.map((item) => {
                const rawId = item.product.id ?? item.product._id;
                if (rawId === undefined || rawId === null) return null;
                const productId = String(rawId);
                const productImage = item.product.imageCover || item.product.image || item.product.images?.[0];
                const productTitle = item.product.title || item.product.name;

                return (
                  <div className='mb-3'>
                  <div
                    key={productId}
                    className="flex justify-between border shadow rounded-xl p-6 transition-colors"
                  >
                    <div className='flex gap-4'>
                    {/* Product Image */}
                    <Link href={`/products/${productId}`}>
                    <div className='w-30 h-31 group overflow-hidden py-4 px-5 rounded-lg bg-gray-50 border border-gray-100'>
                    <div className="w-full cursor-pointer h-25 group-hover:scale-110 overflow-hidden shrink-0 transition">
                      <img
                        src={productImage}
                        alt={productTitle}
                        className="object-cover "
                      />
                    </div>
                    </div>
                    </Link>

                    {/* Product Details */}
                    <div className="flex flex-col gap-2.5">
                      <Link href={`/products/${productId}`}>
                        <span className="font-semibold text-lg transition hover:text-green-600 text-gray-900 truncate">
                          {productTitle}
                        </span>
                      </Link>
                      <div>
                        {typeof item.product.category === 'object' &&
                          item.product.category?.name && (
                        <span className='text-xs rounded-full bg-green-50  px-3 py-1 font-medium text-green-700 '>{item.product.category.name}</span>
                        )}
                      
                      <p className="text-gray-400 text-xs mb-1.5 font-medium">
                        <span className='text-green-600 font-bold text-lg me-1'>{item.product.price.toFixed(2)} EGP</span> per unit
                      </p>
                      </div>


                      {/* Quantity Controls */}
                        <div className="items-center justify-between bg-gray-50 w-30 flex border border-gray-200 rounded-lg p-1">
                        <button
                          onClick={() =>
                            updateQuantity(
                              productId,
                              item.quantity - 1
                            )
                          }
                          className="p-2.5 text-white bg-green-600 rounded-md  hover:bg-green-700 transition-colors"
                        >
                          <FaMinus className="w-3 h-3" />
                        </button>
                        <span className="text-center font-semibold">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(
                              productId,
                              item.quantity + 1
                            )
                          }
                          className="p-2.5 text-white bg-green-600 rounded-md  hover:bg-green-700 transition-colors"
                        >
                          <FaPlus className="w-3 h-3" />
                        </button>
                      </div>

                    </div>
                    </div>
                    
                    <div className="flex items-end gap-2">
                        

                        <p className="font-bold text-lg mt-1"> <span className='text-sm text-gray-400 font-medium me-1'>Total </span>
                        {(item.product.price * item.quantity).toFixed(2)} <span className='text-sm text-gray-400 font-medium'> EGP</span>
                      </p>
                      {/* Remove Button */}

<AlertDialog>
      <AlertDialogTrigger>
        <Button className={'text-red-500 bg-red-50 border border-red-200  hover:text-white hover:bg-red-500 px-2.5 py-4 rounded-lg transition-colors'} variant="destructive"><FaTrash className="w-4 h-4" /></Button>
      </AlertDialogTrigger>
      <AlertDialogContent size='sm'>
        <AlertDialogHeader>
          <AlertDialogMedia className="rounded-full w-15 h-15 bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive">
            <FaTrash className="h-6 w-6" />
          </AlertDialogMedia>
          <AlertDialogTitle></AlertDialogTitle>
          <AlertDialogDescription className='text-md font-medium'>
                  Remove <strong>{productTitle}</strong> from your cart?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel variant="outline">Cancel</AlertDialogCancel>
          <AlertDialogAction variant="destructive"
          onClick={() => removeFromCart(productId)}
          >Remove</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>

                    </div>
                  </div>
                  </div>
                );
              })}
            </div>
            <div className='flex items-center justify-between'>
              <Link className='text-sm flex items-center  gap-2 text-green-600 font-medium hover:text-green-700' href={'/'}><FaArrowLeftLong /> Continue Shopping</Link>
              <AlertDialog>
                <AlertDialogTrigger>
                  <button className="flex text-sm gap-1.5 group items-center justify-center text-gray-400 hover:text-red-600 font-medium py-2 rounded-lg transition-colors">
                    <FaTrash className='group-hover:scale-110 transition'/> Clear all items
                  </button>
                </AlertDialogTrigger>
                <AlertDialogContent size='sm'>
                  <AlertDialogHeader>
                    <AlertDialogMedia className="rounded-full w-15 h-15 bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive">
                      <FaTrash className="h-6 w-6" />
                    </AlertDialogMedia>
                    <AlertDialogTitle></AlertDialogTitle>
                    <AlertDialogDescription className='text-md font-medium'>
                      Clear all <strong>{items.length} item{items.length !== 1 ? 's' : ''}</strong> from your cart?
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel variant="outline">Cancel</AlertDialogCancel>
                    <AlertDialogAction variant="destructive"
                    onClick={() => {
                      clearCart();
                      addToast('Cart cleared', 'success');
                    }}
                    >Clear All</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1 rounded-2xl shadow-sm overflow-hidden">
                            <div className="bg-black px-5 py-6 text-white flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <FaShoppingCart className="h-5 w-5" />
                                <span className="font-bold">Order Summary</span>
                              </div>
                              <span className="text-sm bg-white/20 rounded-full px-2 py-0.5">
                                {items.length} items
                              </span>
                            </div>
            <div className="bg-white shadow-sm p-6 sticky top-20">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Order Summary</h2>

              <div className="space-y-3 mb-6">
                <div className="flex font-medium justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span className="font-semibold">EGP {total.toFixed(2)}</span>
                </div>
                <div className="flex font-medium justify-between text-gray-600">
                  <span>Shipping</span>
                  <span className="font-semibold text-green-600">Calculated at checkout</span>
                </div>
                <div className="flex justify-between text-gray-600">
                </div>
              </div>

              <div className="border-t border-gray-200 pt-4 mb-6">
                <div className="flex justify-between text-lg font-bold text-gray-900">
                  <span>Total</span>
                  <span className="text-green-600">EGP {(total).toFixed(2)}</span>
                </div>
              </div>

              {!user ? (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                  <p className="text-sm text-green-900 font-medium mb-3">
                    Sign in to checkout and pay securely
                  </p>
                  <Link
                    href="/signin"
                    className="block w-full text-center bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition-colors"
                  >
                    Sign In to Continue
                  </Link>
                </div>
              ) : null}

              <button
                onClick={handleCheckout}
                disabled={!user}
                className={`w-full font-semibold py-3 rounded-lg transition-colors mb-3 ${
                  user
                    ? 'bg-green-600 hover:bg-green-700 text-white'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                {user ? 'Proceed to Checkout' : 'Sign in to Checkout'}
              </button>



              <Link
                href="/products"
                className="block text-center text-green-600 hover:text-green-700 font-medium mt-4"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
