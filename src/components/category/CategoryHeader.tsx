'use client';

import { useUIStore } from '@/store';
import { colors } from '@/lib/colors';

interface CategoryHeaderProps {
  name: string;
  nameBg: string;
  description?: string;
  descriptionBg?: string;
  productCount: number;
}

export const CategoryHeader = ({
  name,
  nameBg,
  description,
  descriptionBg,
  productCount,
}: CategoryHeaderProps) => {
  const { isDark, language } = useUIStore();

  const productsLabel = language === 'bg' ? 'продукта' : 'products';

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <h1
          className="text-2xl md:text-3xl font-bold"
          style={{ color: isDark ? colors.white : colors.midnightBlack }}
        >
          {language === 'bg' ? nameBg : name}
        </h1>
        <span
          className="text-sm px-3 py-1 rounded-full"
          style={{
            background: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
            color: isDark ? colors.gray : colors.midnightBlack,
          }}
        >
          {productCount} {productsLabel}
        </span>
      </div>

      {(description || descriptionBg) && (
        <p
          className="mt-2 text-sm"
          style={{ color: isDark ? colors.gray : colors.midnightBlack }}
        >
          {language === 'bg' ? descriptionBg : description}
        </p>
      )}
    </div>
  );
};

export default CategoryHeader;
