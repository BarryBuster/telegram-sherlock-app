import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { CRITERIA, TOTAL_WEIGHT } from '@/lib/criteria';

export async function POST(request: Request) {
  try {
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY || '',
    });
    
    const { context, optionA, optionB, optionC, locale = 'uk' } = await request.json();

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

КОНТЕКСТ: Користувач вибирає між ${optionC ? 'трьома' : 'двома'} варіантами. Ти маєш оцінити кожен варіант за кожним з 8 критеріїв.

КРИТЕРІЇ (з вагами):
${criteriaPrompt}

ФОРМАТ ВІДПОВІДІ (строго JSON):
{
  "criteria": [
    {
      "key": "cost",
      "scoreA": <число від -100 до 100>,
      "scoreB": <число від -100 до 100>,
      ${optionC ? '"scoreC": <число від -100 до 100>,' : ''}
      "reasonA": "<коротке обґрунтування для варіанту A, 1-2 речення>",
      "reasonB": "<коротке обґрунтування для варіанту B, 1-2 речення>"
      ${optionC ? ',"reasonC": "<коротке обґрунтування для варіанту C, 1-2 речення>"' : ''}
    }
    // ... для кожного з 8 критеріїв
  ],
  "summary": "<загальне резюме аналізу, 3-4 речення. Якщо бали варіантів дуже близькі або рівні, обов'язково зазнач це і порадь користувачу звернути увагу на найважливіший для нього критерій або довіритися інтуїції. Якщо є чіткий переможець, поясни чому.>"
}

ПРАВИЛА:
- Бали від -100 (дуже погано) до +100 (дуже добре) для кожного варіанту.
- Обґрунтування має бути конкретним, з фактами з контексту.
- Резюме має бути чесним: якщо варіанти рівноцінні, не вигадуй переможця.
- Відповідай ${locale === 'uk' ? 'українською' : 'англійською'} мовою.
- Будь об'єктивним і збалансованим.`,
        },
        {
          role: 'user',
          content: `СИТУАЦІЯ: ${context}

ВАРІАНТ A: ${optionA}

ВАРІАНТ B: ${optionB}${optionC ? `\n\nВАРІАНТ C: ${optionC}` : ''}`,
        },
      ],
    });

    const responseText = completion.choices[0].message.content || '{}';
    const parsed = JSON.parse(responseText);

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
        scoreC: found?.scoreC ?? (optionC ? 0 : undefined),
        reasonA: found?.reasonA ?? '',
        reasonB: found?.reasonB ?? '',
        reasonC: found?.reasonC ?? (optionC ? '' : undefined),
      };
    });

    // Обчислюємо зважені підсумкові бали
    let totalScoreA = 0;
    let totalScoreB = 0;
    let totalScoreC = 0;

    for (const c of enrichedCriteria) {
      totalScoreA += (c.scoreA * c.weight) / TOTAL_WEIGHT;
      totalScoreB += (c.scoreB * c.weight) / TOTAL_WEIGHT;
      if (optionC && c.scoreC !== undefined) {
        totalScoreC += (c.scoreC * c.weight) / TOTAL_WEIGHT;
      }
    }

    // Використовуємо 1 знак після коми для точності
    const finalA = Number(totalScoreA.toFixed(1));
    const finalB = Number(totalScoreB.toFixed(1));
    const finalC = optionC ? Number(totalScoreC.toFixed(1)) : 0;

    let recommendation: 'A' | 'B' | 'C' | 'TIE' = 'TIE';
    const maxScore = Math.max(finalA, finalB, optionC ? finalC : -Infinity);
    
    const candidates = [];
    if (finalA === maxScore) candidates.push('A');
    if (finalB === maxScore) candidates.push('B');
    if (optionC && finalC === maxScore) candidates.push('C');

    if (candidates.length > 1) {
      recommendation = 'TIE';
    } else {
      recommendation = candidates[0] as 'A' | 'B' | 'C';
    }

    return NextResponse.json({
      criteria: enrichedCriteria,
      totalScoreA: finalA,
      totalScoreB: finalB,
      totalScoreC: optionC ? finalC : undefined,
      recommendation,
      summary: parsed.summary || '',
    });
  } catch (error: unknown) {
    console.error('Analyze error:', error);
    const message = error instanceof Error ? error.message : 'Внутрішня помилка сервера';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
