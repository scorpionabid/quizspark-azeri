import { ParseWarning } from './types';

// ─── META_RE builder ─────────────────────────────────────────────────────────

/**
 * Bütün blok parser-lərin paylaşdığı baza keyword dəsti.
 */
const BASE_META =
  'İzah|Izah|İzahat|Izahat|Explanation|Açıqlama|İpucu|Ipucu|Hint|Kateqoriya|Category|Çətinlik|Difficulty|Bloom|Taqlar|Tags|Tip|Type|Şəkil|Sekil|Image|Photo|Media|Video|Model|3D|3d_model|Audio';

/**
 * Cavab keyword-ləri — fill_blank, numerical, code, generic bloklar üçün.
 */
export const ANSWER_META = 'Cavab|Düzgün cavab|Doğru cavab|Answer|ANSWER|Düzgün|Doğru';

/**
 * Baza dəstinə opsional əlavə keyword-lər birləşdirərək META_RE qurur.
 */
export function buildMetaRE(extra?: string): RegExp {
  const pattern = extra ? `${BASE_META}|${extra}` : BASE_META;
  return new RegExp(`^(${pattern})\\s*[-:]`, 'iu');
}

// ─── Paylaşılan sabitlər ──────────────────────────────────────────────────────

/** `Tip:` etiket sətiri */
export const TIP_LINE_RE = /^Tip\s*:/i;

/** Doğru/Yanlış/Bəli/Xeyr/True/False cütü */
export const TRUE_FALSE_RE = /^(doğru|yanlış|bəli|xeyr|true|false)$/i;

/** H1-H6 markdown başlıqları */
export const HEADING_RE = /^#{1,6}\s+/;

/** Hər hansı sual başlığı / prefix-i */
export const QUESTION_PREFIX_RE = /^(?:#{1,6}|Sual|Q|Question)\s*[:.]?\s*(?:\d+\s*[-:.)]\s*)?(?:[^A-Za-z\u0400-\u04FF\u0250-\u02AF\u00C0-\u024F]*)*/i;

/** Matching sualı üçün cavab pattern-i: "1-c; 2-a; 3-b" və ya "1-b, c; 2-a" */
export const MATCHING_ANSWER_RE =
  /^\d+\s*[-:]\s*[a-zA-Z](?:\s*[,،]\s*[a-zA-Z])*(?:\s*[;،]\s*\d+\s*[-:]\s*[a-zA-Z](?:\s*[,،]\s*[a-zA-Z])*)+$/;

/** Bloqun uyğunlaşdırma (matching) olub olmadığını dəqiq yoxlayır */
export function isMatchingBlock(lines: string[], tipValue?: string): boolean {
  if (tipValue && ['matching', 'uyğunlaşdırma', 'uygunlashdirma'].some(t => tipValue.includes(t))) {
    return true;
  }

  // Arrow pairs (ən azı 2 sətir)
  const arrowLines = lines.filter(l => /^[^:]+\s*(?:→|->)\s*[^:]+$/.test(l.trim()));
  if (arrowLines.length >= 2) return true;

  // Cavab sətirində matching formatı: "1-c; 2-a; 3-b"
  const answerLine = lines.find(l => /^(?:Cavab|Düzgün cavab|Doğru cavab|Answer|ANSWER)\s*:/i.test(l.trim()));
  if (answerLine) {
    const val = answerLine.replace(/^(?:Cavab|Düzgün cavab|Doğru cavab|Answer|ANSWER)\s*:\s*/i, '').trim();
    if (MATCHING_ANSWER_RE.test(val)) {
      return true;
    }
  }

  return false;
}

// ─── Warning factory-ləri ─────────────────────────────────────────────────────

/**
 * Dublikat variant xəbərdarlıqlarını qaytarır.
 */
export function warnDuplicateOptions(options: string[], lineOffset: number): ParseWarning[] {
  const seen = new Set<string>();
  const warnings: ParseWarning[] = [];
  options.forEach((opt, idx) => {
    if (seen.has(opt.toLowerCase())) {
      warnings.push({
        line: lineOffset + idx + 1,
        type: 'duplicate_option',
        message: `"${opt}" variantı təkrarlanır`,
        severity: 'warning',
      });
    }
    seen.add(opt.toLowerCase());
  });
  return warnings;
}

/**
 * Boş sual mətni xəbərdarlığı. Sual mətni varsa `null` qaytarır.
 */
export function warnIfMissingText(questionText: string, lineOffset: number): ParseWarning | null {
  if (!questionText || questionText.trim() === '') {
    return {
      line: lineOffset,
      type: 'missing_question_text',
      message: 'Sual mətni tapılmadı və ya boşdur',
      severity: 'error',
    };
  }
  return null;
}

/**
 * Cavab yoxluğu xəbərdarlığı.
 */
export function warnIfMissingAnswer(
  questionText: string,
  lineOffset: number,
  suffix = '',
): ParseWarning {
  return {
    line: lineOffset,
    type: 'missing_answer',
    message: `"${questionText.slice(0, 40)}..." sualında düzgün cavab göstərilməyib${suffix}`,
    severity: 'error',
  };
}

/**
 * Tək sətirdəki inline variantları + sual mətnini ayırır.
 *
 * Format: "[sual mətni] A) Variant1 B) Variant2 C) Variant3"
 *
 * Qaytarır: { questionText, options } — hər ikisi dolu olarsa;
 * yalnız 1 match varsa boş array qaytarır (tək variant inline sayılmır).
 */
export function extractInlineOptions(line: string): string[] {
  const matches = [...line.matchAll(/([A-Z\d]+[).])\s+((?:(?![A-Z\d]+[).]\s+).)+)/gi)];
  if (matches.length > 1) {
    return matches.map((m) => m[2].trim());
  }
  return [];
}

/**
 * Tək sətirlik sual formatını tam parse edir.
 *
 * Format: "[sual mətni] A) Opt1 B) Opt2 C) Opt3 [Cavab: X]"
 *
 * Uğurlu olduqda:
 *   { questionText, options, metaLines }
 * Uğursuz olduqda `null`.
 */
export function parseInlineLine(line: string): {
  questionText: string;
  options: string[];
  metaLines: string[];
} | null {
  // Sətirdə ən azı 2 variant işarəsi olmalıdır: "A) ... B) ..."
  const optionMarkers = [...line.matchAll(/\b([A-D\d])\)\s+/g)];
  if (optionMarkers.length < 2) return null;

  // İlk variant işarəsinin mövqeyi
  const firstMarker = optionMarkers[0];
  const firstPos = firstMarker.index ?? 0;

  // Sual mətni: ilk variant işarəsindən əvvəlki hissə
  const rawQuestionText = line.slice(0, firstPos).trim();

  // Sual mətnini prefix-lərdən təmizlə
  const cleanedText = rawQuestionText.replace(QUESTION_PREFIX_RE, '').trim();
  const questionText = cleanedText || rawQuestionText;
  if (!questionText) return null;

  // Optionlar + trailing meta hissəsini ayır
  const optionsPart = line.slice(firstPos);

  // Trailing meta (Cavab: / Düzgün cavab: / ANSWER:) axtar
  const trailingMetaRE = /\s+((?:Düzgün cavab|Doğru cavab|Cavab|ANSWER)\s*:?\s*.+)$/i;
  const metaMatch = optionsPart.match(trailingMetaRE);
  const metaLines: string[] = [];
  let optionsStr = optionsPart;

  if (metaMatch) {
    metaLines.push(metaMatch[1].trim());
    optionsStr = optionsPart.slice(0, metaMatch.index).trim();
  }

  // Variantları ayır
  const optMatches = [...optionsStr.matchAll(/[A-D\d]\)\s+((?:(?![A-D\d]\)\s+).)+)/gi)];
  const options = optMatches.map(m => m[1].trim()).filter(Boolean);

  if (options.length < 2) return null;

  return { questionText, options, metaLines };
}
