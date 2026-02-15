'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useUIStore, useAuthStore } from '@/store';
import { colors } from '@/lib/colors';
import { getOrderById, Order } from '@/lib/auth-api';
import { GenerateInvoiceButton } from '@/components/invoice/GenerateInvoiceButton';
import { useCurrencySettings } from '@/hooks/useCurrencySettings';
import { formatPrice as formatCurrency } from '@/utils/currency';



const statusConfig: Record<string, { label: { en: string; bg: string }; color: string; bgColor: string }> = {
  pending: {
    label: { en: 'Pending', bg: 'Изчакваща' },
    color: '#f59e0b',
    bgColor: 'rgba(245, 158, 11, 0.1)',
  },
  processing: {
    label: { en: 'Processing', bg: 'Обработва се' },
    color: '#3b82f6',
    bgColor: 'rgba(59, 130, 246, 0.1)',
  },
  shipped: {
    label: { en: 'Shipped', bg: 'Изпратена' },
    color: '#8b5cf6',
    bgColor: 'rgba(139, 92, 246, 0.1)',
  },
  delivered: {
    label: { en: 'Delivered', bg: 'Доставена' },
    color: '#22c55e',
    bgColor: 'rgba(34, 197, 94, 0.1)',
  },
  cancelled: {
    label: { en: 'Cancelled', bg: 'Отказана' },
    color: '#ef4444',
    bgColor: 'rgba(239, 68, 68, 0.1)',
  },
};

const paymentStatusConfig: Record<string, { label: { en: string; bg: string }; color: string }> = {
  pending: { label: { en: 'Payment Pending', bg: 'Очаква плащане' }, color: '#f59e0b' },
  paid: { label: { en: 'Paid', bg: 'Платена' }, color: '#22c55e' },
  failed: { label: { en: 'Payment Failed', bg: 'Неуспешно плащане' }, color: '#ef4444' },
  refunded: { label: { en: 'Refunded', bg: 'Възстановена' }, color: '#6b7280' },
};

const paymentMethodLabels: Record<string, { en: string; bg: string; icon: string }> = {
  cod: { en: 'Cash on Delivery', bg: 'Наложен платеж', icon: '💵' },
  card: { en: 'Credit/Debit Card', bg: 'Кредитна/Дебитна карта', icon: '💳' },
  bank: { en: 'Bank Transfer', bg: 'Банков превод', icon: '🏦' },
};

export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = params.id as string;

  const { isDark, language } = useUIStore();
  const { token, isAuthenticated } = useAuthStore();
const { settings } = useCurrencySettings();


  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated || !token) {
      router.push('/login?redirect=/account/orders');
      return;
    }

    const fetchOrder = async () => {
      setLoading(true);
      const { data, error } = await getOrderById(token, orderId);
      if (error) {
        setError(error.message);
      } else {
        setOrder(data);
      }
      setLoading(false);
    };

    fetchOrder();
  }, [orderId, token, isAuthenticated, router]);

const formatPrice = (eurPrice: number) => {
  const formatted = formatCurrency(eurPrice, settings);
  return {
    primary: formatted.primary,
    secondary: formatted.secondary,
  };
};

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(language === 'bg' ? 'bg-BG' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getImageUrl = (image: any): string => {
    if (!image) return '/placeholder-product.svg';
    if (typeof image === 'string') return image.startsWith('http') ? image : '/placeholder-product.svg';
    return '/placeholder-product.svg';
  };

  if (loading) {
    return (
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 w-48 rounded" style={{ background: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' }} />
          <div className="h-40 rounded-2xl" style={{ background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }} />
          <div className="h-60 rounded-2xl" style={{ background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }} />
        </div>
      </main>
    );
  }

  if (error || !order) {
    return (
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div
          className="text-center py-12 rounded-2xl"
          style={{
            background: isDark ? 'rgba(255,255,255,0.03)' : colors.white,
            border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.1)',
          }}
        >
          <p className="text-red-500 mb-4">{error || (language === 'bg' ? 'Поръчката не е намерена' : 'Order not found')}</p>
          <Link
            href="/account/orders"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-medium"
            style={{ background: colors.forestGreen, color: colors.white }}
          >
            {language === 'bg' ? '← Към поръчките' : '← Back to Orders'}
          </Link>
        </div>
      </main>
    );
  }

  const orderStatus = statusConfig[order.status] || statusConfig.pending;
  const paymentStatus = paymentStatusConfig[order.paymentStatus] || paymentStatusConfig.pending;
  const paymentMethod = paymentMethodLabels[order.paymentMethod] || { en: order.paymentMethod, bg: order.paymentMethod, icon: '💰' };

  const subtotal = order.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = order.totalAmount > subtotal ? order.totalAmount - subtotal : 0;

  return (
    <main className="max-w-4xl mx-auto px-4 py-8">
      {/* Back Link */}
      <Link
        href="/account/orders"
        className="inline-flex items-center gap-2 text-sm mb-6 hover:underline"
        style={{ color: colors.forestGreen }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
        {language === 'bg' ? 'Към всички поръчки' : 'Back to all orders'}
      </Link>

      {/* Order Header */}
      <div
        className="p-6 rounded-2xl mb-6"
        style={{
          background: isDark ? 'rgba(255,255,255,0.03)' : colors.white,
          border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.1)',
        }}
      >
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm mb-1" style={{ color: isDark ? colors.gray : colors.midnightBlack }}>
              {language === 'bg' ? 'Поръчка' : 'Order'}
            </p>
            <h1 className="text-2xl font-bold font-mono" style={{ color: colors.forestGreen }}>
              {order.orderNumber}
            </h1>
            <p className="text-sm mt-2" style={{ color: isDark ? colors.gray : colors.midnightBlack }}>
              {formatDate(order.createdAt)}
            </p>
          </div>

          <div className="flex flex-col items-end gap-2">
            <span
              className="px-4 py-2 rounded-full text-sm font-medium"
              style={{ background: orderStatus.bgColor, color: orderStatus.color }}
            >
              {language === 'bg' ? orderStatus.label.bg : orderStatus.label.en}
            </span>
            <span className="text-sm font-medium" style={{ color: paymentStatus.color }}>
              {language === 'bg' ? paymentStatus.label.bg : paymentStatus.label.en}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Items */}
          <div
            className="p-6 rounded-2xl"
            style={{
              background: isDark ? 'rgba(255,255,255,0.03)' : colors.white,
              border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.1)',
            }}
          >
            <h2 className="font-bold mb-4" style={{ color: isDark ? colors.white : colors.midnightBlack }}>
              {language === 'bg' ? 'Продукти' : 'Items'} ({order.items.length})
            </h2>

            <div className="space-y-4">
              {order.items.map((item, index) => (
                <div
                  key={index}
                  className="flex gap-4 pb-4"
                  style={{
                    borderBottom: index < order.items.length - 1
                      ? isDark ? '1px solid rgba(255,255,255,0.05)' : '1px solid rgba(0,0,0,0.05)'
                      : 'none',
                  }}
                >
                  <div
                    className="w-20 h-20 rounded-xl flex-shrink-0 overflow-hidden"
                    style={{ background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)' }}
                  >
                    <Image
                      src={getImageUrl(item.image)}
                      alt={item.name}
                      width={80}
                      height={80}
                      className="w-full h-full object-contain p-2"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="font-medium mb-1" style={{ color: isDark ? colors.white : colors.midnightBlack }}>
                      {language === 'bg' && item.nameBg ? item.nameBg : item.name}
                    </p>
<p className="text-sm" style={{ color: isDark ? colors.gray : colors.midnightBlack }}>
  {item.quantity} x {formatPrice(item.price).primary}
</p>
                  </div>

<div className="text-right">
  <p className="font-bold" style={{ color: colors.forestGreen }}>
    {formatPrice(item.price * item.quantity).primary}
  </p>
  {settings.showBGNReference && (
    <p className="text-xs" style={{ color: isDark ? colors.gray : colors.midnightBlack }}>
      {formatPrice(item.price * item.quantity).secondary}
    </p>
  )}
</div>                </div>
              ))}
            </div>
          </div>

          {/* Promo Code Discount */}
          {order.promoCode && order.promoDiscountAmount && order.promoDiscountAmount > 0 && (
            <div
              className="p-6 rounded-2xl"
              style={{
                background: isDark ? 'rgba(255,255,255,0.03)' : colors.white,
                border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.1)',
              }}
            >
              <h2
                className="text-lg font-bold mb-4"
                style={{ color: isDark ? colors.white : colors.midnightBlack }}
              >
                {language === 'bg' ? 'Промо код' : 'Promo Code'}
              </h2>

              <div
                className="flex items-center justify-between p-4 rounded-xl"
                style={{
                  background: 'rgba(0,181,83,0.1)',
                  border: '1px solid rgba(0,181,83,0.3)',
                }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center"
                    style={{ background: colors.forestGreen }}
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2">
                      <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
                      <line x1="7" y1="7" x2="7.01" y2="7" />
                    </svg>
                  </div>
                  <div>
                    <p
                      className="font-bold text-lg"
                      style={{ color: colors.forestGreen }}
                    >
                      {order.promoCode}
                    </p>
                    <p
                      className="text-sm"
                      style={{ color: isDark ? colors.gray : colors.midnightBlack }}
                    >
                      {order.promoDiscountPercentage}% {language === 'bg' ? 'отстъпка' : 'discount'}
                    </p>
                  </div>
                </div>
<div className="text-right">
  <p
    className="text-sm"
    style={{ color: isDark ? colors.gray : colors.midnightBlack }}
  >
    {language === 'bg' ? 'Спестени' : 'Saved'}
  </p>
  <p
    className="text-xl font-bold"
    style={{ color: colors.forestGreen }}
  >
    {formatPrice(order.promoDiscountAmount).primary}
  </p>
</div>
              </div>
            </div>
          )}

          {/* Shipping Address */}
          <div
            className="p-6 rounded-2xl"
            style={{
              background: isDark ? 'rgba(255,255,255,0.03)' : colors.white,
              border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.1)',
            }}
          >
            <h2 className="font-bold mb-4 flex items-center gap-2" style={{ color: isDark ? colors.white : colors.midnightBlack }}>
              📍 {language === 'bg' ? 'Адрес за доставка' : 'Shipping Address'}
            </h2>

            <div style={{ color: isDark ? colors.gray : colors.midnightBlack }}>
              <p className="font-medium" style={{ color: isDark ? colors.white : colors.midnightBlack }}>
                {order.shippingAddress.firstName} {order.shippingAddress.lastName}
              </p>
              <p>{order.shippingAddress.address}</p>
              <p>{order.shippingAddress.city}, {order.shippingAddress.postalCode}</p>
              <p className="mt-2">📞 {order.shippingAddress.phone}</p>
              <p>✉️ {order.shippingAddress.email}</p>
              {order.shippingAddress.notes && (
                <p className="mt-2 italic text-sm">💬 {order.shippingAddress.notes}</p>
              )}
            </div>
          </div>

          {/* Invoice Details */}
          {order.wantsInvoice && order.invoice && (
            <div
              className="p-6 rounded-2xl"
              style={{
                background: isDark ? 'rgba(255,255,255,0.03)' : colors.white,
                border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.1)',
              }}
            >
              <h2 className="font-bold mb-4 flex items-center gap-2" style={{ color: isDark ? colors.white : colors.midnightBlack }}>
                📄 {language === 'bg' ? 'Данни за фактура' : 'Invoice Details'}
              </h2>

              <div style={{ color: isDark ? colors.gray : colors.midnightBlack }}>
                <p className="font-medium" style={{ color: isDark ? colors.white : colors.midnightBlack }}>
                  {order.invoice.buyerName}
                </p>
                {order.invoice.buyerEik && <p>ЕИК: {order.invoice.buyerEik}</p>}
                {order.invoice.buyerVatNumber && <p>ДДС: {order.invoice.buyerVatNumber}</p>}
                {order.invoice.buyerMol && <p>МОЛ: {order.invoice.buyerMol}</p>}
                <p>{order.invoice.buyerAddress}</p>
                {order.invoice.buyerCity && <p>{order.invoice.buyerCity}</p>}

                <div className="mt-4 pt-4" style={{ borderTop: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.1)' }}>
                  <p className="text-sm mb-3">
                    {language === 'bg' ? 'Фактура №:' : 'Invoice #:'}{' '}
                    <span className="font-mono font-medium" style={{ color: colors.forestGreen }}>
                      {order.invoice.invoiceNumber}
                    </span>
                  </p>

                  {/* Generate Invoice Button */}
                  <GenerateInvoiceButton
                      invoiceDocumentId={order.invoice.documentId}
                    invoiceNumber={order.invoice.invoiceNumber}
                    issuedDate={order.invoice.issuedDate}
                    buyer={{
                      name: order.invoice.buyerName,
                      eik: order.invoice.buyerEik,
                      vatNumber: order.invoice.buyerVatNumber,
                      mol: order.invoice.buyerMol,
                      address: order.invoice.buyerAddress,
                      city: order.invoice.buyerCity,
                    }}
                    items={order.items.map(item => ({
                      name: item.name,
                      nameBg: item.nameBg,
                      quantity: item.quantity,
                      price: item.price,
                    }))}
                    subtotal={order.invoice.subtotal}
                    vatAmount={order.invoice.vatAmount}
                    total={order.invoice.totalAmount}
                    paymentMethod={order.paymentMethod}
                    orderNumber={order.orderNumber}
                    existingPdfUrl={order.invoice.pdfFile?.url}
                    promoCode={order.promoCode}
                    promoDiscount={order.promoDiscountAmount}
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Column - Summary */}
        <div className="lg:col-span-1">
          <div
            className="sticky top-4 p-6 rounded-2xl"
            style={{
              background: isDark ? 'rgba(255,255,255,0.03)' : colors.white,
              border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.1)',
            }}
          >
            <h2 className="font-bold mb-4" style={{ color: isDark ? colors.white : colors.midnightBlack }}>
              {language === 'bg' ? 'Обобщение' : 'Summary'}
            </h2>

            {/* Payment Method */}
            <div className="mb-4 pb-4" style={{ borderBottom: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.1)' }}>
              <p className="text-sm mb-1" style={{ color: isDark ? colors.gray : colors.midnightBlack }}>
                {language === 'bg' ? 'Метод на плащане' : 'Payment Method'}
              </p>
              <p className="font-medium" style={{ color: isDark ? colors.white : colors.midnightBlack }}>
                {paymentMethod.icon} {language === 'bg' ? paymentMethod.bg : paymentMethod.en}
              </p>
            </div>

            {/* Totals */}
            <div className="space-y-2">
              {order.promoCode && order.originalAmount && (
                <>
<div className="flex justify-between text-sm">
  <span style={{ color: isDark ? colors.gray : colors.midnightBlack }}>
    {language === 'bg' ? 'Първоначална сума' : 'Original amount'}
  </span>
  <span style={{ color: isDark ? colors.gray : colors.midnightBlack }}>
    {formatPrice(order.originalAmount).primary}
  </span>
</div>
<div className="flex justify-between text-sm">
  <span style={{ color: isDark ? colors.gray : colors.midnightBlack }}>
    {language === 'bg' ? 'Промо отстъпка' : 'Promo discount'} ({order.promoCode})
  </span>
  <span style={{ color: colors.forestGreen }}>
    -{formatPrice(order.promoDiscountAmount || 0).primary}
  </span>
</div>
                  <div className="h-px my-2" style={{ background: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' }} />
                </>
              )}

<div className="flex justify-between">
  <span style={{ color: isDark ? colors.gray : colors.midnightBlack }}>
    {language === 'bg' ? 'Междинна сума' : 'Subtotal'}
  </span>
  <span style={{ color: isDark ? colors.white : colors.midnightBlack }}>
    {formatPrice(subtotal).primary}
  </span>
</div>

<div className="flex justify-between">
  <span style={{ color: isDark ? colors.gray : colors.midnightBlack }}>
    {language === 'bg' ? 'Доставка' : 'Shipping'}
  </span>
  <span style={{ color: shipping === 0 ? colors.forestGreen : isDark ? colors.white : colors.midnightBlack }}>
    {shipping === 0 ? (language === 'bg' ? 'Безплатна' : 'Free') : formatPrice(shipping).primary}
  </span>
</div>
            </div>

            <div className="h-px my-4" style={{ background: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' }} />

<div className="flex justify-between items-end">
  <span className="font-bold" style={{ color: isDark ? colors.white : colors.midnightBlack }}>
    {language === 'bg' ? 'Общо' : 'Total'}
  </span>
  <div className="text-right">
    <p className="font-bold text-2xl" style={{ color: colors.forestGreen }}>
      {formatPrice(order.totalAmount).primary}
    </p>
    {settings.showBGNReference && (
      <p className="text-sm" style={{ color: isDark ? colors.gray : colors.midnightBlack }}>
        {formatPrice(order.totalAmount).secondary}
      </p>
    )}
  </div>
</div>

            {/* Help Link */}
            <div className="mt-6 pt-4 text-center" style={{ borderTop: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.1)' }}>
              <p className="text-xs" style={{ color: isDark ? colors.gray : colors.midnightBlack }}>
                {language === 'bg' ? 'Имате въпроси?' : 'Need help?'}
              </p>
              <a href="mailto:support@techhub.bg" className="text-sm font-medium" style={{ color: colors.forestGreen }}>
                support@techhub.bg
              </a>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
