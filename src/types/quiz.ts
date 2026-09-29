import { z } from 'zod';

export const questionSchema = z.object({
  id: z.string(),
  type: z.enum(['single_choice', 'multiple_choice', 'fill_in_blank']),
  question: z.string(),
  options: z.array(z.string()),
  correctAnswers: z.array(z.string()),
  explanation: z.string(),
});

export const quizResponseSchema = z.object({
  level: z.string(),
  questions: z.array(questionSchema),
});

export type Question = z.infer<typeof questionSchema>;
export type CEFRLevel = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';

export interface TestResult {
  id: string;
  level: CEFRLevel;
  date: string;
  score: number;
  totalQuestions: number;
  questions: Question[];
  userAnswers: Record<number, string[]>;
}
export interface TutorPayload {
  question: string;
  userAnswer: string;
  correctAnswer: string;
  initialExplanation: string;
  userQuery: string;
}

export interface LevelCard {
  level: CEFRLevel;
  title: string;
  description: string;
  tags: string[];
}