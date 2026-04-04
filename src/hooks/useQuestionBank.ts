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
  // New Enhanced Fields
  title: string | null;
  weight: number | null;
  hint: string | null;
  time_limit: number | null;
  per_option_explanations: Record<string, string> | null;
  video_url: string | null;
  video_start_time: number | null;
  video_end_time: number | null;
  model_3d_url: string | null;
  model_3d_type: string | null;
  hotspot_data: Record<string, unknown> | null;
  matching_pairs: Record<string, string> | null;
  sequence_items: string[] | null;
  fill_blank_template: string | null;
  numerical_answer: number | null;
  numerical_tolerance: number | null;
  correct_option_indices: number[] | null;
  feedback_enabled: boolean | null;
  quality_score: number | null;
  usage_count: number | null;
  // Sharing metadata (only populated in 'shared-with-me' mode)
  shared_by_name?: string | null;
  shared_by_avatar?: string | null;
  shared_at?: string | null;
}

export interface TeacherProfile {
  user_id: string;
  full_name: string | null;
  email: string | null;
  avatar_url: string | null;
}

export interface ShareRecord {
  id: string;
  question_id: string;
  shared_by: string;
  shared_with: string;
  message: string | null;
  created_at: string;
  recipient?: TeacherProfile;
}

export type QuestionBankMode = 'my-questions' | 'shared-with-me';

export interface QuestionFilters {
  search?: string;
  category?: string;
  difficulty?: string;
  question_type?: string;
  quality_score_min?: number;
  has_video?: boolean;
  has_3d_model?: boolean;
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
  sort?: SortParams,
  mode: QuestionBankMode = 'my-questions'
) {
  return useQuery({
    queryKey: ['question-bank', pagination, filters, sort, mode],
    queryFn: async () => {
      const { page, pageSize } = pagination;
      const from = page * pageSize;
      const to = from + pageSize - 1;

      if (mode === 'shared-with-me') {
        // Fetch questions shared with current user via question_bank_shares join
        const sharesQuery = supabase
          .from('question_bank_shares')
          .select(
            `id, message, created_at,
             question:question_bank(*),
             sharer:profiles!question_bank_shares_shared_by_fkey(full_name, avatar_url)`,
            { count: 'exact' }
          )
          .order('created_at', { ascending: false })
          .range(from, to);

        const { data: sharesData, error: sharesError, count } = await sharesQuery;

        if (sharesError) throw sharesError;

        const questions: QuestionBankItem[] = (sharesData ?? []).map((row: {
          id: string;
          message: string | null;
          created_at: string;
          question: Record<string, unknown>;
          sharer: { full_name?: string | null; avatar_url?: string | null } | null;
        }) => ({
          ...(row.question as unknown as QuestionBankItem),
          shared_by_name: row.sharer?.full_name ?? null,
          shared_by_avatar: row.sharer?.avatar_url ?? null,
          shared_at: row.created_at,
        }));

        return {
          questions,
          totalCount: count || 0,
          totalPages: Math.ceil((count || 0) / pageSize),
        };
      }

      // Default: 'my-questions' — own questions only (RLS handles it)
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
      if (filters.quality_score_min) {
        query = query.gte('quality_score', filters.quality_score_min);
      }
      if (filters.has_video) {
        query = query.not('video_url', 'is', null);
      }
      if (filters.has_3d_model) {
        query = query.not('model_3d_url', 'is', null);
      }

      const { data, error, count } = await query;

      if (error) throw error;

      return {
        questions: data as unknown as QuestionBankItem[],
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
      return data as unknown as QuestionBankItem;
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
      return data as unknown as QuestionBankItem;
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

      // 100+ sual üçün 50-lik chunk-larla insert (timeout riskini azaldır)
      // M3.1: Hər hansı chunk uğursuz olsa, əvvəlki chunk-lar geri silinir (best-effort atomicity)
      const CHUNK_SIZE = 50;
      const results: QuestionBankItem[] = [];
      const insertedIds: string[] = [];

      for (let i = 0; i < questionsWithUser.length; i += CHUNK_SIZE) {
        const chunk = questionsWithUser.slice(i, i + CHUNK_SIZE);
        const { data, error } = await supabase
          .from('question_bank')
          .insert(chunk)
          .select();

        if (error) {
          // Rollback: əvvəl insert olunan sualları sil
          if (insertedIds.length > 0) {
            await supabase.from('question_bank').delete().in('id', insertedIds);
          }
          throw error;
        }

        const inserted = data as unknown as QuestionBankItem[];
        insertedIds.push(...inserted.map(d => d.id));
        results.push(...inserted);
      }
      return results;
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

// ─────────────────────────────────────────────
// SHARING HOOKS
// ─────────────────────────────────────────────

// Fetch teachers available for sharing (RPC)
export function useTeachersForSharing(searchTerm: string) {
  return useQuery({
    queryKey: ['teachers-for-sharing', searchTerm],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_teachers_for_sharing', {
        search_term: searchTerm,
      });
      if (error) throw error;
      return (data ?? []) as TeacherProfile[];
    },
    enabled: searchTerm.length === 0 || searchTerm.length >= 2,
    staleTime: 30_000,
  });
}

// Fetch share records for a specific question (outgoing shares by current user)
export function useSharedByMe(questionId?: string) {
  return useQuery({
    queryKey: ['question-bank-shares', 'by-me', questionId],
    queryFn: async () => {
      let query = supabase
        .from('question_bank_shares')
        .select(
          `id, question_id, shared_by, shared_with, message, created_at,
           recipient:profiles!question_bank_shares_shared_with_fkey(user_id, full_name, avatar_url, email)`
        )
        .order('created_at', { ascending: false });

      if (questionId) {
        query = query.eq('question_id', questionId);
      }

      const { data, error } = await query;
      if (error) throw error;
      return (data ?? []) as unknown as ShareRecord[];
    },
    enabled: true,
  });
}

// Share one or more questions with one or more teachers
export function useShareQuestion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      questionIds,
      recipientIds,
      message,
    }: {
      questionIds: string[];
      recipientIds: string[];
      message?: string;
    }) => {
      const { data: userData } = await supabase.auth.getUser();
      const currentUserId = userData.user?.id;
      if (!currentUserId) throw new Error('İstifadəçi tapılmadı');

      const rows = questionIds.flatMap((qId) =>
        recipientIds.map((rId) => ({
          question_id: qId,
          shared_by: currentUserId,
          shared_with: rId,
          message: message ?? null,
        }))
      );

      const { error } = await supabase.from('question_bank_shares').insert(rows);
      if (error) throw error;
      return { questionIds, recipientIds };
    },
    onSuccess: ({ questionIds, recipientIds }) => {
      queryClient.invalidateQueries({ queryKey: ['question-bank-shares'] });
      toast.success(
        `${questionIds.length} sual ${recipientIds.length} müəllimə paylaşıldı`
      );
    },
    onError: (error: Error) => {
      toast.error(`Paylaşım xətası: ${error.message}`);
    },
  });
}

// Revoke a share by its record id
export function useRevokeShare() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (shareId: string) => {
      const { error } = await supabase
        .from('question_bank_shares')
        .delete()
        .eq('id', shareId);
      if (error) throw error;
      return shareId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['question-bank-shares'] });
      queryClient.invalidateQueries({ queryKey: ['question-bank'] });
      toast.success('Paylaşım ləğv edildi');
    },
    onError: (error: Error) => {
      toast.error(`Xəta: ${error.message}`);
    },
  });
}

// Copy a shared question into current user's own bank
export function useCopyToMyBank() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (source: QuestionBankItem) => {
      const { data: userData } = await supabase.auth.getUser();
      const currentUserId = userData.user?.id;
      if (!currentUserId) throw new Error('İstifadəçi tapılmadı');

      // Strip id, timestamps, and sharing metadata; reset usage stats
      const {
        id: _id,
        created_at: _ca,
        updated_at: _ua,
        shared_by_name: _sbn,
        shared_by_avatar: _sba,
        shared_at: _sat,
        quality_score: _qs,
        usage_count: _uc,
        source_document_id: _src,
        ...rest
      } = source;

      const { data, error } = await supabase
        .from('question_bank')
        .insert({ ...rest, user_id: currentUserId })
        .select()
        .single();

      if (error) throw error;
      return data as unknown as QuestionBankItem;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['question-bank'] });
      queryClient.invalidateQueries({ queryKey: ['question-bank-stats'] });
      queryClient.invalidateQueries({ queryKey: ['question-bank-categories'] });
      toast.success('Sual öz bankınıza kopyalandı');
    },
    onError: (error: Error) => {
      toast.error(`Kopyalama xətası: ${error.message}`);
    },
  });
}

// ─────────────────────────────────────────────

// Vector and Text search using Edge Function
export function useQuestionBankSearch(searchQuery: string, enabled: boolean = false) {
  return useQuery({
    queryKey: ['question-bank-search', searchQuery],
    queryFn: async () => {
      if (!searchQuery.trim()) return [];
      
      const { data, error } = await supabase.functions.invoke("question-bank", {
        body: { action: "search", searchQuery },
      });

      if (error) throw error;
      return (data.results || []) as QuestionBankItem[];
    },
    enabled: enabled && searchQuery.length > 2,
  });
}
