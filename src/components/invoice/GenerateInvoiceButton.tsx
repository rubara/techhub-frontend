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
}: GenerateInvoiceButtonProps) {
  const { isDark, language } = useUIStore();
  const { token } = useAuthStore();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string | undefined>(existingPdfUrl);

  const handleGenerateAndUpload = async () => {
    if (!token) return;

    setLoading(true);
    setError(null);

    try {
      const pdfResponse = await fetch('/api/invoice/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
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
        }),
      });

      if (!pdfResponse.ok) throw new Error('Failed to generate PDF');

      const pdfBlob = await pdfResponse.blob();

      const formData = new FormData();
      formData.append('files', pdfBlob, `invoice-${invoiceNumber}.pdf`);
      formData.append('ref', 'api::invoice-client.invoice-client');
      formData.append('refId', invoiceId.toString());
      formData.append('field', 'pdfFile');

      const uploadResponse = await fetch(
        `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/upload`,
        {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        }
      );

      if (!uploadResponse.ok) throw new Error('Failed to upload PDF');

      const uploadResult = await uploadResponse.json();
      const uploadedFileUrl = uploadResult[0]?.url 
  ? `${process.env.NEXT_PUBLIC_STRAPI_URL}${uploadResult[0].url}`
  : undefined;

      await fetch(
        `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/invoice-clients/${invoiceId}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ data: { invoiceStatus: 'issued' } }),
        }
      );

      setSuccess(true);
      setPdfUrl(uploadedFileUrl);
      
      // Refresh the page data without full reload
      router.refresh();
      
      // Reset success message after 3 seconds
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
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
        headers: { 'Content-Type': 'application/json' },
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
        }),
      });

      if (!response.ok) throw new Error('Failed to generate PDF');

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `invoice-${invoiceNumber}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err: any) {
      setError(err.message || 'Failed to download');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div
        className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm mb-2"
        style={{ background: 'rgba(34,197,94,0.1)', color: colors.forestGreen }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="20 6 9 17 4 12" />
        </svg>
        {language === 'bg' ? 'Фактурата е генерирана!' : 'Invoice generated!'}
      </div>
    );
  }

  if (pdfUrl) {
    return (
      <div className="space-y-2">
        <a
          href={pdfUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium"
          style={{ background: colors.forestGreen, color: colors.white }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          {language === 'bg' ? 'Изтегли фактура' : 'Download Invoice'}
        </a>
        
        {/* Show regenerate option */}
        <button
          onClick={handleDownload}
          disabled={loading}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium disabled:opacity-50 ml-2"
          style={{
            background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
            color: isDark ? colors.white : colors.midnightBlack,
          }}
        >
          {loading ? (
            <span className="animate-spin">⏳</span>
          ) : (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="23 4 23 10 17 10" />
              <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
            </svg>
          )}
          {language === 'bg' ? 'Генерирай отново' : 'Regenerate'}
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2">
        <button
          onClick={handleDownload}
          disabled={loading}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium disabled:opacity-50"
          style={{
            background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
            color: isDark ? colors.white : colors.midnightBlack,
          }}
        >
          {loading ? (
            <span className="animate-spin">⏳</span>
          ) : (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
          )}
          {language === 'bg' ? 'Изтегли PDF' : 'Download PDF'}
        </button>

        <button
          onClick={handleGenerateAndUpload}
          disabled={loading}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium disabled:opacity-50"
          style={{ background: colors.forestGreen, color: colors.white }}
        >
          {loading ? (
            <span className="animate-spin">⏳</span>
          ) : (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="12" y1="18" x2="12" y2="12" />
              <line x1="9" y1="15" x2="15" y2="15" />
            </svg>
          )}
          {language === 'bg' ? 'Генерирай и запази' : 'Generate & Save'}
        </button>
      </div>

      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}
    </div>
  );
}

export default GenerateInvoiceButton;
