/**
 * Global Tour Destinations and Information
 * Includes economic context, necessary travel info and key highlights.
 */

export interface DestinationInfo {
  name: string;
  country: string;
  economicStatus: string;
  necessaryInfo: string;
  news: string;
  highlights: string[];
}

export const DESTINATIONS: Record<string, DestinationInfo> = {
  'New York': {
    name: 'New York City',
    country: 'USA',
    economicStatus: 'Global financial hub. High cost of living. Home to the NYSE and NASDAQ.',
    necessaryInfo: 'Fast-paced, robust public transit (MTA). EST time zone. Requires ESTA or Visa for most visitors.',
    news: 'Recent updates in urban sustainability projects and major tech hub expansion.',
    highlights: ['Manhattan Skyline', 'Central Park', 'Broadway Shows', 'Statue of Liberty']
  },
  'Nairobi': {
    name: 'Nairobi',
    country: 'Kenya',
    economicStatus: 'The "Silicon Savannah". Leading tech ecosystem in Africa. Stable growth focused on innovation.',
    necessaryInfo: 'Safe but stay alert. Use ride-sharing. Kenyan eVisa required. Tropical climate.',
    news: 'Hosting major international summits on climate and tech in 2026.',
    highlights: ['Nairobi National Park', 'Giraffe Centre', 'Karen Blixen Museum', 'Maasai Market']
  },
  'Lagos': {
    name: 'Lagos',
    country: 'Nigeria',
    economicStatus: 'Africas largest economy. Massive oil & gas sector and rapidly growing entertainment industry (Nollywood).',
    necessaryInfo: 'Vibrant and energetic. Use private transport. Check latest health and vaccination requirements.',
    news: 'Major infrastructure projects including new light rail and harbor expansions.',
    highlights: ['Lekki Conservation Centre', 'Nike Art Gallery', 'Freedom Park', 'Tarkwa Bay Beach']
  },
  'London': {
    name: 'London',
    country: 'UK',
    economicStatus: 'Stable economy with emphasis on luxury retail and finance. Moderate inflation impacts.',
    necessaryInfo: 'Excellent public transport (The Tube). GMT time zone. Check UK Electronic Travel Authorisation (ETA).',
    news: 'Hosting significant cultural festivals and sporting events throughout the year.',
    highlights: ['British Museum', 'London Eye', 'Tower Bridge', 'Hyde Park']
  },
  'Dubai': {
    name: 'Dubai',
    country: 'UAE',
    economicStatus: 'Highly diversified economy. No personal income tax. Major center for logistics and tourism.',
    necessaryInfo: 'Modern infrastructure. Respect local customs. Smart gates at DXB airport for fast entry.',
    news: 'Unveiling mega-project completion for the next phase of urban expansion.',
    highlights: ['Burj Khalifa', 'Dubai Mall', 'Palm Jumeirah', 'Desert Safari']
  },
  'Paris': {
    name: 'Paris',
    country: 'France',
    economicStatus: 'Leading luxury goods market. Strong tourism sector and cultural exports.',
    necessaryInfo: 'Walkable city but metro is efficient. Learn basic French greetings. Schengen visa requirements.',
    news: 'Preparing for summer-long cultural festivities after major renovations of historic sites.',
    highlights: ['Eiffel Tower', 'Louvre Museum', 'Notre Dame Cathedral', 'Champs-Élysées']
  },
  'Tokyo': {
    name: 'Tokyo',
    country: 'Japan',
    economicStatus: 'Third-largest economy. Low inflation but high purchasing power. Hub for robotics and technology.',
    necessaryInfo: 'Very safe. Respect etiquette. Use Pasmo/Suica cards for transit. High-speed rail connections.',
    news: 'Advancements in renewable energy infrastructure and hosting international tech-expo.',
    highlights: ['Shibuya Crossing', 'Senso-ji Temple', 'Tokyo Skytree', 'Meiji Jingu Shrine']
  }
};

export function getDestinationInfo(nameOrCode: string): DestinationInfo | undefined {
  const norm = nameOrCode.toLowerCase();
  return Object.values(DESTINATIONS).find(d => 
    d.name.toLowerCase().includes(norm) || d.country.toLowerCase().includes(norm)
  );
}
