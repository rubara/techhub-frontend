'use client';

import { useUIStore } from '@/store';
import ProductGrid from '@/components/home/ProductGrid';

interface TranslatedProductGridProps {
  products: any[];
  titleEn: string;
  titleBg: string;
  viewAllLink: string;
  columns?: number;
}

export function TranslatedProductGrid({
  products,
  titleEn,
  titleBg,
  viewAllLink,
  columns = 4,
}: TranslatedProductGridProps) {
  const { language } = useUIStore();
  const title = language === 'bg' ? titleBg : titleEn;

  return (
    <ProductGrid
      products={products}
      title={title}
      viewAllLink={viewAllLink}
      columns={columns}
    />
  );
}
