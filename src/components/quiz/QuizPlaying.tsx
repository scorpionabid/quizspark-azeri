import React from 'react';
import { ArrowLeft, Lightbulb, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { QuestionRenderer } from "./QuestionRenderer";
import { VisualTimer } from "./VisualTimer";

import { Quiz } from "@/hooks/useQuizzes";
import { Question } from "@/hooks/useQuestions";

import { User } from "@supabase/supabase-js";

interface QuizPlayingProps {
  quiz: Quiz;
  currentQuestion: number;
  totalQuestions: number;
  question: Question;
  timeLeft: number;
  totalTimeLeft: number;
  localAnswer: string;
  setLocalAnswer: (val: string) => void;
  showFeedback: boolean;
  showHint: boolean;
  setShowHint: (val: boolean) => void;
  handleAnswer: (val: string | null) => void;
  handleNext: () => void;
  onExit: () => void;
  feedbackEnabled?: boolean;
}

export const QuizPlaying: React.FC<QuizPlayingProps> = ({
  quiz,
  currentQuestion,
  totalQuestions,
  question,
  timeLeft,
  totalTimeLeft,
  localAnswer,
  setLocalAnswer,
  showFeedback,
  showHint,
  setShowHint,
  handleAnswer,
  handleNext,
  onExit,
  feedbackEnabled = true,
}) => {
  const progress = ((currentQuestion + 1) / totalQuestions) * 100;

  return (
    <div className="flex-1 bg-gradient-hero p-3 sm:p-8 pb-32 sm:pb-8">
      <div className="mx-auto max-w-3xl">
        <div className="mb-4 sm:mb-6 flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={onExit}
            className="text-muted-foreground hover:text-foreground -ml-2"
          >
            <ArrowLeft className="mr-1 h-4 w-4" />
            <span className="hidden sm:inline">Çıx</span>
          </Button>

          <div className="flex flex-col items-end gap-1">
            {question.time_limit ? (
              <div className="flex flex-col items-end">
                <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-tighter">Sual Vaxtı</span>
                <VisualTimer
                  timeLeft={timeLeft}
                  totalTime={question.time_limit}
                  size={36}
                />
              </div>
            ) : null}
            <div className="flex flex-col items-end">
              <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-tighter">Ümumi Vaxt</span>
              <VisualTimer
                timeLeft={totalTimeLeft}
                totalTime={(quiz.duration || 20) * 60}
                size={36}
              />
            </div>
          </div>
        </div>

        <div className="mb-6 sm:mb-8">
          <div className="mb-2 flex items-center justify-between text-xs sm:text-sm text-muted-foreground">
            <span>Sual {currentQuestion + 1} / {totalQuestions}</span>
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

        <div className="animate-slide-up rounded-2xl sm:rounded-3xl bg-gradient-card border border-border/50 p-4 sm:p-8 shadow-elevated">
          <div className="flex justify-between items-start mb-6">
            <h2 className="font-display text-base sm:text-2xl font-bold text-foreground">
              {question.title && <span className="block text-[10px] sm:text-sm text-primary font-black mb-1 uppercase tracking-widest">{question.title}</span>}
              {question.question_text}
            </h2>
            <div className="flex flex-col items-end gap-2 ml-4">
              <Badge variant="outline" className="whitespace-nowrap font-mono text-[10px] sm:text-xs">
                {question.weight ?? 1.0} Xal
              </Badge>
            </div>
          </div>

          {showHint && question.hint && (
            <div className="mb-6 p-4 bg-primary/5 border border-primary/20 rounded-xl text-sm text-muted-foreground flex items-start gap-3 animate-slide-in">
              <Info className="w-4 h-4 text-primary shrink-0 mt-0.5" />
              <p>{question.hint}</p>
            </div>
          )}

          <QuestionRenderer
            question={question}
            value={localAnswer}
            onChange={setLocalAnswer}
            showFeedback={showFeedback}
            disabled={showFeedback}
            feedbackEnabled={feedbackEnabled}
          />
        </div>

        <div className="fixed bottom-0 left-0 right-0 z-50 sm:relative sm:z-auto sm:mt-10 p-4 sm:p-0 bg-background/80 sm:bg-transparent backdrop-blur-lg sm:backdrop-blur-none border-t border-border/50 sm:border-none shadow-[0_-8px_30px_rgb(0,0,0,0.12)] sm:shadow-none animate-in slide-in-from-bottom duration-500">
          <div className="mx-auto max-w-3xl flex items-center justify-between gap-3">
            {question.hint && !showFeedback && (
              <Button
                variant="outline"
                size="lg"
                onClick={() => setShowHint(!showHint)}
                className={cn(
                  "flex-1 sm:flex-none sm:min-w-[120px] transition-all rounded-xl",
                  showHint && "border-primary bg-primary/5"
                )}
              >
                <Lightbulb className={cn("mr-2 h-4 w-4", showHint && "text-primary fill-primary")} />
                İpucu
              </Button>
            )}

            {!showFeedback ? (
              <Button
                variant="game"
                size="xl"
                className="flex-1 sm:flex-none sm:min-w-[200px] h-12 sm:h-auto shadow-game active:translate-y-1 transition-all rounded-xl"
                onClick={() => handleAnswer(localAnswer)}
                disabled={!localAnswer && question.question_type !== 'essay'}
              >
                Yoxla
              </Button>
            ) : (
              <Button
                variant="game"
                size="xl"
                className="flex-1 sm:flex-none sm:min-w-[200px] h-12 sm:h-auto shadow-game active:translate-y-1 transition-all rounded-xl"
                onClick={handleNext}
              >
                Növbəti
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
