# DeutschPrüfung AI

An automated, Goethe-Institut-aligned German proficiency diagnostic platform built with **Next.js (App Router)**, **TypeScript**, **Material UI (MUI)**, and **Google Gemini** via the Vercel AI SDK.

The application evaluates learners across CEFR levels (**A1 to C2**), delivers dynamic evaluations with strict schema guarantees, provides instant pedagogical grammar explanations, records historical progress, and integrates an on-demand AI German Tutor for deeper grammatical analysis.

---

## Features

- **CEFR-Aligned Diagnostics (A1–C2):** Generates targeted tests covering foundational syntax through advanced academic structures (*Nomen-Verb-Verbindungen*, *Konjunktiv II*, *Passiv*, *Wechselpräpositionen*).
- **Varied Question Formats:**
  - `single_choice`: Contextual multiple-choice drills with single-rule focus.
  - `multiple_choice`: Multi-select tests (e.g., matching all valid pronouns or dative verbs).
  - `fill_in_blank`: Direct text production exercises.
- **Embedded AI German Tutor:** Interactive modal providing on-demand breakdowns, counter-examples, and word order explanations for any specific test item.
- **Detailed History & Performance Review:** Tracks past test sessions, score percentages, and original question snapshots with expected versus submitted answers.
- **Decoupled Architecture:** Clean client-side service layer separating frontend UI from AI model orchestrations, prepared for microservice extraction and backend authentication.
- **Strict JSON Generation:** Type-safe LLM outputs enforced with Zod schemas and automatic sanitization.

---

## Tech Stack

- **Framework:** Next.js 15 (App Router, React 19)
- **Language:** TypeScript
- **UI & Design:** Material UI (MUI v6), Emotion, Material Icons
- **AI Engine:** Google Gemini (`gemini-3.8-flash-lite`) via `@ai-sdk/google` & `ai` (Vercel AI SDK)
- **Validation:** Zod

---

## Project Structure

```text
src/
├── app/
│   ├── (auth)/                   # Isolated auth layouts and routes
│   │   ├── login/page.tsx
│   │   └── register/page.tsx
│   ├── (dashboard)/              # Main application views
│   │   ├── page.tsx              # Level catalog & diagnostic launcher
│   │   ├── test/[level]/page.tsx # Dynamic single-route test runner
│   │   └── history/page.tsx      # Past scores & detailed test review
│   ├── api/                      # Server endpoints (AI integrations)
│   │   ├── generate-quiz/route.ts 
│   │   └── ask-teacher/route.ts 
│   ├── layout.tsx                # Root layout & MUI Emotion registry
│   └── theme.ts                  # High-contrast theme & global component overrides
├── components/
│   └── Navigation.tsx            # Global app header
├── services/
│   ├── api.ts                    # Centralized API client (AI endpoints abstraction)
│   └── storage.ts                # Local persistence layer for test scores
└── types/
    └── quiz.ts                   # Zod schemas & TypeScript definitions
```

## Getting Started
Prerequisites
Node.js 18.18+ or later

A Google Gemini API Key from Google AI Studio

### 1. Clone & Install Dependencies
```Bash
git clone https://github.com/mianlogu/german-tester.git
cd german-tester
npm install
```
### 2. Configure Environment Variables
Create a .env.local file in the root directory:

```code
# Google Gemini API Key
GOOGLE_GENERATIVE_AI_API_KEY=your_gemini_api_key_here

# Base URL for AI calls (Defaults to Next.js route handlers)
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000/api
```

3. Run the Development Server
```Bash
npm run dev
```
Open http://localhost:3000 in your browser.

## Core Workflows
### 1. Dynamic Test Route (`/test/[level]`)
The application uses dynamic route segments. Navigating to `/test/A1`, `/test/B1`, or `/test/C1` uses the same unified runner view, unwrapping params and requesting tailored questions matching the CEFR level:

```TypeScript
const resolvedParams = use(params);
const level = resolvedParams.level.toUpperCase() as CEFRLevel;
```

### 2. Guarding Against Duplicate API Calls
React `StrictMode` in development triggers mount lifecycles twice. Test requests are dispatched with an `AbortController` signal to abort duplicate in-flight calls:

```TypeScript
const controller = new AbortController();
fetchQuiz(level, 5, controller.signal);
return () => controller.abort();
```

## Available Scripts

`npm run dev` – Starts the Next.js development server with hot-reloading.

`npm run build` – Compiles and optimizes production assets.

`npm run start` – Runs the built production server.

`npm run lint` – Runs ESLint checks.

## Roadmap
[ ] Full OAuth Integration: Connect NextAuth (Auth.js) with Google & GitHub providers.

[ ] Dedicated Microservice: Extract `src/app/api/*` into an independent Fastify/Express backend.

[ ] Spaced Repetition Review: Flag mistaken grammar items into an automated Anki-style deck.

[ ] Audio Generation (TTS): Integrate German listening comprehension (Hörverstehen) questions.