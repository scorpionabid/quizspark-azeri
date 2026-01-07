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
  play_count: number;
  rating: number;
  is_popular: boolean;
  is_new: boolean;
  created_at: string;
  updated_at: string;
}

export interface QuizFilters {
  subject?: string;
  grade?: string;
  difficulty?: string;
  search?: string;
  isPublic?: boolean;
  isPublished?: boolean;
  creatorId?: string;
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
  return useQuizzes({ ...filters, creatorId: user?.id });
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
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (quiz: Omit<Quiz, 'id' | 'creator_id' | 'created_at' | 'updated_at' | 'play_count' | 'rating' | 'is_popular' | 'is_new'>) => {
      if (!user) throw new Error('İstifadəçi daxil olmayıb');
      
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
