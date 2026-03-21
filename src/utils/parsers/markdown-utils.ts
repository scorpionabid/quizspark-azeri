import { ParseWarning } from './types';

// ─── META_RE builder ─────────────────────────────────────────────────────────

/**
 * Bütün blok parser-lərin paylaşdığı baza keyword dəsti.
 */
const BASE_META =
  'İzahat|Izahat|Explanation|Açıqlama|Kateqoriya|Category|Çətinlik|Difficulty|Bloom|Taqlar|Tags|Tip|Type';

/**
 * Cavab keyword-ləri — fill_blank, numerical, code, generic bloklar üçün.
 */
export const ANSWER_META = 'Cavab|Düzgün cavab|Answer';

/**
 * Baza dəstinə opsional əlavə keyword-lər birləşdirərək META_RE qurur.
 * @example
 *   buildMetaRE()                            // matching, ordering
 *   buildMetaRE(ANSWER_META)                 // fill_blank
 *   buildMetaRE(`${ANSWER_META}|Tolerans|Tolerance`)   // numerical
 *   buildMetaRE(`${ANSWER_META}|Dil|Language`)         // code
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
 * @param suffix — Format2 kimi yerlərdə "— preview-da əlavə edin" kimi əlavə
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
