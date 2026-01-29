'use client';

// TechHub.bg - Product Card Component

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Product } from '@/types';
import { useUIStore, useCartStore, useWishlistStore } from '@/store';
import { translations } from '@/lib/translations';
import { colors, stockColors, badgeColors } from '@/lib/colors';
import { formatPrice, getStockStatus } from '@/lib/utils';
import { getImageUrl } from '@/lib/api';
import { HeartIcon, CartIcon, StarIcon } from '@/components/ui/Icons';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const [isHovered, setIsHovered] = useState(false);
  const { isDark, language } = useUIStore();
  const addToCart = useCartStore((state) => state.addItem);
  const { isInWishlist, toggleItem: toggleWishlist } = useWishlistStore();
  
  // isDark already boolean
  const t = translations[language];
  const isWishlisted = isInWishlist(product.id);
  
  const imageUrl = getImageUrl(product.image, '/images/product-placeholder.png');
  const productName = language === 'bg' ? product.nameBg : product.name;
  const stockStatus = getStockStatus(product.stock);
  const prices = formatPrice(product.price);
  const oldPrices = product.oldPrice ? formatPrice(product.oldPrice) : null;

  const stockLabels = {
    in: t.inStock,
    limited: t.limited,
    out: t.outOfStock,
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    if (product.stock > 0) {
      addToCart(product, 1);
    }
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    toggleWishlist(product.id);
  };

  return (
    <Link
      href={`/product/${product.slug}`}
      className={`
        group relative rounded-2xl overflow-hidden transition-all duration-300
        ${isDark 
          ? 'bg-white/[0.03] border border-white/5 hover:border-[#00B553]/50' 
          : 'bg-white border border-gray-200 hover:border-[#00B553]/50'
        }
        hover:-translate-y-1 hover:shadow-xl
      `}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Badge */}
      {product.badge && (
        <div 
          className="absolute top-3 left-3 px-2.5 py-1 rounded-md text-[11px] font-bold font-['Russo_One'] z-10"
          style={{ 
            backgroundColor: badgeColors[product.badge as keyof typeof badgeColors] || colors.forestGreen,
            color: product.badge === '-13%' ? colors.midnightBlack : colors.white,
          }}
        >
          {product.badge}
        </div>
      )}

      {/* Wishlist Button */}
      <button
        onClick={handleToggleWishlist}
        className={`
          absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center z-10 transition-all
          ${isDark ? 'bg-black/50 hover:bg-black/70' : 'bg-white/90 hover:bg-white shadow-md'}
        `}
      >
        <HeartIcon 
          size={18} 
          color={isWishlisted ? colors.pink : (isDark ? 'rgba(255,255,255,0.6)' : colors.gray)}
          filled={isWishlisted}
        />
      </button>

      {/* Product Image */}
      <div className={`
        relative h-44 flex items-center justify-center overflow-hidden
        ${isDark ? 'bg-white/[0.02]' : 'bg-gray-50'}
      `}>
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={productName}
            fill
            className={`
              object-contain p-4 transition-transform duration-300
              ${isHovered ? 'scale-110' : 'scale-100'}
            `}
          />
        ) : (
          <div className={`flex flex-col items-center justify-center ${isDark ? 'text-white/30' : 'text-gray-400'}`}>
            <span className="text-4xl mb-2 opacity-50">📦</span>
            <span className="text-xs">Product Image</span>
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-4">
        {/* Stock Status */}
        <div 
          className="flex items-center gap-1.5 text-[11px] font-semibold mb-2"
          style={{ color: stockColors[stockStatus] }}
        >
          <span 
            className="w-1.5 h-1.5 rounded-full"
            style={{ backgroundColor: stockColors[stockStatus] }}
          />
          {stockLabels[stockStatus]}
        </div>

        {/* Product Name */}
        <h3 className={`
          text-sm font-semibold mb-2 leading-snug h-10 overflow-hidden
          ${isDark ? 'text-white' : 'text-gray-900'}
        `}
        style={{
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
        }}
        >
          {productName}
        </h3>

        {/* Rating */}
        <div className="flex gap-0.5 mb-3">
          {[1, 2, 3, 4, 5].map((star) => (
            <StarIcon
              key={star}
              size={14}
              color={star <= product.rating ? colors.yellow : (isDark ? 'rgba(255,255,255,0.2)' : '#ddd')}
              filled={star <= product.rating}
            />
          ))}
        </div>

        {/* Price - Dual Currency */}
        <div className="mb-3.5">
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold font-['Russo_One'] text-[#00B553]">
              {prices.bgn} лв
            </span>
            {oldPrices && (
              <span className={`text-sm line-through ${isDark ? 'text-white/40' : 'text-gray-400'}`}>
                {oldPrices.bgn} лв
              </span>
            )}
          </div>
          <div className={`text-xs mt-0.5 ${isDark ? 'text-white/50' : 'text-gray-500'}`}>
            ≈ {prices.eur} €
          </div>
        </div>

        {/* Add to Cart Button */}
        <button
          onClick={handleAddToCart}
          disabled={product.stock === 0}
          className={`
            w-full py-3 rounded-lg font-semibold text-[13px] flex items-center justify-center gap-2 transition-all
            ${product.stock === 0
              ? isDark ? 'bg-white/5 text-white/30 cursor-not-allowed' : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-[#00B553] text-white hover:bg-[#00a04a]'
            }
          `}
        >
          <CartIcon size={16} />
          {t.addToCart}
        </button>
      </div>
    </Link>
  );
};

export default ProductCard;
