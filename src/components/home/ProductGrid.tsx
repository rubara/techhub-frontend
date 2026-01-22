'use client';

// TechHub.bg - Product Grid Component

import React from 'react';
import Link from 'next/link';
import { Product } from '@/types';
import { useUIStore } from '@/store';
import { translations } from '@/lib/translations';
import { ProductCard } from '@/components/product/ProductCard';
import { ArrowRightIcon } from '@/components/ui/Icons';

interface ProductGridProps {
  products: Product[];
  title: string;
  viewAllLink?: string;
  columns?: 3 | 4 | 5;
}

export const ProductGrid: React.FC<ProductGridProps> = ({ 
  products, 
  title, 
  viewAllLink,
  columns = 4 
}) => {
  const { language } = useUIStore();
  const t = translations[language];

  const gridCols = {
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
    5: 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-5',
  };

  return (
    <section className="max-w-[1400px] mx-auto px-6 py-12">
      {/* Section Header */}
      <div className="flex justify-between items-center mb-7">
        <h2 className="font-['Russo_One'] text-2xl flex items-center gap-3">
          <span className="w-1 h-6 bg-[#00B553] rounded-sm" />
          {title}
        </h2>
        {viewAllLink && (
          <Link 
            href={viewAllLink}
            className="text-[#00B553] text-sm font-semibold flex items-center gap-1 hover:underline"
          >
            {t.viewAll} <ArrowRightIcon size={16} />
          </Link>
        )}
      </div>

      {/* Products Grid */}
      <div className={`grid ${gridCols[columns]} gap-5`}>
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
};

export default ProductGrid;
