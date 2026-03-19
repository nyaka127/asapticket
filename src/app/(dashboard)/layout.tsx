import React from 'react';
import Link from 'next/link';

const sidebarLinks = [
  { href: '/', label: '🌐 Public Site', icon: '🏠' },
  { href: '/dashboard', label: 'Dashboard', icon: '📊' },
  { href: '/dashboard/leads', label: 'Leads', icon: '👥' },
  { href: '/dashboard/customers', label: 'Customers', icon: '👤' },
  { href: '/dashboard/quotes', label: 'Quotes', icon: '📜' },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-800">
      {/* Sidebar */}
      <aside className="w-64 bg-brand-sidebar text-white/70 hidden md:flex flex-col border-r border-white/5">
        <div className="p-6 flex items-center gap-3 border-b border-white/5">
          <div className="w-8 h-8 rounded-lg bg-brand-secondary flex items-center justify-center font-extrabold text-brand-primary text-xs">AT</div>
          <span className="font-bold text-white text-lg tracking-tight">ASAP Agent</span>
        </div>
        
        <nav className="flex-1 py-6 px-4 space-y-1">
          {sidebarLinks.map((link) => (
            <Link key={link.href} href={link.href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/5 hover:text-white transition-all text-sm font-medium">
              <span className="text-lg opacity-80">{link.icon}</span>
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="p-6 border-t border-white/5">
          <div className="bg-white/5 rounded-xl p-4">
            <div className="text-[10px] font-bold text-white/30 uppercase tracking-widest mb-1">Logged in as</div>
            <div className="text-xs font-bold text-white mb-1">Agent Alpha</div>
            <div className="text-[10px] text-white/50">support@asaptickets.com</div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 shrink-0">
          <div className="flex items-center gap-4">
            <div className="md:hidden text-2xl">☰</div>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">🔍</span>
              <input type="text" placeholder="Search bookings, leads..." 
                className="bg-slate-100 border-none rounded-xl pl-9 pr-4 py-2 text-sm focus:ring-2 focus:ring-brand-primary w-64 transition-all" />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <span className="text-xl opacity-60">🔔</span>
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-[10px] text-white flex items-center justify-center font-bold">3</span>
            </div>
            <div className="w-8 h-8 rounded-full bg-brand-primary flex items-center justify-center text-white font-bold text-sm">A</div>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <div className="flex-1 overflow-y-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
