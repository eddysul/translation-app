'use client';

import { useState } from 'react';
import TextTranslation from '@/components/TextTranslation';
import JsonTranslation from '@/components/JsonTranslation';
import { UseTranslationState, UseTranslationActions } from '@/hooks/useTranslation';

interface TranslationTabsProps {
  state: UseTranslationState;
  actions: UseTranslationActions;
}

export default function TranslationTabs({ state, actions }: TranslationTabsProps) {
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
      {activeTab === 'text' && <TextTranslation state={state} actions={actions} />}

      {activeTab === 'json' && <JsonTranslation state={state} actions={actions} />}
    </div>
  );
}
