'use client';

import { useDecisionStore } from '@/store/decisionStore';
import type { NavTab } from '@/types/decision';

const tabs: { key: NavTab; label: string; icon: React.ReactNode }[] = [
  {
    key: 'context',
    label: 'Контекст',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 6h16M4 12h10M4 18h14" />
      </svg>
    ),
  },
  {
    key: 'analysis',
    label: 'Аналіз',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
      </svg>
    ),
  },
  {
    key: 'results',
    label: 'Результати',
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

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-white/5 bg-[#0a0a1a]/95 backdrop-blur-xl">
      <div className="mx-auto flex max-w-md items-center justify-around py-2">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.key;
          const isDisabled = tab.key === 'results' && !result;

          return (
            <button
              key={tab.key}
              onClick={() => !isDisabled && setActiveTab(tab.key)}
              disabled={isDisabled}
              className={`flex flex-col items-center gap-0.5 px-4 py-1.5 transition-all duration-200 ${
                isActive
                  ? 'text-indigo-400'
                  : isDisabled
                    ? 'text-white/15 cursor-not-allowed'
                    : 'text-white/40 hover:text-white/70'
              }`}
            >
              <span className={`transition-transform duration-200 ${isActive ? 'scale-110' : ''}`}>
                {tab.icon}
              </span>
              <span className={`text-[11px] font-medium tracking-wide ${isActive ? 'text-indigo-400' : ''}`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
      {/* Safe area для iPhone */}
      <div className="h-[env(safe-area-inset-bottom)]" />
    </nav>
  );
}
