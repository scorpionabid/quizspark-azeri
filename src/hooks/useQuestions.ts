import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface Question {
  id: string;
  quiz_id: string;
  question_text: string;
  question_type: string;
  options: string[] | null;
  correct_answer: string;
  explanation: string | null;
  order_index: number;
  created_at: string;
}

export function useQuestions(quizId: string | undefined) {
  return useQuery({
    queryKey: ['questions', quizId],
    queryFn: async () => {
      if (!quizId) return [];
      const { data, error } = await supabase
        .from('questions')
        .select('*')
        .eq('quiz_id', quizId)
        .order('order_index', { ascending: true });
      
      if (error) throw error;
      return data as Question[];
    },
    enabled: !!quizId,
  });
}

export function useCreateQuestion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (question: Omit<Question, 'id' | 'created_at'>) => {
      const { data, error } = await supabase
        .from('questions')
        .insert(question)
        .select()
        .single();
      
      if (error) throw error;
      return data as Question;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['questions', data.quiz_id] });
      toast.success('Sual əlavə edildi');
    },
    onError: (error: Error) => {
      toast.error(`Xəta: ${error.message}`);
    },
  });
}

export function useUpdateQuestion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Question> & { id: string }) => {
      const { data, error } = await supabase
        .from('questions')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data as Question;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['questions', data.quiz_id] });
      toast.success('Sual yeniləndi');
    },
    onError: (error: Error) => {
      toast.error(`Xəta: ${error.message}`);
    },
  });
}

export function useDeleteQuestion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ questionId, quizId }: { questionId: string; quizId: string }) => {
      const { error } = await supabase
        .from('questions')
        .delete()
        .eq('id', questionId);
      
      if (error) throw error;
      return quizId;
    },
    onSuccess: (quizId) => {
      queryClient.invalidateQueries({ queryKey: ['questions', quizId] });
      toast.success('Sual silindi');
    },
    onError: (error: Error) => {
      toast.error(`Xəta: ${error.message}`);
    },
  });
}

export function useBulkCreateQuestions() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (questions: Omit<Question, 'id' | 'created_at'>[]) => {
      const { data, error } = await supabase
        .from('questions')
        .insert(questions)
        .select();
      
      if (error) throw error;
      return data as Question[];
    },
    onSuccess: (data) => {
      if (data.length > 0) {
        queryClient.invalidateQueries({ queryKey: ['questions', data[0].quiz_id] });
      }
      toast.success(`${data.length} sual əlavə edildi`);
    },
    onError: (error: Error) => {
      toast.error(`Xəta: ${error.message}`);
    },
  });
}
