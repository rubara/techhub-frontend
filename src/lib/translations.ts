// TechHub.bg - Translations

export interface TranslationType {
  // Utility Bar
  freeShippingBar: string;

  // Navigation
  search: string;
  searchPlaceholder: string;
  categories: string;
  deals: string;
  newArrivals: string;
  brands: string;
  pcBuilder: string;
  gamingPCs: string;
  components: string;
  peripherals: string;
  computers: string;
  support: string;

  // User
  wishlist: string;
  login: string;
  register: string;
  myAccount: string;
  myOrders: string;
  settings: string;
  logout: string;
  welcome: string;

  // Sections
  trendingNow: string;
  hotDeals: string;
  topCategories: string;
  featuredBrands: string;
  newProducts: string;
  topSellers: string;

  // Newsletter
  newsletter: string;
  newsletterDesc: string;
  subscribe: string;
  emailPlaceholder: string;
  newsletterPlaceholder: string;

  // Product
  addToCart: string;
  add: string;
  inStock: string;
  outOfStock: string;
  limited: string;
  lastOne: string;
  viewAll: string;
  viewProduct: string;
  seeAll: string;

  // Cart
  cart: string;
  cartEmpty: string;
  total: string;
  checkout: string;
  continueShopping: string;

  // Benefits
  freeShipping: string;
  freeShippingText: string;
  returns: string;
  returnsText: string;
  securePayment: string;
  securePaymentText: string;

  // Footer
  footer: {
    about: string;
    contact: string;
    shipping: string;
    returns: string;
    privacy: string;
    terms: string;
    copyright: string;
  };
  aboutUs: string;
  contact: string;
  terms: string;
  privacy: string;
  delivery: string;
  followUs: string;
  allRightsReserved: string;

  // Categories
  gpu: string;
  cpu: string;
  motherboard: string;
  ram: string;
  storage: string;
  cooling: string;
  cases: string;
  psu: string;

  // Peripherals Subcategories
  keyboards: string;
  mice: string;
  headsets: string;
  monitors: string;
  webcams: string;
  controllers: string;

  // Search
  searchResults: string;
  noResults: string;
  searchFor: string;

  // Misc
  loading: string;
  error: string;
}

export const translations: { en: TranslationType; bg: TranslationType } = {
  en: {
    // Utility Bar
    freeShippingBar: 'Free shipping over 150 BGN',

    // Navigation
    search: 'Search for products...',
    searchPlaceholder: 'Search products...',
    categories: 'Categories',
    deals: 'Deals',
    newArrivals: 'New Arrivals',
    brands: 'Brands',
    pcBuilder: 'PC Builder',
    gamingPCs: 'Gaming PCs',
    components: 'Components',
    peripherals: 'Peripherals',
    computers: 'Computers',
    support: 'Support',

    // User
    wishlist: 'Wishlist',
    login: 'Login',
    register: 'Register',
    myAccount: 'My Account',
    myOrders: 'My Orders',
    settings: 'Settings',
    logout: 'Logout',
    welcome: 'Welcome',

    // Sections
    trendingNow: 'TRENDING NOW',
    hotDeals: 'HOT DEALS',
    topCategories: 'SHOP BY CATEGORY',
    featuredBrands: 'FEATURED BRANDS',
    newProducts: 'NEW ARRIVALS',
    topSellers: 'Top Sellers',

    // Newsletter
    newsletter: 'SUBSCRIBE TO OUR NEWSLETTER',
    newsletterDesc: 'Get exclusive deals and be the first to know about new arrivals',
    subscribe: 'Subscribe',
    emailPlaceholder: 'Enter your email address',
    newsletterPlaceholder: 'Your email...',

    // Product
    addToCart: 'Add to Cart',
    add: 'Add',
    inStock: 'In Stock',
    outOfStock: 'Out of Stock',
    limited: 'Limited Stock',
    lastOne: 'Last one',
    viewAll: 'View All',
    viewProduct: 'View Product',
    seeAll: 'See all',

    // Cart
    cart: 'Cart',
    cartEmpty: 'Your cart is empty',
    total: 'Total',
    checkout: 'Checkout',
    continueShopping: 'Continue shopping',

    // Benefits
    freeShipping: 'Free Shipping',
    freeShippingText: 'On orders over 200 BGN',
    returns: '30-Day Returns',
    returnsText: 'Hassle-free returns',
    securePayment: 'Secure Payment',
    securePaymentText: '100% secure checkout',

    // Footer
    footer: {
      about: 'About Us',
      contact: 'Contact',
      shipping: 'Shipping Info',
      returns: 'Returns & Refunds',
      privacy: 'Privacy Policy',
      terms: 'Terms & Conditions',
      copyright: '© 2026 TechHub.bg. All rights reserved.',
    },
    aboutUs: 'About Us',
    contact: 'Contact',
    terms: 'Terms of Service',
    privacy: 'Privacy Policy',
    delivery: 'Delivery',
    followUs: 'Follow Us',
    allRightsReserved: 'All rights reserved',

    // Categories
    gpu: 'Graphics Cards',
    cpu: 'Processors',
    motherboard: 'Motherboards',
    ram: 'Memory',
    storage: 'Storage',
    cooling: 'Cooling',
    cases: 'Cases',
    psu: 'Power Supplies',

    // Peripherals Subcategories
    keyboards: 'Keyboards',
    mice: 'Mice',
    headsets: 'Headsets',
    monitors: 'Monitors',
    webcams: 'Webcams',
    controllers: 'Controllers',

    // Search
    searchResults: 'Search Results',
    noResults: 'No products found',
    searchFor: 'Search for',

    // Misc
    loading: 'Loading...',
    error: 'Error',
  },

  bg: {
    // Utility Bar
    freeShippingBar: 'Безплатна доставка над 150лв.',

    // Navigation
    search: 'Търсене на продукти...',
    searchPlaceholder: 'Търси продукти...',
    categories: 'Категории',
    deals: 'Промоции',
    newArrivals: 'Нови Продукти',
    brands: 'Марки',
    pcBuilder: 'PC Конфигуратор',
    gamingPCs: 'Gaming PC',
    components: 'Компоненти',
    peripherals: 'Периферия',
    computers: 'Компютри',
    support: 'Поддръжка',

    // User
    wishlist: 'Любими',
    login: 'Вход',
    register: 'Регистрация',
    myAccount: 'Моят Профил',
    myOrders: 'Моите Поръчки',
    settings: 'Настройки',
    logout: 'Изход',
    welcome: 'Здравей',

    // Sections
    trendingNow: 'АКТУАЛНИ ПРОДУКТИ',
    hotDeals: 'ГОРЕЩИ ОФЕРТИ',
    topCategories: 'РАЗГЛЕДАЙ ПО КАТЕГОРИЯ',
    featuredBrands: 'ВОДЕЩИ МАРКИ',
    newProducts: 'НОВИ ПРОДУКТИ',
    topSellers: 'Топ продажби',

    // Newsletter
    newsletter: 'АБОНИРАЙ СЕ ЗА БЮЛЕТИНА',
    newsletterDesc: 'Получи ексклузивни оферти и бъди първият, който научава за новите продукти',
    subscribe: 'Абонирай се',
    emailPlaceholder: 'Въведи имейл адрес',
    newsletterPlaceholder: 'Твоят имейл...',

    // Product
    addToCart: 'Добави',
    add: 'Добави',
    inStock: 'В наличност',
    outOfStock: 'Изчерпан',
    limited: 'Ограничено',
    lastOne: 'Последен',
    viewAll: 'Виж всички',
    viewProduct: 'Виж продукта',
    seeAll: 'Виж всички',

    // Cart
    cart: 'Количка',
    cartEmpty: 'Количката е празна',
    total: 'Общо',
    checkout: 'Поръчай',
    continueShopping: 'Продължи пазаруването',

    // Benefits
    freeShipping: 'Безплатна Доставка',
    freeShippingText: 'За поръчки над 200 лв',
    returns: '30 Дни за Връщане',
    returnsText: 'Лесно връщане',
    securePayment: 'Сигурно Плащане',
    securePaymentText: '100% защитено',

    // Footer
    footer: {
      about: 'За Нас',
      contact: 'Контакти',
      shipping: 'Доставка',
      returns: 'Връщане',
      privacy: 'Поверителност',
      terms: 'Условия за ползване',
      copyright: '© 2026 TechHub.bg. Всички права запазени.',
    },
    aboutUs: 'За нас',
    contact: 'Контакти',
    terms: 'Условия за ползване',
    privacy: 'Поверителност',
    delivery: 'Доставка',
    followUs: 'Последвай ни',
    allRightsReserved: 'Всички права запазени',

    // Categories
    gpu: 'Видеокарти',
    cpu: 'Процесори',
    motherboard: 'Дънни Платки',
    ram: 'Памет',
    storage: 'Съхранение',
    cooling: 'Охлаждане',
    cases: 'Кутии',
    psu: 'Захранвания',

    // Peripherals Subcategories
    keyboards: 'Клавиатури',
    mice: 'Мишки',
    headsets: 'Слушалки',
    monitors: 'Монитори',
    webcams: 'Уеб камери',
    controllers: 'Контролери',

    // Search
    searchResults: 'Резултати от търсенето',
    noResults: 'Няма намерени продукти',
    searchFor: 'Търсене за',

    // Misc
    loading: 'Зареждане...',
    error: 'Грешка',
  },
};

export type TranslationKey = keyof TranslationType;
export type Language = 'bg' | 'en';
export type Translations = TranslationType;
