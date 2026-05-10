'use client';

import { useDecisionStore } from '@/store/decisionStore';
import type { NavTab } from '@/types/decision';

const tabs: { key: NavTab; label: string; icon: React.ReactNode }[] = [
  {
    key: 'context',
    label: 'КОНТЕКСТ',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 6h16M4 12h10M4 18h14" />
      </svg>
    ),
  },
  {
    key: 'analysis',
    label: 'АНАЛІЗ',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
      </svg>
    ),
  },
  {
    key: 'results',
    label: 'РЕЗУЛЬТАТИ',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    ),
  },
];

export default function BottomNav() {
  const activeTab = useDecisionStore((s) => s.activeTab);
  const setActiveTab = useDecisionStore((s) => s.setActiveTab);
  const result = useDecisionStore((s) => s.result);
  const context = useDecisionStore((s) => s.context);
  const optionA = useDecisionStore((s) => s.optionA);
  const optionB = useDecisionStore((s) => s.optionB);

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 nm-convex border-t border-white/5 pb-[env(safe-area-inset-bottom)]">
      <div className="mx-auto flex max-w-md items-center justify-around py-3">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.key;
          
          // Логіка блокування вкладок
          let isDisabled = false;
          if (tab.key === 'analysis') {
            const contextValid = context.trim().length >= 20;
            const optionsValid = optionA.trim().length > 0 && optionB.trim().length > 0;
            isDisabled = !contextValid || !optionsValid;
          } else if (tab.key === 'results') {
            isDisabled = !result;
          }

          return (
            <button
              key={tab.key}
              onClick={() => !isDisabled && setActiveTab(tab.key)}
              disabled={isDisabled}
              className={`flex flex-col items-center gap-1.5 px-6 py-2 rounded-2xl transition-all duration-300 ${
                isActive
                  ? 'nm-inset text-indigo-400'
                  : isDisabled
                    ? 'opacity-10 cursor-not-allowed grayscale'
                    : 'text-white/20 hover:text-white/40'
              }`}
            >
              <span className={`transition-transform duration-300 ${isActive ? 'scale-105' : ''}`}>
                {tab.icon}
              </span>
              <span className="text-[9px] font-bold tracking-[0.15em]">
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
