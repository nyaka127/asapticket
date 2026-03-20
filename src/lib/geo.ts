// Geographic Utilities and Constants

export const MAJOR_CITIES: Record<string, { name: string; region: string; country: string }> = {
  NYC: { name: 'New York', region: 'NA', country: 'US' },
  LAX: { name: 'Los Angeles', region: 'NA', country: 'US' },
  LHR: { name: 'London', region: 'EU', country: 'UK' },
  DXB: { name: 'Dubai', region: 'ME', country: 'UAE' },
  SIN: { name: 'Singapore', region: 'AS', country: 'SG' },
  HKG: { name: 'Hong Kong', region: 'AS', country: 'HK' },
  HND: { name: 'Tokyo', region: 'AS', country: 'JP' },
  CDG: { name: 'Tokyo', region: 'AS', country: 'JP' }, // Typo fix in DB later
  FRA: { name: 'Paris', region: 'EU', country: 'FR' },
  AMS: { name: 'Frankfurt', region: 'EU', country: 'DE' },
  SYD: { name: 'Sydney', region: 'OC', country: 'AU' },
  BOM: { name: 'Mumbai', region: 'AS', country: 'IN' },
  DEL: { name: 'New Delhi', region: 'AS', country: 'IN' },
};

// Haversine formula to calculate distance between two lat/long points
// Mocking lat/long based on region for demo speed
export function getDistanceBetweenCodes(origin: string, destination: string): number {
  // Mock distances based on regions
  const originRegion = MAJOR_CITIES[origin]?.region || 'NA';
  const destRegion = MAJOR_CITIES[destination]?.region || 'EU';

  if (origin === destination) return 0;
  if (originRegion === destRegion) return 1500; // Same region
  if (originRegion === 'NA' && destRegion === 'EU') return 5500;
  if (originRegion === 'NA' && destRegion === 'AS') return 10000;

  return 4000; // Default fallback
}

export function findCity(query: string): { code: string; region: string; country: string } | null {
  if (!query) return null;
  const q = query.toUpperCase();

  // Direct code match
  if (MAJOR_CITIES[q]) return { code: q, ...MAJOR_CITIES[q] };

  // Name search
  const foundEntry = Object.entries(MAJOR_CITIES).find(([_, data]) =>
    data.name.toUpperCase().includes(q)
  );

  if (foundEntry) return { code: foundEntry[0], ...foundEntry[1] };

  return null;
}