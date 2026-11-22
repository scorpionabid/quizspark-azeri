import * as XLSX from 'xlsx';
import { QuizResultWithProfile } from '@/hooks/useQuizAttempts';

export interface AttemptAnswersRecord {
  id: string;
  user_id: string;
  completed_at?: string | null;
  answers?: unknown;
}

export interface ExportQuizExcelOptions {
  quizTitle: string;
  results: QuizResultWithProfile[];
  passPercentage?: number;
  attempts?: AttemptAnswersRecord[];
}

export interface ResultMetrics {
  correctCount: number;
  incorrectCount: number;
  unansweredCount: number;
  wrongAndBlankCount: number;
  totalQuestions: number;
  percentage: number;
  isPassed: boolean;
  hasExactBreakdown: boolean;
}

export function formatTimeSpent(sec: number | null | undefined): string {
  if (sec == null || isNaN(sec)) return '—';
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

/**
 * Accurately computes correct, incorrect, and unanswered question counts for a quiz result,
 * handling both percentage-encoded scores (0..100 from QuizPage) and raw question counts,
 * as well as exact answer arrays when available from quiz_attempts.
 */
export function computeResultMetrics(
  r: QuizResultWithProfile,
  passPercentage = 60,
  attemptAnswers?: unknown
): ResultMetrics {
  const total = Math.max(0, r.total_questions ?? 0);
  const rawScore = r.score ?? 0;
  const pct =
    typeof r.percentage === 'number'
      ? Number(r.percentage.toFixed(1))
      : Number(rawScore.toFixed(1));

  if (Array.isArray(attemptAnswers) && attemptAnswers.length > 0) {
    const typed = attemptAnswers as Array<{ isCorrect?: boolean; textAnswer?: string }>;
    const correctCount = typed.filter((a) => Boolean(a.isCorrect)).length;
    const answeredCount = typed.filter(
      (a) => typeof a.textAnswer === 'string' && a.textAnswer.trim().length > 0
    ).length;
    const effectiveTotal = total > 0 ? total : typed.length;
    const unansweredCount = Math.max(0, effectiveTotal - answeredCount);
    const incorrectCount = Math.max(0, effectiveTotal - correctCount - unansweredCount);

    return {
      correctCount,
      incorrectCount,
      unansweredCount,
      wrongAndBlankCount: incorrectCount + unansweredCount,
      totalQuestions: effectiveTotal,
      percentage: pct,
      isPassed: pct >= passPercentage,
      hasExactBreakdown: true,
    };
  }

  // Distinguish raw question count (e.g. 18 out of 20) vs percentage score (e.g. 90 out of 100)
  const isRawCount =
    total > 0 &&
    rawScore <= total &&
    Math.round(rawScore) !== Math.round(pct) &&
    Math.abs((rawScore / total) * 100 - pct) <= 1.5;

  const correctCount = isRawCount
    ? Math.round(rawScore)
    : total > 0
    ? Math.round((pct * total) / 100)
    : 0;

  const wrongAndBlankCount = Math.max(0, total - correctCount);

  return {
    correctCount,
    incorrectCount: wrongAndBlankCount,
    unansweredCount: 0,
    wrongAndBlankCount,
    totalQuestions: total,
    percentage: pct,
    isPassed: pct >= passPercentage,
    hasExactBreakdown: false,
  };
}

/**
 * Finds matching attempt answers for a given quiz result row.
 */
export function findAttemptAnswersForResult(
  r: QuizResultWithProfile,
  attempts?: AttemptAnswersRecord[]
): unknown {
  if (!attempts || attempts.length === 0) return undefined;
  if (r.attempt_id) {
    const byId = attempts.find((a) => a.id === r.attempt_id);
    if (byId?.answers) return byId.answers;
  }
  const byUser = attempts.find((a) => a.user_id === r.user_id);
  return byUser?.answers;
}

/**
 * Builds and downloads an official Azerbaijani school-standard Excel protocol (.xlsx)
 * of student quiz results with UTIS codes, schools, classes, scores, and accuracy metrics.
 */
export function exportQuizResultsToExcel({
  quizTitle,
  results,
  passPercentage = 60,
  attempts,
}: ExportQuizExcelOptions): string {
  if (!results || results.length === 0) {
    throw new Error('İxrac etmək üçün nəticə tapılmadı.');
  }

  const exportRows = results.map((r, index) => {
    const prof = r.profiles;
    const utisCode = prof?.utis_code || prof?.fin || '—';
    const fullName = prof?.full_name || 'Naməlum';
    const school = prof?.school || '—';
    const grade = prof?.grade || '—';

    const attemptAnswers = findAttemptAnswersForResult(r, attempts);
    const metrics = computeResultMetrics(r, passPercentage, attemptAnswers);

    let dateFormatted = '—';
    if (r.completed_at) {
      try {
        dateFormatted = new Date(r.completed_at).toLocaleString('az-AZ', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
        });
      } catch {
        dateFormatted = r.completed_at;
      }
    }

    return {
      '№': index + 1,
      'UTİS Kodu': utisCode,
      'Şagirdin Adı, Soyadı': fullName,
      'Məktəb': school,
      'Sinif': grade,
      'Toplanan Bal': metrics.correctCount,
      'Maksimal Bal': metrics.totalQuestions,
      'Düzgün Cavab': metrics.correctCount,
      'Səhv / Boş': metrics.wrongAndBlankCount,
      'Nəticə (%)': metrics.percentage,
      'Status': metrics.isPassed ? 'Keçdi' : 'Keçmədi',
      'Sərf Olunan Vaxt': formatTimeSpent(r.time_spent),
      'İmtahan Tarixi': dateFormatted,
    };
  });

  const worksheet = XLSX.utils.json_to_sheet(exportRows);

  // Set professional column widths
  worksheet['!cols'] = [
    { wch: 6 },  // №
    { wch: 14 }, // UTİS Kodu
    { wch: 28 }, // Şagirdin Adı, Soyadı
    { wch: 30 }, // Məktəb
    { wch: 10 }, // Sinif
    { wch: 14 }, // Toplanan Bal
    { wch: 14 }, // Maksimal Bal
    { wch: 14 }, // Düzgün Cavab
    { wch: 12 }, // Səhv / Boş
    { wch: 12 }, // Nəticə (%)
    { wch: 12 }, // Status
    { wch: 16 }, // Sərf Olunan Vaxt
    { wch: 20 }, // İmtahan Tarixi
  ];

  const workbook = XLSX.utils.book_new();
  const safeSheetName = (quizTitle || 'Protokol').slice(0, 31).replace(/[\\/*?:[\]]/g, '');
  XLSX.utils.book_append_sheet(workbook, worksheet, safeSheetName || 'Nəticələr');

  const cleanTitle = (quizTitle || 'Quiz')
    .trim()
    .replace(/[\\/*?:[\]"<>|]/g, '_')
    .replace(/\s+/g, '_')
    .slice(0, 40);
  const nowStr = new Date().toISOString().slice(0, 10);
  const fileName = `${cleanTitle}_Şagird_Nəticələri_${nowStr}.xlsx`;

  XLSX.writeFile(workbook, fileName);
  return fileName;
}
