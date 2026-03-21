import { PreviewQuestion } from './types';

export function parseJsonImport(content: string): { questions: PreviewQuestion[]; invalidCount: number } {
  const data = JSON.parse(content);
  const items: Record<string, unknown>[] = Array.isArray(data) ? data : (data.questions ?? []);
  const all: PreviewQuestion[] = items.map((item) => ({
    question_text: String(item.question_text ?? item.question ?? ''),
    question_type: String(item.question_type ?? item.type ?? 'multiple_choice'),
    options: (item.options as string[]) ?? null,
    correct_answer: String(item.correct_answer ?? item.answer ?? ''),
    explanation: item.explanation ? String(item.explanation) : undefined,
    category: item.category ? String(item.category) : undefined,
    difficulty: item.difficulty ? String(item.difficulty) : 'orta',
    bloom_level: item.bloom_level ? String(item.bloom_level) : undefined,
    tags: Array.isArray(item.tags) ? item.tags.map(String) : undefined,
  }));
  const questions = all.filter((q) => q.question_text && q.correct_answer);
  return { questions, invalidCount: all.length - questions.length };
}
