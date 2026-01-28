'use client';

import { useState } from 'react';
import { useUIStore } from '@/store';
import { colors } from '@/lib/colors';
import { SpecificationsTable } from './SpecificationsTable';

interface ProductTabsProps {
  description?: string;
  descriptionBg?: string;
  specifications?: Record<string, any>;
  specType?: string;
}

export const ProductTabs = ({
  description,
  descriptionBg,
  specifications,
  specType,
}: ProductTabsProps) => {
  const { isDark, language } = useUIStore();
  const [activeTab, setActiveTab] = useState<'description' | 'specifications' | 'reviews'>(
    specifications && specType ? 'specifications' : 'description'
  );

  const tabs = [
    {
      id: 'description' as const,
      label: language === 'bg' ? 'Описание' : 'Description',
      show: true,
    },
    {
      id: 'specifications' as const,
      label: language === 'bg' ? 'Спецификации' : 'Specifications',
      show: specifications && specType,
    },
    {
      id: 'reviews' as const,
      label: language === 'bg' ? 'Отзиви' : 'Reviews',
      show: true,
    },
  ].filter((tab) => tab.show);

  const descriptionText = language === 'bg' ? descriptionBg || description : description;

  return (
    <div className="mt-8">
      {/* Tab Headers */}
      <div
        className="flex gap-1 p-1 rounded-xl mb-6"
        style={{
          background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
        }}
      >
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className="flex-1 py-3 px-4 rounded-lg font-medium text-sm transition-all"
            style={{
              background: activeTab === tab.id
                ? colors.forestGreen
                : 'transparent',
              color: activeTab === tab.id
                ? colors.white
                : isDark
                ? colors.gray
                : colors.midnightBlack,
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === 'description' && (
          <div
            className="prose max-w-none"
            style={{ color: isDark ? colors.white : colors.midnightBlack }}
          >
            {descriptionText ? (
              <p className="text-base leading-relaxed whitespace-pre-wrap">
                {descriptionText}
              </p>
            ) : (
              <p
                className="text-base"
                style={{ color: isDark ? colors.gray : colors.midnightBlack }}
              >
                {language === 'bg'
                  ? 'Няма налично описание.'
                  : 'No description available.'}
              </p>
            )}
          </div>
        )}

        {activeTab === 'specifications' && specifications && specType && (
          <SpecificationsTable specifications={specifications} specType={specType} />
        )}

        {activeTab === 'reviews' && (
          <div
            className="text-center py-12 rounded-xl"
            style={{
              background: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)',
            }}
          >
            <p
              className="text-base"
              style={{ color: isDark ? colors.gray : colors.midnightBlack }}
            >
              {language === 'bg'
                ? 'Все още няма отзиви за този продукт.'
                : 'No reviews yet for this product.'}
            </p>
            <button
              className="mt-4 px-6 py-2 rounded-lg font-medium transition-colors"
              style={{
                background: colors.forestGreen,
                color: colors.white,
              }}
            >
              {language === 'bg' ? 'Напиши отзив' : 'Write a Review'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductTabs;
