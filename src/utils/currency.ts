// src/utils/currency.ts

export interface CurrencySettings {
  showBGNReference: boolean;
  bgnToEurRate: number;
  transitionEndDate: string | null;
}

const DEFAULT_SETTINGS: CurrencySettings = {
  showBGNReference: true,
  bgnToEurRate: 1.95583,
  transitionEndDate: '2026-12-31',
};

// Cache settings to avoid repeated API calls
let cachedSettings: CurrencySettings | null = null;
let cacheTimestamp: number = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

/**
 * Fetch currency settings from Strapi
 */
export const getCurrencySettings = async (): Promise<CurrencySettings> => {
  const now = Date.now();
  
  // Return cached if still valid
  if (cachedSettings && (now - cacheTimestamp) < CACHE_DURATION) {
    return cachedSettings;
  }

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/global-setting`,
      {
        cache: 'no-store', // Always fetch fresh data
      }
    );

    if (!response.ok) {
      console.warn('Failed to fetch currency settings, using defaults');
      return DEFAULT_SETTINGS;
    }

    const result = await response.json();
    const data = result.data;

    cachedSettings = {
      showBGNReference: data.showBGNReference ?? DEFAULT_SETTINGS.showBGNReference,
      bgnToEurRate: parseFloat(data.bgnToEurRate) || DEFAULT_SETTINGS.bgnToEurRate,
      transitionEndDate: data.transitionEndDate || DEFAULT_SETTINGS.transitionEndDate,
    };

    cacheTimestamp = now;
    return cachedSettings;
  } catch (error) {
    console.error('Error fetching currency settings:', error);
    return DEFAULT_SETTINGS;
  }
};

/**
 * Clear cache (useful when settings are updated)
 */
export const clearCurrencyCache = () => {
  cachedSettings = null;
  cacheTimestamp = 0;
};

/**
 * Format price with EUR primary and optional BGN reference
 */
export interface FormattedPrice {
  eur: string;
  bgn: string;
  primary: string;
  secondary: string;
  display: string;
  eurValue: number;
  bgnValue: number;
}

export const formatPrice = (
  eurPrice: number,
  settings?: CurrencySettings
): FormattedPrice => {
  const config = settings || DEFAULT_SETTINGS;
  const bgnPrice = eurPrice * config.bgnToEurRate;

  const eurFormatted = eurPrice.toFixed(2);
  const bgnFormatted = bgnPrice.toFixed(2);

  return {
    eur: eurFormatted,
    bgn: bgnFormatted,
    eurValue: eurPrice,
    bgnValue: bgnPrice,
    
    // Primary display (always EUR)
    primary: `€${eurFormatted}`,
    
    // Secondary display (conditional BGN)
    secondary: config.showBGNReference ? `${bgnFormatted} лв` : '',
    
    // Full display
    display: config.showBGNReference
      ? `€${eurFormatted} (${bgnFormatted} лв)`
      : `€${eurFormatted}`,
  };
};

/**
 * Format price for compact display (product cards, etc.)
 */
export const formatPriceCompact = (
  eurPrice: number,
  settings?: CurrencySettings
): string => {
  const formatted = formatPrice(eurPrice, settings);
  return formatted.display;
};

/**
 * Get EUR to BGN rate
 */
export const getExchangeRate = (settings?: CurrencySettings): number => {
  return settings?.bgnToEurRate || DEFAULT_SETTINGS.bgnToEurRate;
};

/**
 * Convert BGN to EUR (for legacy data if needed)
 */
export const convertBGNtoEUR = (bgnPrice: number, settings?: CurrencySettings): number => {
  const rate = getExchangeRate(settings);
  return bgnPrice / rate;
};

/**
 * Convert EUR to BGN
 */
export const convertEURtoBGN = (eurPrice: number, settings?: CurrencySettings): number => {
  const rate = getExchangeRate(settings);
  return eurPrice * rate;
};

/**
 * Check if we should show BGN reference
 */
export const shouldShowBGN = (settings?: CurrencySettings): boolean => {
  return settings?.showBGNReference ?? DEFAULT_SETTINGS.showBGNReference;
};

/**
 * Check if transition period has ended
 */
export const isTransitionPeriodActive = (settings?: CurrencySettings): boolean => {
  const endDate = settings?.transitionEndDate || DEFAULT_SETTINGS.transitionEndDate;
  if (!endDate) return false;
  
  const transitionEnd = new Date(endDate);
  const now = new Date();
  
  return now <= transitionEnd;
};
