'use client';

import { useUIStore } from '@/store';
import { colors } from '@/lib/colors';
import { CategoryFilterConfig, FilterState } from '@/types';
import { FilterSection } from './FilterSection';
import { CloseIcon } from '@/components/ui';

interface FilterSidebarProps {
  filterConfig: CategoryFilterConfig;
  activeFilters: FilterState;
  onFilterChange: (filterId: string, value: any) => void;
  onClearAll: () => void;
  isOpen: boolean;
  onClose: () => void;
}

export const FilterSidebar = ({
  filterConfig,
  activeFilters,
  onFilterChange,
  onClearAll,
  isOpen,
  onClose,
}: FilterSidebarProps) => {
  const { isDark, language } = useUIStore();

  const filtersLabel = language === 'bg' ? 'Филтри' : 'Filters';
  const clearAllLabel = language === 'bg' ? 'Изчисти всички' : 'Clear All';

  const hasActiveFilters = Object.keys(activeFilters).some(
    (key) => activeFilters[key] !== undefined && activeFilters[key] !== ''
  );

  const sidebarContent = (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div
        className="flex items-center justify-between p-4"
        style={{
          borderBottom: isDark
            ? '1px solid rgba(255,255,255,0.1)'
            : '1px solid rgba(0,0,0,0.1)',
        }}
      >
        <h2
          className="text-lg font-bold"
          style={{ color: isDark ? colors.white : colors.midnightBlack }}
        >
          {filtersLabel}
        </h2>
        <div className="flex items-center gap-3">
          {hasActiveFilters && (
            <button
              onClick={onClearAll}
              className="text-sm hover:underline"
              style={{ color: colors.forestGreen }}
            >
              {clearAllLabel}
            </button>
          )}
          {/* Close button - mobile only */}
          <button
            onClick={onClose}
            className="lg:hidden p-1 rounded-lg transition-colors"
            style={{
              background: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
            }}
          >
            <CloseIcon size={20} color={isDark ? colors.white : colors.midnightBlack} />
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex-1 overflow-y-auto p-4">
        {filterConfig.filters.map((filter) => (
          <FilterSection
            key={filter.id}
            filter={filter}
            activeFilters={activeFilters}
            onFilterChange={onFilterChange}
          />
        ))}
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className="hidden lg:block w-72 flex-shrink-0 rounded-xl overflow-hidden"
        style={{
          background: isDark ? 'rgba(255,255,255,0.03)' : colors.white,
          border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.1)',
        }}
      >
        {sidebarContent}
      </aside>

      {/* Mobile Overlay */}
      {isOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50"
            onClick={onClose}
          />
          {/* Sidebar */}
          <div
            className="absolute left-0 top-0 bottom-0 w-80 max-w-[85vw]"
            style={{
              background: isDark ? colors.midnightBlack : colors.white,
            }}
          >
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};

export default FilterSidebar;
