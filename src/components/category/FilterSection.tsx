'use client';

import { useState } from 'react';
import { useUIStore } from '@/store';
import { colors } from '@/lib/colors';
import { ChevronDownIcon } from '@/components/ui';
import { FilterConfig, FilterState } from '@/types';
import { formatFilterValue } from '@/lib/filters';

interface FilterSectionProps {
  filter: FilterConfig;
  activeFilters: FilterState;
  onFilterChange: (filterId: string, value: any) => void;
}

export const FilterSection = ({
  filter,
  activeFilters,
  onFilterChange,
}: FilterSectionProps) => {
  const { isDark, language } = useUIStore();
  const [isExpanded, setIsExpanded] = useState(true);
  const [showAll, setShowAll] = useState(false);

  const label = language === 'bg' ? filter.labelBg : filter.label;
  const currentValue = activeFilters[filter.id];

  // Toggle filter
  if (filter.type === 'toggle') {
    const isActive = currentValue === true;

    return (
      <div
        className="py-4"
        style={{
          borderBottom: isDark
            ? '1px solid rgba(255,255,255,0.1)'
            : '1px solid rgba(0,0,0,0.1)',
        }}
      >
        <label className="flex items-center justify-between cursor-pointer">
          <span
            className="font-medium"
            style={{ color: isDark ? colors.white : colors.midnightBlack }}
          >
            {label}
          </span>
          <button
            onClick={() => onFilterChange(filter.id, !isActive)}
            className="relative w-11 h-6 rounded-full transition-colors"
            style={{
              background: isActive ? colors.forestGreen : isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)',
            }}
          >
            <span
              className="absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform"
              style={{
                transform: isActive ? 'translateX(20px)' : 'translateX(0)',
              }}
            />
          </button>
        </label>
      </div>
    );
  }

  // Range filter
  if (filter.type === 'range') {
    const minValue = (activeFilters[`${filter.id}Min`] as number) || filter.min || 0;
    const maxValue = (activeFilters[`${filter.id}Max`] as number) || filter.max || 10000;

    return (
      <div
        className="py-4"
        style={{
          borderBottom: isDark
            ? '1px solid rgba(255,255,255,0.1)'
            : '1px solid rgba(0,0,0,0.1)',
        }}
      >
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center justify-between w-full"
        >
          <span
            className="font-medium"
            style={{ color: isDark ? colors.white : colors.midnightBlack }}
          >
            {label}
          </span>
          <ChevronDownIcon
            size={16}
            className={`transition-transform ${isExpanded ? 'rotate-180' : ''}`}
            color={isDark ? colors.gray : colors.midnightBlack}
          />
        </button>

        {isExpanded && (
          <div className="mt-4 space-y-3">
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={minValue}
                onChange={(e) =>
                  onFilterChange(`${filter.id}Min`, parseInt(e.target.value) || 0)
                }
                className="w-full px-3 py-2 rounded-lg text-sm"
                style={{
                  background: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
                  color: isDark ? colors.white : colors.midnightBlack,
                  border: 'none',
                }}
                placeholder="Min"
              />
              <span style={{ color: isDark ? colors.gray : colors.midnightBlack }}>-</span>
              <input
                type="number"
                value={maxValue}
                onChange={(e) =>
                  onFilterChange(`${filter.id}Max`, parseInt(e.target.value) || filter.max)
                }
                className="w-full px-3 py-2 rounded-lg text-sm"
                style={{
                  background: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
                  color: isDark ? colors.white : colors.midnightBlack,
                  border: 'none',
                }}
                placeholder="Max"
              />
            </div>
            {filter.unit && (
              <p
                className="text-xs"
                style={{ color: isDark ? colors.gray : colors.midnightBlack }}
              >
                {minValue} - {maxValue} {filter.unit}
              </p>
            )}
          </div>
        )}
      </div>
    );
  }

  // Checkbox filter
  if (filter.type === 'checkbox' && Array.isArray(filter.options)) {
    const selectedValues = Array.isArray(currentValue)
      ? currentValue
      : currentValue
      ? [currentValue]
      : [];

    const displayOptions = showAll ? filter.options : filter.options.slice(0, 6);
    const hasMore = filter.options.length > 6;

    const handleCheckboxChange = (optionValue: string) => {
      const newValues = selectedValues.includes(optionValue)
        ? selectedValues.filter((v) => v !== optionValue)
        : [...selectedValues, optionValue];
      onFilterChange(filter.id, newValues.length > 0 ? newValues : undefined);
    };

    return (
      <div
        className="py-4"
        style={{
          borderBottom: isDark
            ? '1px solid rgba(255,255,255,0.1)'
            : '1px solid rgba(0,0,0,0.1)',
        }}
      >
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center justify-between w-full"
        >
          <span
            className="font-medium"
            style={{ color: isDark ? colors.white : colors.midnightBlack }}
          >
            {label}
            {selectedValues.length > 0 && (
              <span
                className="ml-2 text-xs px-2 py-0.5 rounded-full"
                style={{ background: colors.forestGreen, color: colors.white }}
              >
                {selectedValues.length}
              </span>
            )}
          </span>
          <ChevronDownIcon
            size={16}
            className={`transition-transform ${isExpanded ? 'rotate-180' : ''}`}
            color={isDark ? colors.gray : colors.midnightBlack}
          />
        </button>

        {isExpanded && (
          <div className="mt-3 space-y-2">
            {displayOptions.map((option) => {
              const optionValue = typeof option === 'string' ? option : option.value;
              const optionLabel = typeof option === 'string' ? formatFilterValue(option) : option.label;
              const isSelected = selectedValues.includes(optionValue);

              return (
                <label
                  key={optionValue}
                  className="flex items-center gap-3 cursor-pointer py-1"
                >
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => handleCheckboxChange(optionValue)}
                    className="sr-only"
                  />
                  <span
                    className="w-5 h-5 rounded flex items-center justify-center transition-colors"
                    style={{
                      background: isSelected
                        ? colors.forestGreen
                        : isDark
                        ? 'rgba(255,255,255,0.1)'
                        : 'rgba(0,0,0,0.1)',
                      border: isSelected ? 'none' : `1px solid ${isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)'}`,
                    }}
                  >
                    {isSelected && (
                      <svg
                        width="12"
                        height="12"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="white"
                        strokeWidth="3"
                      >
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    )}
                  </span>
                  <span
                    className="text-sm"
                    style={{
                      color: isSelected
                        ? colors.forestGreen
                        : isDark
                        ? colors.white
                        : colors.midnightBlack,
                    }}
                  >
                    {optionLabel}
                  </span>
                </label>
              );
            })}

            {hasMore && (
              <button
                onClick={() => setShowAll(!showAll)}
                className="text-sm mt-2 hover:underline"
                style={{ color: colors.forestGreen }}
              >
                {showAll
                  ? language === 'bg'
                    ? 'Покажи по-малко'
                    : 'Show less'
                  : language === 'bg'
                  ? `Покажи всички (${filter.options.length})`
                  : `Show all (${filter.options.length})`}
              </button>
            )}
          </div>
        )}
      </div>
    );
  }

  return null;
};

export default FilterSection;
