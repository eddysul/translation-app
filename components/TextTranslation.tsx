'use client';

import { useState } from 'react';
import LanguageSelector from '@/components/LanguageSelector';
import { UseTranslationState, UseTranslationActions } from '@/hooks/useTranslation';

interface TextTranslationProps {
  state: UseTranslationState;
  actions: UseTranslationActions;
}

export default function TextTranslation({ state, actions }: TextTranslationProps) {
  const [inputText, setInputText] = useState('');

  const handleTranslate = async () => {
    await actions.translateTextInput(inputText);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
        {/* Left column: source */}
        <div className="md:col-span-1">
          <label className="block text-sm font-semibold text-gray-700 mb-2">Source</label>
          <div className="flex items-center gap-3">
            <div className="flex-1">
              <LanguageSelector value={state.sourceLanguage} onChange={actions.setSourceLanguage} />
            </div>
          </div>

          <label className="block text-sm font-semibold text-gray-700 mt-4 mb-2">Text to translate</label>
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Enter text to translate..."
            className="w-full h-56 p-4 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-400 resize-none bg-white"
          />
        </div>

        {/* Middle column: swap button */}
        <div className="hidden md:flex md:col-span-1 items-center justify-center">
          <button
            onClick={actions.swapLanguages}
            aria-label="Swap languages"
            className="p-3 bg-white border border-gray-200 rounded-full shadow hover:shadow-md transition"
          >
            <svg className="w-6 h-6 text-gray-600 rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m0 0l4 4m10-4v12m0 0l4-4m0 0l-4-4" />
            </svg>
          </button>
        </div>

        {/* Right column: target */}
        <div className="md:col-span-1">
          <label className="block text-sm font-semibold text-gray-700 mb-2">Target</label>
          <LanguageSelector value={state.targetLanguage} onChange={actions.setTargetLanguage} />

          <label className="block text-sm font-semibold text-gray-700 mt-4 mb-2">Translated text</label>
          <div className="w-full h-56 p-4 border border-gray-200 rounded-lg bg-gray-50 overflow-y-auto">
            {state.translatedText ? (
              <p className="text-gray-900 whitespace-pre-wrap">{state.translatedText}</p>
            ) : (
              <p className="text-gray-500">Translated text will appear here</p>
            )}
          </div>
          <div className="flex gap-2 mt-3">
            <button
              onClick={handleTranslate}
              disabled={state.loading}
              className="flex-1 py-3 px-6 bg-sky-600 text-white font-semibold rounded-lg hover:bg-sky-700 disabled:bg-gray-300 transition-colors"
            >
              {state.loading ? 'Translating...' : 'Translate'}
            </button>
            <button
              onClick={() => navigator.clipboard.writeText(state.translatedText)}
              className="px-4 py-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50"
            >
              Copy
            </button>
          </div>
        </div>
      </div>

      {/* Error */}
      {state.error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">{state.error}</div>
      )}
    </div>
  );
}
