/**
 * Core translation logic for text
 */

import { openaiClient } from './openai';
import { anthropicClient } from './anthropic';
import type { Provider } from '../types';

export async function translateText(
  text: string,
  sourceLanguage: string,
  targetLanguage: string,
  provider: Provider
): Promise<string> {
  // Handle empty strings - return as-is without calling API
  if (!text || text.trim() === '') {
    return text;
  }

  const systemPrompt = `You are a professional translator. Translate from ${sourceLanguage} to ${targetLanguage}.

STRICT RULES - YOU MUST FOLLOW THESE:
1. Output ONLY the translated text - nothing else
2. NO explanations, notes, commentary, or meta-text
3. NO phrases like "Here's the translation:", "This means:", "Note:", etc.
4. If input is a technical term (package name, command, version number, code), return it UNCHANGED
5. If unsure whether to translate, DO NOT translate - return the original
6. Your response should be EXACTLY what would replace the input text

Examples:
- Input: "Hello" → Output: "안녕하세요" (if Korean)
- Input: "next dev" → Output: "next dev" (technical command - unchanged)
- Input: "19.2.3" → Output: "19.2.3" (version number - unchanged)`;

  const userMessage = text;

  if (provider === 'openai') {
    const response = await openaiClient.chat.completions.create({
      model: 'gpt-5.2',
      messages: [
        {
          role: 'system',
          content: systemPrompt,
        },
        {
          role: 'user',
          content: userMessage,
        },
      ],
      temperature: 0.3,
      max_completion_tokens: 2000,
    });

    const translatedText = response.choices[0]?.message?.content?.trim();
    if (!translatedText) {
      throw new Error('No translation received from OpenAI');
    }
    return translatedText;
  } else if (provider === 'anthropic') {
    const response = await anthropicClient.messages.create({
      model: 'claude-sonnet-4-5-20250929',
      max_tokens: 2000,
      system: systemPrompt,
      messages: [
        {
          role: 'user',
          content: userMessage,
        },
      ],
    });

    const translatedText = response.content[0]?.type === 'text' ? response.content[0].text.trim() : null;
    if (!translatedText) {
      throw new Error('No translation received from Anthropic');
    }
    return translatedText;
  }

  throw new Error(`Unknown provider: ${provider}`);
}
