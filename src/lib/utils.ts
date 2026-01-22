// TechHub.bg - Utility Functions

// EUR to BGN conversion rate (approximately 1 EUR = 1.95583 BGN)
export const EUR_RATE = 1.95583;

// Format price with BGN and EUR
export function formatPrice(priceBGN: number): { bgn: string; eur: string } {
  const priceEUR = (priceBGN / EUR_RATE).toFixed(2);
  return { 
    bgn: priceBGN.toLocaleString('bg-BG'), 
    eur: priceEUR 
  };
}

// Format single price
export function formatBGN(price: number): string {
  return price.toLocaleString('bg-BG');
}

export function formatEUR(priceBGN: number): string {
  return (priceBGN / EUR_RATE).toFixed(2);
}

// Get stock status
export type StockStatus = 'in' | 'limited' | 'out';

export function getStockStatus(stock: number): StockStatus {
  if (stock === 0) return 'out';
  if (stock <= 5) return 'limited';
  return 'in';
}

export const stockColors: Record<StockStatus, string> = {
  in: '#00B553',
  limited: '#FFB40E',
  out: '#ff4444',
};

// Truncate text
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + '...';
}

// Debounce function
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

// Class name helper (like clsx/cn)
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}

// Generate slug from text
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// Local storage helpers with SSR safety
export function getFromStorage<T>(key: string, defaultValue: T): T {
  if (typeof window === 'undefined') return defaultValue;
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch {
    return defaultValue;
  }
}

export function setToStorage<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    console.error('Failed to save to localStorage');
  }
}
