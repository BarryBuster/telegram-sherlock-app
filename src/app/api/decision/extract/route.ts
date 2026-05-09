import { NextResponse } from 'next/server';
import OpenAI from 'openai';

export async function POST(request: Request) {
  try {
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY || '',
    });
    
    const { context } = await request.json();

    if (!context || typeof context !== 'string' || context.trim().length < 20) {
      return NextResponse.json(
        { error: 'Контекст має містити щонайменше 20 символів.' },
        { status: 400 }
      );
    }

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'API ключ не налаштовано. Зверніться до адміністратора.' },
        { status: 500 }
      );
    }

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      temperature: 0.3,
      response_format: { type: 'json_object' },
      messages: [
        {
          role: 'system',
          content: `Ти — аналітик для прийняття рішень. Користувач описав ситуацію, де він стоїть перед вибором між двома або трьома альтернативами.

Твоє завдання: витягти з тексту чіткі, лаконічні варіанти дії. Якщо з тексту очевидно тільки 2 варіанти — поверни 2. Якщо є третій (навіть неявний, наприклад "залишити все як є" або компромісний) — поверни 3.

ПРАВИЛА:
- Кожен варіант — це конкретна дія (не абстракція).
- Формулюй варіанти як інфінітивні речення (наприклад, "Звільнитися з поточної роботи та зосередитися на стартапі").
- Максимум 2 речення на варіант.
- Відповідай ТІЛЬКИ JSON: { "optionA": "...", "optionB": "...", "optionC": "..." } (optionC є опціональним і має бути лише якщо варіантів дійсно три).
- Відповідай мовою користувача.`,
        },
        {
          role: 'user',
          content: context.trim(),
        },
      ],
    });

    const raw = completion.choices[0]?.message?.content;
    if (!raw) {
      throw new Error('Порожня відповідь від моделі');
    }

    const parsed = JSON.parse(raw);

    if (!parsed.optionA || !parsed.optionB) {
      throw new Error('Модель не змогла витягти два варіанти');
    }

    return NextResponse.json({
      optionA: parsed.optionA,
      optionB: parsed.optionB,
      optionC: parsed.optionC || '',
    });
  } catch (error: unknown) {
    console.error('Extract error:', error);
    const message = error instanceof Error ? error.message : 'Внутрішня помилка сервера';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
