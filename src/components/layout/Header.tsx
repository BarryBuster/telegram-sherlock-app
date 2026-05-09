'use client';

import { useDecisionStore } from '@/store/decisionStore';

export default function Header() {
  const reset = useDecisionStore((s) => s.reset);

  return (
    <header className="sticky top-0 z-50 flex items-center justify-between border-b border-white/5 bg-[#0a0a1a]/90 px-4 py-3 backdrop-blur-xl">
      {/* Ліва іконка — Історія */}
      <button
        onClick={() => {/* TODO: відкрити історію */}}
        className="flex h-9 w-9 items-center justify-center rounded-lg text-white/50 transition-colors hover:bg-white/5 hover:text-white/80"
        aria-label="Історія"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="7" height="7" rx="1" />
          <rect x="14" y="3" width="7" height="7" rx="1" />
          <rect x="3" y="14" width="7" height="7" rx="1" />
          <rect x="14" y="14" width="7" height="7" rx="1" />
        </svg>
      </button>

      {/* Назва */}
      <h1
        className="cursor-pointer bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-lg font-bold tracking-wide text-transparent"
        onClick={reset}
      >
        Sherlock
      </h1>

      {/* Права іконка — Інфо */}
      <button
        onClick={() => {/* TODO: модалка "Як працює" */}}
        className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-white/50 transition-colors hover:bg-white/5 hover:text-white/80"
        aria-label="Як це працює"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
          <line x1="12" y1="17" x2="12.01" y2="17" />
        </svg>
      </button>
    </header>
  );
}
