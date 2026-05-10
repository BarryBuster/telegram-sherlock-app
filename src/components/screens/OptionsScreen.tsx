'use client';

import { useDecisionStore } from '@/store/decisionStore';

export default function OptionsScreen() {
  const optionA = useDecisionStore((s) => s.optionA);
  const optionB = useDecisionStore((s) => s.optionB);
  const optionC = useDecisionStore((s) => s.optionC);
  const setOptionA = useDecisionStore((s) => s.setOptionA);
  const setOptionB = useDecisionStore((s) => s.setOptionB);
  const setOptionC = useDecisionStore((s) => s.setOptionC);
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
          optionC: optionC?.trim() || undefined,
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
          <span className="flex h-6 w-6 items-center justify-center rounded-md nm-flat-sm text-xs font-bold text-indigo-400">
            A
          </span>
          <span className="text-xs font-semibold uppercase tracking-widest text-white/30">
            Варіант А
          </span>
        </div>
        <div className="rounded-2xl nm-inset transition-all duration-200 focus-within:ring-1 focus-within:ring-indigo-500/30">
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
        <span className="rounded-full nm-flat-sm px-4 py-1 text-xs font-bold tracking-wider text-white/20">
          vs
        </span>
      </div>

      {/* Варіант B */}
      <div className="mb-8">
        <div className="mb-2 flex items-center gap-2">
          <span className="flex h-6 w-6 items-center justify-center rounded-md nm-flat-sm text-xs font-bold text-purple-400">
            B
          </span>
          <span className="text-xs font-semibold uppercase tracking-widest text-white/30">
            Варіант Б
          </span>
        </div>
        <div className="rounded-2xl nm-inset transition-all duration-200 focus-within:ring-1 focus-within:ring-purple-500/30">
          <textarea
            value={optionB}
            onChange={(e) => setOptionB(e.target.value)}
            rows={3}
            className="w-full resize-none bg-transparent px-4 py-3.5 text-[15px] leading-relaxed text-white/80 placeholder:text-white/20 focus:outline-none"
            placeholder="Опишіть варіант Б..."
          />
        </div>
      </div>

      {/* Варіант C (Опціонально) */}
      {optionC !== '' ? (
        <>
          <div className="my-3 -mt-4 mb-4 flex items-center justify-center">
            <span className="rounded-full nm-flat-sm px-4 py-1 text-xs font-bold tracking-wider text-white/20">
              vs
            </span>
          </div>
          <div className="mb-8 relative">
            <button 
              onClick={() => setOptionC('')}
              className="absolute -top-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full nm-flat-sm text-white/30 hover:text-red-400 transition-colors z-10"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
            <div className="mb-2 flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-md nm-flat-sm text-xs font-bold text-emerald-400">
                C
              </span>
              <span className="text-xs font-semibold uppercase tracking-widest text-white/30">
                Варіант В
              </span>
            </div>
            <div className="rounded-2xl nm-inset transition-all duration-200 focus-within:ring-1 focus-within:ring-emerald-500/30">
              <textarea
                value={optionC}
                onChange={(e) => setOptionC(e.target.value)}
                rows={3}
                className="w-full resize-none bg-transparent px-4 py-3.5 text-[15px] leading-relaxed text-white/80 placeholder:text-white/20 focus:outline-none"
                placeholder="Опишіть третій варіант..."
              />
            </div>
          </div>
        </>
      ) : (
        <button
          onClick={() => setOptionC(' ')}
          className="mb-8 flex items-center justify-center gap-2 rounded-xl nm-button py-4 text-xs font-bold uppercase tracking-widest text-white/40"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
            <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Додати третій варіант
        </button>
      )}

      {/* Кнопка */}
      <button
        onClick={handleAnalyze}
        disabled={!canContinue}
        className={`w-full rounded-2xl px-6 py-4 text-[15px] font-semibold transition-all duration-300 ${
          canContinue
            ? 'nm-accent-button text-white'
            : 'nm-flat text-white/20 cursor-not-allowed'
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
