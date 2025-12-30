'use client';

import { useState } from 'react';
import LanguageSelector from '@/components/LanguageSelector';

interface JsonTranslationProps {
  sourceLanguage: string;
  targetLanguage: string;
  setSourceLanguage: (lang: string) => void;
  setTargetLanguage: (lang: string) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
  error: string;
  setError: (error: string) => void;
}

export default function JsonTranslation({
  sourceLanguage,
  targetLanguage,
  setSourceLanguage,
  setTargetLanguage,
  loading,
  setLoading,
  error,
  setError,
}: JsonTranslationProps) {
  const [inputJson, setInputJson] = useState('');
  const [translatedJson, setTranslatedJson] = useState('');

  const handleTranslate = async () => {
    if (!inputJson.trim()) {
      setError('Please enter JSON to translate');
      return;
    }

    // Validate JSON
    try {
      JSON.parse(inputJson);
    } catch {
      setError('Invalid JSON format');
      return;
    }

    setLoading(true);
    setError('');
    setTranslatedJson('');

    try {
      const response = await fetch('/api/translate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          json: inputJson,
          sourceLanguage,
          targetLanguage,
          type: 'json',
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Translation failed');
      }

      const data = await response.json();
      setTranslatedJson(JSON.stringify(JSON.parse(data.translatedJson), null, 2));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const swapLanguages = () => {
    setSourceLanguage(targetLanguage);
    setTargetLanguage(sourceLanguage);
  };

  return (
    <div className="space-y-6">
      {/* Language Selectors */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Source Language
          </label>
          <LanguageSelector
            value={sourceLanguage}
            onChange={setSourceLanguage}
            label="Select source language"
          />
        </div>

        {/* Swap Button */}
        <div className="flex items-end justify-center md:justify-start">
          <button
            onClick={swapLanguages}
            className="mb-0 md:mb-0 p-2 rounded-lg border border-gray-300 hover:bg-gray-100 transition-colors"
            title="Swap languages"
          >
            <svg
              className="w-5 h-5 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 16V4m0 0L3 8m0 0l4 4m10-4v12m0 0l4-4m0 0l-4-4"
              />
            </svg>
          </button>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Target Language
          </label>
          <LanguageSelector
            value={targetLanguage}
            onChange={setTargetLanguage}
            label="Select target language"
          />
        </div>
      </div>

      {/* Input Area */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          JSON to Translate
        </label>
        <textarea
          value={inputJson}
          onChange={(e) => setInputJson(e.target.value)}
          placeholder='Enter JSON to translate... e.g., {"key": "value"}'
          className="w-full h-40 p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none font-mono text-sm"
        />
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
          {error}
        </div>
      )}

      {/* Translate Button */}
      <button
        onClick={handleTranslate}
        disabled={loading}
        className="w-full py-3 px-6 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
      >
        {loading ? 'Translating...' : 'Translate JSON'}
      </button>

      {/* Output Area */}
      {translatedJson && (
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Translated JSON
          </label>
          <div className="w-full h-40 p-4 border border-gray-300 rounded-lg bg-gray-50 overflow-y-auto">
            <pre className="text-gray-900 text-sm font-mono whitespace-pre-wrap break-words">
              {translatedJson}
            </pre>
          </div>
          <button
            onClick={() => navigator.clipboard.writeText(translatedJson)}
            className="mt-2 px-4 py-2 text-sm bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors"
          >
            Copy to Clipboard
          </button>
        </div>
      )}
    </div>
  );
}
