// TechHub.bg - Authentication & Order API Functions
// Strapi v5 Compatible

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';

// ============================================
// TYPES
// ============================================

export interface User {
  id: number;
  documentId?: string;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  address?: string;
  city?: string;
  postalCode?: string;
  createdAt?: string;
}

export interface PromoCodeData {
  code: string;
  discountPercentage: number;
  discountAmount: number;
  finalAmount: number;
  originalAmount: number;
}

export interface AuthResponse {
  jwt: string;
  user: User;
}

export interface OrderItem {
  id: number;
  name: string;
  nameBg?: string;
  slug: string;
  price: number;
  quantity: number;
  image?: string;
}

export interface ShippingAddress {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  notes?: string;
}

export interface InvoiceDetails {
  companyName: string;
  eik?: string;
  vatNumber?: string;
  mol?: string;
  address: string;
  city?: string;
}

export interface OrderData {
  items: OrderItem[];
  totalAmount: number;
  shippingAddress: ShippingAddress;
  paymentMethod: string;
  wantsInvoice: boolean;
  invoiceDetails?: InvoiceDetails;
}

export interface Invoice {
  id: number;
  documentId?: string;
  invoiceNumber: string;
  issuedDate: string;
  buyerName: string;
  buyerEik?: string;
  buyerVatNumber?: string;
  buyerMol?: string;
  buyerAddress: string;
  buyerCity?: string;
  items: OrderItem[];
  subtotal: number;
  vatAmount: number;
  totalAmount: number;
  invoiceStatus: string;
  pdfFile?: {
    url: string;
  };
}

export interface Order {
  id: number;
  documentId?: string;
  orderNumber: string;
  status: string;
  paymentMethod: string;
  paymentStatus: string;
  totalAmount: number;
originalAmount?: number;
  promoCode?: string | null;
  promoDiscountPercentage?: number;
  promoDiscountAmount?: number;
  items: OrderItem[];
  shippingAddress: ShippingAddress;
  wantsInvoice: boolean;
  invoice?: Invoice;
  createdAt: string;
  updatedAt?: string;
}

export interface OrderResponse {
  id: number;
  documentId?: string;
  orderNumber: string;
}


// ============================================
// HELPER FUNCTIONS
// ============================================

function generateOrderNumber(): string {
  const date = new Date();
  const year = date.getFullYear().toString().slice(-2);
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `TH${year}${month}${day}-${random}`;
}

function generateInvoiceNumber(): string {
  const date = new Date();
  const year = date.getFullYear();
  const random = Math.floor(Math.random() * 100000).toString().padStart(5, '0');
  return `INV-${year}-${random}`;
}

// ============================================
// AUTHENTICATION FUNCTIONS
// ============================================

export async function login(
  identifier: string,
  password: string
): Promise<{ data: AuthResponse | null; error: { message: string } | null }> {
  try {
    const response = await fetch(`${STRAPI_URL}/api/auth/local`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ identifier, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        data: null,
        error: { message: data.error?.message || 'Login failed' },
      };
    }

    return { data, error: null };
  } catch (error) {
    return {
      data: null,
      error: { message: 'Network error. Please try again.' },
    };
  }
}

export async function register(
  username: string,
  email: string,
  password: string,
  additionalData?: {
    firstName?: string;
    lastName?: string;
    phone?: string;
  }
): Promise<{ data: AuthResponse | null; error: { message: string } | null }> {
  try {
    const response = await fetch(`${STRAPI_URL}/api/auth/local/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username,
        email,
        password,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        data: null,
        error: { message: data.error?.message || 'Registration failed' },
      };
    }

    // Update user with additional data if provided
    if (additionalData && data.jwt) {
      try {
        const updateResponse = await fetch(`${STRAPI_URL}/api/users/${data.user.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${data.jwt}`,
          },
          body: JSON.stringify(additionalData),
        });

        if (updateResponse.ok) {
          const updatedUser = await updateResponse.json();
          data.user = { ...data.user, ...updatedUser };
        }
      } catch (updateError) {
        console.error('Failed to update user data:', updateError);
      }
    }

    return { data, error: null };
  } catch (error) {
    return {
      data: null,
      error: { message: 'Network error. Please try again.' },
    };
  }
}

export async function getMe(
  token: string
): Promise<{ data: User | null; error: { message: string } | null }> {
  try {
    const response = await fetch(`${STRAPI_URL}/api/users/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      return {
        data: null,
        error: { message: 'Failed to get user data' },
      };
    }

    const data = await response.json();
    return { data, error: null };
  } catch (error) {
    return {
      data: null,
      error: { message: 'Network error. Please try again.' },
    };
  }
}

export async function updateProfile(
  token: string,
  userId: number,
  userData: Partial<User>
): Promise<{ data: User | null; error: { message: string } | null }> {
  try {
    const response = await fetch(`${STRAPI_URL}/api/users/${userId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return {
        data: null,
        error: { message: errorData.error?.message || 'Failed to update profile' },
      };
    }

    const data = await response.json();
    return { data, error: null };
  } catch (error) {
    return {
      data: null,
      error: { message: 'Network error. Please try again.' },
    };
  }
}

export async function changePassword(
  token: string,
  currentPassword: string,
  newPassword: string
): Promise<{ success: boolean; error: { message: string } | null }> {
  try {
    // First verify current password
    const meResponse = await fetch(`${STRAPI_URL}/api/users/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!meResponse.ok) {
      return {
        success: false,
        error: { message: 'Failed to verify user' },
      };
    }

    const user = await meResponse.json();

    // Try to login with current password to verify
    const loginCheck = await fetch(`${STRAPI_URL}/api/auth/local`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        identifier: user.email,
        password: currentPassword,
      }),
    });

    if (!loginCheck.ok) {
      return {
        success: false,
        error: { message: 'Current password is incorrect' },
      };
    }

    // Update password
    const response = await fetch(`${STRAPI_URL}/api/users/${user.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        password: newPassword,
      }),
    });

    if (!response.ok) {
      return {
        success: false,
        error: { message: 'Failed to change password' },
      };
    }

    return { success: true, error: null };
  } catch (error) {
    return {
      success: false,
      error: { message: 'Network error. Please try again.' },
    };
  }
}

export async function forgotPassword(
  email: string
): Promise<{ success: boolean; error: { message: string } | null }> {
  try {
    const response = await fetch(`${STRAPI_URL}/api/auth/forgot-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });

    if (!response.ok) {
      const data = await response.json();
      return {
        success: false,
        error: { message: data.error?.message || 'Failed to send reset email' },
      };
    }

    return { success: true, error: null };
  } catch (error) {
    return {
      success: false,
      error: { message: 'Network error. Please try again.' },
    };
  }
}

export async function resetPassword(
  code: string,
  password: string,
  passwordConfirmation: string
): Promise<{ data: AuthResponse | null; error: { message: string } | null }> {
  try {
    const response = await fetch(`${STRAPI_URL}/api/auth/reset-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        code,
        password,
        passwordConfirmation,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        data: null,
        error: { message: data.error?.message || 'Failed to reset password' },
      };
    }

    return { data, error: null };
  } catch (error) {
    return {
      data: null,
      error: { message: 'Network error. Please try again.' },
    };
  }
}

// ============================================
// ORDER FUNCTIONS
// ============================================
export async function createOrder(
  token: string,
  orderData: OrderData & { promoCode?: PromoCodeData | null }
): Promise<{ data: OrderResponse | null; error: { message: string } | null }> {
  try {
    const orderNumber = generateOrderNumber();

    // Get the current user
    const userResponse = await fetch(`${STRAPI_URL}/api/users/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!userResponse.ok) {
      return {
        data: null,
        error: { message: 'Failed to get user information' },
      };
    }

    const user = await userResponse.json();

    // Prepare order notes from shipping notes
    const orderNotes = orderData.shippingAddress.notes || '';
// Calculate amounts with promo
const promoDiscountAmount = orderData.promoCode?.discountAmount || 0;
const promoDiscountPercentage = orderData.promoCode?.discountPercentage || 0;
const finalAmount = orderData.totalAmount; // totalAmount is already after promo
const originalAmount = orderData.promoCode 
  ? finalAmount + promoDiscountAmount  // Add back discount to get original
  : finalAmount;

    // Create the order with user linked directly using connect syntax
    const response = await fetch(`${STRAPI_URL}/api/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        data: {
          orderNumber,
          orderStatus: 'pending',
          paymentMethod: orderData.paymentMethod,
          paymentStatus: 'pending',
originalAmount: originalAmount,
    totalAmount: finalAmount,
    promoCode: orderData.promoCode?.code || null,
    promoDiscountPercentage: promoDiscountPercentage,
    promoDiscountAmount: promoDiscountAmount,
          items: orderData.items,
          shippingAddress: orderData.shippingAddress,
          wantsInvoice: orderData.wantsInvoice,
          notes: orderNotes,
          // Link user directly using connect syntax for Strapi v5 link tables
          users_permissions_user: {
            connect: [user.id]
          },
          publishedAt: new Date().toISOString(),
        },
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      console.error('Order creation error:', result);
      return {
        data: null,
        error: { message: result.error?.message || 'Failed to create order' },
      };
    }

    const orderId = result.data?.id;
    const orderDocumentId = result.data?.documentId;

    // Create invoice if requested
    if (orderData.wantsInvoice && orderData.invoiceDetails) {
      const invoiceNumber = generateInvoiceNumber();
const subtotal = finalAmount / 1.2;

      const vatAmount = orderData.totalAmount - subtotal;

      try {
        const invoiceResponse = await fetch(`${STRAPI_URL}/api/invoice-clients`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            data: {
              invoiceNumber,
              issuedDate: new Date().toISOString(),
              buyerName: orderData.invoiceDetails.companyName,
              buyerEik: orderData.invoiceDetails.eik || null,
              buyerVatNumber: orderData.invoiceDetails.vatNumber || null,
              buyerAddress: orderData.invoiceDetails.address,
              buyerCity: orderData.invoiceDetails.city || null,
              buyerMol: orderData.invoiceDetails.mol || null,
              items: orderData.items,
              subtotal: parseFloat(subtotal.toFixed(2)),
              vatAmount: parseFloat(vatAmount.toFixed(2)),
totalAmount: finalAmount,

              invoiceStatus: 'draft',
              publishedAt: new Date().toISOString(),
            },
          }),
        });

        const invoiceResult = await invoiceResponse.json();

        if (invoiceResponse.ok && invoiceResult.data) {
          const invoiceId = invoiceResult.data.id;

          // FIXED: Link the invoice back to the order using Strapi v5 connect syntax
          await fetch(`${STRAPI_URL}/api/orders/${orderDocumentId}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              data: {
                invoice_client: {
                  connect: [invoiceId]
                }
              },
            }),
          });

          console.log('✅ Invoice linked to order:', invoiceId, '→', orderDocumentId);
        }
      } catch (invoiceError) {
        console.error('Invoice creation error:', invoiceError);
        // Don't fail the order if invoice creation fails
      }
    }

    return {
      data: {
        id: orderId,
        documentId: orderDocumentId,
        orderNumber,
      },
      error: null,
    };
  } catch (error) {
    console.error('Create order error:', error);
    return {
      data: null,
      error: { message: 'Network error. Please try again.' },
    };
  }
}


export async function getOrders(
  token: string
): Promise<{ data: Order[] | null; error: { message: string } | null }> {
  try {
    const userResponse = await fetch(`${STRAPI_URL}/api/users/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    
    if (!userResponse.ok) {
      return { data: null, error: { message: 'Failed to get user information' } };
    }
    
    const user = await userResponse.json();

    // Use the exact populate syntax we tested and know works
    const response = await fetch(
      `${STRAPI_URL}/api/orders?sort[0]=createdAt:desc&populate=users_permissions_user&populate=invoice_client`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    if (!response.ok) {
      console.error('Failed to fetch orders:', response.status);
      return { data: null, error: { message: 'Failed to fetch orders' } };
    }

    const result = await response.json();

    // Map and filter orders for current user
    const orders: Order[] = (result.data || [])
      .filter((item: any) => {
        // Only show orders linked to current user
        return item.users_permissions_user && item.users_permissions_user.id === user.id;
      })
      .map((item: any) => {
        const invoiceData = item.invoice_client;

        return {
          id: item.id,
          documentId: item.documentId,
          orderNumber: item.orderNumber,
          status: item.orderStatus || 'pending',
          paymentMethod: item.paymentMethod,
          paymentStatus: item.paymentStatus || 'pending',
          totalAmount: parseFloat(item.totalAmount) || 0,
          items: item.items || [],
          shippingAddress: item.shippingAddress || {},
          wantsInvoice: item.wantsInvoice || false,
          invoice: invoiceData ? {
            id: invoiceData.id,
            documentId: invoiceData.documentId,
            invoiceNumber: invoiceData.invoiceNumber,
            issuedDate: invoiceData.issuedDate,
            buyerName: invoiceData.buyerName,
            buyerEik: invoiceData.buyerEik,
            buyerVatNumber: invoiceData.buyerVatNumber,
            buyerMol: invoiceData.buyerMol,
            buyerAddress: invoiceData.buyerAddress,
            buyerCity: invoiceData.buyerCity,
            items: invoiceData.items || [],
            subtotal: parseFloat(invoiceData.subtotal) || 0,
            vatAmount: parseFloat(invoiceData.vatAmount) || 0,
            totalAmount: parseFloat(invoiceData.totalAmount) || 0,
            invoiceStatus: invoiceData.invoiceStatus,
            pdfFile: invoiceData.pdfFile,
          } : undefined,
          createdAt: item.createdAt,
          updatedAt: item.updatedAt,
        };
      });

    return { data: orders, error: null };
  } catch (error) {
    console.error('Get orders error:', error);
    return { data: null, error: { message: 'Network error. Please try again.' } };
  }
}

export async function getOrderById(
  token: string,
  orderId: string | number // Can accept either documentId or numeric id
): Promise<{ data: Order | null; error: { message: string } | null }> {
  try {
    // Use correct populate syntax that we know works
    const response = await fetch(
      `${STRAPI_URL}/api/orders/${orderId}?populate=users_permissions_user&populate=invoice_client`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      console.error('Failed to fetch order:', response.status);
      return {
        data: null,
        error: { message: 'Failed to fetch order' },
      };
    }

    const result = await response.json();
    const item = result.data;

    if (!item) {
      return {
        data: null,
        error: { message: 'Order not found' },
      };
    }

    const invoiceData = item.invoice_client;

    const order: Order = {
      id: item.id,
      documentId: item.documentId,
      orderNumber: item.orderNumber,
      status: item.orderStatus || 'pending',
      paymentMethod: item.paymentMethod,
      paymentStatus: item.paymentStatus || 'pending',
      totalAmount: parseFloat(item.totalAmount) || 0,
originalAmount: item.originalAmount || item.totalAmount,
    promoCode: item.promoCode || null,
    promoDiscountPercentage: item.promoDiscountPercentage || 0,
    promoDiscountAmount: item.promoDiscountAmount || 0,
      items: item.items || [],
      shippingAddress: item.shippingAddress || {},
      wantsInvoice: item.wantsInvoice || false,
      invoice: invoiceData ? {
        id: invoiceData.id,
        documentId: invoiceData.documentId,
        invoiceNumber: invoiceData.invoiceNumber,
        issuedDate: invoiceData.issuedDate,
        buyerName: invoiceData.buyerName,
        buyerEik: invoiceData.buyerEik,
        buyerVatNumber: invoiceData.buyerVatNumber,
        buyerMol: invoiceData.buyerMol,
        buyerAddress: invoiceData.buyerAddress,
        buyerCity: invoiceData.buyerCity,
        items: invoiceData.items || [],
        subtotal: parseFloat(invoiceData.subtotal) || 0,
        vatAmount: parseFloat(invoiceData.vatAmount) || 0,
        totalAmount: parseFloat(invoiceData.totalAmount) || 0,
        invoiceStatus: invoiceData.invoiceStatus,
        pdfFile: invoiceData.pdfFile,
      } : undefined,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
    };

    return { data: order, error: null };
  } catch (error) {
    console.error('Get order by ID error:', error);
    return {
      data: null,
      error: { message: 'Network error. Please try again.' },
    };
  }
}

// ============================================
// INVOICE PDF FUNCTIONS
// ============================================

export async function generateInvoicePDF(
  token: string,
  params: {
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
  }
): Promise<{ success: boolean; error?: string }> {
  try {
    // Step 1: Generate PDF via our API route
    const pdfResponse = await fetch('/api/invoice/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        invoiceNumber: params.invoiceNumber,
        issuedDate: params.issuedDate,
        buyer: params.buyer,
        items: params.items,
        subtotal: params.subtotal,
        vatAmount: params.vatAmount,
        total: params.total,
        paymentMethod: params.paymentMethod,
        orderNumber: params.orderNumber,
      }),
    });

    if (!pdfResponse.ok) {
      return { success: false, error: 'Failed to generate PDF' };
    }

    // Step 2: Get PDF as blob
    const pdfBlob = await pdfResponse.blob();

    // Step 3: Upload to Strapi media library
    const formData = new FormData();
    formData.append('files', pdfBlob, `invoice-${params.invoiceNumber}.pdf`);
    formData.append('ref', 'api::invoice-client.invoice-client');
    formData.append('refId', params.invoiceId.toString());
    formData.append('field', 'pdfFile');

    const uploadResponse = await fetch(`${STRAPI_URL}/api/upload`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (!uploadResponse.ok) {
      console.error('Upload failed:', await uploadResponse.text());
      return { success: false, error: 'Failed to upload PDF to server' };
    }

    // Step 4: Update invoice status to 'issued'
    await fetch(`${STRAPI_URL}/api/invoice-clients/${params.invoiceId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        data: {
          invoiceStatus: 'issued',
        },
      }),
    });

    return { success: true };
  } catch (error) {
    console.error('Invoice generation error:', error);
    return { success: false, error: 'Network error' };
  }
}

export async function downloadInvoicePDF(params: {
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
}): Promise<void> {
  try {
    const response = await fetch('/api/invoice/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    });

    if (!response.ok) {
      throw new Error('Failed to generate PDF');
    }

    // Get the PDF blob
    const blob = await response.blob();

    // Create download link
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `invoice-${params.invoiceNumber}.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Download error:', error);
    throw error;
  }
}
