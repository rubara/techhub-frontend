'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useUIStore } from '@/store';
import { colors } from '@/lib/colors';

interface RelatedProduct {
  id: number;
  name: string;
  slug: string;
  price: number;
  originalPrice?: number;
  image?: { url: string };
  brand?: { name: string };
}

interface RelatedProductsProps {
  products: RelatedProduct[];
}

export const RelatedProducts = ({ products }: RelatedProductsProps) => {
  const { isDark, language } = useUIStore();

  if (products.length === 0) return null;

  const getImageUrl = (image?: { url: string }): string => {
    if (!image?.url) return '/placeholder-product.svg';
    if (image.url.startsWith('http')) return image.url;
    return `${process.env.NEXT_PUBLIC_STRAPI_URL}${image.url}`;
  };

  return (
    <div className="mt-12">
      <h2
        className="text-xl font-bold mb-6"
        style={{ color: isDark ? colors.white : colors.midnightBlack }}
      >
        {language === 'bg' ? 'Подобни продукти' : 'Related Products'}
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {products.map((product) => (
          <Link
            key={product.id}
            href={`/product/${product.slug}`}
            className="group rounded-xl overflow-hidden transition-transform hover:scale-[1.02]"
            style={{
              background: isDark ? 'rgba(255,255,255,0.03)' : colors.white,
              border: isDark
                ? '1px solid rgba(255,255,255,0.1)'
                : '1px solid rgba(0,0,0,0.1)',
            }}
          >
            {/* Image */}
            <div
              className="relative aspect-square"
              style={{
                background: isDark
                  ? 'rgba(255,255,255,0.05)'
                  : 'rgba(0,0,0,0.03)',
              }}
            >
              <Image
                src={getImageUrl(product.image)}
                alt={product.name}
                fill
                className="object-contain p-4"
              />
            </div>

            {/* Info */}
            <div className="p-3">
              {product.brand && (
                <p
                  className="text-xs font-medium mb-1"
                  style={{ color: colors.forestGreen }}
                >
                  {product.brand.name}
                </p>
              )}
              <h3
                className="font-medium text-sm mb-2 line-clamp-2"
                style={{ color: isDark ? colors.white : colors.midnightBlack }}
              >
                {product.name}
              </h3>
              <span
                className="text-base font-bold"
                style={{ color: colors.forestGreen }}
              >
                {product.price.toFixed(2)} лв.
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default RelatedProducts;
