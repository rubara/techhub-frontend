'use client';

import { SunIcon, MoonIcon } from './Icons';
import { useUIStore } from '@/store';
import { colors } from '@/lib/colors';

interface ThemeToggleProps {
  className?: string;
}

export const ThemeToggle = ({ className }: ThemeToggleProps) => {
  const { isDark, toggleTheme } = useUIStore();

  return (
    <button
      onClick={toggleTheme}
      className={`p-2 rounded-full transition-all duration-200 hover:scale-110 ${className}`}
      style={{
        background: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
      }}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {isDark ? (
        <SunIcon size={18} color={colors.yellow} />
      ) : (
        <MoonIcon size={18} color={colors.midnightBlack} />
      )}
    </button>
  );
};

export default ThemeToggle;
