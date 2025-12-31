'use client';

import React, { useRef } from 'react';
import type { Provider } from '@/lib/types';
import LanguageSelector from './LanguageSelector';

interface Props {
  provider: Provider;
  inputJson: string;
  onInputChange: (value: string) => void;
  sourceLanguage: string;
  onSourceChange: (value: string) => void;
  targetLanguage: string;
  onTargetChange: (value: string) => void;
  translatedJson: string;
  isLoading: boolean;
  error?: string | null;
  onTranslate: () => Promise<void> | void;
  onSwap: () => void;
  onFileUpload: (file: File) => void;
  onDownload: () => void;
}

export default function JsonTranslatorView({
  provider,
  inputJson,
  onInputChange,
  sourceLanguage,
  onSourceChange,
  targetLanguage,
  onTargetChange,
  translatedJson,
  isLoading,
  error,
  onTranslate,
  onSwap,
  onFileUpload,
  onDownload,
}: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Validate JSON input
  const isValidJson = (() => {
    if (!inputJson.trim()) return true; // Empty is ok
    try {
      JSON.parse(inputJson);
      return true;
    } catch {
      return false;
    }
  })();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onFileUpload(file);
    }
  };

  return (
    <div className="space-y-6">
      {/* Language Selection & Swap */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
        <div>
          <LanguageSelector
            id="source-language-json"
            label="From"
            value={sourceLanguage}
            onChange={onSourceChange}
          />
        </div>

        {/* Swap Button */}
        <div className="flex justify-center">
          <button
            onClick={onSwap}
            className="p-2 panel-input rounded-lg transition-colors"
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
            id="target-language-json"
            label="To"
            value={targetLanguage}
            onChange={onTargetChange}
          />
        </div>

        {/* Translate Button */}
        <button
          onClick={() => onTranslate()}
          disabled={isLoading || !inputJson.trim() || !isValidJson}
          className="md:col-span-2 btn-primary font-medium rounded-lg transition-colors"
          title={!isValidJson ? 'Invalid JSON' : ''}
        >
          {isLoading ? 'Translating...' : 'Translate'}
        </button>
      </div>

      {/* JSON Validation Error */}
      {inputJson.trim() && !isValidJson && (
        <div className="p-4 bg-yellow-900/30 border border-yellow-700 text-yellow-300 rounded-lg text-sm">
          ⚠️ Invalid JSON format
        </div>
      )}

      {/* API Error Message */}
      {error && (
        <div className="p-4 bg-red-900/30 border border-red-700 text-red-300 rounded-lg">
          {error}
        </div>
      )}

      {/* Input and Output */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Input */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-medium text-foreground">JSON Input</label>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="text-xs text-foreground hover:underline flex items-center gap-1"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              Upload JSON file
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json,application/json"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>
          <textarea
            value={inputJson}
            onChange={(e) => onInputChange(e.target.value)}
            placeholder='Paste your JSON here, e.g. {"key": "value"}'
            className={`w-full h-48 px-4 py-3 panel-input rounded-lg resize-none font-mono text-sm ${
              inputJson.trim() && !isValidJson ? 'border-yellow-600' : ''
            }`}
          />
          <p className="text-xs muted mt-2">
            {inputJson.length} characters
            {isValidJson && inputJson.trim() ? ' ✓' : ''}
          </p>
        </div>

        {/* Output */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Translated JSON</label>
          <textarea
            value={translatedJson}
            readOnly
            placeholder="Translated JSON will appear here..."
            className="w-full h-48 px-4 py-3 panel-input rounded-lg resize-none font-mono text-sm"
          />
          <div className="flex gap-4 mt-2">
            {translatedJson && (
              <>
                <button
                  onClick={() => navigator.clipboard.writeText(translatedJson)}
                  className="text-xs text-foreground hover:underline"
                >
                  Copy to clipboard
                </button>
                <button
                  onClick={onDownload}
                  className="text-xs text-foreground hover:underline flex items-center gap-1"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Download JSON
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
