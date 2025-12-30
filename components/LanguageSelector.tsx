'use client';

import { languages } from '@/lib/languages';

interface LanguageSelectorProps {
  value: string;
  onChange: (language: string) => void;
  label?: string;
}

export default function LanguageSelector({
  value,
  onChange,
  label,
}: LanguageSelectorProps) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
    >
      {languages.map((lang) => (
        <option key={lang.code} value={lang.code}>
          {lang.name}
        </option>
      ))}
    </select>
  );
}
