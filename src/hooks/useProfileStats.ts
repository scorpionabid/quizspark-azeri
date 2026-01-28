import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export function useProfileStats() {
    const { user } = useAuth();

    return useQuery({
        queryKey: ['profile-stats', user?.id],
        queryFn: async () => {
            if (!user) return null;

            // Fetch attempts
            const { data: attempts, error: attemptsError } = await supabase
                .from('quiz_attempts')
                .select(`
          *,
          quizzes (
            title,
            subject
          )
        `)
                .eq('user_id', user.id)
                .order('completed_at', { ascending: false });

            if (attemptsError) throw attemptsError;

            // Calculate stats
            const totalQuizzes = attempts?.length || 0;
            const totalScore = attempts?.reduce((acc, curr) => acc + (curr.score || 0), 0) || 0;
            const totalQuestions = attempts?.reduce((acc, curr) => acc + (curr.total_questions || 0), 0) || 0;
            const averageScore = totalQuestions > 0 ? Math.round((totalScore / totalQuestions) * 100) : 0;

            // Points can be 10 points per correct answer (just for demo/gamification)
            const totalPoints = totalScore * 10;

            return {
                attempts,
                totalQuizzes,
                averageScore,
                totalPoints,
                recentActivity: attempts?.slice(0, 5) || []
            };
        },
        enabled: !!user
    });
}
