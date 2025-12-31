import React from 'react';
import type { Provider } from '@/lib/types';
import ProviderSelector from './ProviderSelector';
import ThemeToggle from './ThemeToggle';
import TextTranslatorContainer from './TextTranslatorContainer';
import JsonTranslatorContainer from './JsonTranslatorContainer';

interface Props {
  provider: Provider;
  onProviderChange: (p: Provider) => void;
  isJsonMode: boolean;
  onJsonModeToggle: () => void;
}

export default function TranslationPageView({
  provider,
  onProviderChange,
  isJsonMode,
  onJsonModeToggle,
}: Props) {
  return (
  <main className="min-h-screen">
      {/* Header */}
      <header className="backdrop-blur py-4 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <h1 className="text-2xl font-bold tracking-tight">
            GT <span className="text-blue-400">Translate</span>
          </h1>
          <div className="flex gap-6 items-center">
            <ThemeToggle />
            {/* Provider Selector */}
            <ProviderSelector value={provider} onChange={onProviderChange} />

            {/* JSON Mode Toggle */}
            <label className="flex items-center gap-2 cursor-pointer transition-colors">
              <input
                type="checkbox"
                checked={isJsonMode}
                onChange={onJsonModeToggle}
                className="w-4 h-4 rounded accent-blue-500"
              />
              <span className="text-sm font-medium">JSON Mode</span>
            </label>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Mode Indicator */}
        <div className="mb-6 text-sm text-gray-400">
          {isJsonMode ? (
            <span>📄 JSON Translation Mode</span>
          ) : (
            <span>✨ Text Translation Mode</span>
          )}
        </div>

        {/* Translator Component */}
        <div className="rounded-xl p-8 shadow-2xl card">
          {!isJsonMode ? (
            <TextTranslatorContainer provider={provider} />
          ) : (
            <JsonTranslatorContainer provider={provider} />
          )}
        </div>
      </div>
    </main>
  );
}
