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
  const systemPrompt = `You are a professional translator. Translate the following text from ${sourceLanguage} to ${targetLanguage}. Provide only the translated text without any additional explanation or formatting.`;

  const userMessage = text;

  if (provider === 'openai') {
    const response = await openaiClient.chat.completions.create({
      model: 'gpt-3.5-turbo',
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
      max_tokens: 2000,
    });

    const translatedText = response.choices[0]?.message?.content?.trim();
    if (!translatedText) {
      throw new Error('No translation received from OpenAI');
    }
    return translatedText;
  } else if (provider === 'anthropic') {
    const response = await anthropicClient.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 2000,
      messages: [
        {
          role: 'user',
          content: `${systemPrompt}\n\n${userMessage}`,
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
