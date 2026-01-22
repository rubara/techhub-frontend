// TechHub.bg TypeScript Types

// Strapi response wrapper
export interface StrapiResponse<T> {
  data: T;
  meta?: {
    pagination?: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

export interface StrapiData<T> {
  id: number;
  attributes: T;
}

// Media/Image type from Strapi
export interface StrapiImage {
  data: {
    id: number;
    attributes: {
      url: string;
      alternativeText?: string;
      width: number;
      height: number;
      formats?: {
        thumbnail?: { url: string };
        small?: { url: string };
        medium?: { url: string };
        large?: { url: string };
      };
    };
  } | null;
}

// Category
export interface Category {
  id: number;
  name: string;
  nameBg: string;
  slug: string;
  image: StrapiImage;
  color: string;
  order: number;
}

export interface CategoryAttributes {
  name: string;
  nameBg: string;
  slug: string;
  image: StrapiImage;
  color: string;
  order: number;
}

// Hero Slide / Banner
export interface HeroSlide {
  id: number;
  titleEn: string;
  titleBg: string;
  subtitleEn: string;
  subtitleBg: string;
  buttonTextEn: string;
  buttonTextBg: string;
  buttonLink: string;
  buttonColor: string;
  image: StrapiImage;
  order: number;
  active: boolean;
}

export interface HeroSlideAttributes {
  titleEn: string;
  titleBg: string;
  subtitleEn: string;
  subtitleBg: string;
  buttonTextEn: string;
  buttonTextBg: string;
  buttonLink: string;
  buttonColor: string;
  image: StrapiImage;
  order: number;
  active: boolean;
}

// Brand
export interface Brand {
  id: number;
  name: string;
  slug: string;
  logo: StrapiImage;
  logoLight: StrapiImage;
  logoDark: StrapiImage;
  website?: string;
  order: number;
}

// Product
export interface Product {
  id: number;
  name: string;
  nameBg: string;
  slug: string;
  description?: string;
  descriptionBg?: string;
  price: number;
  oldPrice?: number;
  sku: string;
  stock: number;
  rating: number;
  badge?: string;
  image: StrapiImage;
  images?: StrapiImage[];
  category?: { data: StrapiData<CategoryAttributes> };
  brand?: { data: StrapiData<{ name: string; slug: string }> };
}

export interface ProductAttributes {
  name: string;
  nameBg: string;
  slug: string;
  description?: string;
  descriptionBg?: string;
  price: number;
  oldPrice?: number;
  sku: string;
  stock: number;
  rating: number;
  badge?: string;
  image: StrapiImage;
  images?: StrapiImage[];
  category?: { data: StrapiData<CategoryAttributes> };
  brand?: { data: StrapiData<{ name: string; slug: string }> };
}

// Cart Item
export interface CartItem {
  id: number;
  product: Product;
  quantity: number;
}

// User
export interface User {
  id: number;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
}

// Theme
export type Theme = 'dark' | 'light';

// Language
export type Language = 'bg' | 'en';
