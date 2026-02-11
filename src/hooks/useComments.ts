import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export interface Comment {
  id: string;
  user_id: string;
  quiz_id: string;
  content: string;
  parent_id: string | null;
  created_at: string;
  updated_at: string;
  profile?: {
    full_name: string | null;
    avatar_url: string | null;
  };
  replies?: Comment[];
}

export function useComments(quizId: string) {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: comments = [], isLoading } = useQuery({
    queryKey: ["comments", quizId],
    queryFn: async () => {
      // First fetch comments
      const { data: commentsData, error: commentsError } = await supabase
        .from("comments")
        .select("*")
        .eq("quiz_id", quizId)
        .order("created_at", { ascending: false });

      if (commentsError) throw commentsError;

      // Then fetch profiles for those users
      const userIds = [...new Set(commentsData.map(c => c.user_id))];
      const { data: profilesData } = await supabase
        .from("profiles")
        .select("user_id, full_name, avatar_url")
        .in("user_id", userIds);

      const profileMap = new Map(
        profilesData?.map(p => [p.user_id, { full_name: p.full_name, avatar_url: p.avatar_url }]) || []
      );

      const commentsWithProfiles: Comment[] = commentsData.map(c => ({
        ...c,
        profile: profileMap.get(c.user_id) || undefined,
      }));

      return organizeComments(commentsWithProfiles);
    },
    enabled: !!quizId,
  });

  const addComment = useMutation({
    mutationFn: async ({ content, parentId }: { content: string; parentId?: string }) => {
      if (!user?.id) throw new Error("İstifadəçi daxil olmayıb");

      const { error } = await supabase
        .from("comments")
        .insert({
          quiz_id: quizId,
          user_id: user.id,
          content,
          parent_id: parentId || null,
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", quizId] });
      toast.success("Şərhiniz əlavə edildi");
    },
    onError: (error) => {
      console.error("Error adding comment:", error);
      toast.error("Şərh əlavə edilə bilmədi");
    },
  });

  const updateComment = useMutation({
    mutationFn: async ({ commentId, content }: { commentId: string; content: string }) => {
      if (!user?.id) throw new Error("İstifadəçi daxil olmayıb");

      const { error } = await supabase
        .from("comments")
        .update({ content })
        .eq("id", commentId)
        .eq("user_id", user.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", quizId] });
      toast.success("Şərhiniz yeniləndi");
    },
    onError: (error) => {
      console.error("Error updating comment:", error);
      toast.error("Şərh yenilənə bilmədi");
    },
  });

  const deleteComment = useMutation({
    mutationFn: async (commentId: string) => {
      if (!user?.id) throw new Error("İstifadəçi daxil olmayıb");

      const { error } = await supabase
        .from("comments")
        .delete()
        .eq("id", commentId)
        .eq("user_id", user.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", quizId] });
      toast.success("Şərhiniz silindi");
    },
    onError: (error) => {
      console.error("Error deleting comment:", error);
      toast.error("Şərh silinə bilmədi");
    },
  });

  return {
    comments,
    isLoading,
    addComment: addComment.mutate,
    updateComment: updateComment.mutate,
    deleteComment: deleteComment.mutate,
    isAdding: addComment.isPending,
    isUpdating: updateComment.isPending,
    isDeleting: deleteComment.isPending,
  };
}

// Helper function to organize comments into threads
function organizeComments(comments: Comment[]): Comment[] {
  const commentMap = new Map<string, Comment>();
  const rootComments: Comment[] = [];

  // First pass: create map of all comments
  comments.forEach((comment) => {
    commentMap.set(comment.id, { ...comment, replies: [] });
  });

  // Second pass: organize into tree structure
  comments.forEach((comment) => {
    const mappedComment = commentMap.get(comment.id)!;
    if (comment.parent_id) {
      const parent = commentMap.get(comment.parent_id);
      if (parent) {
        parent.replies = parent.replies || [];
        parent.replies.push(mappedComment);
      } else {
        // Parent not found, treat as root
        rootComments.push(mappedComment);
      }
    } else {
      rootComments.push(mappedComment);
    }
  });

  return rootComments;
}
