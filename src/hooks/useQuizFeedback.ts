import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export type IssueType = 'error' | 'confusing' | 'too_hard' | 'too_easy' | 'suggestion' | 'great';

export interface QuestionFeedbackItem {
  id: string;
  question_bank_id: string | null;
  quiz_question_id: string | null;
  user_id: string;
  rating: number;
  issue_type: IssueType | null;
  comment: string | null;
  created_at: string;
  student_name?: string;
  student_avatar?: string;
  question_title?: string;
  question_text?: string;
}

export interface SubmitFeedbackParams {
  quizQuestionId?: string;
  questionBankId?: string;
  rating: number;
  issueType?: IssueType | null;
  comment?: string;
}

// 1. Submit or Update Feedback
export function useSubmitQuestionFeedback() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: SubmitFeedbackParams) => {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) throw new Error("Giriş edilməyib");

      const payload = {
        user_id: userData.user.id,
        quiz_question_id: params.quizQuestionId || null,
        question_bank_id: params.questionBankId || null,
        rating: params.rating,
        issue_type: params.issueType || null,
        comment: params.comment?.trim() || null,
      };

      // Check if user already rated this question
      let query = supabase
        .from('question_ratings')
        .select('id')
        .eq('user_id', userData.user.id);

      if (params.quizQuestionId) {
        query = query.eq('quiz_question_id', params.quizQuestionId);
      } else if (params.questionBankId) {
        query = query.eq('question_bank_id', params.questionBankId);
      }

      const { data: existing } = await query.maybeSingle();

      if (existing?.id) {
        const { error } = await supabase
          .from('question_ratings')
          .update(payload)
          .eq('id', existing.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('question_ratings')
          .insert([payload]);
        if (error) throw error;
      }
    },
    onSuccess: (_, variables) => {
      if (variables.quizQuestionId) {
        queryClient.invalidateQueries({ queryKey: ['my-question-rating', variables.quizQuestionId] });
        queryClient.invalidateQueries({ queryKey: ['quiz-feedbacks'] });
      }
      if (variables.questionBankId) {
        queryClient.invalidateQueries({ queryKey: ['my-question-rating', variables.questionBankId] });
        queryClient.invalidateQueries({ queryKey: ['question-feedbacks', variables.questionBankId] });
      }
    },
  });
}

// 2. Fetch current user's existing rating for a question
export function useMyQuestionRating(questionId?: string, isBankItem = false) {
  return useQuery({
    queryKey: ['my-question-rating', questionId],
    queryFn: async () => {
      if (!questionId) return null;
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) return null;

      let query = supabase
        .from('question_ratings')
        .select('*')
        .eq('user_id', userData.user.id);

      if (isBankItem) {
        query = query.eq('question_bank_id', questionId);
      } else {
        query = query.eq('quiz_question_id', questionId);
      }

      const { data, error } = await query.maybeSingle();
      if (error) throw error;
      return data as QuestionFeedbackItem | null;
    },
    enabled: !!questionId,
    staleTime: 30 * 1000,
  });
}

// 3. Fetch all feedbacks for a Quiz (for Teacher Quiz Stats)
export function useQuizFeedbacks(quizId?: string) {
  return useQuery({
    queryKey: ['quiz-feedbacks', quizId],
    queryFn: async () => {
      if (!quizId) return [];

      // First get all questions in this quiz
      const { data: questions, error: qErr } = await supabase
        .from('questions')
        .select('id, title, question_text')
        .eq('quiz_id', quizId);

      if (qErr) throw qErr;
      if (!questions || questions.length === 0) return [];

      const questionIds = questions.map(q => q.id);
      const questionMap = new Map(questions.map(q => [q.id, q]));

      // Get ratings for these questions
      const { data: ratings, error: rErr } = await supabase
        .from('question_ratings')
        .select(`
          id,
          question_bank_id,
          quiz_question_id,
          user_id,
          rating,
          issue_type,
          comment,
          created_at,
          profiles:user_id(full_name, avatar_url)
        `)
        .in('quiz_question_id', questionIds)
        .order('created_at', { ascending: false });

      if (rErr) throw rErr;

      return (ratings || []).map(r => {
        const profile = r.profiles as unknown as { full_name?: string; avatar_url?: string } | null;
        const qInfo = r.quiz_question_id ? questionMap.get(r.quiz_question_id) : undefined;

        return {
          id: r.id,
          question_bank_id: r.question_bank_id,
          quiz_question_id: r.quiz_question_id,
          user_id: r.user_id,
          rating: r.rating,
          issue_type: r.issue_type as IssueType | null,
          comment: r.comment,
          created_at: r.created_at || new Date().toISOString(),
          student_name: profile?.full_name || 'Gizli tələbə',
          student_avatar: profile?.avatar_url,
          question_title: qInfo?.title || undefined,
          question_text: qInfo?.question_text || undefined,
        } as QuestionFeedbackItem;
      });
    },
    enabled: !!quizId,
    staleTime: 60 * 1000,
  });
}

// 4. Fetch feedbacks for a single Question / Bank item
export function useQuestionFeedbacks(questionId?: string, isBankItem = false) {
  return useQuery({
    queryKey: ['question-feedbacks', questionId, isBankItem],
    queryFn: async () => {
      if (!questionId) return [];

      let query = supabase
        .from('question_ratings')
        .select(`
          id,
          question_bank_id,
          quiz_question_id,
          user_id,
          rating,
          issue_type,
          comment,
          created_at,
          profiles:user_id(full_name, avatar_url)
        `)
        .order('created_at', { ascending: false });

      if (isBankItem) {
        query = query.eq('question_bank_id', questionId);
      } else {
        query = query.eq('quiz_question_id', questionId);
      }

      const { data, error } = await query;
      if (error) throw error;

      return (data || []).map(r => {
        const profile = r.profiles as unknown as { full_name?: string; avatar_url?: string } | null;
        return {
          id: r.id,
          question_bank_id: r.question_bank_id,
          quiz_question_id: r.quiz_question_id,
          user_id: r.user_id,
          rating: r.rating,
          issue_type: r.issue_type as IssueType | null,
          comment: r.comment,
          created_at: r.created_at || new Date().toISOString(),
          student_name: profile?.full_name || 'Gizli tələbə',
          student_avatar: profile?.avatar_url,
        } as QuestionFeedbackItem;
      });
    },
    enabled: !!questionId,
    staleTime: 60 * 1000,
  });
}
