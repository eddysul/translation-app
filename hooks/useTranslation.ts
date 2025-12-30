/**
 * useTranslation Hook - Encapsulates all translation state and logic
 * This hook manages the entire translation workflow and can be used by any UI component.
 * The UI is completely decoupled from the business logic.
 */

'use client';

import { useState, useCallback } from 'react';
import {
  translateText,
  validateTextInput,
  validateJsonInput,
  validateLanguages,
  type TranslationProvider,
} from '@/lib/translationService';

export interface UseTranslationState {
  sourceLanguage: string;
  targetLanguage: string;
  loading: boolean;
  error: string;
  translatedText: string;
  provider: TranslationProvider;
}

export interface UseTranslationActions {
  setSourceLanguage: (lang: string) => void;
  setTargetLanguage: (lang: string) => void;
  setProvider: (provider: TranslationProvider) => void;
  swapLanguages: () => void;
  translateTextInput: (text: string) => Promise<void>;
  translateJsonInput: (json: string) => Promise<void>;
  clearError: () => void;
  clearResult: () => void;
}

export function useTranslation(): [UseTranslationState, UseTranslationActions] {
  const [sourceLanguage, setSourceLanguage] = useState('en');
  const [targetLanguage, setTargetLanguage] = useState('es');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [provider, setProvider] = useState<TranslationProvider>('openai');

  const swapLanguages = useCallback(() => {
    setSourceLanguage((prev) => targetLanguage);
    setTargetLanguage((prev) => sourceLanguage);
  }, [sourceLanguage, targetLanguage]);

  const translateTextInput = useCallback(
    async (text: string) => {
      try {
        validateLanguages(sourceLanguage, targetLanguage);
        validateTextInput(text);

        setLoading(true);
        setError('');
        setTranslatedText('');

        const response = await translateText({
          type: 'text',
          text,
          sourceLanguage,
          targetLanguage,
          provider,
        });

        if ('translatedText' in response) {
          setTranslatedText(response.translatedText);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        setTranslatedText('');
      } finally {
        setLoading(false);
      }
    },
    [sourceLanguage, targetLanguage, provider]
  );

  const translateJsonInput = useCallback(
    async (json: string) => {
      try {
        validateLanguages(sourceLanguage, targetLanguage);
        validateJsonInput(json);

        setLoading(true);
        setError('');
        setTranslatedText('');

        const response = await translateText({
          type: 'json',
          json,
          sourceLanguage,
          targetLanguage,
          provider,
        });

        if ('translatedJson' in response) {
          setTranslatedText(response.translatedJson);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        setTranslatedText('');
      } finally {
        setLoading(false);
      }
    },
    [sourceLanguage, targetLanguage, provider]
  );

  const clearError = useCallback(() => {
    setError('');
  }, []);

  const clearResult = useCallback(() => {
    setTranslatedText('');
  }, []);

  const state: UseTranslationState = {
    sourceLanguage,
    targetLanguage,
    loading,
    error,
    translatedText,
    provider,
  };

  const actions: UseTranslationActions = {
    setSourceLanguage,
    setTargetLanguage,
    setProvider,
    swapLanguages,
    translateTextInput,
    translateJsonInput,
    clearError,
    clearResult,
  };

  return [state, actions];
}
