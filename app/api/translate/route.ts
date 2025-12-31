/**
 * API route for text translation
 */

import { NextRequest, NextResponse } from 'next/server';
import { translateText } from '@/lib/ai/translateText';
import type { TranslationRequest, TranslationResponse } from '@/lib/types';
import { ensureFieldsPresent, badRequest, serverError } from '@/lib/api/requestHelpers';

export async function POST(request: NextRequest) {
  try {
    const body: TranslationRequest = await request.json();

    const { text, sourceLanguage, targetLanguage, provider } = body;

    // Validation
    const missing = ensureFieldsPresent(body, [
      'text',
      'sourceLanguage',
      'targetLanguage',
      'provider',
    ]);
    if (missing) return badRequest(missing);

    if (text.trim().length === 0) {
      return badRequest('Text cannot be empty');
    }

    const translatedText = await translateText(text, sourceLanguage, targetLanguage, provider);

    const response: TranslationResponse = {
      translatedText,
      sourceLanguage,
      targetLanguage,
      provider,
    };

    return NextResponse.json(response);
  } catch (error) {
    return serverError(error, 'Translation failed');
  }
}
