'use client';

import { useUIStore } from '@/store';
import { colors } from '@/lib/colors';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) => {
  const { isDark, language } = useUIStore();

  if (totalPages <= 1) return null;

  const prevLabel = language === 'bg' ? 'Предишна' : 'Previous';
  const nextLabel = language === 'bg' ? 'Следваща' : 'Next';

  // Generate page numbers to show
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const showEllipsis = totalPages > 7;

    if (!showEllipsis) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, '...', totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
      }
    }

    return pages;
  };

  const buttonStyle = (isActive: boolean, isDisabled: boolean) => ({
    background: isActive
      ? colors.forestGreen
      : isDark
      ? 'rgba(255,255,255,0.1)'
      : 'rgba(0,0,0,0.05)',
    color: isActive
      ? colors.white
      : isDisabled
      ? isDark
        ? 'rgba(255,255,255,0.3)'
        : 'rgba(0,0,0,0.3)'
      : isDark
      ? colors.white
      : colors.midnightBlack,
    cursor: isDisabled ? 'not-allowed' : 'pointer',
  });

  return (
    <div className="flex items-center justify-center gap-2 mt-8 flex-wrap">
      {/* Previous Button */}
      <button
        onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        style={buttonStyle(false, currentPage === 1)}
      >
        {prevLabel}
      </button>

      {/* Page Numbers */}
      {getPageNumbers().map((page, index) =>
        typeof page === 'string' ? (
          <span
            key={`ellipsis-${index}`}
            className="px-2"
            style={{ color: isDark ? colors.gray : colors.midnightBlack }}
          >
            {page}
          </span>
        ) : (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className="w-10 h-10 rounded-lg text-sm font-medium transition-colors"
            style={buttonStyle(page === currentPage, false)}
          >
            {page}
          </button>
        )
      )}

      {/* Next Button */}
      <button
        onClick={() => currentPage < totalPages && onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        style={buttonStyle(false, currentPage === totalPages)}
      >
        {nextLabel}
      </button>
    </div>
  );
};

export default Pagination;
