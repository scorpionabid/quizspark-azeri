import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface QuestionBankItem {
  id: string;
  question_text: string;
  question_type: string;
  options: string[] | Record<string, string> | null;
  correct_answer: string;
  explanation: string | null;
  category: string | null;
  difficulty: string | null;
  bloom_level: string | null;
  tags: string[] | null;
  user_id: string | null;
  source_document_id: string | null;
  created_at: string;
  updated_at: string;
  // Media fields
  question_image_url: string | null;
  option_images: Record<number, string> | null;
  media_type: 'image' | 'audio' | 'video' | null;
  media_url: string | null;
}

export interface QuestionFilters {
  search?: string;
  category?: string;
  difficulty?: string;
  question_type?: string;
}

export interface PaginationParams {
  page: number;
  pageSize: number;
}

export interface QuestionBankStats {
  totalQuestions: number;
  categoryCounts: Record<string, number>;
  difficultyCounts: Record<string, number>;
  typeCounts: Record<string, number>;
  thisWeekCount: number;
  bloomLevelCounts: Record<string, number>;
}

export interface SortParams {
  column: string;
  direction: 'asc' | 'desc';
}

// Fetch questions with pagination and filters
export function useQuestionBankList(
  pagination: PaginationParams,
  filters: QuestionFilters,
  sort?: SortParams
) {
  return useQuery({
    queryKey: ['question-bank', pagination, filters, sort],
    queryFn: async () => {
      const { page, pageSize } = pagination;
      const from = page * pageSize;
      const to = from + pageSize - 1;

      let query = supabase
        .from('question_bank')
        .select('*', { count: 'exact' });

      // Apply sorting
      if (sort) {
        query = query.order(sort.column, { ascending: sort.direction === 'asc' });
      } else {
        query = query.order('created_at', { ascending: false });
      }

      query = query.range(from, to);

      // Apply filters
      if (filters.category && filters.category !== 'all') {
        query = query.eq('category', filters.category);
      }
      if (filters.difficulty && filters.difficulty !== 'all') {
        query = query.eq('difficulty', filters.difficulty);
      }
      if (filters.question_type && filters.question_type !== 'all') {
        query = query.eq('question_type', filters.question_type);
      }
      if (filters.search) {
        query = query.ilike('question_text', `%${filters.search}%`);
      }

      const { data, error, count } = await query;

      if (error) throw error;

      return {
        questions: data as QuestionBankItem[],
        totalCount: count || 0,
        totalPages: Math.ceil((count || 0) / pageSize),
      };
    },
  });
}

// Fetch question bank statistics
export function useQuestionBankStats() {
  return useQuery({
    queryKey: ['question-bank-stats'],
    queryFn: async () => {
      // Get total count
      const { count: totalQuestions } = await supabase
        .from('question_bank')
        .select('*', { count: 'exact', head: true });

      // Get category counts
      const { data: categoryData } = await supabase
        .from('question_bank')
        .select('category');

      const categoryCounts: Record<string, number> = {};
      categoryData?.forEach((item) => {
        const cat = item.category || 'Kateqoriyasız';
        categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
      });

      // Get difficulty counts
      const { data: difficultyData } = await supabase
        .from('question_bank')
        .select('difficulty');

      const difficultyCounts: Record<string, number> = {};
      difficultyData?.forEach((item) => {
        const diff = item.difficulty || 'Təyin edilməyib';
        difficultyCounts[diff] = (difficultyCounts[diff] || 0) + 1;
      });

      // Get type counts
      const { data: typeData } = await supabase
        .from('question_bank')
        .select('question_type');

      const typeCounts: Record<string, number> = {};
      typeData?.forEach((item) => {
        const type = item.question_type || 'multiple_choice';
        typeCounts[type] = (typeCounts[type] || 0) + 1;
      });

      // Get bloom level counts
      const { data: bloomData } = await supabase
        .from('question_bank')
        .select('bloom_level');

      const bloomLevelCounts: Record<string, number> = {};
      bloomData?.forEach((item) => {
        const level = item.bloom_level || 'Təyin edilməyib';
        bloomLevelCounts[level] = (bloomLevelCounts[level] || 0) + 1;
      });

      // Get this week's count
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

      const { count: thisWeekCount } = await supabase
        .from('question_bank')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', oneWeekAgo.toISOString());

      return {
        totalQuestions: totalQuestions || 0,
        categoryCounts,
        difficultyCounts,
        typeCounts,
        thisWeekCount: thisWeekCount || 0,
        bloomLevelCounts,
      } as QuestionBankStats;
    },
  });
}

// Get unique categories from question_bank
export function useQuestionBankCategories() {
  return useQuery({
    queryKey: ['question-bank-categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('question_bank')
        .select('category')
        .not('category', 'is', null);

      if (error) throw error;

      const uniqueCategories = [...new Set(data?.map((d) => d.category).filter(Boolean))] as string[];
      return uniqueCategories.sort();
    },
  });
}

// Create a new question
export function useCreateQuestionBank() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (question: Omit<QuestionBankItem, 'id' | 'created_at' | 'updated_at'>) => {
      const { data: userData } = await supabase.auth.getUser();

      const { data, error } = await supabase
        .from('question_bank')
        .insert({
          ...question,
          user_id: userData.user?.id || null,
        })
        .select()
        .single();

      if (error) throw error;
      return data as QuestionBankItem;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['question-bank'] });
      queryClient.invalidateQueries({ queryKey: ['question-bank-stats'] });
      queryClient.invalidateQueries({ queryKey: ['question-bank-categories'] });
      toast.success('Sual əlavə edildi');
    },
    onError: (error: Error) => {
      toast.error(`Xəta: ${error.message}`);
    },
  });
}

// Update a question
export function useUpdateQuestionBank() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<QuestionBankItem> & { id: string }) => {
      const { data, error } = await supabase
        .from('question_bank')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data as QuestionBankItem;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['question-bank'] });
      queryClient.invalidateQueries({ queryKey: ['question-bank-stats'] });
      queryClient.invalidateQueries({ queryKey: ['question-bank-categories'] });
      toast.success('Sual yeniləndi');
    },
    onError: (error: Error) => {
      toast.error(`Xəta: ${error.message}`);
    },
  });
}

// Delete a question
export function useDeleteQuestionBank() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('question_bank')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['question-bank'] });
      queryClient.invalidateQueries({ queryKey: ['question-bank-stats'] });
      toast.success('Sual silindi');
    },
    onError: (error: Error) => {
      toast.error(`Xəta: ${error.message}`);
    },
  });
}

// Bulk delete questions
export function useBulkDeleteQuestionBank() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (ids: string[]) => {
      const { error } = await supabase
        .from('question_bank')
        .delete()
        .in('id', ids);

      if (error) throw error;
      return ids;
    },
    onSuccess: (ids) => {
      queryClient.invalidateQueries({ queryKey: ['question-bank'] });
      queryClient.invalidateQueries({ queryKey: ['question-bank-stats'] });
      toast.success(`${ids.length} sual silindi`);
    },
    onError: (error: Error) => {
      toast.error(`Xəta: ${error.message}`);
    },
  });
}

// Bulk update questions (e.g., change category or difficulty)
export function useBulkUpdateQuestionBank() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ ids, updates }: { ids: string[]; updates: Partial<QuestionBankItem> }) => {
      const { error } = await supabase
        .from('question_bank')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .in('id', ids);

      if (error) throw error;
      return ids;
    },
    onSuccess: (ids) => {
      queryClient.invalidateQueries({ queryKey: ['question-bank'] });
      queryClient.invalidateQueries({ queryKey: ['question-bank-stats'] });
      queryClient.invalidateQueries({ queryKey: ['question-bank-categories'] });
      toast.success(`${ids.length} sual yeniləndi`);
    },
    onError: (error: Error) => {
      toast.error(`Xəta: ${error.message}`);
    },
  });
}

// Bulk create questions (for import)
export function useBulkCreateQuestionBank() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (questions: Omit<QuestionBankItem, 'id' | 'created_at' | 'updated_at'>[]) => {
      const { data: userData } = await supabase.auth.getUser();

      const questionsWithUser = questions.map((q) => ({
        ...q,
        user_id: userData.user?.id || null,
      }));

      const { data, error } = await supabase
        .from('question_bank')
        .insert(questionsWithUser)
        .select();

      if (error) throw error;
      return data as QuestionBankItem[];
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['question-bank'] });
      queryClient.invalidateQueries({ queryKey: ['question-bank-stats'] });
      queryClient.invalidateQueries({ queryKey: ['question-bank-categories'] });
      toast.success(`${data.length} sual import edildi`);
    },
    onError: (error: Error) => {
      toast.error(`Import xətası: ${error.message}`);
    },
  });
}
