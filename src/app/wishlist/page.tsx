'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useUIStore, useWishlistStore, useCartStore } from '@/store';
import { colors } from '@/lib/colors';
import { useCurrencySettings } from '@/hooks/useCurrencySettings';
import { formatPrice as formatCurrency } from '@/utils/currency';

export default function WishlistPage() {
  const { isDark, language } = useUIStore();
  const { items, removeItem, clearWishlist } = useWishlistStore();
  const { addItem: addToCart } = useCartStore();
  const { settings } = useCurrencySettings(); // ← ADD THIS LINE

  const [removingId, setRemovingId] = useState<number | null>(null);
  const [addingToCartId, setAddingToCartId] = useState<number | null>(null);

// Format price in both currencies
const formatPrice = (eurPrice: number) => {
  const formatted = formatCurrency(eurPrice, settings);
  return {
    primary: formatted.primary,
    secondary: formatted.secondary,
    display: formatted.display,
  };
};
  // Get image URL helper
  const getImageUrl = (image?: { url: string } | string): string => {
    if (!image) return '/placeholder-product.svg';
    const url = typeof image === 'string' ? image : image.url;
    if (url.startsWith('http')) return url;
    return `${process.env.NEXT_PUBLIC_STRAPI_URL}${url}`;
  };

  // Handle remove item with animation
  const handleRemoveItem = (itemId: number) => {
    setRemovingId(itemId);
    setTimeout(() => {
      removeItem(itemId);
      setRemovingId(null);
    }, 300);
  };

  // Handle add to cart
  const handleAddToCart = (item: any) => {
    setAddingToCartId(item.id);
    addToCart(item);
    setTimeout(() => {
      setAddingToCartId(null);
    }, 500);
  };

  // Empty wishlist state
  if (items.length === 0) {
    return (
      <main className="max-w-4xl mx-auto px-4 py-12">
        <div
          className="text-center py-16 rounded-2xl"
          style={{
            background: isDark ? 'rgba(255,255,255,0.03)' : colors.white,
            border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.1)',
          }}
        >
          <div className="text-6xl mb-6">💝</div>
          <h1
            className="text-2xl font-bold mb-3"
            style={{ color: isDark ? colors.white : colors.midnightBlack }}
          >
            {language === 'bg' ? 'Любими продукти' : 'Your Wishlist is Empty'}
          </h1>
          <p
            className="mb-8"
            style={{ color: isDark ? colors.gray : colors.midnightBlack }}
          >
            {language === 'bg'
              ? 'Добавете продукти, които харесвате'
              : 'Add products you love to your wishlist'}
          </p>
          <Link
            href="/"
            className="inline-block px-8 py-3 rounded-xl font-semibold transition-all hover:scale-105"
            style={{ background: colors.forestGreen, color: colors.white }}
          >
            {language === 'bg' ? 'Разгледай продуктите' : 'Browse Products'}
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1
          className="text-2xl font-bold"
          style={{ color: isDark ? colors.white : colors.midnightBlack }}
        >
          {language === 'bg' ? 'Любими продукти' : 'My Wishlist'}
          <span
            className="ml-2 text-lg font-normal"
            style={{ color: isDark ? colors.gray : colors.midnightBlack }}
          >
            ({items.length} {language === 'bg' ? (items.length === 1 ? 'продукт' : 'продукта') : (items.length === 1 ? 'item' : 'items')})
          </span>
        </h1>
        <button
          onClick={clearWishlist}
          className="text-sm font-medium px-4 py-2 rounded-lg transition-colors"
          style={{
            background: isDark ? 'rgba(239,68,68,0.1)' : 'rgba(239,68,68,0.05)',
            color: '#ef4444',
          }}
        >
          {language === 'bg' ? 'Изчисти' : 'Clear All'}
        </button>
      </div>

      {/* Wishlist Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item) => {
          const price = formatPrice(item.price);
          const isRemoving = removingId === item.id;
          const isAddingToCart = addingToCartId === item.id;

          return (
            <div
              key={item.id}
              className={`rounded-2xl overflow-hidden transition-all duration-300 ${
                isRemoving ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
              }`}
              style={{
                background: isDark ? 'rgba(255,255,255,0.03)' : colors.white,
                border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.1)',
              }}
            >
              {/* Product Image */}
              <div className="relative">
                <Link
                  href={`/product/${item.slug}`}
                  className="block aspect-square overflow-hidden"
                  style={{
                    background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
                  }}
                >
                  <Image
                    src={getImageUrl(item.image)}
                    alt={language === 'bg' && item.nameBg ? item.nameBg : item.name}
                    width={300}
                    height={300}
                    className="w-full h-full object-contain p-4 hover:scale-105 transition-transform"
                  />
                </Link>

                {/* Remove Button */}
                <button
                  onClick={() => handleRemoveItem(item.id)}
                  className="absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center transition-all hover:scale-110"
                  style={{
                    background: isDark ? 'rgba(0,0,0,0.7)' : 'rgba(255,255,255,0.9)',
                    color: colors.pink,
                  }}
                  title={language === 'bg' ? 'Премахни' : 'Remove'}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>

                {/* Stock Badge */}
                {item.stock !== undefined && (
                  <div
                    className="absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-medium"
                    style={{
                      background: item.stock > 0 
                        ? 'rgba(34,197,94,0.9)' 
                        : 'rgba(239,68,68,0.9)',
                      color: colors.white,
                    }}
                  >
                    {item.stock > 0
                      ? language === 'bg' ? 'В наличност' : 'In Stock'
                      : language === 'bg' ? 'Няма в наличност' : 'Out of Stock'}
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div className="p-4">
                <Link href={`/product/${item.slug}`}>
                  <h3
                    className="font-semibold mb-2 hover:underline line-clamp-2 min-h-[3rem]"
                    style={{ color: isDark ? colors.white : colors.midnightBlack }}
                  >
                    {language === 'bg' && item.nameBg ? item.nameBg : item.name}
                  </h3>
                </Link>

{/* Price */}
<div className="mb-4">
  <p
    className="text-xl font-bold"
    style={{ color: colors.forestGreen }}
  >
    {price.primary}
  </p>
  {settings.showBGNReference && (
    <p
      className="text-sm"
      style={{ color: isDark ? colors.gray : colors.midnightBlack }}
    >
      {price.secondary}
    </p>
  )}
</div>
                {/* Add to Cart Button */}
                <button
                  onClick={() => handleAddToCart(item)}
                  disabled={item.stock === 0 || isAddingToCart}
                  className="w-full py-3 rounded-xl font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{
                    background: isAddingToCart 
                      ? colors.forestGreen 
                      : item.stock === 0
                      ? isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'
                      : colors.forestGreen,
                    color: item.stock === 0
                      ? isDark ? colors.gray : colors.midnightBlack
                      : colors.white,
                  }}
                >
                  {isAddingToCart ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10" opacity="0.25" />
                        <path d="M4 12a8 8 0 018-8" opacity="0.75" />
                      </svg>
                      {language === 'bg' ? 'Добавя се...' : 'Adding...'}
                    </span>
                  ) : item.stock === 0 ? (
                    language === 'bg' ? 'Няма в наличност' : 'Out of Stock'
                  ) : (
                    language === 'bg' ? 'Добави в количката' : 'Add to Cart'
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Continue Shopping */}
      <div className="mt-8 text-center">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-medium"
          style={{ color: colors.forestGreen }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
          {language === 'bg' ? 'Продължи пазаруването' : 'Continue Shopping'}
        </Link>
      </div>
    </main>
  );
}
