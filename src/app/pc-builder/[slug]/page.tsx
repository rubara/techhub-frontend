'use client';

import { useState, useEffect, useMemo } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useUIStore, useCartStore } from '@/store';
import { colors } from '@/lib/colors';
import { 
  getPcBuildTemplateBySlug, 
  getBuildComponents,
  getPcBuildTemplates 
} from '@/lib/api';
import {
  BuildComponent,
  ComponentCategory,
  SelectedComponents,
  categoryLabels,
  categoryOrder,
} from '@/types/pc-builder';

export default function PcBuilderPage() {
  const params = useParams();
  const slug = params.slug as string;

  const { isDark, language } = useUIStore();
  const { addItem } = useCartStore();

  const [template, setTemplate] = useState<any>(null);
  const [allComponents, setAllComponents] = useState<BuildComponent[]>([]);
  const [selectedComponents, setSelectedComponents] = useState<SelectedComponents>({});
  const [loading, setLoading] = useState(true);
  const [expandedCategory, setExpandedCategory] = useState<ComponentCategory | null>('cpu');
  const [addedToCart, setAddedToCart] = useState(false);

  // Fetch template and components
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      const fetchedTemplate = await getPcBuildTemplateBySlug(slug);
      setTemplate(fetchedTemplate);

      if (fetchedTemplate) {
        const components = await getBuildComponents(fetchedTemplate.id);
        setAllComponents(components);

        // Set default selections
        const defaults: SelectedComponents = {};
        components.forEach((comp: BuildComponent) => {
          if (comp.isDefault) {
            defaults[comp.category] = comp;
          }
        });
        setSelectedComponents(defaults);
      }

      setLoading(false);
    };

    fetchData();
  }, [slug]);

  // Group components by category
  const componentsByCategory = useMemo(() => {
    const grouped: Record<ComponentCategory, BuildComponent[]> = {} as any;
    
    categoryOrder.forEach((cat) => {
      grouped[cat] = allComponents
        .filter((c) => c.category === cat)
        .sort((a, b) => a.order - b.order);
    });

    return grouped;
  }, [allComponents]);

  // Calculate total price
  const totalPrice = useMemo(() => {
    if (!template) return 0;

    let price = template.basePrice;
    Object.values(selectedComponents).forEach((comp) => {
      if (comp) {
        price += comp.priceDifference;
      }
    });

    return price;
  }, [template, selectedComponents]);

  // Calculate upgrade cost
  const upgradeCost = useMemo(() => {
    let cost = 0;
    Object.values(selectedComponents).forEach((comp) => {
      if (comp && comp.priceDifference > 0) {
        cost += comp.priceDifference;
      }
    });
    return cost;
  }, [selectedComponents]);

  // Handle component selection
  const handleSelectComponent = (component: BuildComponent) => {
    setSelectedComponents((prev) => ({
      ...prev,
      [component.category]: component,
    }));
  };

  // Toggle category expansion
  const toggleCategory = (category: ComponentCategory) => {
    setExpandedCategory((prev) => (prev === category ? null : category));
  };

  // Get image URL helper
  const getImageUrl = (image?: { url: string }): string => {
    if (!image?.url) return '/placeholder-product.svg';
    if (image.url.startsWith('http')) return image.url;
    return `${process.env.NEXT_PUBLIC_STRAPI_URL}${image.url}`;
  };

  // Add to cart handler
  const handleAddToCart = () => {
    if (!template) return;

    // Create a custom product for the build
    const buildProduct = {
      id: `build-${template.id}-${Date.now()}`,
      name: template.name,
      nameBg: template.nameBg,
      slug: template.slug,
      price: totalPrice,
      stock: 10,
      image: template.image,
      isBuild: true,
      components: selectedComponents,
    };

    addItem(buildProduct as any, 1);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  // Loading state
  if (loading) {
    return (
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div
            className="h-8 w-64 rounded mb-6"
            style={{ background: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' }}
          />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div
              className="lg:col-span-1 h-96 rounded-xl"
              style={{ background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }}
            />
            <div
              className="lg:col-span-2 h-96 rounded-xl"
              style={{ background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }}
            />
          </div>
        </div>
      </main>
    );
  }

  // Template not found
  if (!template) {
    return (
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div
          className="text-center py-20 rounded-2xl"
          style={{
            background: isDark ? 'rgba(255,255,255,0.03)' : colors.white,
            border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.1)',
          }}
        >
          <h1
            className="text-2xl font-bold mb-4"
            style={{ color: isDark ? colors.white : colors.midnightBlack }}
          >
            {language === 'bg' ? 'Конфигураторът не е намерен' : 'Configurator Not Found'}
          </h1>
          <Link
            href="/pc-builder"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-medium"
            style={{ background: colors.forestGreen, color: colors.white }}
          >
            {language === 'bg' ? 'Виж всички конфигуратори' : 'View All Configurators'}
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="max-w-7xl mx-auto px-4 py-4">
      {/* Header */}
      <div className="mb-6">
        <Link
          href="/pc-builder"
          className="text-sm mb-2 inline-block hover:underline"
          style={{ color: colors.forestGreen }}
        >
          ← {language === 'bg' ? 'Всички конфигуратори' : 'All Configurators'}
        </Link>
        <h1
          className="text-2xl md:text-3xl font-bold"
          style={{ color: isDark ? colors.white : colors.midnightBlack }}
        >
          {language === 'bg' ? template.nameBg : template.name}
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Summary (Sticky) */}
        <div className="lg:col-span-1">
          <div
            className="lg:sticky lg:top-4 rounded-2xl overflow-hidden"
            style={{
              background: isDark ? 'rgba(255,255,255,0.03)' : colors.white,
              border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.1)',
            }}
          >
            {/* PC Image */}
            <div
              className="relative aspect-square"
              style={{ background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)' }}
            >
              <Image
                src={getImageUrl(template.image)}
                alt={template.name}
                fill
                className="object-contain p-6"
              />
            </div>

            {/* Summary */}
            <div className="p-4">
              <h2
                className="font-bold mb-4"
                style={{ color: isDark ? colors.white : colors.midnightBlack }}
              >
                {language === 'bg' ? 'Вашата конфигурация' : 'Your Build'}
              </h2>

              {/* Selected Components List */}
              <div className="space-y-2 mb-4">
                {categoryOrder.map((category) => {
                  const selected = selectedComponents[category];
                  if (!selected) return null;

                  return (
                    <div
                      key={category}
                      className="flex justify-between items-center text-sm"
                    >
                      <span style={{ color: isDark ? colors.gray : colors.midnightBlack }}>
                        {language === 'bg'
                          ? categoryLabels[category].bg
                          : categoryLabels[category].en}
                        :
                      </span>
                      <span
                        className="text-right truncate ml-2 max-w-[150px]"
                        style={{ color: isDark ? colors.white : colors.midnightBlack }}
                        title={selected.name}
                      >
                        {selected.name}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Price Breakdown */}
              <div
                className="border-t pt-4 space-y-2"
                style={{ borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' }}
              >
                <div className="flex justify-between text-sm">
                  <span style={{ color: isDark ? colors.gray : colors.midnightBlack }}>
                    {language === 'bg' ? 'Базова цена' : 'Base Price'}
                  </span>
                  <span style={{ color: isDark ? colors.white : colors.midnightBlack }}>
                    {template.basePrice.toFixed(2)} лв.
                  </span>
                </div>
                {upgradeCost > 0 && (
                  <div className="flex justify-between text-sm">
                    <span style={{ color: isDark ? colors.gray : colors.midnightBlack }}>
                      {language === 'bg' ? 'Ъпгрейди' : 'Upgrades'}
                    </span>
                    <span style={{ color: colors.forestGreen }}>
                      +{upgradeCost.toFixed(2)} лв.
                    </span>
                  </div>
                )}
                <div
                  className="flex justify-between font-bold text-lg pt-2 border-t"
                  style={{ borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' }}
                >
                  <span style={{ color: isDark ? colors.white : colors.midnightBlack }}>
                    {language === 'bg' ? 'Общо' : 'Total'}
                  </span>
                  <span style={{ color: colors.forestGreen }}>
                    {totalPrice.toFixed(2)} лв.
                  </span>
                </div>
              </div>

              {/* Add to Cart Button */}
              <button
                onClick={handleAddToCart}
                className="w-full mt-4 py-3 rounded-xl font-semibold text-lg transition-all"
                style={{
                  background: colors.forestGreen,
                  color: colors.white,
                }}
              >
                {addedToCart
                  ? language === 'bg'
                    ? '✓ Добавено!'
                    : '✓ Added!'
                  : language === 'bg'
                  ? 'Добави в количката'
                  : 'Add to Cart'}
              </button>

              {/* Installment Info */}
              {totalPrice >= 100 && (
                <p
                  className="text-center text-sm mt-3"
                  style={{ color: colors.forestGreen }}
                >
                  {language === 'bg'
                    ? `или от ${(totalPrice / 12).toFixed(2)} лв./месец`
                    : `or from ${(totalPrice / 12).toFixed(2)} BGN/month`}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Right Column - Component Selection */}
        <div className="lg:col-span-2 space-y-4">
          {categoryOrder.map((category) => {
            const components = componentsByCategory[category];
            if (!components || components.length === 0) return null;

            const isExpanded = expandedCategory === category;
            const selected = selectedComponents[category];
            const categoryInfo = categoryLabels[category];

            return (
              <div
                key={category}
                className="rounded-xl overflow-hidden"
                style={{
                  background: isDark ? 'rgba(255,255,255,0.03)' : colors.white,
                  border: isDark
                    ? '1px solid rgba(255,255,255,0.1)'
                    : '1px solid rgba(0,0,0,0.1)',
                }}
              >
                {/* Category Header */}
                <button
                  onClick={() => toggleCategory(category)}
                  className="w-full px-4 py-4 flex items-center justify-between"
                  style={{
                    background: isExpanded
                      ? isDark
                        ? 'rgba(255,255,255,0.05)'
                        : 'rgba(0,0,0,0.03)'
                      : 'transparent',
                  }}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{categoryInfo.icon}</span>
                    <div className="text-left">
                      <h3
                        className="font-semibold"
                        style={{ color: isDark ? colors.white : colors.midnightBlack }}
                      >
                        {language === 'bg' ? categoryInfo.bg : categoryInfo.en}
                      </h3>
                      {selected && (
                        <p
                          className="text-sm truncate max-w-[250px] md:max-w-[400px]"
                          style={{ color: isDark ? colors.gray : colors.midnightBlack }}
                        >
                          {selected.name}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {selected && (
                      <span
                        className="text-sm font-medium"
                        style={{
                          color:
                            selected.priceDifference > 0
                              ? colors.forestGreen
                              : selected.priceDifference < 0
                              ? colors.pink
                              : isDark
                              ? colors.gray
                              : colors.midnightBlack,
                        }}
                      >
                        {selected.priceDifference > 0
                          ? `+${selected.priceDifference.toFixed(2)} лв.`
                          : selected.priceDifference < 0
                          ? `${selected.priceDifference.toFixed(2)} лв.`
                          : language === 'bg'
                          ? 'Включено'
                          : 'Included'}
                      </span>
                    )}
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke={isDark ? colors.white : colors.midnightBlack}
                      strokeWidth="2"
                      style={{
                        transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                        transition: 'transform 0.2s',
                      }}
                    >
                      <polyline points="6,9 12,15 18,9" />
                    </svg>
                  </div>
                </button>

                {/* Component Options */}
                {isExpanded && (
                  <div
                    className="border-t"
                    style={{
                      borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
                    }}
                  >
                    {components.map((component) => {
                      const isSelected = selected?.id === component.id;

                      return (
                        <button
                          key={component.id}
                          onClick={() => handleSelectComponent(component)}
                          className="w-full px-4 py-3 flex items-center gap-4 transition-colors text-left"
                          style={{
                            background: isSelected
                              ? isDark
                                ? 'rgba(34,197,94,0.1)'
                                : 'rgba(34,197,94,0.05)'
                              : 'transparent',
                            borderBottom: isDark
                              ? '1px solid rgba(255,255,255,0.05)'
                              : '1px solid rgba(0,0,0,0.05)',
                          }}
                        >
                          {/* Selection Radio */}
                          <div
                            className="w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0"
                            style={{
                              borderColor: isSelected
                                ? colors.forestGreen
                                : isDark
                                ? 'rgba(255,255,255,0.3)'
                                : 'rgba(0,0,0,0.3)',
                            }}
                          >
                            {isSelected && (
                              <div
                                className="w-3 h-3 rounded-full"
                                style={{ background: colors.forestGreen }}
                              />
                            )}
                          </div>

                          {/* Component Image */}
                          {component.image && (
                            <div
                              className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0"
                              style={{
                                background: isDark
                                  ? 'rgba(255,255,255,0.05)'
                                  : 'rgba(0,0,0,0.03)',
                              }}
                            >
                              <Image
                                src={getImageUrl(component.image)}
                                alt={component.name}
                                width={48}
                                height={48}
                                className="object-contain p-1"
                              />
                            </div>
                          )}

                          {/* Component Info */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span
                                className="font-medium truncate"
                                style={{
                                  color: isDark ? colors.white : colors.midnightBlack,
                                }}
                              >
                                {component.name}
                              </span>
                              {component.hasRgb && (
                                <span
                                  className="text-xs px-1.5 py-0.5 rounded"
                                  style={{
                                    background: 'linear-gradient(90deg, #ff0000, #ff7f00, #ffff00, #00ff00, #0000ff, #8b00ff)',
                                    color: colors.white,
                                    textShadow: '0 1px 2px rgba(0,0,0,0.5)',
                                  }}
                                >
                                  RGB
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Price Difference */}
                          <span
                            className="font-semibold flex-shrink-0"
                            style={{
                              color:
                                component.priceDifference > 0
                                  ? colors.forestGreen
                                  : component.priceDifference < 0
                                  ? colors.pink
                                  : isDark
                                  ? colors.gray
                                  : colors.midnightBlack,
                            }}
                          >
                            {component.priceDifference > 0
                              ? `+${component.priceDifference.toFixed(2)} лв.`
                              : component.priceDifference < 0
                              ? `${component.priceDifference.toFixed(2)} лв.`
                              : language === 'bg'
                              ? 'Включено'
                              : 'Included'}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}
