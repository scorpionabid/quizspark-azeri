import { ParsedQuestion, ParseWarning } from './types';
import { extractMetadata } from './parser-utils';
import { buildMetaRE, ANSWER_META, TIP_LINE_RE } from './markdown-utils';

type BlockResult = { questions: ParsedQuestion[]; warnings: ParseWarning[] };

// META_RE variants for each block type
const BASE_META_RE = buildMetaRE();
const FILL_META_RE = buildMetaRE(ANSWER_META);
const NUM_META_RE = buildMetaRE(`${ANSWER_META}|Tolerans|Tolerance`);
const CODE_META_RE = buildMetaRE(`${ANSWER_META}|Dil|Language`);

// ─── Helpers ──────────────────────────────────────────────────────────────────

function collectLines(
  lines: string[],
  metaRE: RegExp,
): { questionLines: string[]; metaLines: string[] } {
  const questionLines: string[] = [];
  const metaLines: string[] = [];
  for (const line of lines) {
    const clean = line.trim();
    if (!clean) continue;
    if (metaRE.test(clean)) metaLines.push(clean);
    else questionLines.push(clean);
  }
  return { questionLines, metaLines };
}

function buildQuestionText(lines: string[]): string {
  return lines.filter((l) => !TIP_LINE_RE.test(l)).join(' ').trim();
}

// ─── Matching ─────────────────────────────────────────────────────────────────

/**
 * İki format dəstəklənir:
 *
 * Format A — Arrow (→ / ->):
 *   Sol element → Sağ element
 *
 * Format B — Numbered left + lettered right:
 *   1. Sol 1
 *   2. Sol 2
 *   a) Sağ a
 *   b) Sağ b
 *   Cavab: 1-a; 2-b
 *
 * Format C — Mürəkkəb (N-to-M):
 *   Cavab: 1-a, c; 2-b, d
 */
export function parseMatchingBlock(lines: string[], lineOffset: number): BlockResult {
  const ARROW_RE = /^(.+?)\s*(?:→|->|::)\s*(.+)$/;
  const LEFT_RE = /^(\d+)[.):]?\s+(.+)$/;
  const RIGHT_LABEL_RE = /^([a-z])[.):]\s+(.+)$/i;

  const questionLines: string[] = [];
  const leftItems: Array<{ id: string; text: string }> = [];
  const rightItems: Array<{ id: string; text: string }> = [];
  const metaLines: string[] = [];
  const arrowPairs: Array<{ left: string; right: string }> = [];

  for (const line of lines) {
    const clean = line.trim();
    if (!clean || TIP_LINE_RE.test(clean)) continue;

    if (BASE_META_RE.test(clean)) {
      metaLines.push(clean);
      continue;
    }

    // Format A: arrow cütlər
    const arrowMatch = clean.match(ARROW_RE);
    if (arrowMatch) {
      arrowPairs.push({ left: arrowMatch[1].trim(), right: arrowMatch[2].trim() });
      continue;
    }

    // Format B: sağ tərəf (hərfli)
    const rightMatch = clean.match(RIGHT_LABEL_RE);
    if (rightMatch && leftItems.length > 0) {
      rightItems.push({ id: rightMatch[1].toLowerCase(), text: rightMatch[2].trim() });
      continue;
    }

    // Format B: sol tərəf (rəqəmli)
    const leftMatch = clean.match(LEFT_RE);
    if (leftMatch && arrowPairs.length === 0) {
      leftItems.push({ id: leftMatch[1], text: leftMatch[2].trim() });
      continue;
    }

    // Sual mətni
    if (leftItems.length === 0 && rightItems.length === 0 && arrowPairs.length === 0) {
      questionLines.push(clean);
    }
  }

  // ── Xam cavab sətirini extractMetadata-dan əvvəl çıxart ─────────────────────
  // extractMetadata "Cavab: 1-a; 2-b; 3-c" sətirini split(/[,;]/) ilə parçalayıb
  // "1-a,2-b,3-c" kimi yenidən birləşdirir. Bu, matching üçün lazım olan
  // nöqtəli vergülü məhv edir. Ona görə xam dəyəri əvvəlcədən saxlayırıq.
  const CAVAB_RE = /^(?:Cavab|Düzgün\s*cavab|Doğru\s*cavab|ANSWER)\s*[-:]\s*(.+)$/i;
  let rawMatchingAnswer = '';
  for (const ml of metaLines) {
    const m = ml.match(CAVAB_RE);
    if (m) { rawMatchingAnswer = m[1].trim(); break; }
  }

  const result: Partial<ParsedQuestion> = {
    question_text: buildQuestionText(questionLines) || 'Uyğunluğu müəyyən edin',
    question_type: 'matching',
    difficulty: 'orta',
  };

  extractMetadata(metaLines, result);

  // ── Format A: arrow cütlər → birbaşa matching_pairs ──────────────────────
  if (arrowPairs.length >= 2) {
    const pairs: Record<string, string> = {};
    arrowPairs.forEach(({ left, right }) => {
      pairs[left] = right;
    });
    result.matching_pairs = pairs;
    // correct_answer: "Sol1:Sağ1|||Sol2:Sağ2"
    result.correct_answer = arrowPairs.map(({ left, right }) => `${left}:${right}`).join('|||');
    return { questions: [result as ParsedQuestion], warnings: [] };
  }

  // ── Format B/C: numbered left + lettered right ────────────────────────────
  const warnings: ParseWarning[] = [];

  if (leftItems.length === 0 || rightItems.length === 0) {
    warnings.push({
      line: lineOffset,
      type: 'missing_answer',
      message: 'Uyğunlaşdırma sualında həm sol, həm də sağ tərəf elementləri olmalıdır',
      severity: 'error',
    });
    return { questions: [result as ParsedQuestion], warnings };
  }

  // Xam cavab sətirindən cüt-map qur: "1-a; 2-b, c" → { "1": ["a","c"], "2": ["b"] }
  // NOT: result.correct_answer-ı deyil rawMatchingAnswer-ı istifadə edirik —
  // çünki extractMetadata nöqtəli vergülü artıq məhv edib.
  const answerMap: Record<string, string[]> = {};
  if (rawMatchingAnswer) {
    const segments = rawMatchingAnswer.split(/[;،]/).map(s => s.trim()).filter(Boolean);
    for (const seg of segments) {
      // "1-a, c" → leftId="1", rightLabels=["a","c"]
      const dashMatch = seg.match(/^(\d+)\s*[-:]\s*(.+)$/);
      if (dashMatch) {
        const leftId = dashMatch[1].trim();
        const rightLabels = dashMatch[2].split(/[,،]/).map(l => l.trim().toLowerCase()).filter(Boolean);
        answerMap[leftId] = rightLabels;
      }
    }
  }

  // matching_pairs: { leftText: rightText } — cavab xəritəsinə əsasən
  const finalPairs: Record<string, string> = {};
  const correctParts: string[] = [];

  leftItems.forEach(l => {
    const matchedLabels = answerMap[l.id] ?? [];
    const matchedRights = rightItems.filter(r => matchedLabels.includes(r.id));

    if (matchedRights.length > 0) {
      // Birdən çox sağ cavab ola bilər (N:M)
      finalPairs[l.text] = matchedRights.map(r => r.text).join(',');
      correctParts.push(`${l.text}:${matchedRights.map(r => r.text).join(',')}`);
    } else {
      // Cavab göstərilməyibsə, sağ tərəfin bütün elementlərini qoy (UI-da seçim üçün)
      finalPairs[l.text] = rightItems.map(r => r.text).join(',');
    }
  });

  result.matching_pairs = finalPairs;
  if (correctParts.length > 0) {
    result.correct_answer = correctParts.join('|||');
  } else if (rawMatchingAnswer) {
    // Cavab xəritəsi quruldu amma uyğun elementlər tapılmadı — xəbərdarlıq
    warnings.push({
      line: lineOffset,
      type: 'invalid_correct_answer',
      message: `"Cavab: ${rawMatchingAnswer}" — göstərilən işarələr sağ tərəf siyahısındakı həriflərlə uyğunlaşmır (a, b, c, ... istifadə edin)`,
      severity: 'warning',
    });
  } else {
    // Ümumiyyətlə Cavab: sətiri yoxdur
    warnings.push({
      line: lineOffset,
      type: 'missing_answer',
      message: 'Uyğunlaşdırma sualında "Cavab: 1-a; 2-b; 3-c" formatında düzgün cavab göstərilməyib',
      severity: 'error',
    });
  }

  return { questions: [result as ParsedQuestion], warnings };
}

// ─── Ordering ─────────────────────────────────────────────────────────────────

export function parseOrderingBlock(lines: string[], lineOffset: number): BlockResult {
  const ITEM_RE = /^(?:\d+[.):]?\s+|[-•*]\s+)(.+)$/;

  const questionLines: string[] = [];
  const items: string[] = [];
  const metaLines: string[] = [];

  for (const line of lines) {
    const clean = line.trim();
    if (!clean) continue;
    if (TIP_LINE_RE.test(clean)) continue;
    if (BASE_META_RE.test(clean)) {
      metaLines.push(clean);
      continue;
    }
    const itemMatch = clean.match(ITEM_RE);
    if (itemMatch) {
      items.push(itemMatch[1].trim());
    } else if (items.length === 0) {
      questionLines.push(clean);
    } else {
      metaLines.push(clean);
    }
  }

  const questionText =
    buildQuestionText(questionLines) || 'Düzgün ardıcıllığı müəyyən edin';

  const result: Partial<ParsedQuestion> = {
    question_text: questionText,
    question_type: 'ordering',
    difficulty: 'orta',
    sequence_items: items as unknown as string[],
    correct_answer: items.join('|||'),
  };

  extractMetadata(metaLines, result);

  const warnings: ParseWarning[] = [];
  if (items.length < 2) {
    warnings.push({
      line: lineOffset,
      type: 'missing_answer',
      message: 'Ardıcıllıq sualında ən azı 2 element lazımdır',
      severity: 'error',
    });
  }

  return { questions: [result as ParsedQuestion], warnings };
}

// ─── Fill Blank ───────────────────────────────────────────────────────────────

export function parseFillBlankBlock(lines: string[], lineOffset: number): BlockResult {
  const { questionLines, metaLines } = collectLines(lines, FILL_META_RE);
  const template = buildQuestionText(questionLines);

  const result: Partial<ParsedQuestion> = {
    question_text: template,
    question_type: 'fill_blank',
    difficulty: 'orta',
    fill_blank_template: template,
  };

  extractMetadata(metaLines, result);

  const warnings: ParseWarning[] = [];
  if (!template.includes('___')) {
    warnings.push({
      line: lineOffset,
      type: 'empty_question',
      message: 'Fill-blank sualında ___ boşluq işarəsi tapılmadı',
      severity: 'error',
    });
  }
  if (!result.correct_answer) {
    warnings.push({
      line: lineOffset,
      type: 'missing_answer',
      message: 'Fill-blank sualında "Cavab:" bölməsi tapılmadı',
      severity: 'error',
    });
  }

  return { questions: [result as ParsedQuestion], warnings };
}

// ─── Numerical ────────────────────────────────────────────────────────────────

export function parseNumericalBlock(lines: string[], lineOffset: number): BlockResult {
  const { questionLines, metaLines } = collectLines(lines, NUM_META_RE);
  const questionText = buildQuestionText(questionLines);

  const result: Partial<ParsedQuestion> = {
    question_text: questionText,
    question_type: 'numerical',
    difficulty: 'orta',
  };

  extractMetadata(metaLines, result);

  if (result.correct_answer && !result.numerical_answer) {
    const parsed = parseFloat(result.correct_answer);
    if (!isNaN(parsed)) result.numerical_answer = parsed;
  }

  const warnings: ParseWarning[] = [];
  if (!result.correct_answer) {
    warnings.push({
      line: lineOffset,
      type: 'missing_answer',
      message: 'Rəqəmsal sualda "Cavab:" bölməsi tapılmadı',
      severity: 'error',
    });
  }

  return { questions: [result as ParsedQuestion], warnings };
}

// ─── Code ─────────────────────────────────────────────────────────────────────

export function parseCodeBlock(lines: string[], lineOffset: number): BlockResult {
  const questionLines: string[] = [];
  const metaLines: string[] = [];
  const codeLines: string[] = [];
  let inCode = false;
  let codeLang = '';

  for (const line of lines) {
    const clean = line.trim();
    if (!clean) {
      if (inCode) codeLines.push('');
      continue;
    }
    const fenceStart = clean.match(/^```(\w*)$/);
    if (fenceStart && !inCode) {
      inCode = true;
      codeLang = fenceStart[1] || '';
      continue;
    }
    if (clean === '```' && inCode) {
      inCode = false;
      continue;
    }
    if (inCode) {
      codeLines.push(line);
    } else if (CODE_META_RE.test(clean)) {
      metaLines.push(clean);
    } else {
      questionLines.push(clean);
    }
  }

  const questionText = buildQuestionText(questionLines);
  const codeSnippet = codeLines.join('\n').trim();

  const result: Partial<ParsedQuestion> = {
    question_text: questionText,
    question_type: 'code',
    difficulty: 'orta',
    fill_blank_template: codeSnippet || null,
  };

  if (codeLang) result.hint = `lang:${codeLang.toLowerCase()}`;

  extractMetadata(metaLines, result);

  if (result.hint && !result.hint.startsWith('lang:')) {
    result.hint = `lang:${result.hint}`;
  }

  const warnings: ParseWarning[] = [];
  if (!result.correct_answer) {
    warnings.push({
      line: lineOffset,
      type: 'missing_answer',
      message: 'Kod sualında "Cavab:" bölməsi tapılmadı',
      severity: 'error',
    });
  }

  return { questions: [result as ParsedQuestion], warnings };
}
