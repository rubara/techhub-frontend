'use client';

import { useUIStore } from '@/store';
import { colors } from '@/lib/colors';
import { sortOptions } from '@/lib/filters';
import { MenuIcon } from '@/components/ui';

interface ProductToolbarProps {
  totalProducts: number;
  currentSort: string;
  onSortChange: (sort: string) => void;
  onOpenFilters: () => void;
}

export const ProductToolbar = ({
  totalProducts,
  currentSort,
  onSortChange,
  onOpenFilters,
}: ProductToolbarProps) => {
  const { isDark, language } = useUIStore();

  const showingLabel = language === 'bg' ? 'Показване на' : 'Showing';
  const productsLabel = language === 'bg' ? 'продукта' : 'products';
  const sortByLabel = language === 'bg' ? 'Сортирай по' : 'Sort by';
  const filtersLabel = language === 'bg' ? 'Филтри' : 'Filters';

  return (
    <div
      className="flex items-center justify-between gap-4 p-4 rounded-xl mb-6 flex-wrap"
      style={{
        background: isDark ? 'rgba(255,255,255,0.03)' : colors.white,
        border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.1)',
      }}
    >
      {/* Mobile Filter Button */}
      <button
        onClick={onOpenFilters}
        className="lg:hidden flex items-center gap-2 px-4 py-2 rounded-lg transition-colors"
        style={{
          background: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
          color: isDark ? colors.white : colors.midnightBlack,
        }}
      >
        <MenuIcon size={18} />
        {filtersLabel}
      </button>

      {/* Product Count */}
      <p
        className="text-sm"
        style={{ color: isDark ? colors.gray : colors.midnightBlack }}
      >
        {showingLabel} <strong>{totalProducts}</strong> {productsLabel}
      </p>

      {/* Sort Dropdown */}
      <div className="flex items-center gap-2">
        <label
          className="text-sm hidden sm:block"
          style={{ color: isDark ? colors.gray : colors.midnightBlack }}
        >
          {sortByLabel}:
        </label>
        <select
          value={currentSort}
          onChange={(e) => onSortChange(e.target.value)}
          className="px-3 py-2 rounded-lg text-sm cursor-pointer"
          style={{
            background: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
            color: isDark ? colors.white : colors.midnightBlack,
            border: 'none',
          }}
        >
          {sortOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {language === 'bg' ? option.labelBg : option.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default ProductToolbar;
