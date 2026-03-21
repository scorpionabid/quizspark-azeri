import { PreviewQuestion } from './types';

export function parseCsvLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') inQuotes = !inQuotes;
    else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current.trim());
  return result;
}

export function parseCsvImport(content: string): { questions: PreviewQuestion[]; invalidCount: number } {
  const lines = content.split('\n').filter((line) => line.trim());
  if (lines.length < 2) return { questions: [], invalidCount: 0 };

  const headers = lines[0].split(',').map((h) => h.trim().toLowerCase());
  const valid: PreviewQuestion[] = [];
  let invalidCount = 0;

  for (let i = 1; i < lines.length; i++) {
    const values = parseCsvLine(lines[i]);
    const row: Record<string, string> = {};
    headers.forEach((header, index) => {
      row[header] = values[index] ?? '';
    });

    const question: PreviewQuestion = {
      question_text: row.question_text ?? row.question ?? row.sual ?? '',
      question_type: row.question_type ?? row.type ?? row.tip ?? 'multiple_choice',
      correct_answer: row.correct_answer ?? row.answer ?? row.cavab ?? row.duzgun_cavab ?? '',
      options: null,
      explanation: row.explanation ?? row.izahat ?? undefined,
      category: row.category ?? row.kateqoriya ?? undefined,
      difficulty: row.difficulty ?? row.cetinlik ?? 'orta',
      bloom_level: row.bloom_level ?? undefined,
      tags: row.tags ? row.tags.split(';').map((t) => t.trim()) : undefined,
    };

    const options: string[] = [];
    ['a', 'b', 'c', 'd', 'e', 'f'].forEach((letter) => {
      const val = row[`variant_${letter}`] ?? row[`option_${letter}`] ?? row[letter];
      if (val) options.push(val);
    });
    if (options.length > 0) question.options = options;

    if (question.question_text && question.correct_answer) {
      valid.push(question);
    } else {
      invalidCount++;
    }
  }

  return { questions: valid, invalidCount };
}
