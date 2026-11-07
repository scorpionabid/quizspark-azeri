import React, { useEffect, useRef } from 'react';
import { ArrowLeft, Lightbulb, Info, Bookmark, LayoutGrid, ChevronLeft, ChevronRight, Menu, AlertTriangle, Maximize, Minimize, MessageSquarePlus, Wifi, WifiOff, CheckCircle2, XCircle, RefreshCw, Wrench } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import { QuestionMap } from "./QuestionMap";
import { ExamToolsPanel } from "./tools/ExamToolsPanel";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { QuestionRenderer } from "./QuestionRenderer";
import { VisualTimer } from "./VisualTimer";
import { QuestionFeedbackDialog } from "./QuestionFeedbackDialog";
import { QuestionTimerBar } from "./QuestionTimerBar";
import { parseNumberedItems, isSequenceQuestion } from "./renderers/utils";

import { Quiz } from "@/hooks/useQuizzes";
import { Question } from "@/hooks/useQuestions";
import { QUESTION_TYPES } from "@/types/question";
import { MathRenderer } from "@/components/common/MathRenderer";
import { getQuizBackgroundStyle, isPatternBackground } from "@/lib/constants/quizBackground";
import { useLanguage } from "@/contexts/LanguageContext";
import { LanguageSwitcher } from "@/components/common/LanguageSwitcher";

export type PageNavStatus = 'current' | 'correct' | 'incorrect' | 'completed' | 'pending';

interface QuizPlayingProps {
  quiz: Quiz;
  currentPage: number;
  totalPages: number;
  pageQuestions: Question[];
  allQuestions?: Question[];
  totalQuestions: number;
  totalTimeLeft: number;
  questionTimeLeft?: number | null;
  localAnswers: Record<string, string>;
  setLocalAnswers: (updater: (prev: Record<string, string>) => Record<string, string>) => void;
  showFeedback: boolean;
  showHint: Record<string, boolean>;
  setShowHint: (updater: (prev: Record<string, boolean>) => Record<string, boolean>) => void;
  handlePageSubmit: (overrideAnswers?: Record<string, string>) => void;
  handleNextPage: () => void;
  handlePrevPage: () => void;
  jumpToPage: (pageIndex: number) => void;
  onExit: () => void;
  feedbackEnabled?: boolean;
  bookmarkedQuestions: Set<string>;
  toggleBookmark: (id: string) => void;
  getPageStatus: (pageIdx: number) => PageNavStatus;
  isOnline?: boolean;
  isSyncing?: boolean;
  onFinalSubmit?: () => void;
}

export const QuizPlaying: React.FC<QuizPlayingProps> = ({
  quiz,
  currentPage,
  totalPages,
  pageQuestions,
  allQuestions,
  totalQuestions,
  totalTimeLeft,
  questionTimeLeft,
  localAnswers,
  setLocalAnswers,
  showFeedback,
  showHint,
  setShowHint,
  handlePageSubmit,
  handleNextPage,
  handlePrevPage,
  jumpToPage,
  onExit,
  feedbackEnabled = true,
  bookmarkedQuestions,
  toggleBookmark,
  getPageStatus,
  isOnline = true,
  isSyncing = false,
  onFinalSubmit,
  }) => {
  const { language, t } = useLanguage();
  const [showConfirm, setShowConfirm] = React.useState(false);
  const [showExitConfirm, setShowExitConfirm] = React.useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [isRightPanelOpen, setIsRightPanelOpen] = React.useState(false);
  
  const [attemptedSubmit, setAttemptedSubmit] = React.useState(false);
  const [isFullscreen, setIsFullscreen] = React.useState(false);
  const [feedbackQuestion, setFeedbackQuestion] = React.useState<{ question: Question; index: number } | null>(null);
  const questionRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const isInstantFeedback = quiz.feedback_timing === 'instant' && quiz.exam_category !== 'official_exam';

  useEffect(() => {
    const onFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", onFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", onFullscreenChange);
  }, []);

  const toggleFullscreen = async () => {
    if (!document.fullscreenElement) {
      await document.documentElement.requestFullscreen().catch(err => console.error(err));
    } else {
      if (document.exitFullscreen) {
        await document.exitFullscreen();
      }
    }
  };

  const answeredCount = Object.keys(localAnswers).filter(k => localAnswers[k]?.trim()?.length > 0).length;
  const progress = totalQuestions > 0 ? (answeredCount / totalQuestions) * 100 : 0;

  // Auto-scroll to top when page changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);
  
  const hasUnanswered = pageQuestions.some(q =>
    q.question_type !== 'essay' && q.question_type !== 'code' && !localAnswers[q.id]
  );

  const onCheckSubmitClick = React.useCallback(() => {
    if (isInstantFeedback && hasUnanswered) {
      setAttemptedSubmit(true);
      setShowConfirm(true);
      // Auto-scroll to first unanswered question
      const firstUnanswered = pageQuestions.find(q => q.question_type !== 'essay' && q.question_type !== 'code' && !localAnswers[q.id]);
      if (firstUnanswered && questionRefs.current[firstUnanswered.id]) {
        setTimeout(() => {
          questionRefs.current[firstUnanswered.id]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 100);
      }
    } else {
      setAttemptedSubmit(false);
      handlePageSubmit();
    }
  }, [isInstantFeedback, hasUnanswered, handlePageSubmit, pageQuestions, localAnswers]);

  const [showFinalSubmitModal, setShowFinalSubmitModal] = React.useState(false);

  const unansweredCount = Math.max(0, totalQuestions - answeredCount);
  const unansweredIndices = React.useMemo(() => {
    if (!allQuestions || allQuestions.length === 0) return [];
    const list: number[] = [];
    allQuestions.forEach((q, idx) => {
      if (!localAnswers[q.id] || localAnswers[q.id].trim() === '') {
        list.push(idx);
      }
    });
    return list;
  }, [allQuestions, localAnswers]);

  // Keyboard Navigation & Option Selection
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName) ||
          target.closest('[data-exam-tools="true"]'))
      ) {
        return;
      }

      // Option selection with 1-5 or A-E
      if (pageQuestions.length === 1) {
        const q = pageQuestions[0];
        const opts = q.options || [];
        const key = e.key.toUpperCase();
        let optIdx = -1;

        if (['1', '2', '3', '4', '5'].includes(e.key)) {
          optIdx = parseInt(e.key, 10) - 1;
        } else if (['A', 'B', 'C', 'D', 'E'].includes(key)) {
          optIdx = key.charCodeAt(0) - 65;
        }

        if (optIdx >= 0 && optIdx < opts.length && !showFeedback) {
          e.preventDefault();
          const selectedOpt = opts[optIdx];
          setLocalAnswers(prev => ({ ...prev, [q.id]: selectedOpt }));
          return;
        }

        // Bookmark shortcut 'B'
        if (key === 'B' && quiz.allow_bookmarks) {
          e.preventDefault();
          toggleBookmark(q.id);
          return;
        }
      }

      if (e.key === 'ArrowRight') {
        if (!showFeedback) {
          if (currentPage === totalPages - 1) {
            setShowFinalSubmitModal(true);
          } else {
            onCheckSubmitClick();
          }
        } else {
          handleNextPage();
        }
      } else if (e.key === 'ArrowLeft' && quiz.allow_backtracking && currentPage > 0) {
        handlePrevPage();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showFeedback, currentPage, totalPages, quiz.allow_backtracking, quiz.allow_bookmarks, hasUnanswered, localAnswers, pageQuestions, onCheckSubmitClick, handleNextPage, handlePrevPage, setLocalAnswers, toggleBookmark]);



  const isTimeless = !quiz.duration || quiz.duration === 0;
  const totalTime = isTimeless ? 0 : quiz.duration * 60;
  const isTimerDanger = !isTimeless && totalTimeLeft > 0 && totalTimeLeft <= totalTime * 0.2;

  const isPattern = isPatternBackground(quiz.background_image_url);
  const bgStyle = getQuizBackgroundStyle(quiz.background_image_url);

  return (
    <div 
      className="flex-1 bg-background relative min-h-screen transition-colors"
      style={bgStyle}
    >
      {quiz.background_image_url && !isPattern && (
        <div className="absolute inset-0 bg-background/60 backdrop-blur-[1px] pointer-events-none" />
      )}

      <div className={cn(
        "relative p-3 sm:p-8 pt-3 sm:pt-6 pb-36 sm:pb-12 flex flex-col lg:flex-row gap-6 mx-auto h-full transition-all duration-300",
        isRightPanelOpen ? "max-w-7xl" : "max-w-5xl"
      )}>
        
        {/* Main Content Area */}
        <div className={cn(
          "flex-1 w-full mx-auto transition-all duration-300",
          isRightPanelOpen ? "max-w-3xl lg:max-w-4xl" : "max-w-4xl lg:max-w-5xl"
        )}>
            <div className="mb-4 sm:mb-6 flex items-center justify-between relative z-[50]">
            <div className="flex items-center gap-2">
              <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowExitConfirm(true)}
                  className="text-muted-foreground hover:text-foreground -ml-2"
              >
                  <ArrowLeft className="mr-1 h-4 w-4" />
                  <span className="hidden sm:inline">{t('exit')}</span>
              </Button>

              {/* Network & Sync Status */}
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl border bg-background/80 backdrop-blur-md text-[11px] font-medium shadow-sm">
                {!isOnline ? (
                  <span className="flex items-center gap-1 text-destructive font-bold">
                    <WifiOff className="w-3.5 h-3.5" />
                    <span>{t('offline_status')}</span>
                  </span>
                ) : isSyncing ? (
                  <span className="flex items-center gap-1 text-amber-500 font-medium">
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>{t('syncing_status')}</span>
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span>{t('synced_status')}</span>
                  </span>
                )}
              </div>
            </div>

            <div className="flex flex-col items-end gap-1">
                <div className="flex items-center gap-2 md:gap-3">
                  {/* Mobile Map Trigger */}
                  {quiz.show_question_nav && (
                   <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                      <SheetTrigger asChild>
                        <Button variant="outline" size="sm" className="lg:hidden h-10 px-3 rounded-xl border-dashed">
                           <Menu className="h-4 w-4 mr-2" />
                           {t('map')}
                        </Button>
                      </SheetTrigger>
                      <SheetContent side="bottom" className="rounded-t-3xl max-h-[88vh] p-5 flex flex-col overflow-y-auto">
                        <SheetHeader className="mb-3 text-left">
                          <SheetTitle className="flex items-center gap-2">
                            <LayoutGrid className="w-5 h-5 text-primary" />
                            {t('question_map')}
                          </SheetTitle>
                        </SheetHeader>
                        <QuestionMap
                          totalPages={totalPages}
                          currentPage={currentPage}
                          allQuestions={allQuestions}
                          questionsPerPage={quiz.questions_per_page || 1}
                          localAnswers={localAnswers}
                          bookmarkedQuestions={bookmarkedQuestions}
                          allowBacktracking={quiz.allow_backtracking}
                          allowBookmarks={quiz.allow_bookmarks}
                          isInstantFeedback={isInstantFeedback}
                          jumpToPage={jumpToPage}
                          onSelectQuestion={() => setIsMobileMenuOpen(false)}
                          language={language}
                          t={t}
                          maxHeightClass="max-h-[40vh]"
                        />
                        <div className="mt-4">
                          <ExamToolsPanel
                            enableCalculator={quiz.enable_calculator ?? true}
                            enablePeriodicTable={quiz.enable_periodic_table ?? true}
                            enableScratchpad={quiz.enable_scratchpad ?? true}
                            currentPage={currentPage}
                          />
                        </div>
                      </SheetContent>
                   </Sheet>
                  )}

                   <LanguageSwitcher className="hidden sm:inline-flex" />

                   {quiz.show_question_nav && (
                     <Button
                       variant={isRightPanelOpen ? "secondary" : "outline"}
                       size="sm"
                       onClick={() => setIsRightPanelOpen(prev => !prev)}
                       className="hidden lg:inline-flex items-center gap-1.5 h-10 px-3 shrink-0 rounded-xl border-dashed bg-background/50 backdrop-blur-md hover:bg-accent transition-all"
                       title={isRightPanelOpen ? "Sual xəritəsi və alətləri sağa yığ" : "Sual xəritəsi və alətləri göstər"}
                     >
                       <LayoutGrid className="h-4 w-4 text-primary" />
                       <span className="font-medium text-xs">
                         {isRightPanelOpen ? "Xəritəni Yığ" : t('question_map')}
                       </span>
                       <Badge variant="outline" className="px-1.5 py-0 text-[10px] font-mono h-4 border-primary/30 text-primary">
                         {currentPage + 1}/{totalPages}
                       </Badge>
                     </Button>
                   )}

                   <Button
                     variant="outline"
                     size="icon"
                     onClick={toggleFullscreen}
                     className="hidden sm:flex h-10 w-10 shrink-0 text-muted-foreground hover:text-foreground rounded-xl border-dashed bg-background/50 backdrop-blur-md"
                     title={isFullscreen ? t('minimize') : t('fullscreen')}
                   >
                     {isFullscreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
                   </Button>

                  <div className={cn(
                    "flex flex-col items-end px-3 py-1.5 rounded-xl border shadow-sm transition-all duration-500",
                    isTimerDanger ? "bg-destructive/10 border-destructive/30 animate-pulse ring-1 ring-destructive/20" : "bg-background/80 backdrop-blur-md"
                  )}>
                    <span className={cn("text-[10px] uppercase font-bold tracking-tighter", isTimerDanger ? "text-destructive" : "text-muted-foreground")}>
                        {isTimeless ? t('mode_label') : t('time_left')}
                    </span>
                    {isTimeless ? (
                      <span className="text-xs font-semibold text-primary flex items-center gap-1 py-1">
                        ⏱️ Zamansız
                      </span>
                    ) : (
                      <VisualTimer
                        timeLeft={totalTimeLeft}
                        totalTime={totalTime}
                        size={36}
                      />
                    )}
                  </div>
                </div>
            </div>
            </div>

            <div className="mb-6 sm:mb-8 bg-background/50 p-4 rounded-2xl border shadow-sm backdrop-blur-sm">
            <div className="mb-2 flex items-center justify-between text-xs sm:text-sm text-foreground">
                <span className="font-medium">
                  {`${t('page_indicator')} ${currentPage + 1} / ${totalPages}`}
                  {pageQuestions.length > 0 && (
                    <span className="text-muted-foreground ml-1.5">
                      · {t('question_count')} {quiz.questions_per_page! * currentPage + 1}–{Math.min((currentPage + 1) * quiz.questions_per_page!, totalQuestions)}
                    </span>
                  )}
                </span>
                <span className="font-bold text-primary">{Math.round(progress)}%</span>
            </div>
            <div className="h-1.5 sm:h-2 w-full overflow-hidden rounded-full bg-muted/50 border border-border/30">
                <motion.div
                className="h-full bg-gradient-to-r from-primary via-accent to-secondary"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ type: "spring", stiffness: 50 }}
                />
            </div>
            </div>

            <div className="space-y-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentPage} // triggers animation on page change
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                {pageQuestions.map((question, idx) => {
                  const isUnanswered = attemptedSubmit && question.question_type !== 'essay' && question.question_type !== 'code' && !localAnswers[question.id];
                  
                  return (
                <div 
                    key={question.id}
                    ref={el => questionRefs.current[question.id] = el}
                    className={cn(
                      "rounded-2xl sm:rounded-3xl border p-4 sm:p-8 relative overflow-hidden transition-all duration-300",
                      quiz.background_image_url
                        ? isPattern
                          ? "bg-card/95 backdrop-blur-md border-border/80 shadow-elevated"
                          : "bg-card/90 backdrop-blur-md border-border/70 shadow-elevated"
                        : "bg-card border-border/50 shadow-elevated",
                      isUnanswered && "border-destructive/60 bg-destructive/5 shadow-[0_0_15px_-3px_rgba(239,68,68,0.2)]"
                    )}
                >
                    {question.time_limit && questionTimeLeft != null && (
                      <div className="mb-4 pb-3 border-b border-border/50">
                        <QuestionTimerBar timeLeft={questionTimeLeft} totalTime={question.time_limit} />
                      </div>
                    )}

                    {(() => {
                      const parsedNumbered = question.question_type === 'numerical' ? parseNumberedItems(question.question_text) : null;
                      const isSeq = parsedNumbered ? isSequenceQuestion(question.question_text) : false;
                      const displayText = parsedNumbered ? parsedNumbered.header : question.question_text;

                      return (
                        <>
                          <div className="flex justify-between items-start mb-6 gap-4">
                            <div className="font-display text-base sm:text-xl md:text-2xl font-medium text-foreground whitespace-pre-line leading-relaxed flex-1">
                              {question.title && <span className="block text-[10px] sm:text-sm text-primary font-black mb-1 uppercase tracking-widest"><MathRenderer text={question.title} /></span>}
                              <span className="mr-2 text-muted-foreground">{quiz.questions_per_page! * currentPage + idx + 1}.</span>
                              <MathRenderer text={displayText} />
                            </div>
                            
                            <div className="flex flex-col items-end gap-2 shrink-0">
                              {quiz.allow_bookmarks && (
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => toggleBookmark(question.id)}
                                  className={cn("h-8 w-8 rounded-full", bookmarkedQuestions.has(question.id) ? "text-yellow-500 bg-yellow-500/10 hover:bg-yellow-500/20" : "text-muted-foreground")}
                                  title="Sualı Sancaqla"
                                >
                                  <Bookmark className={cn("h-4 w-4", bookmarkedQuestions.has(question.id) && "fill-current")} />
                                </Button>
                              )}
                              <Badge variant="outline" className="whitespace-nowrap font-mono text-[10px] sm:text-xs">
                                {question.weight ?? 1.0} Xal
                              </Badge>
                            </div>
                          </div>

                          {showHint[question.id] && question.hint && (
                            <div className="mb-6 p-4 bg-primary/5 border border-primary/20 rounded-xl text-sm text-muted-foreground flex items-start gap-3 animate-slide-in">
                              <Info className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                              <div><MathRenderer text={question.hint} /></div>
                            </div>
                          )}

                          <div className="flex flex-wrap items-center gap-2 mb-6">
                            <Badge variant="secondary" className="bg-muted/50 text-muted-foreground font-medium border-none px-2.5 py-0.5 text-[10px] sm:text-xs">
                              {parsedNumbered ? (isSeq ? 'Ardıcıllıq' : 'Çoxbəndli seçim') : (QUESTION_TYPES.find(t => t.value === question.question_type)?.label || question.question_type)}
                            </Badge>
                            
                            {question.question_type === 'multiple_select' && (
                              <div className="flex items-center gap-1.5 text-primary/80 font-bold text-[10px] sm:text-xs animate-pulse bg-primary/5 px-2 py-0.5 rounded-full border border-primary/10">
                                <Info className="w-3.5 h-3.5" />
                                <span>Bir və ya bir neçə cavab seçə bilərsiniz</span>
                              </div>
                            )}

                            {parsedNumbered && (
                              <div className="flex items-center gap-1.5 text-primary/90 font-bold text-[10px] sm:text-xs bg-primary/10 px-2.5 py-0.5 rounded-full border border-primary/20">
                                <Info className="w-3.5 h-3.5 text-primary" />
                                <span>{isSeq ? 'Bəndləri düzgün ardıcıllıqla klikləyin' : 'Doğru olan bütün bəndləri işarələyin'}</span>
                              </div>
                            )}
                          </div>
                        </>
                      );
                    })()}

                    <QuestionRenderer
                      question={question}
                      value={localAnswers[question.id] || ''}
                      onChange={(val) => {
                        setLocalAnswers(prev => ({ ...prev, [question.id]: val }));
                        if (isInstantFeedback && !showFeedback && (question.question_type === 'multiple_choice' || question.question_type === 'true_false')) {
                          handlePageSubmit({ ...localAnswers, [question.id]: val });
                        }
                      }}
                      showFeedback={showFeedback}
                      disabled={showFeedback}
                      feedbackEnabled={feedbackEnabled}
                    />

                    {quiz.exam_category !== 'official_exam' && (
                      <div className="mt-4 flex items-center justify-between gap-2 pt-2 border-t border-border/40">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setFeedbackQuestion({
                            question,
                            index: quiz.questions_per_page! * currentPage + idx,
                          })}
                          className="text-xs text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-full px-3 h-8"
                          title="Bu suala rəy yaz və ya xəta bildir"
                        >
                          <MessageSquarePlus className="mr-1.5 h-3.5 w-3.5" />
                          <span>Rəy / Xəta Bildir</span>
                        </Button>

                        {question.hint && !showFeedback && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setShowHint(prev => ({ ...prev, [question.id]: !prev[question.id] }))}
                            className={cn(
                              "text-xs transition-all rounded-full px-3 h-8",
                              showHint[question.id] && "text-primary bg-primary/10"
                            )}
                          >
                            <Lightbulb className={cn("mr-1.5 h-3.5 w-3.5", showHint[question.id] && "text-primary fill-primary")} />
                            İpucu Göstər
                          </Button>
                        )}
                      </div>
                    )}
                </div>
                );
                })}
              </motion.div>
            </AnimatePresence>
            </div>

            <div className="fixed bottom-0 left-0 right-0 z-50 md:relative md:z-auto md:mt-10 p-3 sm:p-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] md:pb-0 bg-background/95 md:bg-transparent backdrop-blur-lg border-t border-border/50 md:border-none shadow-[0_-8px_30px_rgb(0,0,0,0.12)] md:shadow-none">
            <div className="mx-auto flex flex-wrap items-center justify-between gap-2.5 sm:gap-3">
                <div className="flex gap-2">
                {quiz.allow_backtracking && (
                    <Button
                    variant="outline"
                    size="lg"
                    className="h-12 w-12 sm:w-auto px-0 sm:px-6 rounded-xl shrink-0"
                    onClick={handlePrevPage}
                    disabled={currentPage === 0}
                    >
                    <ChevronLeft className="h-5 w-5 sm:mr-2" />
                    <span className="hidden sm:inline">{t('prev_question')}</span>
                    </Button>
                )}
                </div>

                {!isInstantFeedback ? (
                <Button
                    variant="game"
                    size="xl"
                    className={cn(
                        "flex-1 sm:flex-none sm:min-w-[200px] h-12 shadow-game active:translate-y-1 transition-all rounded-xl",
                        currentPage === totalPages - 1 && "bg-emerald-600 hover:bg-emerald-700 text-white border-emerald-700"
                    )}
                    onClick={() => {
                      if (currentPage === totalPages - 1) {
                        setShowFinalSubmitModal(true);
                      } else {
                        onCheckSubmitClick();
                      }
                    }}
                >
                    <span className="hidden sm:inline">{currentPage === totalPages - 1 ? t('finish_exam') : t('next_question')}</span>
                    <span className="sm:hidden">{currentPage === totalPages - 1 ? t('finish_short') : t('next_short')}</span>
                    <ChevronRight className="h-5 w-5 ml-1 sm:ml-2" />
                </Button>
                ) : !showFeedback ? (
                <Button
                    variant="game"
                    size="xl"
                    className="flex-1 sm:flex-none sm:min-w-[200px] h-12 shadow-game active:translate-y-1 transition-all rounded-xl"
                    onClick={onCheckSubmitClick}
                >
                    {t('check_page')}
                </Button>
                ) : (
                <Button
                    variant="game"
                    size="xl"
                    className="flex-1 sm:flex-none sm:min-w-[200px] h-12 shadow-game active:translate-y-1 transition-all rounded-xl bg-green-600 hover:bg-green-700 text-white border-green-700"
                    onClick={handleNextPage}
                >
                    <span className="hidden sm:inline">{currentPage === totalPages - 1 ? t('view_result') : t('next_question')}</span>
                    <span className="sm:hidden">{currentPage === totalPages - 1 ? t('finish_short') : t('next_short')}</span>
                    <ChevronRight className="h-5 w-5 ml-1 sm:ml-2" />
                </Button>
                )}
            </div>
            </div>
        </div>

        {/* Desktop Side Navigation Panel */}
        {quiz.show_question_nav && (
          <>
            {/* Collapsed Right Floating Tab on Screen Edge */}
            {!isRightPanelOpen && (
              <button
                type="button"
                onClick={() => setIsRightPanelOpen(true)}
                className="hidden lg:flex fixed right-0 top-32 z-40 bg-card/95 hover:bg-card border border-r-0 border-border/80 shadow-elevated rounded-l-2xl py-3.5 px-2 flex-col items-center gap-2 group transition-all hover:pr-3 cursor-pointer text-foreground backdrop-blur-md animate-in fade-in slide-in-from-right duration-200"
                title="Sual Xəritəsi və Köməkçi Alətləri Aç"
              >
                <div className="flex items-center text-primary group-hover:scale-110 transition-transform">
                  <ChevronLeft className="w-4 h-4" />
                  <LayoutGrid className="w-4 h-4 -ml-1" />
                </div>
                <Wrench className="w-3.5 h-3.5 text-muted-foreground group-hover:text-foreground transition-colors" />
                <span className="text-[10px] font-bold text-muted-foreground [writing-mode:vertical-rl] tracking-wider uppercase mt-1">
                  Xəritə & Alətlər
                </span>
                <span className="text-[10px] font-bold text-primary font-mono bg-primary/10 px-1.5 py-0.5 rounded-md mt-1 border border-primary/20">
                  {currentPage + 1}/{totalPages}
                </span>
              </button>
            )}

            {/* Expanded Right Side Navigation Panel */}
            {isRightPanelOpen && (
              <div className="hidden lg:block w-80 shrink-0 relative z-[50] pointer-events-auto animate-in fade-in slide-in-from-right duration-300">
                <div className="sticky top-6 space-y-3.5 max-h-[calc(100vh-3rem)] overflow-y-auto pr-0.5">
                  <div className="bg-card/90 backdrop-blur-md border border-border/50 rounded-2xl p-4 shadow-sm">
                    <div className="flex items-center justify-between gap-2 mb-3 text-foreground font-semibold border-b pb-2.5">
                      <div className="flex items-center gap-2">
                        <LayoutGrid className="w-5 h-5 text-primary" />
                        <h2>{t('question_map')}</h2>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setIsRightPanelOpen(false)}
                        className="h-8 px-2 text-xs text-muted-foreground hover:text-foreground hover:bg-muted/60 rounded-xl"
                        title="Paneli sağa yığ (Geniş görünüş)"
                      >
                        <span>Sağa yığ</span>
                        <ChevronRight className="w-4 h-4 ml-1" />
                      </Button>
                    </div>
                    <QuestionMap
                      totalPages={totalPages}
                      currentPage={currentPage}
                      allQuestions={allQuestions}
                      questionsPerPage={quiz.questions_per_page || 1}
                      localAnswers={localAnswers}
                      bookmarkedQuestions={bookmarkedQuestions}
                      allowBacktracking={quiz.allow_backtracking}
                      allowBookmarks={quiz.allow_bookmarks}
                      isInstantFeedback={isInstantFeedback}
                      jumpToPage={jumpToPage}
                      language={language}
                      t={t}
                      maxHeightClass="max-h-[min(300px,35vh)]"
                    />

                    {!isInstantFeedback && (
                      <div className="mt-4 pt-3 border-t border-border/40">
                        <Button
                          type="button"
                          className="w-full h-11 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold border-none shadow-md shadow-emerald-600/20"
                          onClick={() => setShowFinalSubmitModal(true)}
                        >
                          <CheckCircle2 className="w-4 h-4 mr-2" />
                          {t('finish_exam')}
                        </Button>
                      </div>
                    )}
                  </div>

                  {/* Collapsible Helper Tools (Calculator, Mendeleev Table, Auto-Resetting Scratchpad) */}
                  <ExamToolsPanel
                    enableCalculator={quiz.enable_calculator ?? true}
                    enablePeriodicTable={quiz.enable_periodic_table ?? true}
                    enableScratchpad={quiz.enable_scratchpad ?? true}
                    currentPage={currentPage}
                  />
                </div>
              </div>
            )}
          </>
        )}

      </div>

      <AlertDialog open={showExitConfirm} onOpenChange={setShowExitConfirm}>
        <AlertDialogContent className="rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-5 w-5" />
              {t('exit_confirm_title')}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {t('exit_confirm_desc')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-xl">{t('exit_confirm_stay')}</AlertDialogCancel>
            <AlertDialogAction
              className="rounded-xl bg-destructive hover:bg-destructive/90 text-white"
              onClick={onExit}
            >
              {t('exit_confirm_leave')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={showConfirm} onOpenChange={setShowConfirm}>
        <AlertDialogContent className="rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-amber-500">
              <AlertTriangle className="h-5 w-5" />
              Diqqət!
            </AlertDialogTitle>
            <AlertDialogDescription>
              Bu səhifədə hələ cavablandırmadığınız suallar var. Boş saxlamaq istədiyinizə əminsiniz?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-xl">Geri Qayıt</AlertDialogCancel>
            <AlertDialogAction 
              className="rounded-xl bg-amber-500 hover:bg-amber-600 text-white"
              onClick={() => {
                setShowConfirm(false);
                handlePageSubmit();
              }}
            >
              Bəli, Davam Et
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={showFinalSubmitModal} onOpenChange={setShowFinalSubmitModal}>
        <AlertDialogContent className="rounded-3xl max-w-lg">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2.5 text-xl font-bold">
              <CheckCircle2 className="h-6 w-6 text-emerald-600" />
              {t('finish_confirm_title')}
            </AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div className="space-y-4 pt-2 text-foreground">
                <p className="text-sm text-muted-foreground">
                  {t('finish_confirm_desc')}
                </p>

                <div className="grid grid-cols-2 gap-3 p-4 rounded-2xl bg-muted/40 border">
                  <div className="flex flex-col items-center justify-center p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-center">
                    <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400">{answeredCount}</span>
                    <span className="text-xs font-medium text-emerald-700 dark:text-emerald-300">{t('answered')}</span>
                  </div>
                  <div className="flex flex-col items-center justify-center p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-center">
                    <span className="text-2xl font-black text-amber-600 dark:text-amber-400">{unansweredCount}</span>
                    <span className="text-xs font-medium text-amber-700 dark:text-amber-300">{t('unanswered')}</span>
                  </div>
                </div>

                {unansweredIndices.length > 0 ? (
                  <div className="space-y-2">
                    <span className="text-xs font-semibold text-destructive flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      {t('unanswered_questions_warning')}
                    </span>
                    <div className="flex flex-wrap gap-1.5 max-h-28 overflow-y-auto p-2 rounded-xl bg-destructive/5 border border-destructive/20">
                      {unansweredIndices.map(idx => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => {
                            setShowFinalSubmitModal(false);
                            jumpToPage(idx);
                          }}
                          className="px-2.5 py-1 text-xs font-bold rounded-lg bg-background border border-destructive/40 text-destructive hover:bg-destructive hover:text-white transition-colors"
                          title={`${t('question_count')} ${idx + 1}`}
                        >
                          {t('question_count')} {idx + 1}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-300 text-xs font-medium flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>
                      {t('all_answered_msg')}
                    </span>
                  </div>
                )}
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-4 gap-2">
            <AlertDialogCancel className="rounded-xl h-11">
              {t('return_to_exam')}
            </AlertDialogCancel>
            <AlertDialogAction
              className="rounded-xl h-11 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6 shadow-md shadow-emerald-600/20"
              onClick={() => {
                setShowFinalSubmitModal(false);
                if (onFinalSubmit) {
                  onFinalSubmit();
                } else {
                  handlePageSubmit();
                }
              }}
            >
              {t('confirm_finish')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {feedbackQuestion && (
        <QuestionFeedbackDialog
          open={!!feedbackQuestion}
          onOpenChange={(open) => !open && setFeedbackQuestion(null)}
          questionId={feedbackQuestion.question.id}
          questionBankId={feedbackQuestion.question.bank_question_id || undefined}
          questionIndex={feedbackQuestion.index}
          questionTitle={feedbackQuestion.question.title}
          questionText={feedbackQuestion.question.question_text}
        />
      )}

    </div>
  );
};
