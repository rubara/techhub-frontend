// TechHub.bg - Strapi API Client

import { 
  StrapiResponse, 
  StrapiData, 
  Category, 
  CategoryAttributes,
  HeroSlide, 
  HeroSlideAttributes,
  Product, 
  ProductAttributes,
  Brand 
} from '@/types';

// Base URL for Strapi API
const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://192.168.0.3:1337';
const API_URL = `${STRAPI_URL}/api`;

// Helper to get full image URL
export function getStrapiImageUrl(image: any): string | null {
  if (!image?.data?.attributes?.url) return null;
  const url = image.data.attributes.url;
  // If URL is relative, prepend Strapi URL
  if (url.startsWith('/')) {
    return `${STRAPI_URL}${url}`;
  }
  return url;
}

// Helper to get image with fallback
export function getImageUrl(image: any, fallback: string = '/images/placeholder.png'): string {
  return getStrapiImageUrl(image) || fallback;
}

// Generic fetch helper
async function fetchAPI<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
    },
    ...options,
  });

  if (!res.ok) {
    throw new Error(`API error: ${res.status} ${res.statusText}`);
  }

  return res.json();
}

// Transform Strapi response to flat object
function transformStrapiData<T>(data: StrapiData<T>): T & { id: number } {
  return {
    id: data.id,
    ...data.attributes,
  };
}

// ============================================
// CATEGORIES
// ============================================

export async function getCategories(): Promise<Category[]> {
  const response = await fetchAPI<StrapiResponse<StrapiData<CategoryAttributes>[]>>(
    '/categories?populate=image&sort=order:asc'
  );
  
  return response.data.map(item => transformStrapiData(item) as Category);
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  const response = await fetchAPI<StrapiResponse<StrapiData<CategoryAttributes>[]>>(
    `/categories?filters[slug][$eq]=${slug}&populate=image`
  );
  
  if (response.data.length === 0) return null;
  return transformStrapiData(response.data[0]) as Category;
}

// ============================================
// HERO SLIDES / BANNERS
// ============================================

export async function getHeroSlides(): Promise<HeroSlide[]> {
  const response = await fetchAPI<StrapiResponse<StrapiData<HeroSlideAttributes>[]>>(
    '/hero-slides?populate=image&filters[active][$eq]=true&sort=order:asc'
  );
  
  return response.data.map(item => transformStrapiData(item) as HeroSlide);
}

// ============================================
// PRODUCTS
// ============================================

export async function getProducts(params?: {
  limit?: number;
  page?: number;
  category?: string;
  brand?: string;
  featured?: boolean;
  sort?: string;
}): Promise<{ products: Product[]; pagination: any }> {
  const queryParams = new URLSearchParams();
  
  queryParams.append('populate', 'image,category,brand');
  
  if (params?.limit) {
    queryParams.append('pagination[pageSize]', params.limit.toString());
  }
  if (params?.page) {
    queryParams.append('pagination[page]', params.page.toString());
  }
  if (params?.category) {
    queryParams.append('filters[category][slug][$eq]', params.category);
  }
  if (params?.brand) {
    queryParams.append('filters[brand][slug][$eq]', params.brand);
  }
  if (params?.featured) {
    queryParams.append('filters[featured][$eq]', 'true');
  }
  if (params?.sort) {
    queryParams.append('sort', params.sort);
  }

  const response = await fetchAPI<StrapiResponse<StrapiData<ProductAttributes>[]>>(
    `/products?${queryParams.toString()}`
  );
  
  return {
    products: response.data.map(item => transformStrapiData(item) as Product),
    pagination: response.meta?.pagination,
  };
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const response = await fetchAPI<StrapiResponse<StrapiData<ProductAttributes>[]>>(
    `/products?filters[slug][$eq]=${slug}&populate=image,images,category,brand`
  );
  
  if (response.data.length === 0) return null;
  return transformStrapiData(response.data[0]) as Product;
}

export async function getFeaturedProducts(limit: number = 8): Promise<Product[]> {
  const { products } = await getProducts({ limit, featured: true });
  return products;
}

export async function getProductsByCategory(categorySlug: string, limit: number = 12): Promise<Product[]> {
  const { products } = await getProducts({ category: categorySlug, limit });
  return products;
}

// ============================================
// BRANDS
// ============================================

export async function getBrands(): Promise<Brand[]> {
  const response = await fetchAPI<StrapiResponse<StrapiData<any>[]>>(
    '/brands?populate=logo,logoLight,logoDark&sort=order:asc'
  );
  
  return response.data.map(item => transformStrapiData(item) as Brand);
}

// ============================================
// SEARCH
// ============================================

export async function searchProducts(query: string, limit: number = 20): Promise<Product[]> {
  const response = await fetchAPI<StrapiResponse<StrapiData<ProductAttributes>[]>>(
    `/products?filters[$or][0][name][$containsi]=${query}&filters[$or][1][nameBg][$containsi]=${query}&filters[$or][2][sku][$containsi]=${query}&populate=image,category&pagination[pageSize]=${limit}`
  );
  
  return response.data.map(item => transformStrapiData(item) as Product);
}
