import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  try {
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
          content: `Ти — аналітик для прийняття рішень. Користувач описав ситуацію, де він стоїть перед вибором між двома взаємовиключними альтернативами.

Твоє завдання: витягти з тексту два чіткі, лаконічні варіанти дії.

ПРАВИЛА:
- Кожен варіант — це конкретна дія (не абстракція).
- Формулюй варіанти як інфінітивні речення (наприклад, "Звільнитися з поточної роботи та зосередитися на стартапі").
- Максимум 2 речення на варіант.
- Відповідай ТІЛЬКИ JSON: { "optionA": "...", "optionB": "..." }
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
    });
  } catch (error: unknown) {
    console.error('Extract error:', error);
    const message = error instanceof Error ? error.message : 'Внутрішня помилка сервера';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
