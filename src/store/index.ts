// TechHub.bg - Global Store (Zustand)

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product, Theme, Language } from '@/types';

// ============================================
// CART STORE
// ============================================

interface CartItem {
  product: Product;
  quantity: number;
}

interface CartStore {
  items: CartItem[];
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  getTotal: () => number;
  getItemCount: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      
      addItem: (product, quantity = 1) => {
        set((state) => {
          const existingItem = state.items.find(item => item.product.id === product.id);
          
          if (existingItem) {
            return {
              items: state.items.map(item =>
                item.product.id === product.id
                  ? { ...item, quantity: item.quantity + quantity }
                  : item
              ),
            };
          }
          
          return {
            items: [...state.items, { product, quantity }],
          };
        });
      },
      
      removeItem: (productId) => {
        set((state) => ({
          items: state.items.filter(item => item.product.id !== productId),
        }));
      },
      
      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId);
          return;
        }
        
        set((state) => ({
          items: state.items.map(item =>
            item.product.id === productId
              ? { ...item, quantity }
              : item
          ),
        }));
      },
      
      clearCart: () => set({ items: [] }),
      
      getTotal: () => {
        return get().items.reduce(
          (total, item) => total + item.product.price * item.quantity,
          0
        );
      },
      
      getItemCount: () => {
        return get().items.reduce((count, item) => count + item.quantity, 0);
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

interface WishlistStore {
  items: number[]; // Product IDs
  addItem: (productId: number) => void;
  removeItem: (productId: number) => void;
  toggleItem: (productId: number) => void;
  isInWishlist: (productId: number) => boolean;
  clearWishlist: () => void;
  getItemCount: () => number;
}

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],
      
      addItem: (productId) => {
        set((state) => {
          if (state.items.includes(productId)) return state;
          return { items: [...state.items, productId] };
        });
      },
      
      removeItem: (productId) => {
        set((state) => ({
          items: state.items.filter(id => id !== productId),
        }));
      },
      
      toggleItem: (productId) => {
        const { items, addItem, removeItem } = get();
        if (items.includes(productId)) {
          removeItem(productId);
        } else {
          addItem(productId);
        }
      },
      
      isInWishlist: (productId) => {
        return get().items.includes(productId);
      },
      
      clearWishlist: () => set({ items: [] }),
      
      getItemCount: () => get().items.length,
    }),
    {
      name: 'techhub-wishlist',
    }
  )
);

// ============================================
// UI STORE (Theme, Language, etc.)
// ============================================

import { translations } from '@/lib/translations';

interface UIStore {
  theme: Theme;
  language: Language;
  isDark: boolean;
  t: typeof translations.bg;
  isMenuOpen: boolean;
  isSearchOpen: boolean;
  isCartOpen: boolean;
  isUserMenuOpen: boolean;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  setLanguage: (language: Language) => void;
  toggleLanguage: () => void;
  setMenuOpen: (open: boolean) => void;
  setSearchOpen: (open: boolean) => void;
  setCartOpen: (open: boolean) => void;
  setUserMenuOpen: (open: boolean) => void;
}

export const useUIStore = create<UIStore>()(
  persist(
    (set, get) => ({
      theme: 'dark',
      language: 'bg',
      isDark: true,
      t: translations.bg,
      isMenuOpen: false,
      isSearchOpen: false,
      isCartOpen: false,
      isUserMenuOpen: false,
      
      setTheme: (theme) => set({ 
        theme,
        isDark: theme === 'dark',
      }),
      
      toggleTheme: () => {
        set((state) => ({
          theme: state.theme === 'dark' ? 'light' : 'dark',
          isDark: state.theme !== 'dark',
        }));
      },
      
      setLanguage: (language) => set({ 
        language,
        t: translations[language],
      }),
      
      toggleLanguage: () => {
        set((state) => {
          const newLang = state.language === 'bg' ? 'en' : 'bg';
          return {
            language: newLang,
            t: translations[newLang],
          };
        });
      },
      
      setMenuOpen: (isMenuOpen) => set({ isMenuOpen }),
      
      setSearchOpen: (isSearchOpen) => set({ isSearchOpen }),
      
      setCartOpen: (isCartOpen) => set({ isCartOpen }),
      
      setUserMenuOpen: (isUserMenuOpen) => set({ isUserMenuOpen }),
    }),
    {
      name: 'techhub-ui',
      partialize: (state) => ({ theme: state.theme, language: state.language }),
      onRehydrateStorage: () => (state) => {
        // After rehydration, update derived state
        if (state) {
          state.isDark = state.theme === 'dark';
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
}

interface AuthStore {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  login: (user: User, token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isLoading: false,
      
      setUser: (user) => set({ user }),
      
      setToken: (token) => set({ token }),
      
      login: (user, token) => set({ user, token }),
      
      logout: () => set({ user: null, token: null }),
    }),
    {
      name: 'techhub-auth',
    }
  )
);
