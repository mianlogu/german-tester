import { generateText, isStepCount } from 'ai';
import { createGoogle } from '@ai-sdk/google';
import { quizResponseSchema } from '@/types/quiz';
import { NextResponse } from 'next/server';

const google = createGoogle({
    apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { level, count = 5 } = await req.json();

    // 1. Explicitly instruct Gemini: NO conversational intro, ONLY raw JSON
    const response = await generateText({
      model: google('gemini-3.5-flash-lite'),
      system: `You are an automated assessment generator for the Goethe-Institut German tests. 
You MUST output ONLY valid, raw JSON matching the requested schema. 
Never include intro text, outro text, conversational remarks, or markdown code blocks outside the JSON object.
All explanations must be in English. Questions and options must be in German.
Make sure you generate multiple answers where is possible, for example, "Trinkst du gern _______?" can have "Kaffee", "Tee", "Wasser" (or others) as valid answers.`,
      prompt: `Generate a CEFR ${level} test with exactly ${count} questions.

JSON format must strictly adhere to this structure:
{
  "level": "${level}",
  "questions": [
    {
      "id": "q1",
      "type": "single_choice",
      "question": "Question text in German",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswers": ["Option A"],
      "explanation": "Grammar rule explanation in English"
    }
  ]
}

Include a mix of 'single_choice', 'multiple_choice', and 'fill_in_blank' (for fill_in_blank, use empty array [] for options).`,
    });

    let rawText = response.text.trim();

    // 2. Strip potential Markdown wrapper (```json ... ```) if Gemini includes it
    if (rawText.startsWith('```')) {
      rawText = rawText.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim();
    }

    // 3. If there was still conversational text before the opening '{', extract only the JSON payload
    const jsonStart = rawText.indexOf('{');
    const jsonEnd = rawText.lastIndexOf('}');
    if (jsonStart !== -1 && jsonEnd !== -1) {
      rawText = rawText.substring(jsonStart, jsonEnd + 1);
    }

    const parsedJson = JSON.parse(rawText);

    // 4. Validate with Zod
    const validated = quizResponseSchema.parse(parsedJson);

    return NextResponse.json(validated);
  } catch (error) {
    console.error('Quiz Generation Error:', error);
    return NextResponse.json(
      { error: 'Failed to generate or parse test JSON' },
      { status: 500 }
    );
  }
}