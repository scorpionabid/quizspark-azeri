import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Bookmark, CheckCircle2, Check, X, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Question } from '@/hooks/useQuestions';
import { isAnswerCorrect } from '@/components/quiz/renderers/utils';

interface QuestionMapProps {
  totalPages: number;
  currentPage: number;
  allQuestions?: Question[];
  questionsPerPage: number;
  localAnswers: Record<string, string>;
  bookmarkedQuestions: Set<string>;
  allowBacktracking: boolean;
  allowBookmarks: boolean;
  isInstantFeedback: boolean;
  jumpToPage: (pageIndex: number) => void;
  onSelectQuestion?: () => void;
  language: string;
  t: (key: string, fallback?: string) => string;
  maxHeightClass?: string;
  className?: string;
}

export const QuestionMap: React.FC<QuestionMapProps> = React.memo(({
  totalPages,
  currentPage,
  allQuestions,
  questionsPerPage,
  localAnswers,
  bookmarkedQuestions,
  allowBacktracking,
  allowBookmarks,
  isInstantFeedback,
  jumpToPage,
  onSelectQuestion,
  language: _language,
  t,
  maxHeightClass = "max-h-[min(380px,45vh)]",
  className,
}) => {
  const [filter, setFilter] = useState<'all' | 'unanswered' | 'incorrect' | 'correct' | 'bookmarked'>('all');
  const activeBtnRef = useRef<HTMLButtonElement | null>(null);

  // Auto-scroll question map so the active question is always in view
  useEffect(() => {
    if (activeBtnRef.current) {
      activeBtnRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'nearest',
      });
    }
  }, [currentPage]);

  // Compute status for all pages
  const pageStats = useMemo(() => {
    let answeredPagesCount = 0;
    let correctPagesCount = 0;
    let incorrectPagesCount = 0;
    let bookmarkedPagesCount = 0;

    const list = Array.from({ length: totalPages }, (_, idx) => {
      const targetSlice = allQuestions ? allQuestions.slice(idx * questionsPerPage, (idx + 1) * questionsPerPage) : [];
      const hasAnswer = targetSlice.length > 0 && targetSlice.some(q => {
        const val = localAnswers[q.id];
        return typeof val === 'string' && val.trim().length > 0;
      });
      const isBookmarked = targetSlice.length > 0 && targetSlice.some(q => bookmarkedQuestions.has(q.id));

      let isCorrect = false;
      let isIncorrect = false;

      if (hasAnswer && isInstantFeedback && targetSlice.length > 0) {
        const allSliceCorrect = targetSlice.every(q => {
          const val = localAnswers[q.id];
          return typeof val === 'string' && val.trim().length > 0 && isAnswerCorrect(q, val);
        });
        const anySliceIncorrect = targetSlice.some(q => {
          const val = localAnswers[q.id];
          return typeof val === 'string' && val.trim().length > 0 && !isAnswerCorrect(q, val);
        });

        if (allSliceCorrect) {
          isCorrect = true;
          correctPagesCount++;
        } else if (anySliceIncorrect) {
          isIncorrect = true;
          incorrectPagesCount++;
        }
      }

      if (hasAnswer) answeredPagesCount++;
      if (isBookmarked) bookmarkedPagesCount++;

      return {
        idx,
        pageNumber: idx + 1,
        hasAnswer,
        isCorrect,
        isIncorrect,
        isBookmarked,
      };
    });

    const unansweredPagesCount = Math.max(0, totalPages - answeredPagesCount);

    return {
      list,
      answeredCount: answeredPagesCount,
      correctCount: correctPagesCount,
      incorrectCount: incorrectPagesCount,
      unansweredCount: unansweredPagesCount,
      bookmarkedCount: bookmarkedPagesCount,
    };
  }, [totalPages, allQuestions, questionsPerPage, localAnswers, bookmarkedQuestions, isInstantFeedback]);

  // Filtered pages
  const displayedPages = useMemo(() => {
    if (filter === 'unanswered') {
      return pageStats.list.filter(p => !p.hasAnswer);
    }
    if (filter === 'incorrect') {
      return pageStats.list.filter(p => p.isIncorrect);
    }
    if (filter === 'correct') {
      return pageStats.list.filter(p => p.isCorrect);
    }
    if (filter === 'bookmarked') {
      return pageStats.list.filter(p => p.isBookmarked);
    }
    return pageStats.list;
  }, [filter, pageStats.list]);

  const progressPercent = totalPages > 0 ? Math.round((pageStats.answeredCount / totalPages) * 100) : 0;

  return (
    <div className={cn("flex flex-col space-y-3", className)}>
      {/* Mini Progress summary */}
      <div className="space-y-1.5 pb-2 border-b border-border/40">
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold text-foreground flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>{t('answered', 'Cavablandırılıb')}:</span>
            <span className="text-emerald-700 dark:text-emerald-300 font-bold">{pageStats.answeredCount}/{totalPages}</span>
          </span>
          <span className="text-muted-foreground font-mono font-bold text-[11px]">{progressPercent}%</span>
        </div>
        <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
          <div 
            className="h-full bg-emerald-500 rounded-full transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Quick Filter Chips */}
      <div className="flex flex-wrap items-center gap-1.5 text-xs">
        <button
          type="button"
          onClick={() => setFilter('all')}
          className={cn(
            "px-2.5 py-1 rounded-lg font-semibold transition-colors flex items-center gap-1 text-[11px]",
            filter === 'all'
              ? "bg-primary text-primary-foreground shadow-sm"
              : "bg-muted/70 text-muted-foreground hover:bg-muted hover:text-foreground"
          )}
        >
          <span>{t('all_filter', 'Hamısı')}</span>
          <span className="opacity-70">({totalPages})</span>
        </button>

        <button
          type="button"
          onClick={() => setFilter('unanswered')}
          className={cn(
            "px-2.5 py-1 rounded-lg font-semibold transition-colors flex items-center gap-1 text-[11px]",
            filter === 'unanswered'
              ? "bg-amber-600 text-white shadow-sm"
              : "bg-muted/70 text-muted-foreground hover:bg-muted hover:text-foreground"
          )}
        >
          <span>{t('unanswered_filter', 'Boş')}</span>
          <span className={cn("font-bold", pageStats.unansweredCount > 0 && "text-amber-600 dark:text-amber-400", filter === 'unanswered' && "text-white")}>
            ({pageStats.unansweredCount})
          </span>
        </button>

        {isInstantFeedback && (
          <>
            <button
              type="button"
              onClick={() => setFilter('incorrect')}
              className={cn(
                "px-2.5 py-1 rounded-lg font-semibold transition-colors flex items-center gap-1 text-[11px]",
                filter === 'incorrect'
                  ? "bg-rose-600 text-white shadow-sm"
                  : "bg-muted/70 text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <X className="w-3 h-3 text-rose-500" />
              <span>{t('wrong_filter', 'Səhv')}</span>
              <span className={cn("font-bold", pageStats.incorrectCount > 0 && "text-rose-600 dark:text-rose-400", filter === 'incorrect' && "text-white")}>
                ({pageStats.incorrectCount})
              </span>
            </button>

            <button
              type="button"
              onClick={() => setFilter('correct')}
              className={cn(
                "px-2.5 py-1 rounded-lg font-semibold transition-colors flex items-center gap-1 text-[11px]",
                filter === 'correct'
                  ? "bg-emerald-600 text-white shadow-sm"
                  : "bg-muted/70 text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <Check className="w-3 h-3 text-emerald-500" />
              <span>{t('correct_filter', 'Düzgün')}</span>
              <span className={cn("font-bold", pageStats.correctCount > 0 && "text-emerald-600 dark:text-emerald-400", filter === 'correct' && "text-white")}>
                ({pageStats.correctCount})
              </span>
            </button>
          </>
        )}

        {allowBookmarks && (
          <button
            type="button"
            onClick={() => setFilter('bookmarked')}
            className={cn(
              "px-2.5 py-1 rounded-lg font-semibold transition-colors flex items-center gap-1 text-[11px]",
              filter === 'bookmarked'
                ? "bg-amber-500 text-white shadow-sm"
                : "bg-muted/70 text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            <Bookmark className="w-3 h-3" />
            <span>({pageStats.bookmarkedCount})</span>
          </button>
        )}
      </div>

      {/* Grid container with proper scrollbar spacing */}
      <div 
        className={cn(
          "overflow-y-auto pr-2.5 -mr-1 space-y-1 select-none",
          maxHeightClass
        )}
        style={{
          scrollbarWidth: 'thin',
          scrollbarColor: 'hsl(var(--muted-foreground) / 0.3) transparent',
        }}
      >
        {displayedPages.length === 0 ? (
          <div className="py-8 text-center text-xs text-muted-foreground">
            {filter === 'unanswered' ? (
              <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                {t('all_answered_msg', 'Bütün suallar cavablandırılıb! 🎉')}
              </span>
            ) : filter === 'incorrect' ? (
              <span className="text-emerald-600 dark:text-emerald-400 font-medium flex items-center justify-center gap-1">
                <Check className="w-3.5 h-3.5" /> Səhv cavab yoxdur!
              </span>
            ) : (
              <span>{t('no_pinned_msg', 'Sancıqlanmış sual yoxdur')}</span>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-8 gap-2">
            {displayedPages.map(({ idx, pageNumber, hasAnswer, isCorrect, isIncorrect, isBookmarked }) => {
              const isCurrent = idx === currentPage;
              const isDisabled = !allowBacktracking && idx < currentPage;

              let colorClasses = "border-border/60 bg-muted/30 text-muted-foreground hover:bg-muted/70 hover:text-foreground";

              if (isInstantFeedback) {
                if (isCurrent) {
                  if (isCorrect) {
                    colorClasses = "border-primary bg-emerald-500/25 text-emerald-800 dark:text-emerald-300 ring-2 ring-primary ring-offset-2 ring-offset-background font-black shadow-sm";
                  } else if (isIncorrect) {
                    colorClasses = "border-primary bg-rose-500/25 text-rose-800 dark:text-rose-300 ring-2 ring-primary ring-offset-2 ring-offset-background font-black shadow-sm";
                  } else {
                    colorClasses = "border-primary bg-primary/15 text-primary ring-2 ring-primary ring-offset-2 ring-offset-background font-black shadow-sm";
                  }
                } else {
                  if (isCorrect) {
                    colorClasses = "border-emerald-500/70 bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-500/25 font-bold";
                  } else if (isIncorrect) {
                    colorClasses = "border-rose-500/70 bg-rose-500/15 text-rose-700 dark:text-rose-400 hover:bg-rose-500/25 font-bold";
                  }
                }
              } else {
                // Standard / Exam mode
                if (isCurrent && hasAnswer) {
                  colorClasses = "border-primary bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 ring-2 ring-primary ring-offset-2 ring-offset-background font-black shadow-sm";
                } else if (isCurrent && !hasAnswer) {
                  colorClasses = "border-primary bg-primary/15 text-primary ring-2 ring-primary ring-offset-2 ring-offset-background font-black shadow-sm";
                } else if (hasAnswer) {
                  colorClasses = "border-emerald-500/60 bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-500/25 font-bold";
                }
              }

              return (
                <button
                  key={idx}
                  ref={isCurrent ? activeBtnRef : null}
                  type="button"
                  disabled={isDisabled}
                  onClick={() => {
                    jumpToPage(idx);
                    if (onSelectQuestion) {
                      onSelectQuestion();
                    }
                  }}
                  className={cn(
                    "h-10 rounded-xl flex items-center justify-center text-xs sm:text-sm transition-all border-2 relative font-bold",
                    colorClasses,
                    isDisabled && "opacity-40 cursor-not-allowed hover:bg-muted"
                  )}
                  title={`${t('question_count', 'Sual')} ${pageNumber}`}
                >
                  {pageNumber}
                  {isBookmarked && (
                    <span 
                      className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-amber-500 ring-2 ring-background flex items-center justify-center shadow-sm" 
                      title={t('pinned_filter', 'Sancaq')}
                    />
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Clean Legend */}
      <div className="pt-3 border-t border-border/40 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs text-muted-foreground">
        <div className="flex items-center gap-2">
          <div className="w-3.5 h-3.5 rounded-lg bg-primary/20 border-2 border-primary shrink-0"></div>
          <span className="font-medium text-foreground">{t('current', 'Cari')}</span>
        </div>

        {isInstantFeedback ? (
          <>
            <div className="flex items-center gap-2">
              <div className="w-3.5 h-3.5 rounded-lg bg-emerald-500/20 border-2 border-emerald-500/60 shrink-0"></div>
              <span className="text-emerald-700 dark:text-emerald-400 font-medium">{t('correct_filter', 'Düzgün')}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3.5 h-3.5 rounded-lg bg-rose-500/20 border-2 border-rose-500/60 shrink-0"></div>
              <span className="text-rose-700 dark:text-rose-400 font-medium">{t('wrong_filter', 'Səhv')}</span>
            </div>
          </>
        ) : (
          <div className="flex items-center gap-2">
            <div className="w-3.5 h-3.5 rounded-lg bg-emerald-500/20 border-2 border-emerald-500/60 shrink-0"></div>
            <span className="text-emerald-700 dark:text-emerald-400 font-medium">{t('answered', 'Cavablandırılıb')}</span>
          </div>
        )}

        <div className="flex items-center gap-2">
          <div className="w-3.5 h-3.5 rounded-lg bg-muted/60 border border-border/60 shrink-0"></div>
          <span>{t('unanswered', 'Boş')}</span>
        </div>

        {allowBookmarks && (
          <div className="flex items-center gap-2">
            <div className="w-3.5 h-3.5 rounded-full bg-amber-500 shrink-0"></div>
            <span>{t('pinned_filter', 'Sancaq')}</span>
          </div>
        )}
      </div>
    </div>
  );
});

QuestionMap.displayName = 'QuestionMap';
