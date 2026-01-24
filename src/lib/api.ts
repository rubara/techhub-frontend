// TechHub.bg - Strapi API Client

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://192.168.0.3:1337';
const API_URL = `${STRAPI_URL}/api`;

// Helper to get full image URL (Strapi v5 format)
export function getStrapiImageUrl(image: any): string | null {
  if (!image) return null;
  
  // Strapi v5 format: image.url directly
  if (image.url) {
    const url = image.url;
    if (url.startsWith('/')) {
      return `${STRAPI_URL}${url}`;
    }
    return url;
  }
  
  // Strapi v4 format: image.data.attributes.url (fallback)
  if (image?.data?.attributes?.url) {
    const url = image.data.attributes.url;
    if (url.startsWith('/')) {
      return `${STRAPI_URL}${url}`;
    }
    return url;
  }
  
  return null;
}

// Helper to get image with fallback
export function getImageUrl(image: any, fallback: string = '/images/placeholder.svg'): string {
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

// Transform Strapi v5 response to flat object
function transformStrapiData<T>(item: any): T & { id: number } {
  return {
    id: item.id,
    ...item,
  };
}

// ============================================
// CATEGORIES
// ============================================

export async function getCategories(): Promise<any[]> {
  try {
    const response = await fetchAPI<{ data: any[] }>(
      '/categories?populate=image&sort=order:asc'
    );
    return response.data || [];
  } catch (error) {
    console.error('Failed to fetch categories:', error);
    return [];
  }
}

export async function getCategoryBySlug(slug: string): Promise<any | null> {
  try {
    const response = await fetchAPI<{ data: any[] }>(
      `/categories?filters[slug][$eq]=${slug}&populate=image`
    );
    if (response.data.length === 0) return null;
    return response.data[0];
  } catch (error) {
    console.error('Failed to fetch category:', error);
    return null;
  }
}

// ============================================
// HERO SLIDES / BANNERS
// ============================================

export async function getHeroSlides(): Promise<any[]> {
  try {
    const response = await fetchAPI<{ data: any[] }>(
      '/hero-slides?populate=image&filters[active][$eq]=true&sort=order:asc'
    );
    return response.data || [];
  } catch (error) {
    console.error('Failed to fetch hero slides:', error);
    return [];
  }
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
}): Promise<{ products: any[]; pagination: any }> {
  try {
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

    const response = await fetchAPI<{ data: any[]; meta: any }>(
      `/products?${queryParams.toString()}`
    );
    
    return {
      products: response.data || [],
      pagination: response.meta?.pagination,
    };
  } catch (error) {
    console.error('Failed to fetch products:', error);
    return { products: [], pagination: null };
  }
}

export async function getProductBySlug(slug: string): Promise<any | null> {
  try {
    const response = await fetchAPI<{ data: any[] }>(
      `/products?filters[slug][$eq]=${slug}&populate=image,gallery,category,brand`
    );
    if (response.data.length === 0) return null;
    return response.data[0];
  } catch (error) {
    console.error('Failed to fetch product:', error);
    return null;
  }
}

export async function getFeaturedProducts(limit: number = 8): Promise<any[]> {
  const { products } = await getProducts({ limit, featured: true });
  return products;
}

export async function getProductsByCategory(categorySlug: string, limit: number = 12): Promise<any[]> {
  const { products } = await getProducts({ category: categorySlug, limit });
  return products;
}

// ============================================
// BRANDS
// ============================================

export async function getBrands(): Promise<any[]> {
  try {
    const response = await fetchAPI<{ data: any[] }>(
      '/brands?populate=logo,logoLight,logoDark&sort=order:asc'
    );
    return response.data || [];
  } catch (error) {
    console.error('Failed to fetch brands:', error);
    return [];
  }
}

// ============================================
// SEARCH
// ============================================

export async function searchProducts(query: string, limit: number = 20): Promise<any[]> {
  try {
    const response = await fetchAPI<{ data: any[] }>(
      `/products?filters[$or][0][name][$containsi]=${query}&filters[$or][1][nameBg][$containsi]=${query}&filters[$or][2][sku][$containsi]=${query}&populate=image,category&pagination[pageSize]=${limit}`
    );
    return response.data || [];
  } catch (error) {
    console.error('Failed to search products:', error);
    return [];
  }
}
