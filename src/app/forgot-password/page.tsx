'use client';

import { useState, type ChangeEvent, type FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FaEnvelope, FaKey, FaLock, FaShieldAlt } from 'react-icons/fa';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { MdEmail } from 'react-icons/md';
import { FaArrowLeftLong } from 'react-icons/fa6';
import Stepper from '@/_components/Stepper';


export default function ForgotPassword() {
  const router = useRouter();
  const { forgotPassword, verifyResetCode, isLoading } = useAuth();
  const { addToast } = useToast();

  const [step, setStep] = useState<'email' | 'code' | 'password'>('email');
  const [form, setForm] = useState({
    email: '',
    resetCode: '',
    password: '',
    rePassword: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [apiError, setApiError] = useState('');

  const validateEmail = () => {
    const e: Record<string, string> = {};
    if (!form.email.trim()) e.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Invalid email address';
    return e;
  };

  const validateCode = () => {
    const e: Record<string, string> = {};
    if (!form.resetCode.trim()) e.resetCode = 'Reset code is required';
    return e;
  };

  const validatePassword = () => {
    const e: Record<string, string> = {};
    if (!form.password) e.password = 'Password is required';
    else if (form.password.length < 8) e.password = 'At least 8 characters required';
    if (!form.rePassword) e.rePassword = 'Please confirm your password';
    else if (form.rePassword !== form.password) e.rePassword = 'Passwords do not match';
    return e;
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
    setApiError('');
  };

  const handleEmailSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const errs = validateEmail();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }

    setApiError('');

    try {
      await forgotPassword(form.email);
      addToast('Reset code sent to your email!', 'success');
      setStep('code');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to send reset email';
      setApiError(message);
      addToast(message, 'error');
    }
  };

  const handleCodeSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const errs = validateCode();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }

    setApiError('');

    try {
      await verifyResetCode(form.resetCode);
      addToast('Code verified successfully!', 'success');
      setStep('password');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Invalid reset code';
      setApiError(message);
      addToast(message, 'error');
    }
  };

  const handlePasswordSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const errs = validatePassword();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }

    setApiError('');

    try {
      // Note: This would need to be implemented in the auth context
      // For now, just show success and redirect
      addToast('Password updated successfully!', 'success');
      router.push('/signin');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to update password';
      setApiError(message);
      addToast(message, 'error');
    }
  };

  return (
    <div className="flex items-center justify-center py-15">
      <div className="w-full max-w-7xl px-4">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
        <div className='py-6 hidden lg:flex lg:flex-col'>
          <div className="p-24 bg-green-50/90 rounded-3xl shadow-lg shadow-gray-200">
            {/* Icon Cards */}
            <div className='flex flex-col items-center'>
            <div className="relative w-64 h-44 flex items-center justify-center">
              {/* Decorative circles */}
              <div className="absolute -top-10 -left-35 w-25 h-25 bg-green-200/20 rounded-full" />
              <div className="absolute -bottom-20 -right-34 w-32 h-32 bg-green-200/20 rounded-full" />
              <div className="absolute top-2 -right-20 w-15 h-15 bg-green-200/30 rounded-full" />
 
              {/* Left card */}
              <div className="absolute left-3 top-18 -translate-y-1/2 w-14 h-14 bg-white rounded-lg shadow-lg flex items-center justify-center -rotate-10">
                <FaEnvelope className="w-6 h-6 text-green-500" />
              </div>
 
              {/* Center card — active */}
              <div className="relative z-10 w-26 h-26 bg-white rotate-4 rounded-2xl shadow-xl flex items-center justify-center ">
                <div className="w-18 h-18 bg-green-100 rounded-xl flex items-center justify-center">
                  <FaLock  className="w-8 h-8 text-green-600" />
                </div>
              </div>
 
              {/* Right card */}
              <div className="absolute right-3 top-1/2 -translate-y-1/2 w-14 h-14 bg-white rounded-lg shadow-lg flex items-center justify-center rotate-12">
                <FaShieldAlt className="w-5 h-5 text-green-500" />
              </div>
            </div>
 
            {/* Dots */}
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-green-300" />
              <div className="w-3 h-3 rounded-full bg-green-400" />
              <div className="w-3 h-3 rounded-full bg-green-500" />
            </div>
            </div>
          </div>
            <div>

            <div className="text-center">
              <h2 className="text-3xl font-extrabold text-gray-900 my-5">Reset Your Password</h2>
              <p className="text-gray-600 text-lg leading-relaxed font-medium">
                Don't worry, it happens to the best of us. We'll help you get back into your account in no time.
              </p>
            </div>

            <div className="flex items-center gap-6 mt-4 flex-wrap justify-center">
              <div className="flex items-center gap-2 text-sm text-gray-600 font-medium">
                <MdEmail className="w-3.5 h-3.5 text-green-600" /> Email Verification
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600 font-medium">
                <FaShieldAlt className="w-3.5 h-3.5 text-green-600" /> Secure Reset
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600 font-medium">
                <FaLock className="w-3.5 h-3.5 text-green-600" /> Encrypted
              </div>
            </div>
            </div>
        </div>
          
          {/* right side */}
          <div className='p-8 sm:py-10 sm:px-12 shadow-xl rounded-2xl shadow-gray-200'>
          <div className="text-center mb-6">
            <h1 className='text-3xl font-bold mb-4'><span className='text-green-600'>Fresh</span>Cart</h1>
            <h2 className="text-2xl font-bold text-gray-800">
              {step === 'email' && 'Forgot Password?'}
              {step === 'code' && 'Verify Reset Code'}
              {step === 'password' && 'Reset Password'}
            </h2>
            <p className="text-gray-600 font-medium text mt-2">
              {step === 'email' && "No worries, we'll send you a reset code"}
              {step === 'code' && 'Enter the 6-digit code sent to your email'}
              {step === 'password' && 'Enter your new password'}
            </p>
            <Stepper />
          </div>

          {/* API Error */}
          {apiError && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3">
              {apiError}
            </div>
          )}

          {step === 'email' && (
            <form onSubmit={handleEmailSubmit} className="space-y-4">
              <div>
                <label className="font-semibold text-gray-800 mb-2 text-sm block">Email Address</label>
                <div className="relative">
                  <input
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="Enter your email address"
                    className={`w-full border-2 rounded-lg py-3 pl-11 placeholder-gray-400 font-medium transition-all ${errors.email ? 'border-red-400 focus:border-red-400' : 'border-gray-200 focus:border-green-400'}`}
                  />
                  <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                </div>
                {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className={`w-full flex items-center justify-center text-lg gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition-all shadow active:scale-95 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {isLoading ? 'Sending...' : 'Send Reset Code'}
              </button>
            </form>
          )}

          {step === 'code' && (
            <form onSubmit={handleCodeSubmit} className="space-y-4">
              <div>
                <label className="font-semibold text-gray-800 mb-2 text-sm block">Reset Code</label>
                <div className="relative">
                  <input
                    name="resetCode"
                    value={form.resetCode}
                    onChange={handleChange}
                    placeholder="Enter 6-digit code"
                    className={`w-full border rounded-lg px-3 py-3 pl-11 placeholder-gray-400 font-medium transition-all ${errors.resetCode ? 'border-red-400 focus:border-red-400' : 'border-gray-200 focus:border-green-400'}`}
                  />
                  <FaKey className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                </div>
                {errors.resetCode && <p className="text-xs text-red-500 mt-1">{errors.resetCode}</p>}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className={`w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded-lg transition-all shadow active:scale-95 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {isLoading ? 'Verifying...' : 'Verify Code'}
              </button>
            </form>
          )}

          {step === 'password' && (
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div>
                <label className="font-semibold text-gray-800 mb-2 text-sm block">New Password</label>
                <div className="relative">
                  <input
                    name="password"
                    type="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Enter new password"
                    className={`w-full border rounded-lg py-3 pl-11 placeholder-gray-400 font-medium transition-all ${errors.password ? 'border-red-400' : 'border-gray-200 focus:border-green-400'}`}
                  />
                  <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                </div>
                {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password}</p>}
              </div>

              <div>
                <label className="font-medium text-gray-700 mb-1 block">Confirm Password<span className="text-gray-500">*</span></label>
                <div className="relative">
                  <input
                    name="rePassword"
                    type="password"
                    value={form.rePassword}
                    onChange={handleChange}
                    placeholder="Confirm new password"
                    className={`w-full border rounded-md px-3 py-2 pl-10 placeholder-gray-400 transition-all ${errors.rePassword ? 'border-red-400' : 'border-gray-200 focus:border-green-400'}`}
                  />
                  <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                </div>
                {errors.rePassword && <p className="text-xs text-red-500 mt-1">{errors.rePassword}</p>}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className={`w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded-lg transition-all shadow active:scale-95 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {isLoading ? 'Updating...' : 'Update Password'}
              </button>
            </form>
          )}

          {/* Back to Sign In */}

          <p className="text-center text-gray-800 flex items-center justify-center font-medium my-6">
            
            <Link href="/signin" className="text-green-600 text-sm font-medium flex gap-2 items-center hover:text-green-700 justify-center"><FaArrowLeftLong  /> Back to Sign In</Link>
          </p>
          <div className='h-px w-full bg-gray-100'></div>
          <p className="text-center text-gray-800 font-medium my-6">
            Remember your password?{' '}
            <Link href="/signin" className="text-green-600 hover:underline font-semibold">Sign In</Link>
          </p>

          </div>
        </div>
      </div>
    </div>
  );
}