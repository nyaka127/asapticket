"use client";

import { useEffect, useState } from "react";

export default function PresenceGate({ children }: { children: React.ReactNode }) {
  const [isFull, setIsFull] = useState(false);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    let eventSource: EventSource | null = null;
    let retryTimeout: NodeJS.Timeout;

    function connect() {
      eventSource = new EventSource("/api/presence");

      eventSource.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.status === "full") {
            setIsFull(true);
            setIsConnected(false);
            eventSource?.close();
            // Retry manually since we closed it
            retryTimeout = setTimeout(connect, 5000);
          } else if (data.status === "connected") {
            setIsFull(false);
            setIsConnected(true);
          }
        } catch (err) {
          console.error("Presence message error", err);
        }
      };

      eventSource.onerror = () => {
        // Native reconnection happens automatically, no need to manually close unless we want to control timing.
        setIsConnected(false);
      };
    }

    connect();

    return () => {
      clearTimeout(retryTimeout);
      if (eventSource) {
        eventSource.close();
      }
    };
  }, []);

  return (
    <>
      {isFull && (
        <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-black/90 text-white p-4 text-center">
          <div className="bg-white/10 p-8 rounded-2xl backdrop-blur-md max-w-md w-full border border-white/20 shadow-2xl">
            <h2 className="text-2xl tracking-tight font-bold mb-4 text-white">Website is at Maximum Capacity</h2>
            <p className="text-white/80 mb-6">
              There are currently 100 people viewing the website. To ensure optimal performance and security, please wait until someone closes their tab.
            </p>
            <div className="flex items-center justify-center gap-3">
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              <span className="text-white font-medium">Auto-retrying...</span>
            </div>
            {!isConnected && <p className="text-xs text-white/40 mt-6 mt-4">Status: Waiting for available slot</p>}
          </div>
        </div>
      )}
      <div className={isFull ? "pointer-events-none blur-sm opacity-50 transition-all duration-300" : "transition-all duration-300"}>
        {children}
      </div>
    </>
  );
}
