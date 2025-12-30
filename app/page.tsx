'use client';

import { useState } from 'react';
import TranslationInterface from '@/components/TranslationInterface';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <main className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Translation App</h1>
          <p className="text-gray-600">Translate text effortlessly using AI</p>
        </div>
        <TranslationInterface />
      </main>
    </div>
  );
}
