"use client";

import React from 'react';
import type { Provider } from '@/lib/types';
import { PROVIDERS } from '@/lib/constants/providers';

interface Props {
  value: Provider;
  onChange: (p: Provider) => void;
  className?: string;
}

export default function ProviderSelector({ value, onChange, className = '' }: Props) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <label htmlFor="provider-select" className="text-sm text-gray-300 font-medium">
        Provider
      </label>
      <select
        id="provider-select"
        value={value}
        onChange={(e) => onChange(e.target.value as Provider)}
        className="bg-gray-700 text-gray-200 px-3 py-2 rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        {PROVIDERS.map((p) => (
          <option key={p.id} value={p.id} title={p.description}>
            {p.name}
          </option>
        ))}
      </select>
    </div>
  );
}
