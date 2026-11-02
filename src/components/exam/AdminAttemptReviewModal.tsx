import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MathRenderer } from '@/components/common/MathRenderer';
import { supabase } from '@/integrations/supabase/client';
import {
  BookOpen,
  Scale,
  Laptop,
  Award,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  FileText,
  Clock,
  User,
  ShieldCheck,
  Check,
  X,
  Filter,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export interface AnswerItem {
  questionId?: string;
  textAnswer?: string;
  isCorrect?: boolean;
  pointsEarned?: number;
  selectedOptionIndex?: number;
}

export interface AppealCorrectionItem {
  id: string;
  attempt_id: string;
  question_id: string;
  candidate_user_id: string;
  original_option_index?: number | null;
  original_text_answer?: string | null;
  original_is_correct: boolean;
  original_points_earned: number;
  corrected_option_index?: number | null;
  corrected_text_answer?: string | null;
  corrected_is_correct: boolean;
  corrected_points_earned: number;
  appeal_type: string;
  appeal_reason: string;
  protocol_number: string;
  committee_decision: string;
  created_at: string;
}

export interface ReviewAttemptData {
  id: string;
  quizId: string;
  userId: string;
  fin: string;
  fullName: string;
  specialty: string;
  score: number;
  totalQuestions: number;
  timeSpent: number | null;
  startedAt: string;
  completedAt: string | null;
  isCompleted: boolean;
  passPercentage: number;
  isPassed: boolean;
  answers?: unknown[];
}

interface AdminAttemptReviewModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  attempt: ReviewAttemptData | null;
}

export type SectionType = 'all' | 'specialty' | 'legislation' | 'ict' | 'wrong';

function formatSeconds(seconds: number | null | undefined): string {
  if (seconds == null || isNaN(seconds) || seconds <= 0) return '—';
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  if (m >= 60) {
    const h = Math.floor(m / 60);
    const remM = m % 60;
    return `${h} saat ${remM} dəq ${s} san`;
  }
  return `${m} dəq ${s} san`;
}

export const AdminAttemptReviewModal: React.FC<AdminAttemptReviewModalProps> = ({
  open,
  onOpenChange,
  attempt,
}) => {
  const [activeFilter, setActiveFilter] = useState<SectionType>('all');

  // 1. Fetch official questions for this quiz
  const { data: questions = [], isLoading: isLoadingQuestions } = useQuery({
    queryKey: ['admin_quiz_questions', attempt?.quizId],
    queryFn: async () => {
      if (!attempt?.quizId) return [];
      const { data, error } = await supabase
        .from('questions')
        .select('id, order_index, question_text, question_type, options, correct_answer, explanation, weight')
        .eq('quiz_id', attempt.quizId)
        .order('order_index', { ascending: true });
      if (error) throw error;
      return data || [];
    },
    enabled: open && !!attempt?.quizId,
  });

  // 2. Fetch translations (Georgian ka) if applicable
  const { data: translations = {} } = useQuery({
    queryKey: ['admin_quiz_translations', attempt?.quizId, questions.length],
    queryFn: async () => {
      if (!attempt?.quizId || questions.length === 0) return {};
      const qIds = questions.map((q) => q.id);
      const { data, error } = await supabase
        .from('question_translations')
        .select('question_id, question_text, options, correct_answer')
        .in('question_id', qIds)
        .eq('language_code', 'ka');
      if (error) {
        console.warn('Translations fetch warning:', error);
        return {};
      }
      const map: Record<string, { question_text?: string; correct_answer?: string }> = {};
      (data || []).forEach((tr) => {
        map[tr.question_id] = tr;
      });
      return map;
    },
    enabled: open && !!attempt?.quizId && questions.length > 0,
  });

  // 3. Fetch appeal corrections for this attempt
  const { data: appeals = [] } = useQuery<AppealCorrectionItem[]>({
    queryKey: ['admin_attempt_appeals', attempt?.id],
    queryFn: async () => {
      if (!attempt?.id) return [];
      const { data, error } = await (supabase
        .from('appeal_corrections' as never)
        .select('*')
        .eq('attempt_id', attempt.id) as unknown as Promise<{
          data: AppealCorrectionItem[] | null;
          error: Error | null;
        }>);
      if (error) {
        console.warn('Appeal corrections fetch warning:', error);
        return [];
      }
      return data || [];
    },
    enabled: open && !!attempt?.id,
  });

  // 4. Fetch attempt answers lazily on-demand (zero payload on main table)
  const { data: attemptAnswers = [] } = useQuery({
    queryKey: ['admin_attempt_answers', attempt?.id],
    queryFn: async () => {
      if (!attempt?.id) return [];
      if (Array.isArray(attempt.answers) && attempt.answers.length > 0) {
        return attempt.answers;
      }
      const { data, error } = await supabase
        .from('quiz_attempts')
        .select('answers')
        .eq('id', attempt.id)
        .maybeSingle();
      if (error) {
        console.warn('Fetch attempt answers error:', error);
        return [];
      }
      return Array.isArray(data?.answers) ? data.answers : [];
    },
    enabled: open && !!attempt?.id,
    staleTime: 60000,
  });

  // Parse candidate answers
  const answersMap = useMemo(() => {
    const map = new Map<string, AnswerItem>();
    const rawAnswers = (attemptAnswers || []) as AnswerItem[];
    rawAnswers.forEach((ans) => {
      if (ans.questionId) {
        map.set(ans.questionId, ans);
      }
    });
    return map;
  }, [attemptAnswers]);

  // Map appeals by questionId
  const appealsMap = useMemo(() => {
    const map = new Map<string, AppealCorrectionItem>();
    appeals.forEach((app) => {
      if (app.question_id) {
        map.set(app.question_id, app);
      }
    });
    return map;
  }, [appeals]);

  // Section statistics calculation
  const sectionStats = useMemo(() => {
    let specialtyTotal = 0;
    let specialtyCorrect = 0;
    let legislationTotal = 0;
    let legislationCorrect = 0;
    let ictTotal = 0;
    let ictCorrect = 0;

    questions.forEach((q) => {
      const ans = answersMap.get(q.id);
      const appeal = appealsMap.get(q.id);

      // Effective correctness taking approved appeal into account
      const effectiveCorrect =
        appeal && appeal.committee_decision === 'approved'
          ? appeal.corrected_is_correct
          : ans?.isCorrect === true;

      const idx = q.order_index ?? 0;
      if (idx >= 1 && idx <= 30) {
        specialtyTotal++;
        if (effectiveCorrect) specialtyCorrect++;
      } else if (idx >= 31 && idx <= 45) {
        legislationTotal++;
        if (effectiveCorrect) legislationCorrect++;
      } else if (idx >= 46 && idx <= 60) {
        ictTotal++;
        if (effectiveCorrect) ictCorrect++;
      }
    });

    const totalCalculatedQuestions = specialtyTotal + legislationTotal + ictTotal || questions.length || 60;
    const totalCalculatedCorrect = specialtyCorrect + legislationCorrect + ictCorrect;

    return {
      specialty: {
        total: specialtyTotal || 30,
        correct: specialtyCorrect,
        percentage: specialtyTotal > 0 ? Math.round((specialtyCorrect / specialtyTotal) * 100) : 0,
      },
      legislation: {
        total: legislationTotal || 15,
        correct: legislationCorrect,
        percentage: legislationTotal > 0 ? Math.round((legislationCorrect / legislationTotal) * 100) : 0,
      },
      ict: {
        total: ictTotal || 15,
        correct: ictCorrect,
        percentage: ictTotal > 0 ? Math.round((ictCorrect / ictTotal) * 100) : 0,
      },
      overall: {
        total: totalCalculatedQuestions,
        correct: totalCalculatedCorrect,
        percentage:
          totalCalculatedQuestions > 0
            ? Math.round((totalCalculatedCorrect / totalCalculatedQuestions) * 100)
            : attempt?.score ?? 0,
      },
    };
  }, [questions, answersMap, appealsMap, attempt?.score]);

  // Filter questions according to active tab
  const filteredQuestions = useMemo(() => {
    return questions.filter((q) => {
      const idx = q.order_index ?? 0;
      const ans = answersMap.get(q.id);
      const appeal = appealsMap.get(q.id);
      const isCorrect =
        appeal && appeal.committee_decision === 'approved'
          ? appeal.corrected_is_correct
          : ans?.isCorrect === true;

      if (activeFilter === 'specialty') return idx >= 1 && idx <= 30;
      if (activeFilter === 'legislation') return idx >= 31 && idx <= 45;
      if (activeFilter === 'ict') return idx >= 46 && idx <= 60;
      if (activeFilter === 'wrong') return !isCorrect;
      return true;
    });
  }, [questions, activeFilter, answersMap, appealsMap]);

  if (!attempt) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl w-[96vw] max-h-[92vh] flex flex-col p-0 overflow-hidden rounded-3xl border-slate-200 dark:border-slate-800 shadow-2xl">
        {/* Header */}
        <DialogHeader className="p-5 pb-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/90 dark:bg-slate-900/90">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <DialogTitle className="text-xl font-bold flex items-center gap-2.5 text-slate-900 dark:text-white">
                <FileText className="w-5 h-5 text-blue-600" />
                İmtahanın Detallı Nəticəsi
              </DialogTitle>
              <DialogDescription asChild>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500 dark:text-slate-400 mt-1">
                  <span className="flex items-center gap-1">
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    <strong>{attempt.fullName}</strong>
                  </span>
                  <span>
                    FİN: <strong className="font-mono text-slate-800 dark:text-slate-200">{attempt.fin}</strong>
                  </span>
                  <span>
                    İxtisas: <strong className="text-slate-800 dark:text-slate-200">{attempt.specialty}</strong>
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    Vaxt: <strong>{formatSeconds(attempt.timeSpent)}</strong>
                  </span>
                </div>
              </DialogDescription>
            </div>

            <div className="flex items-center gap-2 shrink-0 self-start sm:self-auto">
              <Badge
                className={cn(
                  'text-sm font-bold px-3 py-1',
                  attempt.isPassed
                    ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                    : 'bg-rose-600 text-white hover:bg-rose-700'
                )}
              >
                {attempt.isPassed ? 'Müvəffəqiyyətlə Keçib' : 'Kəsilib'} ({sectionStats.overall.percentage}%)
              </Badge>
            </div>
          </div>
        </DialogHeader>

        {/* Scrollable Body */}
        <div className="overflow-y-auto p-5 space-y-5 flex-1 pr-3">
          {/* SECTION STATS CARDS (Cəmi / Düzgün formatı) */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {/* 1. İxtisas */}
            <div
              onClick={() => setActiveFilter('specialty')}
              className={cn(
                'cursor-pointer p-4 rounded-2xl border transition-all hover:shadow-md',
                activeFilter === 'specialty'
                  ? 'border-blue-500 bg-blue-50/70 dark:bg-blue-950/40 ring-2 ring-blue-400/30'
                  : 'border-blue-100 dark:border-blue-900/30 bg-blue-50/30 dark:bg-blue-950/10'
              )}
            >
              <div className="flex items-center justify-between text-blue-700 dark:text-blue-400 mb-1.5">
                <div className="flex items-center gap-1.5 font-bold text-xs uppercase tracking-wider">
                  <BookOpen className="w-4 h-4" />
                  İxtisas
                </div>
                <Badge variant="outline" className="text-blue-700 border-blue-300 font-mono text-xs">
                  {sectionStats.specialty.percentage}%
                </Badge>
              </div>
              <div className="text-2xl font-black text-slate-800 dark:text-slate-100 font-mono">
                {sectionStats.specialty.total} \ {sectionStats.specialty.correct}
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                Cəmi: {sectionStats.specialty.total} | Doğru: {sectionStats.specialty.correct}
              </div>
            </div>

            {/* 2. Qanunvericilik */}
            <div
              onClick={() => setActiveFilter('legislation')}
              className={cn(
                'cursor-pointer p-4 rounded-2xl border transition-all hover:shadow-md',
                activeFilter === 'legislation'
                  ? 'border-amber-500 bg-amber-50/70 dark:bg-amber-950/40 ring-2 ring-amber-400/30'
                  : 'border-amber-100 dark:border-amber-900/30 bg-amber-50/30 dark:bg-amber-950/10'
              )}
            >
              <div className="flex items-center justify-between text-amber-700 dark:text-amber-400 mb-1.5">
                <div className="flex items-center gap-1.5 font-bold text-xs uppercase tracking-wider">
                  <Scale className="w-4 h-4" />
                  Qanunvericilik
                </div>
                <Badge variant="outline" className="text-amber-700 border-amber-300 font-mono text-xs">
                  {sectionStats.legislation.percentage}%
                </Badge>
              </div>
              <div className="text-2xl font-black text-slate-800 dark:text-slate-100 font-mono">
                {sectionStats.legislation.total} \ {sectionStats.legislation.correct}
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                Cəmi: {sectionStats.legislation.total} | Doğru: {sectionStats.legislation.correct}
              </div>
            </div>

            {/* 3. İKT / İnformatika */}
            <div
              onClick={() => setActiveFilter('ict')}
              className={cn(
                'cursor-pointer p-4 rounded-2xl border transition-all hover:shadow-md',
                activeFilter === 'ict'
                  ? 'border-purple-500 bg-purple-50/70 dark:bg-purple-950/40 ring-2 ring-purple-400/30'
                  : 'border-purple-100 dark:border-purple-900/30 bg-purple-50/30 dark:bg-purple-950/10'
              )}
            >
              <div className="flex items-center justify-between text-purple-700 dark:text-purple-400 mb-1.5">
                <div className="flex items-center gap-1.5 font-bold text-xs uppercase tracking-wider">
                  <Laptop className="w-4 h-4" />
                  İKT / İnformatika
                </div>
                <Badge variant="outline" className="text-purple-700 border-purple-300 font-mono text-xs">
                  {sectionStats.ict.percentage}%
                </Badge>
              </div>
              <div className="text-2xl font-black text-slate-800 dark:text-slate-100 font-mono">
                {sectionStats.ict.total} \ {sectionStats.ict.correct}
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                Cəmi: {sectionStats.ict.total} | Doğru: {sectionStats.ict.correct}
              </div>
            </div>

            {/* 4. Yekun Nəticə */}
            <div
              onClick={() => setActiveFilter('all')}
              className={cn(
                'cursor-pointer p-4 rounded-2xl border transition-all hover:shadow-md',
                activeFilter === 'all'
                  ? 'border-emerald-500 bg-emerald-50/70 dark:bg-emerald-950/40 ring-2 ring-emerald-400/30'
                  : 'border-emerald-100 dark:border-emerald-900/30 bg-emerald-50/30 dark:bg-emerald-950/10'
              )}
            >
              <div className="flex items-center justify-between text-emerald-700 dark:text-emerald-400 mb-1.5">
                <div className="flex items-center gap-1.5 font-bold text-xs uppercase tracking-wider">
                  <Award className="w-4 h-4" />
                  Yekun Bal
                </div>
                <Badge variant="outline" className="text-emerald-700 border-emerald-300 font-mono text-xs">
                  {sectionStats.overall.percentage}%
                </Badge>
              </div>
              <div className="text-2xl font-black text-slate-800 dark:text-slate-100 font-mono">
                {sectionStats.overall.total} \ {sectionStats.overall.correct}
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                Cəmi: {sectionStats.overall.total} | Doğru: {sectionStats.overall.correct}
              </div>
            </div>
          </div>

          {/* Filter Bar */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-1">
            <Button
              size="sm"
              variant={activeFilter === 'all' ? 'default' : 'outline'}
              className="h-8 text-xs font-semibold rounded-xl px-3"
              onClick={() => setActiveFilter('all')}
            >
              Hamısı ({questions.length})
            </Button>
            <Button
              size="sm"
              variant={activeFilter === 'specialty' ? 'default' : 'outline'}
              className={cn(
                'h-8 text-xs font-semibold rounded-xl px-3',
                activeFilter === 'specialty'
                  ? 'bg-blue-600 hover:bg-blue-700'
                  : 'text-blue-700 border-blue-200 dark:border-blue-800'
              )}
              onClick={() => setActiveFilter('specialty')}
            >
              <BookOpen className="w-3.5 h-3.5 mr-1" />
              İxtisas ({sectionStats.specialty.total})
            </Button>
            <Button
              size="sm"
              variant={activeFilter === 'legislation' ? 'default' : 'outline'}
              className={cn(
                'h-8 text-xs font-semibold rounded-xl px-3',
                activeFilter === 'legislation'
                  ? 'bg-amber-600 hover:bg-amber-700'
                  : 'text-amber-700 border-amber-200 dark:border-amber-800'
              )}
              onClick={() => setActiveFilter('legislation')}
            >
              <Scale className="w-3.5 h-3.5 mr-1" />
              Qanunvericilik ({sectionStats.legislation.total})
            </Button>
            <Button
              size="sm"
              variant={activeFilter === 'ict' ? 'default' : 'outline'}
              className={cn(
                'h-8 text-xs font-semibold rounded-xl px-3',
                activeFilter === 'ict'
                  ? 'bg-purple-600 hover:bg-purple-700'
                  : 'text-purple-700 border-purple-200 dark:border-purple-800'
              )}
              onClick={() => setActiveFilter('ict')}
            >
              <Laptop className="w-3.5 h-3.5 mr-1" />
              İKT ({sectionStats.ict.total})
            </Button>
            <Button
              size="sm"
              variant={activeFilter === 'wrong' ? 'default' : 'outline'}
              className={cn(
                'h-8 text-xs font-semibold rounded-xl px-3',
                activeFilter === 'wrong'
                  ? 'bg-rose-600 hover:bg-rose-700'
                  : 'text-rose-700 border-rose-200 dark:border-rose-800'
              )}
              onClick={() => setActiveFilter('wrong')}
            >
              <X className="w-3.5 h-3.5 mr-1" />
              Səhvlər ({sectionStats.overall.total - sectionStats.overall.correct})
            </Button>
          </div>

          {/* Question List */}
          {isLoadingQuestions ? (
            <div className="py-12 text-center text-slate-400 text-sm">
              Suallar və nəticələr yüklənir...
            </div>
          ) : filteredQuestions.length === 0 ? (
            <div className="py-12 text-center text-slate-400 text-sm">
              Bu filtr üzrə sual tapılmadı.
            </div>
          ) : (
            <div className="space-y-3">
              {filteredQuestions.map((q) => {
                const ans = answersMap.get(q.id);
                const appeal = appealsMap.get(q.id);
                const trans = translations[q.id];

                const effectiveIsCorrect =
                  appeal && appeal.committee_decision === 'approved'
                    ? appeal.corrected_is_correct
                    : ans?.isCorrect === true;

                const isAppealed = !!appeal;
                const idx = q.order_index ?? 0;
                const sectionLabel =
                  idx >= 1 && idx <= 30
                    ? 'İxtisas'
                    : idx >= 31 && idx <= 45
                    ? 'Qanunvericilik'
                    : 'İKT / İnformatika';

                return (
                  <div
                    key={q.id}
                    className={cn(
                      'p-4 rounded-2xl border transition-colors space-y-2.5',
                      effectiveIsCorrect
                        ? 'bg-emerald-50/30 dark:bg-emerald-950/10 border-emerald-200/80 dark:border-emerald-900/40'
                        : 'bg-rose-50/30 dark:bg-rose-950/10 border-rose-200/80 dark:border-rose-900/40'
                    )}
                  >
                    {/* Header line */}
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-sm text-slate-800 dark:text-slate-100">
                          #{q.order_index}
                        </span>
                        <Badge variant="outline" className="text-xs text-slate-600 dark:text-slate-400">
                          {sectionLabel}
                        </Badge>
                      </div>

                      <div>
                        {effectiveIsCorrect ? (
                          <Badge className="bg-emerald-600 text-white font-semibold text-xs flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Düzgün (+1)
                          </Badge>
                        ) : (
                          <Badge className="bg-rose-600 text-white font-semibold text-xs flex items-center gap-1">
                            <XCircle className="w-3.5 h-3.5" />
                            Səhv (0)
                          </Badge>
                        )}
                      </div>
                    </div>

                    {/* Question text */}
                    <div className="text-sm font-medium text-slate-900 dark:text-slate-100">
                      <MathRenderer content={q.question_text} />
                    </div>

                    {/* Georgian translation if available */}
                    {trans?.question_text && trans.question_text !== q.question_text && (
                      <div className="text-xs text-slate-500 dark:text-slate-400 italic bg-white/60 dark:bg-slate-900/40 p-2 rounded-xl border border-slate-100 dark:border-slate-800">
                        🇬🇪 {trans.question_text}
                      </div>
                    )}

                    {/* Candidate Answer */}
                    <div className="space-y-1.5 pt-1 text-xs">
                      <div className="p-2.5 rounded-xl border flex items-start gap-2 bg-white/90 dark:bg-slate-900/90 border-slate-200 dark:border-slate-800">
                        <span className="font-semibold text-slate-500 shrink-0">Namizədin cavabı:</span>
                        <span className={cn('flex-1 font-medium', effectiveIsCorrect ? 'text-emerald-700 dark:text-emerald-300' : 'text-rose-700 dark:text-rose-300')}>
                          {ans?.textAnswer || '— (Cavabsız)'}
                        </span>
                      </div>

                      {/* Correct answer display (if wrong) */}
                      {!effectiveIsCorrect && (
                        <div className="p-2.5 rounded-xl border flex items-start gap-2 bg-emerald-50/70 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800/60 text-emerald-900 dark:text-emerald-200">
                          <span className="font-semibold shrink-0">Düzgün cavab:</span>
                          <span className="flex-1 font-medium">
                            {q.correct_answer}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
