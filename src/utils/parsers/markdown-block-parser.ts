import { ParsedQuestion, ParseWarning, ParseResult } from './types';
import { extractMetadata } from './parser-utils';
import {
  TRUE_FALSE_RE,
  warnDuplicateOptions,
  warnIfMissingText,
  extractInlineOptions,
  parseInlineLine,
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

// ─── Heading stripping helper ─────────────────────────────────────────────────

/**
 * H1-H6 markdown başlıq prefix-ini sətirdən çıxarır.
 * "### Sual 3: Mövzu (MCQ)" → "Mövzu (MCQ)" deyil, boş string qaytarır
 * çünki bu cür sətir label kimi başqasından ayrıdır.
 * Yalnız `# Sual mətni` (Format1) işləyir — başqa headings label sayılır.
 */
function stripHeading(line: string): string {
  return line.replace(/^#{1,6}\s*/, '').trim();
}

/**
 * Sətrin heading (H2+) section label olub-olmadığını yoxlayır.
 * H1 (`# text`) Format1 sual marker-i sayılır, H2+ (`## text`, `### text`) label.
 */
function isSectionLabel(line: string): boolean {
  return /^#{2,6}\s/.test(line);
}

// ─── Generic MCQ / Short Answer block ────────────────────────────────────────

/**
 * Tip etiketi olmayan, spesifik format göstərişi olmayan blokları parse edir.
 * MCQ, true_false, multiple_select və short_answer növlərini avtomatik aşkarlayır.
 */
function parseGenericBlock(lines: string[], lineOffset: number): BlockResult {
  const META_RE =
    /^(İzahat|Izahat|Explanation|Açıqlama|Kateqoriya|Category|Çətinlik|Difficulty|Bloom|Taqlar|Tags|ANSWER|Düzgün cavab|Doğru cavab|Düzgün|Cavab|Doğru|Tolerans)\s*[:-]/iu;
  const ANSWER_LINE_RE = /^(ANSWER|Düzgün cavab|Doğru cavab|Cavab|Doğru)\s*[:-]/i;
  const QUESTION_START_RE = /^(?:#{1,6}|Sual|Q|Question)\s*[:.]?\s*/i;

  const allQuestions: ParsedQuestion[] = [];
  const allWarnings: ParseWarning[] = [];

  let currentQuestionLines: string[] = [];
  let currentOptions: string[] = [];
  let currentMetaLines: string[] = [];
  let parsingOptions = false;
  // Section label (### Sual N: ...) mövcud bloğun başlığı
  let sectionLabel = '';

  const finalizeQuestion = (currentLineIndex: number) => {
    // Section label varsa onu sualın başlığı kimi istifadə et, sonra sıfırla
    const label = sectionLabel;
    sectionLabel = '';

    let questionText = currentQuestionLines.join('\n').trim();

    // Sual mətni Q: və ya # ilə başlayırsa, onu təmizlə
    questionText = questionText.replace(QUESTION_START_RE, '').trim();

    // Yalnızca tamamilə boş blokları ignore et
    if (!questionText && currentOptions.length === 0 && currentMetaLines.length === 0) {
      return;
    }

    // Smart option detection: if no explicit options found but multiple lines exist
    if (currentOptions.length === 0 && currentQuestionLines.length > 1) {
      // H2+ heading sətirini question lines-dan çıxar
      const contentLines = currentQuestionLines.filter(l => !isSectionLabel(l));
      if (contentLines.length > 1) {
        currentOptions.push(...contentLines.slice(1).map((l) => l.trim()).filter(Boolean));
        questionText = contentLines[0].trim().replace(QUESTION_START_RE, '').trim();
      } else {
        currentOptions.push(...currentQuestionLines.slice(1).map((l) => l.trim()).filter(Boolean));
        questionText = currentQuestionLines[0].trim().replace(QUESTION_START_RE, '').trim();
      }
    }

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

    // Label varsa title kimi əlavə et
    if (label) {
      result.title = stripHeading(label);
    }

    extractMetadata(currentMetaLines, result);

    const warnOffset = lineOffset + currentLineIndex - (currentQuestionLines.length + currentOptions.length + currentMetaLines.length);

    const missingText = warnIfMissingText(questionText, Math.max(0, warnOffset));
    if (missingText) allWarnings.push(missingText);

    if (currentOptions.length > 0) {
      allWarnings.push(...warnDuplicateOptions(currentOptions, Math.max(0, warnOffset)));
    }

    if (!result.correct_answer) {
      const msg = `"${questionText.slice(0, 30)}..." sualında "Cavab:" sahəsi tapılmadı. Zəhmət olmasa düzgün variantı qeyd edin.`;
      allWarnings.push({
        line: Math.max(0, warnOffset),
        type: 'missing_answer',
        message: msg,
        severity: 'error',
      });
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

    // H2+ section label sətirini ayrıca qeyd et, sual lines-a əlavə etmə
    if (isSectionLabel(line)) {
      // Əvvəlki sualı tamamla (sual varsa)
      if (currentQuestionLines.length > 0 || currentOptions.length > 0) {
        finalizeQuestion(i);
      }
      sectionLabel = line;
      continue;
    }

    const aikenOpt = line.match(/^([A-Za-z\d]+)\s*[).]\s+(.+)/);
    const bulletOpt = line.match(/^[-•*]\s+(?!\[)(.+)/);
    const isMeta = META_RE.test(line);

    let remainingAfterMeta = '';
    if (!isMeta) {
      const inlineMetaMatch = line.match(
        /(.+?)\s*((?:İzahat|Izahat|Explanation|Açıqlama|Kateqoriya|Category|Çətinlik|Difficulty|Bloom|Taqlar|Tags|ANSWER|Düzgün cavab|Doğru cavab|Düzgün|Cavab|Doğru)\s*[:-].+)$/iu,
      );
      if (inlineMetaMatch) {
        line = inlineMetaMatch[1];
        remainingAfterMeta = inlineMetaMatch[2];
      }
    }

    if (isMeta) {
      parsingOptions = false;
      currentMetaLines.push(line);
    } else if (aikenOpt) {
      parsingOptions = true;
      currentOptions.push(aikenOpt[2].trim());
    } else {
      // Tək sətirlik inline format yoxla: "Sual mətni A) Opt1 B) Opt2"
      const inlineParsed = parseInlineLine(line);
      if (inlineParsed) {
        // Mövcud sualı tamamla
        if (currentQuestionLines.length > 0 || currentOptions.length > 0) {
          finalizeQuestion(i);
        }
        // Yeni inline sualı birbaşa əlavə et
        const inlineResult: Partial<ParsedQuestion> = {
          question_text: inlineParsed.questionText,
          question_type: 'multiple_choice',
          difficulty: 'orta',
          options: inlineParsed.options,
        };
        if (sectionLabel) {
          inlineResult.title = stripHeading(sectionLabel);
          sectionLabel = '';
        }
        extractMetadata(inlineParsed.metaLines, inlineResult);
        // inline metaLines-da cavab tapılmasa warning
        if (!inlineResult.correct_answer) {
          allWarnings.push({
            line: lineOffset + i,
            type: 'missing_answer',
            message: `"${inlineParsed.questionText.slice(0, 30)}..." sualında cavab tapılmadı`,
            severity: 'error',
          });
        }
        allQuestions.push(inlineResult as ParsedQuestion);
        continue;
      }

      const inlineOpts = extractInlineOptions(line);
      if (inlineOpts.length > 0) {
        parsingOptions = true;
        currentOptions.push(...inlineOpts);
      } else if (bulletOpt && parsingOptions) {
        currentOptions.push(bulletOpt[1].trim());
      } else if (!parsingOptions) {
        currentQuestionLines.push(line);
      } else {
        if (currentOptions.length > 0) {
          currentOptions[currentOptions.length - 1] += '\n' + line;
        } else {
          currentMetaLines.push(line);
        }
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
    /^(İzahat|Izahat|Explanation|Açıqlama|Kateqoriya|Category|Çətinlik|Difficulty|Bloom|Taqlar|Tags|Cavab|Düzgün|Düzgün cavab|Doğru cavab|ANSWER|Tolerans|Dil)\s*[-:]/iu;
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

  const blocks = content.split(/\n(?:---+|===+|___+|\*\*\*+|⸻+|—+)\s*(?:\n|$)/);
  let lineOffset = 0;

  for (const block of blocks) {
    const trimmed = block.trim();
    lineOffset += block.split('\n').length;
    if (!trimmed) continue;

    // H1 başlıqla başlayan blok → Format1
    if (/^#\s+/m.test(trimmed) && !/^#{2,}\s/m.test(trimmed.split('\n')[0])) {
      const r = parseMarkdownFormat1(trimmed);
      allQuestions.push(...r.questions);
      allWarnings.push(...r.warnings);
      continue;
    }

    if (/^\d+[.):]\s/.test(trimmed)) {
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

// ─── parseMarkdownOneLinePerQuestion ─────────────────────────────────────────

/**
 * Hər sətirin (və ya boş sətir ilə ayrılan qrupun) ayrı sual olduğu formatı
 * parse edir. konst-quiz.md kimi real-world fayllar üçündür.
 *
 * Format nümunəsi:
 *   Azərbaycan dövləti: A) Dünyəvi... B) Demokratik... Düzgün cavab: B
 *   Xalqın suverenliyi dedikdə nə nəzərdə tutulur? A) ... B) ... Düzgün cavab: A
 */
export function parseMarkdownOneLinePerQuestion(content: string): ParseResult {
  const allQuestions: ParsedQuestion[] = [];
  const allWarnings: ParseWarning[] = [];

  const rawLines = content.split(/\r?\n/);
  let i = 0;

  while (i < rawLines.length) {
    const line = rawLines[i].trim();

    // Boş sətir — keç
    if (!line) { i++; continue; }

    // Tək sətirlik inline format yoxla
    const inlineParsed = parseInlineLine(line);
    if (inlineParsed) {
      const result: Partial<ParsedQuestion> = {
        question_text: inlineParsed.questionText,
        question_type: 'multiple_choice',
        difficulty: 'orta',
        options: inlineParsed.options,
      };
      extractMetadata(inlineParsed.metaLines, result);

      if (!result.correct_answer) {
        allWarnings.push({
          line: i + 1,
          type: 'missing_answer',
          message: `"${inlineParsed.questionText.slice(0, 30)}..." — cavab tapılmadı`,
          severity: 'error',
        });
      }
      allQuestions.push(result as ParsedQuestion);
      i++;
      continue;
    }

    // Çox sətirlik qrup: boş sətirə və ya növbəti inline sualına qədər topla
    const groupLines: string[] = [line];
    i++;
    while (i < rawLines.length) {
      const next = rawLines[i].trim();
      if (!next) { i++; break; }            // boş sətir = qrup sonu
      if (parseInlineLine(next)) break;      // növbəti inline sual = qrup sonu
      groupLines.push(next);
      i++;
    }

    const r = parseSingleBlock(groupLines.join('\n'), 0);
    allQuestions.push(...r.questions);
    allWarnings.push(...r.warnings);
  }

  return { questions: allQuestions, warnings: allWarnings };
}
