import React, { useState, useEffect, useRef, useMemo } from 'react';
import { LayoutGrid, Bookmark, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Question } from '@/hooks/useQuestions';

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
  t: (key: any) => string;
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
  language,
  t,
  maxHeightClass = "max-h-[min(380px,45vh)]",
  className,
}) => {
  const [filter, setFilter] = useState<'all' | 'unanswered' | 'bookmarked'>('all');
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
    let bookmarkedPagesCount = 0;

    const list = Array.from({ length: totalPages }, (_, idx) => {
      const targetSlice = allQuestions ? allQuestions.slice(idx * questionsPerPage, (idx + 1) * questionsPerPage) : [];
      const hasAnswer = targetSlice.length > 0 && targetSlice.some(q => {
        const val = localAnswers[q.id];
        return typeof val === 'string' && val.trim().length > 0;
      });
      const isBookmarked = targetSlice.length > 0 && targetSlice.some(q => bookmarkedQuestions.has(q.id));

      if (hasAnswer) answeredPagesCount++;
      if (isBookmarked) bookmarkedPagesCount++;

      return {
        idx,
        pageNumber: idx + 1,
        hasAnswer,
        isBookmarked,
      };
    });

    const unansweredPagesCount = Math.max(0, totalPages - answeredPagesCount);

    return {
      list,
      answeredCount: answeredPagesCount,
      unansweredCount: unansweredPagesCount,
      bookmarkedCount: bookmarkedPagesCount,
    };
  }, [totalPages, allQuestions, questionsPerPage, localAnswers, bookmarkedQuestions]);

  // Filtered pages
  const displayedPages = useMemo(() => {
    if (filter === 'unanswered') {
      return pageStats.list.filter(p => !p.hasAnswer);
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
            <span>{t('answered')}:</span>
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
      <div className="flex items-center gap-1.5 text-xs">
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
          <span>{language === 'ka' ? 'ყველა' : 'Hamısı'}</span>
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
          <span>{language === 'ka' ? 'უპასუხო' : 'Cavabsız'}</span>
          <span className={cn("font-bold", pageStats.unansweredCount > 0 && "text-amber-600 dark:text-amber-400", filter === 'unanswered' && "text-white")}>
            ({pageStats.unansweredCount})
          </span>
        </button>

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
                {language === 'ka' ? 'ყველა კითხვაზე გაცემულია პასუხი!' : 'Bütün suallar cavablandırılıb! 🎉'}
              </span>
            ) : (
              <span>{language === 'ka' ? 'მონიშნული კითხვები არ არის' : 'Sancıqlanmış sual yoxdur'}</span>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-5 gap-2">
            {displayedPages.map(({ idx, pageNumber, hasAnswer, isBookmarked }) => {
              const isCurrent = idx === currentPage;
              const isDisabled = !allowBacktracking && idx < currentPage;

              let colorClasses = "border-border/60 bg-muted/30 text-muted-foreground hover:bg-muted/70 hover:text-foreground";

              if (isCurrent && hasAnswer) {
                // Current question AND answered: Emerald bg + Blue border & focus ring
                colorClasses = "border-primary bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 ring-2 ring-primary ring-offset-2 ring-offset-background font-black shadow-sm";
              } else if (isCurrent && !hasAnswer) {
                // Current question AND unanswered: Blue bg + Blue border & focus ring
                colorClasses = "border-primary bg-primary/15 text-primary ring-2 ring-primary ring-offset-2 ring-offset-background font-black shadow-sm";
              } else if (hasAnswer) {
                // Answered: Emerald
                colorClasses = "border-emerald-500/60 bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-500/25 font-bold";
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
                  title={`${t('question_count')} ${pageNumber}`}
                >
                  {pageNumber}
                  {isBookmarked && (
                    <span 
                      className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-amber-500 ring-2 ring-background flex items-center justify-center shadow-sm" 
                      title={language === 'ka' ? 'მონიშნული' : 'Sancaq'}
                    />
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Clean Legend */}
      <div className="pt-3 border-t border-border/40 grid grid-cols-2 gap-2 text-xs text-muted-foreground">
        <div className="flex items-center gap-2">
          <div className="w-3.5 h-3.5 rounded-lg bg-primary/20 border-2 border-primary shrink-0"></div>
          <span className="font-medium text-foreground">{t('current')}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3.5 h-3.5 rounded-lg bg-emerald-500/20 border-2 border-emerald-500/60 shrink-0"></div>
          <span className="text-emerald-700 dark:text-emerald-400 font-medium">{t('answered')}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3.5 h-3.5 rounded-lg bg-muted/60 border border-border/60 shrink-0"></div>
          <span>{t('unanswered')}</span>
        </div>
        {allowBookmarks && (
          <div className="flex items-center gap-2">
            <div className="w-3.5 h-3.5 rounded-full bg-amber-500 shrink-0"></div>
            <span>{language === 'ka' ? 'მონიშნული' : 'Sancaq'}</span>
          </div>
        )}
      </div>
    </div>
  );
});

QuestionMap.displayName = 'QuestionMap';
