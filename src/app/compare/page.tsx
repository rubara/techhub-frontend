'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useUIStore, useCompareStore, useCartStore } from '@/store';
import { colors } from '@/lib/colors';

const BGN_TO_EUR = 1.95583;

export default function ComparePage() {
  const router = useRouter();
  const { isDark, language } = useUIStore();
  const { items, removeItem, clearCompare } = useCompareStore();
  const { addItem: addToCart } = useCartStore();
  const [highlightDifferences, setHighlightDifferences] = useState(true);

  const getImageUrl = (image: any): string => {
    if (!image) return '/placeholder-product.svg';
    if (typeof image === 'string') return image;
    if (image.url) {
      return image.url.startsWith('http')
        ? image.url
        : `${process.env.NEXT_PUBLIC_STRAPI_URL}${image.url}`;
    }
    if (image.data?.attributes?.url) {
      const url = image.data.attributes.url;
      return url.startsWith('http')
        ? url
        : `${process.env.NEXT_PUBLIC_STRAPI_URL}${url}`;
    }
    return '/placeholder-product.svg';
  };

  const formatPrice = (price: number) => ({
    bgn: price.toFixed(2),
    eur: (price / BGN_TO_EUR).toFixed(2),
  });

  const getAllSpecKeys = (): string[] => {
    const keysSet = new Set<string>();
    items.forEach((item) => {
      if (item.specs) {
        Object.keys(item.specs).forEach((key) => keysSet.add(key));
      }
    });
    return Array.from(keysSet);
  };

  const valuesDiffer = (key: string): boolean => {
    const values = items.map((item) => item.specs?.[key] || '-');
    return new Set(values).size > 1;
  };

  const getSpecLabel = (key: string): string => {
    const labels: Record<string, { en: string; bg: string }> = {
      processor: { en: 'Processor', bg: 'Процесор' },
      cpu: { en: 'CPU', bg: 'Процесор' },
      ram: { en: 'RAM', bg: 'Памет RAM' },
      memory: { en: 'Memory', bg: 'Памет' },
      storage: { en: 'Storage', bg: 'Съхранение' },
      ssd: { en: 'SSD', bg: 'SSD' },
      hdd: { en: 'HDD', bg: 'HDD' },
      gpu: { en: 'Graphics', bg: 'Видеокарта' },
      graphics: { en: 'Graphics', bg: 'Видеокарта' },
      display: { en: 'Display', bg: 'Дисплей' },
      screen: { en: 'Screen', bg: 'Екран' },
      screenSize: { en: 'Screen Size', bg: 'Размер на екрана' },
      resolution: { en: 'Resolution', bg: 'Резолюция' },
      battery: { en: 'Battery', bg: 'Батерия' },
      weight: { en: 'Weight', bg: 'Тегло' },
      dimensions: { en: 'Dimensions', bg: 'Размери' },
      os: { en: 'Operating System', bg: 'Операционна система' },
      color: { en: 'Color', bg: 'Цвят' },
      warranty: { en: 'Warranty', bg: 'Гаранция' },
      connectivity: { en: 'Connectivity', bg: 'Свързаност' },
      ports: { en: 'Ports', bg: 'Портове' },
      wifi: { en: 'WiFi', bg: 'WiFi' },
      bluetooth: { en: 'Bluetooth', bg: 'Bluetooth' },
      camera: { en: 'Camera', bg: 'Камера' },
      refreshRate: { en: 'Refresh Rate', bg: 'Честота на опресняване' },
      panelType: { en: 'Panel Type', bg: 'Тип панел' },
      responseTime: { en: 'Response Time', bg: 'Време за реакция' },
      socket: { en: 'Socket', bg: 'Сокет' },
      cores: { en: 'Cores', bg: 'Ядра' },
      threads: { en: 'Threads', bg: 'Нишки' },
      speed: { en: 'Speed', bg: 'Скорост' },
      wattage: { en: 'Wattage', bg: 'Мощност' },
      efficiency: { en: 'Efficiency', bg: 'Ефективност' },
      formFactor: { en: 'Form Factor', bg: 'Форм фактор' },
      chipset: { en: 'Chipset', bg: 'Чипсет' },
    };

    const label = labels[key.toLowerCase()];
    if (label) {
      return language === 'bg' ? label.bg : label.en;
    }
    return key.charAt(0).toUpperCase() + key.slice(1);
  };

  const handleAddToCart = (item: typeof items[0]) => {
    addToCart({
      id: item.id,
      name: item.name,
      nameBg: item.nameBg,
      slug: item.slug,
      price: item.price,
      image: item.image,
    });
  };

  if (items.length < 2) {
    return (
      <main className="max-w-4xl mx-auto px-4 py-12 text-center">
        <div
          className="w-24 h-24 mx-auto mb-6 rounded-full flex items-center justify-center"
          style={{ background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }}
        >
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke={colors.gray} strokeWidth="1.5">
            <line x1="18" y1="20" x2="18" y2="10" />
            <line x1="12" y1="20" x2="12" y2="4" />
            <line x1="6" y1="20" x2="6" y2="14" />
          </svg>
        </div>
        <h1
          className="text-2xl font-bold mb-4"
          style={{ color: isDark ? colors.white : colors.midnightBlack }}
        >
          {language === 'bg' ? 'Сравнение на продукти' : 'Product Comparison'}
        </h1>
        <p className="mb-6" style={{ color: isDark ? colors.gray : colors.midnightBlack }}>
          {language === 'bg'
            ? 'Добавете поне 2 продукта от една категория, за да ги сравните.'
            : 'Add at least 2 products from the same category to compare them.'}
        </p>
        <Link
          href="/products"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold"
          style={{ background: colors.forestGreen, color: colors.white }}
        >
          {language === 'bg' ? 'Разгледай продукти' : 'Browse Products'}
        </Link>
      </main>
    );
  }

  const specKeys = getAllSpecKeys();

  return (
    <main className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h1
            className="text-2xl font-bold"
            style={{ color: isDark ? colors.white : colors.midnightBlack }}
          >
            {language === 'bg' ? 'Сравнение на продукти' : 'Product Comparison'}
          </h1>
          {items[0]?.categoryName && (
            <p className="text-sm mt-1" style={{ color: isDark ? colors.gray : colors.midnightBlack }}>
              {items[0].categoryName}
            </p>
          )}
        </div>
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={highlightDifferences}
              onChange={(e) => setHighlightDifferences(e.target.checked)}
              className="w-4 h-4 rounded accent-green-500"
            />
            <span className="text-sm" style={{ color: isDark ? colors.gray : colors.midnightBlack }}>
              {language === 'bg' ? 'Покажи разликите' : 'Highlight differences'}
            </span>
          </label>
          <button
            onClick={() => {
              clearCompare();
              router.push('/products');
            }}
            className="px-4 py-2 rounded-xl text-sm"
            style={{
              background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
              color: isDark ? colors.gray : colors.midnightBlack,
            }}
          >
            {language === 'bg' ? 'Изчисти всички' : 'Clear All'}
          </button>
        </div>
      </div>

      {/* Comparison Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse" style={{ minWidth: items.length * 250 }}>
          <thead>
            <tr>
              <th
                className="sticky left-0 z-10 p-4 text-left w-40"
                style={{
                  background: isDark ? colors.midnightBlack : colors.white,
                  borderBottom: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.1)',
                }}
              >
                <span className="sr-only">Spec</span>
              </th>
              {items.map((item) => (
                <th
                  key={item.id}
                  className="p-4 text-center min-w-[200px]"
                  style={{
                    borderBottom: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.1)',
                  }}
                >
                  <div className="relative">
                    <button
                      onClick={() => removeItem(item.id)}
                      className="absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center hover:scale-110 transition-transform"
                      style={{ background: '#ef4444', color: colors.white }}
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="18" y1="6" x2="6" y2="18" />
                        <line x1="6" y1="6" x2="18" y2="18" />
                      </svg>
                    </button>

                    <Link href={`/products/${item.slug}`}>
                      <div
                        className="w-32 h-32 mx-auto mb-3 rounded-xl overflow-hidden"
                        style={{
                          background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
                        }}
                      >
                        <Image
                          src={getImageUrl(item.image)}
                          alt={item.name}
                          width={128}
                          height={128}
                          className="w-full h-full object-contain p-2"
                        />
                      </div>
                    </Link>

                    <Link
                      href={`/products/${item.slug}`}
                      className="font-medium hover:underline"
                      style={{ color: isDark ? colors.white : colors.midnightBlack }}
                    >
                      {language === 'bg' && item.nameBg ? item.nameBg : item.name}
                    </Link>

                    {item.brand && (
                      <p className="text-xs mt-1" style={{ color: colors.gray }}>
                        {item.brand}
                      </p>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {/* Price Row */}
            <tr>
              <td
                className="sticky left-0 z-10 p-4 font-medium"
                style={{
                  background: isDark ? colors.midnightBlack : colors.white,
                  color: isDark ? colors.white : colors.midnightBlack,
                  borderBottom: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.1)',
                }}
              >
                {language === 'bg' ? 'Цена' : 'Price'}
              </td>
              {items.map((item) => {
                const isDifferent = highlightDifferences && new Set(items.map((i) => i.price)).size > 1;
                const isLowest = item.price === Math.min(...items.map((i) => i.price));

                return (
                  <td
                    key={item.id}
                    className="p-4 text-center"
                    style={{
                      background: isDifferent && isLowest
                        ? 'rgba(34,197,94,0.1)'
                        : isDifferent
                        ? 'rgba(251,191,36,0.05)'
                        : 'transparent',
                      borderBottom: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.1)',
                    }}
                  >
                    <div>
                      <p className="text-xl font-bold" style={{ color: colors.forestGreen }}>
                        {formatPrice(item.price).bgn} лв.
                      </p>
                      <p className="text-xs" style={{ color: isDark ? colors.gray : colors.midnightBlack }}>
                        {formatPrice(item.price).eur} €
                      </p>
                      {item.originalPrice && item.originalPrice > item.price && (
                        <p className="text-xs line-through mt-1" style={{ color: colors.gray }}>
                          {formatPrice(item.originalPrice).bgn} лв.
                        </p>
                      )}
                      {isDifferent && isLowest && (
                        <span
                          className="inline-block mt-2 px-2 py-0.5 rounded text-xs font-medium"
                          style={{ background: colors.forestGreen, color: colors.white }}
                        >
                          {language === 'bg' ? 'Най-ниска цена' : 'Lowest Price'}
                        </span>
                      )}
                    </div>
                  </td>
                );
              })}
            </tr>

            {/* Specs Rows */}
            {specKeys.map((key) => {
              const differs = highlightDifferences && valuesDiffer(key);

              return (
                <tr key={key}>
                  <td
                    className="sticky left-0 z-10 p-4 font-medium"
                    style={{
                      background: isDark ? colors.midnightBlack : colors.white,
                      color: isDark ? colors.white : colors.midnightBlack,
                      borderBottom: isDark ? '1px solid rgba(255,255,255,0.05)' : '1px solid rgba(0,0,0,0.05)',
                    }}
                  >
                    {getSpecLabel(key)}
                  </td>
                  {items.map((item) => (
                    <td
                      key={item.id}
                      className="p-4 text-center"
                      style={{
                        background: differs ? 'rgba(251,191,36,0.05)' : 'transparent',
                        color: isDark ? colors.gray : colors.midnightBlack,
                        borderBottom: isDark ? '1px solid rgba(255,255,255,0.05)' : '1px solid rgba(0,0,0,0.05)',
                      }}
                    >
                      {item.specs?.[key] || '-'}
                    </td>
                  ))}
                </tr>
              );
            })}

            {specKeys.length === 0 && (
              <tr>
                <td
                  colSpan={items.length + 1}
                  className="p-8 text-center"
                  style={{ color: isDark ? colors.gray : colors.midnightBlack }}
                >
                  {language === 'bg'
                    ? 'Няма налични спецификации за тези продукти'
                    : 'No specifications available for these products'}
                </td>
              </tr>
            )}

            {/* Actions Row */}
            <tr>
              <td
                className="sticky left-0 z-10 p-4"
                style={{ background: isDark ? colors.midnightBlack : colors.white }}
              />
              {items.map((item) => (
                <td key={item.id} className="p-4">
                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() => handleAddToCart(item)}
                      className="w-full py-2.5 rounded-xl font-semibold"
                      style={{ background: colors.forestGreen, color: colors.white }}
                    >
                      {language === 'bg' ? 'Добави в количката' : 'Add to Cart'}
                    </button>
                    <Link
                      href={`/products/${item.slug}`}
                      className="w-full py-2.5 rounded-xl text-center text-sm"
                      style={{
                        background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
                        color: isDark ? colors.white : colors.midnightBlack,
                      }}
                    >
                      {language === 'bg' ? 'Виж детайли' : 'View Details'}
                    </Link>
                  </div>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </main>
  );
}
