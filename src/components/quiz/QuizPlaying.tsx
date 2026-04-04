import React, { useEffect } from 'react';
import { ArrowLeft, Lightbulb, Info, Bookmark, LayoutGrid, ChevronLeft, ChevronRight, Menu, AlertTriangle } from "lucide-react";
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

import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { QuestionRenderer } from "./QuestionRenderer";
import { VisualTimer } from "./VisualTimer";

import { Quiz } from "@/hooks/useQuizzes";
import { Question } from "@/hooks/useQuestions";
import { QUESTION_TYPES } from "@/types/question";

interface QuizPlayingProps {
  quiz: Quiz;
  currentPage: number;
  totalPages: number;
  pageQuestions: Question[];
  totalTimeLeft: number;
  localAnswers: Record<string, string>;
  setLocalAnswers: (updater: (prev: Record<string, string>) => Record<string, string>) => void;
  showFeedback: boolean;
  showHint: Record<string, boolean>;
  setShowHint: (updater: (prev: Record<string, boolean>) => Record<string, boolean>) => void;
  handlePageSubmit: () => void;
  handleNextPage: () => void;
  handlePrevPage: () => void;
  jumpToPage: (pageIndex: number) => void;
  onExit: () => void;
  feedbackEnabled?: boolean;
  bookmarkedQuestions: Set<string>;
  toggleBookmark: (id: string) => void;
  getPageStatus: (pageIdx: number) => 'current' | 'completed' | 'pending';
}

export const QuizPlaying: React.FC<QuizPlayingProps> = ({
  quiz,
  currentPage,
  totalPages,
  pageQuestions,
  totalTimeLeft,
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
  getPageStatus
}) => {
  const [showConfirm, setShowConfirm] = React.useState(false);
  const [showExitConfirm, setShowExitConfirm] = React.useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const progress = ((currentPage + 1) / totalPages) * 100;
  
  const hasUnanswered = pageQuestions.some(q =>
    q.question_type !== 'essay' && q.question_type !== 'code' && !localAnswers[q.id]
  );

  const onCheckSubmitClick = () => {
    if (hasUnanswered) {
      setShowConfirm(true);
    } else {
      handlePageSubmit();
    }
  };

  // Keyboard Navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement).tagName)) return;

      if (e.key === 'ArrowRight') {
        if (!showFeedback) {
          onCheckSubmitClick();
        } else {
          handleNextPage();
        }
      } else if (e.key === 'ArrowLeft' && quiz.allow_backtracking && currentPage > 0) {
        handlePrevPage();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showFeedback, currentPage, quiz.allow_backtracking, hasUnanswered, localAnswers, pageQuestions]);

  const MapGrid = () => (
    <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-4 gap-2">
      {Array.from({ length: totalPages }).map((_, idx) => {
          const status = getPageStatus(idx);
          const isCurrent = currentPage === idx;
          return (
              <button
                  key={idx}
                  disabled={!quiz.allow_backtracking && idx < currentPage}
                  onClick={() => {
                    jumpToPage(idx);
                    setIsMobileMenuOpen(false);
                  }}
                  className={cn(
                      "h-10 rounded-lg flex items-center justify-center font-medium text-sm transition-all border-2",
                      isCurrent ? "border-primary bg-primary/10 text-primary shadow-sm" : 
                      status === 'completed' ? "border-green-500/50 bg-green-500/10 text-green-700 dark:text-green-400" :
                      "border-transparent bg-muted text-muted-foreground hover:bg-border",
                      (!quiz.allow_backtracking && idx < currentPage) && "opacity-50 cursor-not-allowed hover:bg-muted"
                  )}
              >
                  {idx + 1}
              </button>
          );
      })}
    </div>
  );

  return (
    <div 
      className="flex-1 bg-background relative min-h-screen"
      style={quiz.background_image_url ? {
        backgroundImage: `url(${quiz.background_image_url})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      } : undefined}
    >
      {quiz.background_image_url && <div className="absolute inset-0 bg-background/80 backdrop-blur-[2px]" />}

      <div className="relative z-10 p-3 sm:p-8 pb-32 sm:pb-8 flex flex-col md:flex-row gap-6 max-w-6xl mx-auto h-full">
        
        {/* Main Content Area */}
        <div className="flex-1 max-w-3xl lg:max-w-4xl w-full mx-auto">
            <div className="mb-4 sm:mb-6 flex items-center justify-between">
            <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowExitConfirm(true)}
                className="text-muted-foreground hover:text-foreground -ml-2"
            >
                <ArrowLeft className="mr-1 h-4 w-4" />
                <span className="hidden sm:inline">Çıx</span>
            </Button>

            <div className="flex flex-col items-end gap-1">
                <div className="flex items-center gap-3">
                  {/* Mobile Map Trigger */}
                  {quiz.show_question_nav && (
                   <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                      <SheetTrigger asChild>
                        <Button variant="outline" size="sm" className="lg:hidden h-10 px-3 rounded-xl border-dashed">
                           <Menu className="h-4 w-4 mr-2" />
                           Xəritə
                        </Button>
                      </SheetTrigger>
                      <SheetContent side="bottom" className="rounded-t-3xl max-h-[80vh] overflow-y-auto">
                        <SheetHeader className="mb-4 text-left">
                          <SheetTitle className="flex items-center gap-2">
                            <LayoutGrid className="w-5 h-5 text-primary" />
                            Sual Xəritəsi
                          </SheetTitle>
                        </SheetHeader>
                        <MapGrid />
                      </SheetContent>
                   </Sheet>
                  )}

                  <div className="flex flex-col items-end bg-background/80 backdrop-blur-md px-3 py-1.5 rounded-xl border shadow-sm">
                    <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-tighter">İmtahan Vaxtı</span>
                    <VisualTimer
                        timeLeft={totalTimeLeft}
                        totalTime={(quiz.duration || 20) * 60}
                        size={36}
                    />
                  </div>
                </div>
            </div>
            </div>

            <div className="mb-6 sm:mb-8 bg-background/50 p-4 rounded-2xl border shadow-sm backdrop-blur-sm">
            <div className="mb-2 flex items-center justify-between text-xs sm:text-sm text-foreground">
                <span className="font-medium">
                  Səhifə {currentPage + 1} / {totalPages}
                  {pageQuestions.length > 0 && (
                    <span className="text-muted-foreground ml-1.5">
                      · Sual {currentPage * pageQuestions.length + 1}–{Math.min((currentPage + 1) * pageQuestions.length, pageQuestions.length * totalPages)}
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
                {pageQuestions.map((question, idx) => (
                <div 
                    key={question.id}
                    className="rounded-2xl sm:rounded-3xl bg-card border border-border/50 p-4 sm:p-8 shadow-elevated relative overflow-hidden"
                >
                    <div className="flex justify-between items-start mb-6 gap-4">
                    <h2 className="font-display text-base sm:text-xl md:text-2xl font-bold text-foreground">
                        {question.title && <span className="block text-[10px] sm:text-sm text-primary font-black mb-1 uppercase tracking-widest">{question.title}</span>}
                        <span className="mr-2 text-muted-foreground">{idx + 1}.</span> {question.question_text}
                    </h2>
                    
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
                        <p>{question.hint}</p>
                    </div>
                    )}

                    <div className="flex flex-wrap items-center gap-2 mb-6">
                      <Badge variant="secondary" className="bg-muted/50 text-muted-foreground font-medium border-none px-2.5 py-0.5 text-[10px] sm:text-xs">
                        {QUESTION_TYPES.find(t => t.value === question.question_type)?.label || question.question_type}
                      </Badge>
                      
                      {question.question_type === 'multiple_select' && (
                        <div className="flex items-center gap-1.5 text-primary/80 font-bold text-[10px] sm:text-xs animate-pulse bg-primary/5 px-2 py-0.5 rounded-full border border-primary/10">
                          <Info className="w-3.5 h-3.5" />
                          <span>Bir və ya bir neçə cavab seçə bilərsiniz</span>
                        </div>
                      )}
                    </div>

                    <QuestionRenderer
                    question={question}
                    value={localAnswers[question.id] || ''}
                    onChange={(val) => setLocalAnswers(prev => ({ ...prev, [question.id]: val }))}
                    showFeedback={showFeedback}
                    disabled={showFeedback}
                    feedbackEnabled={feedbackEnabled}
                    />

                    {question.hint && !showFeedback && (
                    <div className="mt-4 flex justify-end">
                        <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowHint(prev => ({ ...prev, [question.id]: !prev[question.id] }))}
                        className={cn(
                            "text-xs transition-all rounded-full px-3",
                            showHint[question.id] && "text-primary bg-primary/10"
                        )}
                        >
                        <Lightbulb className={cn("mr-1.5 h-3 w-3", showHint[question.id] && "text-primary fill-primary")} />
                        İpucu Göstər
                        </Button>
                    </div>
                    )}
                </div>
                ))}
              </motion.div>
            </AnimatePresence>
            </div>

            <div className="fixed bottom-0 left-0 right-0 z-50 md:relative md:z-auto md:mt-10 p-4 md:p-0 bg-background/95 md:bg-transparent backdrop-blur-lg border-t border-border/50 md:border-none shadow-[0_-8px_30px_rgb(0,0,0,0.12)] md:shadow-none">
            <div className="mx-auto flex flex-wrap items-center justify-between gap-3">
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
                    <span className="hidden sm:inline">Əvvəlki</span>
                    </Button>
                )}
                </div>

                {!showFeedback ? (
                <Button
                    variant="game"
                    size="xl"
                    className="flex-1 sm:flex-none sm:min-w-[200px] h-12 shadow-game active:translate-y-1 transition-all rounded-xl"
                    onClick={onCheckSubmitClick}
                >
                    Səhifəni Yoxla
                </Button>
                ) : (
                <Button
                    variant="game"
                    size="xl"
                    className="flex-1 sm:flex-none sm:min-w-[200px] h-12 shadow-game active:translate-y-1 transition-all rounded-xl bg-green-600 hover:bg-green-700 text-white border-green-700"
                    onClick={handleNextPage}
                >
                    <span className="hidden sm:inline">{currentPage === totalPages - 1 ? 'Nəticəyə Bax' : 'Növbəti Səhifə'}</span>
                    <span className="sm:hidden">{currentPage === totalPages - 1 ? 'Bitir' : 'İrəli'}</span>
                    <ChevronRight className="h-5 w-5 ml-1 sm:ml-2" />
                </Button>
                )}
            </div>
            </div>
        </div>

        {/* Desktop Side Navigation Panel */}
        {quiz.show_question_nav && (
            <div className="hidden lg:block w-72 shrink-0">
                <div className="sticky top-8 bg-card/90 backdrop-blur-md border border-border/50 rounded-2xl p-5 shadow-sm">
                    <div className="flex items-center gap-2 mb-4 text-foreground font-semibold border-b pb-3">
                        <LayoutGrid className="w-5 h-5 text-primary" />
                        <h2>Sual Xəritəsi</h2>
                    </div>
                    <MapGrid />
                    <div className="mt-6 space-y-2 text-xs text-muted-foreground">
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded bg-primary/20 border border-primary"></div>
                            Cari Səhifə
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded bg-green-500/20 border border-green-500/50"></div>
                            Tamamlanmış
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded bg-muted"></div>
                            Gözləyən
                        </div>
                    </div>
                </div>
            </div>
        )}

      </div>

      <AlertDialog open={showExitConfirm} onOpenChange={setShowExitConfirm}>
        <AlertDialogContent className="rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-5 w-5" />
              Quizi tərk et?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Quizi tərk etsəniz irəliləyişiniz itiriləcək. Davam etmək istədiyinizə əminsiniz?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-xl">Qal</AlertDialogCancel>
            <AlertDialogAction
              className="rounded-xl bg-destructive hover:bg-destructive/90 text-white"
              onClick={onExit}
            >
              Bəli, Çıx
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

    </div>
  );
};
