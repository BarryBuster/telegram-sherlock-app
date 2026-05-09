'use client';

import { useState } from 'react';
import { useDecisionStore } from '@/store/decisionStore';

export default function DetailScreen() {
  const result = useDecisionStore((s) => s.result);
  const setScreen = useDecisionStore((s) => s.setScreen);
  const optionC = useDecisionStore((s) => s.optionC);
  const [viewMode, setViewMode] = useState<'A' | 'B' | 'C' | 'all'>('all');
  const isThreeOptions = optionC !== '' && result?.totalScoreC !== undefined;

  if (!result) return null;

  const getScoreColor = (score: number) => {
    if (score > 0) return 'text-emerald-400 bg-emerald-500/15';
    if (score < 0) return 'text-red-400 bg-red-500/15';
    return 'text-white/40 bg-white/5';
  };

  const getWeightLabel = (weight: number) => {
    if (weight >= 1.0) return 'Критична';
    if (weight >= 0.8) return 'Висока';
    if (weight >= 0.6) return 'Середня';
    return 'Низька';
  };

  return (
    <div className="flex min-h-[calc(100dvh-120px)] flex-col px-5 pt-6 pb-28">
      {/* Шапка з кнопкою назад */}
      <div className="mb-6 flex items-center gap-3">
        <button
          onClick={() => setScreen('results')}
          className="flex h-9 w-9 items-center justify-center rounded-lg text-white/40 transition-colors hover:bg-white/5 hover:text-white/70"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-widest text-white/20">
            Деталізація аналізу
          </p>
          <h2 className="text-xl font-bold text-white/90">Оцінка критеріїв</h2>
        </div>
      </div>

      {/* Перемикач Варіантів */}
      <div className="mb-6 flex items-center justify-end gap-1 rounded-xl bg-white/[0.04] p-1">
        <button
          onClick={() => setViewMode('all')}
          className={`rounded-lg px-3 py-1.5 text-[11px] font-semibold transition-all ${
            viewMode === 'all' ? 'bg-white/10 text-white/80' : 'text-white/30 hover:text-white/50'
          }`}
        >
          Всі
        </button>
        <button
          onClick={() => setViewMode('A')}
          className={`rounded-lg px-3 py-1.5 text-[11px] font-semibold transition-all ${
            viewMode === 'A' ? 'bg-indigo-500/20 text-indigo-400' : 'text-white/30 hover:text-white/50'
          }`}
        >
          Вар A
        </button>
        <button
          onClick={() => setViewMode('B')}
          className={`rounded-lg px-3 py-1.5 text-[11px] font-semibold transition-all ${
            viewMode === 'B' ? 'bg-purple-500/20 text-purple-400' : 'text-white/30 hover:text-white/50'
          }`}
        >
          Вар B
        </button>
        {isThreeOptions && (
          <button
            onClick={() => setViewMode('C')}
            className={`rounded-lg px-3 py-1.5 text-[11px] font-semibold transition-all ${
              viewMode === 'C' ? 'bg-emerald-500/20 text-emerald-400' : 'text-white/30 hover:text-white/50'
            }`}
          >
            Вар C
          </button>
        )}
      </div>

      {/* Критерії */}
      <div className="space-y-5">
        {result.criteria.map((criterion) => (
          <div
            key={criterion.key}
            className="rounded-2xl border border-white/5 bg-white/[0.02] px-4 py-4"
          >
            {/* Назва критерію */}
            <div className="mb-3">
              <h3 className="text-[15px] font-semibold text-white/80">
                {criterion.label}
              </h3>
              <p className="text-xs text-white/30">
                Вага: {getWeightLabel(criterion.weight)} ({criterion.weight})
              </p>
            </div>

            {/* Картки варіантів */}
            <div className="grid gap-3 grid-cols-1">
              {(viewMode === 'all' || viewMode === 'A') && (
                <div className="rounded-xl border border-white/5 bg-white/[0.02] px-3 py-3">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-xs font-medium text-white/40">Варіант A</span>
                    <span className={`rounded-md px-2 py-0.5 text-xs font-bold ${getScoreColor(criterion.scoreA)}`}>
                      {criterion.scoreA > 0 ? '+' : ''}{criterion.scoreA}
                    </span>
                  </div>
                  <p className="text-[12px] leading-relaxed text-white/50">
                    {criterion.reasonA}
                  </p>
                </div>
              )}

              {(viewMode === 'all' || viewMode === 'B') && (
                <div className="rounded-xl border border-white/5 bg-white/[0.02] px-3 py-3">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-xs font-medium text-white/40">Варіант B</span>
                    <span className={`rounded-md px-2 py-0.5 text-xs font-bold ${getScoreColor(criterion.scoreB)}`}>
                      {criterion.scoreB > 0 ? '+' : ''}{criterion.scoreB}
                    </span>
                  </div>
                  <p className="text-[12px] leading-relaxed text-white/50">
                    {criterion.reasonB}
                  </p>
                </div>
              )}

              {isThreeOptions && (viewMode === 'all' || viewMode === 'C') && (
                <div className="rounded-xl border border-white/5 bg-white/[0.02] px-3 py-3">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-xs font-medium text-white/40">Варіант C</span>
                    <span className={`rounded-md px-2 py-0.5 text-xs font-bold ${getScoreColor(criterion.scoreC!)}`}>
                      {criterion.scoreC! > 0 ? '+' : ''}{criterion.scoreC}
                    </span>
                  </div>
                  <p className="text-[12px] leading-relaxed text-white/50">
                    {criterion.reasonC}
                  </p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
