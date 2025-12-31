"use client";

import { useState, useCallback } from 'react';
import type { Provider } from '../types';
import { translateViaApi } from '../services/translationClient';

export function useTranslator(defaultProvider: Provider) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [translatedText, setTranslatedText] = useState('');

  const translate = useCallback(
    async (text: string, sourceLanguage: string, targetLanguage: string, provider: Provider = defaultProvider) => {
      setError(null);
      setIsLoading(true);
      try {
        const result = await translateViaApi(text, sourceLanguage, targetLanguage, provider);
        setTranslatedText(result);
        return result;
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
        setTranslatedText('');
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [defaultProvider]
  );

  return {
    isLoading,
    error,
    translatedText,
    translate,
  } as const;
}
