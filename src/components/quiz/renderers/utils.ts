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

  // Case 2: Shorthand notation like "1-c; 2-a; 3-b" or "1:c; 2:a" or "1-a,c; 2-b,d,e" or "1-a,b, 2-c"
  const pairsRecord = matchingPairs ? normalizePairs(matchingPairs) : {};
  const leftKeys = Object.keys(pairsRecord);
  const segments = value.split(/;\s*|,\s*(?=\d+\s*[-–:])/).map(s => s.trim()).filter(Boolean);
  let matchedAny = false;
  for (const seg of segments) {
    const m = seg.match(/^(\d+|[^\-–:;]+)\s*[-–:]\s*(.+)$/);
    if (m) {
      let leftKey = m[1].trim();
      const rightVal = m[2].trim();
      if (/^\d+$/.test(leftKey) && leftKeys.length > 0) {
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

  // Case 3: If matchingPairs itself is provided and has { left: right }
  if (matchingPairs && Object.keys(result).length === 0) {
    const pairsRecord = normalizePairs(matchingPairs);
    for (const [left, right] of Object.entries(pairsRecord)) {
      result[left] = right.split(',').map(r => r.trim()).filter(Boolean);
    }
  }

  return result;
}

export interface NumberedItem {
  num: number;
  text: string;
}

export interface ParsedNumberedQuestion {
  header: string;
  items: NumberedItem[];
}

export function parseNumberedItems(text?: string | null): ParsedNumberedQuestion | null {
  if (!text) return null;
  // If text contains markdown table syntax, do not split as numbered items
  if (text.includes('| :---') || text.includes('|:---') || text.includes('| --- |')) {
    return null;
  }

  const lines = text.split('\n');
  const headerLines: string[] = [];
  const items: NumberedItem[] = [];

  const itemRe = /^\s*([1-9]\d?)\s*[.)]\s*(.+)$/;
  let inItems = false;

  for (const line of lines) {
    const stripped = line.trim();
    const match = stripped.match(itemRe);
    if (match) {
      inItems = true;
      items.push({
        num: parseInt(match[1], 10),
        text: match[2].trim(),
      });
    } else {
      if (inItems && stripped) {
        if (items.length > 0) {
          items[items.length - 1].text += '\n' + stripped;
        }
      } else if (!inItems) {
        headerLines.push(line);
      }
    }
  }

  if (items.length >= 2) {
    return {
      header: headerLines.join('\n').trim(),
      items,
    };
  }

  return null;
}

export function isSequenceQuestion(text?: string | null): boolean {
  if (!text) return false;
  const t = text.toLowerCase();
  return (t.includes('ardıcıl') || t.includes('xronoloji')) && !t.includes('sxemi tamamlayın');
}

export function isAnswerCorrect(question: Question, value: string): boolean {
  if (!value && value !== '0') return false;
  const qt = question.question_type;

  if (qt === 'essay' || qt === 'code') {
    return false;
  }

  if (qt === 'multiple_choice') {
    const ca = (question.correct_answer || '').trim();
    const val = value.trim();

    // 1. Direct match
    if (ca.toLowerCase() === val.toLowerCase()) return true;

    // 2. Single letter match
    if (ca.length === 1 && /^[A-Z]$/i.test(ca) && question.options) {
      const idx = ca.toUpperCase().charCodeAt(0) - 65;
      if (question.options[idx] && question.options[idx].trim().toLowerCase() === val.toLowerCase()) {
        return true;
      }
    }

    // 3. Cross-language index match
    const getOptionIndex = (str: string): number => {
      const clean = str.trim().toLowerCase();
      if (question.options) {
        const i = question.options.findIndex(o => o.trim().toLowerCase() === clean);
        if (i !== -1) return i;
      }
      if (question.base_options) {
        const i = question.base_options.findIndex(o => o.trim().toLowerCase() === clean);
        if (i !== -1) return i;
      }
      if (question.translation_options) {
        const i = question.translation_options.findIndex(o => o.trim().toLowerCase() === clean);
        if (i !== -1) return i;
      }
      return -1;
    };

    const valIdx = getOptionIndex(val);
    const caIdx = getOptionIndex(ca);
    if (valIdx !== -1 && caIdx !== -1 && valIdx === caIdx) {
      return true;
    }

    return false;
  }

  if (qt === 'numerical') {
    const rawVal = String(value || '').trim();
    const rawCorrect = String(question.correct_answer || question.numerical_answer || '').trim();
    if (!rawVal || !rawCorrect) return false;

    // Check if this numerical question has multi-item numbered choices
    const parsedNumbered = parseNumberedItems(question.question_text);
    if (parsedNumbered && parsedNumbered.items.length >= 2) {
      const cleanVal = rawVal.replace(/\D/g, '');
      const cleanCorrect = rawCorrect.replace(/\D/g, '');
      const isSeq = isSequenceQuestion(question.question_text);

      if (isSeq) {
        if (cleanVal === cleanCorrect) return true;
      } else {
        if (cleanCorrect.length >= 1 && cleanVal.length === cleanCorrect.length) {
          const sortedVal = cleanVal.split('').sort().join('');
          const sortedCorrect = cleanCorrect.split('').sort().join('');
          if (sortedVal === sortedCorrect) return true;
        }
      }
    }

    // Standard floating-point numeric comparison for math/calculation questions
    const numAnswer = parseFloat(rawVal.replace(',', '.'));
    const correctNum = question.numerical_answer ?? parseFloat(rawCorrect.replace(',', '.'));
    const tolerance = question.numerical_tolerance ?? 0;
    if (isNaN(numAnswer) || isNaN(correctNum)) return false;
    return Math.abs(numAnswer - correctNum) <= tolerance;
  }

  if (qt === 'fill_blank') {
    const studentAnswers = value.split('|').map(a => a.trim().toLowerCase());
    const correctAnswers = (question.correct_answer || '').split('|').map(a => a.trim().toLowerCase());
    if (studentAnswers.length !== correctAnswers.length) return false;
    return studentAnswers.every((a, i) => a === correctAnswers[i]);
  }

  if (qt === 'ordering') {
    const studentSeq = value.split('|||').map(s => s.trim());
    const correctSeq = (
      question.sequence_items?.length
        ? question.sequence_items
        : (question.correct_answer || '').split('|||')
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
    const parts = (question.correct_answer || '').split(':');
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
    const ca = (question.correct_answer || '').trim();
    const isCorrectA = ca === 'A' || ca === 'Doğru' || ca.toLowerCase() === 'true';
    if (isCorrectA) return value === 'true' || value === 'A';
    return value === 'false' || value === 'B';
  }

  if (qt === 'multiple_select') {
    const studentAnswers = value.split(',').map(a => a.trim().toLowerCase()).filter(Boolean).sort();
    const correctAnswers = (question.correct_answer || '').split(',').map(a => a.trim().toLowerCase()).filter(Boolean).sort();
    if (studentAnswers.length !== correctAnswers.length) return false;
    return studentAnswers.every((a, i) => a === correctAnswers[i]);
  }

  // Short answer or fallback (allowing pipe-separated alternatives: "Bakı|Baku")
  const normalize = (s: string) =>
    s.trim().toLowerCase().replace(/[\s\u00a0]+/g, ' ').replace(/[.,!?;:'"]/g, '');
  const normalizedStudent = normalize(value);
  const acceptedAnswers = (question.correct_answer || '').split('|').map(normalize);
  return acceptedAnswers.some(accepted => accepted === normalizedStudent);
}

export interface AnswerEvaluation {
  isCorrect: boolean;
  pointsEarned: number;
  maxPoints: number;
  needsReview: boolean;
}

export function evaluateAnswer(question: Question, value: string): AnswerEvaluation {
  const maxPoints = question.weight ?? 1;
  const qt = question.question_type;

  if (qt === 'essay' || qt === 'code') {
    return {
      isCorrect: false,
      pointsEarned: 0,
      maxPoints,
      needsReview: true,
    };
  }

  // Partial credit for matching
  if (qt === 'matching') {
    const pairsRecord = normalizePairs(question.matching_pairs ?? null);
    const studentPairs = parseMatchingValue(value, pairsRecord);
    const correctPairs = parseMatchingValue(question.correct_answer, pairsRecord);

    if (Object.keys(correctPairs).length === 0 && Object.keys(pairsRecord).length > 0) {
      for (const [left, right] of Object.entries(pairsRecord)) {
        correctPairs[left] = right.split(',').map(r => r.trim()).filter(Boolean);
      }
    }

    const leftKeys = Object.keys(pairsRecord).length > 0
      ? Object.keys(pairsRecord)
      : Array.from(new Set([...Object.keys(studentPairs), ...Object.keys(correctPairs)]));

    if (leftKeys.length === 0) {
      return { isCorrect: false, pointsEarned: 0, maxPoints, needsReview: false };
    }

    let correctCount = 0;
    for (const l of leftKeys) {
      const sRights = (studentPairs[l] || []).map(s => s.trim().toLowerCase()).sort();
      const cRights = (correctPairs[l] || []).map(s => s.trim().toLowerCase()).sort();
      if (sRights.length > 0 && sRights.length === cRights.length && sRights.every((r, i) => r === cRights[i])) {
        correctCount++;
      }
    }

    const isCorrect = correctCount === leftKeys.length;
    const pointsEarned = isCorrect
      ? maxPoints
      : Math.round((correctCount / leftKeys.length) * maxPoints * 100) / 100;

    return { isCorrect, pointsEarned, maxPoints, needsReview: false };
  }

  // Partial credit for multiple_select
  if (qt === 'multiple_select') {
    const studentAnswers = value.split(',').map(a => a.trim().toLowerCase()).filter(Boolean);
    const correctAnswers = (question.correct_answer || '').split(',').map(a => a.trim().toLowerCase()).filter(Boolean);

    if (correctAnswers.length === 0) {
      return { isCorrect: false, pointsEarned: 0, maxPoints, needsReview: false };
    }

    const correctSelected = studentAnswers.filter(a => correctAnswers.includes(a)).length;
    const incorrectSelected = studentAnswers.filter(a => !correctAnswers.includes(a)).length;

    const isCorrect = correctSelected === correctAnswers.length && incorrectSelected === 0;
    const netCorrect = Math.max(0, correctSelected - incorrectSelected);
    const pointsEarned = isCorrect
      ? maxPoints
      : Math.round((netCorrect / correctAnswers.length) * maxPoints * 100) / 100;

    return { isCorrect, pointsEarned, maxPoints, needsReview: false };
  }

  const isCorrect = isAnswerCorrect(question, value);
  return {
    isCorrect,
    pointsEarned: isCorrect ? maxPoints : 0,
    maxPoints,
    needsReview: false,
  };
}
