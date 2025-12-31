"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "theme";

export default function ThemeToggle({ className = "" }: { className?: string }) {
  const [theme, setTheme] = useState<string | null>(null);

  useEffect(() => {
    // initialize theme from localStorage or system preference
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        setTheme(saved);
        document.documentElement.dataset.theme = saved;
        return;
      }

      const prefersLight = window.matchMedia && window.matchMedia("(prefers-color-scheme: light)").matches;
      const initial = prefersLight ? "light" : "dark";
      setTheme(initial);
      document.documentElement.dataset.theme = initial;
    } catch (err) {
      // ignore (SSR safety)
    }
  }, []);

  const toggle = () => {
    const next = theme === "light" ? "dark" : "light";
    setTheme(next);
    try {
      document.documentElement.dataset.theme = next;
      localStorage.setItem(STORAGE_KEY, next);
    } catch (err) {}
  };

  return (
    <button
      onClick={toggle}
      aria-label="Toggle theme"
      title="Toggle light / dark"
      className={`p-2 rounded-md border border-transparent hover:bg-gray-100/10 transition ${className}`}
    >
      {theme === "light" ? (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
          <path d="M10 2a.75.75 0 01.75.75V4a.75.75 0 01-1.5 0V2.75A.75.75 0 0110 2zM4.22 4.22a.75.75 0 011.06 0l.88.88a.75.75 0 11-1.06 1.06l-.88-.88a.75.75 0 010-1.06zM2 10a.75.75 0 01.75-.75H4a.75.75 0 010 1.5H2.75A.75.75 0 012 10zm8 6a.75.75 0 01.75.75V18a.75.75 0 01-1.5 0v-1.25A.75.75 0 0110 16zM15.78 15.78a.75.75 0 010 1.06l-.88.88a.75.75 0 11-1.06-1.06l.88-.88a.75.75 0 011.06 0zM16 10a.75.75 0 01.75-.75H18a.75.75 0 010 1.5h-1.25A.75.75 0 0116 10zM4.22 15.78a.75.75 0 011.06 0l.88.88a.75.75 0 11-1.06 1.06l-.88-.88a.75.75 0 010-1.06z" />
        </svg>
      ) : (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-200" viewBox="0 0 20 20" fill="currentColor">
          <path d="M17.293 13.293A8 8 0 116.707 2.707a6 6 0 1010.586 10.586z" />
        </svg>
      )}
    </button>
  );
}
