import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Customer } from '../types';
import { Search, User, Mail, Phone } from 'lucide-react';

export default function Customers() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCustomers();
  }, []);

  async function fetchCustomers() {
    try {
      // Group orders by customer_name and phone to get "customers"
      const { data, error } = await supabase
        .from('orders')
        .select('customer_name, phone');

      if (error) throw error;

      const customerMap = new Map<string, Customer>();
      data.forEach((order: any) => {
        const key = `${order.customer_name}-${order.phone}`;
        if (customerMap.has(key)) {
          const existing = customerMap.get(key)!;
          customerMap.set(key, { ...existing, order_count: existing.order_count + 1 });
        } else {
          customerMap.set(key, {
            name: order.customer_name,
            phone: order.phone,
            order_count: 1,
          });
        }
      });

      setCustomers(Array.from(customerMap.values()).sort((a, b) => b.order_count - a.order_count));
    } catch (error) {
      console.error('Error fetching customers:', error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <div className="flex h-96 items-center justify-center">Loading...</div>;

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-zinc-900">Customers</h2>
        <p className="text-zinc-500">View and manage your customer base.</p>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
          <input
            type="text"
            placeholder="Search customers..."
            className="h-10 w-full rounded-lg border border-zinc-200 bg-white pl-10 pr-4 text-sm outline-none focus:border-zinc-900"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {customers.map((customer) => (
          <div key={`${customer.name}-${customer.phone}`} className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm transition-all hover:shadow-md">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-zinc-100 text-zinc-600">
                <User size={24} />
              </div>
              <div>
                <h3 className="font-semibold text-zinc-900">{customer.name}</h3>
                <p className="text-sm text-zinc-500">{customer.order_count} total orders</p>
              </div>
            </div>
            
            <div className="mt-6 space-y-3 border-t border-zinc-100 pt-6">
              <div className="flex items-center gap-3 text-sm text-zinc-600">
                <Phone size={16} className="text-zinc-400" />
                {customer.phone}
              </div>
              <div className="flex items-center gap-3 text-sm text-zinc-600">
                <Mail size={16} className="text-zinc-400" />
                {customer.name.toLowerCase().replace(' ', '.')}@example.com
              </div>
            </div>

            <button className="mt-6 w-full rounded-lg border border-zinc-200 py-2 text-sm font-medium text-zinc-600 transition-colors hover:bg-zinc-50 hover:text-zinc-900">
              View Order History
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
