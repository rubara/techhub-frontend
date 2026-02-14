'use client';

import { useState } from 'react';
import { useUIStore } from '@/store';
import { colors } from '@/lib/colors';

interface PromoCodeInputProps {
  orderAmount: number;
  onApplyPromo: (promoData: PromoCodeData | null) => void;
  appliedPromo: PromoCodeData | null;
}

export interface PromoCodeData {
  code: string;
  discountPercentage: number;
  discountAmount: number;
  finalAmount: number;
  originalAmount: number;
}

export function PromoCodeInput({ orderAmount, onApplyPromo, appliedPromo }: PromoCodeInputProps) {
  const { isDark, language } = useUIStore();
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleApply = async () => {
    if (!code.trim()) {
      setError(language === 'bg' ? 'Въведете промо код' : 'Enter a promo code');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL}/api/promo-codes/validate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code: code.trim(),
          orderAmount,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.valid) {
        setError(data.message || (language === 'bg' ? 'Невалиден промо код' : 'Invalid promo code'));
        onApplyPromo(null);
        return;
      }

      onApplyPromo({
        code: data.promoCode.code,
        discountPercentage: data.discount.percentage,
        discountAmount: data.discount.amount,
        finalAmount: data.discount.finalAmount,
        originalAmount: data.discount.originalAmount,
      });

      setCode('');
      setError('');
    } catch (err: any) {
      console.error('Promo code error:', err);
      setError(language === 'bg' ? 'Грешка при проверка на кода' : 'Error validating code');
      onApplyPromo(null);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = () => {
    setCode('');
    setError('');
    onApplyPromo(null);
  };

  return (
    <div className="space-y-3">
      {!appliedPromo ? (
        <>
          <div className="flex gap-2">
            <input
              type="text"
              value={code}
              onChange={(e) => {
                setCode(e.target.value.toUpperCase());
                setError('');
              }}
              placeholder={language === 'bg' ? 'Промо код' : 'Promo code'}
              className="flex-1 px-4 py-3 rounded-xl outline-none"
              style={{
                background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
                color: isDark ? colors.white : colors.midnightBlack,
                border: error
                  ? '1px solid #ef4444'
                  : isDark
                  ? '1px solid rgba(255,255,255,0.1)'
                  : '1px solid rgba(0,0,0,0.1)',
              }}
              disabled={loading}
            />
            <button
              onClick={handleApply}
              disabled={loading || !code.trim()}
              className="px-6 py-3 rounded-xl font-semibold transition-all disabled:opacity-50"
              style={{
                background: colors.forestGreen,
                color: colors.white,
              }}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" opacity="0.25" />
                    <path d="M4 12a8 8 0 018-8" opacity="0.75" />
                  </svg>
                  {language === 'bg' ? 'Проверка...' : 'Checking...'}
                </span>
              ) : (
                language === 'bg' ? 'Приложи' : 'Apply'
              )}
            </button>
          </div>
          {error && (
            <p className="text-sm text-red-500">{error}</p>
          )}
        </>
      ) : (
        <div
          className="flex items-center justify-between p-4 rounded-xl"
          style={{
            background: 'rgba(0,181,83,0.1)',
            border: '1px solid rgba(0,181,83,0.3)',
          }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center"
              style={{ background: colors.forestGreen }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <div>
              <p
                className="font-bold"
                style={{ color: colors.forestGreen }}
              >
                {appliedPromo.code}
              </p>
              <p
                className="text-sm"
                style={{ color: isDark ? colors.gray : colors.midnightBlack }}
              >
                {appliedPromo.discountPercentage}% {language === 'bg' ? 'отстъпка' : 'discount'}
              </p>
            </div>
          </div>
          <button
            onClick={handleRemove}
            className="p-2 rounded-lg transition-colors"
            style={{
              color: '#ef4444',
              background: 'rgba(239,68,68,0.1)',
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}

export default PromoCodeInput;
