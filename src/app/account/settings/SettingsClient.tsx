'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import {
  FaUser,
  FaSave,
  FaLock,
  FaEye,
  FaEyeSlash,
} from 'react-icons/fa';

const API = 'https://ecommerce.routemisr.com/api/v1';

export default function SettingsClient() {
  const { user, token, logout, updatePassword } = useAuth();
  const router = useRouter();
  const { addToast } = useToast();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [savingProfile, setSavingProfile] = useState(false);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [rePassword, setRePassword] = useState('');
  const [showPw, setShowPw] = useState<Record<string, boolean>>({});
  const [savingPw, setSavingPw] = useState(false);

  useEffect(() => {
    if (!user) {
      router.replace('/signin');
      return;
    }
    setName(user.name ?? '');
    setEmail(user.email ?? '');
    setPhone((user as { phone?: string }).phone ?? '');
  }, [user, router]);

  if (!user) return null;

  const userIdDisplay =
    (user as { _id?: string })._id ?? user.id ?? '—';

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    setSavingProfile(true);
    try {
      const res = await fetch(`${API}/users/updateMe`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, phone }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.message || 'Could not update profile');
      }
      if (data.user) {
        localStorage.setItem('user', JSON.stringify(data.user));
      }
      addToast('Profile updated', 'success');
      window.location.reload();
    } catch (err: unknown) {
      addToast(err instanceof Error ? err.message : 'Update failed', 'error');
    } finally {
      setSavingProfile(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      addToast('Password must be at least 6 characters', 'error');
      return;
    }
    if (newPassword !== rePassword) {
      addToast('Passwords do not match', 'error');
      return;
    }
    setSavingPw(true);
    try {
      await updatePassword(currentPassword, newPassword, rePassword);
      addToast('Password changed', 'success');
      setCurrentPassword('');
      setNewPassword('');
      setRePassword('');
    } catch (err: unknown) {
      addToast(err instanceof Error ? err.message : 'Failed', 'error');
    } finally {
      setSavingPw(false);
    }
  };

  const toggleShow = (key: string) => {
    setShowPw((p) => ({ ...p, [key]: !p[key] }));
  };

  return (
    <div className="space-y-8">
      <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
        <div className="mb-6 flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-green-100">
            <FaUser className="h-6 w-6 text-green-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              Profile Information
            </h2>
            <p className="text-sm text-gray-500">Update your personal details</p>
          </div>
        </div>

        <form onSubmit={handleSaveProfile} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700">Full Name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 w-full rounded-xl border border-gray-200 px-4 py-3 text-sm"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="mt-1 w-full rounded-xl border border-gray-200 px-4 py-3 text-sm"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">
              Phone Number
            </label>
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="01xxxxxxxxx"
              className="mt-1 w-full rounded-xl border border-gray-200 px-4 py-3 text-sm"
            />
          </div>
          <button
            type="submit"
            disabled={savingProfile}
            className="inline-flex items-center gap-2 rounded-xl bg-green-600 px-6 py-3 font-semibold text-white hover:bg-green-700 disabled:opacity-50"
          >
            <FaSave className="h-4 w-4" />
            {savingProfile ? 'Saving…' : 'Save Changes'}
          </button>
        </form>

        <div className="mt-8 rounded-xl bg-gray-50 p-4 text-sm">
          <div className="flex justify-between border-b border-gray-200 py-2">
            <span className="text-gray-600">User ID</span>
            <span className="font-mono text-gray-900">{userIdDisplay}</span>
          </div>
          <div className="flex justify-between py-2">
            <span className="text-gray-600">Role</span>
            <span className="rounded-full bg-green-100 px-3 py-0.5 text-xs font-semibold text-green-800">
              {user.role || 'User'}
            </span>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
        <div className="mb-6 flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-amber-100">
            <FaLock className="h-6 w-6 text-amber-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Change Password</h2>
            <p className="text-sm text-gray-500">Update your account password</p>
          </div>
        </div>

        <form onSubmit={handleChangePassword} className="space-y-4">
          {(['current', 'new', 'confirm'] as const).map((field) => (
            <div key={field}>
              <label className="text-sm font-medium text-gray-700 capitalize">
                {field === 'current'
                  ? 'Current Password'
                  : field === 'new'
                    ? 'New Password'
                    : 'Confirm New Password'}
              </label>
              <div className="relative mt-1">
                <input
                  type={showPw[field] ? 'text' : 'password'}
                  value={
                    field === 'current'
                      ? currentPassword
                      : field === 'new'
                        ? newPassword
                        : rePassword
                  }
                  onChange={(e) => {
                    if (field === 'current') setCurrentPassword(e.target.value);
                    else if (field === 'new') setNewPassword(e.target.value);
                    else setRePassword(e.target.value);
                  }}
                  placeholder={
                    field === 'current'
                      ? 'Enter your current password'
                      : field === 'new'
                        ? 'Enter your new password'
                        : 'Confirm your new password'
                  }
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 pr-12 text-sm"
                />
                <button
                  type="button"
                  onClick={() => toggleShow(field)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Toggle visibility"
                >
                  {showPw[field] ? (
                    <FaEyeSlash className="h-4 w-4" />
                  ) : (
                    <FaEye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {field === 'new' && (
                <p className="mt-1 text-xs text-green-600">
                  Must be at least 6 characters
                </p>
              )}
            </div>
          ))}
          <button
            type="submit"
            disabled={savingPw}
            className="inline-flex items-center gap-2 rounded-xl bg-amber-500 px-6 py-3 font-semibold text-white hover:bg-amber-600 disabled:opacity-50"
          >
            <FaLock className="h-4 w-4" />
            {savingPw ? 'Updating…' : 'Change Password'}
          </button>
        </form>
      </section>
    </div>
  );
}
