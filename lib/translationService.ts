/**
 * Translation Service - Handles all API communication with the translation endpoint
 * This is the single source of truth for translation logic and can be easily swapped
 * without affecting UI components.
 */

export type TranslationProvider = 'openai' | 'anthropic';

export type TranslationType = 'text' | 'json';

export interface TranslationRequest {
  type: TranslationType;
  sourceLanguage: string;
  targetLanguage: string;
  provider: TranslationProvider;
  text?: string;
  json?: string;
}

export interface TextTranslationResponse {
  translatedText: string;
}

export interface JsonTranslationResponse {
  translatedJson: string;
}

export type TranslationResponse = TextTranslationResponse | JsonTranslationResponse;

/**
 * Main translation service function - handles all API requests
 * @param request - The translation request object
 * @returns The translation response
 * @throws Error if the request fails or API returns an error
 */
export async function translateText(
  request: TranslationRequest
): Promise<TranslationResponse> {
  const response = await fetch('/api/translate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Translation failed');
  }

  return response.json();
}

/**
 * Validates text input before translation
 * @param text - The text to validate
 * @returns true if valid, throws error otherwise
 */
export function validateTextInput(text: string): boolean {
  if (!text || !text.trim()) {
    throw new Error('Please enter text to translate');
  }
  return true;
}

/**
 * Validates JSON input before translation
 * @param json - The JSON string to validate
 * @returns The parsed JSON object if valid, throws error otherwise
 */
export function validateJsonInput(json: string): object {
  if (!json || !json.trim()) {
    throw new Error('Please enter JSON to translate');
  }
  try {
    return JSON.parse(json);
  } catch (error) {
    throw new Error('Invalid JSON format');
  }
}

/**
 * Validates language selections
 * @param sourceLanguage - The source language code
 * @param targetLanguage - The target language code
 * @returns true if valid, throws error otherwise
 */
export function validateLanguages(
  sourceLanguage: string,
  targetLanguage: string
): boolean {
  if (!sourceLanguage || !targetLanguage) {
    throw new Error('Please select both source and target languages');
  }
  if (sourceLanguage === targetLanguage) {
    throw new Error('Source and target languages must be different');
  }
  return true;
}
