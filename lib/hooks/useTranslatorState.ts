'use client';

import { useState, useCallback } from 'react';
import type { Provider } from '@/lib/types';

const STORAGE_KEY = 'translatorProvider';

export function useTranslatorState() {
  const [provider, setProvider] = useState<Provider>('openai');
  const [isJsonMode, setIsJsonMode] = useState(false);
  const [mounted, setMounted] = useState(false);

  const initializeFromStorage = useCallback(() => {
    const savedProvider = localStorage.getItem(STORAGE_KEY) as Provider | null;
    if (savedProvider) {
      setProvider(savedProvider);
    }
    setMounted(true);
  }, []);

  const handleProviderChange = useCallback((newProvider: Provider) => {
    setProvider(newProvider);
    localStorage.setItem(STORAGE_KEY, newProvider);
  }, []);

  const handleJsonModeToggle = useCallback(() => {
    setIsJsonMode((prev) => !prev);
  }, []);

  return {
    provider,
    isJsonMode,
    mounted,
    initializeFromStorage,
    handleProviderChange,
    handleJsonModeToggle,
  };
}
