import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export interface Quiz {
  id: string;
  creator_id: string;
  title: string;
  description: string | null;
  subject: string | null;
  grade: string | null;
  difficulty: 'easy' | 'medium' | 'hard' | null;
  duration: number;
  is_public: boolean;
  is_published: boolean;
  is_archived?: boolean;
  play_count: number;
  rating: number;
  is_popular: boolean;
  is_new: boolean;
  created_at: string;
  updated_at: string;
  shuffle_questions?: boolean;
  show_feedback?: boolean;
  pass_percentage?: number;
  attempts_limit?: number;
  cover_image_url?: string | null;
  available_from?: string | null;
  available_to?: string | null;
  time_bonus_enabled?: boolean;
  time_penalty_enabled?: boolean;
  auto_advance?: boolean;
  access_password?: string | null;
  strict_mode?: boolean;
  allow_backtracking?: boolean;
  questions_per_page?: number;
  allow_bookmarks?: boolean;
  show_question_nav?: boolean;
  background_image_url?: string | null;
}

export interface QuizFilters {
  subject?: string;
  grade?: string;
  difficulty?: string;
  search?: string;
  isPublic?: boolean;
  isPublished?: boolean;
  isArchived?: boolean;
  creatorId?: string;
}

export interface QuizMeta {
  question_count: number;
  attempt_count: number;
  avg_score: number | null;
  last_played: string | null;
}

export function useQuizzes(filters?: QuizFilters) {
  return useQuery({
    queryKey: ['quizzes', filters],
    queryFn: async () => {
      let query = supabase
        .from('quizzes')
        .select('*')
        .order('created_at', { ascending: false });

      if (filters?.subject) {
        query = query.eq('subject', filters.subject);
      }
      if (filters?.grade) {
        query = query.eq('grade', filters.grade);
      }
      if (filters?.difficulty) {
        query = query.eq('difficulty', filters.difficulty);
      }
      if (filters?.isPublic !== undefined) {
        query = query.eq('is_public', filters.isPublic);
      }
      if (filters?.isPublished !== undefined) {
        query = query.eq('is_published', filters.isPublished);
      }
      if (filters?.isArchived !== undefined) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        query = (query as any).eq('is_archived', filters.isArchived);
      }
      if (filters?.creatorId) {
        query = query.eq('creator_id', filters.creatorId);
      }
      if (filters?.search) {
        query = query.ilike('title', `%${filters.search}%`);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as Quiz[];
    },
    staleTime: 5 * 60 * 1000,
  });
}

export function usePublicQuizzes(filters?: Omit<QuizFilters, 'isPublic' | 'isPublished'>) {
  return useQuizzes({ ...filters, isPublic: true, isPublished: true });
}

export function useMyQuizzes(filters?: Omit<QuizFilters, 'creatorId'>) {
  const { user } = useAuth();
  // Default: hide archived quizzes; pass isArchived: true to show only archived
  return useQuizzes({ isArchived: false, ...filters, creatorId: user?.id });
}

export function useQuiz(quizId: string | undefined) {
  return useQuery({
    queryKey: ['quiz', quizId],
    queryFn: async () => {
      if (!quizId) return null;
      const { data, error } = await supabase
        .from('quizzes')
        .select('*')
        .eq('id', quizId)
        .maybeSingle();
      if (error) throw error;
      return data as Quiz | null;
    },
    enabled: !!quizId,
  });
}

export function useCreateQuiz() {
  const queryClient = useQueryClient();
  const { user, profile } = useAuth();

  return useMutation({
    mutationFn: async (quiz: Omit<Quiz, 'id' | 'creator_id' | 'created_at' | 'updated_at' | 'play_count' | 'rating' | 'is_popular' | 'is_new'>) => {
      if (!user) throw new Error('İstifadəçi daxil olmayıb');

      // VIP Limitation Check
      if (profile?.subscription_tier !== 'vip') {
        const { count, error: countError } = await supabase
          .from('quizzes')
          .select('*', { count: 'exact', head: true })
          .eq('creator_id', user.id);

        if (countError) throw countError;

        if (count !== null && count >= 3) {
          throw new Error('Quest istifadəçiləri maksimum 3 quiz yarada bilər. Limitə çatmısınız, zəhmət olmasa VIP-yə keçin.');
        }
      }

      const { data, error } = await supabase
        .from('quizzes')
        .insert({
          ...quiz,
          creator_id: user.id,
        })
        .select()
        .single();

      if (error) throw error;
      return data as Quiz;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quizzes'] });
      toast.success('Quiz uğurla yaradıldı');
    },
    onError: (error: Error) => {
      toast.error(`Xəta: ${error.message}`);
    },
  });
}

export function useUpdateQuiz() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Quiz> & { id: string }) => {
      const { data, error } = await supabase
        .from('quizzes')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data as Quiz;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['quizzes'] });
      queryClient.invalidateQueries({ queryKey: ['quiz', data.id] });
      toast.success('Quiz uğurla yeniləndi');
    },
    onError: (error: Error) => {
      toast.error(`Xəta: ${error.message}`);
    },
  });
}

export function useDeleteQuiz() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (quizId: string) => {
      const { error } = await supabase
        .from('quizzes')
        .delete()
        .eq('id', quizId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quizzes'] });
      toast.success('Quiz silindi');
    },
    onError: (error: Error) => {
      toast.error(`Xəta: ${error.message}`);
    },
  });
}

// ─── Batch metadata (question count + attempt stats) ─────────────────────────
export function useQuizzesMeta(quizIds: string[]) {
  return useQuery({
    queryKey: ['quizzes-meta', quizIds],
    queryFn: async (): Promise<Record<string, QuizMeta>> => {
      if (!quizIds.length) return {};

      const [{ data: questionData, error: qError }, { data: resultData, error: rError }] =
        await Promise.all([
          supabase.from('questions').select('quiz_id').in('quiz_id', quizIds),
          supabase
            .from('quiz_results')
            .select('quiz_id, percentage, completed_at')
            .in('quiz_id', quizIds),
        ]);

      if (qError) throw qError;
      if (rError) throw rError;

      const meta: Record<string, QuizMeta> = {};
      quizIds.forEach(id => {
        meta[id] = { question_count: 0, attempt_count: 0, avg_score: null, last_played: null };
      });

      (questionData ?? []).forEach(q => {
        if (meta[q.quiz_id]) meta[q.quiz_id].question_count++;
      });

      const scoreMap: Record<string, number[]> = {};
      (resultData ?? []).forEach(r => {
        if (!meta[r.quiz_id]) return;
        meta[r.quiz_id].attempt_count++;
        if (
          r.completed_at &&
          (!meta[r.quiz_id].last_played || r.completed_at > meta[r.quiz_id].last_played!)
        ) {
          meta[r.quiz_id].last_played = r.completed_at;
        }
        if (!scoreMap[r.quiz_id]) scoreMap[r.quiz_id] = [];
        scoreMap[r.quiz_id].push(r.percentage);
      });

      Object.keys(scoreMap).forEach(id => {
        const scores = scoreMap[id];
        meta[id].avg_score = scores.reduce((a, b) => a + b, 0) / scores.length;
      });

      return meta;
    },
    enabled: quizIds.length > 0,
    staleTime: 2 * 60 * 1000,
  });
}

// ─── Duplicate quiz + all its questions ──────────────────────────────────────
export function useDuplicateQuiz() {
  const queryClient = useQueryClient();
  const { user, profile } = useAuth();

  return useMutation({
    mutationFn: async (quizId: string) => {
      if (!user) throw new Error('İstifadəçi daxil olmayıb');

      if (profile?.subscription_tier !== 'vip') {
        const { count, error: countError } = await supabase
          .from('quizzes')
          .select('*', { count: 'exact', head: true })
          .eq('creator_id', user.id);
        if (countError) throw countError;
        if (count !== null && count >= 3) {
          throw new Error(
            'Quest istifadəçiləri maksimum 3 quiz yarada bilər. VIP-yə keçin.',
          );
        }
      }

      const { data: source, error: sourceError } = await supabase
        .from('quizzes')
        .select('*')
        .eq('id', quizId)
        .single();
      if (sourceError) throw sourceError;

      const { id: _id, created_at: _ca, updated_at: _ua, play_count: _pc, rating: _r, is_popular: _ip, is_new: _in, ...rest } = source;
      const { data: newQuiz, error: createError } = await supabase
        .from('quizzes')
        .insert({
          ...rest,
          title: `${source.title} (Kopya)`,
          creator_id: user.id,
          is_published: false,
          play_count: 0,
          available_from: null,
          available_to: null,
        })
        .select()
        .single();
      if (createError) throw createError;

      const { data: questions, error: questionsError } = await supabase
        .from('questions')
        .select('*')
        .eq('quiz_id', quizId)
        .order('order_index', { ascending: true });
      if (questionsError) throw questionsError;

      if (questions && questions.length > 0) {
        const newQuestions = questions.map(
          ({ id: _qid, quiz_id: _qzid, created_at: _qca, ...q }) => ({
            ...q,
            quiz_id: newQuiz.id,
          }),
        );
        const { error: bulkError } = await supabase.from('questions').insert(newQuestions);
        if (bulkError) throw bulkError;
      }

      return newQuiz as Quiz;
    },
    onSuccess: data => {
      queryClient.invalidateQueries({ queryKey: ['quizzes'] });
      toast.success(`Quiz kopyalandı: "${data.title}"`);
    },
    onError: (error: Error) => {
      toast.error(`Xəta: ${error.message}`);
    },
  });
}

// ─── Archive / unarchive a quiz ───────────────────────────────────────────────
export function useArchiveQuiz() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ quizId, archived }: { quizId: string; archived: boolean }) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error } = await (supabase.from('quizzes') as any)
        .update({ is_archived: archived })
        .eq('id', quizId);
      if (error) throw error;
    },
    onSuccess: (_, { archived }) => {
      queryClient.invalidateQueries({ queryKey: ['quizzes'] });
      toast.success(archived ? 'Quiz arxivləndi' : 'Quiz arxivdən çıxarıldı');
    },
    onError: (error: Error) => {
      toast.error(`Xəta: ${error.message}`);
    },
  });
}
