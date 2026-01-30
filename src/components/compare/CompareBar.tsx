'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useUIStore, useCompareStore } from '@/store';
import { colors } from '@/lib/colors';

export function CompareBar() {
  const { isDark, language } = useUIStore();
  const { items, removeItem, clearCompare } = useCompareStore();
  const [isVisible, setIsVisible] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

  useEffect(() => {
    setIsVisible(items.length > 0);
  }, [items.length]);

  const getImageUrl = (image: any): string => {
    if (!image) return '/placeholder-product.svg';
    if (typeof image === 'string') return image;
    if (image.url) {
      return image.url.startsWith('http')
        ? image.url
        : `${process.env.NEXT_PUBLIC_STRAPI_URL}${image.url}`;
    }
    if (image.data?.attributes?.url) {
      const url = image.data.attributes.url;
      return url.startsWith('http')
        ? url
        : `${process.env.NEXT_PUBLIC_STRAPI_URL}${url}`;
    }
    return '/placeholder-product.svg';
  };

  if (!isVisible) return null;

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-50 transition-transform duration-300 ${
        isMinimized ? 'translate-y-[calc(100%-48px)]' : 'translate-y-0'
      }`}
      style={{
        background: isDark ? colors.midnightBlack : colors.white,
        borderTop: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.1)',
        boxShadow: '0 -4px 20px rgba(0,0,0,0.15)',
      }}
    >
      {/* Minimize Toggle */}
      <button
        onClick={() => setIsMinimized(!isMinimized)}
        className="absolute -top-10 left-1/2 -translate-x-1/2 px-4 py-2 rounded-t-xl flex items-center gap-2"
        style={{
          background: isDark ? colors.midnightBlack : colors.white,
          borderTop: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.1)',
          borderLeft: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.1)',
          borderRight: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.1)',
        }}
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke={colors.forestGreen}
          strokeWidth="2"
          className={`transition-transform ${isMinimized ? 'rotate-180' : ''}`}
        >
          <polyline points="18 15 12 9 6 15" />
        </svg>
        <span className="text-sm font-medium" style={{ color: colors.forestGreen }}>
          {language === 'bg' ? 'Сравни' : 'Compare'} ({items.length})
        </span>
      </button>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 py-4">
        <div className="flex items-center gap-4">
          {/* Product Slots */}
          <div className="flex-1 flex gap-3 overflow-x-auto pb-2">
            {/* Selected Products */}
            {items.map((item) => (
              <div key={item.id} className="relative flex-shrink-0 w-24 group">
                <div
                  className="w-24 h-24 rounded-xl overflow-hidden"
                  style={{
                    background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
                    border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.1)',
                  }}
                >
                  <Image
                    src={getImageUrl(item.image)}
                    alt={item.name}
                    width={96}
                    height={96}
                    className="w-full h-full object-contain p-2"
                  />
                </div>
                {/* Remove Button */}
                <button
                  onClick={() => removeItem(item.id)}
                  className="absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ background: '#ef4444', color: colors.white }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
                <p
                  className="text-xs mt-1 line-clamp-2 text-center"
                  style={{ color: isDark ? colors.gray : colors.midnightBlack }}
                >
                  {language === 'bg' && item.nameBg ? item.nameBg : item.name}
                </p>
              </div>
            ))}

            {/* Empty Slots */}
            {Array.from({ length: 4 - items.length }).map((_, i) => (
              <div
                key={`empty-${i}`}
                className="flex-shrink-0 w-24 h-24 rounded-xl border-2 border-dashed flex items-center justify-center"
                style={{
                  borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
                }}
              >
                <span className="text-2xl" style={{ color: isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)' }}>
                  +
                </span>
              </div>
            ))}
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-2 flex-shrink-0">
            <Link
              href="/compare"
              className={`px-6 py-2.5 rounded-xl font-semibold text-center transition-all ${
                items.length < 2 ? 'opacity-50 pointer-events-none' : ''
              }`}
              style={{ background: colors.forestGreen, color: colors.white }}
            >
              {language === 'bg' ? 'Сравни' : 'Compare'}
              {items.length >= 2 && ` (${items.length})`}
            </Link>
            <button
              onClick={clearCompare}
              className="px-6 py-2 rounded-xl text-sm transition-all"
              style={{
                background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
                color: isDark ? colors.gray : colors.midnightBlack,
              }}
            >
              {language === 'bg' ? 'Изчисти' : 'Clear'}
            </button>
          </div>
        </div>

        {/* Hint */}
        {items.length < 2 && (
          <p className="text-xs mt-2 text-center" style={{ color: isDark ? colors.gray : colors.midnightBlack }}>
            {language === 'bg'
              ? `Добавете още ${2 - items.length} продукт${items.length === 1 ? '' : 'а'} за сравнение`
              : `Add ${2 - items.length} more product${items.length === 1 ? '' : 's'} to compare`}
          </p>
        )}
      </div>
    </div>
  );
}

export default CompareBar;
