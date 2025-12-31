'use client';

import React, { useState } from 'react';
import type { Provider } from '@/lib/types';
import JsonTranslatorView from './JsonTranslator';
import { LANGUAGES } from '@/lib/constants/languages';
import { useJsonTranslator } from '@/lib/hooks/useJsonTranslator';

interface Props {
  provider: Provider;
}

export default function JsonTranslatorContainer({ provider }: Props) {
  const [inputJson, setInputJson] = useState('');
  const [sourceLanguage, setSourceLanguage] = useState(LANGUAGES[0].code);
  const [targetLanguage, setTargetLanguage] = useState(LANGUAGES[1].code);

  const { isLoading, error, translatedJson, translate } = useJsonTranslator(provider);

  const handleTranslate = async () => {
    if (!inputJson.trim()) return;
    await translate(inputJson, sourceLanguage, targetLanguage, provider);
  };

  const handleSwap = () => {
    setSourceLanguage(targetLanguage);
    setTargetLanguage(sourceLanguage);
  };

  return (
    <JsonTranslatorView
      provider={provider}
      inputJson={inputJson}
      onInputChange={setInputJson}
      sourceLanguage={sourceLanguage}
      onSourceChange={setSourceLanguage}
      targetLanguage={targetLanguage}
      onTargetChange={setTargetLanguage}
      translatedJson={translatedJson}
      isLoading={isLoading}
      error={error}
      onTranslate={handleTranslate}
      onSwap={handleSwap}
    />
  );
}
