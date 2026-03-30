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
  const LEFT_RE = /^(\d+)[:.]?\s+(.+)$/;
  const RIGHT_LABEL_RE = /^([a-z])\)\s+(.+)$/i;

  const questionLines: string[] = [];
  const leftItems: Array<{ id: string; text: string }> = [];
  const rightItems: Array<{ id: string; text: string }> = [];
  const metaLines: string[] = [];

  for (const line of lines) {
    const clean = line.trim();
    if (!clean || TIP_LINE_RE.test(clean)) continue;
    
    if (BASE_META_RE.test(clean)) {
      metaLines.push(clean);
      continue;
    }

    const rightMatch = clean.match(RIGHT_LABEL_RE);
    if (rightMatch) {
      rightItems.push({ id: rightMatch[1].toLowerCase(), text: rightMatch[2].trim() });
      continue;
    }

    const inlineRights = extractInlineOptions(clean);
    if (inlineRights.length > 0) {
      // If we find inline options like "a) ... b) ...", use them as right items
      // extractInlineOptions might need to be adjusted for matching, 
      // but usually these are labeled with letters.
      inlineRights.forEach((text, idx) => {
        const label = String.fromCharCode(97 + idx); // a, b, c...
        rightItems.push({ id: label, text });
      });
      continue;
    }

    const leftMatch = clean.match(LEFT_RE);
    if (leftMatch) {
      leftItems.push({ id: leftMatch[1], text: leftMatch[2].trim() });
    } else if (leftItems.length === 0 && rightItems.length === 0) {
      questionLines.push(clean);
    } else {
      // Check if it's a plain line that should be a left item
      leftItems.push({ id: (leftItems.length + 1).toString(), text: clean });
    }
  }

  const result: Partial<ParsedQuestion> = {
    question_text: buildQuestionText(questionLines) || 'Uyğunluğu müəyyən edin',
    question_type: 'matching',
    difficulty: 'orta',
  };

  extractMetadata(metaLines, result);

  // If we have a complex answer string like "1-b, d; 2-a", parse it
  if (result.correct_answer && result.correct_answer.includes('-')) {
    const pairs: string[] = [];
    const segments = result.correct_answer.split(';').map(s => s.trim());
    
    segments.forEach(seg => {
      const parts = seg.split(/[-:]/);
      if (parts.length === 2) {
        const leftId = parts[0].trim();
        const rightLabels = parts[1].split(',').map(l => l.trim().toLowerCase());
        
        const leftItem = leftItems.find(l => l.id === leftId);
        if (leftItem) {
          const matchedRights = rightItems
            .filter(r => rightLabels.includes(r.id))
            .map(r => r.text);
          
          if (matchedRights.length > 0) {
            pairs.push(`${leftItem.text}:${matchedRights.join(',')}`);
          }
        }
      }
    });

    if (pairs.length > 0) {
      result.correct_answer = pairs.join('|||');
    }
  }

  // Populate matching_pairs for the UI (this shows all left and right options)
  const finalPairs: Record<string, string> = {};
  leftItems.forEach(l => {
    finalPairs[l.text] = rightItems.map(r => r.text).join(',');
  });
  result.matching_pairs = finalPairs;

  const warnings: ParseWarning[] = [];
  if (leftItems.length === 0 || rightItems.length === 0) {
    warnings.push({
      line: lineOffset,
      type: 'missing_answer',
      message: 'Uyğunlaşdırma sualında həm sol, həm də sağ tərəf elementləri olmalıdır',
      severity: 'error',
    });
  }

  return { questions: [result as ParsedQuestion], warnings };
}

// ── Helpers for the new logic ──
function extractInlineOptions(line: string): string[] {
  // Simple extraction for matching: finds "a) text b) text"
  const regex = /([a-z]\))\s+((?:(?![a-z]\)\s+).)+)/gi;
  const matches = [...line.matchAll(regex)];
  return matches.map(m => m[2].trim());
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
