import React from 'react';
import { supabase } from '../lib/supabase';
import { Product, Category } from '../types';
import { ProductCard } from '../components/ProductCard';
import { ContainerScroll } from '../components/ui/container-scroll-animation';
import ScrollExpandMedia from '../components/ui/scroll-expansion-hero';
import { VelocityScroll } from '../components/ui/scroll-based-velocity';
import { motion } from 'framer-motion';
import { ArrowRight, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Home = () => {
  const [featuredProducts, setFeaturedProducts] = React.useState<Product[]>([]);
  const [categories, setCategories] = React.useState<Category[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsRes, categoriesRes] = await Promise.all([
          supabase
            .from('products')
            .select('*, category:categories(*)')
            .eq('is_active', true)
            .limit(4),
          supabase.from('categories').select('*'),
        ]);

        if (productsRes.data) setFeaturedProducts(productsRes.data);
        if (categoriesRes.data) setCategories(categoriesRes.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="bg-black min-h-screen">
      <ScrollExpandMedia
        mediaType="image"
        mediaSrc="https://i.pinimg.com/1200x/9d/51/04/9d510454b52b5c8ffbcb384283d94fd7.jpg"
        bgImageSrc="https://i.pinimg.com/1200x/a2/f2/3b/a2f23b5cd8446d6a9872af08af28471b.jpg"
        title="UPRISING PROJECT"
        date="EST. 2026"
        scrollToExpand="SCROLL TO UNLEASH"
        textBlend
      >
        <div className="bg-black">
          {/* Hero CTA Section (Appears after expansion) */}
          <section className="relative py-20 flex flex-col items-center justify-center text-center px-6">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter uppercase leading-none">
                Premium Streetwear<br />
                <span className="text-zinc-600">From Algeria</span>
              </h2>
              <p className="mt-8 text-zinc-400 text-lg max-w-2xl mx-auto font-medium">
                Bold designs for the modern generation. Crafted with precision, worn with pride.
              </p>
              <div className="mt-12 flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-6">
                <Link
                  to="/category/hoodies"
                  className="w-full md:w-auto bg-white text-black px-10 py-5 rounded-full font-black uppercase tracking-widest hover:bg-zinc-200 transition-all flex items-center justify-center space-x-2"
                >
                  <span>Shop Hoodies</span>
                  <ArrowRight size={20} />
                </Link>
                <Link
                  to="/category/baggies"
                  className="w-full md:w-auto border border-zinc-700 text-white px-10 py-5 rounded-full font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all"
                >
                  View Baggies
                </Link>
              </div>
            </motion.div>
          </section>

          {/* Scroll Animation Section */}
          <section className="bg-zinc-950 py-20">
            <ContainerScroll
              titleComponent={
                <div className="mb-10">
                  <h2 className="text-4xl md:text-7xl font-black text-white uppercase tracking-tighter">
                    The New<br />
                    <span className="text-zinc-600">Standard</span>
                  </h2>
                </div>
              }
            >
              <img
                src="https://i.pinimg.com/1200x/60/f4/6e/60f46e19d0ae2a65830e3a05e0fc0e4e.jpg"
                alt="Showcase"
                className="w-full h-full object-cover rounded-2xl"
                referrerPolicy="no-referrer"
              />
            </ContainerScroll>
          </section>

          {/* Categories Grid */}
          <section className="max-w-7xl mx-auto px-6 py-32">
            <div className="flex justify-between items-end mb-12">
              <div>
                <h2 className="text-xs font-black text-zinc-500 uppercase tracking-[0.3em] mb-4">Collections</h2>
                <h3 className="text-4xl font-black text-white uppercase tracking-tighter">Choose your vibe</h3>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Link to="/category/hoodies" className="group relative aspect-[16/9] overflow-hidden rounded-3xl bg-zinc-900">
                <img
                  src="https://i.pinimg.com/1200x/60/f4/6e/60f46e19d0ae2a65830e3a05e0fc0e4e.jpg"
                  alt="Hoodies"
                  className="w-full h-full object-cover opacity-60 transition-transform duration-700 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <div className="absolute bottom-8 left-8">
                  <h4 className="text-3xl font-black text-white uppercase tracking-tighter">Hoodies</h4>
                  <p className="text-zinc-400 mt-2 flex items-center font-bold uppercase text-xs tracking-widest">
                    Explore Collection <ChevronRight size={16} className="ml-1" />
                  </p>
                </div>
              </Link>

              <Link to="/category/baggies" className="group relative aspect-[16/9] overflow-hidden rounded-3xl bg-zinc-900">
                <img
                  src="https://i.pinimg.com/1200x/d8/57/e0/d857e01fbcdbc4b02463cdc8ae27106e.jpg"
                  alt="Baggies"
                  className="w-full h-full object-cover opacity-60 transition-transform duration-700 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <div className="absolute bottom-8 left-8">
                  <h4 className="text-3xl font-black text-white uppercase tracking-tighter">Baggies</h4>
                  <p className="text-zinc-400 mt-2 flex items-center font-bold uppercase text-xs tracking-widest">
                    Explore Collection <ChevronRight size={16} className="ml-1" />
                  </p>
                </div>
              </Link>
            </div>
          </section>

          {/* Featured Products */}
          <section className="max-w-7xl mx-auto px-6 py-32 border-t border-zinc-900">
            <div className="flex justify-between items-end mb-12">
              <div>
                <h2 className="text-xs font-black text-zinc-500 uppercase tracking-[0.3em] mb-4">Featured</h2>
                <h3 className="text-4xl font-black text-white uppercase tracking-tighter">Latest Drops</h3>
              </div>
              <Link to="/category/hoodies" className="text-white font-bold uppercase text-xs tracking-widest border-b border-white pb-1 hover:text-zinc-400 hover:border-zinc-400 transition-colors">
                View All
              </Link>
            </div>

            {loading ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="animate-pulse">
                    <div className="aspect-[3/4] bg-zinc-900 rounded-2xl mb-4" />
                    <div className="h-4 bg-zinc-900 rounded w-2/3 mb-2" />
                    <div className="h-4 bg-zinc-900 rounded w-1/3" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                {featuredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </section>

          {/* Brand Statement */}
          <section className="py-32 bg-white text-black overflow-hidden">
            <VelocityScroll
              text="Built for the streets. Designed for the bold."
              default_velocity={3}
              className="font-black uppercase tracking-tighter text-4xl md:text-7xl lg:text-8xl"
            />
            <div className="max-w-5xl mx-auto px-6 text-center mt-12">
              <p className="text-zinc-600 text-lg md:text-xl font-medium max-w-2xl mx-auto">
                Uprising Project is more than just a brand. It's a statement of identity and quality, crafted with precision in Algeria.
              </p>
            </div>
          </section>
        </div>
      </ScrollExpandMedia>
    </div>
  );
};
