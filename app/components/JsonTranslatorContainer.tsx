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
  const [targetLanguage, setTargetLanguage] = useState(LANGUAGES[7].code);

  const { isLoading, error, translatedJson, translate } = useJsonTranslator(provider);

  const handleTranslate = async () => {
    if (!inputJson.trim()) return;
    await translate(inputJson, sourceLanguage, targetLanguage, provider);
  };

  const handleSwap = () => {
    setSourceLanguage(targetLanguage);
    setTargetLanguage(sourceLanguage);
  };

  const handleFileUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      setInputJson(content);
    };
    reader.readAsText(file);
  };

  const handleDownload = () => {
    const blob = new Blob([translatedJson], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'translated.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
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
      onFileUpload={handleFileUpload}
      onDownload={handleDownload}
    />
  );
}
