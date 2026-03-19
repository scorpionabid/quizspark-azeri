import { ParsedQuestion, ParseWarning, ParseResult } from './types';
import { extractMetadata } from './parser-utils';

/**
 * Uyğunlaşdırma (matching) bloku parse edir.
 */
function parseMatchingBlock(
  lines: string[],
  lineOffset: number,
): { questions: ParsedQuestion[]; warnings: ParseWarning[] } {
  const PAIR_RE = /^(.+?)\s*(?:→|->|=|::)\s*(.+)$/;
  const META_RE =
    /^(İzahat|Izahat|Explanation|Açıqlama|Kateqoriya|Category|Çətinlik|Difficulty|Bloom|Taqlar|Tags|Tip|Type)\s*[-:]/iu;

  const questionLines: string[] = [];
  const pairs: Array<{ left: string; right: string }> = [];
  const metaLines: string[] = [];

  for (const line of lines) {
    const clean = line.trim();
    if (!clean) continue;
    const pairMatch = clean.match(PAIR_RE);
    if (pairMatch && !META_RE.test(clean)) {
      pairs.push({ left: pairMatch[1].trim(), right: pairMatch[2].trim() });
    } else if (META_RE.test(clean)) {
      metaLines.push(clean);
    } else if (pairs.length === 0) {
      questionLines.push(clean);
    } else {
      metaLines.push(clean);
    }
  }

  const questionText =
    questionLines.filter(l => !/^Tip\s*:/i.test(l)).join(' ').trim() ||
    'Uyğunlaşdırın';

  const pairsRecord: Record<string, string> = Object.fromEntries(
    pairs.map(p => [p.left, p.right]),
  );

  const result: Partial<ParsedQuestion> = {
    question_text: questionText,
    question_type: 'matching',
    difficulty: 'orta',
    matching_pairs: pairsRecord,
    correct_answer: pairs.map(p => `${p.left}:${p.right}`).join('|||'),
  };

  extractMetadata(metaLines, result);

  const warnings: ParseWarning[] = [];
  if (pairs.length < 2) {
    warnings.push({
      line: lineOffset,
      type: 'missing_answer',
      message: `Uyğunlaşdırma sualında ən azı 2 cüt lazımdır`,
    });
  }

  return { questions: [result as ParsedQuestion], warnings };
}

/**
 * Ardıcıllıq (ordering) bloku parse edir.
 */
function parseOrderingBlock(
  lines: string[],
  lineOffset: number,
): { questions: ParsedQuestion[]; warnings: ParseWarning[] } {
  const ITEM_RE = /^(?:\d+[.)]\s+|[-•*]\s+)(.+)$/;
  const META_RE =
    /^(İzahat|Izahat|Explanation|Açıqlama|Kateqoriya|Category|Çətinlik|Difficulty|Bloom|Taqlar|Tags|Tip|Type)\s*[-:]/iu;

  const questionLines: string[] = [];
  const items: string[] = [];
  const metaLines: string[] = [];

  for (const line of lines) {
    const clean = line.trim();
    if (!clean) continue;
    const itemMatch = clean.match(ITEM_RE);
    if (itemMatch && !META_RE.test(clean)) {
      items.push(itemMatch[1].trim());
    } else if (META_RE.test(clean)) {
      metaLines.push(clean);
    } else if (items.length === 0) {
      questionLines.push(clean);
    } else {
      metaLines.push(clean);
    }
  }

  const questionText =
    questionLines.filter(l => !/^Tip\s*:/i.test(l)).join(' ').trim() ||
    'Düzgün ardıcıllığı müəyyən edin';

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
      message: `Ardıcıllıq sualında ən azı 2 element lazımdır`,
    });
  }

  return { questions: [result as ParsedQuestion], warnings };
}

/**
 * Boşluq doldur (fill_blank) bloku parse edir.
 */
function parseFillBlankBlock(
  lines: string[],
  lineOffset: number,
): { questions: ParsedQuestion[]; warnings: ParseWarning[] } {
  const META_RE =
    /^(Cavab|Düzgün cavab|Answer|İzahat|Explanation|Açıqlama|Kateqoriya|Category|Çətinlik|Difficulty|Bloom|Taqlar|Tags|Tip|Type)\s*[-:]/iu;

  const questionLines: string[] = [];
  const metaLines: string[] = [];

  for (const line of lines) {
    const clean = line.trim();
    if (!clean) continue;
    if (META_RE.test(clean)) {
      metaLines.push(clean);
    } else {
      questionLines.push(clean);
    }
  }

  const template = questionLines
    .filter(l => !/^Tip\s*:/i.test(l))
    .join(' ')
    .trim();

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
      message: `Fill-blank sualında ___ boşluq işarəsi tapılmadı`,
    });
  }
  if (!result.correct_answer) {
    warnings.push({
      line: lineOffset,
      type: 'missing_answer',
      message: `Fill-blank sualında "Cavab:" bölməsi tapılmadı`,
    });
  }

  return { questions: [result as ParsedQuestion], warnings };
}

/**
 * Rəqəmsal (numerical) bloku parse edir.
 */
function parseNumericalBlock(
  lines: string[],
  lineOffset: number,
): { questions: ParsedQuestion[]; warnings: ParseWarning[] } {
  const META_RE =
    /^(Cavab|Düzgün cavab|Answer|Tolerans|Tolerance|İzahat|Explanation|Açıqlama|Kateqoriya|Category|Çətinlik|Difficulty|Bloom|Taqlar|Tags|Tip|Type)\s*[-:]/iu;

  const questionLines: string[] = [];
  const metaLines: string[] = [];

  for (const line of lines) {
    const clean = line.trim();
    if (!clean) continue;
    if (META_RE.test(clean)) {
      metaLines.push(clean);
    } else {
      questionLines.push(clean);
    }
  }

  const questionText = questionLines
    .filter(l => !/^Tip\s*:/i.test(l))
    .join(' ')
    .trim();

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
      message: `Rəqəmsal sualda "Cavab:" bölməsi tapılmadı`,
    });
  }

  return { questions: [result as ParsedQuestion], warnings };
}

/**
 * Kod (code) bloku parse edir.
 */
function parseCodeBlock(
  lines: string[],
  lineOffset: number,
): { questions: ParsedQuestion[]; warnings: ParseWarning[] } {
  const META_RE =
    /^(Cavab|Düzgün cavab|Answer|Dil|Language|İzahat|Explanation|Açıqlama|Kateqoriya|Category|Çətinlik|Difficulty|Bloom|Taqlar|Tags|Tip|Type)\s*[-:]/iu;

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
    } else if (META_RE.test(clean)) {
      metaLines.push(clean);
    } else {
      questionLines.push(clean);
    }
  }

  const questionText = questionLines
    .filter(l => !/^Tip\s*:/i.test(l))
    .join(' ')
    .trim();

  const codeSnippet = codeLines.join('\n').trim();

  const result: Partial<ParsedQuestion> = {
    question_text: questionText,
    question_type: 'code',
    difficulty: 'orta',
    fill_blank_template: codeSnippet || null,
  };

  if (codeLang) result.hint = `lang:${codeLang.toLowerCase()}`;

  extractMetadata(metaLines, result);

  if (
    !result.hint?.startsWith('lang:') &&
    result.hint &&
    !result.hint.startsWith('lang:')
  ) {
    result.hint = `lang:${result.hint}`;
  }

  const warnings: ParseWarning[] = [];
  if (!result.correct_answer) {
    warnings.push({
      line: lineOffset,
      type: 'missing_answer',
      message: `Kod sualında "Cavab:" bölməsi tapılmadı`,
    });
  }

  return { questions: [result as ParsedQuestion], warnings };
}

/**
 * Format 1: `# Sual mətni\n- [x] Düzgün\n- [ ] Səhv`
 */
function parseMarkdownFormat1(content: string): ParseResult {
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

    const optionMatches = [...block.matchAll(/^[-*]\s*\[([ xX])\]\s*(.+)$/gm)];
    for (const match of optionMatches) {
      const isCorrect = match[1].toLowerCase() === 'x';
      const rawText = match[2].trim();
      
      // Support for inline feedback: "Option Text # Feedback"
      const [text, feedback] = rawText.split('#').map(s => s.trim());
      
      const optionIndex = (result.options as string[]).length;
      (result.options as string[]).push(text);
      if (isCorrect) result.correct_answer = text;
      
      if (feedback) {
        if (!result.per_option_explanations) result.per_option_explanations = {};
        result.per_option_explanations[optionIndex.toString()] = feedback;
      }
    }

    extractMetadata(rest.join('\n').split('\n'), result);

    if (questionText && result.options && (result.options as string[]).length === 0) {
      warnings.push({
        line: lineOffset,
        type: 'no_options',
        message: `"${questionText.slice(0, 40)}..." sualında variant tapılmadı`,
      });
    }
    if (!result.correct_answer) {
      warnings.push({
        line: lineOffset,
        type: 'missing_answer',
        message: `"${questionText.slice(0, 40)}..." sualında düzgün cavab işarələnməyib`,
      });
    }
    if (questionText) questions.push(result as ParsedQuestion);
  }
  return { questions, warnings };
}

/**
 * Format 2: `1. Sual mətni\nA) Variant\nB) Variant\nANSWER: A`
 */
function parseMarkdownFormat2(content: string): ParseResult {
  const questions: ParsedQuestion[] = [];
  const warnings: ParseWarning[] = [];

  const blocks = content
    .split(/\n\s*\r?\n(?=\d+[.)]\s)/)
    .map(b => b.trim())
    .filter(Boolean);

  for (const block of blocks) {
    const lines = block.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
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
    extractMetadata(metaLines, result);

    if (optLines.length === 0) {
      warnings.push({
        line: firstLineNum,
        type: 'no_options',
        message: `"${questionText.slice(0, 40)}..." sualında variant tapılmadı`,
      });
    }
    if (!result.correct_answer) {
      warnings.push({
        line: firstLineNum,
        type: 'missing_answer',
        message: `"${questionText.slice(0, 40)}..." sualında düzgün cavab göstərilməyib — preview-da əlavə edin`,
      });
    }

    if (questionText) questions.push(result as ParsedQuestion);
  }
  return { questions, warnings };
}

/**
 * Format 3: `Sual mətni\n\t•\tVariant A\n\t•\tVariant B`
 */
function parseMarkdownFormat3(content: string): ParseResult {
  const questions: ParsedQuestion[] = [];
  const warnings: ParseWarning[] = [];

  const blocks = content
    .split(/(?=^(?:\d+)\s*$)/m)
    .map(b => b.trim())
    .filter(Boolean);

  for (const block of blocks) {
    const lines = block.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
    if (lines.length < 2) continue;

    let startIdx = 0;
    if (/^\d+$/.test(lines[0])) startIdx = 1;

    const questionText = lines[startIdx]?.trim();
    if (!questionText) continue;

    const firstLineNum = content.split(block)[0].split('\n').length + 1;
    const result: Partial<ParsedQuestion> = {
      question_text: questionText,
      question_type: 'multiple_choice',
      difficulty: 'orta',
      options: [],
    };

    const metaLines: string[] = [];

    for (let i = startIdx + 1; i < lines.length; i++) {
      const l = lines[i];
      const bulletMatch = l.match(/^[\t\s]*[-•*]\s*(?:\t\s*)?(.+)$/u);
      if (bulletMatch) {
        (result.options as string[]).push(bulletMatch[1].trim());
      } else {
        metaLines.push(l);
      }
    }

    extractMetadata(metaLines, result);

    for (const ml of metaLines) {
      const ansMatch = ml.match(/^(?:Düzgün|Cavab|Doğru cavab)\s*[:-]?\s*(.+)/i);
      if (ansMatch) {
        const val = ansMatch[1].trim();
        if ((result.options as string[]).includes(val)) {
          result.correct_answer = val;
        } else {
          const idx = val.toUpperCase().charCodeAt(0) - 65;
          if ((result.options as string[])[idx]) {
            result.correct_answer = (result.options as string[])[idx];
          }
        }
      }
    }

    if ((result.options as string[]).length === 0) {
      warnings.push({
        line: firstLineNum,
        type: 'no_options',
        message: `"${questionText.slice(0, 40)}..." sualında variant tapılmadı`,
      });
    }
    if (!result.correct_answer) {
      warnings.push({
        line: firstLineNum,
        type: 'missing_answer',
        message: `"${questionText.slice(0, 40)}..." sualında düzgün cavab göstərilməyib — preview-da əlavə edin`,
      });
    }

    if (questionText) questions.push(result as ParsedQuestion);
  }
  return { questions, warnings };
}

/**
 * Tək sual blokunu parse edir.
 */
export function parseSingleBlock(
  block: string,
  lineOffset: number,
): { questions: ParsedQuestion[]; warnings: ParseWarning[] } {
  const lines = block.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
  if (!lines.length) return { questions: [], warnings: [] };

  const tipLine = lines.find(l => /^Tip\s*:/i.test(l));
  if (tipLine) {
    const tipValue = tipLine.replace(/^Tip\s*:\s*/i, '').trim().toLowerCase();
    if (['matching', 'uyğunlaşdırma', 'uygunlashdirma'].some(t => tipValue.includes(t))) {
      return parseMatchingBlock(lines, lineOffset);
    }
    if (['ordering', 'ardıcıllıq', 'sıralama', 'siralama'].some(t => tipValue.includes(t))) {
      return parseOrderingBlock(lines, lineOffset);
    }
    if (['fill_blank', 'fill blank', 'boşluq', 'bosluq'].some(t => tipValue.includes(t))) {
      return parseFillBlankBlock(lines, lineOffset);
    }
    if (['numerical', 'rəqəmsal', 'reqemsal'].some(t => tipValue.includes(t))) {
      return parseNumericalBlock(lines, lineOffset);
    }
    if (['code', 'kod'].some(t => tipValue.includes(t))) {
      return parseCodeBlock(lines, lineOffset);
    }
  }

  const META_RE_LIGHT = /^(İzahat|Izahat|Explanation|Açıqlama|Kateqoriya|Category|Çətinlik|Difficulty|Bloom|Taqlar|Tags|Cavab|Düzgün|ANSWER|Tolerans|Dil)\s*[-:]/iu;
  const PAIR_RE = /^.+\s*(?:→|->|::)\s*.+$/;
  const pairLines = lines.filter(l => PAIR_RE.test(l) && !META_RE_LIGHT.test(l));
  if (pairLines.length >= 2) {
    return parseMatchingBlock(lines, lineOffset);
  }

  const hasBlank = lines.some(l => /___/.test(l) && !META_RE_LIGHT.test(l));
  if (hasBlank) {
    return parseFillBlankBlock(lines, lineOffset);
  }

  if (block.includes('```')) {
    return parseCodeBlock(lines, lineOffset);
  }

  if (/^[-*]\s*\[[ xX]\]/.test(block)) {
    const wrapped = '# ' + lines[0] + '\n' + lines.slice(1).join('\n');
    return parseMarkdownFormat1(wrapped);
  }

  const questionLines: string[] = [];
  const options: string[] = [];
  let correctAnswer: string | undefined;
  const metaLines: string[] = [];

  const META_RE = /^(İzahat|Izahat|Explanation|Açıqlama|Kateqoriya|Category|Çətinlik|Difficulty|Bloom|Taqlar|Tags|ANSWER|Düzgün|Cavab|Doğru cavab)\s*[:-]/iu;

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

  if (!questionLines.length) return { questions: [], warnings: [] };

  const questionText = questionLines.join('\n');
  const result: Partial<ParsedQuestion> = {
    question_text: questionText,
    question_type: options.length > 0 ? 'multiple_choice' : 'short_answer',
    difficulty: 'orta',
    options: options.length > 0 ? options : null,
  };

  extractMetadata(metaLines, result);

  if (!correctAnswer) {
    for (const ml of metaLines) {
      const ansLetterMatch = ml.match(/^ANSWER:\s*([A-Za-z\d]+)\s*$/i);
      const duzgunMatch = ml.match(/^(?:Düzgün|Cavab|Doğru cavab)\s*[-:]?\s*(.+)/i);

      if (ansLetterMatch) {
        const val = ansLetterMatch[1].toUpperCase();
        let idx = -1;
        if (/^[A-Za-z]$/.test(val)) {
          idx = val.charCodeAt(0) - 65;
        } else if (/^\d+$/.test(val)) {
          idx = parseInt(val, 10) - 1;
        }
        if (options[idx]) correctAnswer = options[idx];
      } else if (duzgunMatch) {
        const valStr = duzgunMatch[1].trim();
        const vals = valStr.split(/[,;]/).map(v => v.trim()).filter(Boolean);
        if (vals.length > 1) result.question_type = 'multiple_select';

        const answers: string[] = [];
        for (const v of vals) {
          if (options.includes(v)) {
            answers.push(v);
          } else {
            let idx = -1;
            if (/^[A-Za-z]$/.test(v.toUpperCase())) {
              idx = v.toUpperCase().charCodeAt(0) - 65;
            } else if (/^\d+$/.test(v)) {
              idx = parseInt(v, 10) - 1;
            }
            if (options[idx]) answers.push(options[idx]);
            else if (!options.length) answers.push(v);
          }
        }
        if (answers.length > 0) {
          correctAnswer = result.question_type === 'multiple_select' 
            ? answers.join(',') 
            : answers[0];
        }
      }
    }
  }

  if (correctAnswer) result.correct_answer = correctAnswer;

  const warnings: ParseWarning[] = [];
  if (options.length === 0 && !result.correct_answer) {
    warnings.push({
      line: lineOffset,
      type: 'missing_answer',
      message: `"${questionText.slice(0, 40)}..." sualında düzgün cavab göstərilməyib`,
    });
  } else if (options.length > 0 && !result.correct_answer) {
    warnings.push({
      line: lineOffset,
      type: 'missing_answer',
      message: `"${questionText.slice(0, 40)}..." sualında düzgün cavab göstərilməyib`,
    });
  }

  return { questions: [result as ParsedQuestion], warnings };
}

/**
 * Format 4: `---`-ayrıcılı sual blokları.
 */
export function parseMarkdownSeparated(content: string): ParseResult {
  const allQuestions: ParsedQuestion[] = [];
  const allWarnings: ParseWarning[] = [];

  const blocks = content.split(/^(?:---+|===+)\s*$/m);
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

/**
 * Əsas Markdown parser.
 */
export const parseMarkdownFull = (content: string): ParseResult => {
  if (/^(?:---+|===+)\s*$/m.test(content)) {
    const result = parseMarkdownSeparated(content);
    if (result.questions.length > 0) return result;
  }

  if (/^#\s+.+/m.test(content)) {
    return parseMarkdownFormat1(content);
  }

  if (/^\d+[.)]\s+/m.test(content)) {
    const result = parseMarkdownFormat2(content);
    if (result.questions.length > 0) return result;
  }

  if (/[\t\s]*[•]\s*/m.test(content) || /^\d+\s*$/m.test(content)) {
    const result = parseMarkdownFormat3(content);
    if (result.questions.length > 0) return result;
  }

  const singleResult = parseSingleBlock(content, 0);
  if (singleResult.questions.length > 0) return singleResult;

  return { questions: [], warnings: [] };
}
