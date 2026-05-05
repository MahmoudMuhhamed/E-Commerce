'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  FaStar, FaShieldAlt,
  FaEye, FaEyeSlash, FaGoogle, FaFacebook,
} from 'react-icons/fa';
import { FaUserPlus } from "react-icons/fa6";
import { FaTruckFast } from "react-icons/fa6";


// ── Password strength ──────────────────────────────────────
function getPasswordStrength(pw: string): { label: string; color: string; width: string; level: number } {
  if (!pw) return { label: '', color: '', width: '0%', level: 0 };
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;

  if (score <= 1) return { label: 'Weak', color: 'bg-red-500', width: '25%', level: 1 };
  if (score === 2) return { label: 'Fair', color: 'bg-orange-400', width: '50%', level: 2 };
  if (score === 3) return { label: 'Good', color: 'bg-yellow-400', width: '75%', level: 3 };
  return { label: 'Strong', color: 'bg-green-500', width: '100%', level: 4 };
}

// ── Features list ──────────────────────────────────────────
const features = [
  { icon: <FaStar className="w-5 h-5 text-green-600" />, title: 'Premium Quality', sub: 'Premium quality products sourced from trusted suppliers.' },
  { icon: <FaTruckFast className="w-5 h-5 text-green-600" />, title: 'Fast Delivery', sub: 'Same-day delivery available in most areas' },
  { icon: <FaShieldAlt className="w-5 h-5 text-green-600" />, title: 'Secure Shopping', sub: 'Your data and payments are completely secure' },
];

export default function signup() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: '', email: '', password: '', rePassword: '', phone: '',
  });
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');

  const strength = getPasswordStrength(form.password);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!form.email.trim()) e.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Invalid email address';
    if (!form.password) e.password = 'Password is required';
    else if (form.password.length < 8) e.password = 'At least 8 characters required';
    if (!form.rePassword) e.rePassword = 'Please confirm your password';
    else if (form.rePassword !== form.password) e.rePassword = 'Passwords do not match';
    if (!form.phone.trim()) e.phone = 'Phone number is required';
    else if (!/^[0-9+\s]{7,15}$/.test(form.phone)) e.phone = 'Invalid phone number';
    if (!agreed) e.agreed = 'You must agree to the terms';
    return e;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
    setApiError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setLoading(true);
    setApiError('');

    try {
      const res = await fetch('https://ecommerce.routemisr.com/api/v1/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          password: form.password,
          rePassword: form.rePassword,
          phone: form.phone,
        }),
      });
      const data = await res.json();

      if (res.ok && data.token) {
        router.push('/signin');
      } else {
        setApiError(data.message || 'Something went wrong. Please try again.');
      }
    } catch {
      setApiError('Network error. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen  flex items-center justify-center py-15">
      <div className="w-full max-w-7xl px-4">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">

          {/* ── Left Panel ── */}
          <div className="flex flex-col">
            <div>
              {/* Heading */}
              <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-700 mb-1 leading-tight">
                Welcome to <span className="text-green-600">FreshCart</span>
              </h1>
              <p className="text-gray-700 text-xl font-medium leading-relaxed mb-6">
                Join thousands of happy customers who enjoy fresh groceries delivered right to their doorstep.
              </p>

              {/* Features */}
              <div className="flex flex-col gap-5">
                {features.map((f) => (
                  <div key={f.title} className="flex items-start gap-3">
                    <div className="w-12 h-12 bg-green-200 rounded-full flex items-center justify-center shrink-0">
                      {f.icon}
                    </div>
                    <div>
                      <p className="text-gray-700 font-semibold text-lg">{f.title}</p>
                      <p className="text-gray-600 font-medium text">{f.sub}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Testimonial */}
            <div className="shadow border border-gray-50 rounded-md p-4 mt-7">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-full bg-orange-200 flex items-center justify-center text-orange-600 font-bold text-sm shrink-0">
                  <img src="https://freshcart-route.vercel.app/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Freview-author.04728971.png&w=1080&q=75" alt="profile_picure" />
                </div>
                <div>
                  <p className="text-gray-700 font-medium text">Sarah Johnson</p>
                  <div className="flex gap-0.5 mt-0.5">
                    {[1,2,3,4,5].map(s => <FaStar key={s} className="w-4 h-4 text-yellow-300" />)}
                  </div>
                </div>
              </div>
              <p className="text-gray-700 font-medium leading-relaxed italic">
                "FreshCart has transformed my shopping experience. The quality of the products is outstanding, and the delivery is always on time. Highly recommend!"
              </p>
            </div>
          </div>

          {/* ── Right Panel: Form ── */}
          <div className="p-8 sm:py-8 sm:px-6 shadow-xl rounded-2xl shadow-gray-200 ">
            <div className="text-center mb-6">
              <h2 className="text-3xl font-semibold text-gray-700">Create Your Account</h2>
              <p className="text-gray-700 font-medium text mt-2">Start your fresh journey with us today</p>
            </div>

            {/* Social Buttons */}
            <div className="grid grid-cols-2 gap-3 mt-9 mb-6">
              <button className="flex items-center justify-center gap-2 border border-gray-300 rounded-md py-2.5  font-semibold text-gray-800 hover:bg-gray-50 transition-colors">
                <FaGoogle className="w-4 h-4 text-red-500" /> Google
              </button>
              <button className="flex items-center justify-center gap-2 border border-gray-300 rounded-md py-2.5  font-semibold text-gray-800 hover:bg-gray-50 transition-colors">
                <FaFacebook className="w-4 h-4 text-blue-600" /> Facebook
              </button>
            </div>

            {/* Divider */}
            <div className="flex items-center gap-3 mb-2">
              <div className="flex-1 h-0.75 bg-gray-100" />
              <span className="text text-gray-600 font-medium">or</span>
              <div className="flex-1 h-0.75 bg-gray-100" />
            </div>

            {/* API Error */}
            {apiError && (
              <div className="mb-4 bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3">
                {apiError}
              </div>
            )}

            <div className="flex flex-col gap-4">
              {/* Name */}
              <div>
                <label className="font-medium text-gray-700 mb-1 block">Name<span className="text-gray-500">*</span></label>
                <input
                  name="name" value={form.name} onChange={handleChange}
                  placeholder="Ali"
                  className={`w-full border rounded-md px-3 py-2 placeholder-gray-400  transition-all ${errors.name ? 'border-red-400 focus:border-red-400' : 'border-gray-300 focus:border-green-500'}`}
                />
                {errors.name && <p className="text-xs text-gray-500 mt-1">{errors.name}</p>}
              </div>

              {/* Email */}
              <div>
                <label className="font-medium text-gray-700 mb-1 block">Email<span className="text-gray-500">*</span></label>
                <input
                  name="email" type="email" value={form.email} onChange={handleChange}
                  placeholder="ali@example.com"
                  className={`w-full border rounded-md px-3 py-2 placeholder-gray-400 transition-all ${errors.email ? 'border-red-400 focus:border-red-400' : 'border-gray-200 focus:border-green-400'}`}
                />
                {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
              </div>

              {/* Password */}
              <div>
                <label className="font-medium text-gray-700 mb-1 block">Password<span className="text-gray-500">*</span></label>
                <div className="relative">
                  <input
                    name="password" type={showPass ? 'text' : 'password'} value={form.password} onChange={handleChange}
                    placeholder="create a strong password"
                    className={`w-full border rounded-md px-3 py-2 pr-10 placeholder-gray-400 transition-all ${errors.password ? 'border-red-400' : 'border-gray-200 focus:border-green-400'}`}
                  />
                </div>
                {/* Strength Bar */}
                
                  <div className="mt-2">
                    <div className="flex justify-between items-center mb-1">
                      <span className={`text-xs font-semibold ${
                        strength.level === 1 ? 'text-red-500' :
                        strength.level === 2 ? 'text-orange-400' :
                        strength.level === 3 ? 'text-yellow-500' : 'text-green-500'
                      }`}>{strength.label}</span>
                    </div>
                    <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full transition-all duration-500 ${strength.color}`} style={{ width: strength.width }} />
                    </div>
                      <p className="text-xs font-medium text-gray-500 mt-2">Must be at least 8 characters with numbers and symbols</p>
                  </div>
                
                {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password}</p>}
              </div>

              {/* Confirm Password */}
              <div>
                <label className="font-medium text-gray-700 mb-1 block">Confirm Password<span className="text-gray-500">*</span></label>
                <div className="relative">
                  <input
                    name="rePassword" type={showConfirm ? 'text' : 'password'} value={form.rePassword} onChange={handleChange}
                    placeholder="confirm your password"
                    className={`w-full border font-normal rounded-md px-3 py-2 pr-10 text placeholder-gray-400 transition-all ${errors.rePassword ? 'border-red-400' : 'border-gray-200 focus:border-green-400'}`}
                  />
                </div>
                {errors.rePassword && <p className="text-xs text-red-500 mt-1">{errors.rePassword}</p>}
              </div>

              {/* Phone */}
              <div>
                <label className="font-medium text-gray-700 mb-1 block">Phone Number<span className="text-gray-500">*</span></label>
                <input
                  name="phone" type="tel" value={form.phone} onChange={handleChange}
                  placeholder="+1 234 567 8900"
                  className={`w-full border rounded-md px-3 py-2  placeholder-gray-400 transition-all ${errors.phone ? 'border-red-400' : 'border-gray-200 focus:border-green-400'}`}
                />
                {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone}</p>}
              </div>

              {/* Terms */}
              <div className='my-3'>
                <label className="flex items-start gap-2.5 cursor-pointer select-none">
                  <input
                    type="checkbox" checked={agreed} onChange={(e) => { setAgreed(e.target.checked); setErrors({ ...errors, agreed: '' }); }}
                    className="mt-0.5 w-4 h-4 rounded border-gray-300 accent-green-600 cursor-pointer"
                  />
                  <span className="font-medium text-gray-700">
                    I agree to the{' '}
                    <Link href="/terms" className="text-green-600 hover:underline font-medium">Terms of Service</Link>
                    {' '}and{' '}
                    <Link href="/privacy" className="text-green-600 hover:underline font-medium">Privacy Policy</Link>
                    <span className="text-gray-500"> *</span>
                  </span>
                </label>
                {errors.agreed && <p className="text-xs text-red-500 mt-1">{errors.agreed}</p>}
              </div>

              {/* Submit */}
              <div className='pb-4 border-b border-gray-200'>

              <button
                onClick={handleSubmit}
                disabled={loading}
                className={`w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded-lg transition-all shadow active:scale-95 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                <FaUserPlus className="w-4 h-4" />
                {loading ? 'Creating Account...' : 'Create My Account'}
              </button>
              </div>

              {/* Sign In Link */}
              <p className="text-center text-gray-800 font-medium my-6">
                Already have an account?{' '}
                <Link href="/signin" className="text-green-600 hover:underline font-semibold">Sign In</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}