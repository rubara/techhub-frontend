import { NextRequest, NextResponse } from 'next/server';
import jsPDF from 'jspdf';
import { robotoregularBase64 } from '@/fonts/roboto-regular';
import { robotoboldBase64 } from '@/fonts/roboto-bold';

interface InvoiceItem {
  name: string;
  nameBg?: string;
  quantity: number;
  price: number;
}

const DEFAULT_SELLER = {
  name: 'TekHub BG EOOD',
  eik: '123456789',
  vatNumber: 'BG123456789',
  mol: 'Ivan Ivanov',
  address: 'bul. Vitosha 100',
  city: 'Sofia 1000',
  phone: '+359 2 123 4567',
  email: 'info@techhub.bg',
  bank: 'Unicredit Bulbank',
  iban: 'BG80UNCR96601234567890',
  bic: 'UNCRBGSF',
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('📄 Invoice generation request:', { invoiceNumber: body.invoiceNumber });

    const {
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
    } = body;

    if (!invoiceNumber || !buyer || !items || items.length === 0) {
      console.error('❌ Missing required fields');
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const calculatedSubtotal = subtotal || items.reduce((sum: number, item: any) => sum + item.price * item.quantity, 0);
    const calculatedVat = vatAmount || (calculatedSubtotal * 0.2);
    const calculatedTotal = total || (calculatedSubtotal * 1.2);

    console.log('✅ Generating PDF with jsPDF and Cyrillic support...');

    const doc = new jsPDF();
    
    // Add custom font with Cyrillic support
    try {
      doc.addFileToVFS('Roboto-Regular.ttf', robotoregularBase64);
      doc.addFont('Roboto-Regular.ttf', 'Roboto', 'normal');
      doc.addFileToVFS('Roboto-Bold.ttf', robotoboldBase64);
      doc.addFont('Roboto-Bold.ttf', 'Roboto', 'bold');
      doc.setFont('Roboto');
      console.log('✅ Cyrillic font loaded');
    } catch (fontError) {
      console.error('⚠️ Font loading failed, using default:', fontError);
      // Will fall back to default font
    }

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const leftMargin = 15;
    const rightMargin = pageWidth - 15;
    let yPos = 20;

    // HEADER - Left Side
    doc.setFontSize(24);
    doc.setFont('Roboto', 'bold');
    doc.text('TechHub.bg', leftMargin, yPos);

    yPos += 8;
    doc.setFontSize(10);
    doc.setFont('Roboto', 'normal');
    doc.text('Computer Hardware & Peripherals', leftMargin, yPos);

    // HEADER - Right Side
    let rightYPos = 20;
    doc.setFontSize(20);
    doc.setFont('Roboto', 'bold');
    doc.setTextColor(0, 181, 83); // Green color
    doc.text('INVOICE / FAKTURA', rightMargin, rightYPos, { align: 'right' });

    rightYPos += 8;
    doc.setTextColor(0, 0, 0); // Back to black
    doc.setFontSize(12);
    doc.setFont('Roboto', 'normal');
    doc.text(`No. ${invoiceNumber}`, rightMargin, rightYPos, { align: 'right' });

    rightYPos += 7;
    const formattedDate = new Date(issuedDate || new Date()).toLocaleDateString('en-GB');
    doc.setFontSize(10);
    doc.text(`Date: ${formattedDate}`, rightMargin, rightYPos, { align: 'right' });

    if (orderNumber) {
      rightYPos += 6;
      doc.setTextColor(100, 100, 100);
      doc.text(`Order: ${orderNumber}`, rightMargin, rightYPos, { align: 'right' });
      doc.setTextColor(0, 0, 0);
    }

    // Line separator
    yPos = 50;
    doc.setDrawColor(200, 200, 200);
    doc.line(leftMargin, yPos, rightMargin, yPos);

    // SELLER INFO - Left Column
    yPos = 60;
    doc.setFontSize(10);
    doc.setFont('Roboto', 'bold');
    doc.text('SELLER / DOSTAVCHIK:', leftMargin, yPos);

    yPos += 6;
    doc.setFont('Roboto', 'normal');
    doc.text(DEFAULT_SELLER.name, leftMargin, yPos);

    yPos += 5;
    doc.text(`EIK: ${DEFAULT_SELLER.eik}`, leftMargin, yPos);

    yPos += 5;
    doc.text(`VAT: ${DEFAULT_SELLER.vatNumber}`, leftMargin, yPos);

    yPos += 5;
    doc.text(`MOL: ${DEFAULT_SELLER.mol}`, leftMargin, yPos);

    yPos += 5;
    doc.text(DEFAULT_SELLER.address, leftMargin, yPos);

    yPos += 5;
    doc.text(DEFAULT_SELLER.city, leftMargin, yPos);

    // BUYER INFO - Right Column
    let buyerY = 60;
    const buyerX = 105;
    doc.setFont('Roboto', 'bold');
    doc.text('BUYER / POLUCHATEL:', buyerX, buyerY);

    buyerY += 6;
    doc.setFont('Roboto', 'normal');
    doc.text(buyer.name || buyer.companyName, buyerX, buyerY);

    if (buyer.eik) {
      buyerY += 5;
      doc.text(`EIK: ${buyer.eik}`, buyerX, buyerY);
    }

    if (buyer.vatNumber) {
      buyerY += 5;
      doc.text(`VAT: ${buyer.vatNumber}`, buyerX, buyerY);
    }

    if (buyer.mol) {
      buyerY += 5;
      doc.text(`MOL: ${buyer.mol}`, buyerX, buyerY);
    }

    buyerY += 5;
    // Wrap address if too long
    const addressLines = doc.splitTextToSize(buyer.address, 85);
    addressLines.forEach((line: string) => {
      doc.text(line, buyerX, buyerY);
      buyerY += 5;
    });

    if (buyer.city) {
      doc.text(buyer.city, buyerX, buyerY);
      buyerY += 5;
    }

    // ITEMS TABLE
    yPos = Math.max(yPos, buyerY) + 10;

    // Table header
    doc.setFillColor(245, 245, 245);
    doc.rect(leftMargin, yPos - 4, rightMargin - leftMargin, 7, 'F');

    doc.setFontSize(9);
    doc.setFont('Roboto', 'bold');
    doc.text('No.', leftMargin + 2, yPos);
    doc.text('Description', leftMargin + 15, yPos);
    doc.text('Qty', leftMargin + 115, yPos, { align: 'center' });
    doc.text('Price', leftMargin + 140, yPos, { align: 'right' });
    doc.text('Total', rightMargin - 5, yPos, { align: 'right' });

    yPos += 7;
    doc.setFont('Roboto', 'normal');
    doc.setFontSize(8);

    // Items rows
    items.forEach((item: InvoiceItem, index: number) => {
      // Check if we need a new page
      if (yPos > pageHeight - 80) {
        doc.addPage();
        yPos = 20;
      }

      if (index % 2 === 0) {
        doc.setFillColor(250, 250, 250);
        doc.rect(leftMargin, yPos - 4, rightMargin - leftMargin, 6, 'F');
      }

      // Use Bulgarian name if available, otherwise English
      const itemName = (item.nameBg || item.name);
      const truncatedName = itemName.length > 55 ? itemName.substring(0, 52) + '...' : itemName;
      const itemTotal = item.price * item.quantity;

      doc.text((index + 1).toString(), leftMargin + 2, yPos);
      doc.text(truncatedName, leftMargin + 15, yPos);
      doc.text(item.quantity.toString(), leftMargin + 115, yPos, { align: 'center' });
      doc.text(`${item.price.toFixed(2)}`, leftMargin + 140, yPos, { align: 'right' });
      doc.text(`${itemTotal.toFixed(2)}`, rightMargin - 5, yPos, { align: 'right' });

      yPos += 6;
    });

    // Line after items
    yPos += 2;
    doc.setDrawColor(200, 200, 200);
    doc.line(leftMargin, yPos, rightMargin, yPos);

    // TOTALS
    yPos += 8;
    const labelX = rightMargin - 80;
    const valueX = rightMargin - 5;

    doc.setFontSize(10);
    doc.setFont('Roboto', 'normal');
    doc.text('Tax Base:', labelX, yPos);
    doc.text(`${calculatedSubtotal.toFixed(2)} BGN`, valueX, yPos, { align: 'right' });

    yPos += 6;

    // ADD PROMO DISCOUNT LINE IF APPLICABLE
    if (promoCode && promoDiscount && promoDiscount > 0) {
      doc.setTextColor(0, 181, 83); // Green for discount
      doc.text(`Promo (${promoCode}):`, labelX, yPos);
      doc.text(`-${promoDiscount.toFixed(2)} BGN`, valueX, yPos, { align: 'right' });
      doc.setTextColor(0, 0, 0); // Back to black
      yPos += 6;
    }

    doc.text('VAT (20%):', labelX, yPos);
    doc.text(`${calculatedVat.toFixed(2)} BGN`, valueX, yPos, { align: 'right' });

    yPos += 2;
    doc.setDrawColor(0, 0, 0);
    doc.line(labelX, yPos, rightMargin, yPos);

    yPos += 6;
    doc.setFont('Roboto', 'bold');
    doc.setFontSize(12);
    doc.text('TOTAL:', labelX, yPos);
    doc.setTextColor(0, 181, 83); // Green
    doc.text(`${calculatedTotal.toFixed(2)} BGN`, valueX, yPos, { align: 'right' });
    doc.setTextColor(0, 0, 0); // Back to black

    // PAYMENT METHOD
    yPos += 15;
    doc.setFont('Roboto', 'bold');
    doc.setFontSize(10);
    doc.text('PAYMENT METHOD:', leftMargin, yPos);

    const paymentLabels: Record<string, string> = {
      cod: 'Cash on Delivery',
      card: 'Credit/Debit Card',
      bank: 'Bank Transfer',
    };

    yPos += 6;
    doc.setFont('Roboto', 'normal');
    doc.text(paymentLabels[paymentMethod] || paymentMethod, leftMargin, yPos);

    if (paymentMethod === 'bank') {
      yPos += 10;
      doc.setFont('Roboto', 'bold');
      doc.text('BANK DETAILS:', leftMargin, yPos);

      yPos += 6;
      doc.setFont('Roboto', 'normal');
      doc.text(`Bank: ${DEFAULT_SELLER.bank}`, leftMargin, yPos);

      yPos += 5;
      doc.text(`IBAN: ${DEFAULT_SELLER.iban}`, leftMargin, yPos);

      yPos += 5;
      doc.text(`BIC: ${DEFAULT_SELLER.bic}`, leftMargin, yPos);
    }

    // FOOTER - Fixed position at bottom
    const footerY = pageHeight - 35;

    doc.setFontSize(9);
    doc.setFont('Roboto', 'normal');

    // Left signature
    doc.text('Prepared by:', leftMargin, footerY);
    doc.line(leftMargin + 25, footerY + 8, leftMargin + 60, footerY + 8);
    doc.setFontSize(7);
    doc.text('(signature)', leftMargin + 32, footerY + 12);

    // Right signature
    doc.setFontSize(9);
    const rightSigX = 120;
    doc.text('Received by:', rightSigX, footerY);
    doc.line(rightSigX + 25, footerY + 8, rightSigX + 60, footerY + 8);
    doc.setFontSize(7);
    doc.text('(signature)', rightSigX + 32, footerY + 12);

    // Footer text
    doc.setFontSize(7);
    doc.setTextColor(100, 100, 100);
    doc.text(
      'This invoice is issued electronically and is valid without signature.',
      pageWidth / 2,
      footerY + 18,
      { align: 'center' }
    );
    doc.text(
      `TechHub.bg | ${DEFAULT_SELLER.email} | ${DEFAULT_SELLER.phone}`,
      pageWidth / 2,
      footerY + 22,
      { align: 'center' }
    );

    // Generate PDF
    const pdfBuffer = Buffer.from(doc.output('arraybuffer'));
    console.log('✅ PDF generated successfully with Cyrillic support, size:', pdfBuffer.length, 'bytes');

    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="invoice-${invoiceNumber}.pdf"`,
        'Content-Length': pdfBuffer.length.toString(),
      },
    });
  } catch (error: any) {
    console.error('❌ Invoice generation error:', error);
    console.error('Error stack:', error.stack);
    return NextResponse.json(
      { error: 'Failed to generate invoice', details: error.message },
      { status: 500 }
    );
  }
}
