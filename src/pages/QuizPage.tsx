import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";

// Hooks & Context
import { useQuiz } from "@/hooks/useQuizzes";
import { useQuestions, Question } from "@/hooks/useQuestions";
import { useMyAttempts, useStartAttempt, useUpdateAttempt, useCompleteAttempt, useExamHeartbeat } from "@/hooks/useQuizAttempts";
import { useAuth } from "@/contexts/AuthContext";
import { useGamification } from "@/hooks/useGamification";
import { useLanguage } from "@/contexts/LanguageContext";

import { Lock, Shield, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageLoader } from "@/components/ui/loading-spinner";
import { EmptyState } from "@/components/ui/empty-state";

// Quiz Sub-components
import { QuizIntro } from "@/components/quiz/QuizIntro";
import { OfficialExamIntro } from "@/components/quiz/OfficialExamIntro";
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
  const { language, t } = useLanguage();

  const { data: quiz, isLoading: quizLoading } = useQuiz(id);
  const { data: questions = [], isLoading: questionsLoading } = useQuestions(quiz?.id, { language });
  const startAttempt = useStartAttempt();
  const updateAttempt = useUpdateAttempt();
  const completeAttempt = useCompleteAttempt();

  const { data: myAttempts, isLoading: attemptsLoading } = useMyAttempts(quiz?.id);
  const [questionOrder, setQuestionOrder] = useState<string[]>([]);

  // Dynamically derive displayQuestions while strictly preserving questionOrder
  const displayQuestions = useMemo(() => {
    if (!questions || questions.length === 0) return [];
    if (questionOrder.length === 0) return questions;
    const qMap = new Map(questions.map((q) => [q.id, q]));
    const ordered: Question[] = [];
    questionOrder.forEach((qId) => {
      const found = qMap.get(qId);
      if (found) {
        ordered.push(found);
      }
    });
    questions.forEach((q) => {
      if (!ordered.some((o) => o.id === q.id)) {
        ordered.push(q);
      }
    });
    return ordered;
  }, [questions, questionOrder]);

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

  const [isOnline, setIsOnline] = useState(typeof navigator !== 'undefined' ? navigator.onLine : true);
  const autoResumeAttemptedRef = useRef(false);
  const debouncedSyncRef = useRef<NodeJS.Timeout | null>(null);
  const examHeartbeat = useExamHeartbeat();

  const timeLeftRef = useRef(timeLeft);
  const transitionTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const questionStartTimeRef = useRef<number>(Date.now());
  const timeUpTriggeredRef = useRef(false);
  const totalTimeUpRef = useRef(false);
  const answersRef = useRef<Answer[]>([]);
  const draftLoadedRef = useRef(false);
  const strictViolationsRef = useRef(0);
  const localAnswersRef = useRef<Record<string, string>>({});
  const isCompletingRef = useRef(false);

  useEffect(() => {
    localAnswersRef.current = localAnswers;
  }, [localAnswers]);

  // Synchronize localAnswers values into new language when language toggles
  const prevLangRef = useRef(language);
  useEffect(() => {
    if (prevLangRef.current !== language) {
      prevLangRef.current = language;
      if (questions.length > 0 && Object.keys(localAnswers).length > 0) {
        setLocalAnswers((prev) => {
          const next = { ...prev };
          let changed = false;
          questions.forEach((q) => {
            const currentVal = next[q.id];
            if (currentVal && q.question_type === 'multiple_choice' && q.options) {
              let matchIdx = -1;
              if (q.base_options) {
                matchIdx = q.base_options.findIndex((b) => b?.trim()?.toLowerCase() === currentVal?.trim()?.toLowerCase());
              }
              if (matchIdx === -1 && q.translation_options) {
                matchIdx = q.translation_options.findIndex((t) => t?.trim()?.toLowerCase() === currentVal?.trim()?.toLowerCase());
              }
              if (matchIdx !== -1 && q.options[matchIdx] && q.options[matchIdx] !== currentVal) {
                next[q.id] = q.options[matchIdx];
                changed = true;
              }
            }
          });
          return changed ? next : prev;
        });
      }
    }
  }, [language, questions, localAnswers]);

  const buildCompleteAnswersFromLocal = useCallback(
    (overrideMap?: Record<string, string>): Answer[] => {
      const activeMap = overrideMap || localAnswersRef.current;
      const activeQs = displayQuestions.length > 0 ? displayQuestions : questions;
      return activeQs.map((q) => {
        const val = activeMap[q.id] || '';
        const evalResult = evaluateAnswer(q, val);
        return {
          questionId: q.id,
          questionType: q.question_type as QuestionType,
          textAnswer: val,
          isCorrect: evalResult.isCorrect,
          pointsEarned: evalResult.pointsEarned,
          selectedOptionIndex: q.options ? q.options.indexOf(val) : undefined,
          needsReview: evalResult.needsReview,
        };
      });
    },
    [displayQuestions, questions]
  );

  // Online / Offline Detection with instant flush on reconnection
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      toast.success(t('online_resumed'));

      // Instant flush to server on reconnect
      if (attemptId && Object.keys(localAnswersRef.current).length > 0 && !isPreview) {
        const answersArray = buildCompleteAnswersFromLocal(localAnswersRef.current);
        setAnswers(answersArray);
        updateAttempt.mutate({
          attemptId,
          answers: answersArray as unknown as Record<string, string>[],
          currentQuestionIndex: currentPageRef.current,
        });
      }
    };
    const handleOffline = () => {
      setIsOnline(false);
      toast.error(t('offline_warning'));
    };
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [attemptId, isPreview, buildCompleteAnswersFromLocal, updateAttempt, t]);

  const sendHeartbeatRef = useRef(examHeartbeat.mutate);
  sendHeartbeatRef.current = examHeartbeat.mutate;
  const updateAttemptMutateRef = useRef(updateAttempt.mutate);
  updateAttemptMutateRef.current = updateAttempt.mutate;
  const currentPageRef = useRef(currentPage);
  currentPageRef.current = currentPage;

  // Auto-Save Draft to LocalStorage + Debounced DB Sync
  useEffect(() => {
    if (attemptId && quizState === 'playing' && Object.keys(localAnswers).length > 0 && !isPreview) {
      // 1. Immediate local backup
      localStorage.setItem(`quiz_draft_${attemptId}`, JSON.stringify(localAnswers));

      // 2. Debounced DB Sync
      if (debouncedSyncRef.current) {
        clearTimeout(debouncedSyncRef.current);
      }
      debouncedSyncRef.current = setTimeout(() => {
        const answersArray = buildCompleteAnswersFromLocal(localAnswers);
        setAnswers(answersArray);
        updateAttemptMutateRef.current({
          attemptId,
          answers: answersArray as unknown as Record<string, string>[],
          currentQuestionIndex: currentPageRef.current,
        });
      }, 1500);
    }

    return () => {
      if (debouncedSyncRef.current) {
        clearTimeout(debouncedSyncRef.current);
      }
    };
  }, [localAnswers, attemptId, quizState, isPreview, buildCompleteAnswersFromLocal]);

  // 20-second Heartbeat interval
  useEffect(() => {
    if (quizState === 'playing' && attemptId && !isPreview) {
      sendHeartbeatRef.current({
        attemptId,
        questionIndex: currentPageRef.current + 1,
        tabSwitches: strictViolationsRef.current,
      });

      const interval = setInterval(() => {
        sendHeartbeatRef.current({
          attemptId,
          questionIndex: currentPageRef.current + 1,
          tabSwitches: strictViolationsRef.current,
        });
      }, 20000);

      return () => clearInterval(interval);
    }
  }, [quizState, attemptId, isPreview]);

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

  const isLoading = quizLoading || questionsLoading || (quiz?.exam_category === 'official_exam' && attemptsLoading);

  useEffect(() => {
    answersRef.current = answers;
  }, [answers]);

  const completeQuizWithAnswers = useCallback((overrideAnswers?: Answer[]) => {
    if (isCompletingRef.current) return;
    isCompletingRef.current = true;

    const latestAnswers = overrideAnswers || buildCompleteAnswersFromLocal();
    setAnswers(latestAnswers);

    if (!isPreview && attemptId && startTime && user && quiz) {
      const timeSpent = Math.floor((new Date().getTime() - startTime.getTime()) / 1000);
      setTimeSpent(timeSpent);
      const earnedPoints = latestAnswers.reduce((sum, a) => sum + (a.pointsEarned || 0), 0);
      const maxPoints = displayQuestions.reduce((sum, q) => sum + (q.weight ?? 1), 0);
      const weightedScore = maxPoints > 0 ? Math.round((earnedPoints / maxPoints) * 100) : 0;

      // Instant UI transition to result screen (0ms latency for candidate)
      setQuizState('result');

      // Execute background database persistence asynchronously
      (async () => {
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

          // Audit log for quiz completion
          try {
            await supabase.from('audit_logs').insert({
              user_id: user.id,
              action: 'quiz_completed',
              entity_type: 'quiz_attempt',
              entity_id: attemptId,
              description: `İmtahan tamamlandı. Nəticə: ${weightedScore}%`,
              new_values: {
                score: weightedScore,
                total_questions: displayQuestions.length,
                time_spent: timeSpent,
                completed_at: new Date().toISOString(),
              },
            });
          } catch (logErr) {
            console.warn("Could not insert completion audit log:", logErr);
          }

          const xpGain = Math.round(weightedScore * 0.1 * displayQuestions.length) + (weightedScore === 100 ? 50 : 0);
          setEarnedXP(prev => prev + xpGain);
          if (xpGain > 0) {
            await updateXPAsync(xpGain);
          }
        } catch (error) {
          console.error("Error completing quiz in background:", error);
        }
      })();
    } else {
      setQuizState('result');
    }
  }, [isPreview, attemptId, startTime, user, quiz, displayQuestions, completeAttempt, updateXPAsync]);

  // Soft Strict Mode & Anti-cheat logging (Does NOT cut candidate exam short)
  useEffect(() => {
    if (quizState === 'playing' && !isPreview && attemptId && user) {
      const handleVisibilityChange = async () => {
        if (document.hidden) {
          strictViolationsRef.current += 1;
          const count = strictViolationsRef.current;

          try {
            await supabase.from('audit_logs').insert({
              user_id: user.id,
              action: 'tab_switch_detected',
              entity_type: 'quiz_attempt',
              entity_id: attemptId,
              description: `İştirakçı imtahan pəncərəsini tərk etdi (${count}-ci dəfə)`,
              new_values: {
                violation_count: count,
                current_page: currentPage + 1,
                timestamp: new Date().toISOString(),
              },
            });
          } catch (logErr) {
            console.warn('Could not insert audit log:', logErr);
          }

          toast.warning(
            `Xəbərdarlıq (${count}): İmtahan pəncərəsini tərk etdiniz! Fəaliyyətiniz sistemdə qeydə alınır və nəzarətçi tərəfindən izlənilir.`,
            { duration: 6000 }
          );
        }
      };

      document.addEventListener("visibilitychange", handleVisibilityChange);
      return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
    }
  }, [quizState, isPreview, attemptId, user, currentPage]);

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
      const isInstant = quiz?.feedback_timing === 'instant' && quiz?.exam_category !== 'official_exam';
      const targetSlice = displayQuestions.slice(nextPage * questionsPerPage, (nextPage + 1) * questionsPerPage);
      const isAlreadyAnswered = targetSlice.length > 0 && targetSlice.every(q => latestAnswers.some(a => a.questionId === q.id && a.textAnswer && a.textAnswer.trim().length > 0));
      setShowFeedback(Boolean(isAlreadyAnswered && isInstant));
      setShowHint({});
    } else {
      await completeQuizWithAnswers(latestAnswers);
    }
  }, [currentPage, totalPages, completeQuizWithAnswers, displayQuestions, questionsPerPage, quiz]);

  const handlePageSubmit = useCallback(async (overrideAnswers?: Record<string, string>) => {
    if (showFeedback || pageQuestions.length === 0) return;

    const currentAnswersMap = overrideAnswers || localAnswers;
    const pageQuestionIds = new Set(pageQuestions.map(q => q.id));
    const newAnswers: Answer[] = [];
    let anyIncorrect = false;
    let anyCorrect = false;

    pageQuestions.forEach(currentQ => {
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

    const isInstant = (quiz?.feedback_timing === 'instant' && quiz?.exam_category !== 'official_exam');

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

    // Upsert: replace any previous answers for questions on the current page
    const existingOtherAnswers = answersRef.current.filter(a => !pageQuestionIds.has(a.questionId));
    const updatedAnswers = [...existingOtherAnswers, ...newAnswers];
    setAnswers(updatedAnswers);

    if (attemptId && !isPreview && updatedAnswers.length > 0) {
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
  }, [showFeedback, pageQuestions, localAnswers, attemptId, quiz, isPreview, updateAttempt, handleNextPageInternal]);

  const resumeQuiz = useCallback(async (attempt: import('@/hooks/useQuizAttempts').QuizAttempt) => {
    if (!quiz) return;

    const storedOrder = attempt.question_order || (() => {
      try {
        const raw = localStorage.getItem(`quiz_order_${attempt.id}`);
        return raw ? (JSON.parse(raw) as string[]) : null;
      } catch {
        return null;
      }
    })();

    if (storedOrder && Array.isArray(storedOrder) && storedOrder.length > 0) {
      setQuestionOrder(storedOrder);
    } else {
      setQuestionOrder(questions.map((q) => q.id));
    }

    totalTimeUpRef.current = false;

    const prevAnswers = (attempt.answers || []) as unknown as Answer[];
    setAnswers(prevAnswers);
    setAttemptId(attempt.id);

    if (attempt.tab_switch_count) {
      strictViolationsRef.current = attempt.tab_switch_count;
    }

    const initialLocalAnswers: Record<string, string> = {};
    prevAnswers.forEach(ans => {
      initialLocalAnswers[ans.questionId] = ans.textAnswer || '';
    });
    try {
      const savedDraft = localStorage.getItem(`quiz_draft_${attempt.id}`);
      if (savedDraft) {
        const parsed = JSON.parse(savedDraft);
        if (parsed && typeof parsed === 'object') {
          Object.assign(initialLocalAnswers, parsed);
        }
      }
    } catch (e) {
      console.warn("Could not load local draft:", e);
    }
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

    const qPerPage = quiz?.questions_per_page && quiz.questions_per_page > 0 ? quiz.questions_per_page : (questions.length || 1);
    let targetPage = 0;
    if (attempt.current_question_index != null && attempt.current_question_index >= 0) {
      targetPage = Math.min(attempt.current_question_index, Math.max(0, Math.ceil((storedOrder?.length || questions.length) / qPerPage) - 1));
    } else {
      const nextIdx = Math.min(Object.keys(initialLocalAnswers).length, (storedOrder?.length || questions.length) - 1);
      targetPage = Math.floor(nextIdx / qPerPage);
    }
    setCurrentPage(targetPage);
    
    setTotalTimeLeft(remaining);
    setTimeLeft(remaining);
    setShowFeedback(false);
    setShowHint({});
    setQuizState('playing');
  }, [quiz, questions, completeQuizWithAnswers]);

  // Seamless Auto-Resume on Page Load / Refresh
  useEffect(() => {
    if (quizState === 'intro' && myAttempts && questions.length > 0 && !isPreview && !autoResumeAttemptedRef.current) {
      const incomplete = myAttempts.find(a => a.completed_at === null);
      if (incomplete) {
        autoResumeAttemptedRef.current = true;
        void resumeQuiz(incomplete);
      }
    }
  }, [quizState, myAttempts, questions.length, isPreview, resumeQuiz]);

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

    const shuffled = quiz.shuffle_questions
      ? [...questions].sort(() => Math.random() - 0.5)
      : [...questions];
    const questionOrderIds = shuffled.map((q) => q.id);
    setQuestionOrder(questionOrderIds);
    totalTimeUpRef.current = false;

    try {
      let newAttemptId: string;

      if (isPreview) {
        newAttemptId = `preview-${Date.now()}`;
      } else {
        const attempt = await startAttempt.mutateAsync({
          quizId: quiz.id,
          totalQuestions: questionOrderIds.length,
          questionOrder: questionOrderIds,
        });
        newAttemptId = attempt.id;
      }

      setAttemptId(newAttemptId);
      localStorage.setItem(`quiz_order_${newAttemptId}`, JSON.stringify(questionOrderIds));
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
            void completeQuizWithAnswers();
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
  const feedbackEnabled = quiz?.exam_category !== 'official_exam' && quiz?.show_feedback !== false && quiz?.feedback_timing !== 'never';

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

    const isAllAnswered = pageSlice.every(q => {
      const val = localAnswers[q.id];
      return typeof val === 'string' && val.trim().length > 0;
    });

    if (pageIdx === currentPage) return 'current';

    if (isAllAnswered) {
      const isInstant = quiz?.feedback_timing === 'instant' && quiz?.exam_category !== 'official_exam';
      if (isInstant) {
        const pageAnswers = pageSlice
          .map(q => answers.find(a => a.questionId === q.id))
          .filter((a): a is Answer => Boolean(a));
        const allCorrect = pageAnswers.length === pageSlice.length && pageAnswers.every(a => a.isCorrect);
        return allCorrect ? 'correct' : 'incorrect';
      }
      return 'completed';
    }

    return 'pending';
  };

  if (isLoading) return <div className="min-h-screen bg-gradient-hero"><PageLoader text="Quiz yüklənir..." /></div>;
  if (!quiz) return <div className="flex-1 bg-background p-8 flex flex-col items-center justify-center"><EmptyState icon="😕" title="Quiz tapılmadı" description="Bu quiz mövcud deyil və ya silinib." action={{ label: "Ana Səhifəyə Qayıt", onClick: () => navigate('/') }} /></div>;

  // Official Exam direct access protection
  if (quiz.exam_category === 'official_exam') {
    if (isPreview || !user) {
      return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-6 flex items-center justify-center">
          <div className="max-w-md w-full text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-xl space-y-4">
            <div className="w-14 h-14 mx-auto rounded-full bg-blue-100 dark:bg-blue-950/60 text-blue-600 flex items-center justify-center">
              <Shield className="w-7 h-7" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Rəsmi İmtahan Portalı</h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Bu rəsmi vakant vəzifələr üzrə imtahandır. Suallar yalnız imtahan zalında FİN kod və nəzarətçi kodu ilə portala daxil olduqda açılır.
            </p>
            <Button
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold h-11 rounded-xl shadow-lg shadow-blue-600/20"
              onClick={() => navigate('/imtahan')}
            >
              Rəsmi İmtahan Portalına Keç
            </Button>
          </div>
        </div>
      );
    }
  }

  // Check completed official exam attempt
  const incompleteAttempt = myAttempts?.find((a) => a.completed_at === null);
  const completedAttempt = myAttempts?.find((a) => a.completed_at !== null);

  if (
    quiz.exam_category === 'official_exam' &&
    completedAttempt &&
    !incompleteAttempt &&
    quizState === 'intro' &&
    !isLoading
  ) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-6 flex items-center justify-center">
        <div className="max-w-md w-full text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 shadow-lg space-y-4">
          <div className="w-12 h-12 mx-auto rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">{t('already_completed')}</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {language === 'ka'
              ? 'ამ პირადი ნომრით გამოცდა უკვე ჩაბარებულია.'
              : 'Bu FİN kod ilə imtahan artıq təhvil verilib.'}
          </p>
          <Button
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold h-10 rounded-xl"
            onClick={() => navigate('/imtahan')}
          >
            {t('exit_btn')}
          </Button>
        </div>
      </div>
    );
  }

  if (quizState === 'intro') {
    if (quiz.exam_category === 'official_exam') {
      return (
        <OfficialExamIntro
          quiz={quiz}
          user={user}
          onStart={startQuiz}
          isPending={startAttempt.isPending}
        />
      );
    }
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
        allQuestions={displayQuestions.length > 0 ? displayQuestions : questions}
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
            const isInstant = quiz?.feedback_timing === 'instant' && quiz?.exam_category !== 'official_exam';
            const targetSlice = displayQuestions.slice(prevPage * questionsPerPage, (prevPage + 1) * questionsPerPage);
            const isAlreadyAnswered = targetSlice.length > 0 && targetSlice.every(q => Boolean(localAnswers[q.id]?.trim()?.length));
            setShowFeedback(Boolean(isAlreadyAnswered && isInstant));
        }}
        jumpToPage={(idx) => {
            setCurrentPage(idx);
            const isInstant = quiz?.feedback_timing === 'instant' && quiz?.exam_category !== 'official_exam';
            const targetSlice = displayQuestions.slice(idx * questionsPerPage, (idx + 1) * questionsPerPage);
            const isAlreadyAnswered = targetSlice.length > 0 && targetSlice.every(q => Boolean(localAnswers[q.id]?.trim()?.length));
            setShowFeedback(Boolean(isAlreadyAnswered && isInstant));
        }}
        onExit={() => navigate(quiz.exam_category === 'official_exam' ? '/imtahan' : '/')}
        feedbackEnabled={feedbackEnabled}
        bookmarkedQuestions={bookmarkedQuestions}
        toggleBookmark={toggleBookmark}
        getPageStatus={getPageStatus}
        isOnline={isOnline}
        isSyncing={updateAttempt.isPending}
        onFinalSubmit={() => void completeQuizWithAnswers()}
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
      isOfficialExam={quiz?.exam_category === 'official_exam'}
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
      onHome={() => navigate(quiz?.exam_category === 'official_exam' ? '/imtahan' : '/')}
    />
  );
}
