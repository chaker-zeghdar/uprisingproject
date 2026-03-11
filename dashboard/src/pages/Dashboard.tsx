import React, { useEffect, useState } from 'react';
import { ShoppingBag, DollarSign, Package, TrendingUp } from 'lucide-react';
import Card from '../components/Card';
import { supabase } from '../lib/supabase';
import { Order, Product } from '../types';
import { formatCurrency, cn } from '../lib/utils';
import { format } from 'date-fns';

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    totalProducts: 0,
  });
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [ordersRes, productsRes] = await Promise.all([
          supabase.from('orders').select('*').order('created_at', { ascending: false }),
          supabase.from('products').select('id', { count: 'exact' }),
        ]);

        if (ordersRes.data) {
          const orders = ordersRes.data as Order[];
          const revenue = orders.reduce((acc, order) => acc + order.total_price, 0);
          setStats({
            totalOrders: orders.length,
            totalRevenue: revenue,
            totalProducts: productsRes.count || 0,
          });
          setRecentOrders(orders.slice(0, 5));
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) {
    return <div className="flex h-96 items-center justify-center">Loading...</div>;
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-zinc-900">Dashboard</h2>
        <p className="text-zinc-500">Welcome back, here's what's happening with your store today.</p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <Card 
          title="Total Orders" 
          value={stats.totalOrders} 
          icon={ShoppingBag} 
          trend={{ value: 12, isPositive: true }}
        />
        <Card 
          title="Total Revenue" 
          value={formatCurrency(stats.totalRevenue)} 
          icon={DollarSign} 
          trend={{ value: 8, isPositive: true }}
        />
        <Card 
          title="Total Products" 
          value={stats.totalProducts} 
          icon={Package} 
        />
      </div>

      <div className="rounded-2xl border border-zinc-200 bg-white shadow-sm">
        <div className="border-b border-zinc-200 p-6">
          <h3 className="text-lg font-semibold text-zinc-900">Recent Orders</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-zinc-50 text-xs font-medium uppercase text-zinc-500">
              <tr>
                <th className="px-6 py-4">Order ID</th>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200">
              {recentOrders.map((order) => (
                <tr key={order.id} className="hover:bg-zinc-50 transition-colors">
                  <td className="whitespace-nowrap px-6 py-4 font-medium text-zinc-900">#{order.id.slice(0, 8)}</td>
                  <td className="px-6 py-4 text-zinc-600">{order.customer_name}</td>
                  <td className="px-6 py-4 text-zinc-600">{format(new Date(order.created_at), 'MMM dd, yyyy')}</td>
                  <td className="px-6 py-4 font-medium text-zinc-900">{formatCurrency(order.total_price)}</td>
                  <td className="px-6 py-4 text-right">
                    <span className={cn(
                      "inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium",
                      order.status === 'delivered' ? "bg-emerald-50 text-emerald-700" :
                      order.status === 'confirmed' ? "bg-blue-50 text-blue-700" :
                      "bg-amber-50 text-amber-700"
                    )}>
                      {order.status}
                    </span>
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
