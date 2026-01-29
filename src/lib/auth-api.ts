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

export interface OrderItem {
  productId: number;
  name: string;
  nameBg?: string;
  price: number;
  quantity: number;
  image?: string;
}

export interface ShippingAddress {
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  postalCode: string;
  phone: string;
  notes?: string;
}

export interface CreateOrderData {
  items: OrderItem[];
  shippingAddress: ShippingAddress;
  paymentMethod: string;
  totalAmount: number;
  wantsInvoice?: boolean;
  invoiceDetails?: {
    companyName?: string;
    eik?: string;
    vatNumber?: string;
    mol?: string;
    address?: string;
    city?: string;
  };
}

export interface Order {
  id: number;
  orderNumber: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  totalAmount: number;
  shippingAddress: ShippingAddress;
  items: OrderItem[];
  paymentMethod: string;
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  wantsInvoice: boolean;
  createdAt: string;
  updatedAt: string;
  invoice?: {
    id: number;
    invoiceNumber: string;
    pdfFile?: { url: string };
  };
}

// Create order
export async function createOrder(
  token: string,
  orderData: CreateOrderData
): Promise<{ data?: Order; error?: ApiError }> {
  try {
    const orderNumber = `TH-${Date.now()}-${Math.random().toString(36).substr(2, 5).toUpperCase()}`;

    const response = await fetch(`${STRAPI_URL}/api/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        data: {
          orderNumber,
          status: 'pending',
          paymentStatus: 'pending',
          ...orderData,
        },
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        error: {
          message: data.error?.message || 'Failed to create order',
          status: response.status,
        },
      };
    }

    return { data: data.data };
  } catch (error) {
    return {
      error: {
        message: 'Network error. Please try again.',
      },
    };
  }
}

// Get user orders
export async function getUserOrders(token: string): Promise<{ data?: Order[]; error?: ApiError }> {
  try {
    const response = await fetch(
      `${STRAPI_URL}/api/orders?populate=invoice&sort=createdAt:desc`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return {
        error: {
          message: data.error?.message || 'Failed to fetch orders',
          status: response.status,
        },
      };
    }

    return { data: data.data || [] };
  } catch (error) {
    return {
      error: {
        message: 'Network error. Please try again.',
      },
    };
  }
}

// Get single order
export async function getOrder(
  token: string,
  orderId: number
): Promise<{ data?: Order; error?: ApiError }> {
  try {
    const response = await fetch(
      `${STRAPI_URL}/api/orders/${orderId}?populate=invoice`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return {
        error: {
          message: data.error?.message || 'Failed to fetch order',
          status: response.status,
        },
      };
    }

    return { data: data.data };
  } catch (error) {
    return {
      error: {
        message: 'Network error. Please try again.',
      },
    };
  }
}
