import { ALL_AIRPORTS } from './airports';

export const MAJOR_CITIES: Record<string, { name: string; airport: string; region: string; country: string }> = {
  NYC: { name: 'New York', airport: 'John F. Kennedy Intl', region: 'NA', country: 'US' },
  JFK: { name: 'New York', airport: 'John F. Kennedy Intl', region: 'NA', country: 'US' },
  EWR: { name: 'Newark', airport: 'Liberty Intl', region: 'NA', country: 'US' },
  LAX: { name: 'Los Angeles', airport: 'Los Angeles Intl', region: 'NA', country: 'US' },
  LHR: { name: 'London', airport: 'Heathrow Airport', region: 'EU', country: 'UK' },
  DXB: { name: 'Dubai', airport: 'Dubai International', region: 'ME', country: 'UAE' },
  SIN: { name: 'Singapore', airport: 'Changi Airport', region: 'AS', country: 'SG' },
  NBO: { name: 'Nairobi', airport: 'Jomo Kenyatta Intl', region: 'AF', country: 'KE' },
  SYD: { name: 'Sydney', airport: 'Kingsford Smith', region: 'OC', country: 'AU' },
  GRU: { name: 'São Paulo', airport: 'Guarulhos Intl', region: 'SA', country: 'BR' },
};

function getExtendedAirport(code: string) {
  const codeUpper = code.toUpperCase();
  if (MAJOR_CITIES[codeUpper]) return MAJOR_CITIES[codeUpper];
  
  const found = ALL_AIRPORTS.find(a => a.iata === codeUpper);
  if (!found) return null;

  // Infer region from country code or context (simple mapping)
  let region = 'NA';
  const cc = found.countryCode;
  
  const afCodes = ['KE', 'NG', 'ZA', 'UG', 'TZ', 'ET', 'RW', 'CI', 'GH', 'EG', 'SN', 'MA', 'DZ', 'TN', 'LY', 'SD', 'SO', 'DJ', 'ER', 'CM', 'GA', 'CG', 'CD', 'AO', 'NA', 'BW', 'ZW', 'MZ', 'MW', 'ZM', 'LS', 'SZ', 'MG', 'MU', 'SC', 'KM', 'ST', 'CV', 'GW', 'SL', 'LR', 'GN', 'ML', 'BF', 'NE', 'TD', 'CF', 'SS', 'GM', 'TG', 'BJ', 'LY', 'EH'];
  const asCodes = ['JP', 'CN', 'KR', 'SG', 'HK', 'IN', 'TH', 'MY', 'ID', 'PH', 'VN', 'PK', 'BD', 'LK', 'NP', 'MM', 'KH', 'LA', 'TW', 'MN', 'KP'];
  const euCodes = ['UK', 'GB', 'FR', 'DE', 'NL', 'TR', 'ES', 'IT', 'CH', 'PT', 'PL', 'FI', 'AT', 'IE', 'GR', 'SE', 'NO', 'DK', 'BE', 'CZ', 'UA', 'RU', 'HU', 'RO', 'BG', 'HR', 'SI', 'SK', 'EE', 'LV', 'LT', 'IS'];
  const meCodes = ['AE', 'QA', 'SA', 'JO', 'IL', 'LB', 'SY', 'IQ', 'KW', 'OM', 'YE', 'BH'];
  const ocCodes = ['AU', 'NZ', 'FJ', 'PG', 'VU', 'SB', 'NC', 'PF', 'GU'];
  const saCodes = ['BR', 'AR', 'CO', 'CL', 'PE', 'VE', 'EC', 'BO', 'PY', 'UY', 'GY', 'SR'];

  if (afCodes.includes(cc)) region = 'AF';
  else if (asCodes.includes(cc)) region = 'AS';
  else if (euCodes.includes(cc)) region = 'EU';
  else if (meCodes.includes(cc)) region = 'ME';
  else if (ocCodes.includes(cc)) region = 'OC';
  else if (saCodes.includes(cc)) region = 'SA';

  return { name: found.city, airport: found.name, region, country: found.country };
}

export function getFullAirportName(code: string): string {
  const hub = getExtendedAirport(code);
  if (!hub) return code.toUpperCase();
  return `${hub.name}, ${hub.country}`;
}

export function getDistanceBetweenCodes(origin: string, destination: string): number {
  const start = getExtendedAirport(origin);
  const end = getExtendedAirport(destination);
  
  if (!start || !end) return 4000;
  if (origin.toUpperCase() === destination.toUpperCase()) return 0;

  const originRegion = start.region;
  const destRegion = end.region;

  // Specific Transcon Case (US Coast to Coast)
  if ((origin === 'LAX' && (destination === 'JFK' || destination === 'EWR' || destination === 'PHL' || destination === 'BOS')) ||
      ((origin === 'JFK' || origin === 'EWR' || origin === 'PHL' || origin === 'BOS') && destination === 'LAX')) {
    return 2450;
  }

  if (originRegion === destRegion) return 1200; 
  if (originRegion === 'NA' && destRegion === 'EU') return 3500;
  if (originRegion === 'NA' && destRegion === 'AS') return 5500;
  if (originRegion === 'AF' && destRegion === 'EU') return 3000;
  if (originRegion === 'AF' && destRegion === 'NA') return 7000;

  return 4000; // Fallback
}

export function findCity(query: string): { code: string; region: string; country: string } | null {
  if (!query) return null;
  const hub = getExtendedAirport(query);
  if (hub) return { code: query.toUpperCase(), ...hub };

  // Quick fallback search across ALL_AIRPORTS if it's a name search
  const q = query.toLowerCase();
  const found = ALL_AIRPORTS.find(a => 
    a.city.toLowerCase().includes(q) || 
    a.name.toLowerCase().includes(q)
  );

  if (found) {
    const ext = getExtendedAirport(found.iata);
    if (ext) return { code: found.iata, ...ext };
  }

  return null;
}