'use client';

import { useUIStore } from '@/store';
import { colors } from '@/lib/colors';
import { FilterState, CategoryFilterConfig } from '@/types';
import { formatFilterValue } from '@/lib/filters';
import { CloseIcon } from '@/components/ui';

interface ActiveFiltersProps {
  filterConfig: CategoryFilterConfig;
  activeFilters: FilterState;
  onRemoveFilter: (filterId: string, value?: string) => void;
  onClearAll: () => void;
}

export const ActiveFilters = ({
  filterConfig,
  activeFilters,
  onRemoveFilter,
  onClearAll,
}: ActiveFiltersProps) => {
  const { isDark, language } = useUIStore();

  const clearAllLabel = language === 'bg' ? 'Изчисти всички' : 'Clear all';

  // Get active filter badges
  const badges: { filterId: string; value: string; label: string }[] = [];

  Object.entries(activeFilters).forEach(([key, value]) => {
    if (value === undefined || value === '' || value === false) return;

    // Skip min/max price - they're handled together
    if (key.endsWith('Min') || key.endsWith('Max')) {
      const baseKey = key.replace(/Min$|Max$/, '');
      const filterDef = filterConfig.filters.find((f) => f.id === baseKey);
      
      if (filterDef && key.endsWith('Max')) {
        const min = activeFilters[`${baseKey}Min`] || filterDef.min;
        const max = activeFilters[`${baseKey}Max`] || filterDef.max;
        
        if (min !== filterDef.min || max !== filterDef.max) {
          badges.push({
            filterId: baseKey,
            value: `${min}-${max}`,
            label: `${language === 'bg' ? filterDef.labelBg : filterDef.label}: ${min} - ${max} ${filterDef.unit || ''}`,
          });
        }
      }
      return;
    }

    const filterDef = filterConfig.filters.find((f) => f.id === key);
    if (!filterDef) return;

    if (Array.isArray(value)) {
      value.forEach((v) => {
        badges.push({
          filterId: key,
          value: v,
          label: `${language === 'bg' ? filterDef.labelBg : filterDef.label}: ${formatFilterValue(v)}`,
        });
      });
    } else if (value === true) {
      badges.push({
        filterId: key,
        value: 'true',
        label: language === 'bg' ? filterDef.labelBg : filterDef.label,
      });
    }
  });

  if (badges.length === 0) return null;

  return (
    <div className="flex items-center gap-2 mb-4 flex-wrap">
      {badges.map((badge, index) => (
        <span
          key={`${badge.filterId}-${badge.value}-${index}`}
          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-sm"
          style={{
            background: isDark ? 'rgba(0, 181, 83, 0.2)' : 'rgba(0, 181, 83, 0.1)',
            color: colors.forestGreen,
          }}
        >
          {badge.label}
          <button
            onClick={() => onRemoveFilter(badge.filterId, badge.value)}
            className="ml-1 hover:opacity-70 transition-opacity"
          >
            <CloseIcon size={14} color={colors.forestGreen} />
          </button>
        </span>
      ))}

      <button
        onClick={onClearAll}
        className="text-sm hover:underline ml-2"
        style={{ color: isDark ? colors.gray : colors.midnightBlack }}
      >
        {clearAllLabel}
      </button>
    </div>
  );
};

export default ActiveFilters;
