"use client";

import React from 'react';
import type { Provider } from '@/lib/types';
import LanguageSelector from './LanguageSelector';

interface TextTranslatorProps {
  provider: Provider;
  inputText: string;
  onInputChange: (value: string) => void;
  sourceLanguage: string;
  onSourceChange: (value: string) => void;
  targetLanguage: string;
  onTargetChange: (value: string) => void;
  translatedText: string;
  isLoading: boolean;
  error?: string | null;
  onTranslate: () => Promise<void> | void;
  onSwap: () => void;
}

export default function TextTranslatorView({
  provider,
  inputText,
  onInputChange,
  sourceLanguage,
  onSourceChange,
  targetLanguage,
  onTargetChange,
  translatedText,
  isLoading,
  error,
  onTranslate,
  onSwap,
}: TextTranslatorProps) {
  return (
    <div className="space-y-6">
      {/* Language Selection & Swap */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
        <div>
          <LanguageSelector
            id="source-language"
            label="From"
            value={sourceLanguage}
            onChange={onSourceChange}
          />
        </div>

        {/* Swap Button */}
        <div className="flex justify-center">
          <button
            onClick={onSwap}
            className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-gray-300 transition-colors"
            title="Swap languages"
            disabled={isLoading}
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
              />
            </svg>
          </button>
        </div>

        <div>
          <LanguageSelector
            id="target-language"
            label="To"
            value={targetLanguage}
            onChange={onTargetChange}
          />
        </div>

        {/* Translate Button */}
        <button
          onClick={() => onTranslate()}
          disabled={isLoading || !inputText.trim()}
          className="md:col-span-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors"
        >
          {isLoading ? 'Translating...' : 'Translate'}
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-4 bg-red-900/30 border border-red-700 text-red-300 rounded-lg">
          {error}
        </div>
      )}

      {/* Input and Output */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Input */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Text to Translate</label>
          <textarea
            value={inputText}
            onChange={(e) => onInputChange(e.target.value)}
            placeholder="Enter text here..."
            className="w-full h-48 px-4 py-3 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          />
          <p className="text-xs text-gray-400 mt-2">{inputText.length} characters</p>
        </div>

        {/* Output */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Translation</label>
          <textarea
            value={translatedText}
            readOnly
            placeholder="Translation will appear here..."
            className="w-full h-48 px-4 py-3 bg-gray-700 border border-gray-600 text-gray-100 rounded-lg resize-none"
          />
          {translatedText && (
            <button
              onClick={() => navigator.clipboard.writeText(translatedText)}
              className="text-xs text-blue-400 hover:text-blue-300 mt-2"
            >
              Copy to clipboard
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
