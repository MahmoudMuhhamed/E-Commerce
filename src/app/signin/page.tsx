'use client';

import { useState, type ChangeEvent, type FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  FaStar, FaShieldAlt,
  FaEye, FaEyeSlash, FaGoogle, FaFacebook,
  FaTruck,
  FaClock,
  FaUsers,
  FaLock,
} from 'react-icons/fa';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { FaEnvelope } from "react-icons/fa6";

 const perks = [
    { icon: <FaTruck className="w-3.5 h-3.5 text-green-600" />, label: 'Free Delivery' },
    { icon: <FaShieldAlt className="w-3.5 h-3.5 text-green-600" />, label: 'Secure Payment' },
    { icon: <FaClock className="w-3.5 h-3.5 text-green-600" />, label: '24/7 Support' },
  ];
 const perksForm = [
    { icon: <FaLock className="w-3.5 h-3.5 text-gray-500" />, label: 'SSL Secured' },
    { icon: <FaUsers className="w-3.5 h-3.5 text-gray-500" />, label: '50K+ Users' },
    { icon: <FaStar className="w-3.5 h-3.5 text-gray-500" />, label: '4.9 Rating' },
  ];

  const image = '/freshcart.png';

export default function SignIn() {
  const router = useRouter();
  const { login, isLoading } = useAuth();
  const { addToast } = useToast();

  const [form, setForm] = useState({
    email: '',
    password: '',
  });
  const [showPass, setShowPass] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [apiError, setApiError] = useState('');
  const [keepSigned, setKeepSigned] = useState(false);
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.email.trim()) e.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Invalid email address';
    if (!form.password) e.password = 'Password is required';
    else if (form.password.length < 8) e.password = 'At least 8 characters required';
    return e;
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
    setApiError('');
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }

    setApiError('');
    setLoading(true);

    try {
      await login(form.email, form.password);
      if (keepSigned) {
        localStorage.setItem('keepSigned', 'true');
      }
      addToast('Welcome back!', 'success');
      // Small delay to ensure state updates before redirect
      setTimeout(() => {
        router.push('/');
      }, 500);
    } catch (error) {
      setApiError(error instanceof Error ? error.message : 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center py-15">
      <div className="w-full max-w-7xl px-4">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">

          {/* ── Left Panel ── */}
          <div className=" flex flex-col items-center justify-center">
            {/* Cart illustration */}
          <div className='h-95 w-full'>
            <img className='h-full! w-full rounded-2xl object-cover shadow-xl shadow-gray-200' src={image} alt="cartShopping-image" />
          </div>
 
            {/* Tagline */}
            <div>
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900 mt-6">
                FreshCart - Your One-Stop Shop for Fresh <br /> Products
              </h2>
              <p className="text-gray-600 text-lg font-medium my-3">
                Join thousands of happy customers who trust FreshCart for their daily grocery needs
              </p>
            </div>
 

            <div className="flex items-center gap-5 flex-wrap justify-center">
              {perks.map((p) => (
                <div key={p.label} className="flex items-center gap-2.5 text-sm font-medium text-gray-600">
                  {p.icon}
                  {p.label}
                </div>
              ))}
            </div>

            </div>
          </div>

          {/* ── Right Panel: Form ── */}
          <div className="p-8 sm:py-8 sm:px-12 shadow-xl rounded-2xl shadow-gray-200">
            <div className="text-center mb-6">
              <h2 className="text-3xl font-bold text-gray-700"><span className='text-green-600 '>Fresh</span>Cart</h2>
              <h2 className="text-2xl font-bold text-gray-700 mt-4 mb-2">Welcome Back!</h2>
              <p className="text-gray-600 font-medium text">Sign in to continue your fresh shopping experience</p>
            </div>

            {/* Social Buttons */}
            <div className="grid grid-cols-1 gap-3 mt-9 mb-6">
              <button className="flex items-center justify-center gap-2 border-2 border-gray-200 rounded-lg py-3 font-medium text-gray-800 hover:bg-gray-50 transition-colors">
                <FaGoogle className="w-4 h-4 text-red-500" /> Continue with Google
              </button>
              <button className="flex items-center justify-center gap-2 border-2 border-gray-200 rounded-lg py-3 font-medium text-gray-800 hover:bg-gray-50 transition-colors">
                <FaFacebook className="w-4 h-4 text-blue-600" /> Continue with Facebook
              </button>
            </div>

            {/* Divider */}
            <div className="flex items-center gap-3 mb-4">
              <div className="flex-1 h-px bg-gray-200" />
              <span className="text-sm text-gray-500 font-medium">OR CONTINUE WITH EMAIL</span>
              <div className="flex-1 h-px bg-gray-200" />
            </div>

            {/* API Error */}
            {apiError && (
              <div className="mb-4 bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3">
                {apiError}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email */}
              <div>
                <label className="font-semibold text-sm text-gray-700 mb-1.5 block">Email Address</label>
                <div className='relative'>
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  className={`w-full ps-10 pe-3 py-2.5 border-2 border-gray-200 rounded-lg p-3  placeholder-gray-400 transition-all ${errors.email ? 'border-red-400 focus:border-red-400' : 'border-gray-200 focus:border-green-400'}`}
                />
                <div className="absolute inset-y-0 inset-s-0 flex items-center ps-3 pointer-events-none">
                      <FaEnvelope className="w-4 h-4 text-gray-400"/>
                </div>
                </div>
                {errors.email && <p className="text-sm font-medium text-red-600 mt-1">*{errors.email}</p>}
              </div>

              {/* Password */}
              <div>
                <div className='flex justify-between my-1'>
                <label className="font-semibold text-sm text-gray-700 mb-1.5 block">Password</label>
                <div className="flex justify-end">
                  <Link href="/forgot-password" className="text-sm text-green-600 hover:text-green-800 font-medium">
                    Forgot password?
                  </Link>
                </div>

                </div>
                <div className="relative">
                  <div className='relative'>
                  <input
                    name="password"
                    type={showPass ? 'text' : 'password'}
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    className={`w-full border-2 border-gray-200 ps-10 pe-3 py-2.5 rounded-lg p-3 pr-10 placeholder-gray-400 transition-all ${errors.password ? 'border-red-400' : 'border-gray-200 focus:border-green-400'}`}
                  />
                  <div className="absolute inset-y-0 inset-s-0 flex items-center ps-3 pointer-events-none">
                      <FaLock className="w-4 h-4 text-gray-400"/>
                  </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPass ? <FaEyeSlash className="w-4 h-4" /> : <FaEye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.password && <p className="text-sm font-medium text-red-600 mt-1">*{errors.password}</p>}
              </div>


                <label className="flex items-center gap-2.5 cursor-pointer select-none group">
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={keepSigned}
                    onChange={(e) => setKeepSigned(e.target.checked)}
                    className="sr-only"
                  />
                  <div className={`w-4 h-4 rounded-xs border flex items-center justify-center transition-all ${keepSigned ? 'bg-green-600 hover:bg-green-700 border-green-500' : 'border-gray-500 bg-white group-hover:gray-green-500'}`}>
                    {keepSigned && (
                      <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                </div>
                <span className="text-sm text-gray-800 font-medium transition-colors">
                  Keep me signed in
                </span>
              </label>


              {/* Submit */}
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded-lg transition-all shadow active:scale-95 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
              
                {isLoading ? 'Signing In...' : 'Sign In'}
              </button>
            </form>

            {/* Sign Up Link */}
            <p className="text-center text-gray-800 font-medium my-6">
              New to FreshCart?{'  '}
              <Link href="/signup" className="text-green-600 hover:underline font-semibold">Create an account</Link>
            </p>

              <div className="flex items-center mt-3 mb-5 gap-6 flex-wrap justify-center">
              {perksForm.map((p) => (
                <div key={p.label} className="flex items-center gap-1 text-xs font-medium text-gray-500">
                  {p.icon}
                  {p.label}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

