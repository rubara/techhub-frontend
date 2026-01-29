'use client';

import { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useUIStore, useCartStore } from '@/store';
import { colors } from '@/lib/colors';
import { getFilteredProducts } from '@/lib/api';

// BGN to EUR fixed rate (Bulgaria is pegged to Euro)
const BGN_TO_EUR = 1.95583;

// TBI Bank installment configuration
const TBI_CONFIG = {
  minAmount: 100, // Minimum amount for installments in BGN
  interestRate: 0, // 0% interest (promotional)
  months: [3, 6, 9, 12, 18, 24], // Available installment periods
  defaultMonths: 12,
};

// Calculate TBI Bank monthly payment
const calculateInstallment = (totalBGN: number, months: number, interestRate: number = 0) => {
  if (totalBGN < TBI_CONFIG.minAmount) return null;
  
  if (interestRate === 0) {
    // 0% interest - simple division
    return totalBGN / months;
  }
  
  // With interest - PMT formula
  const monthlyRate = interestRate / 100 / 12;
  const payment = (totalBGN * monthlyRate * Math.pow(1 + monthlyRate, months)) / 
                  (Math.pow(1 + monthlyRate, months) - 1);
  return payment;
};

// Component SVG Icons
const ComponentIcons = {
  cpu: (color: string) => (
    <svg viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" className="w-full h-full">
      <rect x="6" y="6" width="12" height="12" rx="1" />
      <rect x="9" y="9" width="6" height="6" rx="0.5" fill={color} fillOpacity="0.2" />
      <path d="M9 6V4M12 6V4M15 6V4M9 20v-2M12 20v-2M15 20v-2M6 9H4M6 12H4M6 15H4M20 9h-2M20 12h-2M20 15h-2" />
    </svg>
  ),
  gpu: (color: string) => (
    <svg viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" className="w-full h-full">
      <rect x="2" y="7" width="20" height="10" rx="1" />
      <circle cx="7" cy="12" r="2.5" />
      <circle cx="14" cy="12" r="2.5" />
      <path d="M19 10v4M2 10H1M2 14H1" />
      <rect x="4" y="9" width="2" height="6" rx="0.5" fill={color} fillOpacity="0.2" />
    </svg>
  ),
  motherboard: (color: string) => (
    <svg viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" className="w-full h-full">
      <rect x="3" y="3" width="18" height="18" rx="1" />
      <rect x="6" y="6" width="5" height="5" rx="0.5" />
      <rect x="13" y="6" width="3" height="8" rx="0.5" fill={color} fillOpacity="0.2" />
      <rect x="17" y="6" width="1" height="8" />
      <path d="M6 14h5M6 17h5M13 17h5" />
      <circle cx="8.5" cy="8.5" r="1" fill={color} fillOpacity="0.3" />
    </svg>
  ),
  ram: (color: string) => (
    <svg viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" className="w-full h-full">
      <rect x="4" y="6" width="16" height="12" rx="1" />
      <rect x="6" y="8" width="3" height="6" rx="0.5" fill={color} fillOpacity="0.2" />
      <rect x="10.5" y="8" width="3" height="6" rx="0.5" fill={color} fillOpacity="0.2" />
      <rect x="15" y="8" width="3" height="6" rx="0.5" fill={color} fillOpacity="0.2" />
      <path d="M7 18v2M12 18v2M17 18v2" />
      <path d="M8 6V4M12 6V4M16 6V4" />
    </svg>
  ),
  storage: (color: string) => (
    <svg viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" className="w-full h-full">
      <rect x="4" y="6" width="16" height="12" rx="2" />
      <path d="M4 10h16" />
      <circle cx="7" cy="14" r="1.5" fill={color} fillOpacity="0.3" />
      <rect x="11" y="13" width="6" height="2" rx="0.5" fill={color} fillOpacity="0.2" />
      <circle cx="17" cy="8" r="0.5" fill={color} />
    </svg>
  ),
  psu: (color: string) => (
    <svg viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" className="w-full h-full">
      <rect x="3" y="5" width="18" height="14" rx="1" />
      <circle cx="9" cy="12" r="4" />
      <path d="M9 9v6M6.5 10.5l5 3M6.5 13.5l5-3" />
      <rect x="15" y="8" width="4" height="3" rx="0.5" fill={color} fillOpacity="0.2" />
      <rect x="15" y="13" width="4" height="3" rx="0.5" fill={color} fillOpacity="0.2" />
      <path d="M3 12H1" />
    </svg>
  ),
  case: (color: string) => (
    <svg viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" className="w-full h-full">
      <rect x="5" y="2" width="14" height="20" rx="1" />
      <rect x="7" y="4" width="10" height="10" rx="0.5" fill={color} fillOpacity="0.1" />
      <circle cx="12" cy="9" r="3" />
      <path d="M12 7v4M10.5 8.5l3 1M10.5 10.5l3-1" />
      <circle cx="17" cy="5" r="0.5" fill={color} />
      <rect x="7" y="16" width="4" height="1" rx="0.5" />
      <rect x="7" y="18" width="6" height="1" rx="0.5" />
    </svg>
  ),
  cooling: (color: string) => (
    <svg viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" className="w-full h-full">
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="3" fill={color} fillOpacity="0.2" />
      <path d="M12 3v4M12 17v4M3 12h4M17 12h4M5.64 5.64l2.83 2.83M15.54 15.54l2.83 2.83M5.64 18.36l2.83-2.83M15.54 8.46l2.83-2.83" />
    </svg>
  ),
};

// Component categories configuration
const componentCategories = [
  { id: 'cpu', slug: 'processors', name: 'Processor', nameBg: 'Процесор', required: true },
  { id: 'gpu', slug: 'graphics-cards', name: 'Graphics Card', nameBg: 'Видео карта', required: true },
  { id: 'motherboard', slug: 'motherboards', name: 'Motherboard', nameBg: 'Дънна платка', required: true },
  { id: 'ram', slug: 'ram', name: 'Memory (RAM)', nameBg: 'Памет (RAM)', required: true },
  { id: 'storage', slug: 'storage', name: 'Storage', nameBg: 'Съхранение', required: true },
  { id: 'psu', slug: 'power-supplies', name: 'Power Supply', nameBg: 'Захранване', required: true },
  { id: 'case', slug: 'cases', name: 'Case', nameBg: 'Кутия', required: true },
  { id: 'cooling', slug: 'cooling', name: 'CPU Cooling', nameBg: 'Охлаждане', required: false },
];

interface Product {
  id: number;
  name: string;
  nameBg?: string;
  slug: string;
  price: number;
  originalPrice?: number;
  stock: number;
  image?: { url: string };
  brand?: { name: string };
}

interface SelectedComponents {
  [key: string]: Product | null;
}

export default function PcBuilderPage() {
  const { isDark, language } = useUIStore();
  const { addItem } = useCartStore();

  const [productsByCategory, setProductsByCategory] = useState<Record<string, Product[]>>({});
  const [selectedComponents, setSelectedComponents] = useState<SelectedComponents>({});
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [addedToCart, setAddedToCart] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [hoveredHotspot, setHoveredHotspot] = useState<string | null>(null);
  const [selectedInstallmentMonths, setSelectedInstallmentMonths] = useState(TBI_CONFIG.defaultMonths);

  // Fetch products for all categories
  useEffect(() => {
    const fetchAllProducts = async () => {
      setLoading(true);

      const results: Record<string, Product[]> = {};

      await Promise.all(
        componentCategories.map(async (cat) => {
          const { products } = await getFilteredProducts({
            category: cat.slug,
            pageSize: 100,
            sort: 'price:asc',
          });
          results[cat.id] = products;
        })
      );

      setProductsByCategory(results);
      setLoading(false);
    };

    fetchAllProducts();
  }, []);

  // Calculate total price in BGN
  const totalPriceBGN = useMemo(() => {
    return Object.values(selectedComponents).reduce((sum, product) => {
      return sum + (product?.price || 0);
    }, 0);
  }, [selectedComponents]);

  // Calculate total price in EUR
  const totalPriceEUR = useMemo(() => {
    return totalPriceBGN / BGN_TO_EUR;
  }, [totalPriceBGN]);

  // Calculate TBI monthly payment
  const monthlyPayment = useMemo(() => {
    const payment = calculateInstallment(totalPriceBGN, selectedInstallmentMonths, TBI_CONFIG.interestRate);
    if (!payment) return null;
    return {
      bgn: payment,
      eur: payment / BGN_TO_EUR,
    };
  }, [totalPriceBGN, selectedInstallmentMonths]);

  // Count selected components
  const selectedCount = useMemo(() => {
    return Object.values(selectedComponents).filter(Boolean).length;
  }, [selectedComponents]);

  // Check if all required components are selected
  const allRequiredSelected = useMemo(() => {
    return componentCategories
      .filter((cat) => cat.required)
      .every((cat) => selectedComponents[cat.id]);
  }, [selectedComponents]);

  // Handle component selection
  const handleSelectComponent = (categoryId: string, product: Product | null) => {
    setSelectedComponents((prev) => ({
      ...prev,
      [categoryId]: product,
    }));
    if (product) {
      setActiveCategory(null);
    }
  };

  // Get image URL helper
  const getImageUrl = (image?: { url: string }): string => {
    if (!image?.url) return '/placeholder-product.svg';
    if (image.url.startsWith('http')) return image.url;
    return `${process.env.NEXT_PUBLIC_STRAPI_URL}${image.url}`;
  };

  // Format price helper
  const formatPrice = (priceBGN: number) => {
    const priceEUR = priceBGN / BGN_TO_EUR;
    return {
      bgn: priceBGN.toFixed(2),
      eur: priceEUR.toFixed(2),
    };
  };

  // Add all to cart
  const handleAddAllToCart = () => {
    Object.values(selectedComponents).forEach((product) => {
      if (product) {
        addItem(product as any, 1);
      }
    });
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  // Clear all selections
  const handleClearAll = () => {
    setSelectedComponents({});
  };

  // Filter products by search term
  const filteredProducts = useMemo(() => {
    if (!activeCategory) return [];
    const products = productsByCategory[activeCategory] || [];
    if (!searchTerm) return products;
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.brand?.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [activeCategory, productsByCategory, searchTerm]);

  // Get category info
  const getCategoryInfo = (id: string) => {
    return componentCategories.find((c) => c.id === id);
  };

  // Get icon for category
  const getIcon = (categoryId: string, color: string) => {
    const iconFn = ComponentIcons[categoryId as keyof typeof ComponentIcons];
    return iconFn ? iconFn(color) : null;
  };

  return (
    <main className="max-w-7xl mx-auto px-4 py-4">
      {/* Header */}
      <div className="text-center mb-8">
        <h1
          className="text-3xl md:text-4xl font-bold mb-2"
          style={{ color: isDark ? colors.white : colors.midnightBlack }}
        >
          {language === 'bg' ? 'Сглоби своя компютър' : 'Build Your PC'}
        </h1>
        <p
          className="text-base"
          style={{ color: isDark ? colors.gray : colors.midnightBlack }}
        >
          {language === 'bg'
            ? 'Кликни върху компонент, за да го избереш'
            : 'Click on a component to select it'}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Left - Interactive PC Case */}
        <div className="lg:col-span-3">
          <div
            className="relative rounded-2xl overflow-hidden"
            style={{
              background: isDark 
                ? 'linear-gradient(145deg, rgba(30,30,35,1) 0%, rgba(20,20,25,1) 100%)'
                : 'linear-gradient(145deg, #f8f9fa 0%, #e9ecef 100%)',
              border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.1)',
            }}
          >
            {/* PC Case SVG */}
            <div className="relative aspect-[4/3] p-8">
              <svg
                viewBox="0 0 400 300"
                className="w-full h-full"
                style={{ filter: isDark ? 'none' : 'drop-shadow(0 4px 6px rgba(0,0,0,0.1))' }}
              >
                {/* Case outline */}
                <rect
                  x="20"
                  y="10"
                  width="360"
                  height="280"
                  rx="8"
                  fill={isDark ? '#1a1a1f' : '#ffffff'}
                  stroke={isDark ? '#333' : '#ddd'}
                  strokeWidth="2"
                />
                
                {/* Glass panel */}
                <rect
                  x="30"
                  y="20"
                  width="200"
                  height="260"
                  rx="4"
                  fill={isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)'}
                  stroke={isDark ? '#444' : '#ccc'}
                  strokeWidth="1"
                />

                {/* Motherboard area */}
                <rect
                  x="40"
                  y="30"
                  width="180"
                  height="200"
                  rx="2"
                  fill={isDark ? '#2a2a30' : '#f0f0f0'}
                  stroke={isDark ? '#444' : '#ccc'}
                  strokeWidth="1"
                />

                {/* CPU Socket */}
                <g
                  className="cursor-pointer transition-all"
                  onClick={() => setActiveCategory('cpu')}
                  onMouseEnter={() => setHoveredHotspot('cpu')}
                  onMouseLeave={() => setHoveredHotspot(null)}
                >
                  <rect
                    x="80"
                    y="60"
                    width="60"
                    height="60"
                    rx="4"
                    fill={selectedComponents.cpu ? colors.forestGreen : hoveredHotspot === 'cpu' ? (isDark ? '#3a3a40' : '#e0e0e0') : (isDark ? '#333' : '#ddd')}
                    stroke={hoveredHotspot === 'cpu' || selectedComponents.cpu ? colors.forestGreen : isDark ? '#555' : '#bbb'}
                    strokeWidth="2"
                  />
                  <text x="110" y="95" textAnchor="middle" fill={selectedComponents.cpu ? colors.white : isDark ? '#888' : '#666'} fontSize="10" fontWeight="bold">
                    CPU
                  </text>
                </g>

                {/* CPU Cooler */}
                <g
                  className="cursor-pointer transition-all"
                  onClick={() => setActiveCategory('cooling')}
                  onMouseEnter={() => setHoveredHotspot('cooling')}
                  onMouseLeave={() => setHoveredHotspot(null)}
                >
                  <circle
                    cx="110"
                    cy="90"
                    r="35"
                    fill="none"
                    stroke={selectedComponents.cooling ? colors.forestGreen : hoveredHotspot === 'cooling' ? colors.forestGreen : isDark ? '#444' : '#ccc'}
                    strokeWidth="2"
                    strokeDasharray={selectedComponents.cooling ? '0' : '5,5'}
                  />
                </g>

                {/* RAM Slots */}
                <g
                  className="cursor-pointer transition-all"
                  onClick={() => setActiveCategory('ram')}
                  onMouseEnter={() => setHoveredHotspot('ram')}
                  onMouseLeave={() => setHoveredHotspot(null)}
                >
                  {[0, 1, 2, 3].map((i) => (
                    <rect
                      key={i}
                      x={155 + i * 12}
                      y="50"
                      width="8"
                      height="80"
                      rx="1"
                      fill={selectedComponents.ram ? colors.forestGreen : hoveredHotspot === 'ram' ? (isDark ? '#3a3a40' : '#e0e0e0') : (isDark ? '#333' : '#ddd')}
                      stroke={hoveredHotspot === 'ram' || selectedComponents.ram ? colors.forestGreen : isDark ? '#555' : '#bbb'}
                      strokeWidth="1"
                    />
                  ))}
                  <text x="175" y="145" textAnchor="middle" fill={selectedComponents.ram ? colors.forestGreen : isDark ? '#888' : '#666'} fontSize="8">
                    RAM
                  </text>
                </g>

                {/* GPU */}
                <g
                  className="cursor-pointer transition-all"
                  onClick={() => setActiveCategory('gpu')}
                  onMouseEnter={() => setHoveredHotspot('gpu')}
                  onMouseLeave={() => setHoveredHotspot(null)}
                >
                  <rect
                    x="50"
                    y="160"
                    width="160"
                    height="50"
                    rx="4"
                    fill={selectedComponents.gpu ? colors.forestGreen : hoveredHotspot === 'gpu' ? (isDark ? '#3a3a40' : '#e0e0e0') : (isDark ? '#2a2a30' : '#e8e8e8')}
                    stroke={hoveredHotspot === 'gpu' || selectedComponents.gpu ? colors.forestGreen : isDark ? '#555' : '#bbb'}
                    strokeWidth="2"
                  />
                  <circle cx="90" cy="185" r="18" fill={isDark ? '#222' : '#ddd'} stroke={isDark ? '#444' : '#bbb'} strokeWidth="1" />
                  <circle cx="130" cy="185" r="18" fill={isDark ? '#222' : '#ddd'} stroke={isDark ? '#444' : '#bbb'} strokeWidth="1" />
                  <circle cx="170" cy="185" r="18" fill={isDark ? '#222' : '#ddd'} stroke={isDark ? '#444' : '#bbb'} strokeWidth="1" />
                  <text x="130" y="220" textAnchor="middle" fill={selectedComponents.gpu ? colors.forestGreen : isDark ? '#888' : '#666'} fontSize="10" fontWeight="bold">
                    GPU
                  </text>
                </g>

                {/* PSU */}
                <g
                  className="cursor-pointer transition-all"
                  onClick={() => setActiveCategory('psu')}
                  onMouseEnter={() => setHoveredHotspot('psu')}
                  onMouseLeave={() => setHoveredHotspot(null)}
                >
                  <rect
                    x="240"
                    y="200"
                    width="130"
                    height="80"
                    rx="4"
                    fill={selectedComponents.psu ? colors.forestGreen : hoveredHotspot === 'psu' ? (isDark ? '#3a3a40' : '#e0e0e0') : (isDark ? '#2a2a30' : '#e8e8e8')}
                    stroke={hoveredHotspot === 'psu' || selectedComponents.psu ? colors.forestGreen : isDark ? '#555' : '#bbb'}
                    strokeWidth="2"
                  />
                  <rect x="250" y="230" width="80" height="30" rx="2" fill={isDark ? '#222' : '#ddd'} />
                  <text x="305" y="255" textAnchor="middle" fill={selectedComponents.psu ? colors.white : isDark ? '#666' : '#888'} fontSize="10" fontWeight="bold">
                    PSU
                  </text>
                </g>

                {/* Storage */}
                <g
                  className="cursor-pointer transition-all"
                  onClick={() => setActiveCategory('storage')}
                  onMouseEnter={() => setHoveredHotspot('storage')}
                  onMouseLeave={() => setHoveredHotspot(null)}
                >
                  <rect
                    x="240"
                    y="120"
                    width="100"
                    height="15"
                    rx="2"
                    fill={selectedComponents.storage ? colors.forestGreen : hoveredHotspot === 'storage' ? (isDark ? '#3a3a40' : '#e0e0e0') : (isDark ? '#333' : '#ddd')}
                    stroke={hoveredHotspot === 'storage' || selectedComponents.storage ? colors.forestGreen : isDark ? '#555' : '#bbb'}
                    strokeWidth="1"
                  />
                  <rect
                    x="240"
                    y="140"
                    width="100"
                    height="15"
                    rx="2"
                    fill={isDark ? '#333' : '#ddd'}
                    stroke={isDark ? '#555' : '#bbb'}
                    strokeWidth="1"
                  />
                  <text x="290" y="170" textAnchor="middle" fill={selectedComponents.storage ? colors.forestGreen : isDark ? '#888' : '#666'} fontSize="8">
                    STORAGE
                  </text>
                </g>

                {/* Motherboard label */}
                <g
                  className="cursor-pointer transition-all"
                  onClick={() => setActiveCategory('motherboard')}
                  onMouseEnter={() => setHoveredHotspot('motherboard')}
                  onMouseLeave={() => setHoveredHotspot(null)}
                >
                  <text 
                    x="130" 
                    y="240" 
                    textAnchor="middle" 
                    fill={selectedComponents.motherboard ? colors.forestGreen : hoveredHotspot === 'motherboard' ? colors.forestGreen : isDark ? '#555' : '#999'} 
                    fontSize="10"
                    className="cursor-pointer"
                  >
                    {selectedComponents.motherboard ? '✓ MOTHERBOARD' : 'MOTHERBOARD'}
                  </text>
                </g>

                {/* Case selection area */}
                <g
                  className="cursor-pointer"
                  onClick={() => setActiveCategory('case')}
                  onMouseEnter={() => setHoveredHotspot('case')}
                  onMouseLeave={() => setHoveredHotspot(null)}
                >
                  <text 
                    x="305" 
                    y="50" 
                    textAnchor="middle" 
                    fill={selectedComponents.case ? colors.forestGreen : hoveredHotspot === 'case' ? colors.forestGreen : isDark ? '#555' : '#999'} 
                    fontSize="10"
                  >
                    {selectedComponents.case ? '✓ CASE' : 'SELECT CASE'}
                  </text>
                </g>
              </svg>

              {/* Hover tooltip */}
              {hoveredHotspot && (
                <div
                  className="absolute bottom-4 left-1/2 transform -translate-x-1/2 px-4 py-2 rounded-lg text-sm font-medium"
                  style={{
                    background: colors.forestGreen,
                    color: colors.white,
                  }}
                >
                  {language === 'bg'
                    ? `Кликни за избор на ${getCategoryInfo(hoveredHotspot)?.nameBg}`
                    : `Click to select ${getCategoryInfo(hoveredHotspot)?.name}`}
                </div>
              )}
            </div>

            {/* Component quick buttons with icons */}
            <div
              className="px-4 py-3 border-t flex flex-wrap gap-2 justify-center"
              style={{ borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' }}
            >
              {componentCategories.map((cat) => {
                const isSelected = !!selectedComponents[cat.id];
                const isActive = activeCategory === cat.id;
                const iconColor = isActive 
                  ? colors.white 
                  : isSelected 
                    ? colors.forestGreen 
                    : isDark 
                      ? colors.gray 
                      : colors.midnightBlack;

                return (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(isActive ? null : cat.id)}
                    className="px-3 py-2 rounded-xl text-xs font-medium transition-all flex items-center gap-2"
                    style={{
                      background: isActive
                        ? colors.forestGreen
                        : isSelected
                        ? isDark
                          ? 'rgba(34,197,94,0.2)'
                          : 'rgba(34,197,94,0.1)'
                        : isDark
                        ? 'rgba(255,255,255,0.05)'
                        : 'rgba(0,0,0,0.05)',
                      color: isActive
                        ? colors.white
                        : isSelected
                        ? colors.forestGreen
                        : isDark
                        ? colors.gray
                        : colors.midnightBlack,
                      border: isSelected
                        ? `1px solid ${colors.forestGreen}`
                        : '1px solid transparent',
                    }}
                  >
                    <span className="w-5 h-5">
                      {getIcon(cat.id, iconColor)}
                    </span>
                    {language === 'bg' ? cat.nameBg : cat.name}
                    {isSelected && ' ✓'}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Component Selection Panel */}
          {activeCategory && (
            <div
              className="mt-4 rounded-2xl overflow-hidden"
              style={{
                background: isDark ? 'rgba(255,255,255,0.03)' : colors.white,
                border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.1)',
              }}
            >
              {/* Header */}
              <div
                className="px-4 py-3 flex items-center justify-between border-b"
                style={{ borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' }}
              >
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6">
                    {getIcon(activeCategory, colors.forestGreen)}
                  </span>
                  <h3
                    className="font-bold"
                    style={{ color: isDark ? colors.white : colors.midnightBlack }}
                  >
                    {language === 'bg'
                      ? `Избери ${getCategoryInfo(activeCategory)?.nameBg}`
                      : `Select ${getCategoryInfo(activeCategory)?.name}`}
                  </h3>
                </div>
                <button
                  onClick={() => setActiveCategory(null)}
                  className="p-2 rounded-lg transition-colors"
                  style={{
                    background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
                  }}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={isDark ? colors.white : colors.midnightBlack} strokeWidth="2">
                    <path d="M18 6L6 18M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Search */}
              <div className="p-3">
                <input
                  type="text"
                  placeholder={language === 'bg' ? 'Търси...' : 'Search...'}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg text-sm outline-none"
                  style={{
                    background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
                    color: isDark ? colors.white : colors.midnightBlack,
                    border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.1)',
                  }}
                />
              </div>

              {/* Product List */}
              <div className="max-h-[400px] overflow-y-auto">
                {loading ? (
                  <div className="p-8 text-center">
                    <p style={{ color: isDark ? colors.gray : colors.midnightBlack }}>
                      {language === 'bg' ? 'Зареждане...' : 'Loading...'}
                    </p>
                  </div>
                ) : filteredProducts.length === 0 ? (
                  <div className="p-8 text-center">
                    <p style={{ color: isDark ? colors.gray : colors.midnightBlack }}>
                      {language === 'bg' ? 'Няма намерени продукти' : 'No products found'}
                    </p>
                  </div>
                ) : (
                  filteredProducts.map((product) => {
                    const isSelected = selectedComponents[activeCategory]?.id === product.id;
                    const isOutOfStock = product.stock <= 0;
                    const price = formatPrice(product.price);

                    return (
                      <button
                        key={product.id}
                        onClick={() => handleSelectComponent(activeCategory, isSelected ? null : product)}
                        disabled={isOutOfStock}
                        className="w-full px-4 py-3 flex items-center gap-4 transition-colors text-left disabled:opacity-50"
                        style={{
                          background: isSelected
                            ? isDark
                              ? 'rgba(34,197,94,0.15)'
                              : 'rgba(34,197,94,0.08)'
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

                        {/* Product Image */}
                        <div
                          className="w-14 h-14 rounded-lg overflow-hidden flex-shrink-0"
                          style={{
                            background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
                          }}
                        >
                          <Image
                            src={getImageUrl(product.image)}
                            alt={product.name}
                            width={56}
                            height={56}
                            className="object-contain p-1"
                          />
                        </div>

                        {/* Product Info */}
                        <div className="flex-1 min-w-0">
                          {product.brand && (
                            <p className="text-xs font-medium" style={{ color: colors.forestGreen }}>
                              {product.brand.name}
                            </p>
                          )}
                          <p
                            className="font-medium text-sm truncate"
                            style={{ color: isDark ? colors.white : colors.midnightBlack }}
                          >
                            {product.name}
                          </p>
                          {isOutOfStock && (
                            <p className="text-xs" style={{ color: colors.pink }}>
                              {language === 'bg' ? 'Изчерпан' : 'Out of Stock'}
                            </p>
                          )}
                        </div>

                        {/* Price */}
                        <div className="text-right flex-shrink-0">
                          <p className="font-bold" style={{ color: colors.forestGreen }}>
                            {price.bgn} лв.
                          </p>
                          <p className="text-xs" style={{ color: isDark ? colors.gray : colors.midnightBlack }}>
                            {price.eur} €
                          </p>
                        </div>
                      </button>
                    );
                  })
                )}
              </div>
            </div>
          )}
        </div>

        {/* Right Column - Build Summary */}
        <div className="lg:col-span-2">
          <div
            className="lg:sticky lg:top-4 rounded-2xl overflow-hidden"
            style={{
              background: isDark ? 'rgba(255,255,255,0.03)' : colors.white,
              border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.1)',
            }}
          >
            {/* Header */}
            <div
              className="px-4 py-3 border-b"
              style={{
                borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
                background: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)',
              }}
            >
              <div className="flex items-center justify-between">
                <h2
                  className="font-bold text-lg"
                  style={{ color: isDark ? colors.white : colors.midnightBlack }}
                >
                  {language === 'bg' ? 'Твоята конфигурация' : 'Your Build'}
                </h2>
                <span
                  className="text-sm px-3 py-1 rounded-full font-medium"
                  style={{
                    background: allRequiredSelected ? colors.forestGreen : isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
                    color: allRequiredSelected ? colors.white : isDark ? colors.gray : colors.midnightBlack,
                  }}
                >
                  {selectedCount}/{componentCategories.filter((c) => c.required).length}
                </span>
              </div>
            </div>

            {/* Selected Components */}
            <div className="p-4 space-y-3">
              {componentCategories.map((cat) => {
                const selected = selectedComponents[cat.id];
                const price = selected ? formatPrice(selected.price) : null;
                const iconColor = selected 
                  ? colors.white 
                  : isDark 
                    ? colors.gray 
                    : colors.midnightBlack;

                return (
                  <div
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className="flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all"
                    style={{
                      background: selected
                        ? isDark
                          ? 'rgba(34,197,94,0.1)'
                          : 'rgba(34,197,94,0.05)'
                        : isDark
                        ? 'rgba(255,255,255,0.02)'
                        : 'rgba(0,0,0,0.02)',
                      border: selected
                        ? `1px solid ${colors.forestGreen}`
                        : isDark
                        ? '1px solid rgba(255,255,255,0.05)'
                        : '1px solid rgba(0,0,0,0.05)',
                    }}
                  >
                    {/* Icon */}
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 p-2"
                      style={{
                        background: selected ? colors.forestGreen : isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
                      }}
                    >
                      {getIcon(cat.id, iconColor)}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p
                        className="text-xs font-medium"
                        style={{ color: isDark ? colors.gray : colors.midnightBlack }}
                      >
                        {language === 'bg' ? cat.nameBg : cat.name}
                        {cat.required && !selected && (
                          <span style={{ color: colors.pink }}> *</span>
                        )}
                      </p>
                      <p
                        className="font-medium text-sm truncate"
                        style={{ color: isDark ? colors.white : colors.midnightBlack }}
                      >
                        {selected ? selected.name : (language === 'bg' ? 'Не е избран' : 'Not selected')}
                      </p>
                    </div>

                    {/* Price */}
                    {price && (
                      <div className="text-right flex-shrink-0">
                        <p className="font-bold text-sm" style={{ color: colors.forestGreen }}>
                          {price.bgn} лв.
                        </p>
                        <p className="text-xs" style={{ color: isDark ? colors.gray : colors.midnightBlack }}>
                          {price.eur} €
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Total */}
            <div
              className="p-4 border-t"
              style={{ borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' }}
            >
              <div className="flex justify-between items-end mb-4">
                <div>
                  <p
                    className="text-sm"
                    style={{ color: isDark ? colors.gray : colors.midnightBlack }}
                  >
                    {language === 'bg' ? 'Обща цена' : 'Total Price'}
                  </p>
                </div>
                <div className="text-right">
                  <p
                    className="text-3xl font-bold"
                    style={{ color: colors.forestGreen }}
                  >
                    {totalPriceBGN.toFixed(2)} лв.
                  </p>
                  <p
                    className="text-lg"
                    style={{ color: isDark ? colors.gray : colors.midnightBlack }}
                  >
                    {totalPriceEUR.toFixed(2)} €
                  </p>
                </div>
              </div>

              {/* TBI Bank Installment Calculator */}
              {totalPriceBGN >= TBI_CONFIG.minAmount && monthlyPayment && (
                <div
                  className="p-4 rounded-xl mb-4"
                  style={{
                    background: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)',
                    border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.1)',
                  }}
                >
                  {/* TBI Bank Logo/Header */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div
                        className="px-2 py-1 rounded text-xs font-bold"
                        style={{ background: '#E31E24', color: colors.white }}
                      >
                        TBI
                      </div>
                      <span
                        className="text-sm font-medium"
                        style={{ color: isDark ? colors.white : colors.midnightBlack }}
                      >
                        {language === 'bg' ? 'Банка' : 'Bank'}
                      </span>
                    </div>
                    <span
                      className="text-xs px-2 py-1 rounded-full"
                      style={{
                        background: colors.forestGreen,
                        color: colors.white,
                      }}
                    >
                      0% {language === 'bg' ? 'лихва' : 'interest'}
                    </span>
                  </div>

                  {/* Month Selection */}
                  <div className="flex flex-wrap gap-2 mb-3">
                    {TBI_CONFIG.months.map((months) => (
                      <button
                        key={months}
                        onClick={() => setSelectedInstallmentMonths(months)}
                        className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
                        style={{
                          background: selectedInstallmentMonths === months
                            ? colors.forestGreen
                            : isDark
                            ? 'rgba(255,255,255,0.05)'
                            : 'rgba(0,0,0,0.05)',
                          color: selectedInstallmentMonths === months
                            ? colors.white
                            : isDark
                            ? colors.gray
                            : colors.midnightBlack,
                        }}
                      >
                        {months} {language === 'bg' ? 'мес.' : 'mo.'}
                      </button>
                    ))}
                  </div>

                  {/* Monthly Payment */}
                  <div className="text-center">
                    <p
                      className="text-sm mb-1"
                      style={{ color: isDark ? colors.gray : colors.midnightBlack }}
                    >
                      {language === 'bg' ? 'Месечна вноска' : 'Monthly payment'}
                    </p>
                    <p
                      className="text-2xl font-bold"
                      style={{ color: colors.forestGreen }}
                    >
                      {monthlyPayment.bgn.toFixed(2)} лв.
                    </p>
                    <p
                      className="text-sm"
                      style={{ color: isDark ? colors.gray : colors.midnightBlack }}
                    >
                      {monthlyPayment.eur.toFixed(2)} € / {language === 'bg' ? 'месец' : 'month'}
                    </p>
                  </div>
                </div>
              )}

              {/* Add to Cart */}
              <button
                onClick={handleAddAllToCart}
                disabled={!allRequiredSelected}
                className="w-full py-4 rounded-xl font-bold text-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  background: colors.forestGreen,
                  color: colors.white,
                }}
              >
                {addedToCart
                  ? language === 'bg'
                    ? '✓ Добавено в количката!'
                    : '✓ Added to Cart!'
                  : language === 'bg'
                  ? 'Добави всички в количката'
                  : 'Add All to Cart'}
              </button>

              {/* Clear */}
              {selectedCount > 0 && (
                <button
                  onClick={handleClearAll}
                  className="w-full mt-2 py-2 rounded-xl font-medium transition-colors"
                  style={{
                    background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
                    color: isDark ? colors.gray : colors.midnightBlack,
                  }}
                >
                  {language === 'bg' ? 'Изчисти всички' : 'Clear All'}
                </button>
              )}

              {/* Warning */}
              {!allRequiredSelected && selectedCount > 0 && (
                <p className="text-xs text-center mt-3" style={{ color: colors.pink }}>
                  {language === 'bg'
                    ? '* Избери всички задължителни компоненти'
                    : '* Select all required components'}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
