import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface Permission {
  id: string;
  name: string;
  description: string | null;
  category: string;
}

export interface RolePermission {
  id: string;
  role: "admin" | "teacher" | "student";
  permission_id: string;
}

export function usePermissions() {
  return useQuery({
    queryKey: ["permissions"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("permissions")
        .select("*")
        .order("category", { ascending: true });

      if (error) throw error;
      return data as Permission[];
    },
  });
}

export function useRolePermissions() {
  return useQuery({
    queryKey: ["role-permissions"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("role_permissions")
        .select("*");

      if (error) throw error;
      return data as RolePermission[];
    },
  });
}

export function useToggleRolePermission() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      role,
      permissionId,
      hasPermission,
    }: {
      role: "admin" | "teacher" | "student";
      permissionId: string;
      hasPermission: boolean;
    }) => {
      if (hasPermission) {
        // Remove permission
        const { error } = await supabase
          .from("role_permissions")
          .delete()
          .eq("role", role)
          .eq("permission_id", permissionId);

        if (error) throw error;
      } else {
        // Add permission
        const { error } = await supabase
          .from("role_permissions")
          .insert({ role, permission_id: permissionId });

        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["role-permissions"] });
      toast.success("İcazə yeniləndi!");
    },
    onError: (error) => {
      console.error("Error toggling permission:", error);
      toast.error("İcazəni yeniləmək mümkün olmadı");
    },
  });
}
