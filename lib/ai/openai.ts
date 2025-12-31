/**
 * OpenAI client configuration
 */

import OpenAI from 'openai';

const apiKey = process.env.PROXY_TOKEN;
const baseURL = process.env.OPENAI_BASE_URL;

if (!apiKey || !baseURL) {
  throw new Error('Missing PROXY_TOKEN or OPENAI_BASE_URL environment variables');
}

export const openaiClient = new OpenAI({
  apiKey,
  baseURL,
});
