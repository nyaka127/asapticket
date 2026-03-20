/**
 * ASAP Tickets - Multi-Currency Engine
 * Handles currency definitions, symbols, and exchange rate calculations.
 */

export interface Currency {
  code: string;
  name: string;
  symbol: string;
  locale: string;
  rateToUsd: number; // 1 USD = X Currency
}

export const SUPPORTED_CURRENCIES: Currency[] = [
  { code: 'USD', name: 'US Dollar', symbol: '$', locale: 'en-US', rateToUsd: 1 },
  { code: 'EUR', name: 'Euro', symbol: '€', locale: 'de-DE', rateToUsd: 0.92 },
  { code: 'GBP', name: 'British Pound', symbol: '£', locale: 'en-GB', rateToUsd: 0.79 },
  { code: 'KES', name: 'Kenyan Shilling', symbol: 'KSh', locale: 'en-KE', rateToUsd: 132.50 },
  { code: 'NGN', name: 'Nigerian Naira', symbol: '₦', locale: 'en-NG', rateToUsd: 1450.00 },
  { code: 'AED', name: 'UAE Dirham', symbol: 'د.إ', locale: 'ar-AE', rateToUsd: 3.67 },
  { code: 'INR', name: 'Indian Rupee', symbol: '₹', locale: 'en-IN', rateToUsd: 83.30 },
  { code: 'ZAR', name: 'South African Rand', symbol: 'R', locale: 'en-ZA', rateToUsd: 18.90 },
  { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$', locale: 'en-CA', rateToUsd: 1.35 },
  { code: 'AUD', name: 'Australian Dollar', symbol: 'A$', locale: 'en-AU', rateToUsd: 1.52 }
];

export const DEFAULT_CURRENCY = SUPPORTED_CURRENCIES[0];

/**
 * Formats a numeric amount into a localized currency string.
 */
export function formatCurrency(amount: number, currencyCode: string = 'USD'): string {
  const currency = SUPPORTED_CURRENCIES.find(c => c.code === currencyCode) || DEFAULT_CURRENCY;
  
  return new Intl.NumberFormat(currency.locale, {
    style: 'currency',
    currency: currency.code,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Converts an amount from USD to the target currency.
 */
export function convertFromUsd(amountUsd: number, targetCurrencyCode: string): number {
  const currency = SUPPORTED_CURRENCIES.find(c => c.code === targetCurrencyCode) || DEFAULT_CURRENCY;
  return amountUsd * currency.rateToUsd;
}

/**
 * Detects the best currency based on a country code (if available from IP).
 */
export function getCurrencyByCountry(countryCode: string): Currency {
  const mapping: Record<string, string> = {
    'KE': 'KES',
    'NG': 'NGN',
    'GB': 'GBP',
    'DE': 'EUR',
    'FR': 'EUR',
    'AE': 'AED',
    'IN': 'INR',
    'ZA': 'ZAR',
    'CA': 'CAD',
    'AU': 'AUD'
  };
  
  const code = mapping[countryCode.toUpperCase()] || 'USD';
  return SUPPORTED_CURRENCIES.find(c => c.code === code) || DEFAULT_CURRENCY;
}
