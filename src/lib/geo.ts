/**
 * Geographic Information and Utilities
 * Provides coordinates for major world cities and distance calculation via Haversine formula.
 * Covers 200+ airports across all continents for domestic, regional, and international routing.
 */

export interface City {
  name: string;
  code: string;
  lat: number;
  lon: number;
  country: string;
  region: 'NAM' | 'EUR' | 'AFR' | 'ASIA' | 'OCE' | 'LATAM' | 'MEA';
}

export const MAJOR_CITIES: Record<string, City> = {
  // ─── NORTH AMERICA — USA DOMESTIC ────────────────────────────────────────
  'JFK': { name: 'New York JFK', code: 'JFK', lat: 40.6413, lon: -73.7781, country: 'USA', region: 'NAM' },
  'LGA': { name: 'New York LaGuardia', code: 'LGA', lat: 40.7769, lon: -73.8740, country: 'USA', region: 'NAM' },
  'EWR': { name: 'New Jersey Newark', code: 'EWR', lat: 40.6895, lon: -74.1745, country: 'USA', region: 'NAM' },
  'ATL': { name: 'Atlanta', code: 'ATL', lat: 33.6407, lon: -84.4277, country: 'USA', region: 'NAM' },
  'LAX': { name: 'Los Angeles', code: 'LAX', lat: 33.9416, lon: -118.4085, country: 'USA', region: 'NAM' },
  'ORD': { name: "Chicago O'Hare", code: 'ORD', lat: 41.9742, lon: -87.9073, country: 'USA', region: 'NAM' },
  'MDW': { name: 'Chicago Midway', code: 'MDW', lat: 41.7868, lon: -87.7522, country: 'USA', region: 'NAM' },
  'DFW': { name: 'Dallas Fort Worth', code: 'DFW', lat: 32.8998, lon: -97.0403, country: 'USA', region: 'NAM' },
  'DEN': { name: 'Denver', code: 'DEN', lat: 39.8561, lon: -104.6737, country: 'USA', region: 'NAM' },
  'SFO': { name: 'San Francisco', code: 'SFO', lat: 37.6213, lon: -122.3790, country: 'USA', region: 'NAM' },
  'SEA': { name: 'Seattle', code: 'SEA', lat: 47.4502, lon: -122.3088, country: 'USA', region: 'NAM' },
  'MIA': { name: 'Miami', code: 'MIA', lat: 25.7959, lon: -80.2870, country: 'USA', region: 'NAM' },
  'MCO': { name: 'Orlando', code: 'MCO', lat: 28.4312, lon: -81.3081, country: 'USA', region: 'NAM' },
  'BOS': { name: 'Boston', code: 'BOS', lat: 42.3656, lon: -71.0096, country: 'USA', region: 'NAM' },
  'IAH': { name: 'Houston Bush Intl', code: 'IAH', lat: 29.9902, lon: -95.3368, country: 'USA', region: 'NAM' },
  'HOU': { name: 'Houston Hobby', code: 'HOU', lat: 29.6454, lon: -95.2789, country: 'USA', region: 'NAM' },
  'PHL': { name: 'Philadelphia', code: 'PHL', lat: 39.8744, lon: -75.2424, country: 'USA', region: 'NAM' },
  'PHX': { name: 'Phoenix', code: 'PHX', lat: 33.4373, lon: -112.0078, country: 'USA', region: 'NAM' },
  'LAS': { name: 'Las Vegas', code: 'LAS', lat: 36.0840, lon: -115.1537, country: 'USA', region: 'NAM' },
  'MSP': { name: 'Minneapolis', code: 'MSP', lat: 44.8848, lon: -93.2223, country: 'USA', region: 'NAM' },
  'DTW': { name: 'Detroit', code: 'DTW', lat: 42.2162, lon: -83.3554, country: 'USA', region: 'NAM' },
  'CLT': { name: 'Charlotte', code: 'CLT', lat: 35.2144, lon: -80.9473, country: 'USA', region: 'NAM' },
  'DCA': { name: 'Washington Reagan', code: 'DCA', lat: 38.8521, lon: -77.0377, country: 'USA', region: 'NAM' },
  'IAD': { name: 'Washington Dulles', code: 'IAD', lat: 38.9531, lon: -77.4565, country: 'USA', region: 'NAM' },
  'SAN': { name: 'San Diego', code: 'SAN', lat: 32.7338, lon: -117.1933, country: 'USA', region: 'NAM' },
  'PDX': { name: 'Portland OR', code: 'PDX', lat: 45.5898, lon: -122.5951, country: 'USA', region: 'NAM' },
  'SLC': { name: 'Salt Lake City', code: 'SLC', lat: 40.7884, lon: -111.9778, country: 'USA', region: 'NAM' },
  'ANC': { name: 'Anchorage Alaska', code: 'ANC', lat: 61.1742, lon: -149.9961, country: 'USA', region: 'NAM' },
  'HNL': { name: 'Honolulu Hawaii', code: 'HNL', lat: 21.3187, lon: -157.9225, country: 'USA', region: 'NAM' },
  'BNA': { name: 'Nashville', code: 'BNA', lat: 36.1245, lon: -86.6782, country: 'USA', region: 'NAM' },
  'AUS': { name: 'Austin Texas', code: 'AUS', lat: 30.1975, lon: -97.6664, country: 'USA', region: 'NAM' },
  'STL': { name: 'St. Louis', code: 'STL', lat: 38.7487, lon: -90.3700, country: 'USA', region: 'NAM' },
  'MCI': { name: 'Kansas City', code: 'MCI', lat: 39.2976, lon: -94.7139, country: 'USA', region: 'NAM' },
  'MSY': { name: 'New Orleans', code: 'MSY', lat: 29.9934, lon: -90.2580, country: 'USA', region: 'NAM' },
  'RDU': { name: 'Raleigh-Durham', code: 'RDU', lat: 35.8776, lon: -78.7875, country: 'USA', region: 'NAM' },
  'TPA': { name: 'Tampa', code: 'TPA', lat: 27.9755, lon: -82.5332, country: 'USA', region: 'NAM' },
  'BWI': { name: 'Baltimore', code: 'BWI', lat: 39.1754, lon: -76.6683, country: 'USA', region: 'NAM' },
  'OAK': { name: 'Oakland CA', code: 'OAK', lat: 37.7213, lon: -122.2208, country: 'USA', region: 'NAM' },
  'SJC': { name: 'San Jose CA', code: 'SJC', lat: 37.3626, lon: -121.9290, country: 'USA', region: 'NAM' },

  // ─── CANADA ──────────────────────────────────────────────────────────────
  'YYZ': { name: 'Toronto Pearson', code: 'YYZ', lat: 43.6777, lon: -79.6248, country: 'Canada', region: 'NAM' },
  'YVR': { name: 'Vancouver', code: 'YVR', lat: 49.1947, lon: -123.1792, country: 'Canada', region: 'NAM' },
  'YUL': { name: 'Montreal', code: 'YUL', lat: 45.4706, lon: -73.7408, country: 'Canada', region: 'NAM' },
  'YYC': { name: 'Calgary', code: 'YYC', lat: 51.1315, lon: -114.0108, country: 'Canada', region: 'NAM' },
  'YEG': { name: 'Edmonton', code: 'YEG', lat: 53.3097, lon: -113.5797, country: 'Canada', region: 'NAM' },
  'YOW': { name: 'Ottawa', code: 'YOW', lat: 45.3225, lon: -75.6692, country: 'Canada', region: 'NAM' },
  'YHZ': { name: 'Halifax Canada', code: 'YHZ', lat: 44.8808, lon: -63.5086, country: 'Canada', region: 'NAM' },

  // ─── MEXICO & CARIBBEAN ──────────────────────────────────────────────────
  'MEX': { name: 'Mexico City', code: 'MEX', lat: 19.4361, lon: -99.0719, country: 'Mexico', region: 'NAM' },
  'CUN': { name: 'Cancun Mexico', code: 'CUN', lat: 21.0365, lon: -86.8771, country: 'Mexico', region: 'NAM' },
  'GDL': { name: 'Guadalajara', code: 'GDL', lat: 20.5218, lon: -103.3110, country: 'Mexico', region: 'NAM' },
  'MBJ': { name: 'Montego Bay Jamaica', code: 'MBJ', lat: 18.5037, lon: -77.9136, country: 'Jamaica', region: 'NAM' },
  'KIN': { name: 'Kingston Jamaica', code: 'KIN', lat: 17.9357, lon: -76.7875, country: 'Jamaica', region: 'NAM' },
  'NAS': { name: 'Nassau Bahamas', code: 'NAS', lat: 25.0390, lon: -77.4662, country: 'Bahamas', region: 'NAM' },
  'HAV': { name: 'Havana Cuba', code: 'HAV', lat: 22.9892, lon: -82.4091, country: 'Cuba', region: 'NAM' },
  'SDQ': { name: 'Santo Domingo', code: 'SDQ', lat: 18.4297, lon: -69.6689, country: 'Dom. Republic', region: 'NAM' },
  'PUJ': { name: 'Punta Cana', code: 'PUJ', lat: 18.5674, lon: -68.3634, country: 'Dom. Republic', region: 'NAM' },
  'SJU': { name: 'San Juan PR', code: 'SJU', lat: 18.4394, lon: -66.0018, country: 'Puerto Rico', region: 'NAM' },
  'POS': { name: 'Port of Spain', code: 'POS', lat: 10.5954, lon: -61.3372, country: 'Trinidad', region: 'NAM' },

  // ─── SOUTH AMERICA ───────────────────────────────────────────────────────
  'GRU': { name: 'São Paulo Guarulhos', code: 'GRU', lat: -23.4356, lon: -46.4731, country: 'Brazil', region: 'LATAM' },
  'GIG': { name: 'Rio de Janeiro', code: 'GIG', lat: -22.8099, lon: -43.2506, country: 'Brazil', region: 'LATAM' },
  'BSB': { name: 'Brasilia Brazil', code: 'BSB', lat: -15.8711, lon: -47.9186, country: 'Brazil', region: 'LATAM' },
  'FOR': { name: 'Fortaleza Brazil', code: 'FOR', lat: -3.7762, lon: -38.5326, country: 'Brazil', region: 'LATAM' },
  'SSA': { name: 'Salvador Brazil', code: 'SSA', lat: -12.9111, lon: -38.3325, country: 'Brazil', region: 'LATAM' },
  'EZE': { name: 'Buenos Aires', code: 'EZE', lat: -34.8222, lon: -58.5358, country: 'Argentina', region: 'LATAM' },
  'AEP': { name: 'Buenos Aires Jorge N.', code: 'AEP', lat: -34.5592, lon: -58.4156, country: 'Argentina', region: 'LATAM' },
  'SCL': { name: 'Santiago Chile', code: 'SCL', lat: -33.3930, lon: -70.7858, country: 'Chile', region: 'LATAM' },
  'LIM': { name: 'Lima Peru', code: 'LIM', lat: -12.0219, lon: -77.1143, country: 'Peru', region: 'LATAM' },
  'BOG': { name: 'Bogota Colombia', code: 'BOG', lat: 4.7016, lon: -74.1469, country: 'Colombia', region: 'LATAM' },
  'MDE': { name: 'Medellin Colombia', code: 'MDE', lat: 6.1645, lon: -75.4231, country: 'Colombia', region: 'LATAM' },
  'UIO': { name: 'Quito Ecuador', code: 'UIO', lat: -0.1292, lon: -78.3575, country: 'Ecuador', region: 'LATAM' },
  'GYE': { name: 'Guayaquil Ecuador', code: 'GYE', lat: -2.1574, lon: -79.8836, country: 'Ecuador', region: 'LATAM' },
  'CCS': { name: 'Caracas Venezuela', code: 'CCS', lat: 10.6031, lon: -66.9913, country: 'Venezuela', region: 'LATAM' },
  'PTY': { name: 'Panama City', code: 'PTY', lat: 9.0714, lon: -79.3835, country: 'Panama', region: 'LATAM' },
  'MVD': { name: 'Montevideo Uruguay', code: 'MVD', lat: -34.8384, lon: -56.0308, country: 'Uruguay', region: 'LATAM' },
  'ASU': { name: 'Asuncion Paraguay', code: 'ASU', lat: -25.2398, lon: -57.5198, country: 'Paraguay', region: 'LATAM' },
  'REC': { name: 'Recife Brazil', code: 'REC', lat: -8.1268, lon: -34.9228, country: 'Brazil', region: 'LATAM' },
  'POA': { name: 'Porto Alegre Brazil', code: 'POA', lat: -29.9939, lon: -51.1711, country: 'Brazil', region: 'LATAM' },
  'MAO': { name: 'Manaus Brazil', code: 'MAO', lat: -3.0358, lon: -60.0506, country: 'Brazil', region: 'LATAM' },
  'BZE': { name: 'Belize City', code: 'BZE', lat: 17.5391, lon: -88.3082, country: 'Belize', region: 'LATAM' },
  'SAL': { name: 'San Salvador', code: 'SAL', lat: 13.4409, lon: -89.0557, country: 'El Salvador', region: 'LATAM' },
  'GUA': { name: 'Guatemala City', code: 'GUA', lat: 14.5833, lon: -90.5275, country: 'Guatemala', region: 'LATAM' },
  'SAP': { name: 'San Pedro Sula', code: 'SAP', lat: 15.4527, lon: -87.8920, country: 'Honduras', region: 'LATAM' },

  // ─── EUROPE — WESTERN ────────────────────────────────────────────────────
  'LHR': { name: 'London Heathrow', code: 'LHR', lat: 51.4700, lon: -0.4543, country: 'UK', region: 'EUR' },
  'LGW': { name: 'London Gatwick', code: 'LGW', lat: 51.1481, lon: -0.1903, country: 'UK', region: 'EUR' },
  'STN': { name: 'London Stansted', code: 'STN', lat: 51.8850, lon: 0.2350, country: 'UK', region: 'EUR' },
  'MAN': { name: 'Manchester UK', code: 'MAN', lat: 53.3537, lon: -2.2750, country: 'UK', region: 'EUR' },
  'EDI': { name: 'Edinburgh Scotland', code: 'EDI', lat: 55.9500, lon: -3.3725, country: 'UK', region: 'EUR' },
  'BHX': { name: 'Birmingham UK', code: 'BHX', lat: 52.4539, lon: -1.7480, country: 'UK', region: 'EUR' },
  'CDG': { name: 'Paris CDG', code: 'CDG', lat: 49.0097, lon: 2.5479, country: 'France', region: 'EUR' },
  'ORY': { name: 'Paris Orly', code: 'ORY', lat: 48.7233, lon: 2.3794, country: 'France', region: 'EUR' },
  'NCE': { name: 'Nice France', code: 'NCE', lat: 43.6584, lon: 7.2159, country: 'France', region: 'EUR' },
  'LYS': { name: 'Lyon France', code: 'LYS', lat: 45.7256, lon: 5.0810, country: 'France', region: 'EUR' },
  'MRS': { name: 'Marseille France', code: 'MRS', lat: 43.4365, lon: 5.2214, country: 'France', region: 'EUR' },
  'FRA': { name: 'Frankfurt Germany', code: 'FRA', lat: 50.0379, lon: 8.5622, country: 'Germany', region: 'EUR' },
  'MUC': { name: 'Munich Germany', code: 'MUC', lat: 48.3538, lon: 11.7861, country: 'Germany', region: 'EUR' },
  'TXL': { name: 'Berlin Germany', code: 'TXL', lat: 52.5597, lon: 13.2877, country: 'Germany', region: 'EUR' },
  'HAM': { name: 'Hamburg Germany', code: 'HAM', lat: 53.6304, lon: 9.9882, country: 'Germany', region: 'EUR' },
  'MAD': { name: 'Madrid Spain', code: 'MAD', lat: 40.4839, lon: -3.5670, country: 'Spain', region: 'EUR' },
  'BCN': { name: 'Barcelona Spain', code: 'BCN', lat: 41.2971, lon: 2.0785, country: 'Spain', region: 'EUR' },
  'AGP': { name: 'Malaga Spain', code: 'AGP', lat: 36.6749, lon: -4.4991, country: 'Spain', region: 'EUR' },
  'PMI': { name: 'Palma Mallorca', code: 'PMI', lat: 39.5517, lon: 2.7388, country: 'Spain', region: 'EUR' },
  'FCO': { name: 'Rome Fiumicino', code: 'FCO', lat: 41.8003, lon: 12.2389, country: 'Italy', region: 'EUR' },
  'MXP': { name: 'Milan Malpensa', code: 'MXP', lat: 45.6306, lon: 8.7281, country: 'Italy', region: 'EUR' },
  'VCE': { name: 'Venice Italy', code: 'VCE', lat: 45.5053, lon: 12.3519, country: 'Italy', region: 'EUR' },
  'NAP': { name: 'Naples Italy', code: 'NAP', lat: 40.8860, lon: 14.2908, country: 'Italy', region: 'EUR' },
  'AMS': { name: 'Amsterdam', code: 'AMS', lat: 52.3086, lon: 4.7639, country: 'Netherlands', region: 'EUR' },
  'BRU': { name: 'Brussels Belgium', code: 'BRU', lat: 50.9010, lon: 4.4844, country: 'Belgium', region: 'EUR' },
  'ZRH': { name: 'Zurich Switzerland', code: 'ZRH', lat: 47.4647, lon: 8.5492, country: 'Switzerland', region: 'EUR' },
  'GVA': { name: 'Geneva Switzerland', code: 'GVA', lat: 46.2381, lon: 6.1089, country: 'Switzerland', region: 'EUR' },
  'VIE': { name: 'Vienna Austria', code: 'VIE', lat: 48.1103, lon: 16.5697, country: 'Austria', region: 'EUR' },
  'LIS': { name: 'Lisbon Portugal', code: 'LIS', lat: 38.7742, lon: -9.1342, country: 'Portugal', region: 'EUR' },
  'OPO': { name: 'Porto Portugal', code: 'OPO', lat: 41.2481, lon: -8.6814, country: 'Portugal', region: 'EUR' },
  'CPH': { name: 'Copenhagen Denmark', code: 'CPH', lat: 55.6181, lon: 12.6561, country: 'Denmark', region: 'EUR' },
  'OSL': { name: 'Oslo Norway', code: 'OSL', lat: 60.1939, lon: 11.1004, country: 'Norway', region: 'EUR' },
  'ARN': { name: 'Stockholm Sweden', code: 'ARN', lat: 59.6519, lon: 17.9186, country: 'Sweden', region: 'EUR' },
  'HEL': { name: 'Helsinki Finland', code: 'HEL', lat: 60.3172, lon: 24.9633, country: 'Finland', region: 'EUR' },
  'DUB': { name: 'Dublin Ireland', code: 'DUB', lat: 53.4213, lon: -6.2701, country: 'Ireland', region: 'EUR' },

  // ─── EUROPE — EASTERN ────────────────────────────────────────────────────
  'IST': { name: 'Istanbul Turkey', code: 'IST', lat: 41.2753, lon: 28.7519, country: 'Turkey', region: 'EUR' },
  'SAW': { name: 'Istanbul Sabiha', code: 'SAW', lat: 40.8985, lon: 29.3092, country: 'Turkey', region: 'EUR' },
  'ATH': { name: 'Athens Greece', code: 'ATH', lat: 37.9364, lon: 23.9445, country: 'Greece', region: 'EUR' },
  'WAW': { name: 'Warsaw Poland', code: 'WAW', lat: 52.1657, lon: 20.9671, country: 'Poland', region: 'EUR' },
  'BUD': { name: 'Budapest Hungary', code: 'BUD', lat: 47.4298, lon: 19.2611, country: 'Hungary', region: 'EUR' },
  'PRG': { name: 'Prague Czech Rep.', code: 'PRG', lat: 50.1008, lon: 14.2600, country: 'Czech Rep.', region: 'EUR' },
  'OTP': { name: 'Bucharest Romania', code: 'OTP', lat: 44.5711, lon: 26.0850, country: 'Romania', region: 'EUR' },
  'SVO': { name: 'Moscow Sheremetyevo', code: 'SVO', lat: 55.9726, lon: 37.4146, country: 'Russia', region: 'EUR' },
  'LED': { name: 'St. Petersburg', code: 'LED', lat: 59.8003, lon: 30.2625, country: 'Russia', region: 'EUR' },
  'KBP': { name: 'Kyiv Ukraine', code: 'KBP', lat: 50.3450, lon: 30.8947, country: 'Ukraine', region: 'EUR' },

  // ─── AFRICA — EAST ───────────────────────────────────────────────────────
  'EBB': { name: 'Entebbe Uganda', code: 'EBB', lat: 0.0424, lon: 32.4435, country: 'Uganda', region: 'AFR' },
  'NBO': { name: 'Nairobi Kenya', code: 'NBO', lat: -1.3192, lon: 36.9275, country: 'Kenya', region: 'AFR' },
  'MBA': { name: 'Mombasa Kenya', code: 'MBA', lat: -4.0348, lon: 39.5942, country: 'Kenya', region: 'AFR' },
  'ADD': { name: 'Addis Ababa Ethiopia', code: 'ADD', lat: 8.9778, lon: 38.7993, country: 'Ethiopia', region: 'AFR' },
  'JRO': { name: 'Kilimanjaro Tanzania', code: 'JRO', lat: -3.4294, lon: 37.0745, country: 'Tanzania', region: 'AFR' },
  'DAR': { name: 'Dar es Salaam', code: 'DAR', lat: -6.8781, lon: 39.2026, country: 'Tanzania', region: 'AFR' },
  'ZNZ': { name: 'Zanzibar Tanzania', code: 'ZNZ', lat: -6.2220, lon: 39.2249, country: 'Tanzania', region: 'AFR' },
  'KGL': { name: 'Kigali Rwanda', code: 'KGL', lat: -1.9686, lon: 30.1395, country: 'Rwanda', region: 'AFR' },
  'BJM': { name: 'Bujumbura Burundi', code: 'BJM', lat: -3.3240, lon: 29.3185, country: 'Burundi', region: 'AFR' },

  // ─── AFRICA — WEST ───────────────────────────────────────────────────────
  'LOS': { name: 'Lagos Nigeria', code: 'LOS', lat: 6.5774, lon: 3.3210, country: 'Nigeria', region: 'AFR' },
  'ABV': { name: 'Abuja Nigeria', code: 'ABV', lat: 9.0068, lon: 7.2632, country: 'Nigeria', region: 'AFR' },
  'PHC': { name: 'Port Harcourt Nigeria', code: 'PHC', lat: 5.0155, lon: 6.9496, country: 'Nigeria', region: 'AFR' },
  'ACC': { name: 'Accra Ghana', code: 'ACC', lat: 5.6051, lon: -0.1667, country: 'Ghana', region: 'AFR' },
  'DKR': { name: 'Dakar Senegal', code: 'DKR', lat: 14.7397, lon: -17.4902, country: 'Senegal', region: 'AFR' },
  'ABJ': { name: 'Abidjan Ivory Coast', code: 'ABJ', lat: 5.2613, lon: -3.9263, country: 'Ivory Coast', region: 'AFR' },
  'COO': { name: 'Cotonou Benin', code: 'COO', lat: 6.3572, lon: 2.3845, country: 'Benin', region: 'AFR' },
  'LFW': { name: 'Lome Togo', code: 'LFW', lat: 6.1657, lon: 1.2544, country: 'Togo', region: 'AFR' },
  'BKO': { name: 'Bamako Mali', code: 'BKO', lat: 12.5335, lon: -7.9499, country: 'Mali', region: 'AFR' },
  'OUA': { name: 'Ouagadougou B.Faso', code: 'OUA', lat: 12.3532, lon: -1.5124, country: 'Burkina Faso', region: 'AFR' },
  'ROB': { name: 'Monrovia Liberia', code: 'ROB', lat: 6.2338, lon: -10.3623, country: 'Liberia', region: 'AFR' },
  'FNA': { name: 'Freetown Sierra Leone', code: 'FNA', lat: 8.6164, lon: -13.1950, country: 'Sierra Leone', region: 'AFR' },
  'CMN': { name: 'Casablanca Morocco', code: 'CMN', lat: 33.3675, lon: -7.5898, country: 'Morocco', region: 'AFR' },
  'RAK': { name: 'Marrakech Morocco', code: 'RAK', lat: 31.6069, lon: -8.0363, country: 'Morocco', region: 'AFR' },

  // ─── AFRICA — NORTH ──────────────────────────────────────────────────────
  'CAI': { name: 'Cairo Egypt', code: 'CAI', lat: 30.1219, lon: 31.4056, country: 'Egypt', region: 'AFR' },
  'HRG': { name: 'Hurghada Egypt', code: 'HRG', lat: 27.1783, lon: 33.7994, country: 'Egypt', region: 'AFR' },
  'SSH': { name: 'Sharm El Sheikh', code: 'SSH', lat: 27.9773, lon: 34.3950, country: 'Egypt', region: 'AFR' },
  'TUN': { name: 'Tunis Tunisia', code: 'TUN', lat: 36.8510, lon: 10.2272, country: 'Tunisia', region: 'AFR' },
  'ALG': { name: 'Algiers Algeria', code: 'ALG', lat: 36.6910, lon: 3.2153, country: 'Algeria', region: 'AFR' },

  // ─── AFRICA — SOUTH & CENTRAL ────────────────────────────────────────────
  'JNB': { name: 'Johannesburg S.Africa', code: 'JNB', lat: -26.1392, lon: 28.2460, country: 'South Africa', region: 'AFR' },
  'CPT': { name: 'Cape Town S.Africa', code: 'CPT', lat: -33.9715, lon: 18.6021, country: 'South Africa', region: 'AFR' },
  'DUR': { name: 'Durban S.Africa', code: 'DUR', lat: -29.9701, lon: 30.9505, country: 'South Africa', region: 'AFR' },
  'HRE': { name: 'Harare Zimbabwe', code: 'HRE', lat: -17.9318, lon: 31.0928, country: 'Zimbabwe', region: 'AFR' },
  'LUN': { name: 'Lusaka Zambia', code: 'LUN', lat: -15.3308, lon: 28.4526, country: 'Zambia', region: 'AFR' },
  'FIH': { name: 'Kinshasa DRC', code: 'FIH', lat: -4.3858, lon: 15.4446, country: 'DRC', region: 'AFR' },
  'DLA': { name: 'Douala Cameroon', code: 'DLA', lat: 4.0061, lon: 9.7193, country: 'Cameroon', region: 'AFR' },
  'LBV': { name: 'Libreville Gabon', code: 'LBV', lat: 0.4586, lon: 9.4123, country: 'Gabon', region: 'AFR' },
  'MRU': { name: 'Mauritius Island', code: 'MRU', lat: -20.4302, lon: 57.6836, country: 'Mauritius', region: 'AFR' },
  'TNR': { name: 'Antananarivo Madg.', code: 'TNR', lat: -18.7969, lon: 47.4788, country: 'Madagascar', region: 'AFR' },
  'ZNZ2': { name: 'Seychelles Mahe', code: 'SEZ', lat: -4.6744, lon: 55.5218, country: 'Seychelles', region: 'AFR' },
  'WDH': { name: 'Windhoek Namibia', code: 'WDH', lat: -22.4799, lon: 17.4709, country: 'Namibia', region: 'AFR' },
  'GBE': { name: 'Gaborone Botswana', code: 'GBE', lat: -24.5552, lon: 25.9182, country: 'Botswana', region: 'AFR' },

  // ─── MIDDLE EAST ─────────────────────────────────────────────────────────
  'DXB': { name: 'Dubai International', code: 'DXB', lat: 25.2532, lon: 55.3657, country: 'UAE', region: 'MEA' },
  'AUH': { name: 'Abu Dhabi UAE', code: 'AUH', lat: 24.4330, lon: 54.6511, country: 'UAE', region: 'MEA' },
  'SHJ': { name: 'Sharjah UAE', code: 'SHJ', lat: 25.3286, lon: 55.5136, country: 'UAE', region: 'MEA' },
  'DOH': { name: 'Doha Qatar', code: 'DOH', lat: 25.2731, lon: 51.6081, country: 'Qatar', region: 'MEA' },
  'AMM': { name: 'Amman Jordan', code: 'AMM', lat: 31.7225, lon: 35.9932, country: 'Jordan', region: 'MEA' },
  'TLV': { name: 'Tel Aviv Israel', code: 'TLV', lat: 32.0055, lon: 34.8854, country: 'Israel', region: 'MEA' },
  'RUH': { name: 'Riyadh Saudi Arabia', code: 'RUH', lat: 24.9576, lon: 46.6988, country: 'Saudi Arabia', region: 'MEA' },
  'JED': { name: 'Jeddah Saudi Arabia', code: 'JED', lat: 21.6796, lon: 39.1565, country: 'Saudi Arabia', region: 'MEA' },
  'BAH': { name: 'Bahrain Island', code: 'BAH', lat: 26.2708, lon: 50.6336, country: 'Bahrain', region: 'MEA' },
  'KWI': { name: 'Kuwait City', code: 'KWI', lat: 29.2267, lon: 47.9689, country: 'Kuwait', region: 'MEA' },
  'MCT': { name: 'Muscat Oman', code: 'MCT', lat: 23.5933, lon: 58.2844, country: 'Oman', region: 'MEA' },
  'BGW': { name: 'Baghdad Iraq', code: 'BGW', lat: 33.2626, lon: 44.2346, country: 'Iraq', region: 'MEA' },
  'BEY': { name: 'Beirut Lebanon', code: 'BEY', lat: 33.8208, lon: 35.4884, country: 'Lebanon', region: 'MEA' },
  'IKA': { name: 'Tehran Iran', code: 'IKA', lat: 35.4161, lon: 51.1522, country: 'Iran', region: 'MEA' },
  'ISF': { name: 'Isfahan Iran', code: 'ISF', lat: 32.7508, lon: 51.8614, country: 'Iran', region: 'MEA' },
  'SYZ': { name: 'Shiraz Iran', code: 'SYZ', lat: 29.5392, lon: 52.5898, country: 'Iran', region: 'MEA' },
  'EBL': { name: 'Erbil Iraq', code: 'EBL', lat: 36.2372, lon: 43.9592, country: 'Iraq', region: 'MEA' },
  'NJF': { name: 'Najaf Iraq', code: 'NJF', lat: 31.9897, lon: 44.4014, country: 'Iraq', region: 'MEA' },
  'GYD': { name: 'Baku Azerbaijan', code: 'GYD', lat: 40.4675, lon: 50.0467, country: 'Azerbaijan', region: 'MEA' },
  'TBS': { name: 'Tbilisi Georgia', code: 'TBS', lat: 41.6692, lon: 44.9547, country: 'Georgia', region: 'MEA' },
  'EVN': { name: 'Yerevan Armenia', code: 'EVN', lat: 40.1472, lon: 44.3958, country: 'Armenia', region: 'MEA' },
  'TAS': { name: 'Tashkent Uzbekistan', code: 'TAS', lat: 41.2579, lon: 69.2812, country: 'Uzbekistan', region: 'MEA' },
  'ALA': { name: 'Almaty Kazakhstan', code: 'ALA', lat: 43.3520, lon: 77.0405, country: 'Kazakhstan', region: 'MEA' },
  'NQZ': { name: 'Astana Kazakhstan', code: 'NQZ', lat: 51.0222, lon: 71.4669, country: 'Kazakhstan', region: 'MEA' },

  // ─── ASIA — SOUTH ────────────────────────────────────────────────────────
  'DEL': { name: 'New Delhi India', code: 'DEL', lat: 28.5562, lon: 77.1000, country: 'India', region: 'ASIA' },
  'BOM': { name: 'Mumbai India', code: 'BOM', lat: 19.0896, lon: 72.8656, country: 'India', region: 'ASIA' },
  'BLR': { name: 'Bangalore India', code: 'BLR', lat: 13.1986, lon: 77.7066, country: 'India', region: 'ASIA' },
  'MAA': { name: 'Chennai India', code: 'MAA', lat: 12.9941, lon: 80.1709, country: 'India', region: 'ASIA' },
  'CCU': { name: 'Kolkata India', code: 'CCU', lat: 22.6542, lon: 88.4467, country: 'India', region: 'ASIA' },
  'HYD': { name: 'Hyderabad India', code: 'HYD', lat: 17.2403, lon: 78.4294, country: 'India', region: 'ASIA' },
  'CMB': { name: 'Colombo Sri Lanka', code: 'CMB', lat: 7.1808, lon: 79.8841, country: 'Sri Lanka', region: 'ASIA' },
  'DAC': { name: 'Dhaka Bangladesh', code: 'DAC', lat: 23.8433, lon: 90.3978, country: 'Bangladesh', region: 'ASIA' },
  'KTM': { name: 'Kathmandu Nepal', code: 'KTM', lat: 27.6966, lon: 85.3591, country: 'Nepal', region: 'ASIA' },
  'KHI': { name: 'Karachi Pakistan', code: 'KHI', lat: 24.9065, lon: 67.1609, country: 'Pakistan', region: 'ASIA' },
  'LHE': { name: 'Lahore Pakistan', code: 'LHE', lat: 31.5216, lon: 74.4036, country: 'Pakistan', region: 'ASIA' },
  'ISB': { name: 'Islamabad Pakistan', code: 'ISB', lat: 33.6167, lon: 73.0997, country: 'Pakistan', region: 'ASIA' },

  // ─── ASIA — EAST ─────────────────────────────────────────────────────────
  'HND': { name: 'Tokyo Haneda', code: 'HND', lat: 35.5494, lon: 139.7798, country: 'Japan', region: 'ASIA' },
  'NRT': { name: 'Tokyo Narita', code: 'NRT', lat: 35.7720, lon: 140.3929, country: 'Japan', region: 'ASIA' },
  'OSA': { name: 'Osaka Japan', code: 'OSA', lat: 34.7855, lon: 135.4381, country: 'Japan', region: 'ASIA' },
  'ICN': { name: 'Seoul Incheon', code: 'ICN', lat: 37.4602, lon: 126.4407, country: 'South Korea', region: 'ASIA' },
  'GMP': { name: 'Seoul Gimpo', code: 'GMP', lat: 37.5586, lon: 126.7942, country: 'South Korea', region: 'ASIA' },
  'PEK': { name: 'Beijing Capital', code: 'PEK', lat: 40.0799, lon: 116.6031, country: 'China', region: 'ASIA' },
  'PVG': { name: 'Shanghai Pudong', code: 'PVG', lat: 31.1443, lon: 121.8083, country: 'China', region: 'ASIA' },
  'CAN': { name: 'Guangzhou China', code: 'CAN', lat: 23.3924, lon: 113.2988, country: 'China', region: 'ASIA' },
  'CTU': { name: 'Chengdu China', code: 'CTU', lat: 30.5785, lon: 103.9470, country: 'China', region: 'ASIA' },
  'HKG': { name: 'Hong Kong', code: 'HKG', lat: 22.3080, lon: 113.9185, country: 'Hong Kong', region: 'ASIA' },
  'TPE': { name: 'Taipei Taiwan', code: 'TPE', lat: 25.0777, lon: 121.2328, country: 'Taiwan', region: 'ASIA' },
  'ULN': { name: 'Ulaanbaatar Mongolia', code: 'ULN', lat: 47.8431, lon: 106.7661, country: 'Mongolia', region: 'ASIA' },

  // ─── ASIA — SOUTHEAST ────────────────────────────────────────────────────
  'SIN': { name: 'Singapore Changi', code: 'SIN', lat: 1.3502, lon: 103.9893, country: 'Singapore', region: 'ASIA' },
  'BKK': { name: 'Bangkok Suvarnabhumi', code: 'BKK', lat: 13.6900, lon: 100.7501, country: 'Thailand', region: 'ASIA' },
  'HKT': { name: 'Phuket Thailand', code: 'HKT', lat: 8.1132, lon: 98.3170, country: 'Thailand', region: 'ASIA' },
  'CNX': { name: 'Chiang Mai Thailand', code: 'CNX', lat: 18.7669, lon: 98.9626, country: 'Thailand', region: 'ASIA' },
  'KUL': { name: 'Kuala Lumpur', code: 'KUL', lat: 2.7456, lon: 101.7072, country: 'Malaysia', region: 'ASIA' },
  'CGK': { name: 'Jakarta Indonesia', code: 'CGK', lat: -6.1256, lon: 106.6559, country: 'Indonesia', region: 'ASIA' },
  'DPS': { name: 'Bali Indonesia', code: 'DPS', lat: -8.7482, lon: 115.1672, country: 'Indonesia', region: 'ASIA' },
  'SUB': { name: 'Surabaya Indonesia', code: 'SUB', lat: -7.3797, lon: 112.7876, country: 'Indonesia', region: 'ASIA' },
  'MNL': { name: 'Manila Philippines', code: 'MNL', lat: 14.5086, lon: 121.0197, country: 'Philippines', region: 'ASIA' },
  'CEB': { name: 'Cebu Philippines', code: 'CEB', lat: 10.3075, lon: 123.9791, country: 'Philippines', region: 'ASIA' },
  'SGN': { name: 'Ho Chi Minh City', code: 'SGN', lat: 10.8188, lon: 106.6520, country: 'Vietnam', region: 'ASIA' },
  'HAN': { name: 'Hanoi Vietnam', code: 'HAN', lat: 21.2212, lon: 105.8072, country: 'Vietnam', region: 'ASIA' },
  'DAD': { name: 'Da Nang Vietnam', code: 'DAD', lat: 16.0439, lon: 108.1992, country: 'Vietnam', region: 'ASIA' },
  'PNH': { name: 'Phnom Penh Cambodia', code: 'PNH', lat: 11.5466, lon: 104.8440, country: 'Cambodia', region: 'ASIA' },
  'REP': { name: 'Siem Reap Cambodia', code: 'REP', lat: 13.4107, lon: 103.8133, country: 'Cambodia', region: 'ASIA' },
  'RGN': { name: 'Yangon Myanmar', code: 'RGN', lat: 16.9073, lon: 96.1332, country: 'Myanmar', region: 'ASIA' },
  'VTE': { name: 'Vientiane Laos', code: 'VTE', lat: 17.9883, lon: 102.5631, country: 'Laos', region: 'ASIA' },
  'MLE': { name: 'Male Maldives', code: 'MLE', lat: 4.1918, lon: 73.5291, country: 'Maldives', region: 'ASIA' },
  'BWN': { name: 'Brunei Bandar Seri', code: 'BWN', lat: 4.9442, lon: 114.9284, country: 'Brunei', region: 'ASIA' },
  'LPQ': { name: 'Luang Prabang', code: 'LPQ', lat: 19.8978, lon: 102.1625, country: 'Laos', region: 'ASIA' },
  'USM': { name: 'Koh Samui Thailand', code: 'USM', lat: 9.5126, lon: 100.0624, country: 'Thailand', region: 'ASIA' },

  // ─── OCEANIA ─────────────────────────────────────────────────────────────
  'SYD': { name: 'Sydney Australia', code: 'SYD', lat: -33.9399, lon: 151.1753, country: 'Australia', region: 'OCE' },
  'MEL': { name: 'Melbourne Australia', code: 'MEL', lat: -37.6690, lon: 144.8410, country: 'Australia', region: 'OCE' },
  'BNE': { name: 'Brisbane Australia', code: 'BNE', lat: -27.3842, lon: 153.1175, country: 'Australia', region: 'OCE' },
  'PER': { name: 'Perth Australia', code: 'PER', lat: -31.9403, lon: 115.9669, country: 'Australia', region: 'OCE' },
  'ADL': { name: 'Adelaide Australia', code: 'ADL', lat: -34.9452, lon: 138.5300, country: 'Australia', region: 'OCE' },
  'DRW': { name: 'Darwin Australia', code: 'DRW', lat: -12.4147, lon: 130.8765, country: 'Australia', region: 'OCE' },
  'AKL': { name: 'Auckland NZ', code: 'AKL', lat: -37.0081, lon: 174.7917, country: 'New Zealand', region: 'OCE' },
  'CHC': { name: 'Christchurch NZ', code: 'CHC', lat: -43.4894, lon: 172.5320, country: 'New Zealand', region: 'OCE' },
  'WLG': { name: 'Wellington NZ', code: 'WLG', lat: -41.3272, lon: 174.8050, country: 'New Zealand', region: 'OCE' },
  'NAN': { name: 'Fiji Nadi', code: 'NAN', lat: -17.7553, lon: 177.4430, country: 'Fiji', region: 'OCE' },
  'PPT': { name: 'Tahiti Papeete', code: 'PPT', lat: -17.5537, lon: -149.6067, country: 'Fr. Polynesia', region: 'OCE' },
  'GUM': { name: 'Guam', code: 'GUM', lat: 13.4834, lon: 144.7961, country: 'Guam/USA', region: 'OCE' },
  'POM': { name: 'Port Moresby PNG', code: 'POM', lat: -9.4436, lon: 147.2200, country: 'PNG', region: 'OCE' },
  'HIR': { name: 'Honiara Solomons', code: 'HIR', lat: -9.4280, lon: 160.0547, country: 'Solomon Is.', region: 'OCE' },
  'VLI': { name: 'Port Vila Vanuatu', code: 'VLI', lat: -17.6994, lon: 168.3200, country: 'Vanuatu', region: 'OCE' },
  'NOU': { name: 'Noumea N.Caledonia', code: 'NOU', lat: -22.2589, lon: 166.4742, country: 'New Caledonia', region: 'OCE' },
  'APW': { name: 'Apia Samoa', code: 'APW', lat: -13.8314, lon: -171.7517, country: 'Samoa', region: 'OCE' },
  'TBU': { name: 'Nuku\'alofa Tonga', code: 'TBU', lat: -21.1394, lon: -175.2047, country: 'Tonga', region: 'OCE' },
};

/**
 * Fallback geocoder for any 3-letter string.
 * Creates a pseudo-random, deterministic lat/lon pair based on the hash of the code.
 * This ensures that any IATA-like code can be mapped to a location for distance calculation,
* preventing crashes when an unknown airport code is entered.
 */
const getFallbackCoordinates = (code: string) => { let h = 0; const s = code.toUpperCase(); for (let i = 0; i < s.length; i++) h = s.charCodeAt(i) + ((h << 5) - h); return { lat: (Math.abs(h % 18000) / 100) - 90, lon: (Math.abs((h * 31) % 36000) / 100) - 180 }; };



export function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}
export function getCityByCode(code: string): City | undefined {
  return MAJOR_CITIES[code.toUpperCase()];
}

export function findCity(query: string): City | undefined {
  const q = query.toUpperCase();
  // 1. Direct IATA code match
  if (MAJOR_CITIES[q]) return MAJOR_CITIES[q];
  // 2. Match by name, country, or alternative code
  return Object.values(MAJOR_CITIES).find(city =>
    city.name.toUpperCase().includes(q) || city.country.toUpperCase().includes(q) || city.code === q
  );
}

export function getDistanceBetweenCodes(code1: string, code2: string): number {
  const city1 = getCityByCode(code1);
  const city2 = getCityByCode(code2);
  const c1 = city1 || getFallbackCoordinates(code1); const c2 = city2 || getFallbackCoordinates(code2);
  return calculateDistance(c1.lat, c1.lon, c2.lat, c2.lon);
}
