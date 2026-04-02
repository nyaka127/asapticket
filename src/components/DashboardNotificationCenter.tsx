"use client";

import { useEffect, useState, useRef } from "react";
import { Bell, User, ExternalLink, X } from "lucide-react";

interface Activity {
  id: string;
  action: string;
  source: string;
  timestamp: string;
}

export default function DashboardNotificationCenter() {
  const [notifications, setNotifications] = useState<Activity[]>([]);
  const [showToasts, setShowToasts] = useState<Activity[]>([]);
  const lastCheckedRef = useRef<string>(new Date().toISOString());
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const res = await fetch("/api/monitor");
        if (!res.ok) return;
        
        const data = await res.json();
        const activities: Activity[] = data.activities || [];
        
        // Filter for new visitor activities since our last check
        const newVisitors = activities.filter(a => 
          a.action.includes("Visitor entered") && 
          new Date(a.timestamp) > new Date(lastCheckedRef.current)
        );

        if (newVisitors.length > 0) {
          // Add to toasts (only show the most recent few to avoid flooding)
          setShowToasts(prev => [...newVisitors.slice(0, 3), ...prev].slice(0, 5));
          setUnreadCount(prev => prev + newVisitors.length);
          
          // Play a subtle notification sound if possible? 
          // For now just visual.
          
          // Update last checked to the most recent activity timestamp
          lastCheckedRef.current = new Date().toISOString();
        }
      } catch (err) {
        console.error("Failed to fetch activities:", err);
      }
    };

    // Initial check
    fetchActivities();
    
    // Poll every 10 seconds
    const interval = setInterval(fetchActivities, 10000);
    return () => clearInterval(interval);
  }, []);

  const removeToast = (id: string) => {
    setShowToasts(prev => prev.filter(t => t.id !== id));
  };

  return (
    <>
      {/* Notification Bell Icon for Header */}
      <div className="relative cursor-pointer group" onClick={() => setUnreadCount(0)}>
        <Bell className="w-6 h-6 text-slate-500 group-hover:text-brand-primary transition-colors" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-[10px] text-white flex items-center justify-center font-bold animate-pulse">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </div>

      {/* Floating Toast Area */}
      <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-3 max-w-sm w-full pointer-events-none">
        {showToasts.map((toast) => (
          <div 
            key={toast.id} 
            className="pointer-events-auto bg-white border border-slate-200 rounded-2xl p-4 shadow-2xl flex gap-4 animate-toast-in"
          >
            <div className="w-10 h-10 rounded-full bg-brand-primary/10 flex items-center justify-center shrink-0">
              <User className="w-5 h-5 text-brand-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <p className="text-xs font-bold text-slate-900">New Client Arrival</p>
                <button onClick={() => removeToast(toast.id)} className="text-slate-400 hover:text-slate-600">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <p className="text-xs text-slate-600 truncate">{toast.action}</p>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-[10px] text-slate-400">
                  {new Date(toast.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
                <a href="/dashboard/sessions" className="text-[10px] font-bold text-brand-primary hover:underline flex items-center gap-1">
                  View Session <ExternalLink className="w-2.5 h-2.5" />
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
