import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MathRenderer } from '@/components/common/MathRenderer';
import { useQuestions } from '@/hooks/useQuestions';
import { useLanguage } from '@/contexts/LanguageContext';
import { Check, X, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface AnswerRecord {
  questionId: string;
  textAnswer?: string;
  isCorrect?: boolean;
  pointsEarned?: number;
}

interface CandidateReviewModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  quizId: string;
  answers: AnswerRecord[];
  candidateName: string;
  fin: string;
  specialtyTitle: string;
  score: number;
  completedAt: string;
}

export const CandidateReviewModal: React.FC<CandidateReviewModalProps> = ({
  open,
  onOpenChange,
  quizId,
  answers = [],
  candidateName,
  fin,
  specialtyTitle,
  score,
}) => {
  const { language, t } = useLanguage();
  const { data: questions = [], isLoading } = useQuestions(quizId, { language, enabled: open });
  const [filter, setFilter] = useState<'all' | 'correct' | 'wrong' | 'unanswered'>('all');

  const answersMap = new Map<string, AnswerRecord>();
  answers.forEach((ans) => {
    if (ans.questionId) {
      answersMap.set(ans.questionId, ans);
    }
  });

  const correctCount = questions.filter((q) => {
    const a = answersMap.get(q.id);
    return a?.isCorrect === true;
  }).length;

  const wrongCount = questions.filter((q) => {
    const a = answersMap.get(q.id);
    return a && a.textAnswer && a.isCorrect === false;
  }).length;

  const unansweredCount = questions.filter((q) => {
    const a = answersMap.get(q.id);
    return !a || !a.textAnswer || a.textAnswer.trim().length === 0;
  }).length;

  const filteredQuestions = questions.filter((q) => {
    const a = answersMap.get(q.id);
    const isAnsCorrect = a?.isCorrect === true;
    const isUnanswered = !a || !a.textAnswer || a.textAnswer.trim().length === 0;

    if (filter === 'correct') return isAnsCorrect;
    if (filter === 'wrong') return !isAnsCorrect && !isUnanswered;
    if (filter === 'unanswered') return isUnanswered;
    return true;
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl w-[95vw] max-h-[90vh] flex flex-col p-0 overflow-hidden rounded-2xl border-slate-200 dark:border-slate-800">
        <DialogHeader className="p-5 pb-3 border-b border-slate-100 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/80">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <DialogTitle className="text-lg font-bold flex items-center gap-2 text-slate-900 dark:text-white">
                <FileText className="w-5 h-5 text-blue-600" />
                {t('candidate_review_title')}
              </DialogTitle>
              <DialogDescription className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {candidateName} ({fin}) — {specialtyTitle}
              </DialogDescription>
            </div>
            <Badge className="bg-blue-600 text-white font-bold text-sm px-3 py-1 shrink-0 self-start sm:self-auto">
              {score}% ({correctCount} / {questions.length} {t('correct_count')})
            </Badge>
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center gap-1.5 pt-3 overflow-x-auto no-scrollbar">
            <Button
              size="sm"
              variant={filter === 'all' ? 'default' : 'outline'}
              className="h-7 text-xs font-semibold rounded-lg px-2.5"
              onClick={() => setFilter('all')}
            >
              {t('all_filter')} ({questions.length})
            </Button>
            <Button
              size="sm"
              variant={filter === 'correct' ? 'default' : 'outline'}
              className={cn(
                "h-7 text-xs font-semibold rounded-lg px-2.5",
                filter === 'correct' ? "bg-emerald-600 hover:bg-emerald-700" : "text-emerald-600 border-emerald-200 dark:border-emerald-800"
              )}
              onClick={() => setFilter('correct')}
            >
              <Check className="w-3.5 h-3.5 mr-1" />
              {t('correct_filter')} ({correctCount})
            </Button>
            <Button
              size="sm"
              variant={filter === 'wrong' ? 'default' : 'outline'}
              className={cn(
                "h-7 text-xs font-semibold rounded-lg px-2.5",
                filter === 'wrong' ? "bg-rose-600 hover:bg-rose-700" : "text-rose-600 border-rose-200 dark:border-rose-800"
              )}
              onClick={() => setFilter('wrong')}
            >
              <X className="w-3.5 h-3.5 mr-1" />
              {t('wrong_filter')} ({wrongCount})
            </Button>
            {unansweredCount > 0 && (
              <Button
                size="sm"
                variant={filter === 'unanswered' ? 'default' : 'outline'}
                className="h-7 text-xs font-semibold rounded-lg px-2.5 text-slate-500"
                onClick={() => setFilter('unanswered')}
              >
                {t('unanswered_filter')} ({unansweredCount})
              </Button>
            )}
          </div>
        </DialogHeader>

        {/* Question List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 max-h-[60vh]">
          {isLoading ? (
            <div className="py-12 flex flex-col items-center justify-center text-slate-500 gap-2">
              <span className="h-6 w-6 rounded-full border-2 border-blue-600 border-t-transparent animate-spin" />
              <span className="text-xs">{t('checking_btn')}</span>
            </div>
          ) : filteredQuestions.length === 0 ? (
            <div className="py-12 text-center text-xs text-slate-500">
              {t('no_questions_in_category')}
            </div>
          ) : (
            filteredQuestions.map((q) => {
              const originalIdx = questions.findIndex((item) => item.id === q.id);
              const ans = answersMap.get(q.id);
              const isCorrect = ans?.isCorrect === true;
              const hasAnswered = Boolean(ans && ans.textAnswer && ans.textAnswer.trim().length > 0);

              return (
                <div
                  key={q.id}
                  className={cn(
                    "rounded-xl border p-4 text-xs transition-all",
                    isCorrect
                      ? "border-emerald-200 dark:border-emerald-900/60 bg-emerald-50/40 dark:bg-emerald-950/20"
                      : hasAnswered
                      ? "border-rose-200 dark:border-rose-900/60 bg-rose-50/40 dark:bg-rose-950/20"
                      : "border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40"
                  )}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={cn(
                        "w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold",
                        isCorrect
                          ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300"
                          : hasAnswered
                          ? "bg-rose-100 text-rose-700 dark:bg-rose-900/50 dark:text-rose-300"
                          : "bg-slate-200 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
                      )}
                    >
                      {isCorrect ? (
                        <Check className="w-3.5 h-3.5" />
                      ) : hasAnswered ? (
                        <X className="w-3.5 h-3.5" />
                      ) : (
                        "—"
                      )}
                    </div>

                    <div className="flex-1 min-w-0 space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-bold text-slate-800 dark:text-slate-200">
                          {t('question_count')} {originalIdx + 1}
                        </span>
                        <Badge
                          variant="outline"
                          className={cn(
                            "text-[10px] px-2 py-0 font-bold",
                            isCorrect
                              ? "text-emerald-700 border-emerald-300 dark:text-emerald-400 dark:border-emerald-800"
                              : "text-rose-700 border-rose-300 dark:text-rose-400 dark:border-rose-800"
                          )}
                        >
                          {isCorrect ? '+1' : '0'}
                        </Badge>
                      </div>

                      <div className="text-slate-900 dark:text-slate-100 font-medium leading-relaxed">
                        <MathRenderer text={q.question_text} />
                      </div>

                      {/* Level B: Candidate's Chosen Answer */}
                      <div className="pt-2 border-t border-slate-200/60 dark:border-slate-800 space-y-1.5">
                        <div className="flex items-start gap-1.5">
                          <span className="text-slate-500 font-semibold shrink-0">
                            {t('your_answer')}
                          </span>
                          <span
                            className={cn(
                              "font-semibold leading-relaxed",
                              isCorrect
                                ? "text-emerald-700 dark:text-emerald-400"
                                : hasAnswered
                                ? "text-rose-700 dark:text-rose-400"
                                : "text-slate-400 italic"
                            )}
                          >
                            {hasAnswered ? (
                              <MathRenderer text={ans?.textAnswer || ''} />
                            ) : (
                              t('not_answered_label')
                            )}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        <DialogFooter className="p-3 px-5 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex justify-between items-center sm:justify-between">
          <span className="text-[11px] text-slate-400">
            {t('official_exam_result_sheet')}
          </span>
          <Button
            size="sm"
            variant="outline"
            className="rounded-xl h-8 px-4 text-xs font-semibold"
            onClick={() => onOpenChange(false)}
          >
            {t('close_btn')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
