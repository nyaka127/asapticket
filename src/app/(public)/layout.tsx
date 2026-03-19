'use client';
import React from 'react';
import Link from 'next/link';
import { useClientPulse } from '@/hooks/useClientPulse';

const navLinks = [
  { href: '/flights', label: '✈ Flights' },
  { href: '/hotels', label: '🏨 Hotels' },
  { href: '/cars', label: '🚗 Cars' },
  { href: '/tours', label: '🗺 Tours' },
];

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  // Monitor client involvement automatically
  useClientPulse();

  return (
    <div className="min-h-screen bg-white text-slate-800 flex flex-col font-sans antialiased">
        {/* Topbar */}
        <div className="bg-brand-dark text-white/70 text-xs py-1.5 px-4 text-center hidden md:block">
          ✈&nbsp; 24/7 Expert Support &nbsp;|&nbsp; 📞 +1 866 961 7260 &nbsp;|&nbsp; 🌍 Best Price Guarantee &nbsp;|&nbsp; ⭐ Rated Excellent on Trustpilot
        </div>

        {/* Main Header */}
        <header className="bg-brand-primary text-white sticky top-0 z-50 shadow-lg">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16 gap-4">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 shrink-0">
              <div className="w-9 h-9 rounded-lg bg-brand-secondary flex items-center justify-center font-extrabold text-brand-primary text-sm">AT</div>
              <span className="font-extrabold text-lg tracking-tight leading-none">
                ASAP <span className="text-brand-secondary">Tickets</span>
              </span>
            </Link>

            {/* Nav */}
            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link key={link.href} href={link.href}
                  className="px-4 py-2 rounded-lg text-sm font-semibold text-white/80 hover:text-white hover:bg-white/10 transition-all">
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Right CTA */}
            <div className="flex items-center gap-3 shrink-0">
              <a href="tel:+18669617260" className="hidden lg:flex items-center gap-1.5 text-sm text-white/70 hover:text-white transition-colors">
                📞 +1 866 961 7260
              </a>
              <Link href="/dashboard" className="bg-brand-secondary text-brand-primary px-3 py-1.5 rounded-lg text-sm font-bold hover:bg-yellow-300 transition-colors">
                Agent Portal
              </Link>
            </div>
          </div>

          {/* Mobile Nav */}
          <div className="md:hidden flex border-t border-white/10 overflow-x-auto">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href}
                className="flex-1 min-w-max text-center px-4 py-2.5 text-sm font-semibold text-white/80 hover:text-white hover:bg-white/10 transition-all whitespace-nowrap">
                {link.label}
              </Link>
            ))}
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1">{children}</div>

        {/* Footer */}
        <footer className="bg-brand-sidebar text-white/60 text-sm">
          <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-brand-secondary flex items-center justify-center font-extrabold text-brand-primary text-xs">AT</div>
                <span className="font-bold text-white text-base">ASAP Tickets</span>
              </div>
              <p className="text-sm leading-relaxed mb-3">Your trusted global travel partner since 1989. Flights, hotels, cars & tours — all in one place.</p>
              <p className="text-xs text-white/40">⭐⭐⭐⭐⭐ Rated Excellent on Trustpilot</p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-3">Travel</h4>
              <ul className="space-y-2">
                {[['Flights', '/flights'], ['Hotels', '/hotels'], ['Car Rentals', '/cars'], ['Tour Guides', '/tours']].map(([label, href]) => (
                  <li key={href}><Link href={href} className="hover:text-white transition-colors">{label}</Link></li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-3">Our Promise</h4>
              <ul className="space-y-2">
                <li>Best Price Guarantee</li>
                <li>Exclusive Deals</li>
                <li>No Hidden Fees</li>
                <li>Secure Checkout</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-3">Support</h4>
              <ul className="space-y-2">
                <li>📞 <a href="tel:+18669617260" className="hover:text-white transition-colors">+1 866 961 7260</a></li>
                <li>✉️ <a href="mailto:support@asaptickets.com" className="hover:text-white transition-colors">support@asaptickets.com</a></li>
                <li>🕐 24/7 Available</li>
                <li>💬 Live Chat Available</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/10 py-4 text-center text-xs text-white/30">
            © {new Date().getFullYear()} ASAP Tickets · All Rights Reserved · Payments secured by Stripe 🔒
          </div>
        </footer>
    </div>
  );
}
