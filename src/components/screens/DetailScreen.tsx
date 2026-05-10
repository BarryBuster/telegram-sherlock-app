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
      <div className="mb-6 flex items-center gap-4">
        <button
          onClick={() => setScreen('results')}
          className="flex h-10 w-10 items-center justify-center rounded-xl nm-button text-white/40 active:scale-90"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/20">
            Деталізація аналізу
          </p>
          <h2 className="text-xl font-bold text-white/90">Оцінка критеріїв</h2>
        </div>
      </div>

      {/* Перемикач Варіантів */}
      <div className="mb-8 flex items-center justify-between gap-1 rounded-2xl nm-inset p-1.5">
        <button
          onClick={() => setViewMode('all')}
          className={`flex-1 rounded-xl py-2 text-[11px] font-bold uppercase tracking-wider transition-all ${
            viewMode === 'all' ? 'nm-convex text-indigo-400' : 'text-white/20'
          }`}
        >
          Всі
        </button>
        <button
          onClick={() => setViewMode('A')}
          className={`flex-1 rounded-xl py-2 text-[11px] font-bold uppercase tracking-wider transition-all ${
            viewMode === 'A' ? 'nm-convex text-indigo-400' : 'text-white/20'
          }`}
        >
          Вар A
        </button>
        <button
          onClick={() => setViewMode('B')}
          className={`flex-1 rounded-xl py-2 text-[11px] font-bold uppercase tracking-wider transition-all ${
            viewMode === 'B' ? 'nm-convex text-purple-400' : 'text-white/20'
          }`}
        >
          Вар B
        </button>
        {isThreeOptions && (
          <button
            onClick={() => setViewMode('C')}
            className={`flex-1 rounded-xl py-2 text-[11px] font-bold uppercase tracking-wider transition-all ${
              viewMode === 'C' ? 'nm-convex text-emerald-400' : 'text-white/20'
            }`}
          >
            Вар C
          </button>
        )}
      </div>

      {/* Критерії */}
      <div className="space-y-6">
        {result.criteria.map((criterion) => (
          <div
            key={criterion.key}
            className="rounded-[22px] nm-flat px-5 py-5"
          >
            {/* Назва критерію */}
            <div className="mb-4">
              <h3 className="text-[16px] font-bold text-white/80">
                {criterion.label}
              </h3>
              <div className="mt-1 flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400/60">
                  Вага: {getWeightLabel(criterion.weight)}
                </span>
                <div className="h-1 w-1 rounded-full bg-white/10" />
                <span className="text-[10px] font-medium text-white/20">
                  Множник {criterion.weight}
                </span>
              </div>
            </div>

            {/* Картки варіантів */}
            <div className="grid gap-4 grid-cols-1">
              {(viewMode === 'all' || viewMode === 'A') && (
                <div className="rounded-xl nm-inset px-4 py-4">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-400/40">Варіант A</span>
                    <span className={`rounded-lg nm-convex px-2.5 py-1 text-xs font-bold ${getScoreColor(criterion.scoreA).split(' ')[0]}`}>
                      {criterion.scoreA > 0 ? '+' : ''}{criterion.scoreA}
                    </span>
                  </div>
                  <p className="text-[13px] leading-relaxed text-white/40 italic">
                    {criterion.reasonA}
                  </p>
                </div>
              )}

              {(viewMode === 'all' || viewMode === 'B') && (
                <div className="rounded-xl nm-inset px-4 py-4">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-purple-400/40">Варіант B</span>
                    <span className={`rounded-lg nm-convex px-2.5 py-1 text-xs font-bold ${getScoreColor(criterion.scoreB).split(' ')[0]}`}>
                      {criterion.scoreB > 0 ? '+' : ''}{criterion.scoreB}
                    </span>
                  </div>
                  <p className="text-[13px] leading-relaxed text-white/40 italic">
                    {criterion.reasonB}
                  </p>
                </div>
              )}

              {isThreeOptions && (viewMode === 'all' || viewMode === 'C') && (
                <div className="rounded-xl nm-inset px-4 py-4">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400/40">Варіант C</span>
                    <span className={`rounded-lg nm-convex px-2.5 py-1 text-xs font-bold ${getScoreColor(criterion.scoreC!).split(' ')[0]}`}>
                      {criterion.scoreC! > 0 ? '+' : ''}{criterion.scoreC}
                    </span>
                  </div>
                  <p className="text-[13px] leading-relaxed text-white/40 italic">
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
