import { Question } from '@/hooks/useQuestions';

export function normalizePairs(
  pairs: Record<string, string> | null,
): Record<string, string> {
  if (!pairs) return {};
  if (Array.isArray(pairs)) {
    return Object.fromEntries(
      (pairs as unknown as Array<{ left: string; right: string }>).map(p => [
        p.left,
        p.right,
      ]),
    );
  }
  return pairs;
}

export function parseMatchingValue(value: string): Record<string, string> {
  const result: Record<string, string> = {};
  if (!value) return result;
  value.split('|||').forEach(m => {
    const colonIdx = m.indexOf(':');
    if (colonIdx > -1) {
      result[m.slice(0, colonIdx)] = m.slice(colonIdx + 1);
    }
  });
  return result;
}

export function isAnswerCorrect(question: Question, value: string): boolean {
  const qt = question.question_type;

  if (qt === 'numerical') {
    const numAnswer = parseFloat(value);
    const correctNum = question.numerical_answer ?? parseFloat(question.correct_answer);
    const tolerance = question.numerical_tolerance ?? 0;
    if (isNaN(numAnswer) || isNaN(correctNum)) return false;
    return Math.abs(numAnswer - correctNum) <= tolerance;
  }

  if (qt === 'fill_blank') {
    const studentAnswers = value.split('|').map(a => a.trim().toLowerCase());
    const correctAnswers = question.correct_answer.split('|').map(a => a.trim().toLowerCase());
    if (studentAnswers.length !== correctAnswers.length) return false;
    return studentAnswers.every((a, i) => a === correctAnswers[i]);
  }

  if (qt === 'ordering') {
    const studentSeq = value.split('|||').map(s => s.trim());
    const correctSeq = (
      question.sequence_items?.length
        ? question.sequence_items
        : question.correct_answer.split('|||')
    ).map(s => s.trim());
    if (studentSeq.length !== correctSeq.length) return false;
    return studentSeq.every((item, i) => item === correctSeq[i]);
  }

  if (qt === 'matching') {
    const pairsRecord = normalizePairs(question.matching_pairs ?? null);
    const studentPairs = parseMatchingValue(value);
    return Object.entries(pairsRecord).every(([l, r]) => studentPairs[l] === r);
  }

  if (qt === 'hotspot') {
    const parts = question.correct_answer.split(':');
    const cx = parseFloat(parts[0]);
    const cy = parseFloat(parts[1]);
    const tolerance = parts[2] ? parseFloat(parts[2]) : 10;
    const sParts = value.split(':');
    const sx = parseFloat(sParts[0]);
    const sy = parseFloat(sParts[1]);
    if (isNaN(cx) || isNaN(cy) || isNaN(sx) || isNaN(sy)) return false;
    return Math.abs(sx - cx) <= tolerance && Math.abs(sy - cy) <= tolerance;
  }

  if (qt === 'true_false') {
    const ca = question.correct_answer;
    const isCorrectA = ca === 'A' || ca === 'Doğru' || ca.toLowerCase() === 'true';
    if (isCorrectA) return value === 'true' || value === 'A';
    return value === 'false' || value === 'B';
  }

  if (qt === 'multiple_select') {
    const studentAnswers = value.split(',').map(a => a.trim()).filter(Boolean).sort();
    const correctAnswers = question.correct_answer.split(',').map(a => a.trim()).filter(Boolean).sort();
    if (studentAnswers.length !== correctAnswers.length) return false;
    return studentAnswers.every((a, i) => a === correctAnswers[i]);
  }

  return value.trim() === question.correct_answer.trim();
}
