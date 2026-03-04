import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Product } from '../types';
import { useCartStore } from '../store/useCartStore';
import { motion } from 'framer-motion';
import { ShoppingBag, ArrowLeft, ShieldCheck, Truck, RotateCcw } from 'lucide-react';

export const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = React.useState<Product | null>(null);
  const [loading, setLoading] = React.useState(true);
  const addItem = useCartStore((state) => state.addItem);
  const toggleCart = useCartStore((state) => state.toggleCart);

  React.useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*, category:categories(*)')
          .eq('id', id)
          .single();

        if (error) throw error;
        setProduct(data);
      } catch (error) {
        console.error('Error fetching product:', error);
        navigate('/');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="bg-black min-h-screen pt-32 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-zinc-800 border-t-white rounded-full animate-spin" />
      </div>
    );
  }

  if (!product) return null;

  const isSoldOut = product.stock <= 0;

  const handleAddToCart = () => {
    addItem(product);
    toggleCart();
  };

  return (
    <div className="bg-black min-h-screen pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center space-x-2 text-zinc-500 hover:text-white transition-colors mb-12 uppercase text-[10px] font-black tracking-widest"
        >
          <ArrowLeft size={16} />
          <span>Back</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Image Gallery */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4"
          >
            <div className="aspect-[3/4] bg-zinc-900 rounded-3xl overflow-hidden relative">
              <img
                src={product.image_url}
                alt={product.name}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              {isSoldOut && (
                <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center">
                  <span className="text-white font-black uppercase tracking-widest border-4 border-white px-8 py-4 text-2xl rotate-[-5deg]">
                    Sold Out
                  </span>
                </div>
              )}
            </div>
          </motion.div>

          {/* Product Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col"
          >
            <div className="mb-8">
              <span className="text-zinc-500 text-xs font-black uppercase tracking-[0.3em]">
                {product.category?.name}
              </span>
              <h1 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter mt-4">
                {product.name}
              </h1>
              <p className="text-3xl font-black text-white mt-6">
                {product.price} DZD
              </p>
            </div>

            <div className="prose prose-invert max-w-none mb-10">
              <p className="text-zinc-400 leading-relaxed text-lg">
                {product.description}
              </p>
            </div>

            <div className="space-y-6 mb-12">
              <div className="flex items-center justify-between p-4 bg-zinc-900/50 rounded-2xl border border-zinc-800">
                <span className="text-zinc-500 text-xs font-bold uppercase tracking-widest">Availability</span>
                <span className={`text-xs font-black uppercase tracking-widest ${isSoldOut ? 'text-red-500' : 'text-emerald-500'}`}>
                  {isSoldOut ? 'Out of Stock' : `${product.stock} Units Left`}
                </span>
              </div>

              <button
                disabled={isSoldOut}
                onClick={handleAddToCart}
                className={`w-full py-6 rounded-full font-black uppercase tracking-[0.2em] text-sm flex items-center justify-center space-x-3 transition-all ${
                  isSoldOut
                    ? 'bg-zinc-900 text-zinc-700 cursor-not-allowed'
                    : 'bg-white text-black hover:bg-zinc-200 active:scale-[0.98]'
                }`}
              >
                <ShoppingBag size={20} />
                <span>{isSoldOut ? 'Sold Out' : 'Add to Shopping Bag'}</span>
              </button>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-10 border-t border-zinc-900">
              <div className="flex flex-col items-center text-center space-y-3">
                <div className="w-12 h-12 bg-zinc-900 rounded-full flex items-center justify-center text-zinc-400">
                  <Truck size={20} />
                </div>
                <span className="text-[10px] font-black text-white uppercase tracking-widest">Fast Delivery</span>
              </div>
              <div className="flex flex-col items-center text-center space-y-3">
                <div className="w-12 h-12 bg-zinc-900 rounded-full flex items-center justify-center text-zinc-400">
                  <ShieldCheck size={20} />
                </div>
                <span className="text-[10px] font-black text-white uppercase tracking-widest">Secure Payment</span>
              </div>
              <div className="flex flex-col items-center text-center space-y-3">
                <div className="w-12 h-12 bg-zinc-900 rounded-full flex items-center justify-center text-zinc-400">
                  <RotateCcw size={20} />
                </div>
                <span className="text-[10px] font-black text-white uppercase tracking-widest">Easy Returns</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};
