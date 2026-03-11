import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Wilaya, Baladiya } from '../types';
import { Plus, Trash2, MapPin, Store, Globe, Bell } from 'lucide-react';
import { cn } from '../lib/utils';

export default function Settings() {
  const [wilayas, setWilayas] = useState<Wilaya[]>([]);
  const [baladiyas, setBaladiyas] = useState<Baladiya[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'general' | 'locations' | 'notifications'>('general');

  useEffect(() => {
    fetchLocations();
  }, []);

  async function fetchLocations() {
    try {
      const [wilayasRes, baladiyasRes] = await Promise.all([
        supabase.from('wilayas').select('*').order('name'),
        supabase.from('baladiyas').select('*').order('name'),
      ]);

      if (wilayasRes.data) setWilayas(wilayasRes.data);
      if (baladiyasRes.data) setBaladiyas(baladiyasRes.data);
    } catch (error) {
      console.error('Error fetching locations:', error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <div className="flex h-96 items-center justify-center">Loading...</div>;

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-zinc-900">Settings</h2>
        <p className="text-zinc-500">Manage your store configuration and location data.</p>
      </div>

      <div className="flex gap-8">
        <aside className="w-64 space-y-1">
          <button
            onClick={() => setActiveTab('general')}
            className={cn(
              "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
              activeTab === 'general' ? "bg-zinc-100 text-zinc-900" : "text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900"
            )}
          >
            <Store size={20} />
            General
          </button>
          <button
            onClick={() => setActiveTab('locations')}
            className={cn(
              "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
              activeTab === 'locations' ? "bg-zinc-100 text-zinc-900" : "text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900"
            )}
          >
            <MapPin size={20} />
            Locations
          </button>
          <button
            onClick={() => setActiveTab('notifications')}
            className={cn(
              "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
              activeTab === 'notifications' ? "bg-zinc-100 text-zinc-900" : "text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900"
            )}
          >
            <Bell size={20} />
            Notifications
          </button>
        </aside>

        <div className="flex-1 space-y-8">
          {activeTab === 'general' && (
            <div className="rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm">
              <h3 className="mb-6 text-lg font-semibold text-zinc-900">Store Configuration</h3>
              <div className="space-y-6 max-w-lg">
                <div>
                  <label className="block text-sm font-medium text-zinc-700">Store Name</label>
                  <input
                    type="text"
                    defaultValue="My Ecommerce Store"
                    className="mt-1 h-10 w-full rounded-lg border border-zinc-200 bg-white px-4 text-sm outline-none focus:border-zinc-900"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-700">Support Email</label>
                  <input
                    type="email"
                    defaultValue="support@mystore.com"
                    className="mt-1 h-10 w-full rounded-lg border border-zinc-200 bg-white px-4 text-sm outline-none focus:border-zinc-900"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-700">Currency</label>
                  <select className="mt-1 h-10 w-full rounded-lg border border-zinc-200 bg-white px-4 text-sm outline-none focus:border-zinc-900">
                    <option value="USD">USD ($)</option>
                    <option value="DZD">DZD (DA)</option>
                    <option value="EUR">EUR (€)</option>
                  </select>
                </div>
                <button className="h-10 rounded-lg bg-zinc-900 px-6 text-sm font-medium text-white hover:bg-zinc-800">
                  Save Changes
                </button>
              </div>
            </div>
          )}

          {activeTab === 'locations' && (
            <div className="space-y-8">
              <div className="rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm">
                <div className="mb-6 flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-zinc-900">Wilayas</h3>
                  <button className="flex h-8 items-center gap-2 rounded-lg bg-zinc-900 px-3 text-xs font-medium text-white hover:bg-zinc-800">
                    <Plus size={14} />
                    Add Wilaya
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
                  {wilayas.map((wilaya) => (
                    <div key={wilaya.id} className="flex items-center justify-between rounded-lg border border-zinc-100 bg-zinc-50 px-4 py-2 text-sm">
                      <span className="font-medium text-zinc-900">{wilaya.name}</span>
                      <button className="text-zinc-400 hover:text-red-600">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm">
                <div className="mb-6 flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-zinc-900">Baladiyas</h3>
                  <button className="flex h-8 items-center gap-2 rounded-lg bg-zinc-900 px-3 text-xs font-medium text-white hover:bg-zinc-800">
                    <Plus size={14} />
                    Add Baladiya
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
                  {baladiyas.map((baladiya) => (
                    <div key={baladiya.id} className="flex items-center justify-between rounded-lg border border-zinc-100 bg-zinc-50 px-4 py-2 text-sm">
                      <span className="font-medium text-zinc-900">{baladiya.name}</span>
                      <button className="text-zinc-400 hover:text-red-600">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
