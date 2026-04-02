'use client';
import React, { useState, useEffect, useRef } from 'react';
import 'rrweb-player/dist/style.css';

export default function SessionsPage() {
  const [sessions, setSessions] = useState<any[]>([]);
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const playerContainerRef = useRef<HTMLDivElement>(null);
  const playerInstanceRef = useRef<any>(null);

  useEffect(() => {
    fetch('/api/rrweb/replay')
      .then(res => res.json())
      .then(data => {
         setSessions(data || []);
         setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!selectedSessionId) return;
    setEvents([]);
    
    if (playerInstanceRef.current && playerContainerRef.current) {
        playerContainerRef.current.innerHTML = '';
        playerInstanceRef.current = null;
    }

    fetch(`/api/rrweb/replay?sessionId=${selectedSessionId}`)
      .then(res => res.json())
      .then(data => {
        if (data.events && data.events.length >= 2) {
          setEvents(data.events);
        } else {
          alert('Not enough events to replay this session yet. Waiting for client...');
        }
      });
  }, [selectedSessionId]);

  useEffect(() => {
    if (events.length > 1 && playerContainerRef.current && typeof window !== 'undefined') {
        const initPlayer = async () => {
            try {
                // Dynamically import to avoid SSR 'window is not defined' error
                const rrwebPlayerModule = await import('rrweb-player');
                const rrwebPlayer = rrwebPlayerModule.default;
                
                if (playerContainerRef.current) {
                    playerContainerRef.current.innerHTML = ''; 
                    playerInstanceRef.current = new rrwebPlayer({
                        target: playerContainerRef.current,
                        props: {
                            events,
                            autoPlay: true,
                            width: 800,
                            height: 500,
                        },
                    });
                }
            } catch (err) {
                console.error("Failed to load rrweb-player", err);
            }
        };
        initPlayer();
    }
  }, [events]);

  return (
    <div className="p-10 font-sans max-w-7xl mx-auto">
      <div className="flex justify-between items-end mb-12">
        <div>
           <span className="text-[10px] font-black text-brand-primary uppercase tracking-[0.4em] mb-2 block animate-pulse">Live Oversight</span>
           <h1 className="text-4xl font-black text-slate-800 tracking-tighter italic uppercase">Client <span className="text-brand-primary">Screen Records</span></h1>
           <p className="text-slate-400 font-medium mt-2">Watch live pixel-perfect session replays of client browser activity.</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-4 gap-8">
         <div className="lg:col-span-1 bg-white rounded-[2rem] p-6 border border-slate-200 shadow-xl h-[600px] overflow-y-auto">
            <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest mb-6">Active Sessions</h3>
            {loading ? <p className="text-xs text-slate-400">Loading...</p> : (
               <div className="space-y-4">
                  {sessions.length === 0 && <p className="text-xs text-slate-400 italic">No sessions recorded yet.</p>}
                  {sessions.map(s => (
                     <button 
                       key={s.id} 
                       onClick={() => setSelectedSessionId(s.sessionId)}
                       className={`w-full text-left p-4 rounded-xl border transition-all ${selectedSessionId === s.sessionId ? 'bg-brand-primary/10 border-brand-primary text-brand-primary' : 'bg-slate-50 border-slate-100 hover:border-slate-300'}`}
                     >
                        <div className="text-xs font-black truncate">{s.sessionId}</div>
                        <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                           {new Date(s.updatedAt).toLocaleTimeString()}
                        </div>
                     </button>
                  ))}
               </div>
            )}
         </div>

         <div className="lg:col-span-3 bg-slate-900 rounded-[2rem] p-8 border-4 border-slate-800 shadow-2xl flex flex-col items-center justify-center h-[600px] overflow-hidden">
            {!selectedSessionId ? (
               <div className="text-center text-white/30">
                  <div className="text-6xl mb-4 grayscale">🎥</div>
                  <h3 className="text-xl font-black italic uppercase">Select a session</h3>
                  <p className="text-xs font-bold tracking-widest mt-2">to begin live playback.</p>
               </div>
            ) : events.length > 0 ? (
               <div className="w-full flex flex-col items-center">
                  <h3 className="text-white font-black mb-4 flex items-center gap-2">
                     <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                     REPLAYING SESSION: {selectedSessionId}
                  </h3>
                  <div className="bg-slate-800 rounded-xl overflow-hidden shadow-2xl flex justify-center w-[800px] border border-white/10 shrink-0">
                     <div ref={playerContainerRef} className="rrweb-wrapper w-full h-full"></div>
                  </div>
               </div>
            ) : (
               <div className="flex flex-col items-center justify-center text-white/50">
                  <div className="w-8 h-8 border-4 border-white/20 border-t-white rounded-full animate-spin mb-4"></div>
                  <p className="text-xs font-black uppercase tracking-widest">Buffering Session Data...</p>
               </div>
            )}
         </div>
      </div>
    </div>
  );
}
