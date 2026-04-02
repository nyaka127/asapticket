"use client";
export function TrustedPartners() {
  return (
    <div className="w-full bg-slate-950 border-y border-white/5 py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-brand-primary/5 blur-[120px] pointer-events-none"></div>
      <div className="max-w-7xl mx-auto px-6 flex flex-col items-center relative z-10">
        <div className="flex items-center gap-4 mb-3">
          <span className="text-3xl animate-pulse">🤝</span>
          <h2 className="text-4xl font-black text-white italic uppercase tracking-tighter">Wholesale <span className="text-brand-secondary">GDS</span> Partners</h2>
        </div>
        <p className="text-[11px] font-black text-white/30 uppercase tracking-[0.3em] mb-16 text-center max-w-xl leading-relaxed">Verified Direct Contract Uplinks with Global Distribution Systems & Major Airline Alliances</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 w-full max-w-6xl">
          <div className="bg-white/5 border border-white/10 rounded-[3rem] p-10 flex items-center justify-center min-h-[350px] shadow-2xl hover:bg-white/[0.07] transition-all hover:-translate-y-2 relative group overflow-hidden" onContextMenu={(e) => e.preventDefault()}>
            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-primary/10 blur-[50px] group-hover:bg-brand-primary/20 transition-all"></div>
            <img src="/assets/trusted-partners-1.png" alt="Wholesale Partners Group A" draggable="false" className="max-w-full h-auto max-h-[450px] object-contain invert brightness-200 contrast-125 pointer-events-none select-none relative z-0" />
          </div>
          <div className="bg-white/5 border border-white/10 rounded-[3rem] p-10 flex items-center justify-center min-h-[350px] shadow-2xl hover:bg-white/[0.07] transition-all hover:-translate-y-2 relative group overflow-hidden" onContextMenu={(e) => e.preventDefault()}>
            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-secondary/10 blur-[50px] group-hover:bg-brand-secondary/20 transition-all"></div>
            <img src="/assets/trusted-partners-2.png" alt="Wholesale Partners Group B" draggable="false" className="max-w-full h-auto max-h-[450px] object-contain invert brightness-200 contrast-125 pointer-events-none select-none relative z-0" />
          </div>
        </div>
        
        <div className="mt-16 flex flex-wrap justify-center gap-8 opacity-20 hover:opacity-100 transition-opacity">
           {['AMADEUS', 'SABRE', 'TRAVELPORT', 'SKYTEAM', 'STAR ALLIANCE', 'ONEWORLD'].map(p => (
              <span key={p} className="text-[10px] font-black text-white uppercase tracking-[0.4em]">{p}</span>
           ))}
        </div>
      </div>
    </div>
  );
}
