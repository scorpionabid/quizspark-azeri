import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export interface QuizAttempt {
  id: string;
  quiz_id: string;
  user_id: string;
  started_at: string;
  completed_at: string | null;
  score: number | null;
  total_questions: number | null;
  time_spent: number | null;
  answers: Record<string, string>[];
}

export interface QuizResult {
  id: string;
  quiz_id: string;
  user_id: string;
  score: number;
  total_questions: number;
  percentage: number;
  time_spent: number | null;
  completed_at: string;
}

export interface QuizResultWithProfile extends QuizResult {
  profiles: { full_name: string | null; avatar_url: string | null } | null;
}

export interface QuizDetailedStats {
  results: QuizResultWithProfile[];
  summary: {
    total: number;
    avg_score: number;
    pass_rate: number;
    avg_time: number | null;
  };
}

export function useMyAttempts(quizId?: string) {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['attempts', user?.id, quizId],
    queryFn: async () => {
      if (!user) return [];

      let query = supabase
        .from('quiz_attempts')
        .select('*')
        .eq('user_id', user.id)
        .order('started_at', { ascending: false });

      if (quizId) {
        query = query.eq('quiz_id', quizId);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as QuizAttempt[];
    },
    enabled: !!user,
  });
}

export function useStartAttempt() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async ({ quizId, totalQuestions }: { quizId: string; totalQuestions: number }) => {
      if (!user) throw new Error('İstifadəçi daxil olmayıb');

      const { data, error } = await supabase
        .from('quiz_attempts')
        .insert({
          quiz_id: quizId,
          user_id: user.id,
          total_questions: totalQuestions,
          answers: [],
        })
        .select()
        .single();

      if (error) throw error;
      return data as QuizAttempt;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['attempts'] });
    },
    onError: (error: Error) => {
      toast.error(`Xəta: ${error.message}`);
    },
  });
}

export function useUpdateAttempt() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ attemptId, answers }: { attemptId: string; answers: Record<string, string>[] }) => {
      const { data, error } = await supabase
        .from('quiz_attempts')
        .update({ answers })
        .eq('id', attemptId)
        .select()
        .single();

      if (error) throw error;
      return data as QuizAttempt;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['attempts'] });
    },
  });
}

export function useCompleteAttempt() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async ({
      attemptId,
      quizId,
      score,
      totalQuestions,
      timeSpent,
      answers
    }: {
      attemptId: string;
      quizId: string;
      score: number;
      totalQuestions: number;
      timeSpent: number;
      answers: Record<string, string>[];
    }) => {
      if (!user) throw new Error('İstifadəçi daxil olmayıb');

      // Update attempt
      const { error: attemptError } = await supabase
        .from('quiz_attempts')
        .update({
          completed_at: new Date().toISOString(),
          score,
          time_spent: timeSpent,
          answers,
        })
        .eq('id', attemptId);

      if (attemptError) throw attemptError;

      // Create result for leaderboard
      const percentage = (score / totalQuestions) * 100;
      const { data: resultData, error: resultError } = await supabase
        .from('quiz_results')
        .insert({
          quiz_id: quizId,
          user_id: user.id,
          score,
          total_questions: totalQuestions,
          percentage,
          time_spent: timeSpent,
        })
        .select()
        .single();

      if (resultError) throw resultError;

      // Increment play count
      try {
        const { data: quizData } = await supabase
          .from('quizzes')
          .select('play_count')
          .eq('id', quizId)
          .single();

        if (quizData) {
          await supabase
            .from('quizzes')
            .update({ play_count: (quizData.play_count || 0) + 1 })
            .eq('id', quizId);
        }
      } catch {
        // Ignore errors
      }

      return resultData as QuizResult;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['attempts'] });
      queryClient.invalidateQueries({ queryKey: ['results'] });
      queryClient.invalidateQueries({ queryKey: ['quizzes'] });
      toast.success('Quiz tamamlandı!');
    },
    onError: (error: Error) => {
      toast.error(`Xəta: ${error.message}`);
    },
  });
}

export function useQuizLeaderboard(quizId: string | undefined) {
  return useQuery({
    queryKey: ['leaderboard', quizId],
    queryFn: async () => {
      if (!quizId) return [];

      const { data, error } = await supabase
        .from('quiz_results')
        .select(`
          *,
          profiles:user_id (
            full_name,
            avatar_url
          )
        `)
        .eq('quiz_id', quizId)
        .order('percentage', { ascending: false })
        .order('time_spent', { ascending: true })
        .limit(50);

      if (error) throw error;
      return data;
    },
    enabled: !!quizId,
  });
}

export interface UserStat {
  user_id: string;
  profile: { full_name: string | null; avatar_url: string | null } | null;
  total_quizzes: number;
}

export function useGlobalLeaderboard() {
  return useQuery({
    queryKey: ['global-leaderboard'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('quiz_results')
        .select(`
          user_id,
          profiles:user_id (
            full_name,
            avatar_url
          )
        `)
        .order('completed_at', { ascending: false });

      if (error) throw error;


      // Group by user and count
      const userStats = data.reduce((acc, result) => {
        const userId = result.user_id;
        if (!acc[userId]) {
          acc[userId] = {
            user_id: userId,
            profile: result.profiles as unknown as { full_name: string | null; avatar_url: string | null } | null,
            total_quizzes: 0,
          };
        }
        acc[userId].total_quizzes++;
        return acc;
      }, {} as Record<string, UserStat>);

      return Object.values(userStats)
        .sort((a, b) => b.total_quizzes - a.total_quizzes)
        .slice(0, 50);
    },
  });
}

export function useActiveQuizAttempts(quizId: string | undefined) {
  return useQuery({
    queryKey: ['active-attempts', quizId],
    queryFn: async () => {
      if (!quizId) return 0;

      // First get quiz duration to calculate stale threshold
      const { data: quiz } = await supabase
        .from('quizzes')
        .select('duration')
        .eq('id', quizId)
        .single();

      const duration = quiz?.duration || 20;
      const staleThreshold = new Date();
      // Threshold = duration + 10 minutes margin
      staleThreshold.setMinutes(staleThreshold.getMinutes() - (duration + 10));

      const { count, error } = await supabase
        .from('quiz_attempts')
        .select('*', { count: 'exact', head: true })
        .eq('quiz_id', quizId)
        .is('completed_at', null)
        .gt('started_at', staleThreshold.toISOString());

      if (error) throw error;
      return count || 0;
    },
    enabled: !!quizId,
    refetchInterval: 10000,
  });
}

export function useClearActiveAttempts() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (quizId: string) => {
      const { error } = await supabase
        .from('quiz_attempts')
        .update({ completed_at: new Date().toISOString() })
        .eq('quiz_id', quizId)
        .is('completed_at', null);

      if (error) throw error;
    },
    onSuccess: (_, quizId) => {
      queryClient.invalidateQueries({ queryKey: ['active-attempts', quizId] });
      toast.success('Sessiyalar təmizləndi, quiz açıldı');
    },
    onError: (error: Error) => {
      toast.error(`Xəta: ${error.message}`);
    },
  });
}

// ─── Detailed stats for a single quiz (teacher stats sheet) ──────────────────
export function useQuizDetailedStats(quizId: string | undefined, passPercentage = 60) {
  return useQuery({
    queryKey: ['quiz-detailed-stats', quizId],
    queryFn: async (): Promise<QuizDetailedStats> => {
      if (!quizId) return { results: [], summary: { total: 0, avg_score: 0, pass_rate: 0, avg_time: null } };

      const { data, error } = await supabase
        .from('quiz_results')
        .select(`*, profiles:user_id (full_name, avatar_url)`)
        .eq('quiz_id', quizId)
        .order('completed_at', { ascending: false });

      if (error) throw error;

      const results = (data ?? []) as unknown as QuizResultWithProfile[];
      const total = results.length;

      if (total === 0) {
        return { results: [], summary: { total: 0, avg_score: 0, pass_rate: 0, avg_time: null } };
      }

      const avg_score = results.reduce((s, r) => s + r.percentage, 0) / total;
      const passed = results.filter(r => r.percentage >= passPercentage).length;
      const pass_rate = (passed / total) * 100;
      const timed = results.filter(r => r.time_spent != null);
      const avg_time =
        timed.length > 0
          ? timed.reduce((s, r) => s + (r.time_spent ?? 0), 0) / timed.length
          : null;

      return { results, summary: { total, avg_score, pass_rate, avg_time } };
    },
    enabled: !!quizId,
    staleTime: 60 * 1000,
  });
}
