// TechHub.bg - Brand Colors and Theme Constants

export const colors = {
  // Primary
  forestGreen: '#00B553',
  
  // Backgrounds
  midnightBlack: '#101720',
  white: '#FFFFFF',
  
  // Secondary
  purple: '#5940D3',
  yellow: '#FFB40E',
  blue: '#00ABFF',
  pink: '#E9418B',
  teal: '#008761',
  darkGreen: '#1B3627',
  
  // Neutral
  gray: '#6B7280',
  lightGray: '#9CA3AF',
  darkGray: '#374151',
} as const;

// Theme-specific colors
export const theme = {
  dark: {
    background: colors.midnightBlack,
    backgroundSecondary: 'rgba(255,255,255,0.03)',
    backgroundTertiary: 'rgba(255,255,255,0.05)',
    text: colors.white,
    textSecondary: 'rgba(255,255,255,0.7)',
    textMuted: 'rgba(255,255,255,0.5)',
    border: 'rgba(255,255,255,0.1)',
    borderHover: 'rgba(255,255,255,0.2)',
  },
  light: {
    background: '#f5f5f7',
    backgroundSecondary: colors.white,
    backgroundTertiary: '#f0f0f0',
    text: colors.midnightBlack,
    textSecondary: '#555',
    textMuted: colors.gray,
    border: '#e0e0e0',
    borderHover: '#ccc',
  },
} as const;

// Category colors mapping
export const categoryColors: Record<string, string> = {
  gpu: colors.forestGreen,
  cpu: colors.yellow,
  motherboard: colors.purple,
  ram: colors.blue,
  storage: colors.pink,
  cooling: colors.teal,
  peripherals: colors.yellow,
  cases: colors.purple,
};

// Stock status colors
export const stockColors = {
  in: colors.forestGreen,
  limited: colors.yellow,
  out: '#ff4444',
} as const;

// Badge colors
export const badgeColors = {
  NEW: colors.forestGreen,
  HOT: colors.pink,
  SALE: colors.yellow,
} as const;

export type ColorKey = keyof typeof colors;
export type ThemeMode = 'dark' | 'light';
