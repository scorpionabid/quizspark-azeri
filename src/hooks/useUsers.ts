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
          subscription_tier,
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
                subscriptionTier: (p.subscription_tier as 'vip' | 'quest') || 'quest',
                createdAt: p.created_at,
            }));
        },
    });

    const updateStatus = useMutation({
        mutationFn: async ({ userId, status }: { userId: string, status: string }) => {
            const { error, data } = await supabase
                .from('profiles')
                .update({ status })
                .eq('user_id', userId)
                .select('user_id');

            if (error) throw error;

            // If no rows returned, the update was silently blocked (e.g. by RLS)
            if (!data || data.length === 0) {
                throw new Error('İcazə rədd edildi. Status yenilənmədi. Admin hüququ tələb olunur.');
            }
        },
        onSuccess: (_data, variables) => {
            queryClient.invalidateQueries({ queryKey: ["admin_users"] });
            const statusLabel = variables.status === 'active' ? 'aktiv' :
                variables.status === 'inactive' ? 'deaktiv' : 'gözləmədə';
            toast.success(`İstifadəçi ${statusLabel} edildi`);
        },
        onError: (err: Error) => {
            toast.error(err.message || "Status yenilənərkən xəta baş verdi");
        }
    });

    const updateRole = useMutation({
        mutationFn: async ({ userId, role }: { userId: string, role: AppRole }) => {
            const { error, data } = await supabase
                .from('user_roles')
                .update({ role })
                .eq('user_id', userId)
                .select('user_id');

            if (error) throw error;

            if (!data || data.length === 0) {
                throw new Error('İcazə rədd edildi. Rol yenilənmədi. Admin hüququ tələb olunur.');
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin_users"] });
            toast.success("İstifadəçi rolu yeniləndi");
        },
        onError: (err: Error) => {
            toast.error(err.message || "Rol yenilənərkən xəta baş verdi");
        }
    });

    const deleteUser = useMutation({
        mutationFn: async (userId: string) => {
            const { error, data } = await supabase
                .from('profiles')
                .delete()
                .eq('user_id', userId)
                .select('user_id');

            if (error) throw error;

            if (!data || data.length === 0) {
                throw new Error('İstifadəçi tapılmadı və ya artıq silinib.');
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin_users"] });
            toast.success("İstifadəçi uğurla silindi");
        },
        onError: (err: Error) => {
            toast.error(err.message || "Silmə zamanı xəta baş verdi");
        }
    });

    const updateTier = useMutation({
        mutationFn: async ({ userId, tier }: { userId: string, tier: 'vip' | 'quest' }) => {
            const { error } = await supabase.rpc('update_subscription_tier', {
                p_user_id: userId,
                p_tier: tier,
            });
            if (error) throw error;
        },
        onSuccess: (_data, variables) => {
            queryClient.invalidateQueries({ queryKey: ["admin_users"] });
            toast.success(`İstifadəçi ${variables.tier === 'vip' ? 'VIP' : 'Quest'} edildi`);
        },
        onError: (err: Error) => {
            toast.error(err.message || "Tier yenilənərkən xəta baş verdi");
        }
    });

    return {
        users,
        isLoading,
        error,
        updateStatus,
        updateRole,
        updateTier,
        deleteUser
    };
}
