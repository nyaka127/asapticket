'use client';
import React, { useState, useRef, useEffect, useMemo } from 'react';
import { ALL_AIRPORTS, type Airport } from '@/lib/airports';
import { useTranslation } from './TranslationProvider';

interface AirportSearchDropdownProps {
  value: string;
  onChange: (iataCode: string) => void;
  placeholder?: string;
  label?: string;
  id?: string;
}

export function AirportSearchDropdown({ value, onChange, placeholder, label, id }: AirportSearchDropdownProps) {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Close on click outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Quick search results across all airports
  const searchResults = useMemo(() => {
    if (!searchQuery) {
       // Return a comprehensive list of popular worldwide international hubs if empty
       const popularHubs = [
         'JFK', 'LHR', 'DXB', 'CDG', 'SIN', 'LAX', 'FRA', 'AMS', 'IST', 'HKG', 
         'DOH', 'YYZ', 'SYD', 'MIA', 'ICN', 'MUC', 'KIX', 'GRU', 'EZE', 'JNB',
         'SFO', 'BKK', 'MEL', 'ZRH', 'MXP', 'Fiumicino' // MXP -> Milan, FCO -> Rome (IATA is FCO usually)
       ].map(code => code === 'Fiumicino' ? 'FCO' : code);
       
       return ALL_AIRPORTS.filter(a => popularHubs.includes(a.iata))
         .sort((a, b) => popularHubs.indexOf(a.iata) - popularHubs.indexOf(b.iata));
    }
    const q = searchQuery.toLowerCase();
    
    // Find all matches, filtering out tiny airstrips/lodges/bases globally
    let matches = ALL_AIRPORTS.filter(a => {
      const n = a.name.toLowerCase();
      if (n.includes('airstrip') || n.includes('lodge') || n.includes('base') || n.includes('afb')) return false;
      return a.iata.toLowerCase().includes(q) ||
             n.includes(q) ||
             a.city.toLowerCase().includes(q) ||
             a.country.toLowerCase().includes(q);
    });

    // Sort to prioritize major International Hubs at the very top!
    matches.sort((a, b) => {
       const aIntl = a.name.toLowerCase().includes('international') || a.name.toLowerCase().includes('intl') || a.name.toLowerCase().includes('inter') ? 1 : 0;
       const bIntl = b.name.toLowerCase().includes('international') || b.name.toLowerCase().includes('intl') || b.name.toLowerCase().includes('inter') ? 1 : 0;
       
       // Priority 1: "International" is in the name
       if (aIntl !== bIntl) return bIntl - aIntl;
       
       // Priority 2: Exact IATA match
       if (a.iata.toLowerCase() === q && b.iata.toLowerCase() !== q) return -1;
       if (b.iata.toLowerCase() === q && a.iata.toLowerCase() !== q) return 1;

       // Priority 3: City match over just country match
       const aCityMatch = a.city.toLowerCase().startsWith(q) ? 1 : 0;
       const bCityMatch = b.city.toLowerCase().startsWith(q) ? 1 : 0;
       if (aCityMatch !== bCityMatch) return bCityMatch - aCityMatch;

       return a.name.localeCompare(b.name);
    });

    return matches.slice(0, 20);
  }, [searchQuery]);

  const handleSelect = (airport: Airport) => {
    onChange(airport.iata);
    setSearchQuery('');
    setIsOpen(false);
  };

  // Get display value from IATA code
  const displayValue = useMemo(() => {
    if (!value) return '';
    const airport = ALL_AIRPORTS.find(a => a.iata === value.toUpperCase());
    if (airport) return `${airport.city} (${airport.iata})`;
    return value;
  }, [value]);

  return (
    <div ref={containerRef} className="relative w-full">
      {label && (
        <label className="text-[9px] font-black text-slate-800 uppercase tracking-widest ml-4 mb-2 block">{label}</label>
      )}
      
      {/* Main Input */}
      <div
        onClick={() => { setIsOpen(true); setTimeout(() => inputRef.current?.focus(), 100); }}
        className={`w-full bg-slate-50 border-2 ${isOpen ? 'border-brand-primary bg-white shadow-lg' : 'border-slate-100'} rounded-3xl px-5 py-4 cursor-pointer transition-all relative`}
      >
        {value ? (
          <div className="flex items-center justify-between">
            <div>
              <span className="font-black text-sm text-slate-800 uppercase">{displayValue}</span>
            </div>
            <button type="button" onClick={(e) => { e.stopPropagation(); onChange(''); }} className="text-slate-300 hover:text-red-400 transition-colors text-lg">✕</button>
          </div>
        ) : (
          <span className="text-sm font-black text-slate-300 uppercase tracking-widest">{placeholder || t('select_airport_title')}</span>
        )}
      </div>

      {/* Dropdown Panel */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 z-[120] mt-2 bg-white rounded-[2rem] shadow-2xl border border-slate-100 overflow-hidden" style={{ maxHeight: '420px' }}>

          {/* Search Input */}
          <div className="p-4 border-b border-slate-100 bg-slate-50/50 sticky top-0 z-10">
            <div className="flex items-center gap-2">
              <div className="flex-1 relative">
                <input
                  ref={inputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Type city, country, or airport..."
                  className="w-full bg-white rounded-xl px-4 py-3 text-sm font-bold border border-slate-100 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/10 outline-none transition-all placeholder:text-slate-300"
                />
              </div>
            </div>
          </div>

          {/* Content Area */}
          <div className="overflow-y-auto" style={{ maxHeight: '310px' }}>
            <div className="p-3">
              <p className="text-[8px] font-black text-emerald-600 uppercase tracking-widest px-3 mb-2">{searchQuery ? '✈️ Search Results' : '✈️ Global International Airports'}</p>
              {searchResults.length === 0 ? (
                <div className="py-8 text-center text-slate-300 text-xs font-bold">No results found for "{searchQuery}"</div>
              ) : (
                searchResults.map(airport => (
                  <button type="button" key={airport.iata} onClick={() => handleSelect(airport)}
                    className="w-full flex items-center justify-between px-4 py-3 rounded-xl hover:bg-brand-primary/5 transition-all text-left group">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-brand-primary/10 flex items-center justify-center text-brand-primary font-black text-xs shrink-0">
                        {airport.iata}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-black text-slate-800 truncate">{airport.city}</p>
                        <p className="text-[9px] font-bold text-slate-400 leading-tight truncate">{airport.name}</p>
                      </div>
                    </div>
                    <span className="text-[8px] font-black text-slate-300 uppercase tracking-widest group-hover:text-brand-primary transition-colors whitespace-nowrap ml-2">{airport.country}</span>
                  </button>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

