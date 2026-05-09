'use client';

import { useDecisionStore } from '@/store/decisionStore';

export default function ResultsScreen() {
  const result = useDecisionStore((s) => s.result);
  const optionA = useDecisionStore((s) => s.optionA);
  const optionB = useDecisionStore((s) => s.optionB);
  const optionC = useDecisionStore((s) => s.optionC);
  const setScreen = useDecisionStore((s) => s.setScreen);
  const reset = useDecisionStore((s) => s.reset);

  if (!result) {
    return (
      <div className="flex min-h-[calc(100dvh-120px)] items-center justify-center px-5 pb-28">
        <p className="text-center text-white/30">Спочатку проведіть аналіз, щоб побачити результати.</p>
      </div>
    );
  }

  const winner = result.recommendation;
  let winnerLabel = winner === 'A' ? optionA : winner === 'B' ? optionB : winner === 'C' ? optionC : 'Нічия';

  const isThreeOptions = optionC !== '' && result.totalScoreC !== undefined;

  const strongA = result.criteria.filter((c) => c.scoreA > c.scoreB && (!isThreeOptions || c.scoreA > c.scoreC!)).length;
  const strongB = result.criteria.filter((c) => c.scoreB > c.scoreA && (!isThreeOptions || c.scoreB > c.scoreC!)).length;
  const strongC = isThreeOptions ? result.criteria.filter((c) => c.scoreC! > c.scoreA && c.scoreC! > c.scoreB).length : 0;

  const maxScore = Math.max(Math.abs(result.totalScoreA), Math.abs(result.totalScoreB), isThreeOptions ? Math.abs(result.totalScoreC!) : 1, 1);

  const handleExport = async () => {
    const text = `🔍 Sherlock — Рішення прийнято\n\n` +
      `✅ Рекомендований варіант: ${winner === 'TIE' ? 'Нічия' : winner}\n` +
      `${winnerLabel}\n\n` +
      `📊 Фінальні бали:\n` +
      `A: ${result.totalScoreA > 0 ? '+' : ''}${result.totalScoreA} (${optionA})\n` +
      `B: ${result.totalScoreB > 0 ? '+' : ''}${result.totalScoreB} (${optionB})\n` +
      (isThreeOptions ? `C: ${result.totalScoreC! > 0 ? '+' : ''}${result.totalScoreC} (${optionC})\n\n` : `\n`) +
      `💡 Резюме:\n${result.summary}\n\n` +
      `—\nПроаналізовано за допомогою Sherlock`;

    if (navigator.share) {
      try {
        await navigator.share({ text });
      } catch {
        await navigator.clipboard.writeText(text);
      }
    } else {
      await navigator.clipboard.writeText(text);
      // TODO: toast повідомлення "Скопійовано"
    }
  };

  return (
    <div className="flex min-h-[calc(100dvh-120px)] flex-col px-5 pt-8 pb-28">
      {/* Іконка трофею */}
      <div className="mb-4 flex justify-center">
        <span className="text-3xl">🏆</span>
      </div>

      {/* Заголовок */}
      <div className="mb-8 text-center">
        <h2 className="text-2xl font-bold text-white/90">
          Рішення
          <br />
          прийнято
        </h2>
        <p className="mt-2 text-[14px] text-white/40">
          На основі ваших критеріїв, це оптимальний вибір.
        </p>
      </div>

      {/* Рекомендований варіант */}
      <div className="mb-5 rounded-2xl border border-indigo-500/15 bg-gradient-to-br from-indigo-500/[0.06] to-transparent px-5 py-5 text-center">
        <div className="mb-2 flex items-center justify-center gap-2">
          <span className="text-lg">🏅</span>
          <span className="text-[11px] font-semibold uppercase tracking-widest text-indigo-400/70">
            {winner === 'TIE' ? 'Нічия' : 'Рекомендований варіант'}
          </span>
        </div>
        <p className="text-[15px] font-semibold text-white/80">
          {winner === 'TIE' ? 'Варіанти набрали однакову кількість балів' : `Варіант ${winner}: ${winnerLabel.length > 60 ? winnerLabel.slice(0, 60) + '…' : winnerLabel}`}
        </p>
        <p className="mt-2 text-sm text-indigo-300/50">
          Фінальний бал: {winner === 'TIE' ? '—' : `${(winner === 'A' ? result.totalScoreA : winner === 'B' ? result.totalScoreB : result.totalScoreC!) > 0 ? '+' : ''}${winner === 'A' ? result.totalScoreA : winner === 'B' ? result.totalScoreB : result.totalScoreC}`}
        </p>
      </div>

      {/* Порівняння балів */}
      <div className="mb-3 space-y-3">
        {/* Варіант A */}
        <div className="rounded-xl border border-white/5 bg-white/[0.02] px-4 py-3.5">
          <div className="flex items-center justify-between">
            <span className="text-[14px] font-medium text-white/60">Варіант A</span>
            {winner === 'A' && (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-emerald-400">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            )}
          </div>
          <p className="mt-1 text-2xl font-bold text-white/80">
            {result.totalScoreA > 0 ? '+' : ''}{result.totalScoreA} <span className="text-sm font-normal text-white/30">балів</span>
          </p>
          <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-white/5">
            <div
              className="h-full rounded-full bg-indigo-500 transition-all duration-700"
              style={{ width: `${(Math.abs(result.totalScoreA) / maxScore) * 100}%` }}
            />
          </div>
          <p className="mt-2 text-xs text-white/30">
            Переваг за критеріями: {strongA}
          </p>
        </div>

        {/* Варіант B */}
        <div className="rounded-xl border border-white/5 bg-white/[0.02] px-4 py-3.5">
          <div className="flex items-center justify-between">
            <span className="text-[14px] font-medium text-white/60">Варіант B</span>
            {winner === 'B' && (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-emerald-400">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            )}
          </div>
          <p className="mt-1 text-2xl font-bold text-white/80">
            {result.totalScoreB > 0 ? '+' : ''}{result.totalScoreB} <span className="text-sm font-normal text-white/30">балів</span>
          </p>
          <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-white/5">
            <div
              className="h-full rounded-full bg-purple-500 transition-all duration-700"
              style={{ width: `${(Math.abs(result.totalScoreB) / maxScore) * 100}%` }}
            />
          </div>
          <p className="mt-2 text-xs text-white/30">
            Переваг за критеріями: {strongB}
          </p>
        </div>

        {/* Варіант C */}
        {isThreeOptions && (
          <div className="rounded-xl border border-white/5 bg-white/[0.02] px-4 py-3.5">
            <div className="flex items-center justify-between">
              <span className="text-[14px] font-medium text-white/60">Варіант C</span>
              {winner === 'C' && (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-emerald-400">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              )}
            </div>
            <p className="mt-1 text-2xl font-bold text-white/80">
              {result.totalScoreC! > 0 ? '+' : ''}{result.totalScoreC} <span className="text-sm font-normal text-white/30">балів</span>
            </p>
            <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-white/5">
              <div
                className="h-full rounded-full bg-emerald-500 transition-all duration-700"
                style={{ width: `${(Math.abs(result.totalScoreC!) / maxScore) * 100}%` }}
              />
            </div>
            <p className="mt-2 text-xs text-white/30">
              Переваг за критеріями: {strongC}
            </p>
          </div>
        )}
      </div>

      {/* Резюме */}
      <div className="mb-6 rounded-2xl border border-white/5 bg-white/[0.02] px-5 py-4">
        <h3 className="mb-2 text-sm font-semibold text-white/60">Резюме аналізу</h3>
        <p className="text-[13px] leading-relaxed text-white/40">
          {result.summary}
        </p>
      </div>

      {/* Кнопки дій */}
      <div className="space-y-3">
        <button
          onClick={handleExport}
          className="w-full rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-500 px-6 py-3.5 text-[14px] font-semibold text-white shadow-lg shadow-indigo-500/20 transition-all duration-200 hover:shadow-indigo-500/30 active:scale-[0.98]"
        >
          <span className="flex items-center justify-center gap-2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
              <polyline points="16 6 12 2 8 6" />
              <line x1="12" y1="2" x2="12" y2="15" />
            </svg>
            Експортувати звіт
          </span>
        </button>

        <button
          onClick={() => setScreen('detail')}
          className="w-full rounded-2xl border border-white/10 bg-white/[0.03] px-6 py-3.5 text-[14px] font-semibold text-white/60 transition-all duration-200 hover:bg-white/[0.06] active:scale-[0.98]"
        >
          <span className="flex items-center justify-center gap-2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="4" y1="21" x2="4" y2="14" />
              <line x1="4" y1="10" x2="4" y2="3" />
              <line x1="12" y1="21" x2="12" y2="12" />
              <line x1="12" y1="8" x2="12" y2="3" />
              <line x1="20" y1="21" x2="20" y2="16" />
              <line x1="20" y1="12" x2="20" y2="3" />
            </svg>
            Деталізація критеріїв
          </span>
        </button>

        <button
          onClick={reset}
          className="w-full rounded-2xl border border-white/5 px-6 py-3.5 text-[14px] font-medium text-white/30 transition-all duration-200 hover:text-white/50 active:scale-[0.98]"
        >
          ✦ Перерахувати
        </button>
      </div>
    </div>
  );
}
