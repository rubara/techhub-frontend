'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useUIStore } from '@/store';
import { colors } from '@/lib/colors';

export default function CheckoutSuccessPage() {
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
          className="w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center"
          style={{ background: 'rgba(0,181,83,0.1)' }}
        >
          <svg
            width="40"
            height="40"
            viewBox="0 0 24 24"
            fill="none"
            stroke={colors.forestGreen}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>

        {/* Success Message */}
        <h1
          className="text-2xl font-bold mb-2"
          style={{ color: isDark ? colors.white : colors.midnightBlack }}
        >
          {language === 'bg' ? 'Поръчката е успешна!' : 'Order Successful!'}
        </h1>

        <p
          className="text-sm mb-6"
          style={{ color: isDark ? colors.gray : colors.midnightBlack }}
        >
          {language === 'bg'
            ? 'Благодарим ви за поръчката!'
            : 'Thank you for your order!'}
        </p>

        {/* Order Number */}
        <div
          className="p-4 rounded-xl mb-6"
          style={{
            background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
          }}
        >
          <p
            className="text-xs mb-1"
            style={{ color: isDark ? colors.gray : colors.midnightBlack }}
          >
            {language === 'bg' ? 'Номер на поръчка' : 'Order Number'}
          </p>
          <p
            className="text-lg font-mono font-bold"
            style={{ color: colors.forestGreen }}
          >
            {orderNumber}
          </p>
        </div>

        {/* Info Message */}
        <p
          className="text-sm mb-6"
          style={{ color: isDark ? colors.gray : colors.midnightBlack }}
        >
          {language === 'bg'
            ? 'Ще получите имейл с потвърждение на поръчката.'
            : 'You will receive an email confirmation shortly.'}
        </p>

        {/* View Order Button */}
        <Link
          href={`/account/orders/${documentId}`}
          className="block w-full px-6 py-3 rounded-xl font-semibold mb-3 transition-colors"
          style={{ background: colors.forestGreen, color: colors.white }}
        >
          {language === 'bg' ? 'Виж поръчката' : 'View Order'}
        </Link>

        {/* Continue Shopping Button */}
        <Link
          href="/"
          className="block w-full px-6 py-3 rounded-xl font-medium transition-colors"
          style={{
            background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
            color: isDark ? colors.white : colors.midnightBlack,
          }}
        >
          {language === 'bg' ? 'Продължи с пазаруването' : 'Continue Shopping'}
        </Link>

        {/* Auto-redirect countdown */}
        <p
          className="text-xs mt-6"
          style={{ color: isDark ? colors.gray : colors.midnightBlack }}
        >
          {language === 'bg'
            ? `Автоматично пренасочване след ${countdown} секунди...`
            : `Auto-redirecting in ${countdown} seconds...`}
        </p>
      </div>
    </main>
  );
}
