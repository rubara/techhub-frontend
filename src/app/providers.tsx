'use client';

// TechHub.bg - Client Providers

import React, { useEffect } from 'react';
import { useUIStore } from '@/store';

interface ProvidersProps {
  children: React.ReactNode;
}

export const Providers: React.FC<ProvidersProps> = ({ children }) => {
  const { isDark } = useUIStore();

  // Apply isDark class to body
  useEffect(() => {
    document.body.classList.remove('dark', 'light');
    document.body.classList.add(isDark ? 'dark' : 'light');
  }, [isDark]);

  return <>{children}</>;
};

export default Providers;
