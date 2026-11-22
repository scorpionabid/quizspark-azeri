import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ErrorNotebookItem } from "@/hooks/useStudentProgress";
import { CheckCircle2, XCircle, Zap, Trophy, ArrowRight, RotateCcw, Brain } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

interface RemedialQuizModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetTopic?: string;
  errorItems: ErrorNotebookItem[];
  onComplete: (score: number, total: number) => void;
  onAskAI: (prompt: string) => void;
}

export function RemedialQuizModal({
  isOpen,
  onClose,
  targetTopic,
  errorItems,
  onComplete,
  onAskAI,
}: RemedialQuizModalProps) {
  // Filter questions based on topic if specified, or pick unresolved errors
  const practiceQuestions = React.useMemo(() => {
    let list = errorItems;
    if (targetTopic) {
      list = errorItems.filter(e => e.topic.toLowerCase() === targetTopic.toLowerCase() || e.subject.toLowerCase() === targetTopic.toLowerCase());
    }
    // If no specific error questions match topic, pick from general errors or generate fallback
    if (list.length === 0) {
      list = errorItems;
    }
    return list.slice(0, 5);
  }, [errorItems, targetTopic]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  const currentQ = practiceQuestions[currentIndex];

  const handleSelectOption = (opt: string) => {
    if (isAnswerSubmitted) return;
    setSelectedOption(opt);
  };

  const handleCheckAnswer = () => {
    if (!selectedOption || !currentQ) return;
    setIsAnswerSubmitted(true);

    const isCorrect = selectedOption.trim().toLowerCase() === currentQ.correctAnswer.trim().toLowerCase();
    if (isCorrect) {
      setCorrectCount(prev => prev + 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentIndex < practiceQuestions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setSelectedOption(null);
      setIsAnswerSubmitted(false);
    } else {
      setIsFinished(true);
      const finalCorrect = selectedOption?.trim().toLowerCase() === currentQ?.correctAnswer.trim().toLowerCase()
        ? correctCount
        : correctCount;
      onComplete(finalCorrect, practiceQuestions.length);
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsAnswerSubmitted(false);
    setCorrectCount(0);
    setIsFinished(false);
  };

  // Safe reset when dialog closes
  const handleDialogChange = (open: boolean) => {
    if (!open) {
      handleRestart();
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleDialogChange}>
      <DialogContent className="max-w-2xl bg-card/95 backdrop-blur-md border-border/70 p-6 shadow-2xl">
        <DialogHeader className="space-y-2 border-b border-border/40 pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-primary/10 text-primary rounded-xl">
                <Zap className="h-5 w-5" />
              </div>
              <DialogTitle className="text-lg font-bold">
                {targetTopic ? `"${targetTopic}" üzrə Bərpa Sınağı` : 'Səhvlərin Təkrarı Sınağı'}
              </DialogTitle>
            </div>
            {!isFinished && practiceQuestions.length > 0 && (
              <Badge variant="outline" className="text-xs font-semibold">
                Sual {currentIndex + 1} / {practiceQuestions.length}
              </Badge>
            )}
          </div>
          <DialogDescription className="text-xs">
            Əvvəllər səhv etdiyiniz sualları yenidən işləyərək biliklərinizi möhkəmləndirin.
          </DialogDescription>
          {!isFinished && practiceQuestions.length > 0 && (
            <Progress value={((currentIndex + 1) / practiceQuestions.length) * 100} className="h-1.5 mt-2" />
          )}
        </DialogHeader>

        {practiceQuestions.length === 0 ? (
          <div className="p-8 text-center space-y-4">
            <CheckCircle2 className="h-12 w-12 text-emerald-500 mx-auto" />
            <h4 className="font-bold text-foreground">Təbrik edirik! Bu mövzuda qeydə alınmış səhviniz yoxdur.</h4>
            <p className="text-xs text-muted-foreground">
              Biliklərinizi yoxlamaq üçün ümumi sınaqlar bölməsindən yeni quiz işləyə bilərsiniz.
            </p>
            <Button onClick={() => handleDialogChange(false)}>Bağla</Button>
          </div>
        ) : isFinished ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="py-8 text-center space-y-6"
          >
            <div className="h-16 w-16 bg-amber-500/15 rounded-full flex items-center justify-center mx-auto text-amber-500 shadow-md">
              <Trophy className="h-8 w-8" />
            </div>

            <div className="space-y-2">
              <h3 className="text-2xl font-black text-foreground">Bərpa Sınağı Tamamlandı!</h3>
              <p className="text-sm text-muted-foreground">
                Nəticəniz: <span className="font-bold text-foreground">{correctCount} / {practiceQuestions.length} düzgün</span> ({Math.round((correctCount / practiceQuestions.length) * 100)}%)
              </p>
              <Badge className="bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 text-xs px-3 py-1">
                +{correctCount * 50} Comeback XP qazanıldı! 🚀
              </Badge>
            </div>

            <div className="flex items-center justify-center gap-3 pt-4">
              <Button variant="outline" className="gap-2" onClick={handleRestart}>
                <RotateCcw className="h-4 w-4" />
                Yenidən Cəhd Et
              </Button>
              <Button onClick={() => handleDialogChange(false)}>
                Tamamla və Çıx
              </Button>
            </div>
          </motion.div>
        ) : (
          <div className="space-y-6 py-4">
            {/* Question Text */}
            <div className="space-y-2">
              <span className="text-xs font-semibold text-primary uppercase tracking-wider">
                {currentQ.subject} • {currentQ.topic}
              </span>
              <h3 className="text-base font-semibold text-foreground leading-relaxed">
                {currentQ.questionText}
              </h3>
            </div>

            {/* Options */}
            <div className="space-y-2.5">
              {(currentQ.options.length > 0
                ? currentQ.options
                : [currentQ.correctAnswer, currentQ.studentAnswer].filter(Boolean)
              ).map((opt, idx) => {
                const isSelected = selectedOption === opt;
                const isCorrect = opt.trim().toLowerCase() === currentQ.correctAnswer.trim().toLowerCase();

                let btnStyle = "border-border/60 hover:border-primary/40 bg-card/60";
                if (isAnswerSubmitted) {
                  if (isCorrect) {
                    btnStyle = "border-emerald-500 bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-semibold";
                  } else if (isSelected && !isCorrect) {
                    btnStyle = "border-destructive bg-destructive/15 text-destructive font-semibold";
                  }
                } else if (isSelected) {
                  btnStyle = "border-primary bg-primary/10 text-primary font-semibold";
                }

                return (
                  <button
                    key={idx}
                    onClick={() => handleSelectOption(opt)}
                    disabled={isAnswerSubmitted}
                    className={`w-full p-4 rounded-xl border text-left text-sm transition-all flex items-center justify-between gap-3 ${btnStyle}`}
                  >
                    <span>{opt}</span>
                    {isAnswerSubmitted && isCorrect && <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />}
                    {isAnswerSubmitted && isSelected && !isCorrect && <XCircle className="h-4 w-4 text-destructive shrink-0" />}
                  </button>
                );
              })}
            </div>

            {/* Explanation when submitted */}
            {isAnswerSubmitted && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 rounded-2xl bg-muted/50 border border-border/50 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-foreground">İzahat:</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 text-xs text-primary gap-1 px-2"
                    onClick={() => {
                      handleDialogChange(false);
                      onAskAI(`Bu sualın izahını mənə daha detallı ver: "${currentQ.questionText}". Düzgün cavab "${currentQ.correctAnswer}"dır.`);
                    }}
                  >
                    <Brain className="h-3 w-3" />
                    AI ilə müzakirə et
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {currentQ.explanation || 'Bu sual üçün əlavə qeyd mövcud deyil.'}
                </p>
              </motion.div>
            )}

            {/* Footer Action */}
            <div className="pt-4 border-t border-border/40 flex items-center justify-end gap-3">
              {!isAnswerSubmitted ? (
                <Button
                  onClick={handleCheckAnswer}
                  disabled={!selectedOption}
                  className="shadow-md shadow-primary/20"
                >
                  Cavabı Yoxla
                </Button>
              ) : (
                <Button
                  onClick={handleNextQuestion}
                  className="gap-2 shadow-md shadow-primary/20"
                >
                  <span>{currentIndex < practiceQuestions.length - 1 ? 'Növbəti Sual' : 'Nəticəyə Bax'}</span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
