/**
 * Provider definitions for AI models.
 * Keep this centralized so adding a new provider is a single change.
 */

export interface ProviderDef {
  id: string; // provider id used in code/requests (e.g. 'openai')
  name: string; // display name
  description?: string;
}

export const PROVIDERS: ProviderDef[] = [
  { id: 'openai', name: 'OpenAI', description: 'GPT family via proxy' },
  { id: 'anthropic', name: 'Anthropic', description: 'Claude family via proxy' },
];

export default PROVIDERS;
