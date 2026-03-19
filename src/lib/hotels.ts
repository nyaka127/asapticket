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
  
  // Real-World Regional Asset Intelligence (High-Resolution Real Photos)
  const imgSets: Record<string, string[]> = {
    LONDON: [
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1445019980597-93fa8acb246c?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1551882547-ff43c33ff783?auto=format&fit=crop&q=80&w=800"
    ],
    PARIS: [
      "https://images.unsplash.com/photo-1499916078039-922301b0eb9b?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1551635586-096503ad9e8b?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1444201983204-c43cbd584d93?auto=format&fit=crop&q=80&w=800"
    ],
    TOKYO: [
      "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1496417263034-38ec4f0b665a?auto=format&fit=crop&q=80&w=800"
    ],
    DUBAI: [
      "https://images.unsplash.com/photo-1582650625119-3a31f8fa2699?auto=format&fit=crop&q=80&w=800", // Burj Al Arab style
      "https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&q=80&w=800"
    ],
    AFRICA: [
      "https://images.unsplash.com/photo-1493246318656-5bbd4afb2978?auto=format&fit=crop&q=80&w=800", // Safari Resort
      "https://images.unsplash.com/photo-1565039352829-378341259654?auto=format&fit=crop&q=80&w=800", // City Modern
      "https://images.unsplash.com/photo-1523413363574-c3c44b3b4d69?auto=format&fit=crop&q=80&w=800"  // Coastal
    ],
    NYC: [
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1445019980597-93fa8acb246c?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&q=80&w=800"
    ],
    TROPICAL: [
      "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1439115733028-eb7a637c89ba?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1437719417032-8595fd9e9dc6?auto=format&fit=crop&q=80&w=800"
    ],
    DEFAULT: [
      "/assets/hilton_main.png",
      "/assets/hotel_main.png",
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=800"
    ]
  };

  let region: keyof typeof imgSets = 'DEFAULT';
  if (['LHR', 'LON', 'LONDON', 'UK'].some(k => dest.includes(k))) region = 'LONDON';
  else if (['CDG', 'PAR', 'PARIS', 'AF'].some(k => dest.includes(k))) region = 'PARIS';
  else if (['HND', 'TYO', 'TOKYO', 'JAPAN'].some(k => dest.includes(k))) region = 'TOKYO';
  else if (['DXB', 'DUBAI', 'UAE'].some(k => dest.includes(k))) region = 'DUBAI';
  else if (['NBO', 'LOS', 'ADD', 'KAMPALA', 'NAIROBI', 'KENYA', 'UGANDA', 'NIGERIA', 'EBB'].some(k => dest.includes(k))) region = 'AFRICA';
  else if (['JFK', 'NYC', 'NEW YORK', 'USA'].some(k => dest.includes(k))) region = 'NYC';
  else if (['MLE', 'BKK', 'HKT', 'BALI', 'DPS', 'BEACH'].some(k => dest.includes(k))) region = 'TROPICAL';

  const set = imgSets[region];

  // Mock data normalized to Hapi V3 structure
  const mockHotels = [
    {
      id: 1001,
      name: `The Ritz-Carlton ${dest} Plaza`,
      stars: 5,
      class: "Elite Diamond",
      mealPlan: "American Breakfast Included",
      rating: 9.8,
      priceBase: 245,
      image: set[0],
      location: "Prime District",
      amenities: ["Elite Access", "Free WiFi", "Infinity Pool"]
    },
    {
      id: 1002,
      name: `Waldorf Astoria ${dest} Heights`,
      stars: 5,
      class: "Imperial Premium",
      mealPlan: "Half-Board (Lunch & Breakfast)",
      rating: 9.6,
      priceBase: 295,
      image: set[1],
      location: "Upper Terrace",
      amenities: ["Private Spa", "24/7 Butler", "Michelin Dining"]
    },
    {
      id: 1003,
      name: `St. Regis ${dest} Central Boutique`,
      stars: 5,
      class: "Boutique Executive",
      mealPlan: "All-Inclusive Signature Dining",
      rating: 9.4,
      priceBase: 310,
      image: set[2],
      location: "Skyline Area",
      amenities: ["Executive Lounge", "Sky Pool", "Fast WiFi"]
    }
  ];

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
