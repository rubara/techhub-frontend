'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useUIStore } from '@/store';
import { useAuthStore } from '@/store';
import { colors } from '@/lib/colors';
import { getOrders, Order } from '@/lib/auth-api';
import { useProtectedRoute } from '@/hooks/use-protected-route';

export default function OrdersPage() {
  const { isDark, language } = useUIStore();
  const { token } = useAuthStore();
  const { isReady } = useProtectedRoute();

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!token) return;

      setLoading(true);
      const { data } = await getOrders(token);
      if (data) {
        setOrders(data);
      }
      setLoading(false);
    };

    if (isReady && token) {
      fetchOrders();
    }
  }, [token, isReady]);

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

  const getPaymentStatusLabel = (status: string) => {
    const labels: Record<string, { en: string; bg: string }> = {
      pending: { en: 'Pending', bg: 'Изчаква' },
      paid: { en: 'Paid', bg: 'Платена' },
      failed: { en: 'Failed', bg: 'Неуспешно' },
      refunded: { en: 'Refunded', bg: 'Възстановена' },
    };
    return labels[status]?.[language] || status;
  };

  if (!isReady) {
    return (
      <main className="max-w-4xl mx-auto px-4 py-12">
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-32 rounded-2xl"
              style={{ background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }}
            />
          ))}
        </div>
      </main>
    );
  }

  return (
    <main className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center gap-2 text-sm mb-6">
        <Link href="/account" style={{ color: colors.forestGreen }}>
          {language === 'bg' ? 'Акаунт' : 'Account'}
        </Link>
        <span style={{ color: isDark ? colors.gray : colors.midnightBlack }}>/</span>
        <span style={{ color: isDark ? colors.gray : colors.midnightBlack }}>
          {language === 'bg' ? 'Поръчки' : 'Orders'}
        </span>
      </div>

      <h1
        className="text-2xl font-bold mb-6"
        style={{ color: isDark ? colors.white : colors.midnightBlack }}
      >
        {language === 'bg' ? 'История на поръчките' : 'Order History'}
      </h1>

      {loading && (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-32 rounded-2xl animate-pulse"
              style={{ background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }}
            />
          ))}
        </div>
      )}

      {!loading && orders.length === 0 && (
        <div
          className="text-center py-16 rounded-2xl"
          style={{
            background: isDark ? 'rgba(255,255,255,0.03)' : colors.white,
            border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.1)',
          }}
        >
          <div className="text-5xl mb-4">📦</div>
          <h2
            className="text-xl font-bold mb-2"
            style={{ color: isDark ? colors.white : colors.midnightBlack }}
          >
            {language === 'bg' ? 'Нямате поръчки' : 'No orders yet'}
          </h2>
          <p className="mb-6" style={{ color: isDark ? colors.gray : colors.midnightBlack }}>
            {language === 'bg'
              ? 'Когато направите поръчка, тя ще се появи тук'
              : 'When you place an order, it will appear here'}
          </p>
          <Link
            href="/"
            className="inline-block px-6 py-3 rounded-xl font-semibold"
            style={{ background: colors.forestGreen, color: colors.white }}
          >
            {language === 'bg' ? 'Разгледай продуктите' : 'Browse products'}
          </Link>
        </div>
      )}

      {!loading && orders.length > 0 && (
        <div className="space-y-4">
          {orders.map((order) => {
            const statusStyle = getStatusColor(order.status);

            return (
              <div
                key={order.id}
                className="rounded-2xl overflow-hidden"
                style={{
                  background: isDark ? 'rgba(255,255,255,0.03)' : colors.white,
                  border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.1)',
                }}
              >
                <div
                  className="px-5 py-4 flex flex-wrap items-center justify-between gap-4 border-b"
                  style={{ borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' }}
                >
                  <div className="flex items-center gap-4">
                    <div>
                      <p
                        className="font-bold"
                        style={{ color: isDark ? colors.white : colors.midnightBlack }}
                      >
                        #{order.orderNumber}
                      </p>
                      <p className="text-sm" style={{ color: isDark ? colors.gray : colors.midnightBlack }}>
                        {new Date(order.createdAt).toLocaleDateString(
                          language === 'bg' ? 'bg-BG' : 'en-US',
                          {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          }
                        )}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span
                      className="px-3 py-1.5 rounded-full text-xs font-medium"
                      style={{ background: statusStyle.bg, color: statusStyle.color }}
                    >
                      {getStatusLabel(order.status)}
                    </span>
                  </div>
                </div>

                <div className="px-5 py-4">
                  <div className="flex flex-wrap gap-3 mb-4">
                    {order.items.slice(0, 4).map((item, index) => (
                      <div
                        key={index}
                        className="w-16 h-16 rounded-lg overflow-hidden"
                        style={{
                          background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
                        }}
                      >
                        {item.image ? (
                          <Image
                            src={item.image}
                            alt={item.name}
                            width={64}
                            height={64}
                            className="object-contain p-1"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-2xl">
                            📦
                          </div>
                        )}
                      </div>
                    ))}
                    {order.items.length > 4 && (
                      <div
                        className="w-16 h-16 rounded-lg flex items-center justify-center text-sm font-medium"
                        style={{
                          background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
                          color: isDark ? colors.gray : colors.midnightBlack,
                        }}
                      >
                        +{order.items.length - 4}
                      </div>
                    )}
                  </div>

                  <p className="text-sm" style={{ color: isDark ? colors.gray : colors.midnightBlack }}>
                    {order.items.length} {language === 'bg' ? 'продукта' : 'items'}
                  </p>
                </div>

                <div
                  className="px-5 py-4 flex flex-wrap items-center justify-between gap-4 border-t"
                  style={{
                    borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
                    background: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)',
                  }}
                >
                  <div className="flex items-center gap-4">
                    <div>
                      <p className="text-xs" style={{ color: isDark ? colors.gray : colors.midnightBlack }}>
                        {language === 'bg' ? 'Плащане' : 'Payment'}
                      </p>
                      <p
                        className="text-sm font-medium"
                        style={{
                          color:
                            order.paymentStatus === 'paid'
                              ? colors.forestGreen
                              : isDark
                              ? colors.white
                              : colors.midnightBlack,
                        }}
                      >
                        {getPaymentStatusLabel(order.paymentStatus)}
                      </p>
                    </div>
                    {order.invoice?.pdfFile && (
                      <a
                        href={order.invoice.pdfFile.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-sm font-medium"
                        style={{ color: colors.forestGreen }}
                      >
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                          <polyline points="14 2 14 8 20 8" />
                          <line x1="16" y1="13" x2="8" y2="13" />
                          <line x1="16" y1="17" x2="8" y2="17" />
                          <polyline points="10 9 9 9 8 9" />
                        </svg>
                        {language === 'bg' ? 'Фактура' : 'Invoice'}
                      </a>
                    )}
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-xs" style={{ color: isDark ? colors.gray : colors.midnightBlack }}>
                        {language === 'bg' ? 'Общо' : 'Total'}
                      </p>
                      <p className="text-lg font-bold" style={{ color: colors.forestGreen }}>
                        {order.totalAmount.toFixed(2)} лв.
                      </p>
                    </div>
                    <Link
                      href={`/account/orders/${order.documentId}`}
                      className="px-4 py-2 rounded-xl text-sm font-medium transition-colors"
                      style={{
                        background: colors.forestGreen,
                        color: colors.white,
                      }}
                    >
                      {language === 'bg' ? 'Детайли' : 'Details'}
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
}
