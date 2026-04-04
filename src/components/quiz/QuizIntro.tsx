import React, { useState } from 'react';
import { ArrowLeft, Trophy, RotateCcw, CheckCircle, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { QuizRating } from "./QuizRating";
import { QuizComments } from "./QuizComments";
import { FavoriteButton } from "./FavoriteButton";

import { Quiz } from "@/hooks/useQuizzes";
import { Question } from "@/hooks/useQuestions";

import { User } from "@supabase/supabase-js";
import { QuizAttempt } from "@/hooks/useQuizAttempts";

interface QuizIntroProps {
  quiz: Quiz;
  questions: Question[];
  myAttempts: QuizAttempt[];
  user: User | null;
  onStart: () => void;
  onResume?: (attempt: QuizAttempt) => void;
  onBack: () => void;
  isPending: boolean;
  isPreview: boolean;
}

export const QuizIntro: React.FC<QuizIntroProps> = ({
  quiz,
  questions,
  myAttempts,
  user,
  onStart,
  onResume,
  onBack,
  isPending,
  isPreview,
}) => {
  const [passwordInput, setPasswordInput] = useState('');
  const [passwordError, setPasswordError] = useState(false);

  const handleStart = () => {
    if (quiz.access_password?.trim()) {
      if (passwordInput.trim().toLowerCase() !== quiz.access_password.trim().toLowerCase()) {
        setPasswordError(true);
        return;
      }
    }
    setPasswordError(false);
    onStart();
  };

  const handleResume = (attempt: QuizAttempt) => {
    if (quiz.access_password?.trim()) {
      if (passwordInput.trim().toLowerCase() !== quiz.access_password.trim().toLowerCase()) {
        setPasswordError(true);
        return;
      }
    }
    setPasswordError(false);
    onResume?.(attempt);
  };

  // M3.3: Tamamlanmamış aktiv cəhdi tap
  const incompleteAttempt = !isPreview ? myAttempts.find(a => !a.completed_at) : undefined;
  const now = new Date();
  const fromStr = quiz.available_from?.trim();
  const toStr = quiz.available_to?.trim();
  const from = fromStr ? new Date(fromStr) : null;
  const to = toStr ? new Date(toStr) : null;

  const isDisabled = (from && !isNaN(from.getTime()) && now < from) ||
                     (to && !isNaN(to.getTime()) && now > to);

  return (
    <div className="min-h-screen bg-gradient-hero p-4 sm:p-8">
      <div className="mx-auto max-w-2xl">
        <Button
          variant="ghost"
          onClick={onBack}
          className="mb-8 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Geri
        </Button>

        <div className="animate-scale-in rounded-3xl bg-gradient-card border border-border/50 p-8 shadow-elevated">
          <div className="mb-6 text-center">
            <div className="mb-4 flex items-center justify-center gap-3">
              <div className="inline-flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/20 text-4xl">
                📝
              </div>
              <FavoriteButton quizId={quiz.id} variant="button" />
            </div>
            <h1 className="mb-2 font-display text-3xl font-bold text-foreground">{quiz.title}</h1>
            <p className="text-muted-foreground">{quiz.description}</p>
          </div>

          <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
            <div className="rounded-xl bg-muted/50 p-4 text-center">
              <div className="text-2xl font-bold text-primary">{questions.length}</div>
              <div className="text-xs text-muted-foreground">Sual</div>
            </div>
            <div className="rounded-xl bg-muted/50 p-4 text-center">
              <div className="text-2xl font-bold text-secondary">{quiz.duration}</div>
              <div className="text-xs text-muted-foreground">Dəqiqə</div>
            </div>
            <div className="rounded-xl bg-muted/50 p-4 text-center">
              <Badge variant={quiz.difficulty || "medium"} className="mb-1">
                {quiz.difficulty === 'easy' ? 'Asan' : quiz.difficulty === 'medium' ? 'Orta' : 'Çətin'}
              </Badge>
              <div className="text-xs text-muted-foreground">Çətinlik</div>
            </div>
            <div className="rounded-xl bg-muted/50 p-4 text-center">
              <div className="mb-1">
                <QuizRating quizId={quiz.id} showTotal={false} size="sm" interactive={false} />
              </div>
              <div className="text-xs text-muted-foreground">Reytinq</div>
            </div>
          </div>

          {(quiz.pass_percentage || quiz.attempts_limit) && (
            <div className="mb-6 flex flex-wrap gap-3 justify-center">
              {quiz.pass_percentage && (
                <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary/10 border border-primary/20 text-sm font-semibold text-primary">
                  <Trophy className="h-4 w-4" />
                  Keçid balı: {quiz.pass_percentage}%
                </div>
              )}
              {quiz.attempts_limit && quiz.attempts_limit > 0 && user && (
                <div className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-semibold",
                  (() => {
                    const used = (myAttempts || []).filter(a => a.completed_at !== null).length;
                    const remaining = quiz.attempts_limit! - used;
                    return remaining > 0
                      ? "bg-muted/50 border-border/40 text-muted-foreground"
                      : "bg-destructive/10 border-destructive/30 text-destructive";
                  })()
                )}>
                  <RotateCcw className="h-4 w-4" />
                  {(() => {
                    const used = (myAttempts || []).filter(a => a.completed_at !== null).length;
                    const remaining = quiz.attempts_limit! - used;
                    return remaining > 0
                      ? `Qalan cəhd: ${remaining}/${quiz.attempts_limit}`
                      : 'Cəhd limiti dolub';
                  })()}
                </div>
              )}
            </div>
          )}

          {(!fromStr && !toStr) ? (
            <div className="mb-6 rounded-xl bg-success/10 p-4 border border-success/30 text-center">
              <p className="text-success font-bold flex items-center justify-center gap-2">
                <CheckCircle className="h-4 w-4" /> Hər zaman əlçatandır
              </p>
            </div>
          ) : (
            <>
              {from && now < from && (
                <div className="mb-6 rounded-xl bg-warning/10 p-4 border border-warning/30 text-center">
                  <p className="text-warning font-bold">Bu quiz hələ aktiv deyil</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Açılış vaxtı: {from.toLocaleString('az-AZ')}
                  </p>
                </div>
              )}
              {to && now > to && (
                <div className="mb-6 rounded-xl bg-destructive/10 p-4 border border-destructive/30 text-center">
                  <p className="text-destructive font-bold">Bu quiz-in müddəti bitib</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Bağlanış vaxtı: {to.toLocaleString('az-AZ')}
                  </p>
                </div>
              )}
            </>
          )}

          {(isPreview || !user) ? (
            <div className="text-center">
              <p className="mb-4 text-muted-foreground">Bu quizi başlamaq üçün daxil olmalısınız.</p>
              <div className="flex gap-2 justify-center">
                <Button variant="outline" onClick={onBack}>
                  Ana Səhifəyə Qayıt
                </Button>
                {!user && (
                  <Button variant="game" onClick={() => (window.location.href = '/auth')}>
                    Daxil Ol
                  </Button>
                )}
              </div>
            </div>
          ) : questions.length === 0 ? (
            <div className="text-center">
              <p className="mb-4 text-muted-foreground">Bu quizdə hələ sual yoxdur.</p>
              <Button variant="outline" onClick={onBack}>
                Ana Səhifəyə Qayıt
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {/* Access password input */}
              {quiz.access_password?.trim() && (
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-semibold text-foreground">
                    <Lock className="h-4 w-4 text-muted-foreground" />
                    Giriş şifrəsi
                  </label>
                  <Input
                    type="password"
                    placeholder="Şifrəni daxil edin..."
                    value={passwordInput}
                    onChange={e => { setPasswordInput(e.target.value); setPasswordError(false); }}
                    className={cn(
                      "rounded-xl",
                      passwordError && "border-destructive focus-visible:ring-destructive"
                    )}
                    onKeyDown={e => { if (e.key === 'Enter') handleStart(); }}
                  />
                  {passwordError && (
                    <p className="text-xs text-destructive font-medium">Şifrə yanlışdır. Yenidən cəhd edin.</p>
                  )}
                </div>
              )}

              {/* M3.3: Yarımçıq cəhd varsa "Davam Et" düyməsi */}
              {incompleteAttempt && onResume && !isDisabled && (
                <div className="rounded-xl bg-warning/10 border border-warning/30 p-4 text-center space-y-2">
                  <p className="text-sm font-semibold text-warning">
                    Tamamlanmamış cəhdiniz var
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {new Array(incompleteAttempt.answers).length > 0
                      ? `${(incompleteAttempt.answers as unknown[]).length} suala cavab verilmişdir`
                      : 'Başlanmış, lakin cavab verilməmişdir'}
                  </p>
                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full border-warning/50 text-warning hover:bg-warning/10"
                    onClick={() => handleResume(incompleteAttempt)}
                    disabled={isPending}
                  >
                    <RotateCcw className="mr-2 h-4 w-4" />
                    Davam Et
                  </Button>
                </div>
              )}
              <Button
                variant="game"
                size="xl"
                className="w-full"
                onClick={handleStart}
                disabled={isPending || isDisabled}
              >
                {isPending ? "Yüklənir..." : (isDisabled ? "Giriş qapalıdır" : incompleteAttempt ? "Yenidən Başla" : "Quizə Başla")}
              </Button>
            </div>
          )}
        </div>

        <div className="mt-6 animate-scale-in rounded-2xl bg-gradient-card border border-border/50 p-6 shadow-elevated">
          <h3 className="mb-4 font-semibold text-foreground">Bu quizi qiymətləndirin</h3>
          <QuizRating quizId={quiz.id} size="lg" />
        </div>

        <div className="mt-6 animate-scale-in rounded-2xl bg-gradient-card border border-border/50 p-6 shadow-elevated">
          <QuizComments quizId={quiz.id} />
        </div>
      </div>
    </div>
  );
};
