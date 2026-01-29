'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// ============================================
// TRANSLATIONS
// ============================================

const translations = {
  en: {
    search: 'Search',
    searchPlaceholder: 'Search products...',
    cart: 'Cart',
    wishlist: 'Wishlist',
    account: 'Account',
    login: 'Login',
    register: 'Register',
    logout: 'Logout',
    profile: 'Profile',
    orders: 'Orders',
    myOrders: 'My Orders',
    home: 'Home',
    products: 'Products',
    categories: 'Categories',
    deals: 'Deals',
    newArrivals: 'New Arrivals',
    bestSellers: 'Best Sellers',
    pcBuilder: 'PC Builder',
    addToCart: 'Add to Cart',
    buyNow: 'Buy Now',
    outOfStock: 'Out of Stock',
    inStock: 'In Stock',
    freeShipping: 'Free Shipping',
    freeShippingBar: 'Free shipping on orders over 100 лв.',
    freeShippingText: 'On orders over 100 лв.',
    warranty: 'Warranty',
    support: '24/7 Support',
    securePayment: 'Secure Payment',
    securePaymentText: '100% secure checkout',
    returns: 'Easy Returns',
    returnsText: '30 days return policy',
    welcome: 'Welcome',
    myAccount: 'My Account',
    viewProfile: 'View Profile',
    settings: 'Settings',
    help: 'Help',
    contactUs: 'Contact Us',
    aboutUs: 'About Us',
    privacyPolicy: 'Privacy Policy',
    termsOfService: 'Terms of Service',
    allCategories: 'All Categories',
    topCategories: 'Top Categories',
    featuredBrands: 'Featured Brands',
    viewAll: 'View All',
    noResults: 'No results found',
    loading: 'Loading...',
    error: 'Error',
    success: 'Success',
    confirm: 'Confirm',
    cancel: 'Cancel',
    save: 'Save',
    edit: 'Edit',
    delete: 'Delete',
    remove: 'Remove',
    add: 'Add',
    update: 'Update',
    close: 'Close',
    back: 'Back',
    next: 'Next',
    previous: 'Previous',
    submit: 'Submit',
    clear: 'Clear',
    filter: 'Filter',
    sort: 'Sort',
    price: 'Price',
    quantity: 'Quantity',
    total: 'Total',
    subtotal: 'Subtotal',
    shipping: 'Shipping',
    tax: 'Tax',
    discount: 'Discount',
    checkout: 'Checkout',
    continueShopping: 'Continue Shopping',
    emptyCart: 'Your cart is empty',
    emptyWishlist: 'Your wishlist is empty',
    itemsInCart: 'items in cart',
    orderHistory: 'Order History',
    orderDetails: 'Order Details',
    orderNumber: 'Order Number',
    orderDate: 'Order Date',
    orderStatus: 'Order Status',
    paymentMethod: 'Payment Method',
    shippingAddress: 'Shipping Address',
    billingAddress: 'Billing Address',
    newsletter: 'Newsletter',
    newsletterDesc: 'Subscribe to get updates on new products and offers',
    subscribe: 'Subscribe',
    emailPlaceholder: 'Enter your email',
    limited: 'Limited',
  },
  bg: {
    search: 'Търсене',
    searchPlaceholder: 'Търси продукти...',
    cart: 'Количка',
    wishlist: 'Любими',
    account: 'Акаунт',
    login: 'Вход',
    register: 'Регистрация',
    logout: 'Изход',
    profile: 'Профил',
    orders: 'Поръчки',
    myOrders: 'Моите поръчки',
    home: 'Начало',
    products: 'Продукти',
    categories: 'Категории',
    deals: 'Промоции',
    newArrivals: 'Нови продукти',
    bestSellers: 'Най-продавани',
    pcBuilder: 'Сглоби компютър',
    addToCart: 'Добави в количката',
    buyNow: 'Купи сега',
    outOfStock: 'Изчерпан',
    inStock: 'В наличност',
    freeShipping: 'Безплатна доставка',
    freeShippingBar: 'Безплатна доставка за поръчки над 100 лв.',
    freeShippingText: 'За поръчки над 100 лв.',
    warranty: 'Гаранция',
    support: '24/7 Поддръжка',
    securePayment: 'Сигурно плащане',
    securePaymentText: '100% сигурно плащане',
    returns: 'Лесно връщане',
    returnsText: '30 дни право на връщане',
    welcome: 'Здравей',
    myAccount: 'Моят акаунт',
    viewProfile: 'Виж профила',
    settings: 'Настройки',
    help: 'Помощ',
    contactUs: 'Свържете се с нас',
    aboutUs: 'За нас',
    privacyPolicy: 'Политика за поверителност',
    termsOfService: 'Общи условия',
    allCategories: 'Всички категории',
    topCategories: 'Топ категории',
    featuredBrands: 'Водещи марки',
    viewAll: 'Виж всички',
    noResults: 'Няма намерени резултати',
    loading: 'Зареждане...',
    error: 'Грешка',
    success: 'Успех',
    confirm: 'Потвърди',
    cancel: 'Отказ',
    save: 'Запази',
    edit: 'Редактирай',
    delete: 'Изтрий',
    remove: 'Премахни',
    add: 'Добави',
    update: 'Обнови',
    close: 'Затвори',
    back: 'Назад',
    next: 'Напред',
    previous: 'Предишен',
    submit: 'Изпрати',
    clear: 'Изчисти',
    filter: 'Филтър',
    sort: 'Сортирай',
    price: 'Цена',
    quantity: 'Количество',
    total: 'Общо',
    subtotal: 'Междинна сума',
    shipping: 'Доставка',
    tax: 'ДДС',
    discount: 'Отстъпка',
    checkout: 'Плащане',
    continueShopping: 'Продължи пазаруването',
    emptyCart: 'Количката е празна',
    emptyWishlist: 'Списъкът с любими е празен',
    itemsInCart: 'продукта в количката',
    orderHistory: 'История на поръчките',
    orderDetails: 'Детайли на поръчката',
    orderNumber: 'Номер на поръчка',
    orderDate: 'Дата на поръчка',
    orderStatus: 'Статус на поръчка',
    paymentMethod: 'Метод на плащане',
    shippingAddress: 'Адрес за доставка',
    billingAddress: 'Адрес за фактуриране',
    newsletter: 'Бюлетин',
    newsletterDesc: 'Абонирайте се за новини и оферти',
    subscribe: 'Абонирай се',
    emailPlaceholder: 'Въведете имейл',
    limited: 'Ограничено',
  },
};

// ============================================
// UI STORE
// ============================================

type Language = 'en' | 'bg';
type Translations = typeof translations.en;

interface UIStore {
  isDark: boolean;
  theme: 'dark' | 'light';
  language: Language;
  t: Translations;
  isUserMenuOpen: boolean;
  isMobileMenuOpen: boolean;
  isSearchOpen: boolean;
  
  // Actions
  toggleTheme: () => void;
  setTheme: (theme: 'dark' | 'light') => void;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  setUserMenuOpen: (open: boolean) => void;
  setMobileMenuOpen: (open: boolean) => void;
  setSearchOpen: (open: boolean) => void;
}

export const useUIStore = create<UIStore>()(
  persist(
    (set, get) => ({
      isDark: true,
      theme: 'dark',
      language: 'bg',
      t: translations.bg,
      isUserMenuOpen: false,
      isMobileMenuOpen: false,
      isSearchOpen: false,

      toggleTheme: () =>
        set((state) => ({
          isDark: !state.isDark,
          theme: state.isDark ? 'light' : 'dark',
        })),

      setTheme: (theme) =>
        set({
          theme,
          isDark: theme === 'dark',
        }),

      setLanguage: (lang) =>
        set({
          language: lang,
          t: translations[lang],
        }),

      toggleLanguage: () =>
        set((state) => {
          const newLang = state.language === 'bg' ? 'en' : 'bg';
          return {
            language: newLang,
            t: translations[newLang],
          };
        }),

      setUserMenuOpen: (open) => set({ isUserMenuOpen: open }),
      setMobileMenuOpen: (open) => set({ isMobileMenuOpen: open }),
      setSearchOpen: (open) => set({ isSearchOpen: open }),
    }),
    {
      name: 'techhub-ui',
      partialize: (state) => ({
        isDark: state.isDark,
        theme: state.theme,
        language: state.language,
      }),
      onRehydrateStorage: () => (state) => {
        // Update translations after rehydration
        if (state) {
          state.t = translations[state.language];
        }
      },
    }
  )
);

// ============================================
// AUTH STORE
// ============================================

interface User {
  id: number;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  address?: string;
  city?: string;
  postalCode?: string;
  createdAt?: string;
}

interface AuthStore {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;

  // Actions
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  setAuth: (user: User, token: string) => void;
  login: (user: User, token: string) => void;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isLoading: false,
      isAuthenticated: false,

      setUser: (user) => set({ user, isAuthenticated: !!user }),
      setToken: (token) => set({ token }),
      setAuth: (user, token) => set({ user, token, isAuthenticated: true }),
      login: (user, token) => set({ user, token, isAuthenticated: true }),
      logout: () => set({ user: null, token: null, isAuthenticated: false }),
      updateUser: (userData) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...userData } : null,
        })),
      setLoading: (loading) => set({ isLoading: loading }),
    }),
    {
      name: 'techhub-auth',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

// ============================================
// CART STORE
// ============================================

interface CartItem {
  id: number;
  name: string;
  nameBg?: string;
  slug: string;
  price: number;
  quantity: number;
  image?: any; // Flexible to accept Strapi image format
  stock?: number;
}

interface CartStore {
  items: CartItem[];

  // Computed
  totalItems: number;
  totalPrice: number;

  // Actions
  addItem: (product: any, quantity?: number) => void;
  removeItem: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  isInCart: (productId: number) => boolean;
  getItemQuantity: (productId: number) => number;
  getItemCount: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      // Computed: Total number of items
      get totalItems() {
        return get().items.reduce((sum, item) => sum + item.quantity, 0);
      },

      // Computed: Total price
      get totalPrice() {
        return get().items.reduce((sum, item) => sum + item.price * item.quantity, 0);
      },

      // Add item to cart
      addItem: (product: any, quantity = 1) =>
        set((state) => {
          const existingItem = state.items.find((item) => item.id === product.id);

          if (existingItem) {
            return {
              items: state.items.map((item) =>
                item.id === product.id
                  ? { ...item, quantity: item.quantity + quantity }
                  : item
              ),
            };
          }

          return {
            items: [...state.items, { ...product, quantity }],
          };
        }),

      // Remove item from cart
      removeItem: (productId) =>
        set((state) => ({
          items: state.items.filter((item) => item.id !== productId),
        })),

      // Update item quantity
      updateQuantity: (productId, quantity) =>
        set((state) => {
          if (quantity <= 0) {
            return {
              items: state.items.filter((item) => item.id !== productId),
            };
          }

          return {
            items: state.items.map((item) =>
              item.id === productId ? { ...item, quantity } : item
            ),
          };
        }),

      // Clear entire cart
      clearCart: () => set({ items: [] }),

      // Check if product is in cart
      isInCart: (productId) => {
        return get().items.some((item) => item.id === productId);
      },

      // Get quantity of specific item
      getItemQuantity: (productId) => {
        const item = get().items.find((item) => item.id === productId);
        return item?.quantity || 0;
      },

      // Get total item count
      getItemCount: () => {
        return get().items.reduce((sum, item) => sum + item.quantity, 0);
      },
    }),
    {
      name: 'techhub-cart',
    }
  )
);

// ============================================
// WISHLIST STORE
// ============================================

interface WishlistItem {
  id: number;
  name: string;
  nameBg?: string;
  slug: string;
  price: number;
  originalPrice?: number;
  image?: any; // Flexible to accept Strapi image format
}

interface WishlistStore {
  items: WishlistItem[];

  // Actions
  addItem: (product: any) => void;
  removeItem: (productId: number) => void;
  clearWishlist: () => void;
  isInWishlist: (productId: number) => boolean;
  toggleWishlist: (product: any) => void;
  toggleItem: (product: any) => void;
  getItemCount: () => number;
}

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],

      // Add item to wishlist
      addItem: (product: any) =>
        set((state) => {
          if (state.items.some((item) => item.id === product.id)) {
            return state;
          }
          return {
            items: [...state.items, product],
          };
        }),

      // Remove item from wishlist
      removeItem: (productId) =>
        set((state) => ({
          items: state.items.filter((item) => item.id !== productId),
        })),

      // Clear entire wishlist
      clearWishlist: () => set({ items: [] }),

      // Check if product is in wishlist
      isInWishlist: (productId) => {
        return get().items.some((item) => item.id === productId);
      },

      // Toggle item in wishlist
      toggleWishlist: (product: any) =>
        set((state) => {
          const exists = state.items.some((item) => item.id === product.id);
          if (exists) {
            return {
              items: state.items.filter((item) => item.id !== product.id),
            };
          }
          return {
            items: [...state.items, product],
          };
        }),

      // Alias for toggleWishlist
      toggleItem: (product: any) =>
        set((state) => {
          const exists = state.items.some((item) => item.id === product.id);
          if (exists) {
            return {
              items: state.items.filter((item) => item.id !== product.id),
            };
          }
          return {
            items: [...state.items, product],
          };
        }),

      // Get total item count
      getItemCount: () => {
        return get().items.length;
      },
    }),
    {
      name: 'techhub-wishlist',
    }
  )
);
