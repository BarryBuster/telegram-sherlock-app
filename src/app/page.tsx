'use client';

import { useEffect } from 'react';
import { useDecisionStore } from '@/store/decisionStore';
import Header from '@/components/layout/Header';
import BottomNav from '@/components/layout/BottomNav';
import ContextScreen from '@/components/screens/ContextScreen';
import OptionsScreen from '@/components/screens/OptionsScreen';
import AnalysisScreen from '@/components/screens/AnalysisScreen';
import ResultsScreen from '@/components/screens/ResultsScreen';
import DetailScreen from '@/components/screens/DetailScreen';

export default function Home() {
  const screen = useDecisionStore((s) => s.screen);
  const error = useDecisionStore((s) => s.error);
  const setError = useDecisionStore((s) => s.setError);
  const loadHistory = useDecisionStore((s) => s.loadHistory);

  // Завантажити історію при старті
  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  // Telegram Web App: повідомити, що застосунок готовий
  useEffect(() => {
    if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
      window.Telegram.WebApp.ready();
      window.Telegram.WebApp.expand();
    }
  }, []);

  const renderScreen = () => {
    switch (screen) {
      case 'context':
        return <ContextScreen />;
      case 'options':
        return <OptionsScreen />;
      case 'analysis':
        return <AnalysisScreen />;
      case 'results':
        return <ResultsScreen />;
      case 'detail':
        return <DetailScreen />;
      default:
        return <ContextScreen />;
    }
  };

  return (
    <div className="mx-auto min-h-dvh max-w-md">
      <Header />

      {/* Повідомлення про помилку */}
      {error && (
        <div className="mx-5 mt-4 flex items-start gap-3 rounded-2xl nm-inset border border-red-500/20 px-4 py-4">
          <span className="mt-0.5 text-red-500">⚠️</span>
          <div className="flex-1">
            <p className="text-sm font-medium text-red-400/90">{error}</p>
            <button
              onClick={() => setError(null)}
              className="mt-1 text-[10px] font-bold uppercase tracking-wider text-white/20 hover:text-white/40"
            >
              Закрити
            </button>
          </div>
        </div>
      )}

      {/* Поточний екран */}
      <main className="transition-all duration-300">
        {renderScreen()}
      </main>

      <BottomNav />
    </div>
  );
}
