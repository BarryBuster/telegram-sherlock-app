'use client';

import { useState } from 'react';
import { useDecisionStore } from '@/store/decisionStore';

export default function ContextScreen() {
  const context = useDecisionStore((s) => s.context);
  const setContext = useDecisionStore((s) => s.setContext);
  const setScreen = useDecisionStore((s) => s.setScreen);
  const setOptionA = useDecisionStore((s) => s.setOptionA);
  const setOptionB = useDecisionStore((s) => s.setOptionB);
  const setOptionC = useDecisionStore((s) => s.setOptionC);
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

      const { optionA, optionB, optionC } = await res.json();
      setOptionA(optionA);
      setOptionB(optionB);
      setOptionC(optionC || '');
      setScreen('options');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Невідома помилка';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100dvh-120px)] flex-col px-5 pt-10 pb-28">
      {/* Заголовок */}
      <div className="mb-6 text-center">
        <h2
          className="font-extrabold leading-[1.05] tracking-tight"
          style={{ fontSize: '2.5rem', color: 'var(--nm-accent-light)' }}
        >
          Опишіть
          <br />
          дилему
        </h2>
        <p className="mt-2.5 text-[14px] text-white/30">
          Давайте розберемо це логічно.
        </p>
      </div>

      {/* Мітка поля */}
      <label
        className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.14em] text-white/20"
      >
        Ваша ситуація
      </label>

      {/* Textarea — Neumorphic Inset */}
      <div
        className={`mb-5 overflow-hidden rounded-[22px] nm-inset transition-all duration-300 ${isFocused ? 'ring-1 ring-indigo-500/30' : ''}`}
      >
        <textarea
          value={context}
          onChange={(e) => setContext(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder="Опишіть вашу ситуацію або рішення..."
          rows={6}
          className="w-full resize-none bg-transparent px-5 py-4 text-[15px] leading-relaxed text-white/70 focus:outline-none"
        />
      </div>

      {/* Лічильник */}
      {context.length > 0 && context.length < 20 && (
        <p className="mb-3 -mt-3 text-xs text-orange-400/50">
          Мінімум 20 символів ({context.length}/20)
        </p>
      )}

      {/* Кнопка — Neumorphic Accent Button */}
      <button
        onClick={handleSubmit}
        disabled={!canSubmit}
        className={`w-full rounded-[22px] px-6 py-[15px] text-[16px] font-semibold transition-all duration-300 ${
          canSubmit ? 'nm-accent-button text-white' : 'nm-flat text-white/20'
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

      {/* Блок "Як працює" — Neumorphic Flat Card */}
      <div
        className="mt-7 rounded-[22px] nm-flat px-5 py-5"
      >
        <h3
          className="mb-2.5 text-[16px] font-bold text-white/70"
        >
          Як працює Sherlock
        </h3>
        <p
          className="text-[13px] leading-[1.7] text-white/30"
        >
          Опишіть вашу дилему, і Sherlock миттєво структурує її за допомогою
          логіки матриці П&apos;ю. Ми зіставимо сценарії з еталоном, щоб підсвітити
          найкращий шлях, перетворюючи плутанину думок на прозоре та
          обґрунтоване рішення.
        </p>
      </div>
    </div>
  );
}
