'use client';

import { useState } from 'react';
import LanguageSelector from '@/components/LanguageSelector';
import { UseTranslationState, UseTranslationActions } from '@/hooks/useTranslation';

interface JsonTranslationProps {
  state: UseTranslationState;
  actions: UseTranslationActions;
}

export default function JsonTranslation({ state, actions }: JsonTranslationProps) {
  const [inputJson, setInputJson] = useState('');
  const [translatedJson, setTranslatedJson] = useState('');

  const handleTranslate = async () => {
    try {
      JSON.parse(inputJson);
      setTranslatedJson('');
      await actions.translateJsonInput(inputJson);
    } catch (err) {
      // The hook handles error setting through actions
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
        {/* Left: source */}
        <div className="md:col-span-1">
          <label className="block text-sm font-semibold text-gray-700 mb-2">Source</label>
          <LanguageSelector value={state.sourceLanguage} onChange={actions.setSourceLanguage} />

          <label className="block text-sm font-semibold text-gray-700 mt-4 mb-2">JSON to translate</label>
          <textarea
            value={inputJson}
            onChange={(e) => setInputJson(e.target.value)}
            placeholder='{"key": "value"}'
            className="w-full h-56 p-4 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-400 resize-none font-mono text-sm bg-white"
          />
        </div>

        {/* Middle: swap button */}
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

        {/* Right: target */}
        <div className="md:col-span-1">
          <label className="block text-sm font-semibold text-gray-700 mb-2">Target</label>
          <LanguageSelector value={state.targetLanguage} onChange={actions.setTargetLanguage} />

          <label className="block text-sm font-semibold text-gray-700 mt-4 mb-2">Translated JSON</label>
          <div className="w-full h-56 p-4 border border-gray-200 rounded-lg bg-gray-50 overflow-y-auto font-mono text-sm">
            {state.translatedText ? (
              <pre className="text-gray-900 whitespace-pre-wrap break-words">{state.translatedText}</pre>
            ) : (
              <p className="text-gray-500">Translated JSON will appear here</p>
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
