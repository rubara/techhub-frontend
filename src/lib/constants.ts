// TechHub.bg Brand Configuration
import { colors } from './colors';

// Re-export colors for convenience
export { colors } from './colors';

// Navigation Menu Items
export const menuItems = [
  { 
    id: 'components',
    hasMega: true,
  },
  { 
    id: 'peripherals',
    hasMega: true,
  },
  { 
    id: 'computers',
    hasMega: false,
    href: '/computers',
  },
  { 
    id: 'deals',
    hasMega: false,
    href: '/deals',
    highlight: 'pink',
  },
  { 
    id: 'pcBuilder',
    hasMega: false,
    href: '/pc-builder',
    highlight: 'green',
  },
];

// Mega Menu Categories
export const megaMenuData = {
  components: [
    { id: 'gpu', href: '/category/graphics-cards' },
    { id: 'cpu', href: '/category/processors' },
    { id: 'motherboard', href: '/category/motherboards' },
    { id: 'ram', href: '/category/memory' },
    { id: 'storage', href: '/category/storage' },
    { id: 'psu', href: '/category/power-supplies' },
    { id: 'cooling', href: '/category/cooling' },
    { id: 'cases', href: '/category/cases' },
  ],
  peripherals: [
    { id: 'keyboards', href: '/category/keyboards' },
    { id: 'mice', href: '/category/mice' },
    { id: 'headsets', href: '/category/headsets' },
    { id: 'monitors', href: '/category/monitors' },
    { id: 'webcams', href: '/category/webcams' },
    { id: 'controllers', href: '/category/controllers' },
  ],
};

// Category Grid Configuration
export const categoryConfig = [
  { id: 'gpu', slug: 'graphics-cards', color: colors.forestGreen },
  { id: 'cpu', slug: 'processors', color: colors.yellow },
  { id: 'motherboard', slug: 'motherboards', color: colors.purple },
  { id: 'ram', slug: 'memory', color: colors.blue },
  { id: 'storage', slug: 'storage', color: colors.pink },
  { id: 'cooling', slug: 'cooling', color: colors.teal },
  { id: 'peripherals', slug: 'peripherals', color: colors.yellow },
  { id: 'cases', slug: 'cases', color: colors.purple },
];

// Site Configuration
export const siteConfig = {
  name: 'TechHub.bg',
  phone: '+359 88 888 8888',
  email: 'info@techhub.bg',
  currency: 'лв.',
  currencyCode: 'BGN',
  defaultLanguage: 'bg' as const,
  defaultTheme: 'dark' as const,
  strapiUrl: process.env.NEXT_PUBLIC_STRAPI_URL || 'http://192.168.0.3:1337',
};

// Fonts
export const fonts = {
  heading: "'Russo One', sans-serif",
  body: "'Raleway', sans-serif",
};
