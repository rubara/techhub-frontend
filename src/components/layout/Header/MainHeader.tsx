'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useUIStore, useCartStore, useWishlistStore, useAuthStore } from '@/store';
import { Logo, SearchBar, HeartIcon, CartIcon, UserIcon, LogoutIcon, OrdersIcon } from '@/components/ui';
import { colors } from '@/lib/colors';

export const MainHeader = () => {
  const { isDark, t, isUserMenuOpen, setUserMenuOpen } = useUIStore();
  const cartCount = useCartStore((state) => state.getItemCount());
  const wishlistCount = useWishlistStore((state) => state.getItemCount());
  const { user, logout } = useAuthStore();
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [setUserMenuOpen]);

  const iconColor = isDark ? colors.white : colors.midnightBlack;

  return (
    <div
      style={{
        borderBottom: isDark ? '1px solid rgba(255,255,255,0.05)' : '1px solid rgba(0,0,0,0.05)',
      }}
    >
      <div
        className="mx-auto flex items-center justify-between gap-8"
        style={{
          maxWidth: '1400px',
          padding: '16px 24px',
        }}
      >
        {/* Logo */}
        <Logo isDark={isDark} width={170} />

        {/* Search Bar */}
        <div className="flex-1 max-w-xl">
          <SearchBar />
        </div>

        {/* Icons */}
        <div className="flex items-center gap-2">
          {/* Wishlist */}
          <Link
            href="/wishlist"
            className="relative p-3 rounded-full transition-all duration-200 hover:scale-110"
            style={{
              background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
            }}
          >
            <HeartIcon size={22} color={iconColor} />
            {wishlistCount > 0 && (
              <span
                className="absolute -top-1 -right-1 flex items-center justify-center text-white text-xs font-bold rounded-full"
                style={{
                  width: '18px',
                  height: '18px',
                  fontSize: '10px',
                  background: colors.pink,
                }}
              >
                {wishlistCount > 9 ? '9+' : wishlistCount}
              </span>
            )}
          </Link>

          {/* Cart */}
          <Link
            href="/cart"
            className="relative p-3 rounded-full transition-all duration-200 hover:scale-110"
            style={{
              background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
            }}
          >
            <CartIcon size={22} color={iconColor} />
            {cartCount > 0 && (
              <span
                className="absolute -top-1 -right-1 flex items-center justify-center text-white text-xs font-bold rounded-full"
                style={{
                  width: '18px',
                  height: '18px',
                  fontSize: '10px',
                  background: colors.forestGreen,
                }}
              >
                {cartCount > 9 ? '9+' : cartCount}
              </span>
            )}
          </Link>

          {/* User Menu */}
          <div className="relative" ref={userMenuRef}>
            <button
              onClick={() => setUserMenuOpen(!isUserMenuOpen)}
              className="p-3 rounded-full transition-all duration-200 hover:scale-110"
              style={{
                background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
              }}
            >
              <UserIcon size={22} color={iconColor} />
            </button>

            {/* User Dropdown */}
            {isUserMenuOpen && (
              <div
                className="absolute right-0 top-full mt-2 rounded-xl shadow-xl z-50 overflow-hidden"
                style={{
                  width: '220px',
                  background: isDark ? colors.midnightBlack : colors.white,
                  border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid #eee',
                }}
              >
                {user ? (
                  <>
                    {/* Logged in user */}
                    <div
                      className="p-4"
                      style={{
                        borderBottom: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid #eee',
                      }}
                    >
                      <p
                        className="font-semibold"
                        style={{ color: isDark ? colors.white : colors.midnightBlack }}
                      >
                        {t.welcome}, {user.firstName || user.username}
                      </p>
                      <p
                        className="text-sm truncate"
                        style={{ color: isDark ? 'rgba(255,255,255,0.5)' : colors.gray }}
                      >
                        {user.email}
                      </p>
                    </div>

                    <div className="p-2">
                      <Link
                        href="/account"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-3 px-3 py-2 rounded-lg transition-colors"
                        style={{
                          color: isDark ? colors.white : colors.midnightBlack,
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = isDark
                            ? 'rgba(255,255,255,0.05)'
                            : 'rgba(0,0,0,0.03)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = 'transparent';
                        }}
                      >
                        <UserIcon size={16} />
                        <span>{t.myAccount}</span>
                      </Link>

                      <Link
                        href="/account/orders"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-3 px-3 py-2 rounded-lg transition-colors"
                        style={{
                          color: isDark ? colors.white : colors.midnightBlack,
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = isDark
                            ? 'rgba(255,255,255,0.05)'
                            : 'rgba(0,0,0,0.03)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = 'transparent';
                        }}
                      >
                        <OrdersIcon size={16} />
                        <span>{t.myOrders}</span>
                      </Link>

                      <button
                        onClick={() => {
                          logout();
                          setUserMenuOpen(false);
                        }}
                        className="w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors"
                        style={{
                          color: colors.pink,
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = isDark
                            ? 'rgba(255,255,255,0.05)'
                            : 'rgba(0,0,0,0.03)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = 'transparent';
                        }}
                      >
                        <LogoutIcon size={16} />
                        <span>{t.logout}</span>
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    {/* Guest user */}
                    <div className="p-4">
                      <Link
                        href="/login"
                        onClick={() => setUserMenuOpen(false)}
                        className="block w-full py-3 text-center rounded-lg font-semibold transition-opacity hover:opacity-90"
                        style={{
                          background: colors.forestGreen,
                          color: colors.white,
                          marginBottom: '8px',
                        }}
                      >
                        {t.login}
                      </Link>
                      <Link
                        href="/register"
                        onClick={() => setUserMenuOpen(false)}
                        className="block w-full py-3 text-center rounded-lg font-semibold transition-opacity hover:opacity-90"
                        style={{
                          background: 'transparent',
                          color: isDark ? colors.white : colors.midnightBlack,
                          border: isDark ? '1px solid rgba(255,255,255,0.2)' : '1px solid #ddd',
                        }}
                      >
                        {t.register}
                      </Link>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainHeader;
