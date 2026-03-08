import { useState, useEffect, useCallback, useRef } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft, Clock, CheckCircle, XCircle, Trophy, RotateCcw, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useQuiz } from "@/hooks/useQuizzes";
import { useQuestions } from "@/hooks/useQuestions";
import { useStartAttempt, useCompleteAttempt } from "@/hooks/useQuizAttempts";
import { useAuth } from "@/contexts/AuthContext";
import { PageLoader } from "@/components/ui/loading-spinner";
import { EmptyState } from "@/components/ui/empty-state";
import { toast } from "sonner";
import { QuizRating } from "@/components/quiz/QuizRating";
import { QuizComments } from "@/components/quiz/QuizComments";
import { FavoriteButton } from "@/components/quiz/FavoriteButton";
import { QuestionRenderer } from "@/components/quiz/QuestionRenderer";
import { VisualTimer } from "@/components/quiz/VisualTimer";
import { QuestionAnswer, QuestionType } from "@/types/question";
import { Lightbulb, Info, Star } from "lucide-react";
import { useGamification } from "@/hooks/useGamification";
import { motion } from "framer-motion";

type QuizState = 'intro' | 'playing' | 'result';

type Answer = QuestionAnswer;

export default function QuizPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isPreview = searchParams.get('preview') === 'true';
  const { user } = useAuth();

  const { data: quiz, isLoading: quizLoading } = useQuiz(id);
  const { data: questions = [], isLoading: questionsLoading } = useQuestions(id);
  const startAttempt = useStartAttempt();
  const completeAttempt = useCompleteAttempt();

  const [quizState, setQuizState] = useState<QuizState>('intro');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [localAnswer, setLocalAnswer] = useState<string>('');
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [attemptId, setAttemptId] = useState<string | null>(null);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const timeLeftRef = useRef(timeLeft);
  const [showHint, setShowHint] = useState(false);
  const [earnedXP, setEarnedXP] = useState(0);
  const { updateXPAsync } = useGamification();

  const isLoading = quizLoading || questionsLoading;

  const handleAnswer = useCallback(async (val: string | null) => {
    if (showFeedback || questions.length === 0) return;

    const currentQ = questions[currentQuestion];
    if (!currentQ) return;

    const finalVal = val || '';
    let isCorrect = false;

    // Advanced evaluation logic
    if (currentQ.question_type === 'ordering') {
      isCorrect = finalVal === currentQ.correct_answer;
    } else if (currentQ.question_type === 'matching') {
      const studentMatches = finalVal.split('|||').sort();
      const correctMatches = currentQ.correct_answer.split('|||').sort();
      isCorrect = JSON.stringify(studentMatches) === JSON.stringify(correctMatches);
    } else {
      isCorrect = finalVal.trim().toLowerCase() === currentQ.correct_answer.trim().toLowerCase();
    }

    const answer: Answer = {
      questionId: currentQ.id,
      questionType: currentQ.question_type as QuestionType,
      textAnswer: finalVal,
      isCorrect,
      pointsEarned: isCorrect ? (currentQ.weight || 1) : 0,
      selectedOptionIndex: currentQ.options ? currentQ.options.indexOf(finalVal) : undefined
    };

    setSelectedOption(answer.selectedOptionIndex ?? -1);
    setShowFeedback(true);

    // Time Bonus / Penalty
    if (!isPreview && quiz) {
      if (isCorrect && quiz.time_bonus_enabled) {
        const qTimeLimit = currentQ.time_limit || 30;
        if (timeLeftRef.current > qTimeLimit * 0.75) {
          setEarnedXP(prev => prev + 5);
        }
      } else if (!isCorrect && quiz.time_penalty_enabled) {
        setTimeLeft(prev => Math.max(0, prev - 10));
      }
    }

    const updatedAnswers = [...answers, answer];
    setAnswers(updatedAnswers);

    setTimeout(async () => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(prev => prev + 1);
        setSelectedOption(null);
        setLocalAnswer('');
        setShowFeedback(false);
        setShowHint(false);
      } else {
        // Quiz completed
        if (attemptId && startTime && user && quiz) {
          const correctCount = updatedAnswers.filter(a => a.isCorrect).length;
          const timeSpent = Math.floor((new Date().getTime() - startTime.getTime()) / 1000);

          try {
            await completeAttempt.mutateAsync({
              attemptId,
              quizId: quiz.id,
              score: Math.round((correctCount / questions.length) * 100), // Use score percentage
              totalQuestions: questions.length,
              timeSpent,
              answers: updatedAnswers as unknown as Record<string, string>[],
            });

            localStorage.removeItem(`quiz_start_${quiz.id}`);

            const xpGain = (correctCount * 10) + (correctCount === questions.length ? 50 : 0);
            setEarnedXP(prev => prev + xpGain);
            if (xpGain > 0 && !isPreview) {
              await updateXPAsync(xpGain);
            }
          } catch (error) {
            console.error("Error completing quiz:", error);
          }
        }
        setQuizState('result');
      }
    }, 1500 + (isCorrect && currentQ.explanation ? 1500 : 0));
  }, [showFeedback, questions, currentQuestion, answers, attemptId, startTime, user, quiz, completeAttempt, isPreview, updateXPAsync]);

  const startQuiz = async () => {
    if (!quiz || !user) {
      if (!user) {
        toast.error("Quiz başlamaq üçün daxil olmalısınız");
        navigate('/auth');
        return;
      }
      return;
    }

    try {
      const attempt = await startAttempt.mutateAsync({
        quizId: quiz.id,
        totalQuestions: questions.length,
      });
      setAttemptId(attempt.id);
      const now = new Date();
      setStartTime(now);

      // Persistence: save start time to localStorage
      if (!isPreview) {
        localStorage.setItem(`quiz_start_${quiz.id}`, now.toISOString());
      }

      setQuizState('playing');
      setCurrentQuestion(0);
      setAnswers([]);
      setTimeLeft(questions[0]?.time_limit || (quiz.duration || 20) * 60);
    } catch (error) {
      console.error("Error starting quiz:", error);
      toast.error("Quiz başladılarkən xəta baş verdi");
    }
  };

  const handleTimeUp = useCallback(() => {
    if (selectedOption === null && questions.length > 0) {
      handleAnswer(null); // passing null implies timeout/no answer
    }
  }, [selectedOption, questions.length, handleAnswer]);

  // Handle per-question timer
  useEffect(() => {
    if (quizState === 'playing' && !showFeedback && questions[currentQuestion]) {
      const qTimeLimit = questions[currentQuestion].time_limit;
      if (qTimeLimit) {
        // Reset timer when question changes
        setTimeLeft(qTimeLimit);
      }
    }
  }, [currentQuestion, quizState, showFeedback, questions]);

  // Persistence: Recover timer on refresh
  useEffect(() => {
    if (quizState === 'playing' && quiz && !startTime) {
      const persistedStart = localStorage.getItem(`quiz_start_${quiz.id}`);
      if (persistedStart) {
        const start = new Date(persistedStart);
        setStartTime(start);
        const elapsed = Math.floor((new Date().getTime() - start.getTime()) / 1000);
        // Total duration in seconds
        const totalDuration = (quiz.duration || 20) * 60;
        const remaining = Math.max(0, totalDuration - elapsed);

        if (remaining === 0) {
          setQuizState('result');
        } else {
          setTimeLeft(remaining);
        }
      }
    }
  }, [quizState, quiz, startTime]);

  useEffect(() => {
    if (quizState === 'playing' && timeLeft > 0 && !showFeedback) {
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            handleTimeUp();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [quizState, timeLeft, handleTimeUp, showFeedback]);

  useEffect(() => {
    timeLeftRef.current = timeLeft;
  }, [timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Weighted Scoring Calculation
  const totalEarnedPoints = answers.reduce((sum, a) => sum + (a.pointsEarned || 0), 0);
  const maxPossibleScore = questions.reduce((sum, q) => sum + (q.weight ?? 1), 0);
  const score = maxPossibleScore > 0 ? Math.round((totalEarnedPoints / maxPossibleScore) * 100) : 0;
  const correctAnswers = answers.filter(a => a.isCorrect).length;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-hero">
        <PageLoader text="Quiz yüklənir..." />
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="flex-1 bg-background p-4 sm:p-8 pb-32 sm:pb-8 flex flex-col items-center justify-center">
        <div className="w-full max-w-3xl space-y-6 sm:space-y-8 animate-in fade-in duration-700">
          <EmptyState
            icon="😕"
            title="Quiz tapılmadı"
            description="Bu quiz mövcud deyil və ya silinib."
            action={{
              label: "Ana Səhifəyə Qayıt",
              onClick: () => navigate('/'),
            }}
          />
        </div>
      </div>
    );
  }

  // Intro Screen
  if (quizState === 'intro') {
    return (
      <div className="min-h-screen bg-gradient-hero p-4 sm:p-8">
        <div className="mx-auto max-w-2xl">
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
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

            {/* Availability Check */}
            {(() => {
              const now = new Date();
              const fromStr = quiz.available_from?.trim();
              const toStr = quiz.available_to?.trim();

              if (!fromStr && !toStr) {
                return (
                  <div className="mb-6 rounded-xl bg-success/10 p-4 border border-success/30 text-center">
                    <p className="text-success font-bold flex items-center justify-center gap-2">
                      <CheckCircle className="h-4 w-4" /> Hər zaman əlçatandır
                    </p>
                  </div>
                );
              }

              const from = fromStr ? new Date(fromStr) : null;
              const to = toStr ? new Date(toStr) : null;

              // Prevent invalid dates
              if ((from && isNaN(from.getTime())) || (to && isNaN(to.getTime()))) return null;

              if (from && now < from) {
                return (
                  <div className="mb-6 rounded-xl bg-warning/10 p-4 border border-warning/30 text-center">
                    <p className="text-warning font-bold">Bu quiz hələ aktiv deyil</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Açılış vaxtı: {from.toLocaleString('az-AZ')}
                    </p>
                  </div>
                );
              }
              if (to && now > to) {
                return (
                  <div className="mb-6 rounded-xl bg-destructive/10 p-4 border border-destructive/30 text-center">
                    <p className="text-destructive font-bold">Bu quiz-in müddəti bitib</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Bağlanış vaxtı: {to.toLocaleString('az-AZ')}
                    </p>
                  </div>
                );
              }
              return null;
            })()}

            {(() => {
              const now = new Date();
              const fromStr = quiz.available_from?.trim();
              const toStr = quiz.available_to?.trim();
              const from = fromStr ? new Date(fromStr) : null;
              const to = toStr ? new Date(toStr) : null;

              const isDisabled = (from && !isNaN(from.getTime()) && now < from) ||
                (to && !isNaN(to.getTime()) && now > to);

              if (isPreview || !user) {
                return (
                  <div className="text-center">
                    <p className="mb-4 text-muted-foreground">Bu quizi başlamaq üçün daxil olmalısınız.</p>
                    <div className="flex gap-2 justify-center">
                      <Button variant="outline" onClick={() => navigate('/')}>
                        Ana Səhifəyə Qayıt
                      </Button>
                      {!user && (
                        <Button variant="game" onClick={() => navigate('/auth')}>
                          Daxil Ol
                        </Button>
                      )}
                    </div>
                  </div>
                );
              }

              if (questions.length === 0) {
                return (
                  <div className="text-center">
                    <p className="mb-4 text-muted-foreground">Bu quizdə hələ sual yoxdur.</p>
                    <Button variant="outline" onClick={() => navigate('/')}>
                      Ana Səhifəyə Qayıt
                    </Button>
                  </div>
                );
              }

              return (
                <Button
                  variant="game"
                  size="xl"
                  className="w-full"
                  onClick={startQuiz}
                  disabled={startAttempt.isPending || isDisabled}
                >
                  {startAttempt.isPending ? "Yüklənir..." : (isDisabled ? "Giriş qapalıdır" : "Quizə Başla")}
                </Button>
              );
            })()}
          </div>

          {/* Rating Section */}
          <div className="mt-6 animate-scale-in rounded-2xl bg-gradient-card border border-border/50 p-6 shadow-elevated">
            <h3 className="mb-4 font-semibold text-foreground">Bu quizi qiymətləndirin</h3>
            <QuizRating quizId={quiz.id} size="lg" />
          </div>

          {/* Comments Section */}
          <div className="mt-6 animate-scale-in rounded-2xl bg-gradient-card border border-border/50 p-6 shadow-elevated">
            <QuizComments quizId={quiz.id} />
          </div>
        </div>
      </div>
    );
  }

  // Playing Screen
  if (quizState === 'playing' && questions.length > 0) {
    const question = questions[currentQuestion];
    const options = (question.options as string[]) || [];
    const progress = ((currentQuestion + 1) / questions.length) * 100;
    const correctOptionIndex = options.findIndex(opt => opt === question.correct_answer);

    return (
      <div className="flex-1 bg-gradient-hero p-3 sm:p-8 pb-32 sm:pb-8">
        <div className="mx-auto max-w-3xl">
          {/* Header */}
          <div className="mb-4 sm:mb-6 flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                if (confirm('Quizi tərk etmək istəyirsiniz? İrəliləyişiniz itiriləcək.')) {
                  navigate('/');
                }
              }}
              className="text-muted-foreground hover:text-foreground -ml-2"
            >
              <ArrowLeft className="mr-1 h-4 w-4" />
              <span className="hidden sm:inline">Çıx</span>
            </Button>

            <VisualTimer
              timeLeft={timeLeft}
              totalTime={questions[currentQuestion]?.time_limit || (quiz.duration || 20) * 60}
              size={40}
              className="sm:w-auto"
            />
          </div>

          {/* Progress */}
          <div className="mb-6 sm:mb-8">
            <div className="mb-2 flex items-center justify-between text-xs sm:text-sm text-muted-foreground">
              <span>Sual {currentQuestion + 1} / {questions.length}</span>
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

          {/* Question Card */}
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
            />
          </div>

          {/* Sticky Bottom Navigation for Mobile */}
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
                  onClick={() => {
                    if (currentQuestion < questions.length - 1) {
                      setCurrentQuestion(prev => prev + 1);
                      setShowFeedback(false);
                      setShowHint(false);
                      setSelectedOption(null);
                    } else {
                      setQuizState('result');
                    }
                  }}
                >
                  Növbəti
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Result Screen
  return (
    <div className="flex-1 bg-gradient-hero p-4 sm:p-8 pb-32 sm:pb-8">
      <div className="mx-auto max-w-2xl">
        <div className="animate-scale-in rounded-3xl bg-gradient-card border border-border/50 p-8 shadow-elevated text-center">
          {/* Trophy */}
          <div className="relative mx-auto mb-6 inline-block">
            <div className={cn(
              "flex h-24 w-24 items-center justify-center rounded-full",
              score >= 80 ? "bg-success/20" : score >= 50 ? "bg-warning/20" : "bg-destructive/20"
            )}>
              <Trophy className={cn(
                "h-12 w-12",
                score >= 80 ? "text-success" : score >= 50 ? "text-warning" : "text-destructive"
              )} />
            </div>
            {score >= 80 && (
              <div className="absolute -right-2 -top-2 text-3xl animate-float">🎉</div>
            )}
          </div>

          <h1 className="mb-2 font-display text-3xl font-bold text-foreground">
            {score >= 80 ? 'Əla Nəticə!' : score >= 50 ? 'Yaxşı Cəhd!' : 'Davam Et!'}
          </h1>
          <p className="mb-8 text-muted-foreground">
            {score >= 80 ? 'Möhtəşəm! Sən bu mövzunu çox yaxşı bilirsən.' :
              score >= 50 ? 'Yaxşı iş! Bir az daha təcrübə ilə daha yaxşı olacaq.' :
                'Narahat olma, hər uğursuzluq öyrənmək üçün bir şansdır.'}
          </p>

          {/* Score Circle */}
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

          {/* Stats */}
          <div className="mb-8 grid grid-cols-3 gap-4">
            <div className="rounded-xl bg-success/10 p-4">
              <div className="text-2xl font-bold text-success">{correctAnswers}</div>
              <div className="text-xs text-muted-foreground">Düzgün</div>
            </div>
            <div className="rounded-xl bg-destructive/10 p-4">
              <div className="text-2xl font-bold text-destructive">{questions.length - correctAnswers}</div>
              <div className="text-xs text-muted-foreground">Yanlış</div>
            </div>
            <div className="rounded-xl bg-muted/50 p-4">
              <div className="text-2xl font-bold text-foreground">{questions.length}</div>
              <div className="text-xs text-muted-foreground">Ümumi</div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button variant="game" className="flex-1" onClick={() => {
              setQuizState('intro');
              setAttemptId(null);
              setStartTime(null);
              setAnswers([]);
              setCurrentQuestion(0);
              setSelectedOption(null);
              setShowFeedback(false);
            }}>
              <RotateCcw className="mr-2 h-4 w-4" />
              Yenidən Cəhd Et
            </Button>
            <Button variant="outline" className="flex-1" onClick={() => navigate('/')}>
              <Home className="mr-2 h-4 w-4" />
              Ana Səhifə
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
