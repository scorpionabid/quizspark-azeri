import { useState, useEffect, useCallback, useRef } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";

// Hooks & Context
import { useQuiz } from "@/hooks/useQuizzes";
import { useQuestions } from "@/hooks/useQuestions";
import { useMyAttempts, useStartAttempt, useUpdateAttempt, useCompleteAttempt } from "@/hooks/useQuizAttempts";
import { useAuth } from "@/contexts/AuthContext";
import { useGamification } from "@/hooks/useGamification";

// UI Components
import { PageLoader } from "@/components/ui/loading-spinner";
import { EmptyState } from "@/components/ui/empty-state";

// Quiz Sub-components
import { QuizIntro } from "@/components/quiz/QuizIntro";
import { QuizPlaying } from "@/components/quiz/QuizPlaying";
import { QuizResult } from "@/components/quiz/QuizResult";

// Types
import { QuestionAnswer, QuestionType } from "@/types/question";

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
  const updateAttempt = useUpdateAttempt();
  const completeAttempt = useCompleteAttempt();

  const { data: myAttempts } = useMyAttempts(id);
  const [displayQuestions, setDisplayQuestions] = useState<typeof questions>([]);

  const [quizState, setQuizState] = useState<QuizState>('intro');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [localAnswer, setLocalAnswer] = useState<string>('');
  const [showFeedback, setShowFeedback] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [totalTimeLeft, setTotalTimeLeft] = useState(0);
  const [attemptId, setAttemptId] = useState<string | null>(null);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [earnedXP, setEarnedXP] = useState(0);
  const { updateXPAsync } = useGamification();

  const timeLeftRef = useRef(timeLeft);
  const transitionTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const questionStartTimeRef = useRef<number>(Date.now());
  const timeUpTriggeredRef = useRef(false);

  const isLoading = quizLoading || questionsLoading;

  const handleNextInternal = useCallback(async (latestAnswers: Answer[]) => {
    if (currentQuestion < displayQuestions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
      setLocalAnswer('');
      setShowFeedback(false);
      setShowHint(false);
      transitionTimeoutRef.current = null;
    } else {
      if (attemptId && startTime && user && quiz) {
        const timeSpent = Math.floor((new Date().getTime() - startTime.getTime()) / 1000);
        const earnedPoints = latestAnswers.reduce((sum, a) => sum + (a.pointsEarned || 0), 0);
        const maxPoints = displayQuestions.reduce((sum, q) => sum + (q.weight ?? 1), 0);
        const weightedScore = maxPoints > 0 ? Math.round((earnedPoints / maxPoints) * 100) : 0;

        try {
          await completeAttempt.mutateAsync({
            attemptId,
            quizId: quiz.id,
            score: weightedScore,
            totalQuestions: displayQuestions.length,
            timeSpent,
            answers: latestAnswers as unknown as Record<string, string>[],
          });
          localStorage.removeItem(`quiz_start_${quiz.id}`);
          const xpGain = Math.round(weightedScore * 0.1 * displayQuestions.length) + (weightedScore === 100 ? 50 : 0);
          setEarnedXP(prev => prev + xpGain);
          if (xpGain > 0 && !isPreview) {
            await updateXPAsync(xpGain);
          }
        } catch (error) {
          console.error("Error completing quiz:", error);
        }
      }
      setQuizState('result');
      transitionTimeoutRef.current = null;
    }
  }, [currentQuestion, displayQuestions, attemptId, startTime, user, quiz, isPreview, completeAttempt, updateXPAsync]);

  const handleAnswer = useCallback(async (val: string | null) => {
    if (showFeedback || displayQuestions.length === 0) return;

    const currentQ = displayQuestions[currentQuestion];
    if (!currentQ) return;

    const finalVal = val || '';
    let isCorrect = false;

    // Advanced evaluation logic
    if (currentQ.question_type === 'ordering') {
      const studentSeq = finalVal.split('|||').map(s => s.trim());
      const correctSeq = (
        currentQ.sequence_items?.length
          ? currentQ.sequence_items
          : currentQ.correct_answer.split('|||')
      ).map(s => s.trim());
      isCorrect = studentSeq.length === correctSeq.length && studentSeq.every((item, i) => item === correctSeq[i]);
    } else if (currentQ.question_type === 'matching') {
      const rawPairs = currentQ.matching_pairs;
      if (rawPairs) {
        const pairsRecord: Record<string, string> = Array.isArray(rawPairs)
          ? Object.fromEntries((rawPairs as unknown as Array<{ left: string; right: string }>).map(p => [p.left, p.right]))
          : rawPairs as Record<string, string>;
        const studentPairs: Record<string, string> = {};
        finalVal.split('|||').forEach(m => {
          const colonIdx = m.indexOf(':');
          if (colonIdx > -1) studentPairs[m.slice(0, colonIdx)] = m.slice(colonIdx + 1);
        });
        isCorrect = Object.entries(pairsRecord).every(([l, r]) => studentPairs[l] === r);
      } else {
        const studentMatches = finalVal.split('|||').sort();
        const correctMatches = currentQ.correct_answer.split('|||').sort();
        isCorrect = JSON.stringify(studentMatches) === JSON.stringify(correctMatches);
      }
    } else if (currentQ.question_type === 'hotspot') {
      const parts = currentQ.correct_answer.split(':');
      const cx = parseFloat(parts[0]);
      const cy = parseFloat(parts[1]);
      const tolerance = parts[2] ? parseFloat(parts[2]) : 10;
      const sParts = finalVal.split(':');
      const sx = parseFloat(sParts[0]);
      const sy = parseFloat(sParts[1]);
      isCorrect = !isNaN(cx) && !isNaN(sx) && Math.abs(sx - cx) <= tolerance && Math.abs(sy - cy) <= tolerance;
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

    setShowFeedback(true);

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

    if (attemptId && !isPreview) {
      updateAttempt.mutate({
        attemptId,
        answers: updatedAnswers as unknown as Record<string, string>[],
      });
    }

    if (transitionTimeoutRef.current) {
      clearTimeout(transitionTimeoutRef.current);
    }

    transitionTimeoutRef.current = setTimeout(async () => {
      handleNextInternal(updatedAnswers);
    }, 1500 + (isCorrect && currentQ.explanation ? 1500 : 0));
  }, [showFeedback, displayQuestions, currentQuestion, answers, attemptId, quiz, isPreview, updateAttempt, handleNextInternal]);

  const startQuiz = async () => {
    if (!quiz || !user) {
      if (!user) {
        toast.error("Quiz başlamaq üçün daxil olmalısınız");
        navigate('/auth');
      }
      return;
    }

    const attemptsLimit = quiz.attempts_limit ?? 0;
    if (attemptsLimit > 0) {
      const completedCount = (myAttempts || []).filter(a => a.completed_at !== null).length;
      if (completedCount >= attemptsLimit) {
        toast.error(`Bu quiz üçün cəhd limitiniz dolub (${completedCount}/${attemptsLimit})`);
        return;
      }
    }

    const orderedQuestions = quiz.shuffle_questions
      ? [...questions].sort(() => Math.random() - 0.5)
      : [...questions];
    setDisplayQuestions(orderedQuestions);

    try {
      const attempt = await startAttempt.mutateAsync({
        quizId: quiz.id,
        totalQuestions: orderedQuestions.length,
      });
      setAttemptId(attempt.id);
      const now = new Date();
      setStartTime(now);
      if (!isPreview) {
        localStorage.setItem(`quiz_start_${quiz.id}`, now.toISOString());
      }
      setQuizState('playing');
      setCurrentQuestion(0);
      setAnswers([]);
      const totalDurationSecs = (quiz.duration || 20) * 60;
      setTotalTimeLeft(totalDurationSecs);
      setTimeLeft(orderedQuestions[0]?.time_limit || totalDurationSecs);
    } catch (error) {
      console.error("Error starting quiz:", error);
      toast.error("Quiz başladılarkən xəta baş verdi");
    }
  };

  const handleTimeUp = useCallback(() => {
    if (displayQuestions.length > 0) {
      handleAnswer(null);
    }
  }, [displayQuestions.length, handleAnswer]);

  useEffect(() => {
    if (quizState !== 'playing' || showFeedback) return;
    if (!displayQuestions[currentQuestion]) return;
    questionStartTimeRef.current = Date.now();
    timeUpTriggeredRef.current = false;
    const qTimeLimit = displayQuestions[currentQuestion].time_limit;
    if (qTimeLimit) setTimeLeft(qTimeLimit);
  }, [currentQuestion, quizState, showFeedback, displayQuestions]);

  useEffect(() => {
    if (quizState !== 'playing' || showFeedback || !startTime || !quiz) return;
    const totalDuration = (quiz.duration || 20) * 60;
    const timer = setInterval(() => {
      const now = Date.now();
      const elapsed = (now - startTime.getTime()) / 1000;
      const totalRemaining = Math.max(0, Math.floor(totalDuration - elapsed));
      setTotalTimeLeft(totalRemaining);
      if (totalRemaining <= 0) {
        setQuizState('result');
        return;
      }
      const qTimeLimit = displayQuestions[currentQuestion]?.time_limit;
      if (qTimeLimit) {
        const qElapsed = (now - questionStartTimeRef.current) / 1000;
        const qRemaining = Math.max(0, Math.floor(qTimeLimit - qElapsed));
        setTimeLeft(qRemaining);
        if (qRemaining <= 0 && !timeUpTriggeredRef.current) {
          timeUpTriggeredRef.current = true;
          handleTimeUp();
        }
      } else {
        setTimeLeft(totalRemaining);
      }
    }, 500);
    return () => clearInterval(timer);
  }, [quizState, showFeedback, startTime, quiz, displayQuestions, currentQuestion, handleTimeUp]);

  useEffect(() => {
    timeLeftRef.current = timeLeft;
  }, [timeLeft]);

  const activeQuestions = displayQuestions.length > 0 ? displayQuestions : questions;
  const totalPoints = answers.reduce((sum, a) => sum + (a.pointsEarned || 0), 0);
  const maxPoints = activeQuestions.reduce((sum, q) => sum + (q.weight ?? 1), 0);
  const score = maxPoints > 0 ? Math.round((totalPoints / maxPoints) * 100) : 0;
  const correctCount = answers.filter(a => a.isCorrect).length;

  if (isLoading) return <div className="min-h-screen bg-gradient-hero"><PageLoader text="Quiz yüklənir..." /></div>;
  if (!quiz) return <div className="flex-1 bg-background p-8 flex flex-col items-center justify-center"><EmptyState icon="😕" title="Quiz tapılmadı" description="Bu quiz mövcud deyil və ya silinib." action={{ label: "Ana Səhifəyə Qayıt", onClick: () => navigate('/') }} /></div>;

  if (quizState === 'intro') {
    return (
      <QuizIntro 
        quiz={quiz} 
        questions={questions} 
        myAttempts={myAttempts || []} 
        user={user} 
        onStart={startQuiz} 
        onBack={() => navigate('/')} 
        isPending={startAttempt.isPending}
        isPreview={isPreview}
      />
    );
  }

  if (quizState === 'playing' && displayQuestions.length > 0) {
    return (
      <QuizPlaying
        quiz={quiz}
        currentQuestion={currentQuestion}
        totalQuestions={displayQuestions.length}
        question={displayQuestions[currentQuestion]}
        timeLeft={timeLeft}
        totalTimeLeft={totalTimeLeft}
        localAnswer={localAnswer}
        setLocalAnswer={setLocalAnswer}
        showFeedback={showFeedback}
        showHint={showHint}
        setShowHint={setShowHint}
        handleAnswer={handleAnswer}
        handleNext={() => handleNextInternal(answers)}
        onExit={() => {
          if (confirm('Quizi tərk etmək istəyirsiniz? İrəliləyişiniz itiriləcək.')) navigate('/');
        }}
      />
    );
  }

  return (
    <QuizResult
      score={score}
      correctAnswers={correctCount}
      totalQuestions={activeQuestions.length}
      earnedXP={earnedXP}
      passThreshold={quiz.pass_percentage || 60}
      onRetry={() => {
        setQuizState('intro');
        setAttemptId(null);
        setStartTime(null);
        setAnswers([]);
        setCurrentQuestion(0);
      }}
      onHome={() => navigate('/')}
    />
  );
}
