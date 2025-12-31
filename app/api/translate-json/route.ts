/**
 * API route for JSON translation.
 * Translates all string values in JSON while preserving structure and keys.
 */

import { NextRequest, NextResponse } from 'next/server';
import { translateText } from '@/lib/ai/translateText';
import { translateJson } from '@/lib/json/translateJson';
import type { JsonTranslationRequest } from '@/lib/types';
import { ensureFieldsPresent, badRequest, serverError } from '@/lib/api/requestHelpers';

export async function POST(request: NextRequest) {
  try {
    const body: JsonTranslationRequest = await request.json();

    const { json, sourceLanguage, targetLanguage, provider } = body;

    // Validation
    const missing = ensureFieldsPresent(body, [
      'json',
      'sourceLanguage',
      'targetLanguage',
      'provider',
    ]);
    if (missing) return badRequest(missing);

    if (json.trim().length === 0) {
      return badRequest('JSON cannot be empty');
    }

    // Translate JSON: recursively translate all string values
    const translatedJson = await translateJson(
      json,
      // Inline translation function for each string value
      async (text) => {
        return await translateText(text, sourceLanguage, targetLanguage, provider);
      }
    );

    return NextResponse.json({
      translatedJson,
      sourceLanguage,
      targetLanguage,
      provider,
    });
  } catch (error) {
    return serverError(error, 'JSON translation failed');
  }
}
