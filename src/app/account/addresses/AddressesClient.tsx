'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { FaMapMarkerAlt } from 'react-icons/fa';
import { FaPlus } from 'react-icons/fa6';
import {
  loadSavedAddresses,
  addSavedAddress,
  type SavedAddress,
} from '@/lib/savedAddresses';

export default function AddressesClient() {
  const { user } = useAuth();
  const router = useRouter();
  const [list, setList] = useState<SavedAddress[]>([]);

  useEffect(() => {
    if (!user) {
      router.replace('/signin');
      return;
    }
    setList(loadSavedAddresses());
  }, [user, router]);

  const [label, setLabel] = useState('');
  const [city, setCity] = useState('');
  const [details, setDetails] = useState('');
  const [phone, setPhone] = useState('');

  if (!user) return null;

  const handleAdd = () => {
    if (!city.trim() || !details.trim() || !phone.trim()) return;
    const labelText = label.trim() || city.trim();
    const next = addSavedAddress({
      label: labelText,
      city: city.trim(),
      details: details.trim(),
      phone: phone.trim(),
    });
    setList(next);
    setLabel('');
    setCity('');
    setDetails('');
    setPhone('');
  };

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900">My Addresses</h2>
        <p className="text-gray-500 mt-1">
          Manage your saved delivery addresses
        </p>
      </div>

      {list.length === 0 ? (
        <div className="rounded-xl border border-gray-100 bg-white p-12 text-center shadow-sm">
          <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-gray-100">
            <FaMapMarkerAlt className="h-10 w-10 text-gray-400" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">No Addresses Yet</h3>
          <p className="text-gray-500 mb-8 max-w-md mx-auto">
            Add your first delivery address to make checkout faster and easier.
          </p>
          <div className="max-w-md mx-auto space-y-3 text-left mb-6">
            <input
              placeholder="Address label (e.g. Home)"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm"
            />
            <input
              placeholder="City *"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm"
            />
            <textarea
              placeholder="Street / building details *"
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              rows={3}
              className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm"
            />
            <input
              placeholder="Phone *"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm"
            />
          </div>
          <button
            type="button"
            onClick={handleAdd}
            className="inline-flex items-center gap-2 rounded-lg bg-green-600 px-6 py-3 font-semibold text-white hover:bg-green-700 transition-colors"
          >
            <FaPlus className="h-4 w-4" />
            Add Your First Address
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            {list.map((a) => (
              <div
                key={a.id}
                className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm"
              >
                <div className="flex items-start gap-3">
                  <FaMapMarkerAlt className="mt-1 h-5 w-5 text-green-600 shrink-0" />
                  <div>
                    <p className="font-bold text-gray-900">{a.label}</p>
                    <p className="text-sm text-gray-600">{a.city}</p>
                    <p className="text-sm text-gray-500 mt-1">{a.details}</p>
                    <p className="text-sm text-gray-700 mt-2">{a.phone}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="rounded-xl border border-dashed border-green-200 bg-green-50/50 p-6">
            <p className="text-sm font-semibold text-gray-800 mb-3">Add another address</p>
            <div className="grid gap-3 sm:grid-cols-2">
              <input
                placeholder="Label"
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                className="rounded-lg border border-gray-200 px-3 py-2 text-sm"
              />
              <input
                placeholder="City"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="rounded-lg border border-gray-200 px-3 py-2 text-sm"
              />
              <input
                placeholder="Details"
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                className="sm:col-span-2 rounded-lg border border-gray-200 px-3 py-2 text-sm"
              />
              <input
                placeholder="Phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="rounded-lg border border-gray-200 px-3 py-2 text-sm"
              />
              <button
                type="button"
                onClick={handleAdd}
                className="rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700"
              >
                Save address
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
