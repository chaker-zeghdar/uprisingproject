import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Product, Category } from '../types';
import { ProductCard } from '../components/ProductCard';
import { motion } from 'framer-motion';
import { Filter, SlidersHorizontal } from 'lucide-react';

export const CategoryPage = () => {
  const { categoryName } = useParams<{ categoryName: string }>();
  const [products, setProducts] = React.useState<Product[]>([]);
  const [category, setCategory] = React.useState<Category | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Find category ID first
        const { data: catData } = await supabase
          .from('categories')
          .select('*')
          .ilike('name', categoryName || '')
          .single();

        if (catData) {
          setCategory(catData);
          const { data: prodData } = await supabase
            .from('products')
            .select('*, category:categories(*)')
            .eq('category_id', catData.id)
            .eq('is_active', true);

          if (prodData) setProducts(prodData);
        }
      } catch (error) {
        console.error('Error fetching category data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [categoryName]);

  return (
    <div className="bg-black min-h-screen pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 space-y-8 md:space-y-0">
          <div>
            <div className="flex items-center space-x-2 text-zinc-500 text-[10px] font-black uppercase tracking-widest mb-4">
              <Link to="/" className="hover:text-white transition-colors">Home</Link>
              <span>/</span>
              <span className="text-white">{categoryName}</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tighter">
              {categoryName}
            </h1>
            <p className="text-zinc-500 mt-4 max-w-md font-medium">
              Discover our premium collection of {categoryName}, designed for comfort and style.
            </p>
          </div>

          <div className="flex items-center space-x-4">
            <button className="flex items-center space-x-2 bg-zinc-900 text-white px-6 py-3 rounded-full text-xs font-bold uppercase tracking-widest border border-zinc-800 hover:bg-zinc-800 transition-colors">
              <SlidersHorizontal size={14} />
              <span>Sort</span>
            </button>
            <button className="flex items-center space-x-2 bg-zinc-900 text-white px-6 py-3 rounded-full text-xs font-bold uppercase tracking-widest border border-zinc-800 hover:bg-zinc-800 transition-colors">
              <Filter size={14} />
              <span>Filter</span>
            </button>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-[3/4] bg-zinc-900 rounded-2xl mb-4" />
                <div className="h-4 bg-zinc-900 rounded w-2/3 mb-2" />
                <div className="h-4 bg-zinc-900 rounded w-1/3" />
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="py-40 text-center">
            <h2 className="text-2xl font-bold text-zinc-700 uppercase tracking-widest">No products found in this category</h2>
            <Link to="/" className="mt-8 inline-block text-white font-bold underline underline-offset-8 uppercase text-xs tracking-widest">
              Back to Home
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-12">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
