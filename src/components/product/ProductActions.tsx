'use client';

import { useState } from 'react';
import { useUIStore, useCartStore, useWishlistStore } from '@/store';
import { colors } from '@/lib/colors';
import { Product } from '@/types';

interface ProductActionsProps {
  product: Product;
}

export const ProductActions = ({ product }: ProductActionsProps) => {
  const { isDark, language } = useUIStore();
  const { addItem } = useCartStore();
  const { isInWishlist, toggleItem } = useWishlistStore();

  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);

  const inWishlist = isInWishlist(product.id);
  const maxQuantity = Math.min(product.stock, 10);
  const isOutOfStock = product.stock <= 0;

  const handleQuantityChange = (delta: number) => {
    const newQuantity = quantity + delta;
    if (newQuantity >= 1 && newQuantity <= maxQuantity) {
      setQuantity(newQuantity);
    }
  };

  const handleAddToCart = () => {
    addItem(product, quantity);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const handleToggleWishlist = () => {
    toggleItem(product.id);
  };

  return (
    <div className="space-y-4 pt-4">
      {/* Quantity Selector & Add to Cart */}
      <div className="flex items-center gap-3">
        {/* Quantity */}
        <div
          className="flex items-center rounded-xl overflow-hidden"
          style={{
            background: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
          }}
        >
          <button
            onClick={() => handleQuantityChange(-1)}
            disabled={quantity <= 1 || isOutOfStock}
            className="w-12 h-12 flex items-center justify-center text-xl font-bold transition-colors disabled:opacity-30"
            style={{ color: isDark ? colors.white : colors.midnightBlack }}
          >
            −
          </button>
          <span
            className="w-12 text-center font-semibold"
            style={{ color: isDark ? colors.white : colors.midnightBlack }}
          >
            {quantity}
          </span>
          <button
            onClick={() => handleQuantityChange(1)}
            disabled={quantity >= maxQuantity || isOutOfStock}
            className="w-12 h-12 flex items-center justify-center text-xl font-bold transition-colors disabled:opacity-30"
            style={{ color: isDark ? colors.white : colors.midnightBlack }}
          >
            +
          </button>
        </div>

        {/* Add to Cart Button */}
        <button
          onClick={handleAddToCart}
          disabled={isOutOfStock}
          className="flex-1 h-12 rounded-xl font-semibold text-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          style={{
            background: addedToCart ? colors.forestGreen : colors.forestGreen,
            color: colors.white,
            opacity: addedToCart ? 0.8 : 1,
          }}
        >
          {isOutOfStock
            ? language === 'bg'
              ? 'Изчерпан'
              : 'Out of Stock'
            : addedToCart
            ? language === 'bg'
              ? '✓ Добавено!'
              : '✓ Added!'
            : language === 'bg'
            ? 'Добави в количката'
            : 'Add to Cart'}
        </button>
      </div>

      {/* Wishlist Button */}
      <button
        onClick={handleToggleWishlist}
        className="w-full h-12 rounded-xl font-medium flex items-center justify-center gap-2 transition-colors"
        style={{
          background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
          border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.1)',
          color: inWishlist ? colors.pink : isDark ? colors.white : colors.midnightBlack,
        }}
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill={inWishlist ? colors.pink : 'none'}
          stroke={inWishlist ? colors.pink : 'currentColor'}
          strokeWidth="2"
        >
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
        </svg>
        {inWishlist
          ? language === 'bg'
            ? 'Премахни от любими'
            : 'Remove from Wishlist'
          : language === 'bg'
          ? 'Добави в любими'
          : 'Add to Wishlist'}
      </button>
    </div>
  );
};

export default ProductActions;
