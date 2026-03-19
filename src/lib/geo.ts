/**
 * Geographic Information and Utilities
 * Provides coordinates for major world cities and distance calculation via Haversine formula.
 */

export interface City {
  name: string;
  code: string;
  lat: number;
  lon: number;
  country: string;
  region: 'NAM' | 'EUR' | 'AFR' | 'ASIA' | 'OCE' | 'LATAM' | 'MEA';
}

export const MAJOR_CITIES: Record<string, City> = {
  // --- NORTH AMERICA (NAM) ---
  'JFK': { name: 'New York', code: 'JFK', lat: 40.6413, lon: -73.7781, country: 'USA', region: 'NAM' },
  'ATL': { name: 'Atlanta', code: 'ATL', lat: 33.6407, lon: -84.4277, country: 'USA', region: 'NAM' },
  'ORD': { name: 'Chicago', code: 'ORD', lat: 41.9742, lon: -87.9073, country: 'USA', region: 'NAM' },
  'LAX': { name: 'Los Angeles', code: 'LAX', lat: 33.9416, lon: -118.4085, country: 'USA', region: 'NAM' },
  'YYZ': { name: 'Toronto', code: 'YYZ', lat: 43.6777, lon: -79.6248, country: 'Canada', region: 'NAM' },
  'YYC': { name: 'Calgary', code: 'YYC', lat: 51.1139, lon: -114.0076, country: 'Canada', region: 'NAM' },

  // --- EUROPE (EUR) ---
  'LHR': { name: 'London Heathrow', code: 'LHR', lat: 51.4700, lon: -0.4543, country: 'UK', region: 'EUR' },
  'CDG': { name: 'Paris CDG', code: 'CDG', lat: 49.0097, lon: 2.5479, country: 'France', region: 'EUR' },
  'FRA': { name: 'Frankfurt', code: 'FRA', lat: 50.0379, lon: 8.5622, country: 'Germany', region: 'EUR' },
  'AMS': { name: 'Amsterdam', code: 'AMS', lat: 52.3105, lon: 4.7683, country: 'Netherlands', region: 'EUR' },
  'FCO': { name: 'Rome', code: 'FCO', lat: 41.8003, lon: 12.2389, country: 'Italy', region: 'EUR' },
  'MAD': { name: 'Madrid', code: 'MAD', lat: 40.4839, lon: -3.5670, country: 'Spain', region: 'EUR' },
  'DUB': { name: 'Dublin', code: 'DUB', lat: 53.4213, lon: -6.2701, country: 'Ireland', region: 'EUR' },

  // --- AFRICA (AFR) ---
  'EBB': { name: 'Entebbe/Kampala', code: 'EBB', lat: 0.0424, lon: 32.4435, country: 'Uganda', region: 'AFR' },
  'NBO': { name: 'Nairobi', code: 'NBO', lat: -1.3192, lon: 36.9275, country: 'Kenya', region: 'AFR' },
  'LOS': { name: 'Lagos', code: 'LOS', lat: 6.5774, lon: 3.3210, country: 'Nigeria', region: 'AFR' },
  'ADD': { name: 'Addis Ababa', code: 'ADD', lat: 8.9778, lon: 38.7993, country: 'Ethiopia', region: 'AFR' },
  'JNB': { name: 'Johannesburg', code: 'JNB', lat: -26.1392, lon: 28.2460, country: 'South Africa', region: 'AFR' },
  'ACC': { name: 'Accra', code: 'ACC', lat: 5.6051, lon: -0.1667, country: 'Ghana', region: 'AFR' },
  'DKR': { name: 'Dakar', code: 'DKR', lat: 14.7397, lon: -17.4902, country: 'Senegal', region: 'AFR' },
  'KGL': { name: 'Kigali', code: 'KGL', lat: -1.9630, lon: 30.1350, country: 'Rwanda', region: 'AFR' },

  // --- MIDDLE EAST & NORTH AFRICA (MEA) ---
  'DXB': { name: 'Dubai', code: 'DXB', lat: 25.2532, lon: 55.3657, country: 'UAE', region: 'MEA' },
  'DOH': { name: 'Doha', code: 'DOH', lat: 25.2731, lon: 51.6081, country: 'Qatar', region: 'MEA' },
  'IST': { name: 'Istanbul', code: 'IST', lat: 41.2753, lon: 28.7519, country: 'Turkey', region: 'MEA' },
  'CAI': { name: 'Cairo', code: 'CAI', lat: 30.1219, lon: 31.4056, country: 'Egypt', region: 'MEA' },
  'AMM': { name: 'Amman', code: 'AMM', lat: 31.7225, lon: 35.9932, country: 'Jordan', region: 'MEA' },
  'RUH': { name: 'Riyadh', code: 'RUH', lat: 24.9576, lon: 46.6988, country: 'Saudi Arabia', region: 'MEA' },

  // --- ASIA (ASIA) ---
  'SIN': { name: 'Singapore', code: 'SIN', lat: 1.3502, lon: 103.9893, country: 'Singapore', region: 'ASIA' },
  'HND': { name: 'Tokyo Haneda', code: 'HND', lat: 35.5494, lon: 139.7798, country: 'Japan', region: 'ASIA' },
  'BKK': { name: 'Bangkok', code: 'BKK', lat: 13.6900, lon: 100.7501, country: 'Thailand', region: 'ASIA' },
  'DEL': { name: 'Delhi', code: 'DEL', lat: 28.5562, lon: 77.1000, country: 'India', region: 'ASIA' },
  'HKG': { name: 'Hong Kong', code: 'HKG', lat: 22.3080, lon: 113.9185, country: 'Hong Kong', region: 'ASIA' },
  'ICN': { name: 'Seoul', code: 'ICN', lat: 37.4602, lon: 126.4407, country: 'South Korea', region: 'ASIA' },
  'MNL': { name: 'Manila', code: 'MNL', lat: 14.5083, lon: 121.0194, country: 'Philippines', region: 'ASIA' },
  'PVG': { name: 'Shanghai', code: 'PVG', lat: 31.1443, lon: 121.8083, country: 'China', region: 'ASIA' },

  // --- OCEANIA (OCE) ---
  'SYD': { name: 'Sydney', code: 'SYD', lat: -33.9399, lon: 151.1753, country: 'Australia', region: 'OCE' },
  'MEL': { name: 'Melbourne', code: 'MEL', lat: -37.6690, lon: 144.8410, country: 'Australia', region: 'OCE' },
  'AKL': { name: 'Auckland', code: 'AKL', lat: -37.0081, lon: 174.7917, country: 'New Zealand', region: 'OCE' },

  // --- LATIN AMERICA (LATAM) ---
  'GRU': { name: 'Sao Paulo', code: 'GRU', lat: -23.4356, lon: -46.4731, country: 'Brazil', region: 'LATAM' },
  'MEX': { name: 'Mexico City', code: 'MEX', lat: 19.4361, lon: -99.0719, country: 'Mexico', region: 'LATAM' },
  'BOG': { name: 'Bogota', code: 'BOG', lat: 4.7016, lon: -74.1469, country: 'Colombia', region: 'LATAM' },
  'SCL': { name: 'Santiago', code: 'SCL', lat: -33.3930, lon: -70.7858, country: 'Chile', region: 'LATAM' },
  'EZE': { name: 'Buenos Aires', code: 'EZE', lat: -34.8222, lon: -58.5358, country: 'Argentina', region: 'LATAM' },
};

/**
 * Calculates the great-circle distance between two points (Haversine formula).
 * @returns Distance in kilometers
 */
export function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export function getCityByCode(code: string): City | undefined {
  return MAJOR_CITIES[code.toUpperCase()];
}

export function getDistanceBetweenCodes(code1: string, code2: string): number {
  const city1 = getCityByCode(code1);
  const city2 = getCityByCode(code2);
  
  const getFallback = (code: string) => {
    let hash = 0;
    const cleanCode = code.toUpperCase().trim();
    for (let i = 0; i < cleanCode.length; i++) hash = cleanCode.charCodeAt(i) + ((hash << 5) - hash);
    return {
      lat: (Math.abs(hash % 18000) / 100) - 90,
      lon: (Math.abs((hash * 31) % 36000) / 100) - 180
    };
  };

  const c1 = city1 || getFallback(code1);
  const c2 = city2 || getFallback(code2);
  
  return calculateDistance(c1.lat, c1.lon, c2.lat, c2.lon);
}
