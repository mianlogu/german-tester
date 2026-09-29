import { TestResult } from '@/types/quiz';

const STORAGE_KEY = 'german_test_history';

export function getPastResults(): TestResult[] {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
}

export function saveTestResult(result: Omit<TestResult, 'id' | 'date'>): void {
  const past = getPastResults();
  const entry: TestResult = {
    ...result,
    id: crypto.randomUUID(),
    date: new Date().toISOString(),
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify([entry, ...past]));
}