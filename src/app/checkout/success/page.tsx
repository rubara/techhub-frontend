'use client';

import { Suspense, useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useUIStore, useAuthStore } from '@/store';
import { colors } from '@/lib/colors';

function CheckoutSuccessContent() {
  const searchParams = useSearchParams();
  const { isDark, language } = useUIStore();
  const { isAuthenticated } = useAuthStore();

  const orderNumber = searchParams.get('order');

  return (
    <main className="max-w-2xl mx-auto px-4 py-12">
      {/* Success Animation */}
      <div className="text-center mb-8">
        <div
          className="w-24 h-24 mx-auto mb-6 rounded-full flex items-center justify-center animate-bounce"
          style={{ background: 'rgba(34,197,94,0.1)' }}
        >
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke={colors.forestGreen} strokeWidth="3">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>

        <h1
          className="text-3xl font-bold mb-2"
          style={{ color: isDark ? colors.white : colors.midnightBlack }}
        >
          {language === 'bg' ? 'Благодарим ви!' : 'Thank You!'}
        </h1>
        <p
          className="text-lg"
          style={{ color: isDark ? colors.gray : colors.midnightBlack }}
        >
          {language === 'bg'
            ? 'Вашата поръчка е приета успешно'
            : 'Your order has been placed successfully'}
        </p>
      </div>

      {/* Order Info Card */}
      <div
        className="p-6 rounded-2xl mb-6"
        style={{
          background: isDark ? 'rgba(255,255,255,0.03)' : colors.white,
          border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.1)',
        }}
      >
        {orderNumber && (
          <div className="text-center mb-6 pb-6 border-b" style={{ borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' }}>
            <p className="text-sm mb-1" style={{ color: isDark ? colors.gray : colors.midnightBlack }}>
              {language === 'bg' ? 'Номер на поръчка' : 'Order Number'}
            </p>
            <p
              className="text-2xl font-bold font-mono"
              style={{ color: colors.forestGreen }}
            >
              {orderNumber}
            </p>
          </div>
        )}

        <div className="space-y-4">
          {/* Email Confirmation */}
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(59,130,246,0.1)' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
            </div>
            <div>
              <p className="font-medium" style={{ color: isDark ? colors.white : colors.midnightBlack }}>
                {language === 'bg' ? 'Потвърждение по имейл' : 'Email Confirmation'}
              </p>
              <p className="text-sm" style={{ color: isDark ? colors.gray : colors.midnightBlack }}>
                {language === 'bg'
                  ? 'Ще получите имейл с детайли за поръчката'
                  : 'You will receive an email with order details'}
              </p>
            </div>
          </div>

          {/* Shipping */}
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(168,85,247,0.1)' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#a855f7" strokeWidth="2">
                <rect x="1" y="3" width="15" height="13" />
                <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
                <circle cx="5.5" cy="18.5" r="2.5" />
                <circle cx="18.5" cy="18.5" r="2.5" />
              </svg>
            </div>
            <div>
              <p className="font-medium" style={{ color: isDark ? colors.white : colors.midnightBlack }}>
                {language === 'bg' ? 'Доставка' : 'Shipping'}
              </p>
              <p className="text-sm" style={{ color: isDark ? colors.gray : colors.midnightBlack }}>
                {language === 'bg'
                  ? 'Очаквайте доставка в рамките на 2-5 работни дни'
                  : 'Expect delivery within 2-5 business days'}
              </p>
            </div>
          </div>

          {/* Support */}
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(34,197,94,0.1)' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={colors.forestGreen} strokeWidth="2">
                <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
              </svg>
            </div>
            <div>
              <p className="font-medium" style={{ color: isDark ? colors.white : colors.midnightBlack }}>
                {language === 'bg' ? 'Нужда от помощ?' : 'Need Help?'}
              </p>
              <p className="text-sm" style={{ color: isDark ? colors.gray : colors.midnightBlack }}>
                {language === 'bg'
                  ? 'Свържете се с нас на support@techhub.bg'
                  : 'Contact us at support@techhub.bg'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        {isAuthenticated ? (
          <Link
            href="/account/orders"
            className="flex-1 py-3 rounded-xl font-semibold text-center"
            style={{ background: colors.forestGreen, color: colors.white }}
          >
            {language === 'bg' ? 'Виж поръчките' : 'View Orders'}
          </Link>
        ) : (
          <Link
            href="/register"
            className="flex-1 py-3 rounded-xl font-semibold text-center"
            style={{ background: colors.forestGreen, color: colors.white }}
          >
            {language === 'bg' ? 'Създай акаунт' : 'Create Account'}
          </Link>
        )}
        <Link
          href="/"
          className="flex-1 py-3 rounded-xl font-semibold text-center"
          style={{
            background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
            color: isDark ? colors.white : colors.midnightBlack,
          }}
        >
          {language === 'bg' ? 'Продължи пазаруването' : 'Continue Shopping'}
        </Link>
      </div>

      {/* Trust Badges */}
      <div className="mt-8 pt-6 border-t flex justify-center gap-6" style={{ borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' }}>
        <div className="text-center">
          <div className="text-2xl mb-1">🔒</div>
          <p className="text-xs" style={{ color: isDark ? colors.gray : colors.midnightBlack }}>
            {language === 'bg' ? 'Сигурно плащане' : 'Secure Payment'}
          </p>
        </div>
        <div className="text-center">
          <div className="text-2xl mb-1">📦</div>
          <p className="text-xs" style={{ color: isDark ? colors.gray : colors.midnightBlack }}>
            {language === 'bg' ? 'Бърза доставка' : 'Fast Shipping'}
          </p>
        </div>
        <div className="text-center">
          <div className="text-2xl mb-1">✅</div>
          <p className="text-xs" style={{ color: isDark ? colors.gray : colors.midnightBlack }}>
            {language === 'bg' ? 'Гаранция' : 'Warranty'}
          </p>
        </div>
      </div>
    </main>
  );
}

function LoadingFallback() {
  return (
    <main className="max-w-2xl mx-auto px-4 py-12">
      <div className="text-center">
        <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gray-200 animate-pulse" />
        <div className="h-8 w-48 mx-auto mb-2 bg-gray-200 rounded animate-pulse" />
        <div className="h-6 w-64 mx-auto bg-gray-200 rounded animate-pulse" />
      </div>
    </main>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <CheckoutSuccessContent />
    </Suspense>
  );
}
