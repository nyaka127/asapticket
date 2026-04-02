'use client';
import React, { useState } from 'react';

interface ContactInfo {
  name?: string;
  phone?: string;
  email?: string;
}

interface CommunicationsHubProps {
  prefillContact?: ContactInfo;
  prefillMessage?: string;
  prefillSubject?: string;
}

type Channel = 'email' | 'whatsapp' | 'sms' | 'call';

interface MessageTemplate {
  id: string;
  name: string;
  category: string;
  subject?: string;
  body: string;
}

const MASTERCLASS_TEMPLATES: MessageTemplate[] = [
  {
    id: 'booking-confirm',
    name: 'Booking Confirmation',
    category: '🎫 Bookings',
    subject: 'Your Flight Booking Confirmation - ASAP Tickets',
    body: `Dear {name},

Thank you for choosing ASAP Tickets Booking!

We are pleased to confirm your booking. Your dedicated travel agent has secured the best available rate for your journey.

📋 Booking Details:
• Route: {route}
• Status: CONFIRMED
• Reference: Will be shared shortly

🔒 What happens next:
1. Your e-ticket will be emailed within 2-4 hours
2. You will receive a payment confirmation receipt
3. Your agent remains available 24/7 for any changes

For any questions, reply to this message or call us directly.

Best regards,
ASAP Tickets Booking Team
✈️ Fly Smart. Fly ASAP.`,
  },
  {
    id: 'payment-reminder',
    name: 'Payment Reminder',
    category: '💰 Payments',
    subject: 'Action Required: Complete Your Booking Payment',
    body: `Dear {name},

This is a friendly reminder that your flight booking is awaiting payment confirmation.

⏰ Important: Airline fares are subject to availability and may increase. We strongly recommend completing your payment as soon as possible to lock in your current rate.

💳 Payment Options:
• Secure online payment via our website
• Bank transfer (details available upon request)
• Payment plan available for qualifying bookings

🛡️ Your booking is protected by our No-Loss Price Guarantee once payment is confirmed.

Need assistance? Reply to this message or call your dedicated agent.

Best regards,
ASAP Tickets Booking Team`,
  },
  {
    id: 'itinerary-share',
    name: 'Flight Itinerary',
    category: '🎫 Bookings',
    subject: 'Your Complete Flight Itinerary',
    body: `Dear {name},

Please find your complete flight itinerary below:

✈️ OUTBOUND FLIGHT
• Route: {route}
• Date: [Flight Date]
• Flight: [Flight Number]
• Departure: [Time] from [Airport]
• Arrival: [Time] at [Airport]
• Class: [Cabin Class]

📋 IMPORTANT INFORMATION:
• Check-in opens 24 hours before departure
• Arrive at the airport at least 3 hours before international flights
• Carry valid passport and travel documents
• Baggage allowance: [Details]

📱 Download your boarding pass from the airline's app or website after online check-in.

Have a wonderful journey!
ASAP Tickets Booking Team`,
  },
  {
    id: 'special-offer',
    name: 'Special Offer / Promotion',
    category: '🔥 Marketing',
    subject: '🔥 Exclusive Deal: Save Up to 40% on Your Next Flight',
    body: `Hi {name}! 👋

We have an EXCLUSIVE offer just for you!

🔥 LIMITED TIME: Save up to 40% on select routes!

✨ Featured Deals:
• New York → London from $345
• Los Angeles → Tokyo from $589
• Miami → Dubai from $612

💎 Why book with ASAP Tickets?
✅ Wholesale airline rates not available online
✅ 24/7 dedicated agent support
✅ No-Loss Price Guarantee
✅ Flexible payment options

⏰ Offer expires in 48 hours!

Ready to book? Simply reply to this message or call us. Your personal agent is standing by.

Best deals await!
ASAP Tickets Booking Team`,
  },
  {
    id: 'followup',
    name: 'Follow-Up / Check-In',
    category: '🤝 Service',
    subject: 'How Can We Help You Today?',
    body: `Hi {name},

I hope this message finds you well! I'm following up from ASAP Tickets Booking.

I noticed you were recently looking at flights and wanted to check if:

1️⃣ You found what you were looking for?
2️⃣ Would you like me to check current wholesale rates for your route?
3️⃣ Do you have any questions about our booking process?

As your dedicated agent, I have access to private airline inventory with rates typically 20-40% below retail.

Feel free to reply anytime — I'm here to help make your travel plans a reality.

Warm regards,
Your ASAP Travel Agent`,
  },
  {
    id: 'welcome',
    name: 'Welcome Message',
    category: '🤝 Service',
    subject: 'Welcome to ASAP Tickets Booking!',
    body: `Hi {name}! 🎉

Welcome to ASAP Tickets Booking — your gateway to the world's best flight deals!

Here's what makes us different:
🌍 Access to 500+ airlines worldwide
💰 Wholesale rates up to 40% below retail
🤝 Personal agent assigned to every booking
🛡️ No-Loss Price Guarantee on all tickets
📞 24/7 support via WhatsApp, Email & Phone

How to get started:
1. Tell us your travel dates and destination
2. We'll search our private airline inventory
3. You'll receive the best available options within minutes

Ready to explore? Simply reply with your travel plans!

Let's get you flying! ✈️
ASAP Tickets Booking Team`,
  },
  {
    id: 'post-travel',
    name: 'Post-Travel Thank You',
    category: '🤝 Service',
    subject: 'Thank You for Flying with ASAP Tickets!',
    body: `Dear {name},

Welcome back! We hope you had an amazing trip! ✈️

We'd love to hear about your experience:
⭐ How was your flight?
⭐ Did everything go smoothly?
⭐ How can we improve?

🎁 As a valued customer, you're now eligible for:
• Priority access to flash sales
• Exclusive returning customer discounts
• Dedicated VIP agent line

Planning your next adventure? Let me know — I'll make sure you get our absolute best rates.

Thank you for choosing ASAP Tickets!
Your Travel Agent`,
  },
];

export function CommunicationsHub({ prefillContact, prefillMessage, prefillSubject }: CommunicationsHubProps) {
  const [activeChannel, setActiveChannel] = useState<Channel>('whatsapp');
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [recipientName, setRecipientName] = useState(prefillContact?.name || '');
  const [recipientPhone, setRecipientPhone] = useState(prefillContact?.phone || '');
  const [recipientEmail, setRecipientEmail] = useState(prefillContact?.email || '');
  const [messageBody, setMessageBody] = useState('');
  const [emailSubject, setEmailSubject] = useState('');
  const [sendStatus, setSendStatus] = useState<'idle' | 'sent'>('idle');

  // Update prefill when it changes
  React.useEffect(() => {
    if (prefillContact) {
      if (prefillContact.name) setRecipientName(prefillContact.name);
      if (prefillContact.phone) setRecipientPhone(prefillContact.phone);
      if (prefillContact.email) setRecipientEmail(prefillContact.email);
    }
  }, [prefillContact]);

  React.useEffect(() => {
    if (prefillMessage !== undefined) setMessageBody(prefillMessage);
  }, [prefillMessage]);

  React.useEffect(() => {
    if (prefillSubject !== undefined) setEmailSubject(prefillSubject);
  }, [prefillSubject]);

  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplate(templateId);
    const tmpl = MASTERCLASS_TEMPLATES.find(t => t.id === templateId);
    if (tmpl) {
      const filledBody = tmpl.body.replace(/\{name\}/g, recipientName || '[Client Name]');
      setMessageBody(filledBody);
      if (tmpl.subject) setEmailSubject(tmpl.subject.replace(/\{name\}/g, recipientName || '[Client Name]'));
    }
  };

  const handleSend = () => {
    const cleanPhone = recipientPhone.replace(/[^\d+]/g, '');

    switch (activeChannel) {
      case 'whatsapp': {
        const waUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(messageBody)}`;
        window.open(waUrl, '_blank');
        break;
      }
      case 'sms': {
        const smsUrl = `sms:${cleanPhone}?body=${encodeURIComponent(messageBody)}`;
        window.open(smsUrl, '_self');
        break;
      }
      case 'email': {
        const mailUrl = `mailto:${recipientEmail}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(messageBody)}`;
        window.open(mailUrl, '_self');
        break;
      }
      case 'call': {
        window.open(`tel:${cleanPhone}`, '_self');
        break;
      }
    }
    setSendStatus('sent');
    setTimeout(() => setSendStatus('idle'), 3000);
  };

  const channels: { key: Channel; icon: string; label: string; color: string }[] = [
    { key: 'whatsapp', icon: '💬', label: 'WhatsApp', color: 'emerald' },
    { key: 'email', icon: '📧', label: 'Email', color: 'blue' },
    { key: 'sms', icon: '📱', label: 'SMS', color: 'violet' },
    { key: 'call', icon: '📞', label: 'Call', color: 'amber' },
  ];

  const categories = Array.from(new Set(MASTERCLASS_TEMPLATES.map(t => t.category)));

  return (
    <div className="bg-white rounded-[3rem] shadow-xl border border-slate-100 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 p-6">
        <h2 className="text-xl font-black text-white italic tracking-tight flex items-center gap-2">
          📡 Communications Hub
        </h2>
        <p className="text-white/40 text-[9px] font-black uppercase tracking-[0.2em] mt-1">
          Multi-Channel Client Outreach
        </p>
      </div>

      {/* Channel Tabs */}
      <div className="flex border-b border-slate-100">
        {channels.map(ch => (
          <button
            key={ch.key}
            type="button"
            onClick={() => setActiveChannel(ch.key)}
            className={`flex-1 py-3 text-center text-[9px] font-black uppercase tracking-widest transition-all relative
              ${activeChannel === ch.key
                ? 'text-brand-primary bg-brand-primary/5'
                : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'
              }`}
          >
            <span className="text-sm mr-1">{ch.icon}</span>
            {ch.label}
            {activeChannel === ch.key && (
              <div className="absolute bottom-0 left-1/4 right-1/4 h-[3px] bg-brand-primary rounded-t-full"></div>
            )}
          </button>
        ))}
      </div>

      <div className="p-6 space-y-4">
        {/* Recipient Fields */}
        <div className="grid grid-cols-1 gap-3">
          <div>
            <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1 block ml-1">Recipient Name</label>
            <input
              type="text"
              value={recipientName}
              onChange={e => setRecipientName(e.target.value)}
              placeholder="Client full name"
              className="w-full bg-slate-50 rounded-xl px-4 py-2.5 text-sm font-bold border border-slate-100 focus:border-brand-primary focus:ring-1 focus:ring-brand-primary/20 outline-none transition-all"
            />
          </div>
          {(activeChannel === 'whatsapp' || activeChannel === 'sms' || activeChannel === 'call') && (
            <div>
              <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1 block ml-1">Phone / WhatsApp</label>
              <input
                type="tel"
                value={recipientPhone}
                onChange={e => setRecipientPhone(e.target.value)}
                placeholder="+1 234 567 890"
                className="w-full bg-slate-50 rounded-xl px-4 py-2.5 text-sm font-bold border border-slate-100 focus:border-brand-primary focus:ring-1 focus:ring-brand-primary/20 outline-none transition-all"
              />
            </div>
          )}
          {activeChannel === 'email' && (
            <>
              <div>
                <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1 block ml-1">Email Address</label>
                <input
                  type="email"
                  value={recipientEmail}
                  onChange={e => setRecipientEmail(e.target.value)}
                  placeholder="client@email.com"
                  className="w-full bg-slate-50 rounded-xl px-4 py-2.5 text-sm font-bold border border-slate-100 focus:border-brand-primary focus:ring-1 focus:ring-brand-primary/20 outline-none transition-all"
                />
              </div>
              <div>
                <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1 block ml-1">Subject Line</label>
                <input
                  type="text"
                  value={emailSubject}
                  onChange={e => setEmailSubject(e.target.value)}
                  placeholder="Email subject..."
                  className="w-full bg-slate-50 rounded-xl px-4 py-2.5 text-sm font-bold border border-slate-100 focus:border-brand-primary focus:ring-1 focus:ring-brand-primary/20 outline-none transition-all"
                />
              </div>
            </>
          )}
        </div>

        {/* Template Selector */}
        {activeChannel !== 'call' && (
          <div>
            <label className="text-[8px] font-black text-emerald-600 uppercase tracking-widest mb-2 block ml-1">
              🏆 Masterclass Templates
            </label>
            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {categories.map(cat => (
                <div key={cat}>
                  <p className="text-[7px] font-black text-slate-300 uppercase tracking-widest mb-1 ml-1">{cat}</p>
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    {MASTERCLASS_TEMPLATES.filter(t => t.category === cat).map(tmpl => (
                      <button
                        key={tmpl.id}
                        type="button"
                        onClick={() => handleTemplateSelect(tmpl.id)}
                        className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-wide transition-all
                          ${selectedTemplate === tmpl.id
                            ? 'bg-brand-primary text-white shadow-md'
                            : 'bg-slate-50 text-slate-500 hover:bg-slate-100 border border-slate-100'
                          }`}
                      >
                        {tmpl.name}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Message Body */}
        {activeChannel !== 'call' && (
          <div>
            <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1 block ml-1">
              Message Body
            </label>
            <textarea
              value={messageBody}
              onChange={e => setMessageBody(e.target.value)}
              placeholder={activeChannel === 'sms' ? 'Keep SMS messages concise...' : 'Type your message or select a template above...'}
              rows={activeChannel === 'sms' ? 4 : 8}
              className="w-full bg-slate-50 rounded-xl px-4 py-3 text-xs font-medium border border-slate-100 focus:border-brand-primary focus:ring-1 focus:ring-brand-primary/20 outline-none transition-all resize-none leading-relaxed"
            />
            <div className="flex justify-between items-center mt-1">
              <span className="text-[8px] font-bold text-slate-300">
                {messageBody.length} characters
              </span>
              {activeChannel === 'sms' && messageBody.length > 160 && (
                <span className="text-[8px] font-bold text-orange-500">
                  ⚠️ {Math.ceil(messageBody.length / 160)} SMS segments
                </span>
              )}
            </div>
          </div>
        )}

        {/* Call Info for Call Channel */}
        {activeChannel === 'call' && (
          <div className="bg-amber-50 rounded-2xl p-6 border border-amber-100 text-center space-y-3">
            <div className="text-4xl">📞</div>
            <h3 className="text-lg font-black text-slate-800">Quick Dial</h3>
            <p className="text-xs font-bold text-slate-400">
              Click below to initiate a call to {recipientName || 'the client'}
            </p>
            {recipientPhone && (
              <p className="text-2xl font-black text-slate-800 tracking-wide">{recipientPhone}</p>
            )}
          </div>
        )}

        {/* Send Button */}
        <button
          type="button"
          onClick={handleSend}
          disabled={
            (activeChannel === 'call' && !recipientPhone) ||
            (activeChannel === 'email' && (!recipientEmail || !messageBody)) ||
            ((activeChannel === 'whatsapp' || activeChannel === 'sms') && (!recipientPhone || !messageBody))
          }
          className={`w-full font-black py-4 rounded-2xl transition-all text-sm uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg disabled:opacity-40 disabled:cursor-not-allowed
            ${sendStatus === 'sent'
              ? 'bg-emerald-500 text-white'
              : activeChannel === 'whatsapp' ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
              : activeChannel === 'email' ? 'bg-blue-600 hover:bg-blue-700 text-white'
              : activeChannel === 'sms' ? 'bg-violet-600 hover:bg-violet-700 text-white'
              : 'bg-amber-500 hover:bg-amber-600 text-white'
            }`}
        >
          {sendStatus === 'sent' ? (
            <><span>✓</span> Sent Successfully</>
          ) : (
            <>
              <span>{channels.find(c => c.key === activeChannel)?.icon}</span>
              {activeChannel === 'call' ? 'Start Call' : `Send via ${channels.find(c => c.key === activeChannel)?.label}`}
            </>
          )}
        </button>
      </div>
    </div>
  );
}
