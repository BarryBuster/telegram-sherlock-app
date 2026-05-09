import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { CRITERIA, TOTAL_WEIGHT } from '@/lib/criteria';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  try {
    const { context, optionA, optionB, locale = 'uk' } = await request.json();

    if (!context || !optionA || !optionB) {
      return NextResponse.json(
        { error: 'Необхідно вказати контекст, варіант A та варіант B.' },
        { status: 400 }
      );
    }

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'API ключ не налаштовано.' },
        { status: 500 }
      );
    }

    const criteriaPrompt = CRITERIA.map(
      (c) => `- "${c.key}" (${c.labelUk}, вага: ${c.weight})`
    ).join('\n');

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      temperature: 0.4,
      response_format: { type: 'json_object' },
      messages: [
        {
          role: 'system',
          content: `Ти — експертний аналітик для прийняття рішень. Застосовуй метод зваженої оцінки (матриця П'ю).

КОНТЕКСТ: Користувач вибирає між двома варіантами. Ти маєш оцінити кожен варіант за кожним з 8 критеріїв.

КРИТЕРІЇ (з вагами):
${criteriaPrompt}

ФОРМАТ ВІДПОВІДІ (строго JSON):
{
  "criteria": [
    {
      "key": "cost",
      "scoreA": <число від -100 до 100>,
      "scoreB": <число від -100 до 100>,
      "reasonA": "<коротке обґрунтування для варіанту A, 1-2 речення>",
      "reasonB": "<коротке обґрунтування для варіанту B, 1-2 речення>"
    }
    // ... для кожного з 8 критеріїв
  ],
  "summary": "<загальне резюме аналізу, 3-4 речення, з поясненням, чому один варіант кращий>"
}

ПРАВИЛА:
- Бали від -100 (дуже погано) до +100 (дуже добре) для кожного варіанту.
- Обґрунтування має бути конкретним, з фактами з контексту.
- Резюме має чітко назвати рекомендований варіант і пояснити чому.
- Відповідай ${locale === 'uk' ? 'українською' : 'англійською'} мовою.
- Будь об'єктивним і збалансованим.`,
        },
        {
          role: 'user',
          content: `СИТУАЦІЯ: ${context}

ВАРІАНТ A: ${optionA}

ВАРІАНТ B: ${optionB}`,
        },
      ],
    });

    const raw = completion.choices[0]?.message?.content;
    if (!raw) {
      throw new Error('Порожня відповідь від моделі');
    }

    const parsed = JSON.parse(raw);

    if (!parsed.criteria || !Array.isArray(parsed.criteria)) {
      throw new Error('Невалідний формат відповіді');
    }

    // Збагачуємо дані: додаємо label та weight з нашої конфігурації
    const enrichedCriteria = CRITERIA.map((config) => {
      const found = parsed.criteria.find(
        (c: { key: string }) => c.key === config.key
      );
      return {
        key: config.key,
        label: config.labelUk,
        weight: config.weight,
        scoreA: found?.scoreA ?? 0,
        scoreB: found?.scoreB ?? 0,
        reasonA: found?.reasonA ?? '',
        reasonB: found?.reasonB ?? '',
      };
    });

    // Обчислюємо зважені підсумкові бали
    let totalScoreA = 0;
    let totalScoreB = 0;

    for (const c of enrichedCriteria) {
      totalScoreA += (c.scoreA * c.weight) / TOTAL_WEIGHT;
      totalScoreB += (c.scoreB * c.weight) / TOTAL_WEIGHT;
    }

    totalScoreA = Math.round(totalScoreA);
    totalScoreB = Math.round(totalScoreB);

    const recommendation: 'A' | 'B' = totalScoreA >= totalScoreB ? 'A' : 'B';

    return NextResponse.json({
      criteria: enrichedCriteria,
      totalScoreA,
      totalScoreB,
      recommendation,
      summary: parsed.summary || '',
    });
  } catch (error: unknown) {
    console.error('Analyze error:', error);
    const message = error instanceof Error ? error.message : 'Внутрішня помилка сервера';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
