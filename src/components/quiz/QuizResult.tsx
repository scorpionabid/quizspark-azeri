import React, { useEffect, useRef } from 'react';
import { Trophy, Star, RotateCcw, Home, Clock, ChevronDown, ChevronUp, Check, X, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { QuestionAnswer, QUESTION_TYPES } from "@/types/question";
import { Question } from "@/hooks/useQuestions";

interface QuizResultProps {
  score: number;
  correctAnswers: number;
  totalQuestions: number;
  earnedXP: number;
  passThreshold: number;
  pendingReviews?: number;
  earnedPoints?: number;
  maxPoints?: number;
  timeSpent?: number;
  answers?: QuestionAnswer[];
  questions?: Question[];
  onRetry: () => void;
  onHome: () => void;
}

function formatTime(seconds: number): string {
  if (seconds <= 0) return '—';
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return m > 0 ? `${m}d ${s}s` : `${s}s`;
}

const ConfettiCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const pieces = Array.from({ length: 120 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * -canvas.height,
      w: Math.random() * 10 + 5,
      h: Math.random() * 6 + 3,
      color: ['#f59e0b', '#10b981', '#3b82f6', '#ec4899', '#8b5cf6'][Math.floor(Math.random() * 5)],
      speed: Math.random() * 3 + 1.5,
      angle: Math.random() * 360,
      spin: (Math.random() - 0.5) * 4,
    }));

    let raf: number;
    let elapsed = 0;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      elapsed++;
      pieces.forEach(p => {
        p.y += p.speed;
        p.angle += p.spin;
        if (p.y > canvas.height) { p.y = -20; p.x = Math.random() * canvas.width; }
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.angle * Math.PI) / 180);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = elapsed > 120 ? Math.max(0, 1 - (elapsed - 120) / 60) : 1;
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        ctx.restore();
      });
      if (elapsed < 180) raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-50"
    />
  );
};

export const QuizResult: React.FC<QuizResultProps> = ({
  score,
  correctAnswers,
  totalQuestions,
  earnedXP,
  passThreshold,
  pendingReviews = 0,
  earnedPoints,
  maxPoints,
  timeSpent = 0,
  answers = [],
  questions = [],
  onRetry,
  onHome,
}) => {
  const showWeighted = earnedPoints !== undefined && maxPoints !== undefined && maxPoints !== totalQuestions;
  const hasPassed = score >= passThreshold;
  const [reviewOpen, setReviewOpen] = React.useState(false);

  return (
    <div className="flex-1 bg-gradient-hero p-4 sm:p-8 pb-32 sm:pb-8">
      {hasPassed && <ConfettiCanvas />}

      <div className="mx-auto max-w-2xl">
        <div className="animate-scale-in rounded-3xl bg-gradient-card border border-border/50 p-8 shadow-elevated text-center">
          <div className="relative mx-auto mb-6 inline-block">
            <div className={cn(
              "flex h-24 w-24 items-center justify-center rounded-full",
              hasPassed ? "bg-success/20" : score >= 40 ? "bg-warning/20" : "bg-destructive/20"
            )}>
              <Trophy className={cn(
                "h-12 w-12",
                hasPassed ? "text-success" : score >= 40 ? "text-warning" : "text-destructive"
              )} />
            </div>
            {hasPassed && (
              <div className="absolute -right-2 -top-2 text-3xl animate-float">🎉</div>
            )}
          </div>

          <h1 className="mb-1 font-display text-3xl font-bold text-foreground">
            {hasPassed ? 'Əla Nəticə!' : score >= 40 ? 'Yaxşı Cəhd!' : 'Davam Et!'}
          </h1>

          <div className="mb-4 flex justify-center">
            <Badge variant={hasPassed ? 'success' : 'destructive'} className="text-sm px-4 py-1">
              {hasPassed ? '✓ Keçdiniz' : `✗ Keçid balı: ${passThreshold}%`}
            </Badge>
          </div>

          <p className="mb-8 text-muted-foreground">
            {hasPassed ? 'Möhtəşəm! Sən bu mövzunu çox yaxşı bilirsən.' :
              score >= 40 ? 'Yaxşı iş! Bir az daha təcrübə ilə daha yaxşı olacaq.' :
                'Narahat olma, hər uğursuzluq öyrənmək üçün bir şansdır.'}
          </p>

          <div className="flex flex-col items-center justify-center gap-6 mb-8">
            <div className="mx-auto flex h-40 w-40 flex-col items-center justify-center rounded-full border-4 border-primary bg-primary/10 shadow-glow">
              <div className="text-5xl font-black text-primary">{score}%</div>
              <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Nəticə</div>
            </div>
            {showWeighted && (
              <div className="text-xs text-muted-foreground font-medium">
                <span className="text-foreground font-bold">{earnedPoints}</span>
                <span> / {maxPoints} bal (ağırlıqlı)</span>
              </div>
            )}

            {earnedXP > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-gradient-to-r from-yellow-400/20 to-orange-500/20 border border-yellow-400/30 text-orange-600 dark:text-orange-400 font-black text-lg shadow-sm"
              >
                <Star className="w-5 h-5 fill-current animate-pulse" />
                <span>+{earnedXP} XP</span>
              </motion.div>
            )}
          </div>

          <div className="mb-8 flex flex-wrap justify-center gap-3">
            <div className="rounded-xl bg-success/10 p-4 min-w-[80px] flex-1 text-center">
              <div className="text-2xl font-bold text-success">{correctAnswers}</div>
              <div className="text-xs text-muted-foreground">Düzgün</div>
            </div>
            <div className="rounded-xl bg-destructive/10 p-4 min-w-[80px] flex-1 text-center">
              <div className="text-2xl font-bold text-destructive">{totalQuestions - correctAnswers - pendingReviews}</div>
              <div className="text-xs text-muted-foreground">Yanlış</div>
            </div>
            {pendingReviews > 0 && (
              <div className="rounded-xl bg-muted/50 border border-muted-foreground/20 p-4 min-w-[80px] flex-1 text-center">
                <div className="text-2xl font-bold text-muted-foreground">{pendingReviews}</div>
                <div className="text-xs text-muted-foreground">Gözlənilir</div>
              </div>
            )}
            <div className="rounded-xl bg-muted/50 p-4 min-w-[80px] flex-1 text-center">
              <div className="text-2xl font-bold text-foreground">{totalQuestions}</div>
              <div className="text-xs text-muted-foreground">Ümumi</div>
            </div>
            {timeSpent > 0 && (
              <div className="rounded-xl bg-primary/5 border border-primary/10 p-4 min-w-[80px] flex-1 text-center">
                <div className="flex items-center justify-center gap-1 text-xl font-bold text-primary">
                  <Clock className="h-4 w-4" />
                  {formatTime(timeSpent)}
                </div>
                <div className="text-xs text-muted-foreground">Vaxt</div>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-3 sm:flex-row mb-4">
            <Button variant="game" className="flex-1" onClick={onRetry}>
              <RotateCcw className="mr-2 h-4 w-4" />
              Yenidən Başla
            </Button>
            <Button variant="outline" className="flex-1" onClick={onHome}>
              <Home className="mr-2 h-4 w-4" />
              Ana Səhifə
            </Button>
          </div>
        </div>

        {/* Question-by-question review */}
        {questions.length > 0 && answers.length > 0 && (
          <div className="mt-6 animate-scale-in rounded-2xl bg-gradient-card border border-border/50 shadow-elevated overflow-hidden">
            <button
              className="w-full flex items-center justify-between p-5 text-left hover:bg-muted/30 transition-colors"
              onClick={() => setReviewOpen(v => !v)}
            >
              <div className="flex items-center gap-2 font-semibold text-foreground">
                <BookOpen className="h-5 w-5 text-primary" />
                Sual-sual Nəticə Baxışı
              </div>
              {reviewOpen ? <ChevronUp className="h-5 w-5 text-muted-foreground" /> : <ChevronDown className="h-5 w-5 text-muted-foreground" />}
            </button>

            <AnimatePresence>
              {reviewOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="overflow-hidden"
                >
                  <div className="p-4 pt-0 space-y-3">
                    {questions.map((q, idx) => {
                      const ans = answers.find(a => a.questionId === q.id);
                      const isCorrect = ans?.isCorrect ?? false;
                      const needsReview = ans?.needsReview ?? false;
                      const typeLabel = QUESTION_TYPES.find(t => t.value === q.question_type)?.label ?? q.question_type;

                      return (
                        <div
                          key={q.id}
                          className={cn(
                            'rounded-xl border p-4 text-sm',
                            needsReview
                              ? 'border-muted-foreground/20 bg-muted/20'
                              : isCorrect
                                ? 'border-green-500/30 bg-green-50/50 dark:bg-green-900/10'
                                : 'border-red-400/30 bg-red-50/50 dark:bg-red-900/10'
                          )}
                        >
                          <div className="flex items-start gap-3">
                            <div className={cn(
                              'shrink-0 flex items-center justify-center h-6 w-6 rounded-full text-[10px] font-bold mt-0.5',
                              needsReview ? 'bg-muted text-muted-foreground' :
                              isCorrect ? 'bg-green-100 text-green-700 dark:bg-green-900/30' : 'bg-red-100 text-red-700 dark:bg-red-900/30'
                            )}>
                              {needsReview ? '?' : isCorrect ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1 flex-wrap">
                                <span className="font-semibold text-foreground">{idx + 1}.</span>
                                <Badge variant="outline" className="text-[10px] px-1.5 py-0 font-normal">{typeLabel}</Badge>
                                {needsReview && <Badge variant="secondary" className="text-[10px] px-1.5 py-0">Gözlənilir</Badge>}
                              </div>
                              <p className="text-foreground/80 leading-snug line-clamp-2">{q.question_text}</p>
                              {ans && !needsReview && (
                                <div className="mt-2 space-y-1">
                                  <div className="flex gap-1 text-[11px]">
                                    <span className="text-muted-foreground shrink-0">Cavabınız:</span>
                                    <span className={cn('font-medium', isCorrect ? 'text-green-700 dark:text-green-400' : 'text-red-700 dark:text-red-400')}>
                                      {ans.textAnswer || '—'}
                                    </span>
                                  </div>
                                  {!isCorrect && q.correct_answer && (
                                    <div className="flex gap-1 text-[11px]">
                                      <span className="text-muted-foreground shrink-0">Düzgün:</span>
                                      <span className="font-medium text-green-700 dark:text-green-400">{q.correct_answer.split('|')[0]}</span>
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                            <div className="shrink-0 text-[11px] font-bold text-muted-foreground">
                              {ans?.pointsEarned ?? 0}/{q.weight ?? 1}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
};
