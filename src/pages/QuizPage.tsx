import { useState, useEffect, useCallback } from "react";
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

type QuizState = 'intro' | 'playing' | 'result';

interface Answer {
  questionIndex: number;
  selectedOption: number;
  isCorrect: boolean;
}

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
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [attemptId, setAttemptId] = useState<string | null>(null);
  const [startTime, setStartTime] = useState<Date | null>(null);

  const isLoading = quizLoading || questionsLoading;

  const handleAnswer = useCallback(async (optionIndex: number) => {
    if (showFeedback || questions.length === 0) return;

    const question = questions[currentQuestion];
    const options = (question.options as string[]) || [];

    setSelectedOption(optionIndex);
    setShowFeedback(true);

    const selectedAnswer = optionIndex >= 0 ? options[optionIndex] : "";
    const isCorrect = selectedAnswer === question.correct_answer;

    const newAnswer = {
      questionIndex: currentQuestion,
      selectedOption: optionIndex,
      isCorrect,
    };

    const updatedAnswers = [...answers, newAnswer];
    setAnswers(updatedAnswers);

    setTimeout(async () => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(prev => prev + 1);
        setSelectedOption(null);
        setShowFeedback(false);
      } else {
        // Quiz completed
        if (attemptId && startTime && user && quiz) {
          const correctCount = updatedAnswers.filter(a => a.isCorrect).length;
          const timeSpent = Math.floor((new Date().getTime() - startTime.getTime()) / 1000);

          try {
            await completeAttempt.mutateAsync({
              attemptId,
              quizId: quiz.id,
              score: correctCount,
              totalQuestions: questions.length,
              timeSpent,
              answers: updatedAnswers as unknown as Record<string, string>[],
            });
          } catch (error) {
            console.error("Error completing quiz:", error);
          }
        }
        setQuizState('result');
      }
    }, 1500);
  }, [showFeedback, questions, currentQuestion, answers, attemptId, startTime, user, quiz, completeAttempt]);

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
      setStartTime(new Date());
      setQuizState('playing');
      setCurrentQuestion(0);
      setAnswers([]);
      setTimeLeft((quiz.duration || 20) * 60);
    } catch (error) {
      console.error("Error starting quiz:", error);
      toast.error("Quiz başladılarkən xəta baş verdi");
    }
  };

  const handleTimeUp = useCallback(() => {
    if (selectedOption === null && questions.length > 0) {
      handleAnswer(-1);
    }
  }, [selectedOption, questions.length, handleAnswer]);

  useEffect(() => {
    if (quizState === 'playing' && timeLeft > 0) {
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
  }, [quizState, timeLeft, handleTimeUp]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const correctAnswers = answers.filter(a => a.isCorrect).length;
  const score = questions.length > 0 ? Math.round((correctAnswers / questions.length) * 100) : 0;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-hero">
        <PageLoader text="Quiz yüklənir..." />
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="min-h-screen bg-gradient-hero p-4 sm:p-8">
        <div className="mx-auto max-w-2xl">
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

            {isPreview || !user ? (
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
            ) : questions.length === 0 ? (
              <div className="text-center">
                <p className="mb-4 text-muted-foreground">Bu quizdə hələ sual yoxdur.</p>
                <Button variant="outline" onClick={() => navigate('/')}>
                  Ana Səhifəyə Qayıt
                </Button>
              </div>
            ) : (
              <Button
                variant="game"
                size="xl"
                className="w-full"
                onClick={startQuiz}
                disabled={startAttempt.isPending}
              >
                {startAttempt.isPending ? "Yüklənir..." : "Quizə Başla"}
              </Button>
            )}
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
      <div className="min-h-screen bg-gradient-hero p-4 sm:p-8">
        <div className="mx-auto max-w-3xl">
          {/* Header */}
          <div className="mb-6 flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={() => {
                if (confirm('Quizi tərk etmək istəyirsiniz? İrəliləyişiniz itiriləcək.')) {
                  navigate('/');
                }
              }}
              className="text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Çıx
            </Button>
            <div className={cn(
              "flex items-center gap-2 rounded-full px-4 py-2",
              timeLeft < 60 ? "bg-destructive/20 text-destructive" : "bg-muted text-muted-foreground"
            )}>
              <Clock className="h-4 w-4" />
              <span className="font-mono font-bold">{formatTime(timeLeft)}</span>
            </div>
          </div>

          {/* Progress */}
          <div className="mb-8">
            <div className="mb-2 flex items-center justify-between text-sm text-muted-foreground">
              <span>Sual {currentQuestion + 1} / {questions.length}</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {/* Question Card */}
          <div className="animate-slide-up rounded-3xl bg-gradient-card border border-border/50 p-6 shadow-elevated sm:p-8">
            <h2 className="mb-8 text-center font-display text-xl font-bold text-foreground sm:text-2xl">
              {question.question_text}
            </h2>

            <div className="grid gap-3 sm:gap-4">
              {options.map((option, index) => {
                const isSelected = selectedOption === index;
                const isCorrect = index === correctOptionIndex;
                const showResult = showFeedback;

                return (
                  <button
                    key={index}
                    onClick={() => handleAnswer(index)}
                    disabled={showFeedback}
                    className={cn(
                      "relative flex items-center gap-4 rounded-2xl border-2 p-4 text-left transition-all duration-200 sm:p-5",
                      !showResult && !isSelected && "border-border/50 bg-muted/30 hover:border-primary/50 hover:bg-muted/50",
                      !showResult && isSelected && "border-primary bg-primary/10",
                      showResult && isCorrect && "border-success bg-success/10",
                      showResult && isSelected && !isCorrect && "border-destructive bg-destructive/10",
                      showResult && "cursor-not-allowed"
                    )}
                  >
                    <div className={cn(
                      "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-sm font-bold",
                      !showResult && "bg-muted text-muted-foreground",
                      showResult && isCorrect && "bg-success text-success-foreground",
                      showResult && isSelected && !isCorrect && "bg-destructive text-destructive-foreground"
                    )}>
                      {showResult && isCorrect ? (
                        <CheckCircle className="h-5 w-5" />
                      ) : showResult && isSelected && !isCorrect ? (
                        <XCircle className="h-5 w-5" />
                      ) : (
                        String.fromCharCode(65 + index)
                      )}
                    </div>
                    <span className={cn(
                      "font-medium",
                      showResult && isCorrect && "text-success",
                      showResult && isSelected && !isCorrect && "text-destructive"
                    )}>
                      {option}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Feedback */}
            {showFeedback && question.explanation && (
              <div className={cn(
                "mt-6 rounded-xl p-4",
                selectedOption !== null && options[selectedOption] === question.correct_answer ? "bg-success/10" : "bg-muted/50"
              )}>
                <p className="text-sm text-muted-foreground">
                  <strong className="text-foreground">İzahı:</strong> {question.explanation}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Result Screen
  return (
    <div className="min-h-screen bg-gradient-hero p-4 sm:p-8">
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
          <div className="mx-auto mb-8 flex h-40 w-40 flex-col items-center justify-center rounded-full border-4 border-primary bg-primary/10">
            <div className="text-5xl font-bold text-primary">{score}%</div>
            <div className="text-sm text-muted-foreground">Nəticə</div>
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
