'use client';

// TechHub.bg - Categories Grid Component

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Category } from '@/types';
import { useUIStore } from '@/store';
import { translations } from '@/lib/translations';
import { colors, categoryColors } from '@/lib/colors';
import { getImageUrl } from '@/lib/api';
import { ArrowRightIcon } from '@/components/ui/Icons';

interface CategoriesProps {
  categories: Category[];
}

export const Categories: React.FC<CategoriesProps> = ({ categories }) => {
  const { theme, language } = useUIStore();
  const isDark = theme === 'dark';
  const t = translations[language];

  return (
    <section className="max-w-[1400px] mx-auto px-6 py-12">
      {/* Section Header */}
      <div className="flex justify-between items-center mb-7">
        <h2 className="font-['Russo_One'] text-2xl flex items-center gap-3">
          <span className="w-1 h-6 bg-[#00B553] rounded-sm" />
          {t.topCategories}
        </h2>
        <Link 
          href="/categories"
          className="text-[#00B553] text-sm font-semibold flex items-center gap-1 hover:underline"
        >
          {t.viewAll} <ArrowRightIcon size={16} />
        </Link>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
        {categories.map((category) => {
          const imageUrl = getImageUrl(category.image);
          const color = category.color || categoryColors[category.slug] || colors.forestGreen;
          const categoryName = language === 'bg' ? category.nameBg : category.name;

          return (
            <Link
              key={category.id}
              href={`/category/${category.slug}`}
              className={`
                group rounded-xl p-3 text-center transition-all duration-300
                ${isDark 
                  ? 'bg-white/[0.03] border border-white/5 hover:border-[var(--hover-color)]' 
                  : 'bg-white border border-gray-200 hover:border-[var(--hover-color)]'
                }
                hover:-translate-y-1
              `}
              style={{ 
                '--hover-color': color,
                boxShadow: 'none',
              } as React.CSSProperties}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = `0 8px 24px ${color}30`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              {/* Image Container */}
              <div 
                className={`
                  aspect-square rounded-lg overflow-hidden mb-2.5 relative
                  ${isDark ? 'bg-white/5' : 'bg-gray-100'}
                `}
              >
                {imageUrl ? (
                  <Image
                    src={imageUrl}
                    alt={categoryName}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                ) : (
                  // Placeholder when no image
                  <div className={`
                    absolute inset-0 flex flex-col items-center justify-center text-center
                    ${isDark ? 'text-white/30' : 'text-gray-400'}
                  `}>
                    <span className="text-2xl mb-1 opacity-50">🖼️</span>
                    <span className="text-[10px] px-2">Image from<br/>Admin</span>
                  </div>
                )}
              </div>

              {/* Category Name */}
              <div className={`text-xs font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {categoryName}
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
};

export default Categories;
