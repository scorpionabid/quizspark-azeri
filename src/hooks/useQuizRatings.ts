import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export function useQuizRatings(quizId: string) {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: ratings, isLoading: isLoadingRatings } = useQuery({
    queryKey: ["quiz-ratings", quizId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("quiz_ratings")
        .select("rating")
        .eq("quiz_id", quizId);

      if (error) throw error;

      const totalRatings = data.length;
      const averageRating = totalRatings > 0
        ? data.reduce((sum, r) => sum + r.rating, 0) / totalRatings
        : 0;

      return { totalRatings, averageRating };
    },
    enabled: !!quizId,
  });

  const { data: userRating, isLoading: isLoadingUserRating } = useQuery({
    queryKey: ["user-quiz-rating", quizId, user?.id],
    queryFn: async () => {
      if (!user?.id) return null;

      const { data, error } = await supabase
        .from("quiz_ratings")
        .select("rating")
        .eq("quiz_id", quizId)
        .eq("user_id", user.id)
        .maybeSingle();

      if (error) throw error;
      return data?.rating ?? null;
    },
    enabled: !!quizId && !!user?.id,
  });

  const submitRating = useMutation({
    mutationFn: async (rating: number) => {
      if (!user?.id) throw new Error("İstifadəçi daxil olmayıb");

      // Check if user already rated
      const { data: existing } = await supabase
        .from("quiz_ratings")
        .select("id")
        .eq("quiz_id", quizId)
        .eq("user_id", user.id)
        .maybeSingle();

      if (existing) {
        // Update existing rating
        const { error } = await supabase
          .from("quiz_ratings")
          .update({ rating })
          .eq("quiz_id", quizId)
          .eq("user_id", user.id);

        if (error) throw error;
      } else {
        // Insert new rating
        const { error } = await supabase
          .from("quiz_ratings")
          .insert({ quiz_id: quizId, user_id: user.id, rating });

        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["quiz-ratings", quizId] });
      queryClient.invalidateQueries({ queryKey: ["user-quiz-rating", quizId, user?.id] });
      toast.success("Reytinqiniz qeyd edildi");
    },
    onError: (error) => {
      console.error("Error submitting rating:", error);
      toast.error("Reytinq göndərilə bilmədi");
    },
  });

  return {
    averageRating: ratings?.averageRating ?? 0,
    totalRatings: ratings?.totalRatings ?? 0,
    userRating,
    isLoading: isLoadingRatings || isLoadingUserRating,
    submitRating: submitRating.mutate,
    isSubmitting: submitRating.isPending,
  };
}
