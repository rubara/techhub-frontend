'use client';

import Link from 'next/link';
import { useUIStore } from '@/store';
import { colors } from '@/lib/colors';
import { StarIcon } from '@/components/ui';

interface ProductInfoProps {
  name: string;
  brand?: {
    name: string;
    slug: string;
  };
  category?: {
    name: string;
    nameBg: string;
    slug: string;
  };
  price: number;
  originalPrice?: number;
  stock: number;
  sku?: string;
  rating?: number;
  reviewCount?: number;
}

export const ProductInfo = ({
  name,
  brand,
  category,
  price,
  originalPrice,
  stock,
  sku,
  rating = 0,
  reviewCount = 0,
}: ProductInfoProps) => {
  const { isDark, language } = useUIStore();

  const discount = originalPrice && originalPrice > price
    ? Math.round(((originalPrice - price) / originalPrice) * 100)
    : 0;

  const stockStatus = () => {
    if (stock <= 0) {
      return {
        text: language === 'bg' ? 'Изчерпан' : 'Out of Stock',
        color: colors.pink,
      };
    }
    if (stock <= 5) {
      return {
        text: language === 'bg' ? `Само ${stock} в наличност` : `Only ${stock} left`,
        color: colors.yellow,
      };
    }
    return {
      text: language === 'bg' ? 'В наличност' : 'In Stock',
      color: colors.forestGreen,
    };
  };

  const status = stockStatus();

  return (
    <div className="space-y-4">
      {/* Brand */}
      {brand && (
        <Link
          href={`/brand/${brand.slug}`}
          className="inline-block text-sm font-semibold hover:underline"
          style={{ color: colors.forestGreen }}
        >
          {brand.name}
        </Link>
      )}

      {/* Name */}
      <h1
        className="text-2xl md:text-3xl font-bold"
        style={{ color: isDark ? colors.white : colors.midnightBlack }}
      >
        {name}
      </h1>

      {/* Rating */}
      {reviewCount > 0 && (
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <StarIcon
                key={i}
                size={16}
                filled={i < Math.floor(rating)}
                color={i < Math.floor(rating) ? colors.yellow : isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)'}
              />
            ))}
          </div>
          <span
            className="text-sm"
            style={{ color: isDark ? colors.gray : colors.midnightBlack }}
          >
            ({reviewCount} {language === 'bg' ? 'отзива' : 'reviews'})
          </span>
        </div>
      )}

      {/* Category & SKU */}
      <div className="flex items-center gap-4 text-sm">
        {category && (
          <Link
            href={`/category/${category.slug}`}
            className="hover:underline"
            style={{ color: isDark ? colors.gray : colors.midnightBlack }}
          >
            {language === 'bg' ? category.nameBg : category.name}
          </Link>
        )}
        {sku && (
          <span style={{ color: isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)' }}>
            SKU: {sku}
          </span>
        )}
      </div>

      {/* Price */}
      <div className="flex items-baseline gap-3 pt-2">
        <span
          className="text-3xl font-bold"
          style={{ color: colors.forestGreen }}
        >
          {price.toFixed(2)} лв.
        </span>
        {originalPrice && originalPrice > price && (
          <>
            <span
              className="text-xl line-through"
              style={{ color: isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)' }}
            >
              {originalPrice.toFixed(2)} лв.
            </span>
            <span
              className="px-2 py-1 rounded text-sm font-semibold"
              style={{ background: colors.pink, color: colors.white }}
            >
              -{discount}%
            </span>
          </>
        )}
      </div>

      {/* Stock Status */}
      <div className="flex items-center gap-2">
        <span
          className="w-2 h-2 rounded-full"
          style={{ background: status.color }}
        />
        <span
          className="text-sm font-medium"
          style={{ color: status.color }}
        >
          {status.text}
        </span>
      </div>
    </div>
  );
};

export default ProductInfo;
