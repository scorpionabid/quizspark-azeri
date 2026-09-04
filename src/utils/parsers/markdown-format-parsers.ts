import { ParsedQuestion, ParseWarning, ParseResult } from './types';
import { extractMetadata } from './parser-utils';
import {
  TRUE_FALSE_RE,
  warnDuplicateOptions,
  warnIfMissingText,
  warnIfMissingAnswer,
  buildMetaRE,
  ANSWER_META,
  isMatchingBlock,
} from './markdown-utils';

import {
  parseMatchingBlock,
  parseOrderingBlock,
  parseFillBlankBlock,
  parseNumericalBlock,
  parseCodeBlock,
} from './markdown-type-parsers';

const FORMAT_META_RE = buildMetaRE(ANSWER_META);

// ─── Format 1: `# Sual mətni` ─────────────────────────────────────────────────
//
// İki sintaksis dəstəklənir:
//   a) Köhnə checklist:  `- [x] Düzgün # İzah` / `- [ ] Səhv`
//   b) Universal:        `A) Variant # İzah`  +  `Cavab: C`

export function parseMarkdownFormat1(content: string): ParseResult {
  const questions: ParsedQuestion[] = [];
  const warnings: ParseWarning[] = [];
  const blocks = content.split(/^#\s+/m).filter(Boolean);

  for (const block of blocks) {
    const lines = block.split('\n');
    const questionText = lines[0].trim();
    const rest = lines.slice(1);
    const lineOffset = content.split(block)[0].split('\n').length;

    if (!questionText) continue;

    // Check if this block is a special question type (matching, fill_blank, ordering, etc.)
    const tipLine = lines.find((l) => /^Tip\s*:/i.test(l));
    const tipValue = tipLine ? tipLine.replace(/^Tip\s*:\s*/i, '').trim().toLowerCase() : '';
    
    if (isMatchingBlock(lines, tipValue)) {
      const matchRes = parseMatchingBlock(lines, lineOffset);
      if (matchRes.questions.length > 0) {
        questions.push(...matchRes.questions);
        warnings.push(...matchRes.warnings);
        continue;
      }
    }

    if (
      ['fill_blank', 'fill blank', 'boşluq', 'bosluq'].some((t) => tipValue.includes(t)) ||
      lines.some((l) => /___/.test(l) && !FORMAT_META_RE.test(l))
    ) {
      const fillRes = parseFillBlankBlock(lines, lineOffset);
      if (fillRes.questions.length > 0) {
        questions.push(...fillRes.questions);
        warnings.push(...fillRes.warnings);
        continue;
      }
    }

    if (['ordering', 'ardıcıllıq', 'sıralama', 'siralama'].some((t) => tipValue.includes(t))) {
      const orderRes = parseOrderingBlock(lines, lineOffset);
      if (orderRes.questions.length > 0) {
        questions.push(...orderRes.questions);
        warnings.push(...orderRes.warnings);
        continue;
      }
    }

    if (['numerical', 'rəqəmsal', 'reqemsal'].some((t) => tipValue.includes(t))) {
      const numRes = parseNumericalBlock(lines, lineOffset);
      if (numRes.questions.length > 0) {
        questions.push(...numRes.questions);
        warnings.push(...numRes.warnings);
        continue;
      }
    }

    if (['code', 'kod'].some((t) => tipValue.includes(t)) || block.includes('```')) {
      const codeRes = parseCodeBlock(lines, lineOffset);
      if (codeRes.questions.length > 0) {
        questions.push(...codeRes.questions);
        warnings.push(...codeRes.warnings);
        continue;
      }
    }

    const result: Partial<ParsedQuestion> = {
      question_text: questionText,
      question_type: 'multiple_choice',
      difficulty: 'orta',
      options: [],
    };

    // ── a) Köhnə checklist sintaksisi ────────────────────────────────────────
    const checklistMatches = [...block.matchAll(/^[-*]\s*\[([ xX])\]\s*(.+)$/gm)];
    if (checklistMatches.length > 0) {
      for (const match of checklistMatches) {
        const isCorrect = match[1].toLowerCase() === 'x';
        const rawText = match[2].trim();
        const [text, feedback] = rawText.split('#').map((s) => s.trim());
        const optionIndex = (result.options as string[]).length;
        (result.options as string[]).push(text);
        if (isCorrect) result.correct_answer = text;
        if (feedback) {
          if (!result.per_option_explanations) result.per_option_explanations = {};
          result.per_option_explanations[optionIndex.toString()] = feedback;
        }
      }
      extractMetadata(rest.join('\n').split('\n'), result);
    } else {
      // ── b) Universal sintaksis: `A) Variant # İzah` + `Cavab: C` ───────────
      const optionRE = /^([A-Ha-h])[).]\s+(.+)/;
      const metaLines: string[] = [];

      for (const line of rest) {
        const clean = line.trim();
        if (!clean) continue;
        const optMatch = clean.match(optionRE);
        if (optMatch) {
          const rawText = optMatch[2].trim();
          const [text, feedback] = rawText.split('#').map((s) => s.trim());
          const optionIndex = (result.options as string[]).length;
          (result.options as string[]).push(text);
          if (feedback) {
            if (!result.per_option_explanations) result.per_option_explanations = {};
            result.per_option_explanations[optionIndex.toString()] = feedback;
          }
        } else if ((result.options as string[]).length === 0 && !FORMAT_META_RE.test(clean)) {
          result.question_text += '\n' + clean;
        } else {
          if ((result.options as string[]).length > 0 && !FORMAT_META_RE.test(clean)) {
            const opts = result.options as string[];
            opts[opts.length - 1] += '\n' + clean;
          } else {
            metaLines.push(clean);
          }
        }
      }

      // extractMetadata resolves "Cavab: C" → option text using result.options
      extractMetadata(metaLines, result);

      // true_false aşkarlama
      const opts = result.options as string[];
      if (opts.length === 2 && opts.every((o) => TRUE_FALSE_RE.test(o.trim()))) {
        result.question_type = 'true_false';
      }
    }

    const missingText = warnIfMissingText(questionText, lineOffset);
    if (missingText) warnings.push(missingText);

    if (result.options && (result.options as string[]).length > 0) {
      warnings.push(...warnDuplicateOptions(result.options as string[], lineOffset));
    }

    if (result.options && (result.options as string[]).length === 0) {
      warnings.push({
        line: lineOffset,
        type: 'no_options',
        message: `"${questionText.slice(0, 40)}..." sualında variant tapılmadı`,
        severity: 'error',
      });
    }

    if (!result.correct_answer && result.question_type !== 'matching') {
      warnings.push(warnIfMissingAnswer(questionText, lineOffset));
    }

    questions.push(result as ParsedQuestion);
  }

  return { questions, warnings };
}

// ─── Format 2: `1. Sual mətni\nA) Variant\nANSWER: A` ────────────────────────
//
// Boş sətir VƏ ya növbəti `\d+[.):] ` pattern-i ayrıcı kimi işlənir.

export function parseMarkdownFormat2(content: string): ParseResult {
  const questions: ParsedQuestion[] = [];
  const warnings: ParseWarning[] = [];

  // Həm boş sətir ilə ayrılan rəqəmli sualları ayır.
  const blocks = content
    .split(/\n\s*\n(?=\d+[.):]\s)/)
    .map((b) => b.trim())
    .filter(Boolean);

  for (const block of blocks) {
    const lines = block
      .split(/\r?\n/)
      .map((l) => l.trim())
      .filter(Boolean);
    if (!lines.length) continue;

    const headerMatch = lines[0].match(/^\d+[.):]\s+(.+)/);
    if (!headerMatch) continue;
    const questionText = headerMatch[1].trim();
    const firstLineNum = content.split(block)[0].split('\n').length + 1;

    const result: Partial<ParsedQuestion> = {
      question_text: questionText,
      question_type: 'multiple_choice',
      difficulty: 'orta',
      options: [],
    };

    const optLines: string[] = [];
    const metaLines: string[] = [];
    const hasLetterOptions = lines.slice(1).some((l) => /^[-*•]?\s*[A-Ha-h][).]\s+/.test(l));
    const optionRE = hasLetterOptions
      ? /^[-*•]?\s*([A-Ha-h])[).]\s+(.+)/
      : /^[-*•]?\s*([A-Ha-h]|\d+)[).]\s+(.+)/;

    for (let i = 1; i < lines.length; i++) {
      const l = lines[i];
      const optMatch = l.match(optionRE);
      if (optMatch) {
        optLines.push(optMatch[2].trim());
      } else if (optLines.length === 0 && !FORMAT_META_RE.test(l)) {
        result.question_text += '\n' + l;
      } else if (optLines.length > 0 && !FORMAT_META_RE.test(l)) {
        optLines[optLines.length - 1] += '\n' + l;
      } else {
        metaLines.push(l);
      }
    }

    result.options = optLines;
    extractMetadata(metaLines, result);

    // true_false aşkarlama
    const opts = result.options as string[];
    if (opts.length === 2 && opts.every((o) => TRUE_FALSE_RE.test(o.trim()))) {
      result.question_type = 'true_false';
    }

    const missingText = warnIfMissingText(questionText, firstLineNum);
    if (missingText) warnings.push(missingText);

    if (optLines.length > 0) {
      warnings.push(...warnDuplicateOptions(optLines, firstLineNum));
    }

    if (optLines.length === 0 && result.question_type !== 'short_answer') {
      warnings.push({
        line: firstLineNum,
        type: 'no_options',
        message: `"${questionText.slice(0, 40)}..." sualında variant tapılmadı`,
        severity: 'error',
      });
    }

    if (!result.correct_answer && result.question_type !== 'essay') {
      warnings.push(
        warnIfMissingAnswer(questionText, firstLineNum, ' — preview-da əlavə edin'),
      );
    }

    if (questionText) questions.push(result as ParsedQuestion);
  }

  return { questions, warnings };
}
