import { ParsedQuestion, ParseWarning, ParseResult } from './types';
import { extractMetadata } from './parser-utils';
import {
  TRUE_FALSE_RE,
  warnDuplicateOptions,
  warnIfMissingText,
  warnIfMissingAnswer,
  extractInlineOptions,
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
  const ANSWER_LINE_RE = /^(ANSWER|Düzgün cavab|Doğru cavab|Cavab|Doğru)\s*[:-]/i;

  const allQuestions: ParsedQuestion[] = [];
  const allWarnings: ParseWarning[] = [];

  let currentQuestionLines: string[] = [];
  let currentOptions: string[] = [];
  let currentMetaLines: string[] = [];
  let parsingOptions = false;

  const finalizeQuestion = (currentLineIndex: number) => {
    const questionText = currentQuestionLines.join('\n').trim();
    if (!questionText) return;

    const isTrueFalse =
      currentOptions.length === 2 && currentOptions.every((o) => TRUE_FALSE_RE.test(o.trim()));

    const result: Partial<ParsedQuestion> = {
      question_text: questionText,
      question_type: isTrueFalse
        ? 'true_false'
        : currentOptions.length > 0
          ? 'multiple_choice'
          : 'short_answer',
      difficulty: 'orta',
      options: currentOptions.length > 0 ? currentOptions : null,
    };

    extractMetadata(currentMetaLines, result);

    const warnOffset = lineOffset + currentLineIndex - (currentQuestionLines.length + currentOptions.length + currentMetaLines.length);

    const missingText = warnIfMissingText(questionText, Math.max(0, warnOffset));
    if (missingText) allWarnings.push(missingText);

    if (currentOptions.length > 0) {
      allWarnings.push(...warnDuplicateOptions(currentOptions, Math.max(0, warnOffset)));
    }

    if (!result.correct_answer) {
      allWarnings.push(warnIfMissingAnswer(questionText, Math.max(0, warnOffset)));
    }

    allQuestions.push(result as ParsedQuestion);

    // Reset
    currentQuestionLines = [];
    currentOptions = [];
    currentMetaLines = [];
    parsingOptions = false;
  };

  for (let i = 0; i < lines.length; i++) {
    let line = lines[i];

    // Check for inline metadata: "Question text... Cavab: A"
    const inlineMetaMatch = line.match(
      /(.+?)\s*((?:İzahat|Izahat|Explanation|Açıqlama|Kateqoriya|Category|Çətinlik|Difficulty|Bloom|Taqlar|Tags|ANSWER|Düzgün|Cavab|Doğru cavab)\s*[:-].+)$/iu,
    );

    let remainingAfterMeta = '';
    if (inlineMetaMatch) {
      line = inlineMetaMatch[1];
      remainingAfterMeta = inlineMetaMatch[2];
    }

    const aikenOpt = line.match(/^([A-Za-z\d]+)\s*[).]\s+(.+)/);
    const bulletOpt = line.match(/^[-•*]\s+(?!\[)(.+)/);
    const isMeta = META_RE.test(line);

    if (isMeta) {
      parsingOptions = false;
      currentMetaLines.push(line);
    } else if (aikenOpt) {
      parsingOptions = true;
      currentOptions.push(aikenOpt[2].trim());
    } else {
      const inlineOpts = extractInlineOptions(line);
      if (inlineOpts.length > 0) {
        parsingOptions = true;
        currentOptions.push(...inlineOpts);
      } else if (bulletOpt && parsingOptions) {
        currentOptions.push(bulletOpt[1].trim());
      } else if (!parsingOptions) {
        currentQuestionLines.push(line);
      } else {
        currentMetaLines.push(line);
      }
    }

    // Handle the inline metadata we found
    if (remainingAfterMeta) {
      currentMetaLines.push(remainingAfterMeta);
      if (ANSWER_LINE_RE.test(remainingAfterMeta)) {
        finalizeQuestion(i);
      }
    }
  }

  finalizeQuestion(lines.length - 1);

  return { questions: allQuestions, warnings: allWarnings };
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

    if (/^\d+[.):]\s/m.test(trimmed)) {
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
