/**
 * Iris (Cars) API Service - Mock Implementation
 * Based on Iris Affiliate V1 RAML
 */

import { calculateClientPrice } from './pricing';

export interface CarSearchStartParameters {
  pickup: {
    location: { type: string; value: string };
    date: string;
    hour?: number;
    minute?: number;
  };
  dropoff: {
    date: string;
    hour?: number;
    minute?: number;
  };
}

export const searchCars = async (params: CarSearchStartParameters) => {
  // Simulate API delay (Polling-style latency)
  await new Promise(resolve => setTimeout(resolve, 1200));

  const pickup = (params.pickup.location.value || 'NYC').toUpperCase();
  
  // Single Taxi Type based on Location with Distance-based Pricing
  let taxiType = {
    id: `taxi-${pickup}-local`,
    agency: "asap-dispatch",
    provider: "GLOBE_TAXI_IRIS",
    car: {
      brand: "Professional City Taxi",
      type: "Licensed Dispatch",
      passengers: 4,
      bags: 3,
      image: "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&q=80&w=800",
      transmission: "automatic",
      fuel: "Hybrid / EV"
    },
    pricePerKm: 2.15,
    baseFare: 12.00,
    currency: "USD"
  };

  // Regionally swap imagery and brand
  if (['LON', 'LHR', 'LONDON', 'UK'].some(k => pickup.includes(k))) {
    taxiType.car.brand = "Elite London Black Cab";
    taxiType.car.image = "https://images.unsplash.com/photo-1629651543883-9366d289cb7d?auto=format&fit=crop&q=80&w=800";
    taxiType.pricePerKm = 2.45;
  } else if (['JFK', 'EWR', 'LGA', 'NYC', 'NY'].some(k => pickup.includes(k))) {
    taxiType.car.brand = "Classic NYC Yellow Cab";
    taxiType.car.image = "https://images.unsplash.com/photo-1538332576228-eb5b4c4de6f5?auto=format&fit=crop&q=80&w=800";
    taxiType.pricePerKm = 2.85;
  } else if (['AF', 'CDG', 'ORY', 'PARIS'].some(k => pickup.includes(k))) {
    taxiType.car.brand = "Parisian Private Chauffeur";
    taxiType.car.image = "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&q=80&w=800";
    taxiType.pricePerKm = 3.10;
  }

  // Calculate estimated total based on fixed 20km city transfer for search results
  const estimatedDistanceKm = 20;
  const rawPrice = taxiType.baseFare + (taxiType.pricePerKm * estimatedDistanceKm);

  // Apply Seasonality & Pricing Guards
  const finalPrice = calculateClientPrice(rawPrice, 1.05);

  return [{
    ...taxiType,
    priceTotal: finalPrice,
    estimatedDistance: estimatedDistanceKm,
    badges: ["Local Licensed", "No-Loss Guard", "Fixed Rate Available"]
  }];
};
