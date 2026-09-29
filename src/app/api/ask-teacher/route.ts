import { generateText, isStepCount } from 'ai';
import { createGoogle } from '@ai-sdk/google';
import { NextResponse } from 'next/server';

const google = createGoogle({
    apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
});
export async function POST(req: Request) {
  try {
    const { question, userAnswer, correctAnswer, initialExplanation, userQuery } = await req.json();

    const result = await generateText({
      model: google('gemini-3.5-flash-lite'),
      system: 'You are an encouraging, precise German language tutor. Explain grammatical structures simply with mini-examples and rules. You are English speaker, so your answers/explanations MUST be in English',
      stopWhen: isStepCount(3),
      prompt: `Context:
- Question: "${question}"
- Student Answer: "${userAnswer}"
- Correct Answer: "${correctAnswer}"
- Summary: "${initialExplanation}"

Student asked: "${userQuery}"

Provide a detailed explanation answering their confusion.`,
    });

    return NextResponse.json({ answer: result.text });
  } catch (error) {
    console.error('Gemini Tutor Error:', error);
    return NextResponse.json({ error: 'Failed to answer' }, { status: 500 });
  }
}