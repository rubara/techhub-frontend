'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useUIStore, useAuthStore, useCartStore } from '@/store';
import { colors } from '@/lib/colors';
import { createOrder } from '@/lib/auth-api';

// BGN to EUR fixed rate
const BGN_TO_EUR = 1.95583;

// Shipping cost
const SHIPPING_COST = 9.99;
const FREE_SHIPPING_THRESHOLD = 100;

// Payment methods
const paymentMethods = [
  {
    id: 'cod',
    name: 'Cash on Delivery',
    nameBg: 'Наложен платеж',
    description: 'Pay when you receive your order',
    descriptionBg: 'Плащане при получаване на поръчката',
    icon: '💵',
  },
  {
    id: 'card',
    name: 'Credit/Debit Card',
    nameBg: 'Кредитна/Дебитна карта',
    description: 'Pay securely with your card',
    descriptionBg: 'Платете сигурно с вашата карта',
    icon: '💳',
  },
  {
    id: 'bank',
    name: 'Bank Transfer',
    nameBg: 'Банков превод',
    description: 'Transfer to our bank account',
    descriptionBg: 'Превод по банкова сметка',
    icon: '🏦',
  },
];

interface ShippingForm {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  notes: string;
}

interface InvoiceForm {
  companyName: string;
  eik: string;
  vatNumber: string;
  mol: string;
  address: string;
  city: string;
}

export default function CheckoutPage() {
  const router = useRouter();
  const { isDark, language } = useUIStore();
  const { user, token, isAuthenticated } = useAuthStore();
  const { items, clearCart } = useCartStore();

  const [step, setStep] = useState(1);
  const [selectedPayment, setSelectedPayment] = useState('cod');
  const [wantsInvoice, setWantsInvoice] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [shippingForm, setShippingForm] = useState<ShippingForm>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    notes: '',
  });

  const [invoiceForm, setInvoiceForm] = useState<InvoiceForm>({
    companyName: '',
    eik: '',
    vatNumber: '',
    mol: '',
    address: '',
    city: '',
  });

  // Pre-fill with user data
  useEffect(() => {
    if (user) {
      setShippingForm((prev) => ({
        ...prev,
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || '',
        city: user.city || '',
        postalCode: user.postalCode || '',
      }));
    }
  }, [user]);

  // Redirect if empty cart
  useEffect(() => {
    if (items.length === 0) {
      router.push('/cart');
    }
  }, [items, router]);

  // Calculate totals
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
  const total = subtotal + shipping;

  const formatPrice = (price: number) => ({
    bgn: price.toFixed(2),
    eur: (price / BGN_TO_EUR).toFixed(2),
  });

  const getImageUrl = (image: any): string => {
    if (!image) return '/placeholder-product.svg';
    if (typeof image === 'string') return image;
    if (image.url) {
      return image.url.startsWith('http')
        ? image.url
        : `${process.env.NEXT_PUBLIC_STRAPI_URL}${image.url}`;
    }
    return '/placeholder-product.svg';
  };

  const handleShippingChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setShippingForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (errors[e.target.name]) {
      setErrors((prev) => ({ ...prev, [e.target.name]: '' }));
    }
  };

  const handleInvoiceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInvoiceForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const validateShipping = () => {
    const newErrors: Record<string, string> = {};
    if (!shippingForm.firstName.trim()) newErrors.firstName = language === 'bg' ? 'Името е задължително' : 'Required';
    if (!shippingForm.lastName.trim()) newErrors.lastName = language === 'bg' ? 'Фамилията е задължителна' : 'Required';
    if (!shippingForm.email.trim()) newErrors.email = language === 'bg' ? 'Имейлът е задължителен' : 'Required';
    if (!shippingForm.phone.trim()) newErrors.phone = language === 'bg' ? 'Телефонът е задължителен' : 'Required';
    if (!shippingForm.address.trim()) newErrors.address = language === 'bg' ? 'Адресът е задължителен' : 'Required';
    if (!shippingForm.city.trim()) newErrors.city = language === 'bg' ? 'Градът е задължителен' : 'Required';
    if (!shippingForm.postalCode.trim()) newErrors.postalCode = language === 'bg' ? 'Пощенският код е задължителен' : 'Required';

    if (wantsInvoice) {
      if (!invoiceForm.companyName.trim()) newErrors.companyName = language === 'bg' ? 'Задължително' : 'Required';
      if (!invoiceForm.eik.trim()) newErrors.eik = language === 'bg' ? 'Задължително' : 'Required';
      if (!invoiceForm.address.trim()) newErrors.invoiceAddress = language === 'bg' ? 'Задължително' : 'Required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleContinue = () => {
    if (step === 1 && validateShipping()) setStep(2);
    else if (step === 2) setStep(3);
  };

  const handlePlaceOrder = async () => {
    if (!isAuthenticated || !token) {
      router.push('/login?redirect=/checkout');
      return;
    }

    setIsSubmitting(true);

    const orderData = {
      items: items.map((item) => ({
        productId: item.id,
        name: item.name,
        nameBg: item.nameBg,
        price: item.price,
        quantity: item.quantity,
        image: getImageUrl(item.image),
      })),
      shippingAddress: shippingForm,
      paymentMethod: selectedPayment,
      totalAmount: total,
      wantsInvoice,
      invoiceDetails: wantsInvoice ? invoiceForm : undefined,
    };

    const { data, error } = await createOrder(token, orderData);

    if (error) {
      setErrors({ submit: error.message });
      setIsSubmitting(false);
      return;
    }

    clearCart();
    router.push(`/checkout/success?order=${data?.orderNumber}`);
  };

  const inputStyle = {
    background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
    color: isDark ? colors.white : colors.midnightBlack,
    border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.1)',
  };

  const errorInputStyle = { ...inputStyle, border: '1px solid #ef4444' };

  if (items.length === 0) return null;

  return (
    <main className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-4" style={{ color: isDark ? colors.white : colors.midnightBlack }}>
          {language === 'bg' ? 'Завършване на поръчката' : 'Checkout'}
        </h1>

        {/* Steps */}
        <div className="flex items-center gap-2">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold"
                style={{
                  background: step >= s ? colors.forestGreen : isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
                  color: step >= s ? colors.white : isDark ? colors.gray : colors.midnightBlack,
                }}
              >
                {step > s ? '✓' : s}
              </div>
              <span className="ml-2 text-sm hidden sm:inline" style={{ color: step >= s ? (isDark ? colors.white : colors.midnightBlack) : colors.gray }}>
                {s === 1 ? (language === 'bg' ? 'Доставка' : 'Shipping') : s === 2 ? (language === 'bg' ? 'Плащане' : 'Payment') : (language === 'bg' ? 'Преглед' : 'Review')}
              </span>
              {s < 3 && <div className="w-8 sm:w-12 h-0.5 mx-2" style={{ background: step > s ? colors.forestGreen : isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' }} />}
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          {/* Step 1: Shipping */}
          {step === 1 && (
            <div className="p-6 rounded-2xl" style={{ background: isDark ? 'rgba(255,255,255,0.03)' : colors.white, border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.1)' }}>
              <h2 className="text-lg font-bold mb-4" style={{ color: isDark ? colors.white : colors.midnightBlack }}>
                {language === 'bg' ? 'Адрес за доставка' : 'Shipping Address'}
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: isDark ? colors.white : colors.midnightBlack }}>{language === 'bg' ? 'Име' : 'First Name'} *</label>
                  <input type="text" name="firstName" value={shippingForm.firstName} onChange={handleShippingChange} className="w-full px-4 py-3 rounded-xl outline-none" style={errors.firstName ? errorInputStyle : inputStyle} />
                  {errors.firstName && <p className="text-xs mt-1 text-red-500">{errors.firstName}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: isDark ? colors.white : colors.midnightBlack }}>{language === 'bg' ? 'Фамилия' : 'Last Name'} *</label>
                  <input type="text" name="lastName" value={shippingForm.lastName} onChange={handleShippingChange} className="w-full px-4 py-3 rounded-xl outline-none" style={errors.lastName ? errorInputStyle : inputStyle} />
                  {errors.lastName && <p className="text-xs mt-1 text-red-500">{errors.lastName}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: isDark ? colors.white : colors.midnightBlack }}>{language === 'bg' ? 'Имейл' : 'Email'} *</label>
                  <input type="email" name="email" value={shippingForm.email} onChange={handleShippingChange} className="w-full px-4 py-3 rounded-xl outline-none" style={errors.email ? errorInputStyle : inputStyle} />
                  {errors.email && <p className="text-xs mt-1 text-red-500">{errors.email}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: isDark ? colors.white : colors.midnightBlack }}>{language === 'bg' ? 'Телефон' : 'Phone'} *</label>
                  <input type="tel" name="phone" value={shippingForm.phone} onChange={handleShippingChange} placeholder="+359 888 123 456" className="w-full px-4 py-3 rounded-xl outline-none" style={errors.phone ? errorInputStyle : inputStyle} />
                  {errors.phone && <p className="text-xs mt-1 text-red-500">{errors.phone}</p>}
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-1" style={{ color: isDark ? colors.white : colors.midnightBlack }}>{language === 'bg' ? 'Адрес' : 'Address'} *</label>
                  <input type="text" name="address" value={shippingForm.address} onChange={handleShippingChange} className="w-full px-4 py-3 rounded-xl outline-none" style={errors.address ? errorInputStyle : inputStyle} />
                  {errors.address && <p className="text-xs mt-1 text-red-500">{errors.address}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: isDark ? colors.white : colors.midnightBlack }}>{language === 'bg' ? 'Град' : 'City'} *</label>
                  <input type="text" name="city" value={shippingForm.city} onChange={handleShippingChange} className="w-full px-4 py-3 rounded-xl outline-none" style={errors.city ? errorInputStyle : inputStyle} />
                  {errors.city && <p className="text-xs mt-1 text-red-500">{errors.city}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: isDark ? colors.white : colors.midnightBlack }}>{language === 'bg' ? 'Пощенски код' : 'Postal Code'} *</label>
                  <input type="text" name="postalCode" value={shippingForm.postalCode} onChange={handleShippingChange} className="w-full px-4 py-3 rounded-xl outline-none" style={errors.postalCode ? errorInputStyle : inputStyle} />
                  {errors.postalCode && <p className="text-xs mt-1 text-red-500">{errors.postalCode}</p>}
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-1" style={{ color: isDark ? colors.white : colors.midnightBlack }}>{language === 'bg' ? 'Бележки' : 'Notes'}</label>
                  <textarea name="notes" value={shippingForm.notes} onChange={handleShippingChange} rows={2} className="w-full px-4 py-3 rounded-xl outline-none resize-none" style={inputStyle} />
                </div>
              </div>

              {/* Invoice Toggle */}
              <div className="mt-6 pt-4 border-t" style={{ borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' }}>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" checked={wantsInvoice} onChange={(e) => setWantsInvoice(e.target.checked)} className="w-5 h-5 rounded accent-green-500" />
                  <span style={{ color: isDark ? colors.white : colors.midnightBlack }}>{language === 'bg' ? 'Искам фактура' : 'I want an invoice'}</span>
                </label>

                {wantsInvoice && (
                  <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-xl" style={{ background: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)' }}>
                    <div>
                      <label className="block text-sm mb-1" style={{ color: isDark ? colors.gray : colors.midnightBlack }}>{language === 'bg' ? 'Име на фирма' : 'Company'} *</label>
                      <input type="text" name="companyName" value={invoiceForm.companyName} onChange={handleInvoiceChange} className="w-full px-3 py-2 rounded-lg text-sm outline-none" style={errors.companyName ? errorInputStyle : inputStyle} />
                    </div>
                    <div>
                      <label className="block text-sm mb-1" style={{ color: isDark ? colors.gray : colors.midnightBlack }}>ЕИК *</label>
                      <input type="text" name="eik" value={invoiceForm.eik} onChange={handleInvoiceChange} className="w-full px-3 py-2 rounded-lg text-sm outline-none" style={errors.eik ? errorInputStyle : inputStyle} />
                    </div>
                    <div>
                      <label className="block text-sm mb-1" style={{ color: isDark ? colors.gray : colors.midnightBlack }}>{language === 'bg' ? 'ДДС номер' : 'VAT'}</label>
                      <input type="text" name="vatNumber" value={invoiceForm.vatNumber} onChange={handleInvoiceChange} className="w-full px-3 py-2 rounded-lg text-sm outline-none" style={inputStyle} />
                    </div>
                    <div>
                      <label className="block text-sm mb-1" style={{ color: isDark ? colors.gray : colors.midnightBlack }}>МОЛ</label>
                      <input type="text" name="mol" value={invoiceForm.mol} onChange={handleInvoiceChange} className="w-full px-3 py-2 rounded-lg text-sm outline-none" style={inputStyle} />
                    </div>
                    <div>
                      <label className="block text-sm mb-1" style={{ color: isDark ? colors.gray : colors.midnightBlack }}>{language === 'bg' ? 'Адрес' : 'Address'} *</label>
                      <input type="text" name="address" value={invoiceForm.address} onChange={handleInvoiceChange} className="w-full px-3 py-2 rounded-lg text-sm outline-none" style={errors.invoiceAddress ? errorInputStyle : inputStyle} />
                    </div>
                    <div>
                      <label className="block text-sm mb-1" style={{ color: isDark ? colors.gray : colors.midnightBlack }}>{language === 'bg' ? 'Град' : 'City'}</label>
                      <input type="text" name="city" value={invoiceForm.city} onChange={handleInvoiceChange} className="w-full px-3 py-2 rounded-lg text-sm outline-none" style={inputStyle} />
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Step 2: Payment */}
          {step === 2 && (
            <div className="p-6 rounded-2xl" style={{ background: isDark ? 'rgba(255,255,255,0.03)' : colors.white, border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.1)' }}>
              <h2 className="text-lg font-bold mb-4" style={{ color: isDark ? colors.white : colors.midnightBlack }}>
                {language === 'bg' ? 'Метод на плащане' : 'Payment Method'}
              </h2>

              <div className="space-y-3">
                {paymentMethods.map((method) => (
                  <label
                    key={method.id}
                    className="flex items-center gap-4 p-4 rounded-xl cursor-pointer transition-all"
                    style={{
                      background: selectedPayment === method.id ? (isDark ? 'rgba(34,197,94,0.1)' : 'rgba(34,197,94,0.05)') : (isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)'),
                      border: selectedPayment === method.id ? `2px solid ${colors.forestGreen}` : '2px solid transparent',
                    }}
                  >
                    <input type="radio" name="payment" value={method.id} checked={selectedPayment === method.id} onChange={(e) => setSelectedPayment(e.target.value)} className="sr-only" />
                    <span className="text-2xl">{method.icon}</span>
                    <div>
                      <p className="font-medium" style={{ color: isDark ? colors.white : colors.midnightBlack }}>{language === 'bg' ? method.nameBg : method.name}</p>
                      <p className="text-sm" style={{ color: isDark ? colors.gray : colors.midnightBlack }}>{language === 'bg' ? method.descriptionBg : method.description}</p>
                    </div>
                  </label>
                ))}
              </div>

              {selectedPayment === 'bank' && (
                <div className="mt-4 p-4 rounded-xl" style={{ background: 'rgba(251,191,36,0.1)', border: '1px solid rgba(251,191,36,0.3)' }}>
                  <p className="text-sm" style={{ color: '#f59e0b' }}>
                    {language === 'bg' ? '🏦 Ще получите данни за банков превод след поръчката.' : '🏦 Bank details will be sent after order confirmation.'}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Step 3: Review */}
          {step === 3 && (
            <div className="space-y-4">
              <div className="p-6 rounded-2xl" style={{ background: isDark ? 'rgba(255,255,255,0.03)' : colors.white, border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.1)' }}>
                <div className="flex justify-between mb-3">
                  <h3 className="font-bold" style={{ color: isDark ? colors.white : colors.midnightBlack }}>{language === 'bg' ? 'Доставка' : 'Shipping'}</h3>
                  <button onClick={() => setStep(1)} className="text-sm" style={{ color: colors.forestGreen }}>{language === 'bg' ? 'Промени' : 'Edit'}</button>
                </div>
                <p style={{ color: isDark ? colors.gray : colors.midnightBlack }}>
                  {shippingForm.firstName} {shippingForm.lastName}<br />
                  {shippingForm.address}, {shippingForm.city} {shippingForm.postalCode}<br />
                  {shippingForm.phone} • {shippingForm.email}
                </p>
              </div>

              {wantsInvoice && (
                <div className="p-6 rounded-2xl" style={{ background: isDark ? 'rgba(255,255,255,0.03)' : colors.white, border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.1)' }}>
                  <h3 className="font-bold mb-3" style={{ color: isDark ? colors.white : colors.midnightBlack }}>{language === 'bg' ? 'Фактура' : 'Invoice'}</h3>
                  <p style={{ color: isDark ? colors.gray : colors.midnightBlack }}>
                    {invoiceForm.companyName} • ЕИК: {invoiceForm.eik}<br />
                    {invoiceForm.address}, {invoiceForm.city}
                  </p>
                </div>
              )}

              <div className="p-6 rounded-2xl" style={{ background: isDark ? 'rgba(255,255,255,0.03)' : colors.white, border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.1)' }}>
                <div className="flex justify-between mb-3">
                  <h3 className="font-bold" style={{ color: isDark ? colors.white : colors.midnightBlack }}>{language === 'bg' ? 'Плащане' : 'Payment'}</h3>
                  <button onClick={() => setStep(2)} className="text-sm" style={{ color: colors.forestGreen }}>{language === 'bg' ? 'Промени' : 'Edit'}</button>
                </div>
                <p style={{ color: isDark ? colors.gray : colors.midnightBlack }}>
                  {paymentMethods.find((m) => m.id === selectedPayment)?.icon} {language === 'bg' ? paymentMethods.find((m) => m.id === selectedPayment)?.nameBg : paymentMethods.find((m) => m.id === selectedPayment)?.name}
                </p>
              </div>

              <div className="p-6 rounded-2xl" style={{ background: isDark ? 'rgba(255,255,255,0.03)' : colors.white, border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.1)' }}>
                <h3 className="font-bold mb-4" style={{ color: isDark ? colors.white : colors.midnightBlack }}>{language === 'bg' ? 'Продукти' : 'Items'}</h3>
                <div className="space-y-3">
                  {items.map((item) => (
                    <div key={item.id} className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg overflow-hidden" style={{ background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)' }}>
                        <Image src={getImageUrl(item.image)} alt={item.name} width={48} height={48} className="w-full h-full object-contain p-1" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium" style={{ color: isDark ? colors.white : colors.midnightBlack }}>{language === 'bg' && item.nameBg ? item.nameBg : item.name}</p>
                        <p className="text-xs" style={{ color: colors.gray }}>{item.quantity} x {item.price.toFixed(2)} лв.</p>
                      </div>
                      <p className="font-semibold" style={{ color: colors.forestGreen }}>{(item.price * item.quantity).toFixed(2)} лв.</p>
                    </div>
                  ))}
                </div>
              </div>

              {errors.submit && (
                <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20">
                  <p className="text-red-500">{errors.submit}</p>
                </div>
              )}
            </div>
          )}

          {/* Navigation */}
          <div className="flex gap-4 mt-6">
            {step > 1 && (
              <button onClick={() => setStep(step - 1)} className="px-6 py-3 rounded-xl font-medium" style={{ background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)', color: isDark ? colors.white : colors.midnightBlack }}>
                ← {language === 'bg' ? 'Назад' : 'Back'}
              </button>
            )}
            {step < 3 ? (
              <button onClick={handleContinue} className="flex-1 py-3 rounded-xl font-semibold" style={{ background: colors.forestGreen, color: colors.white }}>
                {language === 'bg' ? 'Продължи' : 'Continue'}
              </button>
            ) : (
              <button onClick={handlePlaceOrder} disabled={isSubmitting} className="flex-1 py-3 rounded-xl font-semibold disabled:opacity-50" style={{ background: colors.forestGreen, color: colors.white }}>
                {isSubmitting ? (language === 'bg' ? 'Обработка...' : 'Processing...') : (language === 'bg' ? 'Потвърди поръчката' : 'Place Order')}
              </button>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="sticky top-4 p-6 rounded-2xl" style={{ background: isDark ? 'rgba(255,255,255,0.03)' : colors.white, border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.1)' }}>
            <h3 className="font-bold mb-4" style={{ color: isDark ? colors.white : colors.midnightBlack }}>{language === 'bg' ? 'Обобщение' : 'Summary'}</h3>

            <div className="space-y-2 mb-4">
              {items.map((item) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span style={{ color: isDark ? colors.gray : colors.midnightBlack }}>{language === 'bg' && item.nameBg ? item.nameBg : item.name} x{item.quantity}</span>
                  <span style={{ color: isDark ? colors.white : colors.midnightBlack }}>{(item.price * item.quantity).toFixed(2)} лв.</span>
                </div>
              ))}
            </div>

            <div className="h-px my-4" style={{ background: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' }} />

            <div className="flex justify-between mb-2">
              <span style={{ color: isDark ? colors.gray : colors.midnightBlack }}>{language === 'bg' ? 'Междинна сума' : 'Subtotal'}</span>
              <span style={{ color: isDark ? colors.white : colors.midnightBlack }}>{formatPrice(subtotal).bgn} лв.</span>
            </div>
            <div className="flex justify-between mb-2">
              <span style={{ color: isDark ? colors.gray : colors.midnightBlack }}>{language === 'bg' ? 'Доставка' : 'Shipping'}</span>
              <span style={{ color: shipping === 0 ? colors.forestGreen : isDark ? colors.white : colors.midnightBlack }}>{shipping === 0 ? (language === 'bg' ? 'Безплатна' : 'Free') : `${shipping.toFixed(2)} лв.`}</span>
            </div>

            <div className="h-px my-4" style={{ background: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' }} />

            <div className="flex justify-between">
              <span className="font-bold" style={{ color: isDark ? colors.white : colors.midnightBlack }}>{language === 'bg' ? 'Общо' : 'Total'}</span>
              <div className="text-right">
                <p className="font-bold text-xl" style={{ color: colors.forestGreen }}>{formatPrice(total).bgn} лв.</p>
                <p className="text-sm" style={{ color: isDark ? colors.gray : colors.midnightBlack }}>{formatPrice(total).eur} €</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
