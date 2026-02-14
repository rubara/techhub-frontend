'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useUIStore, useCartStore } from '@/store';
import { colors } from '@/lib/colors';
import { PromoCodeInput, PromoCodeData } from '@/components/promo/PromoCodeInput';
import { useCurrencySettings } from '@/hooks/useCurrencySettings';
import { formatPrice as formatCurrency } from '@/utils/currency';


export default function CartPage() {
  const { isDark, language } = useUIStore();
const { items, updateQuantity, removeItem, clearCart, totalItems, totalPrice, appliedPromo: storePromo, setPromo } = useCartStore();  
  const [removingId, setRemovingId] = useState<number | null>(null);
const { settings } = useCurrencySettings();

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

  // Handle quantity change
  const handleQuantityChange = (itemId: number, newQuantity: number) => {
    if (newQuantity < 1) {
      handleRemoveItem(itemId);
      return;
    }
    updateQuantity(itemId, newQuantity);
  };

  // Handle remove item with animation
  const handleRemoveItem = (itemId: number) => {
    setRemovingId(itemId);
    setTimeout(() => {
      removeItem(itemId);
      setRemovingId(null);
    }, 300);
  };

// Calculate totals
const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

// Apply promo discount
const promoDiscount = storePromo ? storePromo.discountAmount : 0;
const subtotalAfterPromo = subtotal - promoDiscount;

const shipping = subtotalAfterPromo >= 100 ? 0 : 5.00; // Free shipping over €100 EUR
const total = subtotalAfterPromo + shipping;
const totalFormatted = formatPrice(total);
const subtotalFormatted = formatPrice(subtotal);
const shippingFormatted = formatPrice(shipping);

// Handle promo application
const handleApplyPromo = (promoData: PromoCodeData | null) => {
  setPromo(promoData);
};

  // Empty cart state
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
          <div className="text-6xl mb-6">🛒</div>
          <h1
            className="text-2xl font-bold mb-3"
            style={{ color: isDark ? colors.white : colors.midnightBlack }}
          >
            {language === 'bg' ? 'Количката е празна' : 'Your cart is empty'}
          </h1>
          <p
            className="mb-8"
            style={{ color: isDark ? colors.gray : colors.midnightBlack }}
          >
            {language === 'bg'
              ? 'Добавете продукти, за да продължите'
              : 'Add products to continue'}
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
          {language === 'bg' ? 'Количка' : 'Shopping Cart'}
          <span
            className="ml-2 text-lg font-normal"
            style={{ color: isDark ? colors.gray : colors.midnightBlack }}
          >
            ({totalItems} {language === 'bg' ? (totalItems === 1 ? 'продукт' : 'продукта') : (totalItems === 1 ? 'item' : 'items')})
          </span>
        </h1>
        <button
          onClick={clearCart}
          className="text-sm font-medium px-4 py-2 rounded-lg transition-colors"
          style={{
            background: isDark ? 'rgba(239,68,68,0.1)' : 'rgba(239,68,68,0.05)',
            color: '#ef4444',
          }}
        >
          {language === 'bg' ? 'Изчисти количката' : 'Clear Cart'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => {
            const price = formatPrice(item.price);
            const itemTotal = formatPrice(item.price * item.quantity);
            const isRemoving = removingId === item.id;

            return (
              <div
                key={item.id}
                className={`flex gap-4 p-4 rounded-2xl transition-all duration-300 ${
                  isRemoving ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
                }`}
                style={{
                  background: isDark ? 'rgba(255,255,255,0.03)' : colors.white,
                  border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.1)',
                }}
              >
                {/* Product Image */}
                <Link
                  href={`/product/${item.slug}`}
                  className="flex-shrink-0 w-24 h-24 md:w-32 md:h-32 rounded-xl overflow-hidden"
                  style={{
                    background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
                  }}
                >
                  <Image
                    src={getImageUrl(item.image)}
                    alt={language === 'bg' && item.nameBg ? item.nameBg : item.name}
                    width={128}
                    height={128}
                    className="w-full h-full object-contain p-2"
                  />
                </Link>

                {/* Product Info */}
                <div className="flex-1 min-w-0">
                  <Link href={`/product/${item.slug}`}>
                    <h3
                      className="font-semibold mb-1 hover:underline line-clamp-2"
                      style={{ color: isDark ? colors.white : colors.midnightBlack }}
                    >
                      {language === 'bg' && item.nameBg ? item.nameBg : item.name}
                    </h3>
                  </Link>
                  
{/* Unit Price */}
<p className="text-sm mb-3" style={{ color: isDark ? colors.gray : colors.midnightBlack }}>
  {formatPrice(item.price).display}
</p>
                  {/* Quantity Controls */}
                  <div className="flex items-center gap-3">
                    <div
                      className="flex items-center rounded-lg overflow-hidden"
                      style={{
                        border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.1)',
                      }}
                    >
                      <button
                        onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                        className="w-10 h-10 flex items-center justify-center transition-colors hover:bg-opacity-80"
                        style={{
                          background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
                          color: isDark ? colors.white : colors.midnightBlack,
                        }}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <line x1="5" y1="12" x2="19" y2="12" />
                        </svg>
                      </button>
                      <span
                        className="w-12 h-10 flex items-center justify-center font-semibold"
                        style={{
                          background: isDark ? 'rgba(255,255,255,0.02)' : colors.white,
                          color: isDark ? colors.white : colors.midnightBlack,
                        }}
                      >
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                        className="w-10 h-10 flex items-center justify-center transition-colors hover:bg-opacity-80"
                        style={{
                          background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
                          color: isDark ? colors.white : colors.midnightBlack,
                        }}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <line x1="12" y1="5" x2="12" y2="19" />
                          <line x1="5" y1="12" x2="19" y2="12" />
                        </svg>
                      </button>
                    </div>

                    {/* Remove Button */}
                    <button
                      onClick={() => handleRemoveItem(item.id)}
                      className="p-2 rounded-lg transition-colors"
                      style={{
                        color: '#ef4444',
                        background: 'rgba(239,68,68,0.1)',
                      }}
                      title={language === 'bg' ? 'Премахни' : 'Remove'}
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="3 6 5 6 21 6" />
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                        <line x1="10" y1="11" x2="10" y2="17" />
                        <line x1="14" y1="11" x2="14" y2="17" />
                      </svg>
                    </button>
                  </div>
                </div>

{/* Item Total */}
<div className="text-right flex-shrink-0">
  <p
    className="font-bold text-lg"
    style={{ color: colors.forestGreen }}
  >
    {formatPrice(item.price * item.quantity).primary}
  </p>
  {settings.showBGNReference && (
    <p
      className="text-xs"
      style={{ color: isDark ? colors.gray : colors.midnightBlack }}
    >
      {formatPrice(item.price * item.quantity).secondary}
    </p>
  )}
</div>
              </div>
            );
          })}

          {/* Continue Shopping */}
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-medium mt-4"
            style={{ color: colors.forestGreen }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
            {language === 'bg' ? 'Продължи пазаруването' : 'Continue Shopping'}
          </Link>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div
            className="sticky top-4 p-6 rounded-2xl"
            style={{
              background: isDark ? 'rgba(255,255,255,0.03)' : colors.white,
              border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.1)',
            }}
          >
            <h2
              className="font-bold text-lg mb-4"
              style={{ color: isDark ? colors.white : colors.midnightBlack }}
            >
              {language === 'bg' ? 'Обобщение' : 'Order Summary'}
            </h2>
{/* Promo Code Input */}
<div className="mb-4">
  <PromoCodeInput
    orderAmount={subtotal}
    onApplyPromo={handleApplyPromo}
    appliedPromo={storePromo}
  />
</div>


{/* Subtotal */}
<div className="flex justify-between mb-3">
  <span style={{ color: isDark ? colors.gray : colors.midnightBlack }}>
    {language === 'bg' ? 'Междинна сума' : 'Subtotal'}
  </span>
  <div className="text-right">
    <span
      className="font-medium"
      style={{ color: isDark ? colors.white : colors.midnightBlack }}
    >
      {formatPrice(subtotal).primary}
    </span>
    {settings.showBGNReference && (
      <span
        className="text-sm ml-2"
        style={{ color: isDark ? colors.gray : colors.midnightBlack }}
      >
        ({formatPrice(subtotal).secondary})
      </span>
    )}
  </div>
</div>


{/* Promo Discount */}
{storePromo && (
  <div className="flex justify-between mb-3">
    <span style={{ color: isDark ? colors.gray : colors.midnightBlack }}>
      {language === 'bg' ? 'Промо код' : 'Promo code'} ({storePromo.code})
    </span>
    <div className="text-right">
      <span
        className="font-medium"
        style={{ color: colors.forestGreen }}
      >
        -{formatPrice(promoDiscount).primary}
      </span>
      {settings.showBGNReference && (
        <span
          className="text-sm ml-2"
          style={{ color: isDark ? colors.gray : colors.midnightBlack }}
        >
          ({formatPrice(promoDiscount).secondary})
        </span>
      )}
    </div>
  </div>
)}

{/* Shipping */}
<div className="flex justify-between mb-3">
  <span style={{ color: isDark ? colors.gray : colors.midnightBlack }}>
    {language === 'bg' ? 'Доставка' : 'Shipping'}
  </span>
  <div className="text-right">
    {shipping === 0 ? (
      <span className="font-medium" style={{ color: colors.forestGreen }}>
        {language === 'bg' ? 'Безплатна' : 'Free'}
      </span>
    ) : (
      <>
        <span
          className="font-medium"
          style={{ color: isDark ? colors.white : colors.midnightBlack }}
        >
          {formatPrice(shipping).primary}
        </span>
        {settings.showBGNReference && (
          <span
            className="text-sm ml-2"
            style={{ color: isDark ? colors.gray : colors.midnightBlack }}
          >
            ({formatPrice(shipping).secondary})
          </span>
        )}
      </>
    )}
  </div>
</div>

{/* Free Shipping Progress */}
{subtotal > 0 && subtotal < 100 && (
  <div className="mb-4">
    <div
      className="text-xs mb-2"
      style={{ color: isDark ? colors.gray : colors.midnightBlack }}
    >
      {language === 'bg'
        ? `Още ${formatPrice(100 - subtotal).display} за безплатна доставка`
        : `${formatPrice(100 - subtotal).display} more for free shipping`}
    </div>
    <div
      className="h-2 rounded-full overflow-hidden"
      style={{ background: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' }}
    >
      <div
        className="h-full rounded-full transition-all"
        style={{
          width: `${(subtotal / 100) * 100}%`,
          background: colors.forestGreen,
        }}
      />
    </div>
  </div>
)}


            {/* Divider */}
            <div
              className="h-px my-4"
              style={{ background: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' }}
            />


{/* Total */}
<div className="flex justify-between mb-6">
  <span
    className="font-bold text-lg"
    style={{ color: isDark ? colors.white : colors.midnightBlack }}
  >
    {language === 'bg' ? 'Общо' : 'Total'}
  </span>
  <div className="text-right">
    <p
      className="font-bold text-2xl"
      style={{ color: colors.forestGreen }}
    >
      {formatPrice(total).primary}
    </p>
    {settings.showBGNReference && (
      <p
        className="text-sm"
        style={{ color: isDark ? colors.gray : colors.midnightBlack }}
      >
        {formatPrice(total).secondary}
      </p>
    )}
  </div>
</div>

            {/* Checkout Button */}
            <Link
              href="/checkout"
              className="block w-full py-4 rounded-xl font-bold text-center transition-all hover:scale-[1.02]"
              style={{
                background: colors.forestGreen,
                color: colors.white,
              }}
            >
              {language === 'bg' ? 'Към плащане' : 'Proceed to Checkout'}
            </Link>

            {/* Payment Methods */}
            <div className="mt-4 pt-4 border-t" style={{ borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' }}>
              <p
                className="text-xs text-center mb-3"
                style={{ color: isDark ? colors.gray : colors.midnightBlack }}
              >
                {language === 'bg' ? 'Приемаме' : 'We accept'}
              </p>
              <div className="flex justify-center gap-2">
                {/* Visa */}
                <div
                  className="w-12 h-8 rounded flex items-center justify-center text-xs font-bold"
                  style={{
                    background: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
                    color: '#1a1f71',
                  }}
                >
                  VISA
                </div>
                {/* Mastercard */}
                <div
                  className="w-12 h-8 rounded flex items-center justify-center"
                  style={{
                    background: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
                  }}
                >
                  <div className="flex">
                    <div className="w-3 h-3 rounded-full bg-red-500 -mr-1" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500" />
                  </div>
                </div>
                {/* Cash */}
                <div
                  className="w-12 h-8 rounded flex items-center justify-center text-xs"
                  style={{
                    background: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
                    color: isDark ? colors.gray : colors.midnightBlack,
                  }}
                >
                  💵
                </div>
              </div>
            </div>

            {/* Security Badge */}
            <div className="mt-4 flex items-center justify-center gap-2 text-xs" style={{ color: isDark ? colors.gray : colors.midnightBlack }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              {language === 'bg' ? 'Сигурно плащане' : 'Secure Checkout'}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
