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

export type QuestionBankMode = 'my-questions' | 'shared-with-me' | 'analytics';

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

export interface CategoryStatItem {
  category: string;
  questionCount: number;
  percentage: number;
  easyCount: number;
  mediumCount: number;
  hardCount: number;
  attemptsCount: number;
  correctCount: number;
  incorrectCount: number;
  accuracyPercentage: number;
}

export interface QuestionBankDetailedAnalytics {
  totalQuestions: number;
  totalCategories: number;
  thisWeekCount: number;
  difficultyCounts: Record<string, number>;
  bloomLevelCounts: Record<string, number>;
  typeCounts: Record<string, number>;
  categories: CategoryStatItem[];
  totalAttempts: number;
  totalCorrect: number;
  totalIncorrect: number;
  overallAccuracy: number;
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
  mode: QuestionBankMode = 'my-questions',
  options?: { enabled?: boolean }
) {
  return useQuery({
    queryKey: ['question-bank', pagination, filters, sort, mode],
    enabled: options?.enabled ?? true,
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
        .select(`
          id, question_text, question_type, options, correct_answer, explanation,
          category, difficulty, bloom_level, tags, user_id, source_document_id,
          created_at, updated_at, question_image_url, option_images, media_type,
          media_url, title, weight, hint, time_limit, per_option_explanations,
          video_url, video_start_time, video_end_time, model_3d_url, model_3d_type,
          hotspot_data, matching_pairs, sequence_items, fill_blank_template,
          numerical_answer, numerical_tolerance, correct_option_indices,
          feedback_enabled, quality_score, usage_count
        `, { count: 'exact' });

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
    staleTime: 2 * 60 * 1000,
  });
}

// Fetch question bank statistics
export function useQuestionBankStats() {
  return useQuery({
    queryKey: ['question-bank-stats'],
    queryFn: async (): Promise<QuestionBankStats> => {
      const { data, error } = await supabase.rpc('get_question_bank_stats');
      if (error) {
        console.error('get_question_bank_stats RPC error:', error);
        return {
          totalQuestions: 0,
          categoryCounts: {},
          difficultyCounts: {},
          typeCounts: {},
          thisWeekCount: 0,
          bloomLevelCounts: {},
        };
      }
      return data as unknown as QuestionBankStats;
    },
    staleTime: 5 * 60 * 1000,
  });
}

// Fetch detailed Question Bank analytics including category breakdowns and student answers
export function useQuestionBankDetailedAnalytics() {
  return useQuery({
    queryKey: ['question-bank-detailed-analytics'],
    queryFn: async (): Promise<QuestionBankDetailedAnalytics> => {
      const { data, error } = await supabase.rpc('get_question_bank_detailed_analytics');
      if (error) {
        console.error('get_question_bank_detailed_analytics RPC error:', error);
        return {
          totalQuestions: 0,
          totalCategories: 0,
          thisWeekCount: 0,
          difficultyCounts: {},
          bloomLevelCounts: {},
          typeCounts: {},
          categories: [],
          totalAttempts: 0,
          totalCorrect: 0,
          totalIncorrect: 0,
          overallAccuracy: 0,
        };
      }
      return data as unknown as QuestionBankDetailedAnalytics;
    },
    staleTime: 5 * 60 * 1000,
  });
}

// Get unique categories from question_bank
export function useQuestionBankCategories() {
  return useQuery({
    queryKey: ['question-bank-categories'],
    queryFn: async (): Promise<string[]> => {
      const { data, error } = await supabase.rpc('get_unique_question_bank_categories');
      if (error) {
        console.error('get_unique_question_bank_categories RPC error:', error);
        return [];
      }
      return (data as string[]) || [];
    },
    staleTime: 5 * 60 * 1000,
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

// Bulk create or update questions (Smart Upsert for import)
export function useBulkCreateQuestionBank() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (questions: Omit<QuestionBankItem, 'id' | 'created_at' | 'updated_at'>[]) => {
      const { data: userData } = await supabase.auth.getUser();
      const userId = userData.user?.id || null;

      const questionsWithUser = questions.map((q) => ({
        ...q,
        user_id: userId,
      }));

      // 1. Mövcud sualları oxuyuruq (Sual mətni və düzgün cavab üzrə kompozit xəritələndirmə)
      let fetchQuery = supabase
        .from('question_bank')
        .select('id, question_text, correct_answer')
        .range(0, 4999);

      if (userId) {
        fetchQuery = fetchQuery.eq('user_id', userId);
      }
      const { data: existingData, error: fetchErr } = await fetchQuery;
      if (fetchErr) {
        console.warn('Failed to fetch existing questions for duplicate check:', fetchErr);
      }

      const normalize = (t: string) => t.replace(/\s+/g, ' ').trim().toLowerCase();
      const compositeMap = new Map<string, string[]>();
      const textMap = new Map<string, string[]>();

      if (existingData) {
        for (const item of existingData) {
          if (item.question_text) {
            const textKey = normalize(item.question_text);
            const ansKey = normalize(item.correct_answer || '');
            const compKey = `${textKey}:::${ansKey}`;

            const compList = compositeMap.get(compKey) || [];
            compList.push(item.id);
            compositeMap.set(compKey, compList);

            const textList = textMap.get(textKey) || [];
            textList.push(item.id);
            textMap.set(textKey, textList);
          }
        }
      }

      type QuestionPayload = Omit<QuestionBankItem, 'id' | 'created_at' | 'updated_at'> & { user_id: string | null };
      const toUpdate: { id: string; item: QuestionPayload }[] = [];
      const toInsert: QuestionPayload[] = [];
      const usedIds = new Set<string>();

      for (const q of questionsWithUser) {
        const textKey = normalize(q.question_text || '');
        const ansKey = normalize(q.correct_answer || '');
        const compKey = `${textKey}:::${ansKey}`;

        // 1-ci seçim: Kompozit açar (mətni və düzgün cavabı dəqiq eyni olan)
        let matchedId: string | undefined;
        const compCandidates = compositeMap.get(compKey);
        if (compCandidates) {
          matchedId = compCandidates.find((id) => !usedIds.has(id));
        }

        // 2-ci seçim: Əgər cavab dəyişibsə, mətni eyni olan istifadə edilməmiş sətri tapırıq
        if (!matchedId) {
          const textCandidates = textMap.get(textKey);
          if (textCandidates) {
            matchedId = textCandidates.find((id) => !usedIds.has(id));
          }
        }

        if (matchedId) {
          usedIds.add(matchedId);
          toUpdate.push({ id: matchedId, item: q });
        } else {
          toInsert.push(q);
        }
      }

      // 2. Mövcud sualların üzərinə yazırıq (UPDATE)
      const UPDATE_CHUNK = 20;
      for (let i = 0; i < toUpdate.length; i += UPDATE_CHUNK) {
        const chunk = toUpdate.slice(i, i + UPDATE_CHUNK);
        await Promise.all(
          chunk.map(({ id, item }) =>
            supabase
              .from('question_bank')
              .update({
                ...item,
                updated_at: new Date().toISOString(),
              })
              .eq('id', id)
          )
        );
      }

      // 3. Yeni sualları əlavə edirik (INSERT)
      const CHUNK_SIZE = 50;
      for (let i = 0; i < toInsert.length; i += CHUNK_SIZE) {
        const chunk = toInsert.slice(i, i + CHUNK_SIZE);
        const { error } = await supabase
          .from('question_bank')
          .insert(chunk);

        if (error) {
          throw error;
        }
      }

      return {
        updatedCount: toUpdate.length,
        insertedCount: toInsert.length,
        total: questions.length,
      };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['question-bank'] });
      queryClient.invalidateQueries({ queryKey: ['question-bank-stats'] });
      queryClient.invalidateQueries({ queryKey: ['question-bank-categories'] });
      queryClient.invalidateQueries({ queryKey: ['questions'] });
      queryClient.invalidateQueries({ queryKey: ['quizzes'] });
      if (data.updatedCount > 0 && data.insertedCount > 0) {
        toast.success(`${data.updatedCount} sual yeniləndi (üzərinə yazıldı), ${data.insertedCount} yeni sual əlavə edildi`);
      } else if (data.updatedCount > 0) {
        toast.success(`${data.updatedCount} sualın məlumatları yeniləndi (üzərinə yazıldı)`);
      } else {
        toast.success(`${data.insertedCount} sual import edildi`);
      }
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
