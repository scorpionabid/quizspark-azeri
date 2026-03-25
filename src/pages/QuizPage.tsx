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
  const [bookmarkedQuestions, setBookmarkedQuestions] = useState<Set<string>>(new Set());
  
  const { updateXPAsync } = useGamification();

  const timeLeftRef = useRef(timeLeft);
  const transitionTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const questionStartTimeRef = useRef<number>(Date.now());
  const timeUpTriggeredRef = useRef(false);
  const totalTimeUpRef = useRef(false);
  const answersRef = useRef<Answer[]>([]);
  const draftLoadedRef = useRef(false);

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

  // Strict Mode
  useEffect(() => {
    if (quizState === 'playing' && quiz?.strict_mode && !isPreview) {
      const handleVisibilityChange = () => {
        if (document.hidden) {
          toast.warning('Təhlükəsizlik: Səhifəni tərk etdiyiniz üçün xəbərdarlıq qeydə alındı.', { duration: 5000 });
        }
      };
      document.addEventListener("visibilitychange", handleVisibilityChange);
      return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
    }
  }, [quizState, quiz, isPreview]);

  useEffect(() => {
    answersRef.current = answers;
  }, [answers]);

  const completeQuizWithAnswers = useCallback(async (latestAnswers: Answer[]) => {
    if (!isPreview && attemptId && startTime && user && quiz) {
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
        localStorage.removeItem(`quiz_draft_${attemptId}`);
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
      setCurrentPage(prev => prev + 1);
      setShowFeedback(false);
      setShowHint({});
    } else {
      await completeQuizWithAnswers(latestAnswers);
    }
  }, [currentPage, totalPages, completeQuizWithAnswers]);

  const handlePageSubmit = useCallback(async () => {
    if (showFeedback || pageQuestions.length === 0) return;

    const newAnswers: Answer[] = [];
    let anyIncorrect = false;
    let anyCorrect = false;

    pageQuestions.forEach(currentQ => {
      // Avoid re-evaluating if already answered (e.g., backtracking or resuming)
      if (answersRef.current.some(a => a.questionId === currentQ.id)) {
        return; // Already submitted
      }

      const finalVal = localAnswers[currentQ.id] || '';
      let isCorrect = false;

      if (currentQ.question_type === 'essay') {
        isCorrect = false;
      } else if (currentQ.question_type === 'ordering') {
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
        const normalize = (s: string) =>
          s.trim().toLowerCase().replace(/[\s\u00a0]+/g, ' ').replace(/[.,!?;:'"]/g, '');
        const normalizedStudent = normalize(finalVal);
        const acceptedAnswers = currentQ.correct_answer.split('|').map(normalize);
        isCorrect = acceptedAnswers.some(accepted => accepted === normalizedStudent);
      }

      const answer: Answer = {
        questionId: currentQ.id,
        questionType: currentQ.question_type as QuestionType,
        textAnswer: finalVal,
        isCorrect,
        pointsEarned: isCorrect ? (currentQ.weight || 1) : 0,
        selectedOptionIndex: currentQ.options ? currentQ.options.indexOf(finalVal) : undefined,
        needsReview: currentQ.question_type === 'essay',
      };

      newAnswers.push(answer);
      if (isCorrect) anyCorrect = true;
      else anyIncorrect = true;
    });

    setShowFeedback(true);

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
      updateAttempt.mutate({
        attemptId,
        answers: updatedAnswers as unknown as Record<string, string>[],
      });
    }

    if (quiz?.auto_advance && quiz.questions_per_page === 1) {
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
    const orderedQuestions = [...questions];
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

    const totalDurationSecs = (quiz.duration || 20) * 60;
    const elapsed = (Date.now() - startedAt.getTime()) / 1000;
    const remaining = Math.max(0, Math.floor(totalDurationSecs - elapsed));

    if (remaining <= 0) {
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
      if (isPreview) {
        newAttemptId = `preview-${Date.now()}`;
      } else {
        const attempt = await startAttempt.mutateAsync({
          quizId: quiz.id,
          totalQuestions: orderedQuestions.length,
        });
        newAttemptId = attempt.id;
      }

      setAttemptId(newAttemptId);
      const now = new Date();
      setStartTime(now);
      if (!isPreview) {
        localStorage.setItem(`quiz_start_${quiz.id}`, now.toISOString());
      }
      setQuizState('playing');
      setCurrentPage(0);
      setAnswers([]);
      setLocalAnswers({});
      draftLoadedRef.current = false;
      const totalDurationSecs = (quiz.duration || 20) * 60;
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
    const totalDuration = (quiz.duration || 20) * 60;
    const timer = setInterval(() => {
      const now = Date.now();
      const elapsed = (now - startTime.getTime()) / 1000;
      const totalRemaining = Math.max(0, Math.floor(totalDuration - elapsed));
      setTotalTimeLeft(totalRemaining);

      if (totalRemaining <= 0) {
        if (!totalTimeUpRef.current) {
          totalTimeUpRef.current = true;
          void completeQuizWithAnswers(answersRef.current);
        }
        return;
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
      } else {
        setTimeLeft(totalRemaining);
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
  const feedbackEnabled = quiz?.show_feedback !== false;

  const toggleBookmark = (id: string) => {
    setBookmarkedQuestions(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) newSet.delete(id);
      else newSet.add(id);
      return newSet;
    });
  };

  const getPageStatus = (pageIdx: number) => {
    if (pageIdx === currentPage) return 'current';
    const pageSlice = displayQuestions.slice(pageIdx * questionsPerPage, (pageIdx + 1) * questionsPerPage);
    const answeredCount = pageSlice.filter(q => answers.some(a => a.questionId === q.id)).length;
    if (answeredCount === pageSlice.length) return 'completed';
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
        totalTimeLeft={totalTimeLeft}
        localAnswers={localAnswers}
        setLocalAnswers={setLocalAnswers}
        showFeedback={showFeedback}
        showHint={showHint}
        setShowHint={setShowHint}
        handlePageSubmit={handlePageSubmit}
        handleNextPage={() => handleNextPageInternal(answers)}
        handlePrevPage={() => {
            setCurrentPage(prev => Math.max(0, prev - 1));
            setShowFeedback(false);
        }}
        jumpToPage={(idx) => {
            setCurrentPage(idx);
            setShowFeedback(false);
        }}
        onExit={() => {
          if (confirm('Quizi tərk etmək istəyirsiniz? İrəliləyişiniz itiriləcək.')) navigate('/');
        }}
        feedbackEnabled={feedbackEnabled}
        bookmarkedQuestions={bookmarkedQuestions}
        toggleBookmark={toggleBookmark}
        getPageStatus={getPageStatus}
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
      pendingReviews={pendingReviews}
      earnedPoints={totalPoints}
      maxPoints={maxPoints}
      onRetry={() => {
        setQuizState('intro');
        setAttemptId(null);
        setStartTime(null);
        setAnswers([]);
        setCurrentPage(0);
        setLocalAnswers({});
        setBookmarkedQuestions(new Set());
        totalTimeUpRef.current = false;
      }}
      onHome={() => navigate('/')}
    />
  );
}
