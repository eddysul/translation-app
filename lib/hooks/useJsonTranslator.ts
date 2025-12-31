'use client';

import { useState, useCallback } from 'react';
import type { Provider } from '../types';
import { translateJsonViaApi } from '../services/jsonTranslationClient';

export function useJsonTranslator(defaultProvider: Provider) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [translatedJson, setTranslatedJson] = useState('');

  const translate = useCallback(
    async (
      jsonString: string,
      sourceLanguage: string,
      targetLanguage: string,
      provider: Provider = defaultProvider
    ) => {
      setError(null);
      setIsLoading(true);
      try {
        const result = await translateJsonViaApi(jsonString, sourceLanguage, targetLanguage, provider);
        setTranslatedJson(result);
        return result;
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
        setTranslatedJson('');
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
    translatedJson,
    translate,
  } as const;
}
