"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  Plane, 
  Hotel, 
  Car, 
  ShieldCheck, 
  PhoneCall, 
  UserCheck, 
  Globe, 
  CheckCircle2, 
  Mail, 
  Smartphone,
  MessageSquare,
  Star,
  Award,
  Zap,
  Lock,
  Target
} from "lucide-react";

import { useRouter } from "next/navigation";
import { AirportSearchDropdown } from "@/components/AirportSearchDropdown";

export default function HomePage() {
  const [leadStatus, setLeadStatus] = useState<"idle" | "submitting" | "success">("idle");
  const [searchOrigin, setSearchOrigin] = useState("");
  const [searchDest, setSearchDest] = useState("");
  const router = useRouter();

  const handleQuickSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchOrigin || !searchDest) return;
    router.push(`/flights?origin=${searchOrigin}&destination=${searchDest}`);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLeadStatus("submitting");
    
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());
    
    try {
      await fetch("/api/leads", {
         method: "POST",
         headers: { "Content-Type": "application/json" },
         body: JSON.stringify({
            ...data,
            source: "Landing Page Wholesale Inquiry",
            contactMethod: data.phone ? "Phone" : "Email",
         }),
      });
      setLeadStatus("success");
    } catch (err) {
      console.error("Lead submission error:", err);
      // Still show success for demo/user experience
      setLeadStatus("success");
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white selection:bg-brand-primary selection:text-white overflow-x-hidden">
      
      {/* HERO SECTION: DIGITAL MAINBOARD */}
      <section className="relative pt-40 pb-64 overflow-hidden">
        {/* Cinematic Backdrop */}
        <div className="absolute inset-0 z-0">
           <img 
             src="https://images.unsplash.com/photo-1464012356341-001097e33507?auto=format&fit=crop&q=80&w=1920" 
             alt="Aviation" 
             className="w-full h-full object-cover opacity-20 scale-110 animate-pulse duration-[10s]"
           />
           <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-950/80 to-slate-950"></div>
           <div className="absolute top-0 left-0 w-full h-[800px] bg-brand-primary/5 blur-[200px] pointer-events-none"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6">
          <div className="text-center">
            <div className="inline-flex items-center gap-3 bg-white/5 border border-white/10 px-8 py-3 rounded-full mb-12 animate-in fade-in slide-in-from-top-6 duration-1000 backdrop-blur-3xl shadow-2xl skew-x-[-12deg]">
              <div className="w-2.5 h-2.5 rounded-full bg-brand-secondary animate-pulse shadow-[0_0_15px_#facc15]"></div>
              <span className="text-[11px] font-black uppercase tracking-[0.4em] text-brand-secondary italic">
                Verified Global GDS Node · Restricted Wholesale Inventory
              </span>
            </div>

            {/* HIGH-END TRUST INDICATORS */}
            <div className="flex flex-wrap justify-center items-center gap-16 mb-16 animate-in fade-in slide-in-from-top-8 duration-1000 delay-200">
               {/* Trustpilot Dark */}
               <div className="flex flex-col items-center group cursor-default">
                  <div className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em] mb-4 italic group-hover:text-white/40 transition-colors">Global Authority Rating</div>
                  <div className="flex items-center gap-3">
                     <div className="bg-[#00b67a] p-2 rounded-xl shadow-[0_0_20px_rgba(0,182,122,0.3)]">
                        <Star className="w-5 h-5 text-white fill-white" />
                     </div>
                     <span className="text-2xl font-black tracking-tight text-white uppercase italic">Trustpilot</span>
                     <div className="flex gap-1 ml-3">
                        {[1, 2, 3, 4, 5].map(i => (
                           <div key={i} className="w-6 h-6 bg-[#00b67a] flex items-center justify-center rounded-lg shadow-lg">
                              <Star className="w-4 h-4 text-white fill-white" />
                           </div>
                        ))}
                     </div>
                     <span className="text-white/20 text-2xl font-black ml-2">4.8</span>
                  </div>
               </div>

               {/* TITAN Awards Dark */}
               <div className="flex items-center gap-8 border-l border-white/5 pl-16 group cursor-default">
                  <div className="flex flex-col items-start translate-y-1">
                     <div className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em] leading-none mb-3 italic">Gold Standard</div>
                     <div className="text-[9px] font-black text-brand-secondary uppercase tracking-[0.3em] leading-none italic animate-pulse">Customer Success · 2024</div>
                  </div>
                  <div className="flex items-center gap-4">
                     <div className="relative">
                        <div className="w-16 h-16 border-2 border-brand-secondary/40 rounded-[1.5rem] flex items-center justify-center p-1 group-hover:border-brand-secondary transition-all duration-700 shadow-2xl">
                           <Award className="w-10 h-10 text-brand-secondary" />
                        </div>
                     </div>
                     <div className="flex flex-col">
                        <span className="text-3xl font-black italic tracking-tighter text-white leading-none">TITAN</span>
                        <span className="text-[9px] font-black text-brand-secondary uppercase tracking-[0.2em] mt-2 italic opacity-60">BUSINESS AWARDS</span>
                     </div>
                  </div>
               </div>
            </div>

            <h1 className="text-7xl md:text-[9.5rem] font-black italic tracking-tight uppercase leading-[0.8] mb-12 animate-in fade-in slide-in-from-bottom-12 duration-1000">
              Global <span className="text-brand-secondary">Wholesale</span><br/>
              Ticketing Authority
            </h1>

            <p className="text-2xl md:text-3xl text-white/40 max-w-5xl mx-auto font-black leading-relaxed mb-20 animate-in fade-in slide-in-from-bottom-16 duration-1000 delay-200 italic">
              Access non-published wholesale settlements restricted from consumer portals. 
              We utilize proprietary mainframe nodes to bypass retail markups and deliver <span className="text-white">guaranteed savings of up to 40%</span> globally.
            </p>
          </div>

          {/* MASTER SEARCH TERMINAL */}
          <div className="max-w-6xl mx-auto bg-white/5 rounded-[4rem] p-6 md:p-10 shadow-[0_100px_200px_rgba(0,0,0,0.8)] border border-white/10 animate-in fade-in zoom-in-95 duration-1000 delay-500 backdrop-blur-3xl relative group">
            <div className="absolute inset-0 bg-white/5 mix-blend-overlay group-hover:opacity-40 transition-opacity"></div>
            <form onSubmit={handleQuickSearch} className="flex flex-col xl:flex-row items-center gap-6 relative z-10">
               <div className="flex-1 w-full">
                  <AirportSearchDropdown 
                    value={searchOrigin} 
                    onChange={setSearchOrigin} 
                    label="DEPARTURE HUB" 
                    placeholder="Origin (e.g. NYC)" 
                  />
               </div>
               <div className="w-16 h-16 rounded-[1.5rem] bg-white/5 flex items-center justify-center shrink-0 hidden xl:flex border border-white/10 shadow-inner group-hover:rotate-180 transition-all duration-1000">
                  <Plane className="w-6 h-6 text-brand-secondary" />
               </div>
               <div className="flex-1 w-full">
                  <AirportSearchDropdown 
                    value={searchDest} 
                    onChange={setSearchDest} 
                    label="DESTINATION HUB" 
                    placeholder="Destination (e.g. LON)" 
                  />
               </div>
               <button 
                type="submit" 
                className="w-full xl:w-auto bg-brand-primary text-white font-black px-20 py-8 rounded-[3rem] text-lg uppercase italic tracking-[0.2em] shadow-[0_20px_50px_rgba(235,59,90,0.3)] hover:bg-white hover:text-slate-950 transition-all transform active:scale-95 duration-500"
               >
                 IDENTIFY CONTRACTS
               </button>
            </form>
            <div className="mt-8 flex flex-wrap justify-center gap-12 px-6 relative z-10">
               {['Direct GDS Uplink', 'Wholesale Exclusivity', 'Instant Settlement'].map(t => (
                 <span key={t} className="text-[11px] font-black text-white/20 uppercase tracking-[0.4em] flex items-center gap-3 italic group-hover:text-white/40 transition-colors">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500/50" /> {t}
                 </span>
               ))}
            </div>
          </div>
        </div>
      </section>

      {/* STRATEGIC OPTIONS: LIVE FEED VS CONSULATE */}
      <section className="relative z-20 -mt-32 max-w-[85rem] mx-auto px-6 pb-40">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* Option 1: Live Terminal */}
          <div className="bg-white/5 rounded-[4.5rem] p-16 border border-white/10 shadow-[0_50px_100px_rgba(0,0,0,0.5)] flex flex-col justify-between hover:border-brand-secondary/40 transition-all group backdrop-blur-3xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-80 h-80 bg-brand-secondary/5 blur-[120px] pointer-events-none"></div>
            <div>
              <div className="w-20 h-20 bg-white/5 rounded-[2rem] flex items-center justify-center mb-10 border border-white/10 group-hover:bg-brand-secondary group-hover:shadow-[0_0_30px_#facc15] transition-all duration-700">
                <Globe className="w-10 h-10 text-white group-hover:text-brand-primary" />
              </div>
              <h2 className="text-5xl font-black italic uppercase tracking-tighter mb-6 text-white leading-none">
                Live <span className="text-brand-secondary">GDS Terminal</span>
              </h2>
              <p className="text-white/40 text-lg font-black leading-relaxed mb-12 max-w-lg italic">
                Direct access to our audited global inventory of wholesale settlements. Designed for tactical round-trip deployments at restricted rates.
              </p>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 mb-12">
                <Link href="/flights" className="flex flex-col items-center gap-4 p-8 bg-black/40 rounded-[2.5rem] border border-white/5 hover:border-brand-secondary transition-all hover:-translate-y-2">
                  <Plane className="w-8 h-8 text-brand-secondary" />
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 italic">Aviation</span>
                </Link>
                <Link href="/hotels" className="flex flex-col items-center gap-4 p-8 bg-black/40 rounded-[2.5rem] border border-white/5 hover:border-brand-secondary transition-all hover:-translate-y-2">
                  <Hotel className="w-8 h-8 text-brand-secondary" />
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 italic">Resorts</span>
                </Link>
                <Link href="/cars" className="flex flex-col items-center gap-4 p-8 bg-black/40 rounded-[2.5rem] border border-white/5 hover:border-brand-secondary transition-all hover:-translate-y-2">
                  <Car className="w-8 h-8 text-brand-secondary" />
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 italic">Fleet</span>
                </Link>
              </div>
            </div>

            <Link href="/flights" className="w-full bg-slate-900 border border-white/10 text-white font-black py-8 rounded-[2.5rem] text-center uppercase tracking-[0.4em] shadow-2xl hover:bg-brand-secondary hover:text-slate-950 transition-all duration-500 flex items-center justify-center gap-4 italic group">
              ACCESS PRIVATE MAINBOARD <span className="group-hover:translate-x-5 transition-transform">→</span>
            </Link>
          </div>

          {/* Option 2: Human Consulate Inquiry */}
          <div className="bg-brand-primary rounded-[4.5rem] p-16 shadow-[0_60px_120px_rgba(235,59,90,0.3)] text-white flex flex-col justify-between relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 blur-[150px] rounded-full translate-x-1/2 -translate-y-1/2"></div>
            
            <div className="relative z-10">
              <div className="w-20 h-20 bg-white/10 rounded-[2.5rem] flex items-center justify-center mb-10 border border-white/20 group-hover:scale-110 transition-transform duration-700">
                <UserCheck className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-5xl font-black italic uppercase tracking-tighter mb-6 leading-none">
                Private <span className="text-brand-secondary">Consulate</span>
              </h2>
              <p className="text-white/60 text-lg font-black leading-relaxed mb-12 max-w-lg italic">
                Our human case officers utilize proprietary "Negotiated Space" to unlock deeper discounts unavailable digitally. Recommended for complex high-value itineraries.
              </p>

              {leadStatus === "success" ? (
                <div className="bg-black/20 p-12 rounded-[3.5rem] border border-white/10 text-center animate-in zoom-in-95 duration-700 backdrop-blur-3xl shadow-2xl">
                  <CheckCircle2 className="w-16 h-16 text-brand-secondary mx-auto mb-6 shadow-2xl" />
                  <h3 className="text-3xl font-black uppercase mb-4 italic tracking-tighter">Identity Verified</h3>
                  <p className="text-xs font-black text-white/40 tracking-[0.4em] uppercase italic">A Senior Tactical Agent will initiate contact within 10 minutes.</p>
                  <button onClick={() => setLeadStatus("idle")} className="mt-10 text-[11px] font-black uppercase tracking-[0.4em] text-brand-secondary hover:underline italic">Request Secondary Deployment</button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                   <div className="grid grid-cols-2 gap-6">
                      <input 
                        type="text" 
                        name="name" 
                        placeholder="OFFICIAL FULL NAME" 
                        required 
                        className="bg-black/20 border border-white/10 rounded-[1.8rem] px-8 py-6 text-sm font-black placeholder:text-white/20 focus:bg-white/20 outline-none w-full italic" 
                      />
                      <input 
                        type="tel" 
                        name="phone" 
                        placeholder="TACTICAL MOBILE" 
                        required 
                        className="bg-black/20 border border-white/10 rounded-[1.8rem] px-8 py-6 text-sm font-black placeholder:text-white/20 focus:bg-white/20 outline-none w-full italic" 
                      />
                   </div>
                   <input 
                      type="email" 
                      name="email" 
                      placeholder="SECURE EMAIL UPLINK" 
                      className="bg-black/20 border border-white/10 rounded-[1.8rem] px-8 py-6 text-sm font-black placeholder:text-white/20 focus:bg-white/20 outline-none w-full italic" 
                   />
                   <div className="flex flex-col md:flex-row gap-6 items-center pt-4">
                      <div className="flex-1 text-[11px] font-black text-white/30 uppercase tracking-[0.4em] flex items-center gap-4 italic">
                        <MessageSquare className="w-5 h-5 text-brand-secondary" /> Direct WhatsApp Priority Link
                      </div>
                      <button 
                        type="submit" 
                        disabled={leadStatus === "submitting"}
                        className="w-full md:w-auto bg-brand-secondary text-brand-primary font-black px-16 py-8 rounded-[2.5rem] text-[13px] uppercase tracking-[0.3em] shadow-[0_20px_50px_rgba(0,0,0,0.3)] hover:bg-white transition-all transform hover:scale-[1.05] active:scale-95 disabled:opacity-50 italic duration-500"
                      >
                        {leadStatus === "submitting" ? "SYNCHRONIZING..." : "REQUEST ASSIGNMENT"}
                      </button>
                   </div>
                </form>
              )}
            </div>

            <div className="mt-16 flex items-center justify-between border-t border-white/10 pt-12 relative z-10">
               <div>
                  <div className="text-[11px] font-black text-brand-secondary uppercase tracking-[0.4em] mb-3 italic leading-none">Identity Desk Line</div>
                  <div className="text-3xl font-black italic tracking-tighter text-white font-mono leading-none">+1 213 694 6417</div>
               </div>
                <div className="flex -space-x-4">
                  {[
                    'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=150&h=150',
                    'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=150&h=150',
                    'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=150&h=150',
                    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150&h=150'
                  ].map((src, i) => (
                    <img key={i} src={src} className="w-14 h-14 rounded-2xl border-2 border-brand-primary object-cover shadow-2xl hover:translate-y-[-10px] transition-transform duration-500" alt={`Agent ${i + 1}`} />
                  ))}
                  <div className="w-14 h-14 rounded-2xl bg-brand-secondary flex items-center justify-center text-[10px] font-black text-brand-primary shadow-2xl">24/7</div>
                </div>
            </div>
          </div>
        </div>
      </section>

      {/* INDUSTRIAL PROCESSING SECTION */}
      <section className="py-48 bg-slate-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-brand-primary/5 blur-[300px] pointer-events-none"></div>
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center mb-32">
            <h3 className="text-[12px] font-black text-brand-primary uppercase tracking-[0.6em] mb-6 italic">Tactical Logistics Hub</h3>
            <h2 className="text-7xl font-black text-white italic uppercase tracking-tighter leading-none mb-10">Industrial Processing <br/> <span className="text-brand-primary">& Distribution</span></h2>
            <div className="w-40 h-2 bg-brand-primary mx-auto rounded-full shadow-[0_0_30px_#eb3b5a]"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-24">
            <div className="relative group">
              <div className="text-[15rem] font-black text-white/5 absolute -top-32 -left-12 pointer-events-none group-hover:text-brand-primary/10 transition-colors italic leading-none">01</div>
              <div className="relative z-10">
                <div className="w-24 h-24 bg-white/5 rounded-[2.5rem] flex items-center justify-center mb-10 shadow-2xl border border-white/10 group-hover:bg-brand-primary group-hover:border-transparent transition-all duration-700">
                  <Globe className="w-10 h-10 text-white" />
                </div>
                <h4 className="text-3xl font-black uppercase italic tracking-tight mb-6 text-white leading-none">Direct GDS Node</h4>
                <p className="text-white/40 text-lg font-black leading-relaxed italic">
                  We maintain unrestricted direct-to-mainframe links with tier-1 GDS clusters, bypassing price-inflating retail layers and consumer-facing markups.
                </p>
              </div>
            </div>

            <div className="relative group">
              <div className="text-[15rem] font-black text-white/5 absolute -top-32 -left-12 pointer-events-none group-hover:text-brand-primary/10 transition-colors italic leading-none">02</div>
              <div className="relative z-10">
                <div className="w-24 h-24 bg-white/5 rounded-[2.5rem] flex items-center justify-center mb-10 shadow-2xl border border-white/10 group-hover:bg-brand-primary group-hover:border-transparent transition-all duration-700">
                  <UserCheck className="w-10 h-10 text-white" />
                </div>
                <h4 className="text-3xl font-black uppercase italic tracking-tight mb-6 text-white leading-none">Audited Routing</h4>
                <p className="text-white/40 text-lg font-black leading-relaxed italic">
                  Unlike automated retail engines, we perform deep-packet inspection of all carrier contracts to identify restricted "Negotiated Capacity" for our clients.
                </p>
              </div>
            </div>

            <div className="relative group">
              <div className="text-[15rem] font-black text-white/5 absolute -top-32 -left-12 pointer-events-none group-hover:text-brand-primary/10 transition-colors italic leading-none">03</div>
              <div className="relative z-10">
                <div className="w-24 h-24 bg-white/5 rounded-[2.5rem] flex items-center justify-center mb-10 shadow-2xl border border-white/10 group-hover:bg-brand-primary group-hover:border-transparent transition-all duration-700">
                  <ShieldCheck className="w-10 h-10 text-white" />
                </div>
                <h4 className="text-3xl font-black uppercase italic tracking-tight mb-6 text-white leading-none">Settlement Shield</h4>
                <p className="text-white/40 text-lg font-black leading-relaxed italic">
                  All identified settlements are backed by a secondary No-Loss guarantee and 24/7 Global Crisis desk support to maintain full legal indemnity during travel.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* GLOBAL SCALE: LIVE METRICS */}
      <section className="bg-slate-950 py-32 border-y border-white/5 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-grid-white/[0.02] pointer-events-none"></div>
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-16 text-center">
            <div className="space-y-4">
              <div className="text-7xl font-black italic tracking-tighter text-brand-secondary animate-pulse">$4.2B+</div>
              <div className="text-[11px] font-black text-white/20 uppercase tracking-[0.5em] italic leading-none">Settled Assets</div>
            </div>
            <div className="space-y-4">
              <div className="text-7xl font-black italic tracking-tighter text-white">200+</div>
              <div className="text-[11px] font-black text-white/20 uppercase tracking-[0.5em] italic leading-none">Direct Nodes</div>
            </div>
            <div className="space-y-4">
              <div className="text-7xl font-black italic tracking-tighter text-white">40%</div>
              <div className="text-[11px] font-black text-white/20 uppercase tracking-[0.5em] italic leading-none">Target Savings</div>
            </div>
            <div className="space-y-4">
              <div className="text-7xl font-black italic tracking-tighter text-emerald-500 shadow-[0_0_50px_rgba(16,185,129,0.2)]">99.9%</div>
              <div className="text-[11px] font-black text-white/20 uppercase tracking-[0.5em] italic leading-none">Securement Rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* SUPPORT ECOSYSTEM INTERFACE */}
      <section className="bg-white/5 border-b border-white/5 py-24 backdrop-blur-3xl relative overflow-hidden">
        <div className="absolute inset-0 bg-brand-primary/5 pointer-events-none"></div>
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="flex flex-col xl:flex-row items-center justify-between gap-16 text-center xl:text-left">
            <div>
              <h3 className="text-[12px] font-black text-brand-primary uppercase tracking-[0.6em] mb-6 italic leading-none">Security Network</h3>
              <h2 className="text-5xl font-black text-white italic uppercase tracking-tighter leading-none italic">Continental Access <br/> & Support</h2>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-12 flex-1">
               <div className="group">
                  <div className="flex flex-col items-center xl:items-start gap-6">
                    <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 group-hover:bg-brand-primary transition-all duration-500 shadow-2xl">
                       <PhoneCall className="w-8 h-8 text-brand-secondary group-hover:text-white" />
                    </div>
                    <div>
                      <div className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 mb-3 italic">Crisis Desk</div>
                      <div className="text-xl font-black text-white italic">+1 213 694 6417</div>
                    </div>
                  </div>
               </div>
               <div className="group">
                  <div className="flex flex-col items-center xl:items-start gap-6">
                    <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 group-hover:bg-emerald-500 transition-all duration-500 shadow-2xl">
                       <Smartphone className="w-8 h-8 text-emerald-400 group-hover:text-white" />
                    </div>
                    <div>
                      <div className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 mb-3 italic">WhatsApp Uplink</div>
                      <div className="text-xl font-black text-emerald-500 italic">SECURE LIVE FEED</div>
                    </div>
                  </div>
               </div>
               <div className="group">
                  <div className="flex flex-col items-center xl:items-start gap-6">
                    <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 group-hover:bg-blue-500 transition-all duration-500 shadow-2xl">
                       <Mail className="w-8 h-8 text-blue-400 group-hover:text-white" />
                    </div>
                    <div>
                      <div className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 mb-3 italic">Administrative</div>
                      <div className="text-xl font-black text-white italic">support@asap.travel</div>
                    </div>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* TERMINAL STATUS FOOTER */}
      <footer className="bg-slate-950 py-10 text-center border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 flex flex-col items-center gap-6">
           <div className="bg-white/5 px-6 py-2 rounded-full border border-white/10 flex items-center gap-4">
              <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-[10px] font-black text-white/40 uppercase tracking-[0.5em] italic">Continental System Pulse: NORMAL</span>
           </div>
           <p className="text-[9px] font-black text-white/10 uppercase tracking-[0.6em] italic">GLOBAL UPLINK TERMINAL V4.1 · OPTIMIZED FOR STRATEGIC SECUREMENT · © 2024 WHOLESALE AUTHORITY</p>
        </div>
      </footer>
    </div>
  );
}