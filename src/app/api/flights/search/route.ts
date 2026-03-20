import { NextResponse } from 'next/server';
import { findCity } from '@/lib/geo';
import { amadeus, hasAmadeusKeys } from '@/lib/amadeus';
import { MAJOR_AIRLINES } from '@/lib/airlines';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const origin = searchParams.get('origin') || 'NYC';
  const destination = searchParams.get('destination') || 'LAX';
  const departureDate = searchParams.get('departureDate') || new Date().toISOString().split('T')[0];
  const returnDate = searchParams.get('returnDate');
  const tripType = searchParams.get('tripType') || 'oneway';

  // Use the new findCity function to resolve flexible text inputs to IATA codes.
  const originLocation = findCity(origin);
  const destinationLocation = findCity(destination);

  // Fallback to uppercase input if no specific city is found (for 3-letter codes)
  const uOrigin = originLocation?.code || origin.toUpperCase();
  const uDest = destinationLocation?.code || destination.toUpperCase();

  if (!hasAmadeusKeys) {
    const airlinesList = MAJOR_AIRLINES;

    const { getDistanceBetweenCodes, MAJOR_CITIES } = await import('@/lib/geo');
    const distance = getDistanceBetweenCodes(uOrigin, uDest);

    // Regional Pricing Logic
    const isSameRegion = originLocation && destinationLocation && originLocation.region === destinationLocation.region;
    const isSameCountry = originLocation && destinationLocation && originLocation.country === destinationLocation.country;

    // Regional Discount Factor (flights in same region are cheaper per km)
    // Make same-country flights even cheaper.
    const regionalFactor = isSameCountry ? 0.65 : (isSameRegion ? 0.80 : 1.0);

    // Logic: Distance-based base, then multiply if roundtrip
    // Lowered base calculation for "Wholesale" pricing visual
    const singleLegBase = Math.max(50, (distance * 0.05 * regionalFactor) + 30);
    const distanceBasePrice = returnDate ? (singleLegBase * 1.80) : singleLegBase;

    const mockData = airlinesList.map((air, idx) => {
      // Small variation in price based on airline prestige
      const varPrice = (distanceBasePrice * (1 + (idx * 0.04)) + (Math.random() * 40)).toFixed(2);
      const depH = idx % 2 === 0 ? '08' : '15';
      const arrH = idx % 2 === 0 ? '21' : '07';

      // Regional stops: Intra-region flights usually non-stop or 1 stop
      const stops = isSameRegion ? (idx < 2 ? 0 : 1) : (idx % 3 === 0 ? 0 : idx % 3 === 1 ? 1 : 2);

      const layovers = stops > 0 ? [
        { iataCode: isSameRegion ? 'ADD' : 'LHR', city: isSameRegion ? 'Addis' : 'London', duration: '1h 30m' },
        ...(stops > 1 ? [{ iataCode: 'DXB', city: 'Dubai', duration: '2h 45m' }] : [])
      ] : [];

      // Calculate total duration roughly (e.g. 11h 45m)
      const totalH = isSameRegion ? Math.max(1, Math.round(distance / 800)) : Math.max(6, Math.round(distance / 750) + (stops * 2));
      const totalM = 45;

      return {
        id: `mock-${idx}`,
        airline: air.name,
        alliance: air.alliance,
        logo: air.logo,
        flightNumber: `${air.code} ${100 + idx}`,
        priceTotal: varPrice,
        currency: 'USD',
        layovers: stops,
        layoverDetails: layovers,
        totalTravelTime: `${totalH}h ${totalM}m`,
        departure: { iataCode: uOrigin.substring(0, 3), at: `${departureDate}T${depH}:00:00` },
        arrival: { iataCode: uDest.substring(0, 3), at: `${departureDate}T${arrH}:30:00` },
        isRoundTrip: !!returnDate,
        returnDate: returnDate,
        returnLeg: returnDate ? {
          departure: { iataCode: uDest.substring(0, 3), at: `${returnDate}T${idx % 2 === 0 ? '09' : '17'}:00:00` },
          arrival: { iataCode: uOrigin.substring(0, 3), at: `${returnDate}T${idx % 2 === 0 ? '16' : '01'}:30:00` },
          layovers: stops > 1 ? 1 : 0
        } : null
      };
    });

    return NextResponse.json({ source: 'MOCK', data: mockData });
  }

  let originCode = origin;
  let destinationCode = destination;

  try {
    // Resolve codes
    if (origin.length > 3) {
      const resp = await amadeus.referenceData.locations.get({ subType: 'AIRPORT,CITY', keyword: origin });
      if (resp.data?.[0]?.iataCode) originCode = resp.data[0].iataCode;
    }
    if (destination.length > 3) {
      const resp = await amadeus.referenceData.locations.get({ subType: 'AIRPORT,CITY', keyword: destination });
      if (resp.data?.[0]?.iataCode) destinationCode = resp.data[0].iataCode;
    }

    // Call live Amadeus API
    const params: any = {
      originLocationCode: originCode,
      destinationLocationCode: destinationCode,
      departureDate: departureDate,
      adults: '1',
      max: 10
    };

    if (returnDate && tripType === 'roundtrip') {
      params.returnDate = returnDate;
    }

    const response = await amadeus.shopping.flightOffersSearch.get(params);

    const data = response.data.map((offer: any) => {
      const segment = offer.itineraries[0].segments[0];
      return {
        id: offer.id,
        airline: segment.carrierCode,
        flightNumber: `${segment.carrierCode} ${segment.number}`,
        priceTotal: offer.price.total,
        currency: offer.price.currency,
        departure: segment.departure,
        arrival: segment.arrival,
        isRoundTrip: !!returnDate
      };
    });

    return NextResponse.json({ source: 'LIVE', data });
  } catch (error) {
    console.error('Amadeus API Error:', error);
    return NextResponse.json({ error: 'Failed to fetch flights' }, { status: 500 });
  }
}
