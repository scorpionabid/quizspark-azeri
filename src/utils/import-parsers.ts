import { QuestionBankItem } from '@/hooks/useQuestionBank';

export type ParsedQuestion = Omit<QuestionBankItem, 'id' | 'created_at' | 'updated_at'>;

// ─── Strukturlu xəta tipi ─────────────────────────────────────────────────────
export interface ParseWarning {
  line: number;
  type: 'missing_answer' | 'no_options' | 'empty_question';
  message: string;
}

export interface ParseResult {
  questions: ParsedQuestion[];
  warnings: ParseWarning[];
}

// ─── ENCODING-AWARE FILE READER ──────────────────────────────────────────────
/**
 * Faylı oxuyarkən BOM marker-ə görə encoding aşkar edir.
 * UTF-8, UTF-16, windows-1254 (Türk/Azərbaycan legacy) dəstəklənir.
 */
export async function readFileWithEncoding(file: File): Promise<string> {
  const buffer = await file.arrayBuffer();
  const bytes = new Uint8Array(buffer);

  // UTF-8 BOM: EF BB BF
  if (bytes[0] === 0xef && bytes[1] === 0xbb && bytes[2] === 0xbf) {
    return new TextDecoder('utf-8').decode(buffer.slice(3));
  }
  // UTF-16 LE BOM: FF FE
  if (bytes[0] === 0xff && bytes[1] === 0xfe) {
    return new TextDecoder('utf-16le').decode(buffer.slice(2));
  }
  // UTF-16 BE BOM: FE FF
  if (bytes[0] === 0xfe && bytes[1] === 0xff) {
    return new TextDecoder('utf-16be').decode(buffer.slice(2));
  }

  // UTF-8 cəhdi — replacement character yoxdursa uğurludur
  const utf8Text = new TextDecoder('utf-8').decode(buffer);
  if (!utf8Text.includes('\uFFFD')) return utf8Text;

  // Legacy fallback: windows-1254 (Türk/Azərb. köhnə fayllar)
  try {
    return new TextDecoder('windows-1254').decode(buffer);
  } catch {
    return utf8Text;
  }
}

// ─── FORMAT AUTO-DETECTION ───────────────────────────────────────────────────
/**
 * Məzmuna görə formatı avtomatik aşkar edir.
 * Dəqiqlik sıralaması: JSON > CSV > GIFT > Aiken > Markdown
 */
export function detectFormat(
  content: string,
): 'json' | 'csv' | 'aiken' | 'gift' | 'markdown' {
  const trimmed = content.trim();

  // JSON: [ { } ]
  if (trimmed.startsWith('[') || trimmed.startsWith('{')) return 'json';

  // CSV: birinci sətirdə question_text sütunu
  const firstLine = trimmed.split('\n')[0].toLowerCase().replace(/"/g, '');
  if (
    (firstLine.includes('question_text') || firstLine.includes('question')) &&
    (firstLine.includes(',') || firstLine.includes(';'))
  )
    return 'csv';

  // GIFT: :: name :: { = correct ~wrong } pattern
  if (/::.*?::/.test(trimmed) && /\{[^}]{1,500}\}/s.test(trimmed)) return 'gift';

  // Aiken: ANSWER: X + A) variant pattern
  if (/^ANSWER:\s+[A-Z]$/m.test(content) && /^[A-Z]\)\s+/m.test(content))
    return 'aiken';

  return 'markdown';
}

// ─── AIKEN ───────────────────────────────────────────────────────────────────
export const parseAiken = (content: string): ParsedQuestion[] => {
  const lines = content.split('\n').map(l => l.trim()).filter(Boolean);
  const questions: ParsedQuestion[] = [];
  let currentQuestion: Partial<ParsedQuestion> = {
    question_type: 'multiple_choice',
    options: [],
    difficulty: 'orta',
  };

  const optionRegex = /^[A-Z][).]\s+(.+)$/;
  const answerRegex = /^ANSWER:\s+([A-Z])$/;
  const metadataRegex = /^([A-Z]+):\s+(.+)$/;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const optionMatch = line.match(optionRegex);
    const answerMatch = line.match(answerRegex);
    const metadataMatch = line.match(metadataRegex);

    if (optionMatch) {
      if (!Array.isArray(currentQuestion.options)) currentQuestion.options = [];
      (currentQuestion.options as string[]).push(optionMatch[1]);
    } else if (answerMatch) {
      const letter = answerMatch[1];
      const index = letter.charCodeAt(0) - 65;
      const options = currentQuestion.options as string[];
      if (options && options[index]) {
        currentQuestion.correct_answer = options[index];
      }
    } else if (
      metadataMatch &&
      ['CATEGORY', 'DIFFICULTY', 'EXPLANATION', 'TAGS', 'BLOOM'].includes(metadataMatch[1])
    ) {
      const key = metadataMatch[1].toLowerCase();
      const value = metadataMatch[2];
      if (key === 'category') currentQuestion.category = value;
      if (key === 'difficulty') currentQuestion.difficulty = value;
      if (key === 'explanation') currentQuestion.explanation = value;
      if (key === 'bloom') currentQuestion.bloom_level = value;
      if (key === 'tags') currentQuestion.tags = value.split(',').map(t => t.trim());
    } else {
      if (currentQuestion.question_text && currentQuestion.correct_answer) {
        questions.push(currentQuestion as ParsedQuestion);
        currentQuestion = {
          question_type: 'multiple_choice',
          options: [],
          difficulty: 'orta',
          question_text: line,
        };
      } else {
        currentQuestion.question_text = currentQuestion.question_text
          ? `${currentQuestion.question_text} ${line}`
          : line;
      }
    }
  }

  if (currentQuestion.question_text && currentQuestion.correct_answer) {
    questions.push(currentQuestion as ParsedQuestion);
  }

  return questions;
};

// ─── GIFT ────────────────────────────────────────────────────────────────────
export const parseGIFT = (content: string): ParsedQuestion[] => {
  const questionBlocks = content.split(/\n\s*\n/).filter(Boolean);
  const questions: ParsedQuestion[] = [];

  for (const block of questionBlocks) {
    if (block.startsWith('//') || block.startsWith('$')) continue;

    const nameMatch = block.match(/^::(.*?)::/);
    const name = nameMatch ? nameMatch[1] : '';
    const textAndAns = block.replace(/^::.*?::/, '').trim();

    const ansMatch = textAndAns.match(/\{(.*?)\}/s);
    if (!ansMatch) continue;

    const questionText = textAndAns.replace(/\{.*?\}/s, '').trim();
    const answerContent = ansMatch[1].trim();

    const result: Partial<ParsedQuestion> = {
      question_text: questionText,
      question_type: 'multiple_choice',
      difficulty: 'orta',
      title: name || null,
    };

    if (answerContent.includes('~') || answerContent.includes('=')) {
      const parts = answerContent.split(/([~=])/).filter(Boolean);
      const options: string[] = [];
      let correctAnswer = '';

      for (let i = 0; i < parts.length; i += 2) {
        const marker = parts[i];
        const valWithFeedback = parts[i + 1]?.trim() || '';
        const val = valWithFeedback.split('#')[0].trim();
        const feedback = valWithFeedback.split('#')[1]?.trim();
        if (val) {
          options.push(val);
          if (marker === '=') {
            correctAnswer = val;
            if (feedback) result.explanation = feedback;
          }
        }
      }
      result.options = options;
      result.correct_answer = correctAnswer;
    } else if (
      answerContent.toLowerCase() === 't' ||
      answerContent.toLowerCase() === 'true'
    ) {
      result.question_type = 'true_false';
      result.options = ['Doğru', 'Yanlış'];
      result.correct_answer = 'Doğru';
    } else if (
      answerContent.toLowerCase() === 'f' ||
      answerContent.toLowerCase() === 'false'
    ) {
      result.question_type = 'true_false';
      result.options = ['Doğru', 'Yanlış'];
      result.correct_answer = 'Yanlış';
    } else {
      result.question_type = 'short_answer';
      result.correct_answer = answerContent.split('#')[0].trim();
      result.explanation = answerContent.split('#')[1]?.trim() || null;
    }

    if (result.question_text && result.correct_answer) {
      questions.push(result as ParsedQuestion);
    }
  }

  return questions;
};

// ─── MARKDOWN — yardımçı funksiyalar ────────────────────────────────────────

/**
 * Metadata satırlarını oxuyur.
 * Dəstəklənən açarlar: İzahat, Kateqoriya, Çətinlik, Bloom, Taqlar, ANSWER.
 * Həm Azərbaycanca, həm ingilis dilini qəbul edir.
 */
function extractMetadata(lines: string[], target: Partial<ParsedQuestion>) {
  for (const line of lines) {
    const clean = line.trim();
    const metaMatch = clean.match(
      /^(İzahat|Izahat|Explanation|Açıqlama|Kateqoriya|Category|Çətinlik|Difficulty|Bloom|Taqlar|Tags|ANSWER|Düzgün cavab|Doğru cavab|Düzgün|Cavab|Doğru)\s*[-:]?\s*(.+)$/i,
    );
    if (!metaMatch) continue;
    const key = metaMatch[1].toLowerCase();
    const value = metaMatch[2].trim();

    if (['izahat', 'açıqlama', 'explanation'].includes(key)) {
      target.explanation = value;
    } else if (['kateqoriya', 'category'].includes(key)) {
      target.category = value;
    } else if (['çətinlik', 'difficulty'].includes(key)) {
      target.difficulty = value.toLowerCase();
    } else if (key === 'bloom') {
      target.bloom_level = value.toLowerCase();
    } else if (['taqlar', 'tags'].includes(key)) {
      target.tags = value
        .split(/[,;]/)
        .map(t => t.trim())
        .filter(Boolean);
    } else if (['answer', 'düzgün', 'cavab', 'doğru', 'doğru cavab', 'düzgün cavab'].includes(key)) {
      const letter = value.trim().toUpperCase();
      // Əgər variant mətni birbaşa verilibsə (Format 3 kimi)
      const opts = target.options as string[] | null;
      if (Array.isArray(opts)) {
        if (opts.includes(value.trim())) {
          target.correct_answer = value.trim();
        } else {
          // Aiken-stilli ANSWER: A → indeks ilə variant mətni
          const idx = letter.charCodeAt(0) - 65;
          if (opts[idx]) {
            target.correct_answer = opts[idx];
          }
        }
      }
    }
  }
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
      const text = match[2].trim();
      (result.options as string[]).push(text);
      if (isCorrect) result.correct_answer = text;
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
 * Həmçinin `Düzgün cavab: B` formasını da qəbul edir.
 */
function parseMarkdownFormat2(content: string): ParseResult {
  const questions: ParsedQuestion[] = [];
  const warnings: ParseWarning[] = [];

  const blocks = content
    .split(/(?=^\d+[.)]\s)/m)
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
      // Variant sətirləri: `A) ...` | `A. ...` | `* A) ...` | `- A) ...`
      const optMatch = l.match(/^[-*•]?\s*([A-Ea-e])[).]\s+(.+)/);
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
 * Apple Notes / Google Docs bullet export
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

// ─── MARKDOWN FORMAT 4: --- AYRICI İLƏ BLOKLAR ──────────────────────────────

/**
 * Tək sual blokunu parse edir. Hər format növünü tanıyır:
 * - Checklist: `- [x] ...`
 * - Aiken: `A) ...` + `ANSWER: A`
 * - Bullet: `- Variant`
 * - Plain: sual mətni + Düzgün cavab: ...
 */
function parseSingleBlock(
  block: string,
  lineOffset: number,
): { questions: ParsedQuestion[]; warnings: ParseWarning[] } {
  const lines = block.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
  if (!lines.length) return { questions: [], warnings: [] };

  // Checklist formatı: `- [x] Düzgün` varsa format1-ə yönləndir
  if (/^[-*]\s*\[[ xX]\]/.test(block)) {
    // Birinci sətiri başlıq kimi işlət
    const wrapped = '# ' + lines[0] + '\n' + lines.slice(1).join('\n');
    return parseMarkdownFormat1(wrapped);
  }

  const questionLines: string[] = [];
  const options: string[] = [];
  let correctAnswer: string | undefined;
  const metaLines: string[] = [];

  // Metadata açarları (həm AZ həm EN)
  const META_RE =
    /^(İzahat|Izahat|Explanation|Açıqlama|Kateqoriya|Category|Çətinlik|Difficulty|Bloom|Taqlar|Tags|ANSWER|Düzgün|Cavab|Doğru cavab)\s*[:-]/iu;

  let parsingOptions = false;

  for (const line of lines) {
    const aikenOpt = line.match(/^([A-Ea-e])[).]\s+(.+)/);
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

  // Cavabı metadata-dan tap
  if (!correctAnswer) {
    for (const ml of metaLines) {
      const ansLetterMatch = ml.match(/^ANSWER:\s+([A-Ea-e])$/i);
      const duzgunMatch = ml.match(
        /^(?:Düzgün|Cavab|Doğru cavab)\s*[-:]?\s*(.+)/i,
      );

      if (ansLetterMatch) {
        const idx = ansLetterMatch[1].toUpperCase().charCodeAt(0) - 65;
        if (options[idx]) correctAnswer = options[idx];
      } else if (duzgunMatch) {
        const val = duzgunMatch[1].trim();
        if (options.includes(val)) {
          correctAnswer = val;
        } else {
          const idx = val.toUpperCase().charCodeAt(0) - 65;
          if (options[idx]) correctAnswer = options[idx];
          else if (!options.length) correctAnswer = val;
        }
      }
    }
  }

  if (correctAnswer) result.correct_answer = correctAnswer;
  // Əgər extractMetadata ANSWER: tapıbsa
  if (!result.correct_answer && options.length > 0) {
    // result.correct_answer might have been set by extractMetadata
  }

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
 * Hər blok müstəqil sual kimi parse edilir.
 * Hansı MD alt-formatı olduğundan asılı olmayaraq işləyir.
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

    // Blok içində `# ` başlığı varsa format1 ilə parse et
    if (/^#\s+/m.test(trimmed)) {
      const r = parseMarkdownFormat1(trimmed);
      allQuestions.push(...r.questions);
      allWarnings.push(...r.warnings);
      continue;
    }

    // Nömrəli siyahı `1. ...` varsa format2 ilə parse et
    if (/^\d+[.)]\s/m.test(trimmed)) {
      const r = parseMarkdownFormat2(trimmed);
      allQuestions.push(...r.questions);
      allWarnings.push(...r.warnings);
      continue;
    }

    // Tək blok — müstəqil sual kimi parse et
    const r = parseSingleBlock(trimmed, lineOffset);
    allQuestions.push(...r.questions);
    allWarnings.push(...r.warnings);
  }

  return { questions: allQuestions, warnings: allWarnings };
}

// ─── ƏSAS MARKDOWN PARSER ────────────────────────────────────────────────────
/**
 * Markdown-ı avtomatik format aşkar edərək parse edir.
 * Priority: `---` ayrıcı → Format 1 → Format 2 → Format 3
 * Həmişə strukturlu ParseResult qaytarır.
 */
export const parseMarkdownFull = (content: string): ParseResult => {
  // Format 4: `---` ayrıcı ilə bloklar (ən geniş format)
  if (/^(?:---+|===+)\s*$/m.test(content)) {
    const result = parseMarkdownSeparated(content);
    if (result.questions.length > 0) return result;
  }

  // Format 1: `# ` başlıqlı bloklar
  if (/^#\s+.+/m.test(content)) {
    return parseMarkdownFormat1(content);
  }

  // Format 2: nömrəli siyahı `1. ...` / `1) ...`
  if (/^\d+[.)]\s+/m.test(content)) {
    const result = parseMarkdownFormat2(content);
    if (result.questions.length > 0) return result;
  }

  // Format 3: bullet siyahısı `•` / `\t•`
  if (/[\t\s]*[•]\s*/m.test(content) || /^\d+\s*$/m.test(content)) {
    const result = parseMarkdownFormat3(content);
    if (result.questions.length > 0) return result;
  }

  return { questions: [], warnings: [] };
};

/**
 * Legacy wrapper — köhnə kodla uyğunluq üçün.
 */
export const parseMarkdown = (content: string): ParsedQuestion[] => {
  return parseMarkdownFull(content).questions;
};
