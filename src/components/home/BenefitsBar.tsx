'use client';

// TechHub.bg - Benefits Bar Component

import React from 'react';
import { useUIStore } from '@/store';
import { translations } from '@/lib/translations';
import { colors } from '@/lib/colors';
import { TruckIcon, CheckIcon } from '@/components/ui/Icons';

export const BenefitsBar: React.FC = () => {
  const { isDark, language } = useUIStore();
  // isDark already boolean
  const t = translations[language];

  const benefits = [
    { icon: TruckIcon, title: t.freeShipping, text: t.freeShippingText },
    { icon: CheckIcon, title: t.returns, text: t.returnsText },
    { icon: CheckIcon, title: t.securePayment, text: t.securePaymentText },
  ];

  return (
    <section 
      className={`
        py-4 px-6 border-b
        ${isDark 
          ? 'bg-[#00B553]/10 border-[#00B553]/30' 
          : 'bg-green-50 border-green-200'
        }
      `}
    >
      <div className="max-w-[1400px] mx-auto flex justify-around items-center flex-wrap gap-4">
        {benefits.map((item, index) => (
          <div key={index} className="flex items-center gap-3">
            <div 
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: colors.forestGreen }}
            >
              <item.icon size={20} color="white" />
            </div>
            <div>
              <div className={`font-bold text-sm ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {item.title}
              </div>
              <div className={`text-xs ${isDark ? 'text-white/60' : 'text-gray-500'}`}>
                {item.text}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default BenefitsBar;
