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

export function parseMatchingBlock(lines: string[], lineOffset: number): BlockResult {
  const PAIR_RE = /^(.+?)\s*(?:→|->|=|::)\s*(.+)$/;

  const questionLines: string[] = [];
  const pairs: Array<{ left: string; right: string }> = [];
  const metaLines: string[] = [];

  for (const line of lines) {
    const clean = line.trim();
    if (!clean) continue;
    const pairMatch = clean.match(PAIR_RE);
    if (pairMatch && !BASE_META_RE.test(clean)) {
      pairs.push({ left: pairMatch[1].trim(), right: pairMatch[2].trim() });
    } else if (BASE_META_RE.test(clean)) {
      metaLines.push(clean);
    } else if (pairs.length === 0) {
      questionLines.push(clean);
    } else {
      metaLines.push(clean);
    }
  }

  const questionText = buildQuestionText(questionLines) || 'Uyğunlaşdırın';
  const pairsRecord: Record<string, string> = Object.fromEntries(
    pairs.map((p) => [p.left, p.right]),
  );

  const result: Partial<ParsedQuestion> = {
    question_text: questionText,
    question_type: 'matching',
    difficulty: 'orta',
    matching_pairs: pairsRecord,
    correct_answer: pairs.map((p) => `${p.left}:${p.right}`).join('|||'),
  };

  extractMetadata(metaLines, result);

  const warnings: ParseWarning[] = [];
  if (pairs.length < 2) {
    warnings.push({
      line: lineOffset,
      type: 'missing_answer',
      message: 'Uyğunlaşdırma sualında ən azı 2 cüt lazımdır',
      severity: 'error',
    });
  }

  return { questions: [result as ParsedQuestion], warnings };
}

// ─── Ordering ─────────────────────────────────────────────────────────────────

export function parseOrderingBlock(lines: string[], lineOffset: number): BlockResult {
  const ITEM_RE = /^(?:\d+[.)]\s+|[-•*]\s+)(.+)$/;

  const questionLines: string[] = [];
  const items: string[] = [];
  const metaLines: string[] = [];

  for (const line of lines) {
    const clean = line.trim();
    if (!clean) continue;
    const itemMatch = clean.match(ITEM_RE);
    if (itemMatch && !BASE_META_RE.test(clean)) {
      items.push(itemMatch[1].trim());
    } else if (BASE_META_RE.test(clean)) {
      metaLines.push(clean);
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

  // Ensure hint always has lang: prefix when set without it
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
