'use client';

import { useState } from 'react';
import TextTranslation from '@/components/TextTranslation';
import JsonTranslation from '@/components/JsonTranslation';

interface TranslationTabsProps {
  sourceLanguage: string;
  targetLanguage: string;
  setSourceLanguage: (lang: string) => void;
  setTargetLanguage: (lang: string) => void;
  translatedText: string;
  setTranslatedText: (text: string) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
  error: string;
  setError: (error: string) => void;
}

export default function TranslationTabs({
  sourceLanguage,
  targetLanguage,
  setSourceLanguage,
  setTargetLanguage,
  translatedText,
  setTranslatedText,
  loading,
  setLoading,
  error,
  setError,
}: TranslationTabsProps) {
  const [activeTab, setActiveTab] = useState<'text' | 'json'>('text');

  return (
    <div className="w-full">
      {/* Tab Navigation */}
      <div className="flex gap-4 mb-6 border-b border-gray-300">
        <button
          onClick={() => setActiveTab('text')}
          className={`pb-3 px-4 font-semibold transition-colors ${
            activeTab === 'text'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Text Translation
        </button>
        <button
          onClick={() => setActiveTab('json')}
          className={`pb-3 px-4 font-semibold transition-colors ${
            activeTab === 'json'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          JSON Translation
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'text' && (
        <TextTranslation
          sourceLanguage={sourceLanguage}
          targetLanguage={targetLanguage}
          setSourceLanguage={setSourceLanguage}
          setTargetLanguage={setTargetLanguage}
          translatedText={translatedText}
          setTranslatedText={setTranslatedText}
          loading={loading}
          setLoading={setLoading}
          error={error}
          setError={setError}
        />
      )}

      {activeTab === 'json' && (
        <JsonTranslation
          sourceLanguage={sourceLanguage}
          targetLanguage={targetLanguage}
          setSourceLanguage={setSourceLanguage}
          setTargetLanguage={setTargetLanguage}
          loading={loading}
          setLoading={setLoading}
          error={error}
          setError={setError}
        />
      )}
    </div>
  );
}
