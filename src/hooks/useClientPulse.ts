'use client';
import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

export function useClientPulse() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const trackAction = async (action: string, metadata = {}) => {
    try {
      await fetch('/api/monitor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action,
          path: pathname,
          metadata
        })
      });
    } catch (e) {}
  };

  useEffect(() => {
    if (pathname.includes('dashboard')) return;

    let actionName = 'Visiting ' + pathname;
    let metadata = {};

    if (pathname.includes('/flights')) {
      const origin = searchParams.get('origin');
      const destination = searchParams.get('destination');
      if (origin && destination) {
        actionName = `Browsing Flights: ${origin} → ${destination}`;
        metadata = { origin, destination };
      }
    } else if (pathname.includes('/hotels')) {
      const city = searchParams.get('city');
      if (city) {
        actionName = `Searching Hotels in ${city}`;
        metadata = { destination: city };
      }
    }

    trackAction(actionName, metadata);
  }, [pathname, searchParams]);

  return { trackEvent: trackAction };
}
