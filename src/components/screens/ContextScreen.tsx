'use client';

import { useState } from 'react';
import { useDecisionStore } from '@/store/decisionStore';

export default function ContextScreen() {
  const context = useDecisionStore((s) => s.context);
  const setContext = useDecisionStore((s) => s.setContext);
  const setScreen = useDecisionStore((s) => s.setScreen);
  const setActiveTab = useDecisionStore((s) => s.setActiveTab);
  const setOptionA = useDecisionStore((s) => s.setOptionA);
  const setOptionB = useDecisionStore((s) => s.setOptionB);
  const setIsLoading = useDecisionStore((s) => s.setIsLoading);
  const setError = useDecisionStore((s) => s.setError);
  const isLoading = useDecisionStore((s) => s.isLoading);

  const [isFocused, setIsFocused] = useState(false);

  const canSubmit = context.trim().length >= 20 && !isLoading;

  const handleSubmit = async () => {
    if (!canSubmit) return;
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/decision/extract', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ context: context.trim() }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Помилка витягу варіантів');
      }

      const { optionA, optionB } = await res.json();
      setOptionA(optionA);
      setOptionB(optionB);
      setScreen('options');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Невідома помилка';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100dvh-120px)] flex-col px-5 pt-8 pb-28">
      {/* Заголовок */}
      <div className="mb-8">
        <h2 className="text-[2rem] font-bold leading-tight text-white/90">
          Опишіть
          <br />
          дилему.
        </h2>
        <p className="mt-2 text-[15px] text-white/40">
          Давайте розберемо це логічно.
        </p>
      </div>

      {/* Поле вводу */}
      <div className="mb-6">
        <label className="mb-2 block text-xs font-semibold uppercase tracking-widest text-white/30">
          Ваша ситуація
        </label>
        <div
          className={`rounded-2xl border transition-all duration-300 ${
            isFocused
              ? 'border-indigo-500/50 shadow-[0_0_30px_-5px_rgba(99,102,241,0.15)]'
              : 'border-white/8 hover:border-white/15'
          } bg-white/[0.03]`}
        >
          <textarea
            value={context}
            onChange={(e) => setContext(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder="Опишіть вашу ситуацію або рішення... наприклад, мені потрібно вибрати між пропозицією..."
            rows={5}
            className="w-full resize-none bg-transparent px-4 py-4 text-[15px] leading-relaxed text-white/80 placeholder:text-white/20 focus:outline-none"
          />
        </div>
        {context.length > 0 && context.length < 20 && (
          <p className="mt-2 text-xs text-amber-400/60">
            Мінімум 20 символів для якісного аналізу ({context.length}/20)
          </p>
        )}
      </div>

      {/* Кнопка */}
      <button
        onClick={handleSubmit}
        disabled={!canSubmit}
        className={`group relative w-full overflow-hidden rounded-2xl px-6 py-4 text-[15px] font-semibold transition-all duration-300 ${
          canSubmit
            ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 active:scale-[0.98]'
            : 'bg-white/5 text-white/20 cursor-not-allowed'
        }`}
      >
        {isLoading ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Аналізую…
          </span>
        ) : (
          <span className="flex items-center justify-center gap-2">
            ✦ Проаналізувати
          </span>
        )}
      </button>

      {/* Блок "Як працює" */}
      <div className="mt-8 rounded-2xl bg-gradient-to-br from-indigo-500/[0.07] to-purple-500/[0.04] border border-indigo-500/10 px-5 py-5">
        <h3 className="mb-2 text-base font-semibold text-indigo-300/90">
          Як працює Sherlock
        </h3>
        <p className="text-[13px] leading-relaxed text-white/35">
          Опишіть вашу дилему, і Sherlock миттєво структурує її за допомогою
          логіки матриці П&apos;ю. Ми зіставимо сценарії з еталоном, щоб підсвітити
          найкращий шлях, перетворюючи плутанину думок на прозоре та
          обґрунтоване рішення.
        </p>
      </div>
    </div>
  );
}
