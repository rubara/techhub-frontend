'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useUIStore, useAuthStore } from '@/store';
import { colors } from '@/lib/colors';
import { getOrders, getMe, Order } from '@/lib/auth-api';
import { useProtectedRoute } from '@/hooks/use-protected-route';

export default function AccountPage() {
  const router = useRouter();
  const { isDark, language } = useUIStore();
  const { user, token, logout, updateUser } = useAuthStore();
  const { isReady } = useProtectedRoute();

  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  // Fetch current user data to ensure we have latest fields
  useEffect(() => {
    const fetchUserData = async () => {
      if (!token) return;

      const { data } = await getMe(token);
      if (data) {
        updateUser(data);
      }
    };

    if (isReady && token) {
      fetchUserData();
    }
  }, [token, isReady, updateUser]);

  // Fetch recent orders
  useEffect(() => {
    const fetchOrders = async () => {
      if (!token) return;

      setLoadingOrders(true);
      const { data } = await getOrders(token);
      if (data) {
        setRecentOrders(data.slice(0, 3));
      }
      setLoadingOrders(false);
    };

    if (isReady && token) {
      fetchOrders();
    }
  }, [token, isReady]);

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  // Get display name
  const getDisplayName = () => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName} ${user.lastName}`;
    }
    if (user?.firstName) {
      return user.firstName;
    }
    if (user?.username && user?.username !== user?.email) {
      return user.username;
    }
    return user?.email?.split('@')[0] || 'User';
  };

  // Status badge colors
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return { bg: 'rgba(251,191,36,0.1)', color: '#f59e0b' };
      case 'processing':
        return { bg: 'rgba(59,130,246,0.1)', color: '#3b82f6' };
      case 'shipped':
        return { bg: 'rgba(168,85,247,0.1)', color: '#a855f7' };
      case 'delivered':
        return { bg: 'rgba(34,197,94,0.1)', color: colors.forestGreen };
      case 'cancelled':
        return { bg: 'rgba(239,68,68,0.1)', color: '#ef4444' };
      default:
        return { bg: 'rgba(156,163,175,0.1)', color: '#6b7280' };
    }
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, { en: string; bg: string }> = {
      pending: { en: 'Pending', bg: 'Изчаква' },
      processing: { en: 'Processing', bg: 'Обработва се' },
      shipped: { en: 'Shipped', bg: 'Изпратена' },
      delivered: { en: 'Delivered', bg: 'Доставена' },
      cancelled: { en: 'Cancelled', bg: 'Отказана' },
    };
    return labels[status]?.[language] || status;
  };

  if (!isReady || !user) {
    return (
      <main className="max-w-4xl mx-auto px-4 py-12">
        <div className="animate-pulse space-y-6">
          <div
            className="h-32 rounded-2xl"
            style={{ background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }}
          />
          <div
            className="h-64 rounded-2xl"
            style={{ background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }}
          />
        </div>
      </main>
    );
  }

  return (
    <main className="max-w-4xl mx-auto px-4 py-8">
      {/* Welcome Header */}
      <div
        className="p-6 rounded-2xl mb-6"
        style={{
          background: isDark
            ? 'linear-gradient(135deg, rgba(34,197,94,0.1) 0%, rgba(34,197,94,0.05) 100%)'
            : 'linear-gradient(135deg, rgba(34,197,94,0.1) 0%, rgba(34,197,94,0.02) 100%)',
          border: `1px solid ${colors.forestGreen}20`,
        }}
      >
        <h1
          className="text-2xl font-bold mb-2"
          style={{ color: isDark ? colors.white : colors.midnightBlack }}
        >
          {language === 'bg' ? 'Здравей' : 'Welcome'}, {getDisplayName()}! 👋
        </h1>
        <p style={{ color: isDark ? colors.gray : colors.midnightBlack }}>
          {language === 'bg'
            ? 'Управлявай своя акаунт, поръчки и настройки'
            : 'Manage your account, orders, and settings'}
        </p>
      </div>

      {/* Quick Actions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {/* Orders */}
        <Link
          href="/account/orders"
          className="p-5 rounded-xl transition-all hover:scale-[1.02]"
          style={{
            background: isDark ? 'rgba(255,255,255,0.03)' : colors.white,
            border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.1)',
          }}
        >
          <div className="flex items-center gap-4">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center"
              style={{ background: 'rgba(34,197,94,0.1)' }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={colors.forestGreen} strokeWidth="2">
                <rect x="2" y="4" width="20" height="16" rx="2" />
                <path d="M2 10h20" />
                <path d="M12 4v6" />
              </svg>
            </div>
            <div>
              <h3
                className="font-semibold"
                style={{ color: isDark ? colors.white : colors.midnightBlack }}
              >
                {language === 'bg' ? 'Поръчки' : 'Orders'}
              </h3>
              <p className="text-sm" style={{ color: isDark ? colors.gray : colors.midnightBlack }}>
                {language === 'bg' ? 'Виж историята' : 'View history'}
              </p>
            </div>
          </div>
        </Link>

        {/* Profile */}
        <Link
          href="/account/profile"
          className="p-5 rounded-xl transition-all hover:scale-[1.02]"
          style={{
            background: isDark ? 'rgba(255,255,255,0.03)' : colors.white,
            border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.1)',
          }}
        >
          <div className="flex items-center gap-4">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center"
              style={{ background: 'rgba(59,130,246,0.1)' }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2">
                <circle cx="12" cy="8" r="4" />
                <path d="M4 20c0-4 4-6 8-6s8 2 8 6" />
              </svg>
            </div>
            <div>
              <h3
                className="font-semibold"
                style={{ color: isDark ? colors.white : colors.midnightBlack }}
              >
                {language === 'bg' ? 'Профил' : 'Profile'}
              </h3>
              <p className="text-sm" style={{ color: isDark ? colors.gray : colors.midnightBlack }}>
                {language === 'bg' ? 'Редактирай данни' : 'Edit details'}
              </p>
            </div>
          </div>
        </Link>

        {/* Wishlist */}
        <Link
          href="/wishlist"
          className="p-5 rounded-xl transition-all hover:scale-[1.02]"
          style={{
            background: isDark ? 'rgba(255,255,255,0.03)' : colors.white,
            border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.1)',
          }}
        >
          <div className="flex items-center gap-4">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center"
              style={{ background: 'rgba(239,68,68,0.1)' }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
            </div>
            <div>
              <h3
                className="font-semibold"
                style={{ color: isDark ? colors.white : colors.midnightBlack }}
              >
                {language === 'bg' ? 'Любими' : 'Wishlist'}
              </h3>
              <p className="text-sm" style={{ color: isDark ? colors.gray : colors.midnightBlack }}>
                {language === 'bg' ? 'Запазени продукти' : 'Saved products'}
              </p>
            </div>
          </div>
        </Link>
      </div>

      {/* Account Info */}
      <div
        className="p-6 rounded-2xl mb-6"
        style={{
          background: isDark ? 'rgba(255,255,255,0.03)' : colors.white,
          border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.1)',
        }}
      >
        <div className="flex items-center justify-between mb-4">
          <h2
            className="font-bold"
            style={{ color: isDark ? colors.white : colors.midnightBlack }}
          >
            {language === 'bg' ? 'Информация за акаунта' : 'Account Information'}
          </h2>
          <Link
            href="/account/profile"
            className="text-sm font-medium"
            style={{ color: colors.forestGreen }}
          >
            {language === 'bg' ? 'Редактирай' : 'Edit'} →
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Name */}
          <div>
            <p className="text-sm" style={{ color: isDark ? colors.gray : colors.midnightBlack }}>
              {language === 'bg' ? 'Име' : 'Name'}
            </p>
            <p
              className="font-medium"
              style={{ color: isDark ? colors.white : colors.midnightBlack }}
            >
              {user.firstName && user.lastName
                ? `${user.firstName} ${user.lastName}`
                : language === 'bg' ? 'Не е посочено' : 'Not specified'}
            </p>
          </div>

          {/* Email */}
          <div>
            <p className="text-sm" style={{ color: isDark ? colors.gray : colors.midnightBlack }}>
              {language === 'bg' ? 'Имейл' : 'Email'}
            </p>
            <p
              className="font-medium"
              style={{ color: isDark ? colors.white : colors.midnightBlack }}
            >
              {user.email}
            </p>
          </div>

          {/* Phone */}
          <div>
            <p className="text-sm" style={{ color: isDark ? colors.gray : colors.midnightBlack }}>
              {language === 'bg' ? 'Телефон' : 'Phone'}
            </p>
            <p
              className="font-medium"
              style={{ color: isDark ? colors.white : colors.midnightBlack }}
            >
              {user.phone || (language === 'bg' ? 'Не е посочен' : 'Not specified')}
            </p>
          </div>

          {/* Address */}
          <div>
            <p className="text-sm" style={{ color: isDark ? colors.gray : colors.midnightBlack }}>
              {language === 'bg' ? 'Адрес' : 'Address'}
            </p>
            <p
              className="font-medium"
              style={{ color: isDark ? colors.white : colors.midnightBlack }}
            >
              {user.address
                ? `${user.address}${user.city ? `, ${user.city}` : ''}${user.postalCode ? ` ${user.postalCode}` : ''}`
                : language === 'bg' ? 'Не е посочен' : 'Not specified'}
            </p>
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div
        className="p-6 rounded-2xl mb-6"
        style={{
          background: isDark ? 'rgba(255,255,255,0.03)' : colors.white,
          border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.1)',
        }}
      >
        <div className="flex items-center justify-between mb-4">
          <h2
            className="font-bold"
            style={{ color: isDark ? colors.white : colors.midnightBlack }}
          >
            {language === 'bg' ? 'Последни поръчки' : 'Recent Orders'}
          </h2>
          <Link
            href="/account/orders"
            className="text-sm font-medium"
            style={{ color: colors.forestGreen }}
          >
            {language === 'bg' ? 'Виж всички' : 'View all'} →
          </Link>
        </div>

        {loadingOrders ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-16 rounded-xl animate-pulse"
                style={{ background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }}
              />
            ))}
          </div>
        ) : recentOrders.length === 0 ? (
          <div className="text-center py-8">
            <p style={{ color: isDark ? colors.gray : colors.midnightBlack }}>
              {language === 'bg' ? 'Нямате поръчки все още' : 'No orders yet'}
            </p>
            <Link
              href="/"
              className="inline-block mt-4 px-6 py-2 rounded-xl font-medium"
              style={{ background: colors.forestGreen, color: colors.white }}
            >
              {language === 'bg' ? 'Разгледай продуктите' : 'Browse products'}
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {recentOrders.map((order) => {
              const statusStyle = getStatusColor(order.status);
              return (
                <Link
                  key={order.id}
                  href={`/account/orders/${order.documentId}`}
                  className="flex items-center justify-between p-4 rounded-xl transition-colors"
                  style={{
                    background: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)',
                  }}
                >
                  <div>
                    <p
                      className="font-medium"
                      style={{ color: isDark ? colors.white : colors.midnightBlack }}
                    >
                      #{order.orderNumber}
                    </p>
                    <p className="text-sm" style={{ color: isDark ? colors.gray : colors.midnightBlack }}>
                      {new Date(order.createdAt).toLocaleDateString(language === 'bg' ? 'bg-BG' : 'en-US')}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span
                      className="px-3 py-1 rounded-full text-xs font-medium"
                      style={{ background: statusStyle.bg, color: statusStyle.color }}
                    >
                      {getStatusLabel(order.status)}
                    </span>
                    <span
                      className="font-semibold"
                      style={{ color: colors.forestGreen }}
                    >
                      {order.totalAmount.toFixed(2)} лв.
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>

      {/* Logout Button */}
      <button
        onClick={handleLogout}
        className="w-full py-3 rounded-xl font-medium transition-colors"
        style={{
          background: isDark ? 'rgba(239,68,68,0.1)' : 'rgba(239,68,68,0.05)',
          color: '#ef4444',
          border: '1px solid rgba(239,68,68,0.2)',
        }}
      >
        {language === 'bg' ? 'Изход от профила' : 'Log Out'}
      </button>
    </main>
  );
}
