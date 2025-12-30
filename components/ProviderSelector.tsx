'use client';

interface ProviderSelectorProps {
  value: 'openai' | 'anthropic';
  onChange: (provider: 'openai' | 'anthropic') => void;
}

export default function ProviderSelector({ value, onChange }: ProviderSelectorProps) {
  return (
    <div className="inline-block">
      <label className="block text-sm font-semibold text-gray-700 mb-2">Provider</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as 'openai' | 'anthropic')}
        className="px-3 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="openai">OpenAI</option>
        <option value="anthropic">Anthropic</option>
      </select>
    </div>
  );
}
