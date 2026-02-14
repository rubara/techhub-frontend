// src/hooks/useCurrencySettings.ts
'use client';

import { useState, useEffect } from 'react';
import { getCurrencySettings, CurrencySettings, clearCurrencyCache } from '@/utils/currency';

interface UseCurrencySettingsReturn {
  settings: CurrencySettings;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

export const useCurrencySettings = (): UseCurrencySettingsReturn => {
  const [settings, setSettings] = useState<CurrencySettings>({
    showBGNReference: true,
    bgnToEurRate: 1.95583,
    transitionEndDate: '2026-12-31',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      setError(null);
      const fetchedSettings = await getCurrencySettings();
      setSettings(fetchedSettings);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch currency settings'));
    } finally {
      setLoading(false);
    }
  };

  const refetch = async () => {
    clearCurrencyCache();
    await fetchSettings();
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  return { settings, loading, error, refetch };
};
