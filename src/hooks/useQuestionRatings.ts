import { useMutation, useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export function useSubmitRating() {
    return useMutation({
        mutationFn: async (data: {
            questionBankId?: string;
            quizQuestionId?: string;
            rating: 1 | 2 | 3 | 4 | 5;
            issueType?: 'confusing' | 'error' | 'too_easy' | 'too_hard' | 'great' | null;
            comment?: string;
        }) => {
            const { data: userData } = await supabase.auth.getUser();
            if (!userData.user) throw new Error("İstifadəçi tapılmadı");

            const { error } = await supabase
                .from('question_ratings')
                .upsert({
                    question_bank_id: data.questionBankId,
                    quiz_question_id: data.quizQuestionId,
                    user_id: userData.user.id,
                    rating: data.rating,
                    issue_type: data.issueType,
                    comment: data.comment,
                }, { onConflict: 'user_id,question_bank_id' }); // Also need conflict handler for quiz_question_id actually or rely on the constraint
            if (error) throw error;
        },
    });
}

export function useQuestionRatingStats(questionBankId: string) {
    return useQuery({
        queryKey: ['question-rating-stats', questionBankId],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('question_ratings')
                .select('rating, issue_type')
                .eq('question_bank_id', questionBankId);

            if (error) throw error;

            const count = data.length;
            const average = count > 0
                ? data.reduce((sum, item) => sum + item.rating, 0) / count
                : 0;

            return {
                count,
                average,
                data
            };
        },
    });
}
