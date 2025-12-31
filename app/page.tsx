'use client';

import { useEffect } from 'react';
import TranslationPageView from './components/TranslationPageView';
import { useTranslatorState } from '@/lib/hooks/useTranslatorState';

export default function TranslationPage() {
  const {
    provider,
    isJsonMode,
    mounted,
    initializeFromStorage,
    handleProviderChange,
    handleJsonModeToggle,
  } = useTranslatorState();

  useEffect(() => {
    initializeFromStorage();
  }, [initializeFromStorage]);

  if (!mounted) return null;

  return (
    <TranslationPageView
      provider={provider}
      onProviderChange={handleProviderChange}
      isJsonMode={isJsonMode}
      onJsonModeToggle={handleJsonModeToggle}
    />
  );
}