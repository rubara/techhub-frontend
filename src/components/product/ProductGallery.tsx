'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useUIStore } from '@/store';
import { colors } from '@/lib/colors';

interface ProductGalleryProps {
  images: { url: string }[];
  productName: string;
}

export const ProductGallery = ({ images, productName }: ProductGalleryProps) => {
  const { isDark } = useUIStore();
  const [activeIndex, setActiveIndex] = useState(0);

  const getImageUrl = (image: { url: string }): string => {
    if (!image?.url) return '/placeholder-product.svg';
    if (image.url.startsWith('http')) return image.url;
    return `${process.env.NEXT_PUBLIC_STRAPI_URL}${image.url}`;
  };

  // If no images, show placeholder
  if (!images || images.length === 0) {
    return (
      <div
        className="rounded-2xl overflow-hidden"
        style={{
          background: isDark ? 'rgba(255,255,255,0.03)' : colors.white,
          border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.1)',
        }}
      >
        <div className="relative aspect-square">
          <Image
            src="/placeholder-product.svg"
            alt={productName}
            fill
            className="object-contain p-8"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div
        className="rounded-2xl overflow-hidden"
        style={{
          background: isDark ? 'rgba(255,255,255,0.03)' : colors.white,
          border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.1)',
        }}
      >
        <div className="relative aspect-square">
          <Image
            src={getImageUrl(images[activeIndex])}
            alt={`${productName} - Image ${activeIndex + 1}`}
            fill
            className="object-contain p-8"
            priority
          />
        </div>
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-2">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => setActiveIndex(index)}
              className="flex-shrink-0 rounded-xl overflow-hidden transition-all"
              style={{
                width: '80px',
                height: '80px',
                background: isDark ? 'rgba(255,255,255,0.03)' : colors.white,
                border: activeIndex === index
                  ? `2px solid ${colors.forestGreen}`
                  : isDark
                  ? '1px solid rgba(255,255,255,0.1)'
                  : '1px solid rgba(0,0,0,0.1)',
                opacity: activeIndex === index ? 1 : 0.7,
              }}
            >
              <div className="relative w-full h-full">
                <Image
                  src={getImageUrl(image)}
                  alt={`${productName} - Thumbnail ${index + 1}`}
                  fill
                  className="object-contain p-2"
                />
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductGallery;
