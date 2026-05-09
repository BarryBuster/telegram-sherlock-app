'use client';

import { useEffect, useState } from 'react';
import { CRITERIA } from '@/lib/criteria';
import type { CriterionStatus } from '@/types/decision';

export default function AnalysisScreen() {
  // Симуляція послідовного аналізу критеріїв (поки бекенд працює)
  const [statuses, setStatuses] = useState<Record<string, CriterionStatus>>(() => {
    const initial: Record<string, CriterionStatus> = {};
    CRITERIA.forEach((c) => { initial[c.key] = 'pending'; });
    return initial;
  });

  useEffect(() => {
    // Послідовна анімація: кожен критерій проходить pending → analyzing → done
    let cancelled = false;
    const animate = async () => {
      for (let i = 0; i < CRITERIA.length; i++) {
        if (cancelled) return;
        const key = CRITERIA[i].key;
        
        // analyzing
        setStatuses((prev) => ({ ...prev, [key]: 'analyzing' }));
        await new Promise((r) => setTimeout(r, 800 + Math.random() * 600));
        
        if (cancelled) return;
        // done
        setStatuses((prev) => ({ ...prev, [key]: 'done' }));
        await new Promise((r) => setTimeout(r, 200));
      }
    };
    animate();
    return () => { cancelled = true; };
  }, []);

  const getStatusLabel = (status: CriterionStatus) => {
    switch (status) {
      case 'done': return 'ПРОАНАЛІЗОВАНО';
      case 'analyzing': return 'ОЦІНЮЄТЬСЯ';
      default: return 'ОЧІКУЄТЬСЯ';
    }
  };

  const isAllDone = Object.values(statuses).every((s) => s === 'done');
  const isAnyAnalyzing = Object.values(statuses).some((s) => s === 'analyzing');

  return (
    <div className="flex min-h-[calc(100dvh-120px)] flex-col px-5 pt-8 pb-28">
      {/* Іконка */}
      <div className="mb-6 flex justify-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full border border-white/10 bg-white/[0.03]">
          <svg className="h-8 w-8 animate-pulse text-indigo-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="3" />
            <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
          </svg>
        </div>
      </div>

      {/* Заголовок */}
      <div className="mb-8 text-center">
        <h2 className="text-2xl font-bold text-white/90">
          Sherlock
          <br />
          аналізує ваше рішення…
        </h2>
        <p className="mt-3 text-[14px] text-white/35">
          Застосовуємо зважену оцінку за 8 вимірами.
          <br />
          Будь ласка, зачекайте, поки ми синтезуємо дані.
        </p>
      </div>

      {/* Список критеріїв */}
      <div className="space-y-1">
        {CRITERIA.map((criterion) => {
          const status = statuses[criterion.key] || 'pending';
          const isDone = status === 'done';
          const isAnalyzing = status === 'analyzing';

          return (
            <div
              key={criterion.key}
              className={`flex items-center justify-between rounded-xl px-4 py-3.5 transition-all duration-500 ${
                isAnalyzing
                  ? 'bg-white/[0.04] border border-white/10'
                  : isDone
                    ? 'bg-transparent'
                    : 'bg-transparent'
              }`}
            >
              {/* Ліва частина: іконка + назва */}
              <div className="flex items-center gap-3">
                {/* Індикатор статусу */}
                <div className={`flex h-7 w-7 items-center justify-center rounded-full transition-all duration-500 ${
                  isDone
                    ? 'bg-emerald-500/15 text-emerald-400'
                    : isAnalyzing
                      ? 'bg-indigo-500/15 text-indigo-400'
                      : 'bg-white/5 text-white/15'
                }`}>
                  {isDone ? (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  ) : isAnalyzing ? (
                    <svg className="h-3.5 w-3.5 animate-spin" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                  ) : (
                    <div className="h-2 w-2 rounded-full bg-white/15" />
                  )}
                </div>

                <span className={`text-[14px] font-medium transition-colors duration-300 ${
                  isDone ? 'text-white/70' : isAnalyzing ? 'text-white/90' : 'text-white/25'
                }`}>
                  {criterion.labelUk}
                </span>
              </div>

              {/* Правий бейдж */}
              <div className="flex items-center gap-1.5">
                <span className={`text-[10px] font-semibold tracking-wider transition-colors duration-300 ${
                  isDone
                    ? 'text-white/30'
                    : isAnalyzing
                      ? 'text-indigo-400'
                      : 'text-white/15'
                }`}>
                  {getStatusLabel(status)}
                </span>
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className={`transition-transform duration-300 ${
                    isAnalyzing ? 'rotate-180 text-indigo-400' : isDone ? 'text-white/20' : 'text-white/10'
                  }`}
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </div>
            </div>
          );
        })}
      </div>

      {/* Підсказка для analyzing */}
      {isAnyAnalyzing && !isAllDone && (
        <div className="mt-4 rounded-xl bg-indigo-500/[0.06] border border-indigo-500/10 px-4 py-3">
          <p className="text-xs text-indigo-300/60">
            Іде оцінка ймовірностей відмов… ⏳
          </p>
        </div>
      )}

      {/* Підсказка для фіналізації (коли всі критерії done, але ми ще чекаємо на API) */}
      {isAllDone && (
        <div className="mt-4 flex items-center justify-center gap-3 rounded-xl bg-purple-500/[0.06] border border-purple-500/10 px-4 py-4 transition-all duration-500 animate-in fade-in slide-in-from-bottom-2">
          <svg className="h-4 w-4 animate-spin text-purple-400" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          <p className="text-xs font-medium tracking-wide text-purple-300/80">
            Зважуємо бали та формуємо висновок...
          </p>
        </div>
      )}
    </div>
  );
}
