import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useCartStore } from '../store/useCartStore';
import { Wilaya, Baladiya } from '../types';
import { motion } from 'framer-motion';
import { ArrowLeft, CreditCard, Truck, CheckCircle2, AlertCircle } from 'lucide-react';

export const Checkout = () => {
  const navigate = useNavigate();
  const { items, getTotal, clearCart } = useCartStore();
  const [wilayas, setWilayas] = React.useState<Wilaya[]>([]);
  const [baladiyas, setBaladiyas] = React.useState<Baladiya[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [submitting, setSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const [formData, setFormData] = React.useState({
    fullName: '',
    phone: '',
    wilayaId: '',
    baladiyaId: '',
    address: '',
    notes: '',
  });

  React.useEffect(() => {
    if (items.length === 0) {
      navigate('/');
    }

    const fetchWilayas = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('wilayas')
          .select('*')
          .order('name');
        if (error) throw error;
        setWilayas(data || []);
      } catch (err) {
        console.error('Error fetching wilayas:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchWilayas();
  }, [items.length, navigate]);

  React.useEffect(() => {
    const fetchBaladiyas = async () => {
      if (!formData.wilayaId) {
        setBaladiyas([]);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('baladiyas')
          .select('*')
          .eq('wilaya_id', formData.wilayaId)
          .order('name');
        if (error) throw error;
        setBaladiyas(data || []);
      } catch (err) {
        console.error('Error fetching baladiyas:', err);
      }
    };

    fetchBaladiyas();
  }, [formData.wilayaId]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      // 1. Create Order
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          full_name: formData.fullName,
          phone: formData.phone,
          wilaya_id: parseInt(formData.wilayaId),
          baladiya_id: formData.baladiyaId,
          address: formData.address,
          notes: formData.notes,
          total_price: getTotal(),
          status: 'pending',
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // 2. Create Order Items & Update Stock
      const orderItems = items.map((item) => ({
        order_id: order.id,
        product_id: item.id,
        quantity: item.quantity,
        price: item.price,
      }));

      const { error: itemsError } = await supabase.from('order_items').insert(orderItems);
      if (itemsError) throw itemsError;

      // 3. Update Product Stock
      for (const item of items) {
        const newStock = item.stock - item.quantity;
        const { error: stockError } = await supabase
          .from('products')
          .update({ 
            stock: newStock,
            is_active: newStock > 0 // Optional: keep active but show sold out, or deactivate
          })
          .eq('id', item.id);
        
        if (stockError) throw stockError;
      }

      // 4. Success
      clearCart();
      navigate('/confirmation', { state: { orderId: order.id } });
    } catch (err: any) {
      console.error('Checkout error:', err);
      setError(err.message || 'An error occurred during checkout. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-black min-h-screen pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-6">
        <Link
          to="/"
          className="flex items-center space-x-2 text-zinc-500 hover:text-white transition-colors mb-12 uppercase text-[10px] font-black tracking-widest"
        >
          <ArrowLeft size={16} />
          <span>Back to Shopping</span>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          {/* Form */}
          <div className="lg:col-span-7">
            <h1 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter mb-10">
              Checkout
            </h1>

            {error && (
              <div className="mb-8 p-4 bg-red-500/10 border border-red-500/50 rounded-2xl flex items-center space-x-3 text-red-500">
                <AlertCircle size={20} />
                <p className="text-sm font-bold">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Full Name</label>
                  <input
                    required
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    placeholder="John Doe"
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl px-6 py-4 text-white placeholder:text-zinc-700 focus:outline-none focus:border-white transition-colors"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Phone Number</label>
                  <input
                    required
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="05XXXXXXXX"
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl px-6 py-4 text-white placeholder:text-zinc-700 focus:outline-none focus:border-white transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Wilaya</label>
                  <select
                    required
                    name="wilayaId"
                    value={formData.wilayaId}
                    onChange={handleInputChange}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-white transition-colors appearance-none"
                  >
                    <option value="">Select Wilaya</option>
                    {wilayas.map((w) => (
                      <option key={w.id} value={w.id}>{w.id} - {w.name}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Baladiya</label>
                  <select
                    required
                    name="baladiyaId"
                    value={formData.baladiyaId}
                    onChange={handleInputChange}
                    disabled={!formData.wilayaId}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-white transition-colors appearance-none disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <option value="">Select Baladiya</option>
                    {baladiyas.map((b) => (
                      <option key={b.id} value={b.id}>{b.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Full Address</label>
                <input
                  required
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="Street name, Building, Apartment..."
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl px-6 py-4 text-white placeholder:text-zinc-700 focus:outline-none focus:border-white transition-colors"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Order Notes (Optional)</label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  rows={4}
                  placeholder="Any special instructions for delivery..."
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl px-6 py-4 text-white placeholder:text-zinc-700 focus:outline-none focus:border-white transition-colors resize-none"
                />
              </div>

              <div className="pt-6">
                <div className="bg-zinc-900/50 border border-zinc-800 rounded-3xl p-8 space-y-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-white text-black rounded-full flex items-center justify-center">
                      <Truck size={24} />
                    </div>
                    <div>
                      <h4 className="text-white font-bold uppercase text-xs tracking-widest">Payment Method</h4>
                      <p className="text-zinc-500 text-sm">Cash on Delivery (COD)</p>
                    </div>
                  </div>
                  <p className="text-zinc-500 text-xs leading-relaxed">
                    You will pay the total amount to the delivery agent when you receive your package. Please ensure someone is available at the address provided.
                  </p>
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-white text-black py-6 rounded-full font-black uppercase tracking-[0.2em] text-sm flex items-center justify-center space-x-3 hover:bg-zinc-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? (
                  <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <CheckCircle2 size={20} />
                    <span>Confirm Order</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Summary */}
          <div className="lg:col-span-5">
            <div className="sticky top-32 bg-zinc-950 border border-zinc-900 rounded-3xl p-8">
              <h2 className="text-xl font-black text-white uppercase tracking-tighter mb-8">Order Summary</h2>
              
              <div className="space-y-6 mb-8 max-h-[400px] overflow-y-auto pr-2">
                {items.map((item) => (
                  <div key={item.id} className="flex space-x-4">
                    <div className="w-20 h-20 bg-zinc-900 rounded-xl overflow-hidden flex-shrink-0">
                      <img
                        src={item.image_url}
                        alt={item.name}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div className="flex-1 flex flex-col justify-center">
                      <h3 className="text-sm font-bold text-white uppercase tracking-tight">{item.name}</h3>
                      <p className="text-xs text-zinc-500 mt-1">Qty: {item.quantity}</p>
                      <p className="text-sm font-bold text-white mt-1">{item.price * item.quantity} DZD</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-4 pt-6 border-t border-zinc-900">
                <div className="flex justify-between text-zinc-500 text-xs font-bold uppercase tracking-widest">
                  <span>Subtotal</span>
                  <span>{getTotal()} DZD</span>
                </div>
                <div className="flex justify-between text-zinc-500 text-xs font-bold uppercase tracking-widest">
                  <span>Shipping</span>
                  <span className="text-emerald-500">Calculated at delivery</span>
                </div>
                <div className="flex justify-between items-center pt-4 border-t border-zinc-900">
                  <span className="text-white font-black uppercase tracking-widest">Total</span>
                  <span className="text-3xl font-black text-white">{getTotal()} DZD</span>
                </div>
              </div>

              <div className="mt-8 p-4 bg-zinc-900 rounded-2xl flex items-start space-x-3">
                <ShieldCheck size={20} className="text-zinc-500 flex-shrink-0" />
                <p className="text-[10px] text-zinc-500 leading-relaxed uppercase font-bold tracking-wider">
                  Your personal data will be used to process your order, support your experience throughout this website, and for other purposes described in our privacy policy.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ShieldCheck = ({ size, className }: { size: number; className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
    <path d="m9 12 2 2 4-4" />
  </svg>
);
