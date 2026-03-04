import React from 'react';
import { AlertTriangle, ExternalLink } from 'lucide-react';
import { isConfigured } from '../lib/supabase';

export const ConfigWarning = () => {
  if (isConfigured) return null;

  return (
    <div className="fixed bottom-6 left-6 right-6 z-[100] md:left-auto md:w-96">
      <div className="bg-zinc-950 border border-amber-500/50 rounded-2xl p-6 shadow-2xl backdrop-blur-xl">
        <div className="flex items-start space-x-4">
          <div className="w-10 h-10 bg-amber-500/10 rounded-full flex items-center justify-center flex-shrink-0">
            <AlertTriangle className="text-amber-500" size={20} />
          </div>
          <div className="flex-1">
            <h3 className="text-white font-bold text-sm uppercase tracking-widest mb-2">Configuration Required</h3>
            <p className="text-zinc-400 text-xs leading-relaxed mb-4">
              To see your products and process orders, you need to connect your Supabase project.
            </p>
            <div className="space-y-2">
              <div className="bg-zinc-900 rounded-lg p-3 text-[10px] font-mono text-zinc-500 break-all">
                VITE_SUPABASE_URL<br/>
                VITE_SUPABASE_ANON_KEY
              </div>
              <a 
                href="https://supabase.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center justify-center space-x-2 w-full bg-amber-500 text-black py-2 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-amber-400 transition-colors"
              >
                <span>Setup Supabase</span>
                <ExternalLink size={12} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
