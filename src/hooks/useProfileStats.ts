import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export function useProfileStats() {
    const { user, role } = useAuth();

    return useQuery({
        queryKey: ['profile-stats', user?.id, role],
        queryFn: async () => {
            if (!user) return null;

            // Common stats based on attempts (Students primarily, but also Teachers who take quizzes)
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

            const totalQuizzesTaken = attempts?.length || 0;
            const totalScore = attempts?.reduce((acc, curr) => acc + (curr.score || 0), 0) || 0;
            const totalQuestionsTaken = attempts?.reduce((acc, curr) => acc + (curr.total_questions || 0), 0) || 0;
            const averageScore = totalQuestionsTaken > 0 ? Math.round((totalScore / totalQuestionsTaken) * 100) : 0;
            const totalPoints = totalScore * 10;

            // Role-specific stats for Teachers
            let teacherStats = null;
            if (role === 'teacher') {
                const { data: createdQuizzes, error: quizError } = await supabase
                    .from('quizzes')
                    .select('id, play_count, rating')
                    .eq('creator_id', user.id);

                if (quizError) throw quizError;

                const totalCreated = createdQuizzes?.length || 0;
                const totalPlays = createdQuizzes?.reduce((acc, q) => acc + (q.play_count || 0), 0) || 0;
                const ratings = createdQuizzes?.filter(q => q.rating !== null).map(q => q.rating as number) || [];
                const averageRating = ratings.length > 0 ? (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(1) : "0";

                teacherStats = {
                    totalCreated,
                    totalPlays,
                    averageRating
                };
            }

            return {
                attempts,
                totalQuizzes: totalQuizzesTaken,
                averageScore,
                totalPoints,
                recentActivity: attempts?.slice(0, 5) || [],
                teacherStats
            };
        },
        enabled: !!user
    });
}
