'use client';

import TranslationTabs from '@/components/TranslationTabs';
import ProviderSelector from '@/components/ProviderSelector';
import { useTranslation } from '@/hooks/useTranslation';

export default function TranslationInterface() {
  const [state, actions] = useTranslation();

  return (
    <div className="w-full">
      <div className="mx-auto max-w-5xl bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="flex items-center justify-between p-6 bg-gradient-to-r from-white to-sky-50">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Translate</h2>
            <p className="text-sm text-gray-600">AI-powered translations — choose provider and translate text or JSON</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-sm text-gray-600">Provider</div>
            <ProviderSelector value={state.provider} onChange={actions.setProvider} />
          </div>
        </div>

        <div className="p-6">
          <TranslationTabs state={state} actions={actions} />
        </div>
      </div>
    </div>
  );
}
