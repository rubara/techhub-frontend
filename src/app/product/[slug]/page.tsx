'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useUIStore } from '@/store';
import { colors } from '@/lib/colors';
import { getProductBySlug, getRelatedProducts } from '@/lib/api';
import { getSpecRelation, getSpecType } from '@/lib/specifications';
import { Breadcrumb } from '@/components/category';
import {
  ProductGallery,
  ProductInfo,
  ProductActions,
  ProductBenefits,
  ProductTabs,
  RelatedProducts,
} from '@/components/product';
import { ChevronRightIcon } from '@/components/ui';

export default function ProductPage() {
  const params = useParams();
  const slug = params.slug as string;

  const { isDark, language } = useUIStore();

  const [product, setProduct] = useState<any>(null);
  const [relatedProducts, setRelatedProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);

      const fetchedProduct = await getProductBySlug(slug);
      setProduct(fetchedProduct);

      if (fetchedProduct?.category?.slug) {
        const related = await getRelatedProducts(
          fetchedProduct.category.slug,
          fetchedProduct.id,
          4
        );
        setRelatedProducts(related);
      }

      setLoading(false);
    };

    fetchProduct();
  }, [slug]);

  // Get specification data
  const getSpecifications = () => {
    if (!product?.category?.slug) return { specs: null, specType: null };

    const specRelation = getSpecRelation(product.category.slug);
    const specType = getSpecType(product.category.slug);

    if (!specRelation || !specType) return { specs: null, specType: null };

    const specs = product[specRelation];
    return { specs, specType };
  };

  // Build breadcrumb items
  const buildBreadcrumbs = () => {
    const items = [];

    // Parent category (e.g., Components)
    if (product?.category?.category) {
      items.push({
        label: product.category.category.name,
        labelBg: product.category.category.nameBg,
        href: `/category/${product.category.category.slug}`,
      });
    }

    // Category (e.g., Graphics Cards)
    if (product?.category) {
      items.push({
        label: product.category.name,
        labelBg: product.category.nameBg,
        href: `/category/${product.category.slug}`,
      });
    }

    // Product name
    if (product) {
      items.push({
        label: product.name,
        labelBg: product.name,
        href: `/product/${product.slug}`,
      });
    }

    return items;
  };

  // Get product images array
  const getProductImages = () => {
    const images = [];

    // Main image
    if (product?.image) {
      images.push(product.image);
    }

    // Additional images (if you have a gallery field)
    if (product?.gallery && Array.isArray(product.gallery)) {
      images.push(...product.gallery);
    }

    return images;
  };

  // Loading state
  if (loading) {
    return (
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="animate-pulse">
          {/* Breadcrumb skeleton */}
          <div
            className="h-4 w-64 rounded mb-6"
            style={{ background: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' }}
          />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Image skeleton */}
            <div
              className="aspect-square rounded-2xl"
              style={{ background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }}
            />

            {/* Info skeleton */}
            <div className="space-y-4">
              <div
                className="h-6 w-24 rounded"
                style={{ background: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' }}
              />
              <div
                className="h-10 w-3/4 rounded"
                style={{ background: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' }}
              />
              <div
                className="h-8 w-32 rounded"
                style={{ background: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' }}
              />
              <div
                className="h-12 w-full rounded-xl mt-6"
                style={{ background: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' }}
              />
            </div>
          </div>
        </div>
      </main>
    );
  }

  // Product not found
  if (!product) {
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
            {language === 'bg' ? 'Продуктът не е намерен' : 'Product Not Found'}
          </h1>
          <p
            className="mb-6"
            style={{ color: isDark ? colors.gray : colors.midnightBlack }}
          >
            {language === 'bg'
              ? 'Съжаляваме, но продуктът, който търсите, не съществува.'
              : 'Sorry, the product you are looking for does not exist.'}
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-colors"
            style={{
              background: colors.forestGreen,
              color: colors.white,
            }}
          >
            {language === 'bg' ? 'Към началната страница' : 'Go to Homepage'}
            <ChevronRightIcon size={16} />
          </Link>
        </div>
      </main>
    );
  }

  const { specs, specType } = getSpecifications();
  const breadcrumbItems = buildBreadcrumbs();
  const productImages = getProductImages();

  return (
    <main className="max-w-7xl mx-auto px-4 py-4">
      {/* Breadcrumb */}
      <Breadcrumb items={breadcrumbItems} />

      {/* Product Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-4">
        {/* Left: Gallery */}
        <ProductGallery images={productImages} productName={product.name} />

        {/* Right: Info & Actions */}
        <div>
          <ProductInfo
            name={product.name}
            brand={product.brand}
            category={product.category}
            price={product.price}
            originalPrice={product.originalPrice}
            stock={product.stock}
            sku={product.sku}
          />

          <ProductActions product={product} />

          {/* Payment Methods Placeholder - TODO: Implement later */}
          <div
            className="rounded-xl p-4 mt-6"
            style={{
              background: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)',
              border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.05)',
            }}
          >
            <p
              className="text-sm font-medium mb-3"
              style={{ color: isDark ? colors.white : colors.midnightBlack }}
            >
              {language === 'bg' ? 'Начини на плащане' : 'Payment Methods'}
            </p>
            <div className="flex items-center gap-3 flex-wrap">
              <span
                className="px-3 py-1.5 rounded-lg text-xs font-medium"
                style={{
                  background: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
                  color: isDark ? colors.gray : colors.midnightBlack,
                }}
              >
                Visa
              </span>
              <span
                className="px-3 py-1.5 rounded-lg text-xs font-medium"
                style={{
                  background: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
                  color: isDark ? colors.gray : colors.midnightBlack,
                }}
              >
                Mastercard
              </span>
              <span
                className="px-3 py-1.5 rounded-lg text-xs font-medium"
                style={{
                  background: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
                  color: isDark ? colors.gray : colors.midnightBlack,
                }}
              >
                {language === 'bg' ? 'Наложен платеж' : 'Cash on Delivery'}
              </span>
            </div>
            {product.price >= 100 && (
              <p
                className="text-xs mt-3"
                style={{ color: colors.forestGreen }}
              >
                {language === 'bg'
                  ? `Или от ${(product.price / 12).toFixed(2)} лв./месец с TBI Bank`
                  : `Or from ${(product.price / 12).toFixed(2)} BGN/month with TBI Bank`}
              </p>
            )}
          </div>

          <ProductBenefits />
        </div>
      </div>

      {/* Tabs: Description, Specifications, Reviews */}
      <ProductTabs
        description={product.description}
        descriptionBg={product.descriptionBg}
        specifications={specs}
        specType={specType || undefined}
      />

      {/* Related Products */}
      <RelatedProducts products={relatedProducts} />
    </main>
  );
}
