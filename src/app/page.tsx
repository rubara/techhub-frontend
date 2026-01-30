// TechHub.bg - Home Page
import { getHeroSlides, getCategories, getProducts, getBrands } from '@/lib/api';
import HeroSlider from '@/components/home/HeroSlider';
import BenefitsBar from '@/components/home/BenefitsBar';
import Categories from '@/components/home/Categories';
import { TranslatedProductGrid } from '@/components/home/TranslatedProductGrid';
import BrandsSection from '@/components/home/BrandsSection';

// Revalidate every 60 seconds
export const revalidate = 60;

export default async function HomePage() {
  // Fetch data from Strapi
  let heroSlides = [];
  let categories = [];
  let trendingProducts = [];
  let newProducts = [];
  let brands = [];

  try {
    [heroSlides, categories, trendingProducts, newProducts, brands] = await Promise.all([
      getHeroSlides().catch(() => []),
      getCategories({ showOnHomepage: true }).catch(() => []),
      getProducts({ limit: 4, sort: 'createdAt:desc' }).then(r => r.products).catch(() => []),
      getProducts({ limit: 4, featured: true }).then(r => r.products).catch(() => []),
      getBrands().catch(() => []),
    ]);
  } catch (error) {
    console.error('Error fetching home page data:', error);
  }

  return (
    <>
      {/* Hero Slider */}
      <HeroSlider slides={heroSlides} />

      {/* Benefits Bar */}
      <BenefitsBar />

      {/* Categories */}
      <Categories categories={categories} />

      {/* Trending Products */}
      <TranslatedProductGrid
        products={trendingProducts}
        titleEn="TRENDING NOW"
        titleBg="АКТУАЛНИ СЕГА"
        viewAllLink="/products"
        columns={4}
      />

      {/* Brands Section */}
      <BrandsSection brands={brands} />

      {/* New Arrivals */}
      <TranslatedProductGrid
        products={newProducts}
        titleEn="NEW ARRIVALS"
        titleBg="НОВИ ПРОДУКТИ"
        viewAllLink="/products?sort=newest"
        columns={4}
      />
    </>
  );
}
