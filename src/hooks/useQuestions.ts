import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { QuestionAnswer } from '@/types/question';

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

  title?: string | null;
  weight?: number | null;
  hint?: string | null;
  time_limit?: number | null;
  per_option_explanations?: Record<string, string> | null;
  video_url?: string | null;
  video_start_time?: number | null;
  video_end_time?: number | null;
  model_3d_url?: string | null;
  model_3d_type?: string | null;
  hotspot_data?: Record<string, unknown> | null;
  matching_pairs?: Record<string, string> | null;
  sequence_items?: string[] | null;
  fill_blank_template?: string | null;
  numerical_answer?: number | null;
  numerical_tolerance?: number | null;
  question_image_url?: string | null;
  option_images?: Record<string, string> | null;
  media_type?: string | null;
  media_url?: string | null;
}

export function computeWeightedScore(answers: QuestionAnswer[], questions: Question[]) {
  const weightedScore = answers.reduce((sum, answer) => {
    return sum + (answer.isCorrect ? (answer.pointsEarned || 1) : 0);
  }, 0);
  const maxPossibleScore = questions.reduce((sum, q) => sum + (q.weight ?? 1), 0);
  const percentage = maxPossibleScore > 0 ? (weightedScore / maxPossibleScore) * 100 : 0;
  return { weightedScore, maxPossibleScore, percentage };
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
      toast.error(`Xəta: ${error.message} `);
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
      toast.error(`Xəta: ${error.message} `);
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
      toast.error(`Xəta: ${error.message} `);
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
      toast.error(`Xəta: ${error.message} `);
    },
  });
}
