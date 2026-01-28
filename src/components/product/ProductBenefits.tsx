'use client';

import { useUIStore } from '@/store';
import { colors } from '@/lib/colors';
import { TruckIcon, CheckIcon } from '@/components/ui';

export const ProductBenefits = () => {
  const { isDark, language } = useUIStore();

  const benefits = [
    {
      icon: TruckIcon,
      text: language === 'bg' ? 'Безплатна доставка над 150 лв.' : 'Free shipping over 150 BGN',
    },
    {
      icon: CheckIcon,
      text: language === 'bg' ? '30 дни право на връщане' : '30-day returns',
    },
    {
      icon: CheckIcon,
      text: language === 'bg' ? '2 години гаранция' : '2-year warranty',
    },
  ];

  return (
    <div
      className="rounded-xl p-4 mt-6 space-y-3"
      style={{
        background: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)',
        border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.05)',
      }}
    >
      {benefits.map((benefit, index) => (
        <div key={index} className="flex items-center gap-3">
          <benefit.icon size={18} color={colors.forestGreen} />
          <span
            className="text-sm"
            style={{ color: isDark ? colors.white : colors.midnightBlack }}
          >
            {benefit.text}
          </span>
        </div>
      ))}
    </div>
  );
};

export default ProductBenefits;
