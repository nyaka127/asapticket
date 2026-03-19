/**
 * Global Airlines List
 * Major world airlines and their regional primary hubs.
 */

export interface Airline {
  name: string;
  code: string;
  country: string;
  hub: string;
}

export const MAJOR_AIRLINES: Airline[] = [
  { name: 'Emirates', code: 'EK', country: 'UAE', hub: 'DXB' },
  { name: 'Qatar Airways', code: 'QR', country: 'Qatar', hub: 'DOH' },
  { name: 'Singapore Airlines', code: 'SQ', country: 'Singapore', hub: 'SIN' },
  { name: 'British Airways', code: 'BA', country: 'UK', hub: 'LHR' },
  { name: 'Kenya Airways', code: 'KQ', country: 'Kenya', hub: 'NBO' },
  { name: 'Ethiopian Airlines', code: 'ET', country: 'Ethiopia', hub: 'ADD' },
  { name: 'Air France', code: 'AF', country: 'France', hub: 'CDG' },
  { name: 'Lufthansa', code: 'LH', country: 'Germany', hub: 'FRA' },
  { name: 'Delta Air Lines', code: 'DL', country: 'USA', hub: 'ATL' },
  { name: 'United Airlines', code: 'UA', country: 'USA', hub: 'ORD' },
  { name: 'American Airlines', code: 'AA', country: 'USA', hub: 'DFW' },
  { name: 'Turkish Airlines', code: 'TK', country: 'Turkey', hub: 'IST' },
  { name: 'Cathay Pacific', code: 'CX', country: 'Hong Kong', hub: 'HKG' },
  { name: 'Korean Air', code: 'KE', country: 'South Korea', hub: 'ICN' },
  { name: 'Japan Airlines', code: 'JL', country: 'Japan', hub: 'HND' },
  { name: 'All Nippon Airways', code: 'NH', country: 'Japan', hub: 'HND' },
  { name: 'Qantas', code: 'QF', country: 'Australia', hub: 'SYD' },
  { name: 'EgyptAir', code: 'MS', country: 'Egypt', hub: 'CAI' },
  { name: 'Royal Air Maroc', code: 'AT', country: 'Morocco', hub: 'CMN' },
  { name: 'South African Airways', code: 'SA', country: 'South Africa', hub: 'JNB' },
  { name: 'Air India', code: 'AI', country: 'India', hub: 'DEL' },
  { name: 'China Southern', code: 'CZ', country: 'China', hub: 'CAN' },
  { name: 'China Eastern', code: 'MU', country: 'China', hub: 'PVG' },
  { name: 'Delta', code: 'DL', country: 'USA', hub: 'ATL' },
  { name: 'Ryanair', code: 'FR', country: 'Ireland', hub: 'DUB' },
  { name: 'EasyJet', code: 'U2', country: 'UK', hub: 'LTN' },
  { name: 'IndiGo', code: '6E', country: 'India', hub: 'DEL' },
  { name: 'VietJet Air', code: 'VJ', country: 'Vietnam', hub: 'SGN' },
  { name: 'WestJet', code: 'WS', country: 'Canada', hub: 'YYC' },
  { name: 'Air Canada', code: 'AC', country: 'Canada', hub: 'YYZ' },
  { name: 'LATAM Airlines', code: 'LA', country: 'Chile', hub: 'SCL' },
  { name: 'Avianca', code: 'AV', country: 'Colombia', hub: 'BOG' },
  { name: 'Copa Airlines', code: 'CM', country: 'Panama', hub: 'PTY' },
  { name: 'Lagos Air', code: 'LOS', country: 'Nigeria', hub: 'LOS' }, // Adding some more local flavor
  { name: 'Air Peace', code: 'P4', country: 'Nigeria', hub: 'LOS' }
];

export function getAirlineByCode(code: string): Airline | undefined {
  return MAJOR_AIRLINES.find(a => a.code === code.toUpperCase());
}
