'use client';

// TechHub.bg - Brands Section Component

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Brand } from '@/types';
import { useUIStore } from '@/store';
import { translations } from '@/lib/translations';
import { colors } from '@/lib/colors';
import { getImageUrl } from '@/lib/api';

interface BrandsSectionProps {
  brands: Brand[];
}

export const BrandsSection: React.FC<BrandsSectionProps> = ({ brands }) => {
  const { isDark, language } = useUIStore();
  // isDark already boolean
  const t = translations[language];

  return (
    <section 
      className={`
        py-12 px-6 border-y
        ${isDark 
          ? 'bg-white/[0.02] border-white/5' 
          : 'bg-gray-100 border-gray-200'
        }
      `}
    >
      <div className="max-w-[1400px] mx-auto">
        <h2 className="font-['Russo_One'] text-2xl text-center mb-8">
          {t.featuredBrands}
        </h2>

        <div className="flex justify-center items-center gap-5 flex-wrap">
          {brands.map((brand) => {
            // Use theme-appropriate logo if available
            const logoUrl = isDark 
              ? getImageUrl(brand.logoDark) || getImageUrl(brand.logo)
              : getImageUrl(brand.logoLight) || getImageUrl(brand.logo);

            return (
              <Link
                key={brand.id}
                href={`/brand/${brand.slug}`}
                className={`
                  px-7 py-4 rounded-xl transition-all duration-200
                  ${isDark 
                    ? 'bg-white/5 border border-white/[0.08] hover:border-[#00B553]' 
                    : 'bg-white border border-gray-200 hover:border-[#00B553]'
                  }
                  hover:scale-105
                `}
              >
                {logoUrl ? (
                  <Image
                    src={logoUrl}
                    alt={brand.name}
                    width={90}
                    height={30}
                    className="object-contain"
                  />
                ) : (
                  <span className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {brand.name}
                  </span>
                )}
              </Link>
            );
          })}

          {/* Show placeholder if no brands */}
          {brands.length === 0 && (
            <div className={`text-center py-8 ${isDark ? 'text-white/40' : 'text-gray-400'}`}>
              <p>Brands will appear here once added in the admin panel</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default BrandsSection;
