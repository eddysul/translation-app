/**
 * Client-side service to call the server translation API.
 * Keeps business logic separate from presentational components.
 */

import type { Provider } from '../types';

export async function translateViaApi(
  text: string,
  sourceLanguage: string,
  targetLanguage: string,
  provider: Provider
): Promise<string> {
  const res = await fetch('/api/translate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text, sourceLanguage, targetLanguage, provider }),
  });

  if (!res.ok) {
    const payload = await res.json().catch(() => ({}));
    const message = payload?.details || payload?.error || `${res.status} ${res.statusText}`;
    throw new Error(message);
  }

  const data = await res.json();
  return data.translatedText as string;
}
