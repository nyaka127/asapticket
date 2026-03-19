'use client';
import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

export function useClientPulse() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Only track "Public" actions, not the agent dashboard itself
    if (pathname.includes('dashboard')) return;

    const trackAction = async () => {
      let actionName = 'Visiting ' + pathname;
      let metadata = {};

      if (pathname.includes('/flights')) {
        const origin = searchParams.get('origin');
        const destination = searchParams.get('destination');
        if (origin && destination) {
          actionName = `Searching Flights: ${origin} → ${destination}`;
          metadata = { origin, destination };
        }
      } else if (pathname.includes('/hotels')) {
        const city = searchParams.get('city');
        if (city) {
          actionName = `Searching Hotels in ${city}`;
          metadata = { destination: city };
        }
      }

      try {
        await fetch('/api/monitor', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: actionName,
            path: pathname,
            metadata
          })
        });
      } catch (e) {
        // Silent fail
      }
    };

    trackAction();
  }, [pathname, searchParams]);
}
