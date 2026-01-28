'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useUIStore } from '@/store';
import { colors } from '@/lib/colors';
import { getFiltersForCategory } from '@/lib/filters';
import {
  getFilteredProducts,
  getCategoryWithParent,
  getChildCategories,
  getProductCount,
} from '@/lib/api';
import { FilterState } from '@/types';
import {
  Breadcrumb,
  CategoryHeader,
  FilterSidebar,
  ProductToolbar,
  Pagination,
  ActiveFilters,
} from '@/components/category';

export default function CategoryPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const slug = params.slug as string;

  const { isDark, language } = useUIStore();

  // State
  const [category, setCategory] = useState<any>(null);
  const [parentCategory, setParentCategory] = useState<any>(null);
  const [childCategories, setChildCategories] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [productCount, setProductCount] = useState(0);
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 24,
    pageCount: 1,
    total: 0,
  });
  const [loading, setLoading] = useState(true);
  const [filterSidebarOpen, setFilterSidebarOpen] = useState(false);

  // Get filter config for this category
  const filterConfig = getFiltersForCategory(slug);

  // Parse filters from URL
  const getFiltersFromURL = useCallback((): FilterState => {
    const filters: FilterState = {};

    searchParams.forEach((value, key) => {
      if (key === 'page' || key === 'sort') return;

      if (value.includes(',')) {
        filters[key] = value.split(',');
      } else if (value === 'true') {
        filters[key] = true;
      } else if (value === 'false') {
        filters[key] = false;
      } else if (!isNaN(Number(value))) {
        filters[key] = Number(value);
      } else {
        filters[key] = value;
      }
    });

    return filters;
  }, [searchParams]);

  const [activeFilters, setActiveFilters] = useState<FilterState>(getFiltersFromURL());
  const [currentSort, setCurrentSort] = useState(searchParams.get('sort') || 'createdAt:desc');
  const [currentPage, setCurrentPage] = useState(Number(searchParams.get('page')) || 1);

  // Update URL with filters
  const updateURL = useCallback(
    (filters: FilterState, sort: string, page: number) => {
      const params = new URLSearchParams();

      Object.entries(filters).forEach(([key, value]) => {
        if (value === undefined || value === '' || value === false) return;
        if (Array.isArray(value) && value.length === 0) return;

        if (Array.isArray(value)) {
          params.set(key, value.join(','));
        } else {
          params.set(key, String(value));
        }
      });

      if (sort !== 'createdAt:desc') {
        params.set('sort', sort);
      }

      if (page > 1) {
        params.set('page', String(page));
      }

      const queryString = params.toString();
      router.push(`/category/${slug}${queryString ? `?${queryString}` : ''}`, {
        scroll: false,
      });
    },
    [router, slug]
  );

  // Fetch category data
  useEffect(() => {
    const fetchCategory = async () => {
      const cat = await getCategoryWithParent(slug);
      setCategory(cat);

      if (cat) {
        // Get parent category if exists
        if (cat.category) {
          setParentCategory(cat.category);
        }

        // Get child categories
        const children = await getChildCategories(cat.id);
        setChildCategories(children);

        // Get total product count
        const count = await getProductCount(slug);
        setProductCount(count);
      }
    };

    fetchCategory();
  }, [slug]);

  // Fetch products with filters
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);

      // Build API filters
      const apiFilters: any = {
        category: slug,
        sort: currentSort,
        page: currentPage,
        pageSize: 24,
      };

      // Add price filters
      if (activeFilters.priceMin) {
        apiFilters.minPrice = activeFilters.priceMin;
      }
      if (activeFilters.priceMax) {
        apiFilters.maxPrice = activeFilters.priceMax;
      }

      // Add stock filter
      if (activeFilters.inStock) {
        apiFilters.inStock = true;
      }

      // Build specification filters from filter config
      if (filterConfig.specRelation) {
        const specFilters: Record<string, any> = {};

        filterConfig.filters.forEach((filter) => {
          const filterValue = activeFilters[filter.id];
          
          // Skip if no value or it's a non-spec filter
          if (filterValue === undefined || filterValue === '' || filterValue === false) return;
          if (filter.id === 'price' || filter.id === 'priceMin' || filter.id === 'priceMax' || filter.id === 'inStock') return;

          // Get the field path (e.g., 'gpuSpecification.chipManufacturer')
          if (filter.field && filter.field.includes('.')) {
            const fieldParts = filter.field.split('.');
            const specField = fieldParts[1]; // e.g., 'chipManufacturer'

            if (Array.isArray(filterValue)) {
              // Multiple values - use $in operator
              specFilters[specField] = filterValue;
            } else {
              specFilters[specField] = filterValue;
            }
          }
        });

        // Add spec filters to API call
        if (Object.keys(specFilters).length > 0) {
          apiFilters.specRelation = filterConfig.specRelation;
          apiFilters.specFilters = specFilters;
        }
      }

      const { products: fetchedProducts, pagination: fetchedPagination } =
        await getFilteredProducts(apiFilters);

      setProducts(fetchedProducts);
      if (fetchedPagination) {
        setPagination(fetchedPagination);
      }

      setLoading(false);
    };

    if (category) {
      fetchProducts();
    }
  }, [slug, category, activeFilters, currentSort, currentPage, filterConfig]);

  // Handle filter change
  const handleFilterChange = (filterId: string, value: any) => {
    const newFilters = { ...activeFilters };

    if (value === undefined || value === '' || value === false) {
      delete newFilters[filterId];
    } else {
      newFilters[filterId] = value;
    }

    setActiveFilters(newFilters);
    setCurrentPage(1);
    updateURL(newFilters, currentSort, 1);
  };

  // Handle remove filter
  const handleRemoveFilter = (filterId: string, value?: string) => {
    const newFilters = { ...activeFilters };

    // Handle price range
    if (filterId === 'price') {
      delete newFilters.priceMin;
      delete newFilters.priceMax;
    } else if (Array.isArray(newFilters[filterId]) && value) {
      const arr = newFilters[filterId] as string[];
      const newArr = arr.filter((v) => v !== value);
      if (newArr.length === 0) {
        delete newFilters[filterId];
      } else {
        newFilters[filterId] = newArr;
      }
    } else {
      delete newFilters[filterId];
    }

    setActiveFilters(newFilters);
    setCurrentPage(1);
    updateURL(newFilters, currentSort, 1);
  };

  // Handle clear all filters
  const handleClearAll = () => {
    setActiveFilters({});
    setCurrentPage(1);
    updateURL({}, currentSort, 1);
  };

  // Handle sort change
  const handleSortChange = (sort: string) => {
    setCurrentSort(sort);
    setCurrentPage(1);
    updateURL(activeFilters, sort, 1);
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    updateURL(activeFilters, currentSort, page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Build breadcrumb items
  const breadcrumbItems = [];
  if (parentCategory) {
    breadcrumbItems.push({
      label: parentCategory.name,
      labelBg: parentCategory.nameBg,
      href: `/category/${parentCategory.slug}`,
    });
  }
  if (category) {
    breadcrumbItems.push({
      label: category.name,
      labelBg: category.nameBg,
      href: `/category/${category.slug}`,
    });
  }

  // Get image URL helper
  const getImageUrl = (product: any): string => {
    if (!product.image) return '/placeholder-product.svg';
    const imageData = product.image;
    if (imageData.url) {
      if (imageData.url.startsWith('http')) return imageData.url;
      return `${process.env.NEXT_PUBLIC_STRAPI_URL}${imageData.url}`;
    }
    return '/placeholder-product.svg';
  };

  if (!category) {
    return (
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center py-20">
          <p style={{ color: isDark ? colors.gray : colors.midnightBlack }}>
            {language === 'bg' ? 'Зареждане...' : 'Loading...'}
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="max-w-7xl mx-auto px-4 py-4">
      {/* Breadcrumb */}
      <Breadcrumb items={breadcrumbItems} />

      {/* Category Header */}
      <CategoryHeader
        name={category.name}
        nameBg={category.nameBg}
        productCount={productCount}
      />

      {/* Child Categories */}
      {childCategories.length > 0 && (
        <div className="mb-6">
          <div className="flex gap-3 flex-wrap">
            {childCategories.map((child) => (
              <Link
                key={child.id}
                href={`/category/${child.slug}`}
                className="px-4 py-2 rounded-full text-sm font-medium transition-colors"
                style={{
                  background: isDark
                    ? 'rgba(255,255,255,0.1)'
                    : 'rgba(0,0,0,0.05)',
                  color: isDark ? colors.white : colors.midnightBlack,
                }}
              >
                {language === 'bg' ? child.nameBg : child.name}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Active Filters */}
      <ActiveFilters
        filterConfig={filterConfig}
        activeFilters={activeFilters}
        onRemoveFilter={handleRemoveFilter}
        onClearAll={handleClearAll}
      />

      {/* Main Content */}
      <div className="flex gap-6">
        {/* Filter Sidebar */}
        <FilterSidebar
          filterConfig={filterConfig}
          activeFilters={activeFilters}
          onFilterChange={handleFilterChange}
          onClearAll={handleClearAll}
          isOpen={filterSidebarOpen}
          onClose={() => setFilterSidebarOpen(false)}
        />

        {/* Products Section */}
        <div className="flex-1">
          {/* Toolbar */}
          <ProductToolbar
            totalProducts={pagination.total}
            currentSort={currentSort}
            onSortChange={handleSortChange}
            onOpenFilters={() => setFilterSidebarOpen(true)}
          />

          {/* Product Grid */}
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className="rounded-xl overflow-hidden animate-pulse"
                  style={{
                    background: isDark
                      ? 'rgba(255,255,255,0.05)'
                      : 'rgba(0,0,0,0.05)',
                    height: '320px',
                  }}
                />
              ))}
            </div>
          ) : products.length === 0 ? (
            <div
              className="text-center py-20 rounded-xl"
              style={{
                background: isDark
                  ? 'rgba(255,255,255,0.03)'
                  : colors.white,
              }}
            >
              <p
                className="text-lg"
                style={{ color: isDark ? colors.gray : colors.midnightBlack }}
              >
                {language === 'bg'
                  ? 'Няма намерени продукти'
                  : 'No products found'}
              </p>
              <button
                onClick={handleClearAll}
                className="mt-4 px-6 py-2 rounded-lg font-medium transition-colors"
                style={{
                  background: colors.forestGreen,
                  color: colors.white,
                }}
              >
                {language === 'bg' ? 'Изчисти филтрите' : 'Clear filters'}
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {products.map((product) => (
                <Link
                  key={product.id}
                  href={`/product/${product.slug}`}
                  className="group rounded-xl overflow-hidden transition-transform hover:scale-[1.02]"
                  style={{
                    background: isDark
                      ? 'rgba(255,255,255,0.03)'
                      : colors.white,
                    border: isDark
                      ? '1px solid rgba(255,255,255,0.1)'
                      : '1px solid rgba(0,0,0,0.1)',
                  }}
                >
                  {/* Product Image */}
                  <div
                    className="relative aspect-square"
                    style={{
                      background: isDark
                        ? 'rgba(255,255,255,0.05)'
                        : 'rgba(0,0,0,0.03)',
                    }}
                  >
                    <Image
                      src={getImageUrl(product)}
                      alt={product.name}
                      fill
                      className="object-contain p-4"
                    />

                    {/* Stock Badge */}
                    {product.stock <= 0 && (
                      <span
                        className="absolute top-2 left-2 px-2 py-1 text-xs font-medium rounded"
                        style={{
                          background: colors.pink,
                          color: colors.white,
                        }}
                      >
                        {language === 'bg' ? 'Изчерпан' : 'Out of Stock'}
                      </span>
                    )}

                    {/* Sale Badge */}
                    {product.originalPrice && product.originalPrice > product.price && (
                      <span
                        className="absolute top-2 right-2 px-2 py-1 text-xs font-medium rounded"
                        style={{
                          background: colors.forestGreen,
                          color: colors.white,
                        }}
                      >
                        -
                        {Math.round(
                          ((product.originalPrice - product.price) /
                            product.originalPrice) *
                            100
                        )}
                        %
                      </span>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="p-4">
                    {/* Brand */}
                    {product.brand && (
                      <p
                        className="text-xs font-medium mb-1"
                        style={{ color: colors.forestGreen }}
                      >
                        {product.brand.name}
                      </p>
                    )}

                    {/* Name */}
                    <h3
                      className="font-medium text-sm mb-2 line-clamp-2 min-h-[40px]"
                      style={{
                        color: isDark ? colors.white : colors.midnightBlack,
                      }}
                    >
                      {product.name}
                    </h3>

                    {/* Price */}
                    <div className="flex items-center gap-2">
                      <span
                        className="text-lg font-bold"
                        style={{ color: colors.forestGreen }}
                      >
                        {product.price.toFixed(2)} лв.
                      </span>
                      {product.originalPrice &&
                        product.originalPrice > product.price && (
                          <span
                            className="text-sm line-through"
                            style={{
                              color: isDark
                                ? 'rgba(255,255,255,0.5)'
                                : 'rgba(0,0,0,0.5)',
                            }}
                          >
                            {product.originalPrice.toFixed(2)} лв.
                          </span>
                        )}
                    </div>

                    {/* Stock Status */}
                    <p
                      className="text-xs mt-2"
                      style={{
                        color:
                          product.stock > 0 ? colors.forestGreen : colors.pink,
                      }}
                    >
                      {product.stock > 0
                        ? language === 'bg'
                          ? 'В наличност'
                          : 'In Stock'
                        : language === 'bg'
                        ? 'Изчерпан'
                        : 'Out of Stock'}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* Pagination */}
          {!loading && products.length > 0 && (
            <Pagination
              currentPage={currentPage}
              totalPages={pagination.pageCount}
              onPageChange={handlePageChange}
            />
          )}
        </div>
      </div>
    </main>
  );
}
