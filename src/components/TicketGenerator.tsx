'use client';

import React, { useState } from 'react';

type TicketProps = {
  type: 'FLIGHT' | 'HOTEL' | 'CAR';
  confirmationId: string;
  title: string;
  subtitle: string;
  price: string;
  details: Record<string, string>;
};

export default function TicketGenerator({ type, confirmationId, title, subtitle, price, details }: TicketProps) {
  const [email, setEmail] = useState('');
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSendQuote = async () => {
    if (!email) return;
    setSending(true);
    try {
      await fetch('/api/quotes/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ toEmail: email, type, title, subtitle, price, details })
      });
      setSent(true);
    } catch (e) {
      console.error(e);
    }
    setSending(false);
  };

  return (
    <div className="flex flex-col gap-4 w-full max-w-md items-center my-4">
      <div className="w-full bg-white rounded-xl shadow-2xl overflow-hidden border border-gray-100 transform transition-all hover:scale-105">
      <div className={`h-24 px-6 flex items-center justify-between text-white ${
        type === 'FLIGHT' ? 'bg-gradient-to-r from-blue-500 to-indigo-600' :
        type === 'HOTEL' ? 'bg-gradient-to-r from-teal-400 to-emerald-600' :
        'bg-gradient-to-r from-orange-400 to-red-500'
      }`}>
        <div>
          <h2 className="text-2xl font-bold uppercase tracking-wider">{type} TICKET</h2>
          <p className="text-sm opacity-90">{title}</p>
        </div>
        <div className="text-right">
          <p className="text-xs uppercase font-semibold opacity-80">Confirmation</p>
          <p className="text-xl font-mono tracking-widest">{confirmationId}</p>
        </div>
      </div>
      
      <div className="p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-1">{subtitle}</h3>
        <p className="text-2xl font-bold text-gray-900 mb-6">${price}</p>
        
        <div className="grid grid-cols-2 gap-4">
          {Object.entries(details).map(([key, value]) => (
            <div key={key}>
              <p className="text-xs text-gray-500 uppercase font-semibold">{key}</p>
              <p className="text-sm font-medium text-gray-800">{value}</p>
            </div>
          ))}
        </div>
      </div>
      
      <div className="border-t border-dashed border-gray-300 relative">
        <div className="absolute -left-3 -top-3 w-6 h-6 bg-gray-50 rounded-full border-r border-gray-300"></div>
        <div className="absolute -right-3 -top-3 w-6 h-6 bg-gray-50 rounded-full border-l border-gray-300"></div>
        
        <div className="p-6 flex items-center justify-center bg-gray-50">
          {/* Mock Barcode */}
          <div className="flex gap-1 h-12 w-full justify-center opacity-60 mix-blend-multiply">
            {Array.from({ length: 40 }).map((_, i) => (
              <div key={i} className="bg-gray-800" style={{ width: `${Math.random() * 4 + 1}px` }}></div>
            ))}
          </div>
        </div>
      </div>
      </div>

      {/* Send Quote Section */}
      <div className="w-full bg-white p-5 rounded-xl shadow-sm border border-gray-200 mt-2">
        <h3 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wider">Send Price Quote</h3>
        {sent ? (
          <div className="bg-green-50 text-green-700 p-3 rounded text-sm font-medium border border-green-200">
            Quote successfully sent to {email}!
          </div>
        ) : (
          <div className="flex gap-2">
            <input 
              type="email" 
              placeholder="Customer Email Address" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 border text-black border-gray-300 rounded-lg p-2 text-sm focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
            <button 
              onClick={handleSendQuote}
              disabled={sending || !email}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors whitespace-nowrap"
            >
              {sending ? 'Sending...' : 'Email Quote'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
