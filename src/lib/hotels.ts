/**
 * Hapi (Hotels) API Service - Mock Implementation
 * Based on Hapi Affiliate V3 RAML
 */

import { calculateClientPrice } from './pricing';

export interface HotelRoomGuests {
  adults: number;
  childrenAges: number[];
}

export interface HotelSearchCriteria {
  destination: string;
  checkin: string;
  checkout: string;
  rooms: string; // Format: "2:4" (2 adults, 1 child age 4)
}

export const searchHotels = async (criteria: HotelSearchCriteria) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));

  const dest = (criteria.destination || 'NYC').toUpperCase();

  // Database of Real Existing Hotels with Authentic Imagery
  // Maps specific airport codes/city names/country names to real hotel properties.
  const REAL_HOTELS: Record<string, any[]> = {
    'LON': [
      { name: "The Ritz London", stars: 5, location: "150 Piccadilly, St. James's", image: "https://images.unsplash.com/photo-1565031491338-45f96c67b376?auto=format&fit=crop&q=80&w=800" },
      { name: "The Savoy", stars: 5, location: "Strand, London", image: "https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&q=80&w=800" },
      { name: "Shangri-La The Shard", stars: 5, location: "31 St Thomas St", image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&q=80&w=800" },
      { name: "Claridge's", stars: 5, location: "Brook Street, Mayfair", image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=800" },
      { name: "The Langham, London", stars: 5, location: "1C Portland Pl", image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80&w=800" },
      { name: "Corinthia London", stars: 5, location: "Whitehall Pl", image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&q=80&w=800" },
      { name: "Rosewood London", stars: 5, location: "252 High Holborn", image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&q=80&w=800" },
      { name: "Ham Yard Hotel", stars: 5, location: "1 Ham Yard", image: "https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&q=80&w=800" },
      { name: "The Berkeley", stars: 5, location: "Wilton Pl, Knightsbridge", image: "https://images.unsplash.com/photo-1551882547-ff43c33ff783?auto=format&fit=crop&q=80&w=800" },
      { name: "The Ned", stars: 5, location: "27 Poultry, London", image: "https://images.unsplash.com/photo-1564501049412-61c2a3083791?auto=format&fit=crop&q=80&w=800" }
    ],
    'PAR': [
      { name: "Ritz Paris", stars: 5, location: "15 Place Vendôme", image: "https://images.unsplash.com/photo-1560920452-aa6406324e75?auto=format&fit=crop&q=80&w=800" },
      { name: "Hôtel Plaza Athénée", stars: 5, location: "25 Avenue Montaigne", image: "https://images.unsplash.com/photo-1551635586-096503ad9e8b?auto=format&fit=crop&q=80&w=800" },
      { name: "Pullman Paris Tour Eiffel", stars: 4, location: "18 Avenue De Suffren", image: "https://images.unsplash.com/photo-1499916078039-922301b0eb9b?auto=format&fit=crop&q=80&w=800" },
      { name: "Le Meurice", stars: 5, location: "228 Rue de Rivoli", image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&q=80&w=800" },
      { name: "Four Seasons Hotel George V", stars: 5, location: "31 Avenue George V", image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=800" },
      { name: "Shangri-La Paris", stars: 5, location: "10 Avenue d'Iéna", image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80&w=800" },
      { name: "The Peninsula Paris", stars: 5, location: "19 Avenue Kléber", image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&q=80&w=800" },
      { name: "Mandarin Oriental, Paris", stars: 5, location: "251 Rue Saint-Honoré", image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&q=80&w=800" },
      { name: "Hôtel de Crillon", stars: 5, location: "10 Place de la Concorde", image: "https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&q=80&w=800" },
      { name: "Park Hyatt Paris-Vendôme", stars: 5, location: "5 Rue de la Paix", image: "https://images.unsplash.com/photo-1551882547-ff43c33ff783?auto=format&fit=crop&q=80&w=800" }
    ],
    'DXB': [
      { name: "Burj Al Arab Jumeirah", stars: 7, location: "Jumeirah St, Dubai", image: "https://images.unsplash.com/photo-1582650625119-3a31f8fa2699?auto=format&fit=crop&q=80&w=800" },
      { name: "Atlantis, The Palm", stars: 5, location: "Crescent Rd, Dubai", image: "https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&q=80&w=800" },
      { name: "Jumeirah Beach Hotel", stars: 5, location: "Jumeirah St, Dubai", image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&q=80&w=800" },
      { name: "Armani Hotel Dubai", stars: 5, location: "Burj Khalifa, Downtown", image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&q=80&w=800" },
      { name: "Address Downtown", stars: 5, location: "Sheikh Mohammed bin Rashid Blvd", image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=800" },
      { name: "The Ritz-Carlton, Dubai", stars: 5, location: "The Walk, JBR", image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80&w=800" },
      { name: "Four Seasons Resort Dubai", stars: 5, location: "Jumeirah Beach Rd", image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&q=80&w=800" },
      { name: "Palazzo Versace Dubai", stars: 5, location: "Jaddaf Waterfront", image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&q=80&w=800" },
      { name: "Raffles Dubai", stars: 5, location: "Sheikh Rashid Rd", image: "https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&q=80&w=800" },
      { name: "JW Marriott Marquis Hotel", stars: 5, location: "Business Bay", image: "https://images.unsplash.com/photo-1551882547-ff43c33ff783?auto=format&fit=crop&q=80&w=800" }
    ],
    'NYC': [
      { name: "The Plaza", stars: 5, location: "5th Avenue at Central Park South", image: "https://images.unsplash.com/photo-1562133567-b6a0a9c7e6eb?auto=format&fit=crop&q=80&w=800" },
      { name: "New York Marriott Marquis", stars: 4, location: "1535 Broadway", image: "https://images.unsplash.com/photo-1496417263034-38ec4f0b665a?auto=format&fit=crop&q=80&w=800" },
      { name: "1 Hotel Brooklyn Bridge", stars: 5, location: "60 Furman St, Brooklyn", image: "https://images.unsplash.com/photo-1512918760513-95f1fde64283?auto=format&fit=crop&q=80&w=800" },
      { name: "The St. Regis New York", stars: 5, location: "Two E 55th St", image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&q=80&w=800" },
      { name: "Mandarin Oriental, New York", stars: 5, location: "80 Columbus Circle", image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=800" },
      { name: "Baccarat Hotel New York", stars: 5, location: "28 W 53rd St", image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80&w=800" },
      { name: "Park Hyatt New York", stars: 5, location: "153 W 57th St", image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&q=80&w=800" },
      { name: "Four Seasons Hotel New York", stars: 5, location: "57 E 57th St", image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&q=80&w=800" },
      { name: "The Knickerbocker Hotel", stars: 5, location: "6 Times Square", image: "https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&q=80&w=800" },
      { name: "Equinox Hotel Hudson Yards", stars: 5, location: "33 Hudson Yards", image: "https://images.unsplash.com/photo-1551882547-ff43c33ff783?auto=format&fit=crop&q=80&w=800" }
    ],
    'SIN': [
      { name: "Marina Bay Sands", stars: 5, location: "10 Bayfront Ave", image: "https://images.unsplash.com/photo-1565031491338-45f96c67b376?auto=format&fit=crop&q=80&w=800" },
      { name: "Raffles Singapore", stars: 5, location: "1 Beach Rd", image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=800" },
      { name: "The Fullerton Hotel", stars: 5, location: "1 Fullerton Square", image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80&w=800" },
      { name: "Capella Singapore", stars: 5, location: "1 The Knolls, Sentosa", image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&q=80&w=800" },
      { name: "The Ritz-Carlton Millenia", stars: 5, location: "7 Raffles Ave", image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=800" },
      { name: "Parkroyal Collection Pickering", stars: 5, location: "3 Upper Pickering St", image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80&w=800" },
      { name: "Grand Hyatt Singapore", stars: 5, location: "10 Scotts Rd", image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&q=80&w=800" },
      { name: "Shangri-La Singapore", stars: 5, location: "22 Orange Grove Rd", image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&q=80&w=800" },
      { name: "InterContinental Singapore", stars: 5, location: "80 Middle Rd", image: "https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&q=80&w=800" },
      { name: "Fairmont Singapore", stars: 5, location: "80 Bras Basah Rd", image: "https://images.unsplash.com/photo-1551882547-ff43c33ff783?auto=format&fit=crop&q=80&w=800" }
    ],
    'NBO': [
      { name: "Giraffe Manor", stars: 5, location: "Gogo Falls Road, Nairobi", image: "https://images.unsplash.com/photo-1493246318656-5bbd4afb2978?auto=format&fit=crop&q=80&w=800" },
      { name: "Fairmont The Norfolk", stars: 5, location: "Harry Thuku Rd", image: "https://images.unsplash.com/photo-1565039352829-378341259654?auto=format&fit=crop&q=80&w=800" },
      { name: "Villa Rosa Kempinski", stars: 5, location: "Chiromo Rd, Nairobi", image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80&w=800" },
      { name: "Tribe Hotel", stars: 5, location: "Gigiri, Nairobi", image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&q=80&w=800" },
      { name: "Hemingways Nairobi", stars: 5, location: "Karen, Nairobi", image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=800" },
      { name: "Sarova Stanley", stars: 5, location: "Kenyatta Ave", image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80&w=800" },
      { name: "Ole-Sereni Hotel", stars: 5, location: "Mombasa Rd", image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&q=80&w=800" },
      { name: "Radisson Blu Hotel", stars: 5, location: "Upper Hill", image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&q=80&w=800" },
      { name: "Sankara Nairobi", stars: 5, location: "Woodvale Grove", image: "https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&q=80&w=800" },
      { name: "Crowne Plaza Nairobi Airport", stars: 5, location: "First Freight Lane", image: "https://images.unsplash.com/photo-1551882547-ff43c33ff783?auto=format&fit=crop&q=80&w=800" }
    ],
    'TYO': [
      { name: "Park Hyatt Tokyo", stars: 5, location: "Shinjuku City, Tokyo", image: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&q=80&w=800" },
      { name: "Aman Tokyo", stars: 5, location: "The Otemachi Tower", image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80&w=800" },
      { name: "Hoshinoya Tokyo", stars: 5, location: "Chiyoda City, Tokyo", image: "https://images.unsplash.com/photo-1496417263034-38ec4f0b665a?auto=format&fit=crop&q=80&w=800" }
    ],
    'ROM': [
      { name: "Hotel Hassler Roma", stars: 5, location: "Piazza della Trinità dei Monti", image: "https://images.unsplash.com/photo-1551882547-ff43c33ff783?auto=format&fit=crop&q=80&w=800" },
      { name: "Hotel Artemide", stars: 4, location: "Via Nazionale, 22", image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=800" },
      { name: "Rome Cavalieri", stars: 5, location: "Via Alberto Cadlolo, 101", image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80&w=800" }
    ],
    'IST': [
      { name: "Ciragan Palace Kempinski", stars: 5, location: "Ciragan Cad. 32", image: "https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&q=80&w=800" },
      { name: "Swissotel The Bosphorus", stars: 5, location: "Visnezade Mah", image: "https://images.unsplash.com/photo-1551882547-ff43c33ff783?auto=format&fit=crop&q=80&w=800" },
      { name: "Pera Palace Hotel", stars: 4, location: "Mesrutiyet Caddesi No:52", image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=800" }
    ],
    'CPT': [
      { name: "The Silo Hotel", stars: 5, location: "V&A Waterfront", image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&q=80&w=800" },
      { name: "One&Only Cape Town", stars: 5, location: "Dock Rd, V&A Waterfront", image: "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?auto=format&fit=crop&q=80&w=800" },
      { name: "The Bay Hotel", stars: 4, location: "69 Victoria Rd", image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=800" }
    ],
    'SYD': [
      { name: "Park Hyatt Sydney", stars: 5, location: "7 Hickson Rd, The Rocks", image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80&w=800" },
      { name: "Shangri-La Sydney", stars: 5, location: "176 Cumberland St", image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=800" },
      { name: "The Langham", stars: 5, location: "89-113 Kent St", image: "https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&q=80&w=800" }
    ],
    'BKK': [
      { name: "Mandarin Oriental Bangkok", stars: 5, location: "48 Oriental Ave", image: "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&q=80&w=800" },
      { name: "The Siam", stars: 5, location: "3/2 Thanon Khao", image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&q=80&w=800" },
      { name: "Lebua at State Tower", stars: 5, location: "Si Lom, Silom", image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&q=80&w=800" }
    ],
    'GIG': [
      { name: "Copacabana Palace", stars: 5, location: "Av. Atlântica, 1702", image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=800" },
      { name: "Hotel Fasano Rio", stars: 5, location: "Av. Vieira Souto, 80", image: "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?auto=format&fit=crop&q=80&w=800" },
      { name: "Santa Teresa Hotel", stars: 5, location: "R. Alm. Alexandrino, 660", image: "https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&q=80&w=800" }
    ],
    'LAX': [
      { name: "The Beverly Hills Hotel", stars: 5, location: "9641 Sunset Blvd", image: "https://images.unsplash.com/photo-1561501900-3701fa6a0864?auto=format&fit=crop&q=80&w=800" },
      { name: "Hotel Figueroa", stars: 4, location: "939 S Figueroa St", image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80&w=800" },
      { name: "The Hollywood Roosevelt", stars: 4, location: "7000 Hollywood Blvd", image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=800" }
    ]
  };

  // Flexible Search Matching
  // Looks for Country, City Code, or City Name matches
  let selectedSet: any[] = [];

  if (['LHR', 'LON', 'LONDON', 'UK', 'ENGLAND', 'BRITAIN'].some(k => dest.includes(k))) selectedSet = REAL_HOTELS['LON'];
  else if (['CDG', 'PAR', 'PARIS', 'FRANCE'].some(k => dest.includes(k))) selectedSet = REAL_HOTELS['PAR'];
  else if (['DXB', 'DUBAI', 'UAE', 'EMIRATES'].some(k => dest.includes(k))) selectedSet = REAL_HOTELS['DXB'];
  else if (['FCO', 'ROM', 'ROME', 'ITALY'].some(k => dest.includes(k))) selectedSet = REAL_HOTELS['ROM'];
  else if (['IST', 'ISTANBUL', 'TURKEY'].some(k => dest.includes(k))) selectedSet = REAL_HOTELS['IST'];
  else if (['CPT', 'CAPE TOWN', 'SOUTH AFRICA'].some(k => dest.includes(k))) selectedSet = REAL_HOTELS['CPT'];
  else if (['SYD', 'SYDNEY', 'AUSTRALIA'].some(k => dest.includes(k))) selectedSet = REAL_HOTELS['SYD'];
  else if (['BKK', 'BANGKOK', 'THAILAND'].some(k => dest.includes(k))) selectedSet = REAL_HOTELS['BKK'];
  else if (['GIG', 'RIO', 'BRAZIL'].some(k => dest.includes(k))) selectedSet = REAL_HOTELS['GIG'];
  else if (['LAX', 'LOS ANGELES', 'CALIFORNIA'].some(k => dest.includes(k))) selectedSet = REAL_HOTELS['LAX'];
  else if (['JFK', 'NYC', 'NEW YORK', 'USA', 'AMERICA'].some(k => dest.includes(k))) selectedSet = REAL_HOTELS['NYC'];
  else if (['SIN', 'SINGAPORE'].some(k => dest.includes(k))) selectedSet = REAL_HOTELS['SIN'];
  else if (['NBO', 'NAIROBI', 'KENYA'].some(k => dest.includes(k))) selectedSet = REAL_HOTELS['NBO'];
  else if (['HND', 'NRT', 'TOKYO', 'JAPAN'].some(k => dest.includes(k))) selectedSet = REAL_HOTELS['TYO'];

  // Fallback: If no real hotel set is found, use Creative Generic Names
  // This ensures hotels don't just look like "${City} Inn"
  if (selectedSet.length === 0) {
    const CREATIVE_NAMES = [
      "The Grand Meridian", "Royal Plaza Hotel", "City Center Suites",
      "Blue Horizon Resort", "The Old Town Inn", "Metropolitan Heights",
      "Golden Tulip Estate", "Silver Cloud Hotel", "The Regency",
      "Victoria Garden Hotel", "Imperial Court", "The Sovereign"
    ];

    // Generate deterministic index based on string length to keep results consistent per search
    const seed = dest.length;

    selectedSet = [
      {
        name: CREATIVE_NAMES[seed % CREATIVE_NAMES.length],
        stars: 5,
        location: `${dest} Downtown`,
        image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=800"
      },
      {
        name: CREATIVE_NAMES[(seed + 2) % CREATIVE_NAMES.length],
        stars: 4,
        location: `${dest} Financial District`,
        image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80&w=800"
      },
      {
        name: CREATIVE_NAMES[(seed + 4) % CREATIVE_NAMES.length],
        stars: 3,
        location: `${dest} West End`,
        image: "https://images.unsplash.com/photo-1445019980597-93fa8acb246c?auto=format&fit=crop&q=80&w=800"
      }
    ];
  }

  // Randomize Price a bit for realism
  const rnd = (base: number) => base + (Math.floor(Math.random() * 60) - 30);

  const mockHotels = selectedSet.map((h, i) => ({
    id: 1000 + i,
    name: h.name,
    stars: h.stars || 4,
    class: i === 0 ? "Deluxe Suite" : "Standard King",
    mealPlan: "Breakfast Included",
    rating: 4.5 + (Math.random() * 0.4),
    priceBase: rnd(i === 0 ? 195 : 85),
    image: h.image,
    location: h.location || `${dest} Center`,
    amenities: ["Free WiFi", "Pool", "Spa"]
  }));

  // Apply Seasonality & Pricing Guards
  return mockHotels.map(hotel => {
    // For hotels, we use a fixed seasonality for demo or map it to destination
    const seasonalityMultiplier = 1.1; // Simulated
    const finalPrice = calculateClientPrice(hotel.priceBase, seasonalityMultiplier);

    return {
      ...hotel,
      totalRate: finalPrice,
      currency: "USD",
      isPremium: true
    };
  });
};
