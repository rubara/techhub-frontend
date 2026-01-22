'use client';

import { useUIStore } from '@/store';
import { ThemeToggle, LanguageSwitcher, TruckIcon, PhoneIcon } from '@/components/ui';
import { colors } from '@/lib/colors';
import { siteConfig } from '@/lib/constants';

export const UtilityBar = () => {
  const { isDark, t } = useUIStore();

  return (
    <div
      style={{
        background: isDark ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,0.05)',
        borderBottom: isDark ? '1px solid rgba(255,255,255,0.05)' : '1px solid rgba(0,0,0,0.05)',
      }}
    >
      <div
        className="mx-auto flex items-center justify-between"
        style={{
          maxWidth: '1400px',
          padding: '8px 24px',
        }}
      >
        {/* Left side - Free shipping */}
        <div className="flex items-center gap-2">
          <span className="flex items-center justify-center" style={{ height: '14px' }}>
            <TruckIcon size={14} color={colors.forestGreen} />
          </span>
          <span
            style={{
              fontSize: '12px',
              color: isDark ? 'rgba(255,255,255,0.7)' : colors.gray,
              lineHeight: '14px',
            }}
          >
            {t.freeShippingBar}
          </span>
        </div>

        {/* Right side - Phone, Language, Theme */}
        <div className="flex items-center gap-4">
          {/* Phone */}
          <a
            href={`tel:${siteConfig.phone.replace(/\s/g, '')}`}
            className="flex items-center gap-2 transition-opacity hover:opacity-80"
            style={{ height: '14px' }}
          >
            <span className="flex items-center justify-center">
              <PhoneIcon size={14} color={isDark ? 'rgba(255,255,255,0.7)' : colors.gray} />
            </span>
            <span
              style={{
                fontSize: '12px',
                color: isDark ? 'rgba(255,255,255,0.7)' : colors.gray,
                lineHeight: '14px',
                letterSpacing: '0.5px',
              }}
            >
              {siteConfig.phone}
            </span>
          </a>

          {/* Divider */}
          <div
            style={{
              width: '1px',
              height: '14px',
              background: isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)',
            }}
          />

          {/* Language Switcher */}
          <LanguageSwitcher />

          {/* Theme Toggle */}
          <ThemeToggle />
        </div>
      </div>
    </div>
  );
};

export default UtilityBar;
