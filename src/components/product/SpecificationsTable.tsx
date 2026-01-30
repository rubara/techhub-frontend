'use client';

import { useUIStore } from '@/store';
import { colors } from '@/lib/colors';
import { getSpecLabels, SpecConfig } from '@/lib/specifications';
import { formatFilterValue } from '@/lib/filters';

interface SpecificationsTableProps {
  specifications: Record<string, any>;
  specType: string;
}

export const SpecificationsTable = ({
  specifications,
  specType,
}: SpecificationsTableProps) => {
  const { isDark, language } = useUIStore();
  const specLabels: SpecConfig = getSpecLabels(specType);

  // Filter out null/undefined values and internal fields
  const filteredSpecs = Object.entries(specifications).filter(
    ([key, value]) =>
      value !== null &&
      value !== undefined &&
      value !== '' &&
      ![
        'id',
        'documentId',
        'createdAt',
        'updatedAt',
        'publishedAt',
        'product',
        'locale',
        'localizations',
      ].includes(key)
  );

  if (filteredSpecs.length === 0) {
    return null;
  }

  const formatValue = (key: string, value: any): string => {
    // Handle boolean values
    if (typeof value === 'boolean') {
      if (language === 'bg') {
        return value ? 'Да' : 'Не';
      }
      return value ? 'Yes' : 'No';
    }

    // Handle numbers
    if (typeof value === 'number') {
      return value.toString();
    }

    // Handle string values (enum values)
    if (typeof value === 'string') {
      return formatFilterValue(value);
    }

    return String(value);
  };

  const getLabel = (key: string): string => {
    const label = specLabels[key];
    if (label) {
      return language === 'bg' ? label.bg : label.en;
    }
    // Fallback: convert camelCase to readable text
    return key
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, (str) => str.toUpperCase())
      .trim();
  };

  return (
    <div
      className="rounded-xl overflow-hidden"
      style={{
        background: isDark ? 'rgba(255,255,255,0.03)' : colors.white,
        border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.1)',
      }}
    >
      <table className="w-full">
        <tbody>
          {filteredSpecs.map(([key, value], index) => (
            <tr
              key={key}
              style={{
                background:
                  index % 2 === 0
                    ? 'transparent'
                    : isDark
                    ? 'rgba(255,255,255,0.02)'
                    : 'rgba(0,0,0,0.02)',
              }}
            >
              <td
                className="px-4 py-3 text-sm font-medium w-1/2"
                style={{ color: isDark ? colors.gray : colors.midnightBlack }}
              >
                {getLabel(key)}
              </td>
              <td
                className="px-4 py-3 text-sm"
                style={{ color: isDark ? colors.white : colors.midnightBlack }}
              >
                {formatValue(key, value)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SpecificationsTable;
