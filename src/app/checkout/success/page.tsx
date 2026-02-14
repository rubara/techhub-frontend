'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useUIStore } from '@/store';
import { colors } from '@/lib/colors';

function CheckoutSuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isDark, language } = useUIStore();

  const orderNumber = searchParams.get('order');
  const documentId = searchParams.get('id');

  const [countdown, setCountdown] = useState(10);

  useEffect(() => {
    if (!orderNumber || !documentId) {
      router.push('/');
      return;
    }

    // Countdown timer
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          router.push(`/account/orders/${documentId}`);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [orderNumber, documentId, router]);

  if (!orderNumber || !documentId) {
    return null;
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-12">
      <div
        className="max-w-md w-full p-8 rounded-2xl text-center"
        style={{
          background: isDark ? 'rgba(255,255,255,0.03)' : colors.white,
          border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.1)',
        }}
      >
        {/* Success Icon */}
        <div
          className="w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center"
          style={{ background: 'rgba(0,181,83,0.1)' }}
        >
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke={colors.forestGreen} strokeWidth="2">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
          </svg>
        </div>

        {/* Title */}
        <h1 className="text-2xl font-bold mb-3" style={{ color: isDark ? colors.white : colors.midnightBlack }}>
          {language === 'bg' ? '🎉 Поръчката е успешна!' : '🎉 Order Successful!'}
        </h1>

        {/* Order Number */}
        <p className="mb-6" style={{ color: isDark ? colors.gray : colors.midnightBlack }}>
          {language === 'bg' ? 'Номер на поръчка:' : 'Order number:'}
          <br />
          <span className="font-mono font-bold text-lg" style={{ color: colors.forestGreen }}>
            {orderNumber}
          </span>
        </p>

        {/* Message */}
        <p className="mb-8 text-sm" style={{ color: isDark ? colors.gray : colors.midnightBlack }}>
          {language === 'bg'
            ? 'Благодарим ви за поръчката! Ще получите имейл с потвърждение скоро.'
            : 'Thank you for your order! You will receive a confirmation email shortly.'}
        </p>

        {/* Countdown */}
        <p className="text-sm mb-6" style={{ color: isDark ? colors.gray : colors.midnightBlack }}>
          {language === 'bg'
            ? `Пренасочване към детайли на поръчката след ${countdown} секунди...`
            : `Redirecting to order details in ${countdown} seconds...`}
        </p>

        {/* Buttons */}
        <div className="flex flex-col gap-3">
          <Link
            href={`/account/orders/${documentId}`}
            className="w-full py-3 px-6 rounded-xl font-semibold transition-all hover:scale-105"
            style={{ background: colors.forestGreen, color: colors.white }}
          >
            {language === 'bg' ? 'Виж поръчката' : 'View Order'}
          </Link>

          <Link
            href="/"
            className="w-full py-3 px-6 rounded-xl font-medium transition-all"
            style={{
              background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
              color: isDark ? colors.white : colors.midnightBlack,
            }}
          >
            {language === 'bg' ? 'Продължи пазаруването' : 'Continue Shopping'}
          </Link>
        </div>
      </div>
    </main>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full mx-auto mb-4" />
            <p>Loading...</p>
          </div>
        </main>
      }
    >
      <CheckoutSuccessContent />
    </Suspense>
  );
}
