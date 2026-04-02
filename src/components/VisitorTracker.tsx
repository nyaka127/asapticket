"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

/**
 * VisitorTracker component reports client visits to the activity monitor.
 * It only tracks visits to public pages (any path not starting with /dashboard).
 */
export default function VisitorTracker() {
  const pathname = usePathname();
  const trackedPages = useRef<Set<string>>(new Set());

  useEffect(() => {
    // We only care about public pages, not dashboard or api routes
    const isPublicPage = !pathname.startsWith("/dashboard") && !pathname.startsWith("/api");
    
    // We only report the visit once per page per session to avoid spamming
    if (isPublicPage && !trackedPages.current.has(pathname)) {
      trackedPages.current.add(pathname);
      
      const reportVisit = async () => {
        try {
          // Fetch IP/Country info if possible (optional)
          // For now, just report the visit
          await fetch("/api/monitor", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              action: `Visitor entered page: ${pathname}`,
              source: "Public Website",
            }),
          });
          
          console.log(`[VisitorTracker] Reported visit to ${pathname}`);
        } catch (err) {
          console.error("[VisitorTracker] Error reporting visit:", err);
        }
      };

      // Delay reporting slightly to ensure it's not a quick bounce/refresh
      const timer = setTimeout(reportVisit, 2000);
      return () => clearTimeout(timer);
    }
  }, [pathname]);

  return null; // This component doesn't render anything
}
