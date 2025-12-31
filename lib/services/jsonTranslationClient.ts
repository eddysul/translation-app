/**
 * Client-side service to call the JSON translation API.
 */

import type { Provider } from '../types';

export async function translateJsonViaApi(
  jsonString: string,
  sourceLanguage: string,
  targetLanguage: string,
  provider: Provider
): Promise<string> {
  const res = await fetch('/api/translate-json', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ json: jsonString, sourceLanguage, targetLanguage, provider }),
  });

  if (!res.ok) {
    const payload = await res.json().catch(() => ({}));
    const message = payload?.details || payload?.error || `${res.status} ${res.statusText}`;
    throw new Error(message);
  }

  const data = await res.json();
  return data.translatedJson as string;
}
