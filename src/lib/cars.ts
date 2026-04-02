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
    agency: "Local Dispatch",
    provider: "DIRECT_DISPATCH",
    car: {
      brand: "Standard City Taxi",
      type: "Standard Pickup",
      passengers: 4,
      bags: 3,
      image: "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&q=80&w=800",
      transmission: "automatic",
      fuel: "Hybrid / EV"
    },
    pricePerKm: 0.75,
    baseFare: 4.50,
    currency: "USD"
  };

  // Regionally swap imagery and brand
  if (['LON', 'LHR', 'LGW', 'LONDON', 'UK', 'ENGLAND', 'BRITAIN'].some(k => pickup.includes(k))) {
    taxiType.car.brand = "City Cab Dispatch";
    taxiType.car.image = "https://images.unsplash.com/photo-1538332576228-eb5b4c4de6f5?auto=format&fit=crop&q=80&w=800"; // Enforce Yellow/Generic
    taxiType.pricePerKm = 0.95;
  } else if (['JFK', 'EWR', 'LGA', 'NYC', 'NY', 'USA', 'AMERICA', 'UNITED STATES'].some(k => pickup.includes(k))) {
    taxiType.car.brand = "City Yellow Cab";
    taxiType.car.image = "https://images.unsplash.com/photo-1538332576228-eb5b4c4de6f5?auto=format&fit=crop&q=80&w=800";
    taxiType.pricePerKm = 0.85;
  } else if (['AF', 'CDG', 'ORY', 'PARIS', 'FRANCE'].some(k => pickup.includes(k))) {
    taxiType.car.brand = "Metro Taxi Service";
    taxiType.car.image = "https://images.unsplash.com/photo-1538332576228-eb5b4c4de6f5?auto=format&fit=crop&q=80&w=800"; // Enforce Yellow/Generic
    taxiType.pricePerKm = 0.90;
  }

  // Randomize Price a bit for realism (+/- 5%)
  const randomize = (val: number) => val * (0.95 + Math.random() * 0.1);
  taxiType.pricePerKm = randomize(taxiType.pricePerKm);
  taxiType.baseFare = randomize(taxiType.baseFare);

  // Calculate estimated total based on fixed 20km city transfer for search results
  const estimatedDistanceKm = 20;
  const rawPrice = taxiType.baseFare + (taxiType.pricePerKm * estimatedDistanceKm);

  // Apply Seasonality & Pricing Guards
  const finalPrice = calculateClientPrice(rawPrice, 1.05);

  // Add Rental Agency Options for "Car Rental Service"
  const rentals = [
    {
      id: `rental-${pickup}-sixt-luxury`,
      agency: "Sixt Platinum",
      provider: "LOCAL_V2",
      car: {
        brand: "Mercedes-Benz S-Class",
        type: "Luxury Sedan",
        passengers: 4,
        bags: 3,
        image: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&q=80&w=800",
        transmission: "automatic",
        fuel: "Petrol / Hybrid"
      },
      priceTotal: calculateClientPrice(taxiType.baseFare + 145.00, 1.05),
      badges: ["Chauffeur Available", "First Class Experience", "GPS Included"]
    },
    {
      id: `rental-${pickup}-hertz-suv`,
      agency: "Hertz Gold",
      provider: "LOCAL_V2",
      car: {
        brand: "Range Rover Velar",
        type: "Premium SUV",
        passengers: 5,
        bags: 5,
        image: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=800",
        transmission: "automatic",
        fuel: "Diesel / Hybrid"
      },
      priceTotal: calculateClientPrice(taxiType.baseFare + 115.00, 1.05),
      badges: ["4x4 Drive", "High Clearance", "Unlimited KM"]
    },
    {
      id: `rental-${pickup}-avis-ev`,
      agency: "Avis Electric",
      provider: "LOCAL_V2",
      car: {
        brand: "Tesla Model 3",
        type: "Luxury EV",
        passengers: 5,
        bags: 3,
        image: "https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&q=80&w=800",
        transmission: "automatic",
        fuel: "Pure Electric"
      },
      priceTotal: calculateClientPrice(taxiType.baseFare + 85.00, 1.05),
      badges: ["Autopilot Ready", "Supercharging", "Eco-Friendly"]
    },
    {
      id: `rental-${pickup}-enterprise-std`,
      agency: "Enterprise Choice",
      provider: "LOCAL_V2",
      car: {
        brand: "Toyota Camry",
        type: "Standard Sedan",
        passengers: 5,
        bags: 4,
        image: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&q=80&w=800",
        transmission: "automatic",
        fuel: "Petrol"
      },
      priceTotal: calculateClientPrice(taxiType.baseFare + 45.00, 1.05),
      badges: ["Reliable Choice", "Fuel Efficient", "Daily Wash"]
    },
    {
      id: `rental-${pickup}-exotic-sport`,
      agency: "Exotic Drive",
      provider: "LOCAL_V2",
      car: {
        brand: "Porsche 911 Carrera",
        type: "Luxury Sport",
        passengers: 2,
        bags: 1,
        image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=800",
        transmission: "automatic",
        fuel: "Petrol"
      },
      priceTotal: calculateClientPrice(taxiType.baseFare + 295.00, 1.05),
      badges: ["High Performance", "Head Turner", "Limited Selection"]
    },
    {
      id: `rental-${pickup}-budget-van`,
      agency: "Budget Family",
      provider: "LOCAL_V2",
      car: {
        brand: "Chrysler Pacifica",
        type: "Luxury Minivan",
        passengers: 7,
        bags: 6,
        image: "https://images.unsplash.com/photo-1517524008436-bbdb03ac4ca3?auto=format&fit=crop&q=80&w=800",
        transmission: "automatic",
        fuel: "Hybrid / Petrol"
      },
      priceTotal: calculateClientPrice(taxiType.baseFare + 95.00, 1.05),
      badges: ["Family Friendly", "Large Capacity", "Slide Doors"]
    }
  ];

  return [
    {
      ...taxiType,
      priceTotal: finalPrice,
      estimatedDistance: estimatedDistanceKm,
      badges: ["Local Licensed", "No-Loss Guard", "Fixed Rate Available"]
    },
    ...rentals
  ];
};
