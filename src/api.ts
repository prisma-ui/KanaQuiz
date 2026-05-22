const BASE_URL =
  process.env.REACT_APP_API_URL ||
  'https://nv183nv183-kanaquiz.hf.space';

async function req<T>(path: string, opts: RequestInit = {}): Promise<T> {
  const r = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...opts,
  });
  if (!r.ok) throw new Error(`API ${r.status}: ${path}`);
  return r.json();
}

export interface KanaChar {
  kana: string;
  romaji: string;
  row: string;
  category: string;
  type?: string;
}

export interface QuizCard {
  index: number;
  kana: string;
  type: string;
  category: string;
  row: string;
}

export interface QuizSession {
  session_id: string;
  total_cards: number;
  cards: QuizCard[];
}

export interface AnswerResult {
  card_index: number;
  kana: string;
  your_answer: string;
  correct: boolean;
  correct_romaji: string;
  message: string;
}

export interface FinishResult {
  session_id: string;
  summary: {
    total_cards: number;
    answered: number;
    skipped: number;
    correct: number;
    incorrect: number;
    score_percent: number;
  };
  results: Array<{
    index: number;
    kana: string;
    correct_romaji: string;
    your_answer: string;
    correct: boolean;
    skipped: boolean;
  }>;
}

export const api = {
  hiragana: (cat?: string) =>
    req<{ characters: KanaChar[]; total: number }>(`/api/hiragana${cat ? `?category=${cat}` : ''}`),

  katakana: (cat?: string) =>
    req<{ characters: KanaChar[]; total: number }>(`/api/katakana${cat ? `?category=${cat}` : ''}`),

  rows: () => req<{ rows: Array<{ row: string; count: number; categories: string[] }> }>('/api/rows'),

  startQuiz: (type?: string, category?: string, count = 10) => {
    const p = new URLSearchParams();
    if (type) p.set('type', type);
    if (category) p.set('category', category);
    p.set('count', String(count));
    return req<QuizSession>(`/api/quiz/start?${p}`, { method: 'POST' });
  },

  answer: (session_id: string, card_index: number, answer: string) =>
    req<AnswerResult>('/api/quiz/answer', {
      method: 'POST',
      body: JSON.stringify({ session_id, card_index, answer }),
    }),

  finish: (session_id: string) =>
    req<FinishResult>('/api/quiz/finish', {
      method: 'POST',
      body: JSON.stringify({ session_id }),
    }),

  health: () => req<{ status: string }>('/health'),

  random: (type?: string, category?: string) => {
    const p = new URLSearchParams({ count: '1' });
    if (type) p.set('type', type);
    if (category) p.set('category', category);
    return req<{ characters: KanaChar[] }>(`/api/random?${p}`);
  },
};
