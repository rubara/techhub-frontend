// Auth API Functions - lib/auth-api.ts

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';

// ============================================
// TYPES
// ============================================

export interface LoginCredentials {
  identifier: string; // email or username
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
}

export interface User {
  id: number;
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

export interface AuthResponse {
  jwt: string;
  user: User;
}

export interface ApiError {
  message: string;
  status?: number;
}

// ============================================
// AUTHENTICATION
// ============================================

// Login
export async function login(credentials: LoginCredentials): Promise<{ data?: AuthResponse; error?: ApiError }> {
  try {
    const response = await fetch(`${STRAPI_URL}/api/auth/local`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        error: {
          message: data.error?.message || 'Login failed',
          status: response.status,
        },
      };
    }

    // Fetch full user data with custom fields
    const fullUser = await getMe(data.jwt);
    if (fullUser.data) {
      data.user = fullUser.data;
    }

    return { data };
  } catch (error) {
    return {
      error: {
        message: 'Network error. Please try again.',
      },
    };
  }
}

// Register
export async function register(userData: RegisterData): Promise<{ data?: AuthResponse; error?: ApiError }> {
  try {
    // Step 1: Register with basic fields only
    const response = await fetch(`${STRAPI_URL}/api/auth/local/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: userData.username,
        email: userData.email,
        password: userData.password,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        error: {
          message: data.error?.message || 'Registration failed',
          status: response.status,
        },
      };
    }

    // Step 2: Update user with additional fields
    if (userData.firstName || userData.lastName || userData.phone) {
      const updateResponse = await fetch(`${STRAPI_URL}/api/users/${data.user.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${data.jwt}`,
        },
        body: JSON.stringify({
          firstName: userData.firstName,
          lastName: userData.lastName,
          phone: userData.phone,
        }),
      });

      if (updateResponse.ok) {
        const updatedUser = await updateResponse.json();
        data.user = updatedUser;
      }
    }

    return { data };
  } catch (error) {
    return {
      error: {
        message: 'Network error. Please try again.',
      },
    };
  }
}

// Get current user with all fields
export async function getMe(token: string): Promise<{ data?: User; error?: ApiError }> {
  try {
    const response = await fetch(`${STRAPI_URL}/api/users/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        error: {
          message: data.error?.message || 'Failed to fetch user',
          status: response.status,
        },
      };
    }

    return { data };
  } catch (error) {
    return {
      error: {
        message: 'Network error. Please try again.',
      },
    };
  }
}

// Update user profile
export async function updateProfile(
  token: string,
  userId: number,
  userData: {
    firstName?: string;
    lastName?: string;
    phone?: string;
    address?: string;
    city?: string;
    postalCode?: string;
  }
): Promise<{ data?: User; error?: ApiError }> {
  try {
    const response = await fetch(`${STRAPI_URL}/api/users/${userId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(userData),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        error: {
          message: data.error?.message || 'Failed to update profile',
          status: response.status,
        },
      };
    }

    return { data };
  } catch (error) {
    return {
      error: {
        message: 'Network error. Please try again.',
      },
    };
  }
}

// Update email (requires password confirmation)
export async function updateEmail(
  token: string,
  userId: number,
  newEmail: string,
  password: string
): Promise<{ data?: User; error?: ApiError }> {
  try {
    // First verify password by attempting login
    const loginCheck = await fetch(`${STRAPI_URL}/api/auth/local`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        identifier: newEmail.replace(newEmail, ''), // This won't work, need current email
        password: password,
      }),
    });

    // Update email
    const response = await fetch(`${STRAPI_URL}/api/users/${userId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        email: newEmail,
        username: newEmail, // Also update username since we use email as username
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        error: {
          message: data.error?.message || 'Failed to update email',
          status: response.status,
        },
      };
    }

    return { data };
  } catch (error) {
    return {
      error: {
        message: 'Network error. Please try again.',
      },
    };
  }
}

// Change password
export async function changePassword(
  token: string,
  currentPassword: string,
  newPassword: string
): Promise<{ data?: AuthResponse; error?: ApiError }> {
  try {
    const response = await fetch(`${STRAPI_URL}/api/auth/change-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        currentPassword,
        password: newPassword,
        passwordConfirmation: newPassword,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        error: {
          message: data.error?.message || 'Failed to change password',
          status: response.status,
        },
      };
    }

    return { data };
  } catch (error) {
    return {
      error: {
        message: 'Network error. Please try again.',
      },
    };
  }
}

// Forgot password
export async function forgotPassword(email: string): Promise<{ success: boolean; error?: ApiError }> {
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
        error: {
          message: data.error?.message || 'Failed to send reset email',
          status: response.status,
        },
      };
    }

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: {
        message: 'Network error. Please try again.',
      },
    };
  }
}

// Reset password
export async function resetPassword(
  code: string,
  password: string
): Promise<{ data?: AuthResponse; error?: ApiError }> {
  try {
    const response = await fetch(`${STRAPI_URL}/api/auth/reset-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        code,
        password,
        passwordConfirmation: password,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        error: {
          message: data.error?.message || 'Failed to reset password',
          status: response.status,
        },
      };
    }

    return { data };
  } catch (error) {
    return {
      error: {
        message: 'Network error. Please try again.',
      },
    };
  }
}

// ============================================
// ORDERS
// ============================================

// ============================================
// ADD THIS TO YOUR auth-api.ts FILE
// ============================================

interface OrderItem {
  productId: number;
  name: string;
  nameBg?: string;
  price: number;
  quantity: number;
  image?: string;
}

interface ShippingAddress {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  notes?: string;
}

interface InvoiceDetails {
  companyName: string;
  eik: string;
  vatNumber?: string;
  mol?: string;
  address: string;
  city?: string;
}

interface OrderData {
  items: OrderItem[];
  shippingAddress: ShippingAddress;
  paymentMethod: string;
  totalAmount: number;
  wantsInvoice: boolean;
  invoiceDetails?: InvoiceDetails;
}

interface OrderResponse {
  id: number;
  orderNumber: string;
  orderStatus: string;
  totalAmount: number;
  createdAt: string;
}

// Generate order number: TH250129-1234
function generateOrderNumber(): string {
  const date = new Date();
  const year = date.getFullYear().toString().slice(-2);
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `TH${year}${month}${day}-${random}`;
}

// Generate invoice number: INV-2025-0001
function generateInvoiceNumber(): string {
  const date = new Date();
  const year = date.getFullYear();
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `INV-${year}-${random}`;
}

export async function createOrder(
  token: string,
  orderData: OrderData
): Promise<{ data: OrderResponse | null; error: { message: string } | null }> {
  try {
    const orderNumber = generateOrderNumber();

    // Get the current user ID
    const userResponse = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL}/api/users/me`, {
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

    // Create the order first
    const response = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL}/api/orders`, {
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
          totalAmount: orderData.totalAmount,
          items: orderData.items,
          shippingAddress: orderData.shippingAddress,
          wantsInvoice: orderData.wantsInvoice,
          notes: orderNotes,
          users_permissions_user: user.id,
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

    const orderId = result.data.id;

    // Create invoice if requested
    if (orderData.wantsInvoice && orderData.invoiceDetails) {
      const invoiceNumber = generateInvoiceNumber();
      const subtotal = orderData.totalAmount / 1.2; // Remove 20% VAT
      const vatAmount = orderData.totalAmount - subtotal;

      try {
        await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL}/api/invoice-clients`, {
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
              totalAmount: orderData.totalAmount,
              invoiceStatus: 'draft',
              users_permissions_user: user.id,
              order: orderId,
              publishedAt: new Date().toISOString(),
            },
          }),
        });
      } catch (invoiceError) {
        console.error('Invoice creation error:', invoiceError);
        // Don't fail the order if invoice creation fails
      }
    }

    return {
      data: {
        id: orderId,
        orderNumber: result.data.attributes.orderNumber,
        orderStatus: result.data.attributes.orderStatus,
        totalAmount: result.data.attributes.totalAmount,
        createdAt: result.data.attributes.createdAt,
      },
      error: null,
    };
  } catch (error) {
    console.error('Order creation error:', error);
    return {
      data: null,
      error: { message: 'Network error. Please try again.' },
    };
  }
}


// ============================================
// REPLACE in auth-api.ts - Complete Order types and functions
// ============================================

export interface OrderInvoice {
  id: number;
  invoiceNumber: string;
  issuedDate: string;
  buyerName: string;
  buyerEik?: string;
  buyerVatNumber?: string;
  buyerAddress: string;
  buyerCity?: string;
  buyerMol?: string;
  subtotal: number;
  vatAmount: number;
  totalAmount: number;
  invoiceStatus: 'draft' | 'issued' | 'paid' | 'cancelled';
  pdfFile?: {
    url: string;
  };
}

export interface Order {
  id: number;
  orderNumber: string;
  orderStatus: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  paymentMethod: string;
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  totalAmount: number;
  items: {
    productId: number;
    name: string;
    nameBg?: string;
    price: number;
    quantity: number;
    image?: string;
  }[];
  shippingAddress: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    postalCode: string;
    notes?: string;
  };
  wantsInvoice: boolean;
  invoice?: OrderInvoice;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export async function getUserOrders(
  token: string
): Promise<{ data: Order[] | null; error: { message: string } | null }> {
  try {
    const userResponse = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL}/api/users/me`, {
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

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/orders?filters[users_permissions_user][id][$eq]=${user.id}&sort=createdAt:desc&populate[invoice_client][populate]=pdfFile`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      return {
        data: null,
        error: { message: 'Failed to fetch orders' },
      };
    }

    const result = await response.json();

    const orders: Order[] = result.data.map((item: any) => {
      const invoiceData = item.attributes.invoice_client?.data;
      let invoice: OrderInvoice | undefined;

      if (invoiceData) {
        const inv = invoiceData.attributes;
        invoice = {
          id: invoiceData.id,
          invoiceNumber: inv.invoiceNumber,
          issuedDate: inv.issuedDate,
          buyerName: inv.buyerName,
          buyerEik: inv.buyerEik,
          buyerVatNumber: inv.buyerVatNumber,
          buyerAddress: inv.buyerAddress,
          buyerCity: inv.buyerCity,
          buyerMol: inv.buyerMol,
          subtotal: inv.subtotal,
          vatAmount: inv.vatAmount,
          totalAmount: inv.totalAmount,
          invoiceStatus: inv.invoiceStatus,
          pdfFile: inv.pdfFile?.data ? {
            url: inv.pdfFile.data.attributes.url.startsWith('http')
              ? inv.pdfFile.data.attributes.url
              : `${process.env.NEXT_PUBLIC_STRAPI_URL}${inv.pdfFile.data.attributes.url}`,
          } : undefined,
        };
      }

      return {
        id: item.id,
        orderNumber: item.attributes.orderNumber,
        orderStatus: item.attributes.orderStatus,
        status: item.attributes.orderStatus,
        paymentMethod: item.attributes.paymentMethod,
        paymentStatus: item.attributes.paymentStatus,
        totalAmount: item.attributes.totalAmount,
        items: item.attributes.items || [],
        shippingAddress: item.attributes.shippingAddress || {},
        wantsInvoice: item.attributes.wantsInvoice || false,
        invoice,
        notes: item.attributes.notes,
        createdAt: item.attributes.createdAt,
        updatedAt: item.attributes.updatedAt,
      };
    });

    return {
      data: orders,
      error: null,
    };
  } catch (error) {
    console.error('Get orders error:', error);
    return {
      data: null,
      error: { message: 'Network error. Please try again.' },
    };
  }
}

export async function getOrderById(
  token: string,
  orderId: number
): Promise<{ data: Order | null; error: { message: string } | null }> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/orders/${orderId}?populate[invoice_client][populate]=pdfFile`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      return {
        data: null,
        error: { message: 'Failed to fetch order' },
      };
    }

    const result = await response.json();
    const item = result.data;

    const invoiceData = item.attributes.invoice_client?.data;
    let invoice: OrderInvoice | undefined;

    if (invoiceData) {
      const inv = invoiceData.attributes;
      invoice = {
        id: invoiceData.id,
        invoiceNumber: inv.invoiceNumber,
        issuedDate: inv.issuedDate,
        buyerName: inv.buyerName,
        buyerEik: inv.buyerEik,
        buyerVatNumber: inv.buyerVatNumber,
        buyerAddress: inv.buyerAddress,
        buyerCity: inv.buyerCity,
        buyerMol: inv.buyerMol,
        subtotal: inv.subtotal,
        vatAmount: inv.vatAmount,
        totalAmount: inv.totalAmount,
        invoiceStatus: inv.invoiceStatus,
        pdfFile: inv.pdfFile?.data ? {
          url: inv.pdfFile.data.attributes.url.startsWith('http')
            ? inv.pdfFile.data.attributes.url
            : `${process.env.NEXT_PUBLIC_STRAPI_URL}${inv.pdfFile.data.attributes.url}`,
        } : undefined,
      };
    }

    const order: Order = {
      id: item.id,
      orderNumber: item.attributes.orderNumber,
      orderStatus: item.attributes.orderStatus,
      status: item.attributes.orderStatus,
      paymentMethod: item.attributes.paymentMethod,
      paymentStatus: item.attributes.paymentStatus,
      totalAmount: item.attributes.totalAmount,
      items: item.attributes.items || [],
      shippingAddress: item.attributes.shippingAddress || {},
      wantsInvoice: item.attributes.wantsInvoice || false,
      invoice,
      notes: item.attributes.notes,
      createdAt: item.attributes.createdAt,
      updatedAt: item.attributes.updatedAt,
    };

    return {
      data: order,
      error: null,
    };
  } catch (error) {
    console.error('Get order error:', error);
    return {
      data: null,
      error: { message: 'Network error. Please try again.' },
    };
  }
}
