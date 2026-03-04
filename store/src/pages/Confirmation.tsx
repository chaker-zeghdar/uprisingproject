import React from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle2, Package, ArrowRight, ShoppingBag } from 'lucide-react';

export const Confirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const orderId = location.state?.orderId;

  React.useEffect(() => {
    if (!orderId) {
      navigate('/');
    }
  }, [orderId, navigate]);

  if (!orderId) return null;

  return (
    <div className="bg-black min-h-screen flex items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-xl w-full bg-zinc-950 border border-zinc-900 rounded-[40px] p-10 md:p-16 text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', damping: 12, stiffness: 200, delay: 0.2 }}
          className="w-24 h-24 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-10 shadow-[0_0_50px_rgba(16,185,129,0.3)]"
        >
          <CheckCircle2 size={48} className="text-black" />
        </motion.div>

        <h1 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter mb-6">
          Order Confirmed
        </h1>
        
        <p className="text-zinc-400 text-lg mb-10 leading-relaxed">
          Thank you for your order! We've received your request and our team is already preparing your premium gear.
        </p>

        <div className="bg-zinc-900 rounded-3xl p-6 mb-12 flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
          <div className="flex items-center space-x-3">
            <Package size={20} className="text-zinc-500" />
            <span className="text-zinc-500 text-xs font-black uppercase tracking-widest">Order ID</span>
          </div>
          <span className="text-white font-mono text-sm font-bold tracking-wider">{orderId}</span>
        </div>

        <div className="space-y-4">
          <Link
            to="/"
            className="w-full bg-white text-black py-5 rounded-full font-black uppercase tracking-widest flex items-center justify-center space-x-2 hover:bg-zinc-200 transition-all"
          >
            <span>Back to Home</span>
            <ArrowRight size={18} />
          </Link>
          
          <button
            onClick={() => window.print()}
            className="w-full border border-zinc-800 text-zinc-400 py-5 rounded-full font-black uppercase tracking-widest flex items-center justify-center space-x-2 hover:text-white hover:border-white transition-all"
          >
            <ShoppingBag size={18} />
            <span>Print Receipt</span>
          </button>
        </div>

        <p className="mt-12 text-zinc-600 text-[10px] font-black uppercase tracking-[0.2em]">
          A confirmation message will be sent to your phone shortly.
        </p>
      </motion.div>
    </div>
  );
};
