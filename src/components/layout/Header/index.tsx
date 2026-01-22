'use client';

import { useUIStore } from '@/store';
import { colors } from '@/lib/colors';
import { UtilityBar } from './UtilityBar';
import { MainHeader } from './MainHeader';
import { Navigation } from './Navigation';

export const Header = () => {
  const { isDark } = useUIStore();

  return (
    <header
      className="sticky top-0 z-50"
      style={{
        background: isDark ? colors.midnightBlack : '#f5f5f7',
        boxShadow: isDark
          ? '0 2px 20px rgba(0,0,0,0.3)'
          : '0 2px 20px rgba(0,0,0,0.08)',
      }}
    >
      <UtilityBar />
      <MainHeader />
      <Navigation />
    </header>
  );
};

export default Header;

// Also export individual components for flexibility
export { UtilityBar } from './UtilityBar';
export { MainHeader } from './MainHeader';
export { Navigation } from './Navigation';
