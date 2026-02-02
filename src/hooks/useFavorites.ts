import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export function useFavorites() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: favorites = [], isLoading } = useQuery({
    queryKey: ["favorites", user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const { data, error } = await supabase
        .from("favorites")
        .select("quiz_id")
        .eq("user_id", user.id);

      if (error) throw error;
      return data.map((f) => f.quiz_id);
    },
    enabled: !!user?.id,
  });

  const addFavorite = useMutation({
    mutationFn: async (quizId: string) => {
      if (!user?.id) throw new Error("İstifadəçi daxil olmayıb");

      const { error } = await supabase
        .from("favorites")
        .insert({ user_id: user.id, quiz_id: quizId });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["favorites", user?.id] });
      toast.success("Favorilərə əlavə edildi");
    },
    onError: (error) => {
      console.error("Error adding favorite:", error);
      toast.error("Favorilərə əlavə edilə bilmədi");
    },
  });

  const removeFavorite = useMutation({
    mutationFn: async (quizId: string) => {
      if (!user?.id) throw new Error("İstifadəçi daxil olmayıb");

      const { error } = await supabase
        .from("favorites")
        .delete()
        .eq("user_id", user.id)
        .eq("quiz_id", quizId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["favorites", user?.id] });
      toast.success("Favorilərdən silindi");
    },
    onError: (error) => {
      console.error("Error removing favorite:", error);
      toast.error("Favorilərdən silinə bilmədi");
    },
  });

  const toggleFavorite = (quizId: string) => {
    if (favorites.includes(quizId)) {
      removeFavorite.mutate(quizId);
    } else {
      addFavorite.mutate(quizId);
    }
  };

  const isFavorite = (quizId: string) => favorites.includes(quizId);

  return {
    favorites,
    isLoading,
    toggleFavorite,
    isFavorite,
    isToggling: addFavorite.isPending || removeFavorite.isPending,
  };
}
