import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { AppRole } from "@/types/auth";
import { toast } from "sonner";

export function useUsers() {
    const queryClient = useQueryClient();

    const { data: users, isLoading, error } = useQuery({
        queryKey: ["admin_users"],
        queryFn: async () => {
            const { data: profiles, error: profilesError } = await supabase
                .from('profiles')
                .select(`
          id,
          user_id,
          full_name,
          email,
          phone,
          status,
          created_at
        `);

            if (profilesError) throw profilesError;

            const { data: roles, error: rolesError } = await supabase
                .from('user_roles')
                .select('user_id, role');

            if (rolesError) throw rolesError;

            const rolesMap = roles.reduce((acc, curr) => {
                acc[curr.user_id] = curr.role;
                return acc;
            }, {} as Record<string, string>);

            return profiles.map(p => ({
                id: p.user_id,
                name: p.full_name || "İstifadəçi",
                email: p.email || "",
                phone: p.phone,
                status: p.status || 'active',
                role: rolesMap[p.user_id] || 'student',
                createdAt: p.created_at,
            }));
        },
    });

    const updateStatus = useMutation({
        mutationFn: async ({ userId, status }: { userId: string, status: string }) => {
            const { error } = await supabase
                .from('profiles')
                .update({ status })
                .eq('user_id', userId);

            if (error) throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin_users"] });
            toast.success("İstifadəçi statusu yeniləndi");
        },
        onError: (err: Error) => {
            toast.error(err.message || "Xəta baş verdi");
        }
    });

    const updateRole = useMutation({
        mutationFn: async ({ userId, role }: { userId: string, role: AppRole }) => {
            const { error } = await supabase
                .from('user_roles')
                .update({ role })
                .eq('user_id', userId);

            if (error) throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin_users"] });
            toast.success("İstifadəçi rolu yeniləndi");
        },
        onError: (err: Error) => {
            toast.error(err.message || "Xəta baş verdi");
        }
    });

    return {
        users,
        isLoading,
        error,
        updateStatus,
        updateRole
    };
}
