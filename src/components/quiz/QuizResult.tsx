import React from 'react';
import { Trophy, Star, RotateCcw, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface QuizResultProps {
  score: number;
  correctAnswers: number;
  totalQuestions: number;
  earnedXP: number;
  passThreshold: number;
  onRetry: () => void;
  onHome: () => void;
}

export const QuizResult: React.FC<QuizResultProps> = ({
  score,
  correctAnswers,
  totalQuestions,
  earnedXP,
  passThreshold,
  onRetry,
  onHome,
}) => {
  const hasPassed = score >= passThreshold;

  return (
    <div className="flex-1 bg-gradient-hero p-4 sm:p-8 pb-32 sm:pb-8">
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

          <div className="mb-8 grid grid-cols-3 gap-4">
            <div className="rounded-xl bg-success/10 p-4">
              <div className="text-2xl font-bold text-success">{correctAnswers}</div>
              <div className="text-xs text-muted-foreground">Düzgün</div>
            </div>
            <div className="rounded-xl bg-destructive/10 p-4">
              <div className="text-2xl font-bold text-destructive">{totalQuestions - correctAnswers}</div>
              <div className="text-xs text-muted-foreground">Yanlış</div>
            </div>
            <div className="rounded-xl bg-muted/50 p-4">
              <div className="text-2xl font-bold text-foreground">{totalQuestions}</div>
              <div className="text-xs text-muted-foreground">Ümumi</div>
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
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
      </div>
    </div>
  );
};
