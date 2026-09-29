import { CEFRLevel, Question, TutorPayload } from '@/types/quiz';

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || '/api';

export async function fetchQuiz(level: CEFRLevel, count = 5, signal?: AbortSignal): Promise<Question[]> {

/**
 *  
  return [
        {
            "id": "q1",
            "type": "single_choice",
            "question": "Wie _______ du?",
            "options": [
                "heißt",
                "bin",
                "wohnt",
                "kommst"
            ],
            "correctAnswers": [
                "heißt"
            ],
            "explanation": "With the informal pronoun 'du', the verb 'heißen' takes the ending '-t' (Wie heißt du?)."
        },
        {
            "id": "q2",
            "type": "single_choice",
            "question": "Ich komme _______ Spanien.",
            "options": [
                "in",
                "aus",
                "nach",
                "von"
            ],
            "correctAnswers": [
                "aus"
            ],
            "explanation": "When stating your country of origin, the preposition 'aus' is used with most countries."
        },
        {
            "id": "q3",
            "type": "multiple_choice",
            "question": "Welche Artikel sind maskulin (männlich)?",
            "options": [
                "der",
                "die",
                "das",
                "ein"
            ],
            "correctAnswers": [
                "der",
                "ein"
            ],
            "explanation": "'der' is the definite masculine article and 'ein' is the indefinite masculine/neuter article, but 'ein' specifically serves as the masculine nominative here."
        },
        {
            "id": "q4",
            "type": "fill_in_blank",
            "question": "Guten Tag! Ich _______ Anna.",
            "options": [],
            "correctAnswers": [
                "bin"
            ],
            "explanation": "The first-person singular form of the verb 'sein' (to be) with 'ich' is 'bin'."
        },
        {
            "id": "q5",
            "type": "single_choice",
            "question": "Was ist das? Das ist _______ Apfel.",
            "options": [
                "eine",
                "ein",
                "einen",
                "der"
            ],
            "correctAnswers": [
                "ein"
            ],
            "explanation": "'Apfel' is a masculine noun (der Apfel). In the nominative case with the indefinite article, it becomes 'ein Apfel'."
        },
        {
            "id": "q6",
            "type": "single_choice",
            "question": "Wir _______ in Berlin.",
            "options": [
                "wohne",
                "wohnst",
                "wohnen",
                "wohnt"
            ],
            "correctAnswers": [
                "wohnen"
            ],
            "explanation": "With the pronoun 'wir' (we), the regular verb takes the infinitive ending '-en'."
        },
        {
            "id": "q7",
            "type": "multiple_choice",
            "question": "Wähle die richtigen Personalpronomen im Nominativ aus:",
            "options": [
                "ich",
                "du",
                "mein",
                "er",
                "und"
            ],
            "correctAnswers": [
                "ich",
                "du",
                "er"
            ],
            "explanation": "'ich', 'du', and 'er' are personal pronouns in the nominative case. 'mein' is a possessive article and 'und' is a conjunction."
        },
        {
            "id": "q8",
            "type": "fill_in_blank",
            "question": "Trinkst du gern _______?",
            "options": [],
            "correctAnswers": [
                "Kaffee"
            ],
            "explanation": "This is a typical question asking about beverage preferences, often filled with nouns like 'Kaffee' or 'Tee'."
        },
        {
            "id": "q9",
            "type": "single_choice",
            "question": "Hast du _______ Auto?",
            "options": [
                "einen",
                "eine",
                "ein",
                "der"
            ],
            "correctAnswers": [
                "ein"
            ],
            "explanation": "'Auto' is a neuter noun (das Auto). In the accusative case (direct object after 'haben'), the neuter indefinite article remains 'ein'."
        },
        {
            "id": "q10",
            "type": "single_choice",
            "question": "Maria _______ heute nicht arbeiten, weil sie krank ist.",
            "options": [
                "kann",
                "können",
                "könnt",
                "kannst"
            ],
            "correctAnswers": [
                "kann"
            ],
            "explanation": "With the third-person singular subject 'Maria', the modal verb 'können' is conjugated as 'kann'."
        }
    ];
 */
  const res = await fetch(`${BASE_URL}/generate-quiz`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ level, count }),
    signal,
  });
  if (!res.ok) throw new Error('Network error generating quiz');
  const data = await res.json();
  return data.questions;
}

export async function askTutor(payload: TutorPayload): Promise<string> {
  const res = await fetch(`${BASE_URL}/ask-teacher`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error('Network error asking tutor');
  const data = await res.json();
  return data.answer;
}