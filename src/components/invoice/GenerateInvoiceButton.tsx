'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUIStore, useAuthStore } from '@/store';
import { colors } from '@/lib/colors';

interface GenerateInvoiceButtonProps {
  invoiceId: number;
  invoiceNumber: string;
  issuedDate: string;
  buyer: {
    name: string;
    eik?: string;
    vatNumber?: string;
    mol?: string;
    address: string;
    city?: string;
  };
  items: {
    name: string;
    nameBg?: string;
    quantity: number;
    price: number;
  }[];
  subtotal: number;
  vatAmount: number;
  total: number;
  paymentMethod: string;
  orderNumber?: string;
  existingPdfUrl?: string;
  promoCode?: string | null;
  promoDiscount?: number;
}

export function GenerateInvoiceButton({
  invoiceId,
  invoiceNumber,
  issuedDate,
  buyer,
  items,
  subtotal,
  vatAmount,
  total,
  paymentMethod,
  orderNumber,
  existingPdfUrl,
  promoCode,
  promoDiscount,
}: GenerateInvoiceButtonProps) {
  const { isDark, language } = useUIStore();
  const { token } = useAuthStore();
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateAndUpload = async () => {
    setLoading(true);
    setError(null);

    try {
      // Generate PDF
      const pdfResponse = await fetch('/api/invoice/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          invoiceNumber,
          issuedDate,
          buyer,
          items,
          subtotal,
          vatAmount,
          total,
          paymentMethod,
          orderNumber,
          promoCode,
          promoDiscount,
        }),
      });

      if (!pdfResponse.ok) {
        throw new Error('Failed to generate PDF');
      }

      const pdfBlob = await pdfResponse.blob();

      // Upload to Strapi
      const formData = new FormData();
      formData.append('files', pdfBlob, `invoice-${invoiceNumber}.pdf`);

      const uploadResponse = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL}/api/upload`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!uploadResponse.ok) {
        throw new Error('Failed to upload PDF');
      }

      const uploadData = await uploadResponse.json();
      const uploadedFileId = uploadData[0]?.id;

      if (!uploadedFileId) {
        throw new Error('No file ID returned from upload');
      }

      // Link PDF to invoice
      const linkResponse = await fetch(
        `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/invoice-clients/${invoiceId}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            data: {
              pdfFile: uploadedFileId,
            },
          }),
        }
      );

      if (!linkResponse.ok) {
        throw new Error('Failed to link PDF to invoice');
      }

      // Refresh page to show new PDF
      router.refresh();
    } catch (err: any) {
      console.error('Invoice generation error:', err);
      setError(err.message || 'Failed to generate invoice');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/invoice/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          invoiceNumber,
          issuedDate,
          buyer,
          items,
          subtotal,
          vatAmount,
          total,
          paymentMethod,
          orderNumber,
          promoCode,
          promoDiscount,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate PDF');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `invoice-${invoiceNumber}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err: any) {
      console.error('Download error:', err);
      setError(err.message || 'Failed to download invoice');
    } finally {
      setLoading(false);
    }
  };

  if (existingPdfUrl) {
    return (
      <div className="space-y-3">
        <a
          href={existingPdfUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full px-4 py-3 rounded-xl font-medium text-center transition-all"
          style={{
            background: colors.forestGreen,
            color: colors.white,
          }}
        >
          {language === 'bg' ? '📄 Отвори фактура' : '📄 View Invoice'}
        </a>

        <button
          onClick={handleDownload}
          disabled={loading}
          className="w-full px-4 py-3 rounded-xl font-medium transition-all disabled:opacity-50"
          style={{
            background: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
            color: isDark ? colors.white : colors.midnightBlack,
          }}
        >
          {loading ? (language === 'bg' ? 'Изтегляне...' : 'Downloading...') : (language === 'bg' ? '💾 Изтегли фактура' : '💾 Download Invoice')}
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <button
        onClick={handleGenerateAndUpload}
        disabled={loading}
        className="w-full px-4 py-3 rounded-xl font-medium transition-all disabled:opacity-50"
        style={{
          background: colors.forestGreen,
          color: colors.white,
        }}
      >
        {loading ? (language === 'bg' ? 'Генериране...' : 'Generating...') : (language === 'bg' ? '📄 Генерирай фактура' : '📄 Generate Invoice')}
      </button>

      <button
        onClick={handleDownload}
        disabled={loading}
        className="w-full px-4 py-3 rounded-xl font-medium transition-all disabled:opacity-50"
        style={{
          background: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
          color: isDark ? colors.white : colors.midnightBlack,
        }}
      >
        {loading ? (language === 'bg' ? 'Изтегляне...' : 'Downloading...') : (language === 'bg' ? '💾 Изтегли без запазване' : '💾 Download Only')}
      </button>

      {error && (
        <p className="text-sm text-red-500 text-center">{error}</p>
      )}
    </div>
  );
}
