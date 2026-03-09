import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Twitter, Facebook, ArrowUpRight } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-black border-t border-zinc-900 pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="text-3xl font-black tracking-tighter text-white">
              UPRISING<span className="text-zinc-500">PROJECT</span>
            </Link>
            <p className="mt-6 text-zinc-500 max-w-sm leading-relaxed">
              Redefining Algerian streetwear with premium quality and bold designs. Join the movement.
            </p>
            <div className="flex space-x-4 mt-8">
              <a href="#" className="w-10 h-10 rounded-full border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white hover:border-white transition-all">
                <Instagram size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white hover:border-white transition-all">
                <Twitter size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white hover:border-white transition-all">
                <Facebook size={18} />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-white font-bold uppercase text-xs tracking-widest mb-6">Shop</h4>
            <ul className="space-y-4">
              <li><Link to="/category/hoodies" className="text-zinc-500 hover:text-white transition-colors text-sm">Hoodies</Link></li>
              <li><Link to="/category/baggies" className="text-zinc-500 hover:text-white transition-colors text-sm">Baggies</Link></li>
              <li><Link to="/" className="text-zinc-500 hover:text-white transition-colors text-sm">New Arrivals</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold uppercase text-xs tracking-widest mb-6">Support</h4>
            <ul className="space-y-4">
              <li><a href="#" className="text-zinc-500 hover:text-white transition-colors text-sm flex items-center">Shipping <ArrowUpRight size={12} className="ml-1" /></a></li>
              <li><a href="#" className="text-zinc-500 hover:text-white transition-colors text-sm flex items-center">Returns <ArrowUpRight size={12} className="ml-1" /></a></li>
              <li><a href="#" className="text-zinc-500 hover:text-white transition-colors text-sm flex items-center">Contact <ArrowUpRight size={12} className="ml-1" /></a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-zinc-900 pt-10 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div>
            <p className="text-zinc-600 text-[10px] uppercase tracking-widest font-bold">
              © 2026 UPRISING PROJECT. ALL RIGHTS RESERVED.
            </p>
            <p className="text-zinc-700 text-[9px] uppercase tracking-widest font-bold mt-2">
              Created by Chaker Zeghdar
            </p>
          </div>
          <div className="flex space-x-8">
            <a href="#" className="text-zinc-600 hover:text-zinc-400 text-[10px] uppercase tracking-widest font-bold transition-colors">Privacy Policy</a>
            <a href="#" className="text-zinc-600 hover:text-zinc-400 text-[10px] uppercase tracking-widest font-bold transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
