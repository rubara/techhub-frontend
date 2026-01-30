'use client';

import { useState } from 'react';
import { useUIStore, useCompareStore } from '@/store';
import { colors } from '@/lib/colors';

interface CompareButtonProps {
  product: {
    id: number;
    name: string;
    nameBg?: string;
    slug: string;
    price: number;
    originalPrice?: number;
    image?: any;
    brand?: string;
    specs?: Record<string, any>;
  };
  categoryId?: number;
  categorySlug?: string;
  categoryName?: string;
  variant?: 'icon' | 'button' | 'full';
  className?: string;
}

export function CompareButton({
  product,
  categoryId,
  categorySlug,
  categoryName,
  variant = 'icon',
  className = '',
}: CompareButtonProps) {
  const { isDark, language } = useUIStore();
  const { addItem, removeItem, isInCompare, canAddItem, items, categoryId: currentCategoryId } = useCompareStore();
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipMessage, setTooltipMessage] = useState('');

  const inCompare = isInCompare(product.id);
  const canAdd = canAddItem(categoryId);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (inCompare) {
      removeItem(product.id);
      return;
    }

    if (!canAdd) {
      if (items.length >= 4) {
        setTooltipMessage(
          language === 'bg'
            ? 'Максимум 4 продукта за сравнение'
            : 'Maximum 4 products for comparison'
        );
      } else if (currentCategoryId && currentCategoryId !== categoryId) {
        setTooltipMessage(
          language === 'bg'
            ? 'Може да сравнявате само продукти от една категория'
            : 'You can only compare products from the same category'
        );
      }
      setShowTooltip(true);
      setTimeout(() => setShowTooltip(false), 3000);
      return;
    }

    const success = addItem({
      id: product.id,
      name: product.name,
      nameBg: product.nameBg,
      slug: product.slug,
      price: product.price,
      originalPrice: product.originalPrice,
      image: product.image,
      categoryId,
      categorySlug,
      categoryName,
      specs: product.specs,
      brand: product.brand,
    });

    if (success) {
      setTooltipMessage(
        language === 'bg' ? 'Добавено за сравнение' : 'Added to compare'
      );
      setShowTooltip(true);
      setTimeout(() => setShowTooltip(false), 2000);
    }
  };

  // Icon-only variant (for product cards)
  if (variant === 'icon') {
    return (
      <div className={`relative ${className}`}>
        <button
          onClick={handleClick}
          className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
            inCompare ? 'scale-110' : 'hover:scale-105'
          }`}
          style={{
            background: inCompare
              ? colors.forestGreen
              : isDark
              ? 'rgba(255,255,255,0.1)'
              : 'rgba(0,0,0,0.05)',
            color: inCompare ? colors.white : isDark ? colors.white : colors.midnightBlack,
          }}
          title={
            inCompare
              ? language === 'bg'
                ? 'Премахни от сравнение'
                : 'Remove from compare'
              : language === 'bg'
              ? 'Добави за сравнение'
              : 'Add to compare'
          }
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="20" x2="18" y2="10" />
            <line x1="12" y1="20" x2="12" y2="4" />
            <line x1="6" y1="20" x2="6" y2="14" />
          </svg>
        </button>

        {/* Tooltip */}
        {showTooltip && (
          <div
            className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 rounded-lg text-xs whitespace-nowrap z-50"
            style={{
              background: isDark ? colors.white : colors.midnightBlack,
              color: isDark ? colors.midnightBlack : colors.white,
            }}
          >
            {tooltipMessage}
            <div
              className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0"
              style={{
                borderLeft: '6px solid transparent',
                borderRight: '6px solid transparent',
                borderTop: `6px solid ${isDark ? colors.white : colors.midnightBlack}`,
              }}
            />
          </div>
        )}
      </div>
    );
  }

  // Button variant (small button with icon)
  if (variant === 'button') {
    return (
      <div className={`relative ${className}`}>
        <button
          onClick={handleClick}
          className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${
            inCompare ? '' : 'hover:opacity-80'
          }`}
          style={{
            background: inCompare
              ? colors.forestGreen
              : isDark
              ? 'rgba(255,255,255,0.05)'
              : 'rgba(0,0,0,0.05)',
            color: inCompare ? colors.white : isDark ? colors.white : colors.midnightBlack,
            border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.1)',
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="20" x2="18" y2="10" />
            <line x1="12" y1="20" x2="12" y2="4" />
            <line x1="6" y1="20" x2="6" y2="14" />
          </svg>
          <span className="text-sm">
            {inCompare
              ? language === 'bg'
                ? 'В сравнение'
                : 'In Compare'
              : language === 'bg'
              ? 'Сравни'
              : 'Compare'}
          </span>
        </button>

        {/* Tooltip */}
        {showTooltip && (
          <div
            className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 rounded-lg text-xs whitespace-nowrap z-50"
            style={{
              background: isDark ? colors.white : colors.midnightBlack,
              color: isDark ? colors.midnightBlack : colors.white,
            }}
          >
            {tooltipMessage}
          </div>
        )}
      </div>
    );
  }

  // Full variant (for product detail page)
  return (
    <div className={`relative ${className}`}>
      <button
        onClick={handleClick}
        className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium transition-all ${
          inCompare ? '' : 'hover:opacity-90'
        }`}
        style={{
          background: inCompare
            ? colors.forestGreen
            : isDark
            ? 'rgba(255,255,255,0.05)'
            : 'rgba(0,0,0,0.05)',
          color: inCompare ? colors.white : isDark ? colors.white : colors.midnightBlack,
          border: inCompare
            ? `2px solid ${colors.forestGreen}`
            : isDark
            ? '2px solid rgba(255,255,255,0.1)'
            : '2px solid rgba(0,0,0,0.1)',
        }}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="18" y1="20" x2="18" y2="10" />
          <line x1="12" y1="20" x2="12" y2="4" />
          <line x1="6" y1="20" x2="6" y2="14" />
        </svg>
        <span>
          {inCompare
            ? language === 'bg'
              ? 'Премахни от сравнение'
              : 'Remove from Compare'
            : language === 'bg'
            ? 'Добави за сравнение'
            : 'Add to Compare'}
        </span>
      </button>

      {/* Tooltip */}
      {showTooltip && (
        <div
          className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-4 py-2 rounded-lg text-sm whitespace-nowrap z-50"
          style={{
            background: isDark ? colors.white : colors.midnightBlack,
            color: isDark ? colors.midnightBlack : colors.white,
          }}
        >
          {tooltipMessage}
        </div>
      )}
    </div>
  );
}

export default CompareButton;
