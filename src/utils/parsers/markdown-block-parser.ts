import { ParsedQuestion, ParseWarning, ParseResult } from './types';
import { extractMetadata } from './parser-utils';
import {
  TRUE_FALSE_RE,
  warnDuplicateOptions,
  warnIfMissingText,
  warnIfMissingAnswer,
} from './markdown-utils';
import {
  parseMatchingBlock,
  parseOrderingBlock,
  parseFillBlankBlock,
  parseNumericalBlock,
  parseCodeBlock,
} from './markdown-type-parsers';
import { parseMarkdownFormat1, parseMarkdownFormat2 } from './markdown-format-parsers';

type BlockResult = { questions: ParsedQuestion[]; warnings: ParseWarning[] };

// ─── Generic MCQ / Short Answer block ────────────────────────────────────────

/**
 * Tip etiketi olmayan, spesifik format göstərişi olmayan blokları parse edir.
 * MCQ, true_false, multiple_select və short_answer növlərini avtomatik aşkarlayır.
 * `extractMetadata` cavab həllini (hərf → mətn) öz daxilində aparır.
 */
function parseGenericBlock(lines: string[], lineOffset: number): BlockResult {
  const META_RE =
    /^(İzahat|Izahat|Explanation|Açıqlama|Kateqoriya|Category|Çətinlik|Difficulty|Bloom|Taqlar|Tags|ANSWER|Düzgün|Cavab|Doğru cavab)\s*[:-]/iu;

  const questionLines: string[] = [];
  const options: string[] = [];
  const metaLines: string[] = [];
  let parsingOptions = false;

  for (const line of lines) {
    const aikenOpt = line.match(/^([A-Za-z\d]+)\s*[).]\s+(.+)/);
    const bulletOpt = line.match(/^[-•*]\s+(?!\[)(.+)/);
    const isMeta = META_RE.test(line);

    if (isMeta) {
      parsingOptions = false;
      metaLines.push(line);
    } else if (aikenOpt) {
      parsingOptions = true;
      options.push(aikenOpt[2].trim());
    } else if (bulletOpt && parsingOptions) {
      options.push(bulletOpt[1].trim());
    } else if (!parsingOptions) {
      questionLines.push(line);
    } else {
      metaLines.push(line);
    }
  }

  const questionText = questionLines.join('\n').trim();
  const isTrueFalse = options.length === 2 && options.every((o) => TRUE_FALSE_RE.test(o.trim()));

  const result: Partial<ParsedQuestion> = {
    question_text: questionText,
    question_type: isTrueFalse ? 'true_false' : options.length > 0 ? 'multiple_choice' : 'short_answer',
    difficulty: 'orta',
    options: options.length > 0 ? options : null,
  };

  // extractMetadata handles answer resolution (letter/number → option text)
  // using result.options which is already populated above
  extractMetadata(metaLines, result);

  const warnings: ParseWarning[] = [];

  const missingText = warnIfMissingText(questionText, lineOffset);
  if (missingText) warnings.push(missingText);

  if (options.length > 0) {
    warnings.push(...warnDuplicateOptions(options, lineOffset));
  }

  if (!result.correct_answer) {
    warnings.push(warnIfMissingAnswer(questionText, lineOffset));
  }

  return { questions: [result as ParsedQuestion], warnings };
}

// ─── parseSingleBlock ─────────────────────────────────────────────────────────

/**
 * Tək sual blokunu parse edir.
 *
 * Dispatch sırası:
 *   1. `Tip:` etiketinə baxır → spesifik tip parser-ə yönləndirir
 *   2. `→` / `->` cüt sətirləri → matching
 *   3. `___` → fill_blank
 *   4. ` ``` ` → code
 *   5. `- [x]` checklist → Format1
 *   6. Digər → parseGenericBlock
 */
export function parseSingleBlock(block: string, lineOffset: number): BlockResult {
  const lines = block
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);
  if (!lines.length) return { questions: [], warnings: [] };

  // 1 — Tip: etiketinə görə spesifik parser
  const tipLine = lines.find((l) => /^Tip\s*:/i.test(l));
  if (tipLine) {
    const tipValue = tipLine.replace(/^Tip\s*:\s*/i, '').trim().toLowerCase();
    if (['matching', 'uyğunlaşdırma', 'uygunlashdirma'].some((t) => tipValue.includes(t))) {
      return parseMatchingBlock(lines, lineOffset);
    }
    if (['ordering', 'ardıcıllıq', 'sıralama', 'siralama'].some((t) => tipValue.includes(t))) {
      return parseOrderingBlock(lines, lineOffset);
    }
    if (['fill_blank', 'fill blank', 'boşluq', 'bosluq'].some((t) => tipValue.includes(t))) {
      return parseFillBlankBlock(lines, lineOffset);
    }
    if (['numerical', 'rəqəmsal', 'reqemsal'].some((t) => tipValue.includes(t))) {
      return parseNumericalBlock(lines, lineOffset);
    }
    if (['code', 'kod'].some((t) => tipValue.includes(t))) {
      return parseCodeBlock(lines, lineOffset);
    }
  }

  // 2 — Arrow cütlər → matching
  const META_RE_LIGHT =
    /^(İzahat|Izahat|Explanation|Açıqlama|Kateqoriya|Category|Çətinlik|Difficulty|Bloom|Taqlar|Tags|Cavab|Düzgün|ANSWER|Tolerans|Dil)\s*[-:]/iu;
  const PAIR_RE = /^.+\s*(?:→|->|::)\s*.+$/;
  const pairLines = lines.filter((l) => PAIR_RE.test(l) && !META_RE_LIGHT.test(l));
  if (pairLines.length >= 2) {
    return parseMatchingBlock(lines, lineOffset);
  }

  // 3 — Boşluq işarəsi → fill_blank
  if (lines.some((l) => /___/.test(l) && !META_RE_LIGHT.test(l))) {
    return parseFillBlankBlock(lines, lineOffset);
  }

  // 4 — Kod bloku → code
  if (block.includes('```')) {
    return parseCodeBlock(lines, lineOffset);
  }

  // 5 — Checklist → Format1 (wraps first line as heading)
  if (/^[-*]\s*\[[ xX]\]/.test(block)) {
    const wrapped = '# ' + lines[0] + '\n' + lines.slice(1).join('\n');
    return parseMarkdownFormat1(wrapped);
  }

  // 6 — Generic MCQ / short_answer
  return parseGenericBlock(lines, lineOffset);
}

// ─── parseMarkdownSeparated ───────────────────────────────────────────────────

/**
 * `---` (və oxşar) ayrıcılı çoxlu sual bloklarını parse edir.
 */
export function parseMarkdownSeparated(content: string): ParseResult {
  const allQuestions: ParsedQuestion[] = [];
  const allWarnings: ParseWarning[] = [];

  const blocks = content.split(/^(?:---+|===+|___+|\*\*\*+|⸻+|—+)\s*$/m);
  let lineOffset = 0;

  for (const block of blocks) {
    const trimmed = block.trim();
    lineOffset += block.split('\n').length;
    if (!trimmed) continue;

    if (/^#\s+/m.test(trimmed)) {
      const r = parseMarkdownFormat1(trimmed);
      allQuestions.push(...r.questions);
      allWarnings.push(...r.warnings);
      continue;
    }

    if (/^\d+[.)]\s/m.test(trimmed)) {
      const r = parseMarkdownFormat2(trimmed);
      allQuestions.push(...r.questions);
      allWarnings.push(...r.warnings);
      continue;
    }

    const r = parseSingleBlock(trimmed, lineOffset);
    allQuestions.push(...r.questions);
    allWarnings.push(...r.warnings);
  }

  return { questions: allQuestions, warnings: allWarnings };
}
