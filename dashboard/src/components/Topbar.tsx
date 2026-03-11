import React, { useState } from 'react';
import { Search, Bell, User, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function Topbar() {
  const { user, signOut } = useAuth();
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  return (
    <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-zinc-200 bg-white/80 px-8 backdrop-blur-md">
      <div className="relative w-96">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
        <input
          type="text"
          placeholder="Search for orders, products..."
          className="h-10 w-full rounded-full border border-zinc-200 bg-zinc-50 pl-10 pr-4 text-sm outline-none transition-all focus:border-zinc-900 focus:bg-white"
        />
      </div>

      <div className="flex items-center gap-4">
        <button className="relative rounded-full p-2 text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-900">
          <Bell size={20} />
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"></span>
        </button>
        
        <div className="h-8 w-px bg-zinc-200 mx-2"></div>

        <div className="relative">
          <button 
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-3 rounded-lg p-1 transition-colors hover:bg-zinc-50"
          >
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium text-zinc-900">{user?.email?.split('@')[0] || 'Admin'}</p>
              <p className="text-xs text-zinc-500">Store Manager</p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-100 text-zinc-600">
              <User size={20} />
            </div>
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-48 rounded-xl border border-zinc-200 bg-white p-2 shadow-xl animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="px-3 py-2 border-b border-zinc-100 mb-1">
                <p className="text-xs font-medium text-zinc-400 uppercase tracking-wider">Account</p>
                <p className="text-sm font-medium text-zinc-900 truncate">{user?.email}</p>
              </div>
              <button 
                onClick={() => signOut()}
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-50"
              >
                <LogOut size={18} />
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
