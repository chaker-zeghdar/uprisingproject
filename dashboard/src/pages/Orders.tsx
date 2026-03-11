import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Order, OrderStatus } from '../types';
import { cn, formatCurrency } from '../lib/utils';
import { format } from 'date-fns';
import { ChevronDown, Search, Filter } from 'lucide-react';

export default function Orders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  async function fetchOrders() {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          wilaya:wilayas(name),
          baladiya:baladiyas(name)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOrders(data as Order[]);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  }

  async function updateStatus(orderId: string, status: OrderStatus) {
    setUpdating(orderId);
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status })
        .eq('id', orderId);

      if (error) throw error;
      setOrders(orders.map(o => o.id === orderId ? { ...o, status } : o));
    } catch (error) {
      console.error('Error updating status:', error);
    } finally {
      setUpdating(null);
    }
  }

  if (loading) return <div className="flex h-96 items-center justify-center">Loading...</div>;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900">Orders</h2>
          <p className="text-zinc-500">Manage and track your customer orders.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
            <input
              type="text"
              placeholder="Search orders..."
              className="h-10 w-64 rounded-lg border border-zinc-200 bg-white pl-10 pr-4 text-sm outline-none focus:border-zinc-900"
            />
          </div>
          <button className="flex h-10 items-center gap-2 rounded-lg border border-zinc-200 bg-white px-4 text-sm font-medium text-zinc-600 hover:bg-zinc-50">
            <Filter size={18} />
            Filter
          </button>
        </div>
      </div>

      <div className="rounded-2xl border border-zinc-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-zinc-50 text-xs font-medium uppercase text-zinc-500">
              <tr>
                <th className="px-6 py-4">Order ID</th>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Phone</th>
                <th className="px-6 py-4">Location</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-zinc-50 transition-colors">
                  <td className="whitespace-nowrap px-6 py-4 font-medium text-zinc-900">#{order.id.slice(0, 8)}</td>
                  <td className="px-6 py-4 text-zinc-600">{order.customer_name}</td>
                  <td className="px-6 py-4 text-zinc-600">{order.phone}</td>
                  <td className="px-6 py-4 text-zinc-600">
                    {order.wilaya?.name}, {order.baladiya?.name}
                  </td>
                  <td className="px-6 py-4 font-medium text-zinc-900">{formatCurrency(order.total_price)}</td>
                  <td className="px-6 py-4">
                    <span className={cn(
                      "inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium",
                      order.status === 'delivered' ? "bg-emerald-50 text-emerald-700" :
                      order.status === 'confirmed' ? "bg-blue-50 text-blue-700" :
                      "bg-amber-50 text-amber-700"
                    )}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="relative inline-block text-left">
                      <select
                        disabled={updating === order.id}
                        value={order.status}
                        onChange={(e) => updateStatus(order.id, e.target.value as OrderStatus)}
                        className="h-8 rounded-lg border border-zinc-200 bg-white px-2 text-xs font-medium outline-none focus:border-zinc-900 disabled:opacity-50"
                      >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="delivered">Delivered</option>
                      </select>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
