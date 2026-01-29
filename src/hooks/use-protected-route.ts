'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store';

interface UseProtectedRouteOptions {
  redirectTo?: string;
  redirectIfAuthenticated?: boolean;
  redirectAuthenticatedTo?: string;
}

export function useProtectedRoute(options: UseProtectedRouteOptions = {}) {
  const {
    redirectTo = '/login',
    redirectIfAuthenticated = false,
    redirectAuthenticatedTo = '/account',
  } = options;

  const router = useRouter();
  const { isAuthenticated, isLoading, token } = useAuthStore();

  useEffect(() => {
    // Wait for hydration
    if (isLoading) return;

    // Check if token exists (for page refresh scenarios)
    const hasToken = !!token;

    if (redirectIfAuthenticated && hasToken) {
      // Redirect authenticated users away (e.g., from login page)
      router.push(redirectAuthenticatedTo);
    } else if (!redirectIfAuthenticated && !hasToken) {
      // Redirect unauthenticated users to login
      router.push(redirectTo);
    }
  }, [isAuthenticated, isLoading, token, redirectTo, redirectIfAuthenticated, redirectAuthenticatedTo, router]);

  return {
    isAuthenticated,
    isLoading,
    isReady: !isLoading,
  };
}
