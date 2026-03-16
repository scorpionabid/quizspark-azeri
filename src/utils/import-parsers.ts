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

// ─── MARKDOWN — çox-format ───────────────────────────────────────────────────

/**
 * Metadata satırlarını (İzahat, Kateqoriya, Çətinlik, Bloom, Taqlar)
 * ayrı-ayrı satırlardan oxuyur.
 */
function extractMetadata(
  lines: string[],
  target: Partial<ParsedQuestion>,
) {
  for (const line of lines) {
    const clean = line.trim();
    const metaMatch = clean.match(
      /^(İzahat|Izahat|Explanation|Açıqlama|Kateqoriya|Category|Çətinlik|Difficulty|Bloom|Taqlar|Tags|ANSWER):\s*(.+)$/i,
    );
    if (!metaMatch) continue;
    const key = metaMatch[1].toLowerCase();
    const value = metaMatch[2].trim();

    if (['izahat', 'açıqlama', 'explanation'].some(k => key.startsWith(k))) {
      target.explanation = value;
    } else if (['kateqoriya', 'category'].some(k => key.startsWith(k))) {
      target.category = value;
    } else if (['çətinlik', 'difficulty'].some(k => key.startsWith(k))) {
      target.difficulty = value.toLowerCase();
    } else if (key === 'bloom') {
      target.bloom_level = value.toLowerCase();
    } else if (['taqlar', 'tags'].some(k => key.startsWith(k))) {
      target.tags = value.split(',').map(t => t.trim()).filter(Boolean);
    } else if (key === 'answer') {
      // Aiken-stilli ANSWER: A → indeks ilə variant mətni
      const letter = value.trim().toUpperCase();
      const idx = letter.charCodeAt(0) - 65;
      const opts = target.options as string[] | null;
      if (Array.isArray(opts) && opts[idx]) {
        target.correct_answer = opts[idx];
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
      warnings.push({ line: lineOffset, type: 'no_options', message: `"${questionText.slice(0, 40)}..." sualında variant tapılmadı` });
    }
    if (!result.correct_answer) {
      warnings.push({ line: lineOffset, type: 'missing_answer', message: `"${questionText.slice(0, 40)}..." sualında düzgün cavab işarələnməyib` });
    }
    if (questionText) questions.push(result as ParsedQuestion);
  }
  return { questions, warnings };
}

/**
 * Format 2: `1. Sual mətni\n* A) Variant\n* B) Variant`
 * İstəğe bağlı: `Düzgün cavab: A` və ya `ANSWER: A`
 */
function parseMarkdownFormat2(content: string): ParseResult {
  const questions: ParsedQuestion[] = [];
  const warnings: ParseWarning[] = [];

  // Sualları `N. ` ilə bölürük (nömrəli siyahı)
  const blocks = content
    .split(/(?=^\d+[.)]\s)/m)
    .map(b => b.trim())
    .filter(Boolean);

  for (const block of blocks) {
    const lines = block.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
    if (!lines.length) continue;

    // Birinci sətir: `1. Sual mətni` ya `1) Sual mətni`
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
      // Variant sətirləri: `* A) ...` | `- A) ...` | `A) ...` | `A. ...`
      const optMatch = l.match(/^[-*•]?\s*([A-Ea-e])[).]\s+(.+)/);
      if (optMatch) {
        optLines.push(optMatch[2].trim());
      } else {
        metaLines.push(l);
      }
    }

    result.options = optLines;

    // Düzgün cavabı metadata-dan tap
    extractMetadata(metaLines, result);

    // `Düzgün: A` / `Cavab: B` forma
    for (const ml of metaLines) {
      const ansMatch = ml.match(/^(?:Düzgün|Cavab|Doğru cavab)\s*[-:]?\s*([A-Ea-e])/i);
      if (ansMatch) {
        const idx = ansMatch[1].toUpperCase().charCodeAt(0) - 65;
        if (optLines[idx]) result.correct_answer = optLines[idx];
      }
    }

    if (optLines.length === 0) {
      warnings.push({ line: firstLineNum, type: 'no_options', message: `"${questionText.slice(0, 40)}..." sualında variant tapılmadı` });
    }
    if (!result.correct_answer) {
      warnings.push({ line: firstLineNum, type: 'missing_answer', message: `"${questionText.slice(0, 40)}..." sualında düzgün cavab göstərilməyib — preview-da əlavə edin` });
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

  // Sualları rəqəmli bölücü ilə ayır: `\n1\n` / `\n2\n`
  const blocks = content
    .split(/(?=^(?:\d+)\s*$)/m)
    .map(b => b.trim())
    .filter(Boolean);

  for (const block of blocks) {
    const lines = block.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
    if (lines.length < 2) continue;

    // Birinci sətir rəqəm ola bilər — atlayırıq
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
      // Bullet formatları: `•`, `\t•\t`, `-`, `*`
      const bulletMatch = l.match(/^[\t\s]*[-•*]\s*(?:\t\s*)?(.+)$/u);
      if (bulletMatch) {
        (result.options as string[]).push(bulletMatch[1].trim());
      } else {
        metaLines.push(l);
      }
    }

    extractMetadata(metaLines, result);

    // Düzgün cavabı məlumatdan tap
    for (const ml of metaLines) {
      const ansMatch = ml.match(/^(?:Düzgün|Cavab|Doğru cavab)\s*[:-]?\s*(.+)/i);
      if (ansMatch) {
        const val = ansMatch[1].trim();
        // Əgər variant mətni olaraq verilmişsə
        if ((result.options as string[]).includes(val)) {
          result.correct_answer = val;
        } else {
          // Hərfli göstəriş: A, B, C
          const idx = val.toUpperCase().charCodeAt(0) - 65;
          if ((result.options as string[])[idx]) {
            result.correct_answer = (result.options as string[])[idx];
          }
        }
      }
    }

    if ((result.options as string[]).length === 0) {
      warnings.push({ line: firstLineNum, type: 'no_options', message: `"${questionText.slice(0, 40)}..." sualında variant tapılmadı` });
    }
    if (!result.correct_answer) {
      warnings.push({ line: firstLineNum, type: 'missing_answer', message: `"${questionText.slice(0, 40)}..." sualında düzgün cavab göstərilməyib — preview-da əlavə edin` });
    }

    if (questionText) questions.push(result as ParsedQuestion);
  }
  return { questions, warnings };
}

/**
 * Əsas Markdown parser — formatı avtomatik aşkar edir.
 * Həmişə structurlu ParseResult qaytarır.
 */
export const parseMarkdownFull = (content: string): ParseResult => {
  // Format 1: ən azı bir `# ` başlığı var
  if (/^#\s+.+/m.test(content)) {
    return parseMarkdownFormat1(content);
  }

  // Format 2: nömrəli sual siyahısı `1. ...` / `1) ...`
  if (/^\d+[.)]\s+/m.test(content)) {
    const result = parseMarkdownFormat2(content);
    if (result.questions.length > 0) return result;
  }

  // Format 3: bullet siyahısı `•` / `\t•` ilə
  if (/[\t\s]*[•]\s*/m.test(content) || /^\d+\s*$/m.test(content)) {
    const result = parseMarkdownFormat3(content);
    if (result.questions.length > 0) return result;
  }

  return { questions: [], warnings: [] };
};

/**
 * Legacy wrapper — köhnə kodla uyğunluq üçün.
 * Yalnız sualları (warnings olmadan) qaytarır.
 */
export const parseMarkdown = (content: string): ParsedQuestion[] => {
  return parseMarkdownFull(content).questions;
};
