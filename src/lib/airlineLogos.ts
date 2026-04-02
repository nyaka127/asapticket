// Comprehensive Airline Logo Database
// Logos sourced from Wikipedia SVGs and Clearbit for reliability

export interface AirlineInfo {
  name: string;
  logo: string;
  alliance: 'Star Alliance' | 'Oneworld' | 'SkyTeam' | 'Independent';
}

export const AIRLINES: AirlineInfo[] = [
  // ─── STAR ALLIANCE ─────────────────────────────────────────
  { name: 'Lufthansa', logo: 'https://logo.clearbit.com/lufthansa.com', alliance: 'Star Alliance' },
  { name: 'United Airlines', logo: 'https://logo.clearbit.com/united.com', alliance: 'Star Alliance' },
  { name: 'Singapore Airlines', logo: 'https://logo.clearbit.com/singaporeair.com', alliance: 'Star Alliance' },
  { name: 'ANA', logo: 'https://logo.clearbit.com/ana.co.jp', alliance: 'Star Alliance' },
  { name: 'Air Canada', logo: 'https://logo.clearbit.com/aircanada.com', alliance: 'Star Alliance' },
  { name: 'Turkish Airlines', logo: 'https://logo.clearbit.com/turkishairlines.com', alliance: 'Star Alliance' },
  { name: 'Ethiopian Airlines', logo: 'https://logo.clearbit.com/ethiopianairlines.com', alliance: 'Star Alliance' },
  { name: 'Swiss', logo: 'https://logo.clearbit.com/swiss.com', alliance: 'Star Alliance' },
  { name: 'Austrian Airlines', logo: 'https://logo.clearbit.com/austrian.com', alliance: 'Star Alliance' },
  { name: 'LOT Polish Airlines', logo: 'https://logo.clearbit.com/lot.com', alliance: 'Star Alliance' },
  { name: 'Air New Zealand', logo: 'https://logo.clearbit.com/airnewzealand.com', alliance: 'Star Alliance' },
  { name: 'Asiana Airlines', logo: 'https://logo.clearbit.com/flyasiana.com', alliance: 'Star Alliance' },
  { name: 'EVA Air', logo: 'https://logo.clearbit.com/evaair.com', alliance: 'Star Alliance' },
  { name: 'TAP Air Portugal', logo: 'https://logo.clearbit.com/flytap.com', alliance: 'Star Alliance' },
  { name: 'South African Airways', logo: 'https://logo.clearbit.com/flysaa.com', alliance: 'Star Alliance' },
  { name: 'Thai Airways', logo: 'https://logo.clearbit.com/thaiairways.com', alliance: 'Star Alliance' },
  { name: 'Air India', logo: 'https://logo.clearbit.com/airindia.com', alliance: 'Star Alliance' },

  // ─── ONEWORLD ──────────────────────────────────────────────
  { name: 'British Airways', logo: 'https://logo.clearbit.com/britishairways.com', alliance: 'Oneworld' },
  { name: 'American Airlines', logo: 'https://logo.clearbit.com/aa.com', alliance: 'Oneworld' },
  { name: 'Qatar Airways', logo: 'https://logo.clearbit.com/qatarairways.com', alliance: 'Oneworld' },
  { name: 'Qantas', logo: 'https://logo.clearbit.com/qantas.com', alliance: 'Oneworld' },
  { name: 'Cathay Pacific', logo: 'https://logo.clearbit.com/cathaypacific.com', alliance: 'Oneworld' },
  { name: 'Japan Airlines', logo: 'https://logo.clearbit.com/jal.co.jp', alliance: 'Oneworld' },
  { name: 'Iberia', logo: 'https://logo.clearbit.com/iberia.com', alliance: 'Oneworld' },
  { name: 'Finnair', logo: 'https://logo.clearbit.com/finnair.com', alliance: 'Oneworld' },
  { name: 'Malaysia Airlines', logo: 'https://logo.clearbit.com/malaysiaairlines.com', alliance: 'Oneworld' },
  { name: 'Royal Jordanian', logo: 'https://logo.clearbit.com/rj.com', alliance: 'Oneworld' },
  { name: 'Alaska Airlines', logo: 'https://logo.clearbit.com/alaskaair.com', alliance: 'Oneworld' },

  // ─── SKYTEAM ───────────────────────────────────────────────
  { name: 'Delta Air Lines', logo: 'https://logo.clearbit.com/delta.com', alliance: 'SkyTeam' },
  { name: 'Air France', logo: 'https://logo.clearbit.com/airfrance.com', alliance: 'SkyTeam' },
  { name: 'KLM', logo: 'https://logo.clearbit.com/klm.com', alliance: 'SkyTeam' },
  { name: 'Korean Air', logo: 'https://logo.clearbit.com/koreanair.com', alliance: 'SkyTeam' },
  { name: 'Kenya Airways', logo: 'https://logo.clearbit.com/kenya-airways.com', alliance: 'SkyTeam' },
  { name: 'Alitalia', logo: 'https://logo.clearbit.com/alitalia.com', alliance: 'SkyTeam' },
  { name: 'China Southern', logo: 'https://logo.clearbit.com/csair.com', alliance: 'SkyTeam' },
  { name: 'China Eastern', logo: 'https://logo.clearbit.com/ceair.com', alliance: 'SkyTeam' },
  { name: 'Vietnam Airlines', logo: 'https://logo.clearbit.com/vietnamairlines.com', alliance: 'SkyTeam' },
  { name: 'Garuda Indonesia', logo: 'https://logo.clearbit.com/garuda-indonesia.com', alliance: 'SkyTeam' },
  { name: 'Saudi Arabian Airlines', logo: 'https://logo.clearbit.com/saudia.com', alliance: 'SkyTeam' },
  { name: 'Aeroméxico', logo: 'https://logo.clearbit.com/aeromexico.com', alliance: 'SkyTeam' },

  // ─── INDEPENDENT / OTHER ──────────────────────────────────
  { name: 'Emirates', logo: 'https://logo.clearbit.com/emirates.com', alliance: 'Independent' },
  { name: 'Etihad Airways', logo: 'https://logo.clearbit.com/etihad.com', alliance: 'Independent' },
  { name: 'Virgin Atlantic', logo: 'https://logo.clearbit.com/virginatlantic.com', alliance: 'Independent' },
  { name: 'Southwest Airlines', logo: 'https://logo.clearbit.com/southwest.com', alliance: 'Independent' },
  { name: 'Ryanair', logo: 'https://logo.clearbit.com/ryanair.com', alliance: 'Independent' },
  { name: 'EasyJet', logo: 'https://logo.clearbit.com/easyjet.com', alliance: 'Independent' },
  { name: 'FedEx', logo: 'https://logo.clearbit.com/fedex.com', alliance: 'Independent' },
  { name: 'UPS Airlines', logo: 'https://logo.clearbit.com/ups.com', alliance: 'Independent' },
  { name: 'Air Pacific', logo: 'https://logo.clearbit.com/fijiairways.com', alliance: 'Independent' },
  { name: 'LAN Airlines', logo: 'https://logo.clearbit.com/latam.com', alliance: 'Independent' },
  { name: 'TAM Airlines', logo: 'https://logo.clearbit.com/latam.com', alliance: 'Independent' },
  { name: 'RwandAir', logo: 'https://logo.clearbit.com/rwandair.com', alliance: 'Independent' },
  { name: 'Dragonair', logo: 'https://logo.clearbit.com/cathaypacific.com', alliance: 'Independent' },
  { name: 'Martinair', logo: 'https://logo.clearbit.com/martinair.com', alliance: 'Independent' },
  { name: 'Philippine Airlines', logo: 'https://logo.clearbit.com/philippineairlines.com', alliance: 'Independent' },
  { name: 'Air Niugini', logo: 'https://logo.clearbit.com/airniugini.com.pg', alliance: 'Independent' },
  { name: 'Brussels Airlines', logo: 'https://logo.clearbit.com/brusselsairlines.com', alliance: 'Independent' },
  { name: 'MEA', logo: 'https://logo.clearbit.com/mea.com.lb', alliance: 'Independent' },
  { name: 'Iran Air', logo: 'https://logo.clearbit.com/iranair.com', alliance: 'Independent' },
];

// Quick lookup for flight card logos (by airline name)
export const AIRLINE_LOGO_MAP: Record<string, string> = {};
AIRLINES.forEach(a => { AIRLINE_LOGO_MAP[a.name] = a.logo; });

// Domain fallback map for non-Clearbit lookups
export const AIRLINE_DOMAIN_MAP: Record<string, string> = {
  'American Airlines': 'aa.com',
  'British Airways': 'britishairways.com',
  'Lufthansa': 'lufthansa.com',
  'Emirates': 'emirates.com',
  'Qatar Airways': 'qatarairways.com',
  'Delta Air Lines': 'delta.com',
  'United Airlines': 'united.com',
  'Air India': 'airindia.com',
  'Brussels Airlines': 'brusselsairlines.com',
  'Ethiopian Airlines': 'ethiopianairlines.com',
  'RwandAir': 'rwandair.com',
  'Turkish Airlines': 'turkishairlines.com',
  'Kenya Airways': 'kenya-airways.com',
  'KLM': 'klm.com',
  'Virgin Atlantic': 'virginatlantic.com',
  'Singapore Airlines': 'singaporeair.com',
  'Qantas': 'qantas.com',
  'Cathay Pacific': 'cathaypacific.com',
  'Japan Airlines': 'jal.co.jp',
  'Korean Air': 'koreanair.com',
  'Air France': 'airfrance.com',
  'Swiss': 'swiss.com',
};

export function getBestAirlineLogo(airlineName: string): string {
  if (AIRLINE_LOGO_MAP[airlineName]) return AIRLINE_LOGO_MAP[airlineName];
  const domain = AIRLINE_DOMAIN_MAP[airlineName];
  if (domain) return `https://logo.clearbit.com/${domain}`;
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(airlineName)}&background=0D47A1&color=fff&bold=true&size=128`;
}
