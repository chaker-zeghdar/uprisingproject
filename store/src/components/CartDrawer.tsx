import React from 'react';
import { X, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCartStore } from '../store/useCartStore';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

export const CartDrawer = () => {
  const { items, isOpen, toggleCart, updateQuantity, removeItem, getTotal } = useCartStore();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={toggleCart}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-zinc-950 border-l border-zinc-800 z-[70] flex flex-col"
          >
            <div className="p-6 flex items-center justify-between border-b border-zinc-800">
              <div className="flex items-center space-x-2">
                <ShoppingBag size={20} className="text-white" />
                <h2 className="text-lg font-bold text-white uppercase tracking-wider">Your Cart</h2>
              </div>
              <button
                onClick={toggleCart}
                className="p-2 hover:bg-zinc-900 rounded-full transition-colors text-zinc-400 hover:text-white"
              >
                <X size={24} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                  <div className="w-16 h-16 bg-zinc-900 rounded-full flex items-center justify-center">
                    <ShoppingBag size={32} className="text-zinc-700" />
                  </div>
                  <div>
                    <p className="text-zinc-400">Your cart is empty</p>
                    <button
                      onClick={toggleCart}
                      className="mt-4 text-white font-bold underline underline-offset-4"
                    >
                      Continue Shopping
                    </button>
                  </div>
                </div>
              ) : (
                items.map((item) => (
                  <div key={item.id} className="flex space-x-4">
                    <div className="w-24 h-24 bg-zinc-900 rounded-lg overflow-hidden flex-shrink-0">
                      <img
                        src={item.image_url}
                        alt={item.name}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div className="flex-1 flex flex-col justify-between py-1">
                      <div>
                        <div className="flex justify-between items-start">
                          <h3 className="text-sm font-bold text-white uppercase">{item.name}</h3>
                          <button
                            onClick={() => removeItem(item.id)}
                            className="text-zinc-500 hover:text-white transition-colors"
                          >
                            <X size={16} />
                          </button>
                        </div>
                        <p className="text-xs text-zinc-500 mt-1">{item.price} DZD</p>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center border border-zinc-800 rounded-md">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="p-1 text-zinc-400 hover:text-white"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="px-3 text-xs font-bold text-white">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="p-1 text-zinc-400 hover:text-white"
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                        <p className="text-sm font-bold text-white">
                          {item.price * item.quantity} DZD
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {items.length > 0 && (
              <div className="p-6 border-t border-zinc-800 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-zinc-400 uppercase text-xs tracking-widest">Subtotal</span>
                  <span className="text-xl font-black text-white">{getTotal()} DZD</span>
                </div>
                <Link
                  to="/checkout"
                  onClick={toggleCart}
                  className="w-full bg-white text-black py-4 rounded-full font-black uppercase tracking-widest flex items-center justify-center space-x-2 hover:bg-zinc-200 transition-colors"
                >
                  <span>Checkout</span>
                  <ArrowRight size={18} />
                </Link>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
