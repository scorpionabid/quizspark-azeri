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
import { QuizPlaying, PageNavStatus } from "@/components/quiz/QuizPlaying";
import { QuizResult } from "@/components/quiz/QuizResult";

// Types & Utils
import { QuestionAnswer, QuestionType } from "@/types/question";
import { supabase } from "@/integrations/supabase/client";
import { evaluateAnswer } from "@/components/quiz/renderers/utils";

type QuizState = 'intro' | 'playing' | 'result';
type Answer = QuestionAnswer;

export default function QuizPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isPreview = searchParams.get('preview') === 'true';
  const { user } = useAuth();

  const { data: quiz, isLoading: quizLoading } = useQuiz(id);
  const { data: questions = [], isLoading: questionsLoading } = useQuestions(quiz?.id);
  const startAttempt = useStartAttempt();
  const updateAttempt = useUpdateAttempt();
  const completeAttempt = useCompleteAttempt();

  const { data: myAttempts } = useMyAttempts(quiz?.id);
  const [displayQuestions, setDisplayQuestions] = useState<typeof questions>([]);

  const [quizState, setQuizState] = useState<QuizState>('intro');
  const [currentPage, setCurrentPage] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [localAnswers, setLocalAnswers] = useState<Record<string, string>>({});
  const [showFeedback, setShowFeedback] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0); // Page time left (if applicable)
  const [totalTimeLeft, setTotalTimeLeft] = useState(0);
  const [attemptId, setAttemptId] = useState<string | null>(null);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [showHint, setShowHint] = useState<Record<string, boolean>>({});
  const [earnedXP, setEarnedXP] = useState(0);
  const [timeSpent, setTimeSpent] = useState(0);
  const [bookmarkedQuestions, setBookmarkedQuestions] = useState<Set<string>>(new Set());
  
  const { updateXPAsync } = useGamification();

  const timeLeftRef = useRef(timeLeft);
  const transitionTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const questionStartTimeRef = useRef<number>(Date.now());
  const timeUpTriggeredRef = useRef(false);
  const totalTimeUpRef = useRef(false);
  const answersRef = useRef<Answer[]>([]);
  const draftLoadedRef = useRef(false);
  const strictViolationsRef = useRef(0);

  // Auto-Save Draft to LocalStorage
  useEffect(() => {
    if (attemptId && quizState === 'playing' && Object.keys(localAnswers).length > 0) {
      localStorage.setItem(`quiz_draft_${attemptId}`, JSON.stringify(localAnswers));
    }
  }, [localAnswers, attemptId, quizState]);

  // Restore Draft on Mount
  useEffect(() => {
    if (attemptId && quizState === 'playing' && !draftLoadedRef.current) {
      draftLoadedRef.current = true;
      const saved = localStorage.getItem(`quiz_draft_${attemptId}`);
      if (saved && Object.keys(localAnswers).length === 0) {
        try {
          const parsed = JSON.parse(saved);
          if (parsed && typeof parsed === 'object') {
            setLocalAnswers(parsed);
          }
        } catch (e) {
          console.error("Failed to parse draft", e);
        }
      }
    }
  }, [attemptId, quizState, localAnswers]);

  const isLoading = quizLoading || questionsLoading;

  // Moved Strict Mode hook down to avoid block-scoped reference error

  useEffect(() => {
    answersRef.current = answers;
  }, [answers]);

  const completeQuizWithAnswers = useCallback(async (latestAnswers: Answer[]) => {
    if (!isPreview && attemptId && startTime && user && quiz) {
      const timeSpent = Math.floor((new Date().getTime() - startTime.getTime()) / 1000);
      setTimeSpent(timeSpent);
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
        localStorage.removeItem(`quiz_draft_${attemptId}`);

        // Insert pending reviews for open-ended / essay questions
        const essayAnswers = latestAnswers.filter(a => a.needsReview && a.textAnswer);
        if (essayAnswers.length > 0) {
          const reviewsToInsert = essayAnswers.map(ea => ({
            attempt_id: attemptId,
            question_id: ea.questionId,
            student_answer: ea.textAnswer || '',
            max_score: (displayQuestions.find(q => q.id === ea.questionId)?.weight) ?? 1,
            status: 'pending',
          }));
          try {
            await supabase.from('answer_reviews').insert(reviewsToInsert);
          } catch (reviewErr) {
            console.warn("Could not insert answer_reviews:", reviewErr);
          }
        }

        const xpGain = Math.round(weightedScore * 0.1 * displayQuestions.length) + (weightedScore === 100 ? 50 : 0);
        setEarnedXP(prev => prev + xpGain);
        if (xpGain > 0) {
          await updateXPAsync(xpGain);
        }
      } catch (error) {
        console.error("Error completing quiz:", error);
      }
    }
    setQuizState('result');
  }, [isPreview, attemptId, startTime, user, quiz, displayQuestions, completeAttempt, updateXPAsync]);

  // Strict Mode — tab violations tracked; 3 violations → auto-submit
  useEffect(() => {
    if (quizState === 'playing' && quiz?.strict_mode && !isPreview) {
      const handleVisibilityChange = () => {
        if (document.hidden) {
          strictViolationsRef.current += 1;
          const count = strictViolationsRef.current;
          if (count >= 3) {
            toast.error('Qaydalar pozuldu: Səhifəni 3 dəfə tərk etdiniz. Quiz avtomatik tamamlandı.', { duration: 8000 });
            void completeQuizWithAnswers(answersRef.current);
          } else {
            toast.warning(
              `Xəbərdarlıq (${count}/3): Səhifəni tərk etdiniz. Daha ${3 - count} pozuntu olsa quiz avtomatik bitəcək.`,
              { duration: 5000 },
            );
          }
        }
      };
      document.addEventListener("visibilitychange", handleVisibilityChange);
      return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
    }
  }, [quizState, quiz, isPreview, completeQuizWithAnswers]);

  const questionsPerPage = quiz?.questions_per_page && quiz.questions_per_page > 0 
    ? quiz.questions_per_page 
    : (displayQuestions.length || 1);
  const totalPages = Math.ceil(displayQuestions.length / questionsPerPage);
  const pageQuestions = displayQuestions.slice(currentPage * questionsPerPage, (currentPage + 1) * questionsPerPage);

  const handleNextPageInternal = useCallback(async (latestAnswers: Answer[]) => {
    if (transitionTimeoutRef.current) {
      clearTimeout(transitionTimeoutRef.current);
      transitionTimeoutRef.current = null;
    }
    if (currentPage < totalPages - 1) {
      const nextPage = currentPage + 1;
      setCurrentPage(nextPage);
      const targetSlice = displayQuestions.slice(nextPage * questionsPerPage, (nextPage + 1) * questionsPerPage);
      const isAlreadyAnswered = targetSlice.length > 0 && targetSlice.every(q => latestAnswers.some(a => a.questionId === q.id));
      setShowFeedback(isAlreadyAnswered && (quiz?.feedback_timing === 'instant' || quiz?.show_feedback));
      setShowHint({});
    } else {
      await completeQuizWithAnswers(latestAnswers);
    }
  }, [currentPage, totalPages, completeQuizWithAnswers, displayQuestions, questionsPerPage, quiz]);

  const handlePageSubmit = useCallback(async (overrideAnswers?: Record<string, string>) => {
    if (showFeedback || pageQuestions.length === 0) return;

    const currentAnswersMap = overrideAnswers || localAnswers;
    const newAnswers: Answer[] = [];
    let anyIncorrect = false;
    let anyCorrect = false;

    pageQuestions.forEach(currentQ => {
      // Avoid re-evaluating if already answered (e.g., backtracking or resuming)
      if (answersRef.current.some(a => a.questionId === currentQ.id)) {
        return; // Already submitted
      }

      const finalVal = currentAnswersMap[currentQ.id] || '';
      const evalResult = evaluateAnswer(currentQ, finalVal);

      const answer: Answer = {
        questionId: currentQ.id,
        questionType: currentQ.question_type as QuestionType,
        textAnswer: finalVal,
        isCorrect: evalResult.isCorrect,
        pointsEarned: evalResult.pointsEarned,
        selectedOptionIndex: currentQ.options ? currentQ.options.indexOf(finalVal) : undefined,
        needsReview: evalResult.needsReview,
      };

      newAnswers.push(answer);
      if (evalResult.isCorrect) anyCorrect = true;
      else anyIncorrect = true;
    });

    const isInstant = (quiz?.feedback_timing === 'instant');

    if (isInstant) {
      setShowFeedback(true);
    }

    if (!isPreview && quiz && newAnswers.length > 0) {
      if (anyCorrect && !anyIncorrect && quiz.time_bonus_enabled) {
        setEarnedXP(prev => prev + (pageQuestions.length * 2));
      } else if (anyIncorrect && quiz.time_penalty_enabled) {
        setTimeLeft(prev => Math.max(0, prev - 10));
      }
    }

    const updatedAnswers = [...answers, ...newAnswers];
    setAnswers(updatedAnswers);

    if (attemptId && !isPreview && newAnswers.length > 0) {
      // Real-time davamlı sinxronizasiya: Hər səhifə təsdiqində bazaya yazılır
      updateAttempt.mutate({
        attemptId,
        answers: updatedAnswers as unknown as Record<string, string>[],
      });
    }

    if (!isInstant) {
      // Standart İmtahan və ya Qapalı Rejim: Aralıq feedback olmadan dərhal növbəti səhifəyə / nəticəyə keçir
      void handleNextPageInternal(updatedAnswers);
    } else if (quiz?.auto_advance && quiz.questions_per_page === 1) {
      if (transitionTimeoutRef.current) clearTimeout(transitionTimeoutRef.current);
      const delay = pageQuestions[0]?.time_limit ? pageQuestions[0].time_limit * 1000 : 1500;
      transitionTimeoutRef.current = setTimeout(async () => {
        if (transitionTimeoutRef.current !== null) {
          await handleNextPageInternal(updatedAnswers);
        }
      }, delay);
    }
  }, [showFeedback, pageQuestions, localAnswers, answers, attemptId, quiz, isPreview, updateAttempt, handleNextPageInternal]);

  const resumeQuiz = useCallback(async (attempt: import('@/hooks/useQuizAttempts').QuizAttempt) => {
    if (!quiz) return;
    let orderedQuestions = [...questions];

    const storedOrder = attempt.question_order || (() => {
      try {
        const raw = localStorage.getItem(`quiz_order_${attempt.id}`);
        return raw ? (JSON.parse(raw) as string[]) : null;
      } catch {
        return null;
      }
    })();

    if (storedOrder && Array.isArray(storedOrder) && storedOrder.length > 0) {
      const qMap = new Map(questions.map(q => [q.id, q]));
      const reordered: Question[] = [];
      storedOrder.forEach(qId => {
        const found = qMap.get(qId);
        if (found) {
          reordered.push(found);
          qMap.delete(qId);
        }
      });
      orderedQuestions = [...reordered, ...Array.from(qMap.values())];
    }

    setDisplayQuestions(orderedQuestions);
    totalTimeUpRef.current = false;

    const prevAnswers = (attempt.answers || []) as unknown as Answer[];
    setAnswers(prevAnswers);
    setAttemptId(attempt.id);

    const initialLocalAnswers: Record<string, string> = {};
    prevAnswers.forEach(ans => {
      initialLocalAnswers[ans.questionId] = ans.textAnswer || '';
    });
    setLocalAnswers(initialLocalAnswers);

    const startedAt = new Date(attempt.started_at);
    setStartTime(startedAt);

    const isTimeless = !quiz.duration || quiz.duration === 0;
    const totalDurationSecs = isTimeless ? 0 : quiz.duration * 60;
    const elapsed = (Date.now() - startedAt.getTime()) / 1000;
    const remaining = isTimeless ? 0 : Math.max(0, Math.floor(totalDurationSecs - elapsed));

    if (!isTimeless && remaining <= 0) {
      await completeQuizWithAnswers(prevAnswers);
      return;
    }

    const nextIdx = Math.min(prevAnswers.length, orderedQuestions.length - 1);
    const qPerPage = quiz?.questions_per_page && quiz.questions_per_page > 0 ? quiz.questions_per_page : orderedQuestions.length;
    setCurrentPage(Math.floor(nextIdx / qPerPage));
    
    setTotalTimeLeft(remaining);
    setTimeLeft(remaining); // Optional: calculate per page timeLeft if needed
    setShowFeedback(false);
    setShowHint({});
    setQuizState('playing');
  }, [quiz, questions, completeQuizWithAnswers]);

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
        toast.error(`Cəhd limitiniz dolub (${completedCount}/${attemptsLimit})`);
        return;
      }
    }

    const orderedQuestions = quiz.shuffle_questions
      ? [...questions].sort(() => Math.random() - 0.5)
      : [...questions];
    setDisplayQuestions(orderedQuestions);
    totalTimeUpRef.current = false;

    try {
      let newAttemptId: string;
      const questionOrder = orderedQuestions.map(q => q.id);

      if (isPreview) {
        newAttemptId = `preview-${Date.now()}`;
      } else {
        const attempt = await startAttempt.mutateAsync({
          quizId: quiz.id,
          totalQuestions: orderedQuestions.length,
          questionOrder,
        });
        newAttemptId = attempt.id;
      }

      setAttemptId(newAttemptId);
      localStorage.setItem(`quiz_order_${newAttemptId}`, JSON.stringify(questionOrder));
      const now = new Date();
      setStartTime(now);
      if (!isPreview) {
        localStorage.setItem(`quiz_start_${quiz.id}`, now.toISOString());
      }
      setQuizState('playing');
      setCurrentPage(0);
      setAnswers([]);
      setLocalAnswers({});
      setTimeSpent(0);
      draftLoadedRef.current = false;
      strictViolationsRef.current = 0;
      // Load persisted bookmarks for this quiz
      try {
        const saved = localStorage.getItem(`quiz_bookmarks_${quiz.id}`);
        if (saved) setBookmarkedQuestions(new Set(JSON.parse(saved) as string[]));
        else setBookmarkedQuestions(new Set());
      } catch { setBookmarkedQuestions(new Set()); }
      const isTimeless = !quiz.duration || quiz.duration === 0;
      const totalDurationSecs = isTimeless ? 0 : quiz.duration * 60;
      setTotalTimeLeft(totalDurationSecs);
      setTimeLeft(totalDurationSecs);
    } catch (error) {
      console.error("Error starting quiz:", error);
      toast.error("Quiz başladılarkən xəta baş verdi");
    }
  };

  const handleTimeUp = useCallback(() => {
    if (displayQuestions.length > 0) {
      handlePageSubmit();
    }
  }, [displayQuestions.length, handlePageSubmit]);

  useEffect(() => {
    if (quizState !== 'playing' || showFeedback) return;
    if (pageQuestions.length === 0) return;
    questionStartTimeRef.current = Date.now();
    timeUpTriggeredRef.current = false;
    // For page timer, maybe sum limits? Or skip if 0. We'll skip for now if multiple.
    if (pageQuestions.length === 1 && pageQuestions[0].time_limit) {
      setTimeLeft(pageQuestions[0].time_limit);
    }
  }, [currentPage, quizState, showFeedback, pageQuestions.length, pageQuestions]);

  useEffect(() => {
    if (quizState !== 'playing' || showFeedback || !startTime || !quiz) return;
    const isTimeless = !quiz.duration || quiz.duration === 0;
    const totalDuration = isTimeless ? 0 : quiz.duration * 60;

    const timer = setInterval(() => {
      const now = Date.now();
      const elapsed = (now - startTime.getTime()) / 1000;
      
      if (!isTimeless) {
        const totalRemaining = Math.max(0, Math.floor(totalDuration - elapsed));
        setTotalTimeLeft(totalRemaining);

        if (totalRemaining <= 0) {
          if (!totalTimeUpRef.current) {
            totalTimeUpRef.current = true;
            void completeQuizWithAnswers(answersRef.current);
          }
          return;
        }
      } else {
        setTotalTimeLeft(0);
      }

      const qTimeLimit = pageQuestions.length === 1 ? pageQuestions[0]?.time_limit : null;
      if (qTimeLimit) {
        const qElapsed = (now - questionStartTimeRef.current) / 1000;
        const qRemaining = Math.max(0, Math.floor(qTimeLimit - qElapsed));
        setTimeLeft(qRemaining);
        if (qRemaining <= 0 && !timeUpTriggeredRef.current) {
          timeUpTriggeredRef.current = true;
          handleTimeUp();
        }
      } else if (!isTimeless) {
        const totalRemaining = Math.max(0, Math.floor(totalDuration - elapsed));
        setTimeLeft(totalRemaining);
      } else {
        setTimeLeft(0);
      }
    }, 500);
    return () => clearInterval(timer);
  }, [quizState, showFeedback, startTime, quiz, pageQuestions, handleTimeUp, completeQuizWithAnswers]);

  useEffect(() => {
    timeLeftRef.current = timeLeft;
  }, [timeLeft]);

  const activeQuestions = displayQuestions.length > 0 ? displayQuestions : questions;
  const totalPoints = answers.reduce((sum, a) => sum + (a.pointsEarned || 0), 0);
  const maxPoints = activeQuestions.reduce((sum, q) => sum + (q.weight ?? 1), 0);
  const score = maxPoints > 0 ? Math.round((totalPoints / maxPoints) * 100) : 0;
  const correctCount = answers.filter(a => a.isCorrect).length;
  const pendingReviews = answers.filter(a => a.needsReview).length;
  const feedbackEnabled = quiz?.show_feedback !== false && quiz?.feedback_timing !== 'never';

  const toggleBookmark = (id: string) => {
    setBookmarkedQuestions(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) newSet.delete(id);
      else newSet.add(id);
      if (quiz) {
        localStorage.setItem(`quiz_bookmarks_${quiz.id}`, JSON.stringify([...newSet]));
      }
      return newSet;
    });
  };

  const getPageStatus = (pageIdx: number): PageNavStatus => {
    const pageSlice = displayQuestions.slice(pageIdx * questionsPerPage, (pageIdx + 1) * questionsPerPage);
    if (pageSlice.length === 0) return 'pending';

    const pageAnswers = pageSlice
      .map(q => answers.find(a => a.questionId === q.id))
      .filter((a): a is Answer => Boolean(a));

    const isAllAnswered = pageAnswers.length === pageSlice.length;

    if (isAllAnswered) {
      const showCorrectness = quiz?.feedback_timing === 'instant' || quiz?.show_feedback;
      if (showCorrectness) {
        const allCorrect = pageAnswers.every(a => a.isCorrect);
        return allCorrect ? 'correct' : 'incorrect';
      }
      return 'completed';
    }

    if (pageIdx === currentPage) return 'current';
    return 'pending';
  };

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
        onResume={resumeQuiz}
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
        currentPage={currentPage}
        totalPages={totalPages}
        pageQuestions={pageQuestions}
        totalQuestions={questions.length}
        totalTimeLeft={totalTimeLeft}
        questionTimeLeft={pageQuestions.length === 1 && pageQuestions[0]?.time_limit ? timeLeft : null}
        localAnswers={localAnswers}
        setLocalAnswers={setLocalAnswers}
        showFeedback={showFeedback}
        showHint={showHint}
        setShowHint={setShowHint}
        handlePageSubmit={handlePageSubmit}
        handleNextPage={() => handleNextPageInternal(answers)}
        handlePrevPage={() => {
            const prevPage = Math.max(0, currentPage - 1);
            setCurrentPage(prevPage);
            const targetSlice = displayQuestions.slice(prevPage * questionsPerPage, (prevPage + 1) * questionsPerPage);
            const isAlreadyAnswered = targetSlice.length > 0 && targetSlice.every(q => answers.some(a => a.questionId === q.id));
            setShowFeedback(isAlreadyAnswered && (quiz?.feedback_timing === 'instant' || quiz?.show_feedback));
        }}
        jumpToPage={(idx) => {
            setCurrentPage(idx);
            const targetSlice = displayQuestions.slice(idx * questionsPerPage, (idx + 1) * questionsPerPage);
            const isAlreadyAnswered = targetSlice.length > 0 && targetSlice.every(q => answers.some(a => a.questionId === q.id));
            setShowFeedback(isAlreadyAnswered && (quiz?.feedback_timing === 'instant' || quiz?.show_feedback));
        }}
        onExit={() => navigate('/')}
        feedbackEnabled={feedbackEnabled}
        bookmarkedQuestions={bookmarkedQuestions}
        toggleBookmark={toggleBookmark}
        getPageStatus={getPageStatus}
      />
    );
  }

  const attemptsLimit = quiz?.attempts_limit ?? 0;
  const completedCount = (myAttempts || []).filter(a => a.completed_at !== null).length;
  const canRetry = attemptsLimit === 0 || completedCount < attemptsLimit;

  return (
    <QuizResult
      score={score}
      correctAnswers={correctCount}
      totalQuestions={activeQuestions.length}
      earnedXP={earnedXP}
      passThreshold={quiz.pass_percentage || 60}
      pendingReviews={pendingReviews}
      earnedPoints={totalPoints}
      maxPoints={maxPoints}
      timeSpent={timeSpent}
      answers={answers}
      questions={activeQuestions}
      backgroundImageUrl={quiz?.background_image_url}
      canRetry={canRetry}
      showDetailedReview={(quiz?.feedback_timing || (quiz?.show_feedback === false ? 'never' : 'end_of_quiz')) !== 'never'}
      onRetry={() => {
        setQuizState('intro');
        setAttemptId(null);
        setStartTime(null);
        setAnswers([]);
        setCurrentPage(0);
        setLocalAnswers({});
        setTimeSpent(0);
        setBookmarkedQuestions(new Set());
        totalTimeUpRef.current = false;
      }}
      onHome={() => navigate('/')}
    />
  );
}
