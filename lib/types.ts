/**
 * Type definitions for the translation app
 */

export type Provider = 'openai' | 'anthropic';

export interface TranslationRequest {
  text: string;
  sourceLanguage: string;
  targetLanguage: string;
  provider: Provider;
}

export interface TranslationResponse {
  translatedText: string;
  sourceLanguage: string;
  targetLanguage: string;
  provider: Provider;
}

export interface JsonTranslationRequest {
  json: string;
  sourceLanguage: string;
  targetLanguage: string;
  provider: Provider;
}

export interface JsonTranslationResponse {
  translatedJson: string;
  sourceLanguage: string;
  targetLanguage: string;
  provider: Provider;
}

export interface ErrorResponse {
  error: string;
  details?: string;
}
