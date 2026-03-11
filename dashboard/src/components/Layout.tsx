import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

export default function Layout() {
  return (
    <div className="min-h-screen bg-zinc-50">
      <Sidebar />
      <div className="pl-64">
        <Topbar />
        <main className="p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
