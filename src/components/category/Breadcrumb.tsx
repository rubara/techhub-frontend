'use client';

import Link from 'next/link';
import { useUIStore } from '@/store';
import { colors } from '@/lib/colors';
import { ChevronRightIcon } from '@/components/ui';

interface BreadcrumbItem {
  label: string;
  labelBg: string;
  href: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export const Breadcrumb = ({ items }: BreadcrumbProps) => {
  const { isDark, language } = useUIStore();

  const homeLabel = language === 'bg' ? 'Начало' : 'Home';

  return (
    <nav className="flex items-center gap-2 py-4 text-sm flex-wrap">
      <Link
        href="/"
        className="hover:underline transition-colors"
        style={{ color: isDark ? colors.gray : colors.midnightBlack }}
      >
        {homeLabel}
      </Link>

      {items.map((item, index) => (
        <span key={item.href} className="flex items-center gap-2">
          <ChevronRightIcon
            size={14}
            color={isDark ? colors.gray : colors.midnightBlack}
          />
          {index === items.length - 1 ? (
            <span style={{ color: colors.forestGreen, fontWeight: 500 }}>
              {language === 'bg' ? item.labelBg : item.label}
            </span>
          ) : (
            <Link
              href={item.href}
              className="hover:underline transition-colors"
              style={{ color: isDark ? colors.gray : colors.midnightBlack }}
            >
              {language === 'bg' ? item.labelBg : item.label}
            </Link>
          )}
        </span>
      ))}
    </nav>
  );
};

export default Breadcrumb;
