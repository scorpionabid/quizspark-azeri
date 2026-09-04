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

export function parseMatchingValue(
  value: string,
  matchingPairs?: Record<string, string> | null,
): Record<string, string[]> {
  const result: Record<string, string[]> = {};
  if (!value) return result;

  // Case 1: Standard serialized format "Left1:Right1|||Left2:Right2"
  if (value.includes(':') && (value.includes('|||') || !value.includes(';'))) {
    value.split('|||').forEach(m => {
      const colonIdx = m.indexOf(':');
      if (colonIdx > -1) {
        const left = m.slice(0, colonIdx).trim();
        const right = m.slice(colonIdx + 1).trim();
        result[left] = right.split(',').map(r => r.trim()).filter(Boolean);
      }
    });
    if (Object.keys(result).length > 0) return result;
  }

  // Case 2: Shorthand notation like "1-c; 2-a; 3-b" or "1:c; 2:a" or "1-c, 2-a"
  if (matchingPairs) {
    const pairsRecord = normalizePairs(matchingPairs);
    const leftKeys = Object.keys(pairsRecord);
    const segments = value.split(/[;,]/).map(s => s.trim()).filter(Boolean);
    let matchedAny = false;
    for (const seg of segments) {
      const m = seg.match(/^(\d+|[a-zA-Z\s]+)\s*[-:]\s*(.+)$/);
      if (m) {
        let leftKey = m[1].trim();
        const rightVal = m[2].trim();
        if (/^\d+$/.test(leftKey)) {
          const idx = parseInt(leftKey, 10) - 1;
          if (leftKeys[idx]) {
            leftKey = leftKeys[idx];
          }
        }
        result[leftKey] = rightVal.split(',').map(r => r.trim()).filter(Boolean);
        matchedAny = true;
      }
    }
    if (matchedAny) return result;
  }

  // Case 3: If matchingPairs itself is provided and has { left: right }
  if (matchingPairs && Object.keys(result).length === 0) {
    const pairsRecord = normalizePairs(matchingPairs);
    for (const [left, right] of Object.entries(pairsRecord)) {
      result[left] = right.split(',').map(r => r.trim()).filter(Boolean);
    }
  }

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
    const studentPairs = parseMatchingValue(value, pairsRecord);
    const correctPairs = parseMatchingValue(question.correct_answer, pairsRecord);

    // If correctPairs is empty or missing keys from pairsRecord, use pairsRecord as ground truth
    if (Object.keys(correctPairs).length === 0 && Object.keys(pairsRecord).length > 0) {
      for (const [left, right] of Object.entries(pairsRecord)) {
        correctPairs[left] = right.split(',').map(r => r.trim()).filter(Boolean);
      }
    }

    const leftKeys = Object.keys(pairsRecord).length > 0
      ? Object.keys(pairsRecord)
      : Array.from(new Set([...Object.keys(studentPairs), ...Object.keys(correctPairs)]));

    if (leftKeys.length === 0) return false;

    return leftKeys.every(l => {
      const sRights = (studentPairs[l] || []).map(s => s.trim().toLowerCase()).sort();
      const cRights = (correctPairs[l] || []).map(s => s.trim().toLowerCase()).sort();
      if (sRights.length !== cRights.length || sRights.length === 0) return false;
      return sRights.every((r, i) => r === cRights[i]);
    });
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
