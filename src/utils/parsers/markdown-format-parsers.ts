import { ParsedQuestion, ParseWarning, ParseResult } from './types';
import { extractMetadata } from './parser-utils';
import {
  TRUE_FALSE_RE,
  warnDuplicateOptions,
  warnIfMissingText,
  warnIfMissingAnswer,
} from './markdown-utils';

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
      const optionRE = /^([A-Za-z\d]+)[).]\s+(.+)/;
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
        } else {
          metaLines.push(clean);
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

    if (
      result.options &&
      (result.options as string[]).length === 0 &&
      result.question_type !== 'short_answer'
    ) {
      warnings.push({
        line: lineOffset,
        type: 'no_options',
        message: `"${questionText.slice(0, 40)}..." sualında variant tapılmadı`,
        severity: 'error',
      });
    }

    if (!result.correct_answer && result.question_type !== 'essay') {
      warnings.push(warnIfMissingAnswer(questionText, lineOffset));
    }

    if (questionText) questions.push(result as ParsedQuestion);
  }

  return { questions, warnings };
}

// ─── Format 2: `1. Sual mətni\nA) Variant\nANSWER: A` ────────────────────────

export function parseMarkdownFormat2(content: string): ParseResult {
  const questions: ParsedQuestion[] = [];
  const warnings: ParseWarning[] = [];

  const blocks = content
    .split(/\n\s*\r?\n(?=\d+[.)]\s)/)
    .map((b) => b.trim())
    .filter(Boolean);

  for (const block of blocks) {
    const lines = block
      .split(/\r?\n/)
      .map((l) => l.trim())
      .filter(Boolean);
    if (!lines.length) continue;

    const headerMatch = lines[0].match(/^\d+[.)]\s+(.+)/);
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

    for (let i = 1; i < lines.length; i++) {
      const l = lines[i];
      const optMatch = l.match(/^[-*•]?\s*([A-Za-z\d]+)[).]\s+(.+)/);
      if (optMatch) {
        optLines.push(optMatch[2].trim());
      } else {
        metaLines.push(l);
      }
    }

    result.options = optLines;
    // extractMetadata resolves answer letters using result.options
    extractMetadata(metaLines, result);

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
