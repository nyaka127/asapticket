"use client";

import React, { useState, useEffect } from "react";

const themes = [
  { name: "Premium Blue", primary: "#004b91", secondary: "#ffc107", bg: "bg-slate-50", icon: "💎" },
  { name: "Luxury Gold", primary: "#b8860b", secondary: "#000000", bg: "bg-amber-50", icon: "👑" },
  { name: "Midnight Dark", primary: "#1a1a1a", secondary: "#00d1b2", bg: "bg-black", icon: "🌙" },
  { name: "Emerald Green", primary: "#059669", secondary: "#fcd34d", bg: "bg-emerald-50", icon: "🌿" },
];

export function ThemeCustomizer() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTheme, setActiveTheme] = useState(themes[0]);

  useEffect(() => {
    const saved = localStorage.getItem("site-theme");
    if (saved) {
      const theme = themes.find((t) => t.name === saved);
      if (theme) applyTheme(theme);
    }
  }, []);

  const applyTheme = (theme: typeof themes[0]) => {
    setActiveTheme(theme);
    localStorage.setItem("site-theme", theme.name);
    
    // Update CSS variables for branding
    document.documentElement.style.setProperty("--brand-primary", theme.primary);
    document.documentElement.style.setProperty("--brand-secondary", theme.secondary);
    
    // Toggle dark mode class if needed
    if (theme.name === "Midnight Dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    
    // Trigger a custom event for other components to react if needed
    window.dispatchEvent(new CustomEvent("site-theme-change", { detail: theme }));
  };

  return (
    <div className="fixed bottom-8 left-8 z-[110]">
      {/* Floating Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 rounded-full bg-white shadow-2xl flex items-center justify-center border border-slate-200 hover:scale-110 transition-transform group relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-brand-primary opacity-0 group-hover:opacity-10 transition-opacity"></div>
        <span className="text-2xl group-hover:rotate-12 transition-transform">🎨</span>
        {/* Tooltip */}
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 px-3 py-1 bg-slate-800 text-white text-[10px] font-black uppercase tracking-widest rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
          Browse Themes
        </div>
      </button>

      {/* Theme Selection Menu */}
      {isOpen && (
        <div className="absolute bottom-full left-0 mb-6 bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 p-6 w-72 animate-in slide-in-from-bottom-4 duration-500">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest">Select Theme</h3>
            <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-slate-600 transition-colors">✕</button>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {themes.map((theme) => (
              <button
                key={theme.name}
                onClick={() => applyTheme(theme)}
                className={`flex items-center justify-between p-4 rounded-2xl transition-all border-2 ${
                  activeTheme.name === theme.name 
                    ? "border-brand-primary bg-brand-primary/5 shadow-inner" 
                    : "border-slate-50 bg-slate-50 hover:border-slate-200"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl">{theme.icon}</span>
                  <span className={`text-[10px] font-black uppercase tracking-widest ${
                    activeTheme.name === theme.name ? "text-brand-primary" : "text-slate-600"
                  }`}>
                    {theme.name}
                  </span>
                </div>
                <div className="flex gap-1">
                  <div className="w-3 h-3 rounded-full shadow-sm" style={{ backgroundColor: theme.primary }}></div>
                  <div className="w-3 h-3 rounded-full shadow-sm" style={{ backgroundColor: theme.secondary }}></div>
                </div>
              </button>
            ))}
          </div>

          <div className="mt-6 pt-6 border-t border-slate-100">
            <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest leading-relaxed">
              Applied themes will persist across all pages on your stable link: 
              <span className="text-brand-primary block mt-1">asapticketsbooking.com</span>
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
