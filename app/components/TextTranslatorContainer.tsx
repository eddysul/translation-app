'use client';

import React, { useState } from 'react';
import type { Provider } from '@/lib/types';
import TextTranslatorView from './TextTranslator';
import { LANGUAGES } from '@/lib/constants/languages';
import { useTranslator } from '@/lib/hooks/useTranslator';

interface Props {
  provider: Provider;
}

export default function TextTranslatorContainer({ provider }: Props) {
  const [inputText, setInputText] = useState('');
  const [sourceLanguage, setSourceLanguage] = useState(LANGUAGES[0].code);
  const [targetLanguage, setTargetLanguage] = useState(LANGUAGES[1].code);

  const { isLoading, error, translatedText, translate } = useTranslator(provider);

  const handleTranslate = async () => {
    if (!inputText.trim()) return;
    await translate(inputText, sourceLanguage, targetLanguage, provider);
  };

  const handleSwap = () => {
    setSourceLanguage(targetLanguage);
    setTargetLanguage(sourceLanguage);
  };

  return (
    <TextTranslatorView
      provider={provider}
      inputText={inputText}
      onInputChange={setInputText}
      sourceLanguage={sourceLanguage}
      onSourceChange={setSourceLanguage}
      targetLanguage={targetLanguage}
      onTargetChange={setTargetLanguage}
      translatedText={translatedText}
      isLoading={isLoading}
      error={error}
      onTranslate={handleTranslate}
      onSwap={handleSwap}
    />
  );
}
