/**
 * Anthropic client configuration
 */

import Anthropic from '@anthropic-ai/sdk';

const apiKey = process.env.PROXY_TOKEN;
const baseURL = process.env.ANTHROPIC_BASE_URL;

if (!apiKey || !baseURL) {
  throw new Error('Missing PROXY_TOKEN or ANTHROPIC_BASE_URL environment variables');
}

export const anthropicClient = new Anthropic({
  apiKey,
  baseURL,
});
