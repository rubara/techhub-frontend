'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useUIStore } from '@/store';
import { ChevronDownIcon, ArrowRightIcon } from '@/components/ui';
import { colors } from '@/lib/colors';
import { menuItems, megaMenuData } from '@/lib/constants';

export const Navigation = () => {
  const { isDark, t } = useUIStore();
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  const getMenuLabel = (id: string): string => {
    return t[id as keyof typeof t] as string || id;
  };

  const handleMouseEnter = (id: string) => {
    setActiveMenu(id);
  };

  const handleMouseLeave = () => {
    setActiveMenu(null);
  };

  return (
    <nav
      style={{
        background: isDark ? 'rgba(255,255,255,0.02)' : colors.white,
        borderBottom: isDark ? '1px solid rgba(255,255,255,0.05)' : '1px solid #eee',
      }}
    >
      <div
        className="mx-auto"
        style={{
          maxWidth: '1400px',
          padding: '0 24px',
        }}
      >
        <ul className="flex items-center gap-1">
          {menuItems.map((item) => (
            <li
              key={item.id}
              className="relative"
              onMouseEnter={() => item.hasMega && handleMouseEnter(item.id)}
              onMouseLeave={handleMouseLeave}
            >
              {item.hasMega ? (
                <button
                  className="flex items-center gap-1 px-4 py-4 font-semibold transition-colors"
                  style={{
                    color: activeMenu === item.id
                      ? colors.forestGreen
                      : isDark
                      ? colors.white
                      : colors.midnightBlack,
                    fontSize: '14px',
                  }}
                >
                  {getMenuLabel(item.id)}
                  <ChevronDownIcon
                    size={14}
                    className={`transition-transform duration-200 ${
                      activeMenu === item.id ? 'rotate-180' : ''
                    }`}
                  />
                </button>
              ) : (
                <Link
                  href={item.href || '#'}
                  className="flex items-center gap-1 px-4 py-4 font-semibold transition-colors"
                  style={{
                    color: item.highlight === 'pink'
                      ? colors.pink
                      : item.highlight === 'green'
                      ? colors.forestGreen
                      : isDark
                      ? colors.white
                      : colors.midnightBlack,
                    fontSize: '14px',
                  }}
                  onMouseEnter={(e) => {
                    if (!item.highlight) {
                      e.currentTarget.style.color = colors.forestGreen;
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!item.highlight) {
                      e.currentTarget.style.color = isDark ? colors.white : colors.midnightBlack;
                    }
                  }}
                >
                  {getMenuLabel(item.id)}
                </Link>
              )}

              {/* Mega Menu Dropdown */}
              {item.hasMega && activeMenu === item.id && (
                <div
                  className="absolute left-0 top-full z-50 rounded-b-xl shadow-xl"
                  style={{
                    minWidth: '280px',
                    background: isDark ? colors.midnightBlack : colors.white,
                    border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid #eee',
                    borderTop: 'none',
                  }}
                >
                  <div className="p-4">
                    <ul className="space-y-1">
                      {megaMenuData[item.id as keyof typeof megaMenuData]?.map((subItem) => (
                        <li key={subItem.id}>
                          <Link
                            href={subItem.href}
                            className="flex items-center justify-between px-3 py-2 rounded-lg transition-all duration-200"
                            style={{
                              color: isDark ? colors.white : colors.midnightBlack,
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.background = isDark
                                ? 'rgba(255,255,255,0.05)'
                                : 'rgba(0,0,0,0.03)';
                              e.currentTarget.style.color = colors.forestGreen;
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.background = 'transparent';
                              e.currentTarget.style.color = isDark ? colors.white : colors.midnightBlack;
                            }}
                          >
                            <span className="font-medium">{getMenuLabel(subItem.id)}</span>
                            <ArrowRightIcon size={14} />
                          </Link>
                        </li>
                      ))}
                    </ul>

                    {/* View All Link */}
                    <div
                      className="mt-3 pt-3"
                      style={{
                        borderTop: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid #eee',
                      }}
                    >
                      <Link
                        href={`/category/${item.id}`}
                        className="flex items-center justify-center gap-2 py-2 rounded-lg font-semibold transition-opacity hover:opacity-80"
                        style={{
                          background: colors.forestGreen,
                          color: colors.white,
                        }}
                      >
                        {t.viewAll} {getMenuLabel(item.id)}
                        <ArrowRightIcon size={14} />
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

export default Navigation;
