'use client';

import { useDecisionStore } from '@/store/decisionStore';

export default function Header() {
  const reset = useDecisionStore((s) => s.reset);

  return (
    <header className="sticky top-0 z-50 flex items-center justify-between nm-flat px-4 py-4">
      {/* Ліва іконка — Історія */}
      <button
        onClick={() => {/* TODO: відкрити історію */}}
        className="flex h-10 w-10 items-center justify-center rounded-xl nm-button text-white/40 active:scale-95"
        aria-label="Історія"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="7" height="7" rx="1" />
          <rect x="14" y="3" width="7" height="7" rx="1" />
          <rect x="3" y="14" width="7" height="7" rx="1" />
          <rect x="14" y="14" width="7" height="7" rx="1" />
        </svg>
      </button>

      {/* Назва */}
      <h1
        className="cursor-pointer text-lg font-black uppercase tracking-[0.2em] text-indigo-400/80"
        onClick={reset}
      >
        Sherlock
      </h1>

      {/* Права іконка — Інфо */}
      <button
        onClick={() => {/* TODO: модалка "Як працює" */}}
        className="flex h-10 w-10 items-center justify-center rounded-full nm-button text-white/40 active:scale-95"
        aria-label="Як це працює"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
          <line x1="12" y1="17" x2="12.01" y2="17" />
        </svg>
      </button>
    </header>
  );
}
