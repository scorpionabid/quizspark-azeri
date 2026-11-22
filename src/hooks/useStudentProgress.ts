import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useState } from 'react';
import { toast } from 'sonner';

export interface TopicMastery {
  topic: string;
  category: string;
  totalQuestions: number;
  correctCount: number;
  accuracy: number; // 0 - 100
  level: 'master' | 'improving' | 'weak';
  lastPracticed: string | null;
  daysSincePractice: number;
}

export interface ErrorNotebookItem {
  id: string;
  questionId: string;
  quizId: string;
  quizTitle: string;
  subject: string;
  topic: string;
  questionText: string;
  options: string[];
  studentAnswer: string;
  correctAnswer: string;
  explanation: string;
  attemptDate: string;
  isResolved: boolean;
  rootCause?: 'theory' | 'careless' | 'time';
}

export interface DailyGoal {
  id: string;
  title: string;
  description: string;
  target: number;
  current: number;
  completed: boolean;
  xpReward: number;
  type: 'quiz' | 'error_review' | 'weak_topic_practice';
}

export interface RoadmapStep {
  day: number;
  title: string;
  focusTopic: string;
  description: string;
  estimatedMinutes: number;
  status: 'completed' | 'in_progress' | 'upcoming';
  actionType: 'theory' | 'practice' | 'remedial_quiz' | 'mock_test';
}

export interface StudentGrowthOverview {
  overallAccuracy: number;
  totalQuizzesTaken: number;
  totalQuestionsAnswered: number;
  totalMistakesRecorded: number;
  resolvedMistakesCount: number;
  weakTopicsCount: number;
  masteredTopicsCount: number;
  streakDays: number;
  comebackMasterXP: number;
}

export function useStudentProgress() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Local storage for goals & resolved errors
  const [resolvedErrors, setResolvedErrors] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem(`quiz_resolved_errors_${user?.id}`);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const [completedGoals, setCompletedGoals] = useState<Record<string, boolean>>(() => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const saved = localStorage.getItem(`quiz_daily_goals_${user?.id}_${today}`);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Main data fetching query: combines attempts, quiz metadata, and questions
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['student_comprehensive_progress', user?.id || 'guest'],
    queryFn: async () => {
      const sampleTopics: TopicMastery[] = [
        { topic: 'Cəbr və Tənliklər', category: 'Riyaziyyat', totalQuestions: 15, correctCount: 13, accuracy: 87, level: 'master', lastPracticed: new Date(Date.now() - 86400000).toISOString(), daysSincePractice: 1 },
        { topic: 'Həndəsə və Fiqurlar', category: 'Riyaziyyat', totalQuestions: 12, correctCount: 5, accuracy: 42, level: 'weak', lastPracticed: new Date(Date.now() - 172800000).toISOString(), daysSincePractice: 2 },
        { topic: 'Qrammatika və Morfologiya', category: 'Azərbaycan Dili', totalQuestions: 20, correctCount: 17, accuracy: 85, level: 'master', lastPracticed: new Date(Date.now() - 86400000).toISOString(), daysSincePractice: 1 },
        { topic: 'Sintaksis və Cümlə Üzvləri', category: 'Azərbaycan Dili', totalQuestions: 14, correctCount: 7, accuracy: 50, level: 'weak', lastPracticed: new Date(Date.now() - 259200000).toISOString(), daysSincePractice: 3 },
        { topic: 'Məntiq və Analitik Düşüncə', category: 'Məntiq', totalQuestions: 18, correctCount: 14, accuracy: 78, level: 'improving', lastPracticed: new Date(Date.now() - 86400000).toISOString(), daysSincePractice: 1 },
        { topic: 'Vocabulary & Reading', category: 'İngilis Dili', totalQuestions: 16, correctCount: 14, accuracy: 88, level: 'master', lastPracticed: new Date(Date.now() - 345600000).toISOString(), daysSincePractice: 4 },
        { topic: 'Mexanika və Hərəkət', category: 'Fizika', totalQuestions: 10, correctCount: 4, accuracy: 40, level: 'weak', lastPracticed: new Date(Date.now() - 172800000).toISOString(), daysSincePractice: 2 },
      ];

      const sampleErrors: ErrorNotebookItem[] = [
        {
          id: 'demo_err_1',
          questionId: 'demo_q_1',
          quizId: 'demo_quiz_1',
          quizTitle: 'Həndəsə: Üçbucaqlar və Bərabərsizliklər',
          subject: 'Riyaziyyat',
          topic: 'Həndəsə və Fiqurlar',
          questionText: 'Düzbucaqlı üçbucağın katetləri 6 sm və 8 sm-dir. Hipotenuzun uzunluğunu tapın.',
          options: ['9 sm', '10 sm', '12 sm', '14 sm'],
          studentAnswer: '9 sm',
          correctAnswer: '10 sm',
          explanation: 'Pifaqor teoreminə görə: c² = a² + b² = 6² + 8² = 36 + 64 = 100. c = √100 = 10 sm.',
          attemptDate: new Date(Date.now() - 172800000).toISOString(),
          isResolved: false,
        },
        {
          id: 'demo_err_2',
          questionId: 'demo_q_2',
          quizId: 'demo_quiz_2',
          quizTitle: 'Azərbaycan Dili: Cümlənin Baş Üzvləri',
          subject: 'Azərbaycan Dili',
          topic: 'Sintaksis və Cümlə Üzvləri',
          questionText: '"Gözəl oxumaq hər kəsin bacarığı deyil" cümləsində mübtəda nə ilə ifadə olunub?',
          options: ['İsimlə', 'Məsdərlə', 'Sifətlə', 'Feli sifətlə'],
          studentAnswer: 'Sifətlə',
          correctAnswer: 'Məsdərlə',
          explanation: '"Oxumaq" sözü məsdərdir və cümlədə mübtəda vəzifəsində çıxış etmişdir.',
          attemptDate: new Date(Date.now() - 259200000).toISOString(),
          isResolved: false,
        },
        {
          id: 'demo_err_3',
          questionId: 'demo_q_3',
          quizId: 'demo_quiz_3',
          quizTitle: 'Fizika: Nyuton Qanunları',
          subject: 'Fizika',
          topic: 'Mexanika və Hərəkət',
          questionText: 'Kütləsi 4 kq olan cismə 12 N qüvvə təsir edir. Cismin təcilini hesablayın.',
          options: ['2 m/s²', '3 m/s²', '4 m/s²', '48 m/s²'],
          studentAnswer: '48 m/s²',
          correctAnswer: '3 m/s²',
          explanation: 'Nyutonun 2-ci qanununa görə a = F / m = 12 / 4 = 3 m/s².',
          attemptDate: new Date(Date.now() - 172800000).toISOString(),
          isResolved: false,
        },
      ];

      const sampleWeak = sampleTopics.filter(t => t.level === 'weak');
      const sampleStrong = sampleTopics.filter(t => t.level === 'master');

      if (!user) {
        return {
          isDemoMode: true,
          topicMastery: sampleTopics,
          weakTopics: sampleWeak,
          strongTopics: sampleStrong,
          errorNotebook: sampleErrors,
          spacedRepetitionQueue: sampleWeak,
          overview: {
            overallAccuracy: 72,
            totalQuizzesTaken: 5,
            totalQuestionsAnswered: 105,
            totalMistakesRecorded: sampleErrors.length,
            resolvedMistakesCount: 1,
            weakTopicsCount: sampleWeak.length,
            masteredTopicsCount: sampleStrong.length,
            streakDays: 3,
            comebackMasterXP: 150,
          } as StudentGrowthOverview,
        };
      }

      // 1. Fetch all completed quiz attempts for this user
      const { data: attempts, error: attemptsError } = await supabase
        .from('quiz_attempts')
        .select('id, quiz_id, started_at, completed_at, score, total_questions, time_spent, answers')
        .eq('user_id', user.id)
        .not('completed_at', 'is', null)
        .order('completed_at', { ascending: false });

      if (attemptsError) throw attemptsError;

      if (!attempts || attempts.length === 0) {
        return {
          isDemoMode: true,
          topicMastery: sampleTopics,
          weakTopics: sampleWeak,
          strongTopics: sampleStrong,
          errorNotebook: sampleErrors,
          spacedRepetitionQueue: sampleWeak,
          overview: {
            overallAccuracy: 72,
            totalQuizzesTaken: 5,
            totalQuestionsAnswered: 105,
            totalMistakesRecorded: sampleErrors.length,
            resolvedMistakesCount: 1,
            weakTopicsCount: sampleWeak.length,
            masteredTopicsCount: sampleStrong.length,
            streakDays: 3,
            comebackMasterXP: 150,
          } as StudentGrowthOverview,
        };
      }

      // 2. Extract unique quiz IDs and fetch quiz details
      const quizIds = Array.from(new Set(attempts.map(a => a.quiz_id)));
      const { data: quizzes } = await supabase
        .from('quizzes')
        .select('id, title, subject, difficulty')
        .in('id', quizIds);

      const quizMap = new Map(quizzes?.map(q => [q.id, q]) || []);

      // 3. Fetch questions for these quizzes
      const { data: questions } = await supabase
        .from('questions')
        .select('id, quiz_id, question_text, options, correct_answer, explanation, topic, order_index')
        .in('quiz_id', quizIds);

      const questionMap = new Map(questions?.map(q => [q.id, q]) || []);

      // 4. Also group questions by quiz_id + index in case attempt stored by index
      const quizQuestionsMap = new Map<string, typeof questions>();
      questions?.forEach(q => {
        const list = quizQuestionsMap.get(q.quiz_id) || [];
        list.push(q);
        quizQuestionsMap.set(q.quiz_id, list);
      });

      // 5. Aggregate topic statistics & extract error notebook items
      const topicStatsMap: Record<string, {
        category: string;
        total: number;
        correct: number;
        lastPracticed: string | null;
      }> = {};

      const errorItems: ErrorNotebookItem[] = [];
      let totalQuestionsAnswered = 0;
      let totalCorrectAnswers = 0;

      attempts.forEach((attempt) => {
        const quizInfo = quizMap.get(attempt.quiz_id);
        const subject = quizInfo?.subject || 'Ümumi';
        const quizQuestions = quizQuestionsMap.get(attempt.quiz_id) || [];

        // Parse answers
        const userAnswers = attempt.answers as unknown as Array<Record<string, string>> | undefined;

        if (Array.isArray(userAnswers) && userAnswers.length > 0) {
          userAnswers.forEach((ansObj, idx) => {
            totalQuestionsAnswered++;
            // Answer format can be { questionId: answer } or { question_id: "...", selected: "..." }
            let qId = ansObj?.question_id || ansObj?.questionId;
            const selectedAnswer = ansObj?.selected || ansObj?.answer || Object.values(ansObj)[0];

            if (!qId && quizQuestions[idx]) {
              qId = quizQuestions[idx].id;
            }

            const qData = qId ? questionMap.get(qId) : quizQuestions[idx];
            const topic = qData?.topic || subject || 'Əsas anlayışlar';
            const correctAnswer = qData?.correct_answer || '';
            const isCorrect = selectedAnswer && correctAnswer && String(selectedAnswer).trim().toLowerCase() === String(correctAnswer).trim().toLowerCase();

            if (isCorrect) {
              totalCorrectAnswers++;
            }

            // Topic aggregation
            if (!topicStatsMap[topic]) {
              topicStatsMap[topic] = {
                category: subject,
                total: 0,
                correct: 0,
                lastPracticed: attempt.completed_at,
              };
            }

            topicStatsMap[topic].total += 1;
            if (isCorrect) {
              topicStatsMap[topic].correct += 1;
            }

            if (attempt.completed_at && (!topicStatsMap[topic].lastPracticed || new Date(attempt.completed_at) > new Date(topicStatsMap[topic].lastPracticed!))) {
              topicStatsMap[topic].lastPracticed = attempt.completed_at;
            }

            // If wrong answer and question exists, record in Error Notebook
            if (!isCorrect && qData) {
              let parsedOptions: string[] = [];
              try {
                if (Array.isArray(qData.options)) {
                  parsedOptions = qData.options.map(opt => typeof opt === 'string' ? opt : (typeof opt === 'object' && opt !== null && 'text' in opt ? String((opt as { text: unknown }).text) : String(opt)));
                }
              } catch {
                parsedOptions = [];
              }

              errorItems.push({
                id: `${attempt.id}_${qData.id}_${idx}`,
                questionId: qData.id,
                quizId: attempt.quiz_id,
                quizTitle: quizInfo?.title || 'Sınaq İmtahanı',
                subject,
                topic,
                questionText: qData.question_text || 'Sual mətni',
                options: parsedOptions,
                studentAnswer: String(selectedAnswer || 'Cavab verilməyib'),
                correctAnswer: String(correctAnswer),
                explanation: qData.explanation || 'Bu sual üçün əlavə izahat qeyd olunmayıb.',
                attemptDate: attempt.completed_at || attempt.started_at,
                isResolved: !!resolvedErrors[qData.id],
              });
            }
          });
        } else {
          // If detailed answers not available, calculate based on score & quiz subject
          const totalQ = attempt.total_questions || 10;
          const score = attempt.score || 0; // percentage
          const correctQ = Math.round((score / 100) * totalQ);

          totalQuestionsAnswered += totalQ;
          totalCorrectAnswers += correctQ;

          const topic = subject;
          if (!topicStatsMap[topic]) {
            topicStatsMap[topic] = {
              category: subject,
              total: 0,
              correct: 0,
              lastPracticed: attempt.completed_at,
            };
          }
          topicStatsMap[topic].total += totalQ;
          topicStatsMap[topic].correct += correctQ;
        }
      });

      // Transform topic mastery
      const now = new Date().getTime();
      const topicMasteryList: TopicMastery[] = Object.entries(topicStatsMap).map(([topic, stat]) => {
        const accuracy = stat.total > 0 ? Math.round((stat.correct / stat.total) * 100) : 0;
        const daysSince = stat.lastPracticed 
          ? Math.max(0, Math.floor((now - new Date(stat.lastPracticed).getTime()) / (1000 * 60 * 60 * 24)))
          : 0;

        let level: 'master' | 'improving' | 'weak' = 'improving';
        if (accuracy >= 80) level = 'master';
        else if (accuracy < 60) level = 'weak';

        return {
          topic,
          category: stat.category,
          totalQuestions: stat.total,
          correctCount: stat.correct,
          accuracy,
          level,
          lastPracticed: stat.lastPracticed,
          daysSincePractice: daysSince,
        };
      });

      // Filter weak and strong
      const weakTopics = topicMasteryList
        .filter(t => t.level === 'weak' || (t.accuracy < 65 && t.totalQuestions >= 2))
        .sort((a, b) => a.accuracy - b.accuracy);

      const strongTopics = topicMasteryList
        .filter(t => t.level === 'master')
        .sort((a, b) => b.accuracy - a.accuracy);

      // Spaced repetition queue (topics practiced > 3 days ago or weak topics practiced > 1 day ago)
      const spacedRepetitionQueue = topicMasteryList.filter(t => {
        if (t.level === 'weak' && t.daysSincePractice >= 1) return true;
        if (t.level === 'improving' && t.daysSincePractice >= 3) return true;
        if (t.level === 'master' && t.daysSincePractice >= 7) return true;
        return false;
      });

      const overallAccuracy = totalQuestionsAnswered > 0
        ? Math.round((totalCorrectAnswers / totalQuestionsAnswered) * 100)
        : 0;

      const resolvedCount = errorItems.filter(e => e.isResolved).length;

      return {
        topicMastery: topicMasteryList,
        weakTopics,
        strongTopics,
        errorNotebook: errorItems,
        spacedRepetitionQueue,
        overview: {
          overallAccuracy,
          totalQuizzesTaken: attempts.length,
          totalQuestionsAnswered,
          totalMistakesRecorded: errorItems.length,
          resolvedMistakesCount: resolvedCount,
          weakTopicsCount: weakTopics.length,
          masteredTopicsCount: strongTopics.length,
          streakDays: Math.min(attempts.length, 5),
          comebackMasterXP: resolvedCount * 50,
        },
      };
    },
  });

  // Mark error as reviewed / resolved
  const markErrorResolved = (questionId: string) => {
    const updated = { ...resolvedErrors, [questionId]: true };
    setResolvedErrors(updated);
    if (user?.id) {
      localStorage.setItem(`quiz_resolved_errors_${user.id}`, JSON.stringify(updated));
    }
    toast.success('Səhv analiz edildi və bərpa olundu! (+50 XP)');
    queryClient.invalidateQueries({ queryKey: ['student_comprehensive_progress'] });
  };

  // Toggle daily goal
  const toggleDailyGoal = (goalId: string) => {
    const today = new Date().toISOString().split('T')[0];
    const updated = { ...completedGoals, [goalId]: !completedGoals[goalId] };
    setCompletedGoals(updated);
    if (user?.id) {
      localStorage.setItem(`quiz_daily_goals_${user.id}_${today}`, JSON.stringify(updated));
    }
    if (updated[goalId]) {
      toast.success('Hədəf tamamlandı! Təbriklər!');
    }
  };

  // Default Daily Goals based on current user weak areas
  const defaultDailyGoals: DailyGoal[] = [
    {
      id: 'goal_daily_quiz',
      title: 'Gündəlik Sınaq',
      description: 'Ən azı 1 tam sınaq imtahanında iştirak et',
      target: 1,
      current: (data?.overview?.totalQuizzesTaken || 0) > 0 ? 1 : 0,
      completed: !!completedGoals['goal_daily_quiz'],
      xpReward: 100,
      type: 'quiz',
    },
    {
      id: 'goal_error_review',
      title: 'Səhvlərin Təhlili',
      description: 'Səhvlər dəftərindən 2 sualı AI ilə analiz et',
      target: 2,
      current: (data?.overview?.resolvedMistakesCount || 0) >= 2 ? 2 : (data?.overview?.resolvedMistakesCount || 0),
      completed: !!completedGoals['goal_error_review'],
      xpReward: 80,
      type: 'error_review',
    },
    {
      id: 'goal_weak_practice',
      title: 'Zəif Mövzunu Gücləndir',
      description: data?.weakTopics?.[0]?.topic
        ? `"${data.weakTopics[0].topic}" mövzusunda mini-sınaq işlə`
        : 'Zəif mövzu üzrə 5 sual həll et',
      target: 1,
      current: 0,
      completed: !!completedGoals['goal_weak_practice'],
      xpReward: 120,
      type: 'weak_topic_practice',
    },
  ];

  // Default 7-day adaptive roadmap
  const defaultRoadmap: RoadmapStep[] = [
    {
      day: 1,
      title: 'Zəifliklərin Diaqnostikası və Təməl Analiz',
      focusTopic: data?.weakTopics?.[0]?.topic || 'Əsas Mövzular',
      description: 'Son sınaqlarda edilən səhvləri AI Tyutor ilə müzakirə et və təməl qaydaları xatırla.',
      estimatedMinutes: 15,
      status: 'completed',
      actionType: 'theory',
    },
    {
      day: 2,
      title: 'Fokus Mövzu üzrə Mini-Sınaq',
      focusTopic: data?.weakTopics?.[0]?.topic || 'Zəif Mövzu #1',
      description: 'Zəif nəticə göstərdiyiniz mövzudan 5 ədəd asan və orta səviyyəli sual həll edin.',
      estimatedMinutes: 20,
      status: 'in_progress',
      actionType: 'practice',
    },
    {
      day: 3,
      title: 'Sokratik AI ilə Çətin Sualların İzahı',
      focusTopic: data?.weakTopics?.[1]?.topic || data?.weakTopics?.[0]?.topic || 'Mürəkkəb Konseptlər',
      description: 'Düstur və qaydaların tətbiqində yaranan çaşqınlıqları aradan qaldırın.',
      estimatedMinutes: 15,
      status: 'upcoming',
      actionType: 'theory',
    },
    {
      day: 4,
      title: 'Aralıqlı Təkrar və Səhvlər Dəftəri İmtahanı',
      focusTopic: 'Bütün Səhvlər',
      description: 'Səhvlər dəftərinizdə qalan sualları yenidən həll edərək 90%+ nəticə əldə edin.',
      estimatedMinutes: 25,
      status: 'upcoming',
      actionType: 'remedial_quiz',
    },
    {
      day: 5,
      title: 'Tətbiq və Praktiki Məsələlər',
      focusTopic: data?.strongTopics?.[0]?.topic || 'Qarışıq Mövzular',
      description: 'Güclü və zəif mövzuların sintezindən ibarət kompleks testlər.',
      estimatedMinutes: 20,
      status: 'upcoming',
      actionType: 'practice',
    },
    {
      day: 6,
      title: 'Sürət və Dəqiqlik Simulyasiyası',
      focusTopic: 'Vaxt İdarəetməsi',
      description: 'Hər suala 60 saniyə limitlə sürətli düşünmə vərdişini inkişaf etdirin.',
      estimatedMinutes: 20,
      status: 'upcoming',
      actionType: 'practice',
    },
    {
      day: 7,
      title: 'Yekun Bərpa Sınağı və "Usta" Dərəcəsi',
      focusTopic: 'Bütün Mövzular',
      description: 'Həftəlik tərəqqini qiymətləndirən yekun sınaq. 80%+ nəticə ilə +200 Comeback XP qazanın!',
      estimatedMinutes: 30,
      status: 'upcoming',
      actionType: 'mock_test',
    },
  ];

  return {
    isLoading,
    isDemoMode: !!data?.isDemoMode,
    topicMastery: data?.topicMastery || [],
    weakTopics: data?.weakTopics || [],
    strongTopics: data?.strongTopics || [],
    errorNotebook: data?.errorNotebook || [],
    spacedRepetitionQueue: data?.spacedRepetitionQueue || [],
    overview: data?.overview || {
      overallAccuracy: 0,
      totalQuizzesTaken: 0,
      totalQuestionsAnswered: 0,
      totalMistakesRecorded: 0,
      resolvedMistakesCount: 0,
      weakTopicsCount: 0,
      masteredTopicsCount: 0,
      streakDays: 0,
      comebackMasterXP: 0,
    },
    dailyGoals: defaultDailyGoals,
    roadmap: defaultRoadmap,
    markErrorResolved,
    toggleDailyGoal,
    refetch,
  };
}
