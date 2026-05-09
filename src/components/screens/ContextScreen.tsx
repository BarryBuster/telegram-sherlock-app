'use client';

import { useState } from 'react';
import { useDecisionStore } from '@/store/decisionStore';

export default function ContextScreen() {
  const context = useDecisionStore((s) => s.context);
  const setContext = useDecisionStore((s) => s.setContext);
  const setScreen = useDecisionStore((s) => s.setScreen);
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
    <div className="flex min-h-[calc(100dvh-120px)] flex-col px-5 pt-10 pb-28">
      {/* Заголовок — великий, лавандовий, як у макеті */}
      <div className="mb-6 text-center">
        <h2
          className="font-extrabold leading-[1.05] tracking-tight"
          style={{ fontSize: '2.5rem', color: '#9590c4' }}
        >
          Опишіть
          <br />
          дилему
        </h2>
        <p className="mt-2.5 text-[14px]" style={{ color: 'rgba(255,255,255,0.35)' }}>
          Давайте розберемо це логічно.
        </p>
      </div>

      {/* Мітка поля */}
      <label
        className="mb-2 block text-[11px] font-semibold uppercase"
        style={{ letterSpacing: '0.14em', color: 'rgba(255,255,255,0.22)' }}
      >
        Ваша ситуація
      </label>

      {/* Textarea — ледь помітна рамка, фон майже як у сторінки */}
      <div
        className="mb-5 overflow-hidden rounded-[22px] transition-all duration-300"
        style={{
          backgroundColor: 'rgba(255,255,255,0.02)',
          border: isFocused
            ? '1px solid rgba(130,120,220,0.2)'
            : '1px solid rgba(255,255,255,0.04)',
          boxShadow: isFocused
            ? '0 0 30px -10px rgba(100,100,220,0.1)'
            : 'none',
        }}
      >
        <textarea
          value={context}
          onChange={(e) => setContext(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder="Опишіть вашу ситуацію або рішення... наприклад, мені потрібно вибрати між пропозицією..."
          rows={6}
          className="w-full resize-none bg-transparent px-5 py-4 text-[15px] leading-relaxed focus:outline-none"
          style={{
            color: 'rgba(255,255,255,0.6)',
          }}
        />
      </div>

      {/* Лічильник */}
      {context.length > 0 && context.length < 20 && (
        <p className="mb-3 -mt-3 text-xs" style={{ color: 'rgba(245,180,80,0.5)' }}>
          Мінімум 20 символів ({context.length}/20)
        </p>
      )}

      {/* Кнопка — м'який напівпрозорий градієнт */}
      <button
        onClick={handleSubmit}
        disabled={!canSubmit}
        className="w-full overflow-hidden rounded-[22px] px-6 py-[15px] text-[16px] font-semibold transition-all duration-300 active:scale-[0.98]"
        style={{
          background: canSubmit
            ? 'linear-gradient(135deg, #5b54e0 0%, #7c5fdf 50%, #9b6fed 100%)'
            : 'linear-gradient(135deg, rgba(91,84,224,0.25) 0%, rgba(124,95,223,0.25) 50%, rgba(155,111,237,0.25) 100%)',
          color: canSubmit ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.35)',
          boxShadow: canSubmit
            ? '0 6px 30px -6px rgba(91,84,224,0.35)'
            : 'none',
        }}
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

      {/* Блок "Як працює" — чорний фон з ледь помітним синім відтінком */}
      <div
        className="mt-7 overflow-hidden rounded-[22px] px-5 py-5"
        style={{
          backgroundColor: 'rgba(14,14,30,0.7)',
          border: '1px solid rgba(80,80,160,0.08)',
        }}
      >
        <h3
          className="mb-2.5 text-[16px] font-bold"
          style={{ color: 'rgba(200,195,240,0.85)' }}
        >
          Як працює Sherlock
        </h3>
        <p
          className="text-[13px] leading-[1.7]"
          style={{ color: 'rgba(255,255,255,0.28)' }}
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
