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

            // Only count completed attempts for stats
            const completedAttempts = attempts?.filter(a => a.completed_at !== null && a.score !== null) || [];
            const totalQuizzesTaken = completedAttempts.length;
            // score is already 0-100 percentage; average across completed attempts
            const averageScore = totalQuizzesTaken > 0
              ? Math.round(completedAttempts.reduce((acc, curr) => acc + (curr.score || 0), 0) / totalQuizzesTaken)
              : 0;
            // XP-style points: each percentage point = 1 point, scaled by quiz count
            const totalPoints = completedAttempts.reduce((acc, curr) => acc + (curr.score || 0), 0);

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
