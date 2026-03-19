import Amadeus from 'amadeus';

// Retrieve credentials from environment
const clientId = process.env.AMADEUS_CLIENT_ID;
const clientSecret = process.env.AMADEUS_CLIENT_SECRET;

export const hasAmadeusKeys = Boolean(clientId && clientSecret);

export const amadeus = hasAmadeusKeys
  ? new Amadeus({
      clientId: clientId,
      clientSecret: clientSecret,
    })
  : null;
