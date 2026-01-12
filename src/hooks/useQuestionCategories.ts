import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface QuestionCategory {
  id: string;
  name: string;
  description: string | null;
  color: string;
  parent_id: string | null;
  user_id: string | null;
  created_at: string;
  updated_at: string;
}

// Fetch all categories
export function useQuestionCategories() {
  return useQuery({
    queryKey: ['question-categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('question_categories')
        .select('*')
        .order('name', { ascending: true });

      if (error) throw error;
      return data as QuestionCategory[];
    },
  });
}

// Create a new category
export function useCreateQuestionCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (category: { name: string; description?: string; color?: string; parent_id?: string }) => {
      const { data: userData } = await supabase.auth.getUser();
      
      const { data, error } = await supabase
        .from('question_categories')
        .insert({
          ...category,
          user_id: userData.user?.id || null,
        })
        .select()
        .single();

      if (error) throw error;
      return data as QuestionCategory;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['question-categories'] });
      toast.success('Kateqoriya yaradıldı');
    },
    onError: (error: Error) => {
      toast.error(`Xəta: ${error.message}`);
    },
  });
}

// Update a category
export function useUpdateQuestionCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<QuestionCategory> & { id: string }) => {
      const { data, error } = await supabase
        .from('question_categories')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data as QuestionCategory;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['question-categories'] });
      toast.success('Kateqoriya yeniləndi');
    },
    onError: (error: Error) => {
      toast.error(`Xəta: ${error.message}`);
    },
  });
}

// Delete a category
export function useDeleteQuestionCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('question_categories')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['question-categories'] });
      toast.success('Kateqoriya silindi');
    },
    onError: (error: Error) => {
      toast.error(`Xəta: ${error.message}`);
    },
  });
}
