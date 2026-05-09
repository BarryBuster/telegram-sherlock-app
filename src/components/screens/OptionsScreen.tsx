'use client';

import { useDecisionStore } from '@/store/decisionStore';

export default function OptionsScreen() {
  const optionA = useDecisionStore((s) => s.optionA);
  const optionB = useDecisionStore((s) => s.optionB);
  const setOptionA = useDecisionStore((s) => s.setOptionA);
  const setOptionB = useDecisionStore((s) => s.setOptionB);
  const context = useDecisionStore((s) => s.context);
  const setScreen = useDecisionStore((s) => s.setScreen);
  const setActiveTab = useDecisionStore((s) => s.setActiveTab);
  const setResult = useDecisionStore((s) => s.setResult);
  const setIsLoading = useDecisionStore((s) => s.setIsLoading);
  const setError = useDecisionStore((s) => s.setError);
  const isLoading = useDecisionStore((s) => s.isLoading);

  const canContinue = optionA.trim().length > 0 && optionB.trim().length > 0 && !isLoading;

  const handleAnalyze = async () => {
    if (!canContinue) return;
    setIsLoading(true);
    setError(null);
    setScreen('analysis');
    setActiveTab('analysis');

    try {
      const res = await fetch('/api/decision/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          context: context.trim(),
          optionA: optionA.trim(),
          optionB: optionB.trim(),
          locale: 'uk',
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Помилка аналізу');
      }

      const result = await res.json();
      setResult(result);
      setScreen('results');
      setActiveTab('results');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Невідома помилка';
      setError(message);
      setScreen('options');
      setActiveTab('context');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100dvh-120px)] flex-col px-5 pt-8 pb-28">
      {/* Заголовок */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white/90">Перевірте варіанти</h2>
        <p className="mt-2 text-[14px] leading-relaxed text-white/40">
          Шерлок порівняє ці два варіанти на основі вашого контексту. 
          Ви можете відредагувати їх, щоб зробити більш точними.
        </p>
      </div>

      {/* Варіант A */}
      <div className="mb-4">
        <div className="mb-2 flex items-center gap-2">
          <span className="flex h-6 w-6 items-center justify-center rounded-md bg-indigo-500/20 text-xs font-bold text-indigo-400">
            A
          </span>
          <span className="text-xs font-semibold uppercase tracking-widest text-white/30">
            Варіант А
          </span>
        </div>
        <div className="rounded-2xl border border-indigo-500/20 bg-white/[0.03] transition-all duration-200 focus-within:border-indigo-500/40 focus-within:shadow-[0_0_30px_-5px_rgba(99,102,241,0.12)]">
          <textarea
            value={optionA}
            onChange={(e) => setOptionA(e.target.value)}
            rows={3}
            className="w-full resize-none bg-transparent px-4 py-3.5 text-[15px] leading-relaxed text-white/80 placeholder:text-white/20 focus:outline-none"
            placeholder="Опишіть варіант А..."
          />
        </div>
      </div>

      {/* VS роздільник */}
      <div className="my-3 flex items-center justify-center">
        <span className="rounded-full bg-white/[0.06] px-3 py-1 text-xs font-bold tracking-wider text-white/30">
          vs
        </span>
      </div>

      {/* Варіант B */}
      <div className="mb-8">
        <div className="mb-2 flex items-center gap-2">
          <span className="flex h-6 w-6 items-center justify-center rounded-md bg-purple-500/20 text-xs font-bold text-purple-400">
            B
          </span>
          <span className="text-xs font-semibold uppercase tracking-widest text-white/30">
            Варіант Б
          </span>
        </div>
        <div className="rounded-2xl border border-purple-500/20 bg-white/[0.03] transition-all duration-200 focus-within:border-purple-500/40 focus-within:shadow-[0_0_30px_-5px_rgba(168,85,247,0.12)]">
          <textarea
            value={optionB}
            onChange={(e) => setOptionB(e.target.value)}
            rows={3}
            className="w-full resize-none bg-transparent px-4 py-3.5 text-[15px] leading-relaxed text-white/80 placeholder:text-white/20 focus:outline-none"
            placeholder="Опишіть варіант Б..."
          />
        </div>
      </div>

      {/* Кнопка */}
      <button
        onClick={handleAnalyze}
        disabled={!canContinue}
        className={`w-full rounded-2xl px-6 py-4 text-[15px] font-semibold transition-all duration-300 ${
          canContinue
            ? 'bg-gradient-to-r from-indigo-500 to-blue-500 text-white shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 active:scale-[0.98]'
            : 'bg-white/5 text-white/20 cursor-not-allowed'
        }`}
      >
        <span className="flex items-center justify-center gap-2">
          Продовжити аналіз
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </span>
      </button>
    </div>
  );
}
