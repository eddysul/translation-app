"use client";

import React from 'react';
import type { Language } from '@/lib/constants/languages';
import { LANGUAGES } from '@/lib/constants/languages';

interface Props {
  id?: string;
  label?: string;
  value: string;
  onChange: (value: string) => void;
  options?: Language[];
  disabled?: boolean;
  className?: string;
}

export default function LanguageSelector({
  id,
  label = 'Language',
  value,
  onChange,
  options = LANGUAGES,
  disabled = false,
  className = '',
}: Props) {
  const selectId = id || `lang-select-${label.replace(/\s+/g, '-').toLowerCase()}`;

  return (
    <div>
      <label htmlFor={selectId} className="block text-sm font-medium text-gray-300 mb-2">
        {label}
      </label>
      <select
        id={selectId}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className={`w-full px-4 py-2 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${className}`}
      >
        {options.map((opt) => (
          <option key={opt.code} value={opt.code}>
            {opt.name}
          </option>
        ))}
      </select>
    </div>
  );
}
