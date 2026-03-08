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
        const { error } = await supabase
          .from("role_permissions")
          .delete()
          .eq("role", role)
          .eq("permission_id", permissionId);

        if (error) throw error;
      } else {
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

export function useBulkToggleRolePermissions() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      role,
      permissionIds,
      grantAll,
    }: {
      role: "admin" | "teacher" | "student";
      permissionIds: string[];
      grantAll: boolean;
    }) => {
      if (grantAll) {
        // Mövcud icazələri sil, sonra hamısını əlavə et (upsert kimi)
        const { error: delErr } = await supabase
          .from("role_permissions")
          .delete()
          .eq("role", role)
          .in("permission_id", permissionIds);
        if (delErr) throw delErr;

        const rows = permissionIds.map((pid) => ({ role, permission_id: pid }));
        const { error: insErr } = await supabase
          .from("role_permissions")
          .insert(rows);
        if (insErr) throw insErr;
      } else {
        // Hamısını sil
        const { error } = await supabase
          .from("role_permissions")
          .delete()
          .eq("role", role)
          .in("permission_id", permissionIds);
        if (error) throw error;
      }
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["role-permissions"] });
      toast.success(
        variables.grantAll
          ? "Bütün icazələr verildi!"
          : "Bütün icazələr alındı!"
      );
    },
    onError: (error) => {
      console.error("Bulk toggle error:", error);
      toast.error("Toplu əməliyyat uğursuz oldu");
    },
  });
}
