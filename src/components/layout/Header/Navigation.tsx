'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useUIStore } from '@/store';
import { ChevronDownIcon, ArrowRightIcon, ChevronRightIcon } from '@/components/ui';
import { colors } from '@/lib/colors';

interface Category {
  id: number;
  name: string;
  nameBg: string;
  slug: string;
  showInMenu: boolean;
  order: number;
  category?: Category | null;
}

export const Navigation = () => {
  const { isDark, language } = useUIStore();
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [activeSubMenu, setActiveSubMenu] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/categories?populate=*&sort=order:asc`
        );
        const data = await res.json();
        setCategories(data.data || []);
      } catch (error) {
        console.error('Failed to fetch categories:', error);
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Level 1: Top-level categories (Components, Peripherals)
  const topLevelCategories = categories.filter(
    (cat) => !cat.category && cat.showInMenu
  );

  // Get direct children of a category
  const getChildren = (parentId: number): Category[] => {
    return categories.filter((cat) => cat.category?.id === parentId);
  };

  const getCategoryName = (cat: Category): string => {
    return language === 'bg' ? cat.nameBg : cat.name;
  };

  const handleMouseEnter = (slug: string) => {
    setActiveMenu(slug);
    setActiveSubMenu(null);
  };

  const handleMouseLeave = () => {
    setActiveMenu(null);
    setActiveSubMenu(null);
  };

  const handleSubMenuEnter = (slug: string) => {
    setActiveSubMenu(slug);
  };

  const staticItems = [
    { id: 'deals', label: language === 'bg' ? 'Промоции' : 'Deals', href: '/deals', highlight: 'pink' },
    { id: 'pc-builder', label: language === 'bg' ? 'PC Конфигуратор' : 'PC Builder', href: '/pc-builder', highlight: 'green' },
  ];

  if (loading) {
    return (
      <nav
        style={{
          background: isDark ? 'rgba(255,255,255,0.02)' : colors.white,
          borderBottom: isDark ? '1px solid rgba(255,255,255,0.05)' : '1px solid #eee',
          height: '56px',
        }}
      />
    );
  }

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
          {/* Dynamic Categories */}
          {topLevelCategories.map((topCat) => {
            const children = getChildren(topCat.id);
            const hasChildren = children.length > 0;

            return (
              <li
                key={topCat.id}
                className="relative"
                onMouseEnter={() => hasChildren && handleMouseEnter(topCat.slug)}
                onMouseLeave={handleMouseLeave}
              >
                {hasChildren ? (
                  <button
                    className="flex items-center gap-1 px-4 py-4 font-semibold transition-colors"
                    style={{
                      color: activeMenu === topCat.slug
                        ? colors.forestGreen
                        : isDark
                        ? colors.white
                        : colors.midnightBlack,
                      fontSize: '14px',
                    }}
                  >
                    {getCategoryName(topCat)}
                    <ChevronDownIcon
                      size={14}
                      className={`transition-transform duration-200 ${
                        activeMenu === topCat.slug ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                ) : (
                  <Link
                    href={`/category/${topCat.slug}`}
                    className="flex items-center gap-1 px-4 py-4 font-semibold transition-colors hover:text-green-500"
                    style={{
                      color: isDark ? colors.white : colors.midnightBlack,
                      fontSize: '14px',
                    }}
                  >
                    {getCategoryName(topCat)}
                  </Link>
                )}

                {/* Level 2 Dropdown */}
                {hasChildren && activeMenu === topCat.slug && (
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
                        {children.map((child) => {
                          const subChildren = getChildren(child.id);
                          const hasSubChildren = subChildren.length > 0;

                          return (
                            <li
                              key={child.id}
                              className="relative"
                              onMouseEnter={() => hasSubChildren && handleSubMenuEnter(child.slug)}
                              onMouseLeave={() => !hasSubChildren && setActiveSubMenu(null)}
                            >
                              <Link
                                href={`/category/${child.slug}`}
                                className="flex items-center justify-between px-3 py-2 rounded-lg transition-all duration-200"
                                style={{
                                  color: activeSubMenu === child.slug
                                    ? colors.forestGreen
                                    : isDark
                                    ? colors.white
                                    : colors.midnightBlack,
                                  background: activeSubMenu === child.slug
                                    ? isDark
                                      ? 'rgba(255,255,255,0.05)'
                                      : 'rgba(0,0,0,0.03)'
                                    : 'transparent',
                                }}
                                onMouseEnter={(e) => {
                                  if (!hasSubChildren) {
                                    e.currentTarget.style.background = isDark
                                      ? 'rgba(255,255,255,0.05)'
                                      : 'rgba(0,0,0,0.03)';
                                    e.currentTarget.style.color = colors.forestGreen;
                                  }
                                }}
                                onMouseLeave={(e) => {
                                  if (!hasSubChildren) {
                                    e.currentTarget.style.background = 'transparent';
                                    e.currentTarget.style.color = isDark ? colors.white : colors.midnightBlack;
                                  }
                                }}
                              >
                                <span className="font-medium">{getCategoryName(child)}</span>
                                {hasSubChildren ? (
                                  <ChevronRightIcon size={14} />
                                ) : (
                                  <ArrowRightIcon size={14} />
                                )}
                              </Link>

                              {/* Level 3 Submenu */}
                              {hasSubChildren && activeSubMenu === child.slug && (
                                <div
                                  className="absolute left-full top-0 z-50 rounded-xl shadow-xl ml-1"
                                  style={{
                                    minWidth: '220px',
                                    background: isDark ? colors.midnightBlack : colors.white,
                                    border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid #eee',
                                  }}
                                >
                                  <div className="p-3">
                                    <ul className="space-y-1">
                                      {subChildren.map((subChild) => (
                                        <li key={subChild.id}>
                                          <Link
                                            href={`/category/${subChild.slug}`}
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
                                            <span className="font-medium">{getCategoryName(subChild)}</span>
                                            <ArrowRightIcon size={14} />
                                          </Link>
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                </div>
                              )}
                            </li>
                          );
                        })}
                      </ul>

                      {/* View All Link */}
                      <div
                        className="mt-3 pt-3"
                        style={{
                          borderTop: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid #eee',
                        }}
                      >
                        <Link
                          href={`/category/${topCat.slug}`}
                          className="flex items-center justify-center gap-2 py-2 rounded-lg font-semibold transition-opacity hover:opacity-80"
                          style={{
                            background: colors.forestGreen,
                            color: colors.white,
                          }}
                        >
                          {language === 'bg' ? 'Виж всички' : 'View All'} {getCategoryName(topCat)}
                          <ArrowRightIcon size={14} />
                        </Link>
                      </div>
                    </div>
                  </div>
                )}
              </li>
            );
          })}

          {/* Static Menu Items */}
          {staticItems.map((item) => (
            <li key={item.id}>
              <Link
                href={item.href}
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
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

export default Navigation;
