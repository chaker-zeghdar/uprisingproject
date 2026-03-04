import React from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../types';
import { motion } from 'framer-motion';
import { ShoppingBag } from 'lucide-react';
import { useCartStore } from '../store/useCartStore';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const addItem = useCartStore((state) => state.addItem);
  const isSoldOut = product.stock <= 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group relative"
    >
      <Link to={`/product/${product.id}`} className="block">
        <div className="aspect-[3/4] overflow-hidden bg-zinc-900 rounded-2xl relative">
          <img
            src={product.image_url}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            referrerPolicy="no-referrer"
          />
          {isSoldOut && (
            <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] flex items-center justify-center">
              <span className="text-white font-black uppercase tracking-widest border-2 border-white px-4 py-2 rotate-[-5deg]">
                Sold Out
              </span>
            </div>
          )}
          {!isSoldOut && (
            <div className="absolute top-4 right-4">
              <span className="bg-white/10 backdrop-blur-md text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider border border-white/20">
                In Stock
              </span>
            </div>
          )}
        </div>
      </Link>

      <div className="mt-4 flex justify-between items-start">
        <div>
          <Link to={`/product/${product.id}`}>
            <h3 className="text-sm font-bold text-white uppercase tracking-tight group-hover:text-zinc-400 transition-colors">
              {product.name}
            </h3>
          </Link>
          <p className="text-zinc-500 text-xs mt-1">{product.category?.name}</p>
        </div>
        <p className="text-sm font-black text-white">{product.price} DZD</p>
      </div>

      <button
        disabled={isSoldOut}
        onClick={() => addItem(product)}
        className={`mt-4 w-full py-3 rounded-xl font-bold uppercase text-[10px] tracking-widest flex items-center justify-center space-x-2 transition-all ${
          isSoldOut
            ? 'bg-zinc-900 text-zinc-700 cursor-not-allowed'
            : 'bg-zinc-100 text-black hover:bg-white active:scale-95'
        }`}
      >
        <ShoppingBag size={14} />
        <span>{isSoldOut ? 'Out of Stock' : 'Add to Cart'}</span>
      </button>
    </motion.div>
  );
};
