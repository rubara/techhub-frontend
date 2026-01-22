'use client';

import { useUIStore } from '@/store';
import { colors } from '@/lib/colors';

interface LanguageSwitcherProps {
  className?: string;
}

export const LanguageSwitcher = ({ className }: LanguageSwitcherProps) => {
  const { language, isDark, toggleLanguage } = useUIStore();

  return (
    <button
      onClick={toggleLanguage}
      className={`flex items-center gap-1 px-2 py-1 rounded transition-all duration-200 hover:opacity-80 ${className}`}
      style={{
        background: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
        fontSize: '12px',
        fontWeight: 600,
      }}
      aria-label={`Switch to ${language === 'bg' ? 'English' : 'Bulgarian'}`}
    >
      {/* Flag icons */}
      <span className="flex items-center gap-1">
        {language === 'bg' ? (
          <>
            <span className="text-sm">🇧🇬</span>
            <span style={{ color: isDark ? colors.white : colors.midnightBlack }}>BG</span>
          </>
        ) : (
          <>
            <span className="text-sm">🇬🇧</span>
            <span style={{ color: isDark ? colors.white : colors.midnightBlack }}>EN</span>
          </>
        )}
      </span>
    </button>
  );
};

export default LanguageSwitcher;
