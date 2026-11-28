import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { AppRole } from "@/types/auth";
import { toast } from "sonner";

export interface UserItem {
    id: string;
    name: string;
    email: string;
    phone?: string | null;
    school?: string | null;
    specialty?: string | null;
    fin?: string | null;
    utisCode?: string | null;
    status: string;
    role: string;
    subscriptionTier: 'vip' | 'quest';
    createdAt: string;
    lastActiveAt?: string | null;
    quizCount?: number;
    questionCount?: number;
}

export interface TeacherQuizItem {
    id: string;
    title: string;
    subject?: string;
    grade?: string;
    playCount: number;
    questionCount: number;
    isPublished: boolean;
    createdAt: string;
}

export interface TeacherStatItem {
    userId: string;
    fullName: string;
    email: string;
    phone?: string | null;
    school?: string | null;
    specialty?: string | null;
    status: string;
    quizCount: number;
    publishedQuizCount: number;
    quizQuestionCount: number;
    bankQuestionCount: number;
    totalQuestions: number;
    totalPlays: number;
    lastCreatedDate?: string | null;
    quizzes: TeacherQuizItem[];
}

export function useUsers() {
    const queryClient = useQueryClient();

    const { data: users, isLoading, error } = useQuery({
        queryKey: ["admin_users"],
        queryFn: async (): Promise<UserItem[]> => {
            // 1. Primary: Fast database-joined RPC that bypasses any pagination/row limit
            const { data: rpcData, error: rpcError } = await supabase.rpc('admin_get_all_users');

            if (!rpcError && Array.isArray(rpcData)) {
                interface RpcUserRow {
                    id: string;
                    name?: string | null;
                    email?: string | null;
                    phone?: string | null;
                    school?: string | null;
                    specialty?: string | null;
                    fin?: string | null;
                    utisCode?: string | null;
                    status?: string | null;
                    role?: UserItem['role'] | null;
                    subscriptionTier?: string | null;
                    createdAt?: string;
                    lastActiveAt?: string | null;
                    quizCount?: number | null;
                    questionCount?: number | null;
                }
                return (rpcData as RpcUserRow[]).map((p) => ({
                    id: p.id,
                    name: p.name || "İstifadəçi",
                    email: p.email || "",
                    phone: p.phone ?? undefined,
                    school: p.school ?? undefined,
                    specialty: p.specialty ?? undefined,
                    fin: p.fin ?? undefined,
                    utisCode: p.utisCode ?? undefined,
                    status: (p.status as UserItem['status']) || 'active',
                    role: p.role || 'student',
                    subscriptionTier: (p.subscriptionTier as 'vip' | 'quest') || 'quest',
                    createdAt: p.createdAt || '',
                    lastActiveAt: p.lastActiveAt ?? undefined,
                    quizCount: p.quizCount || 0,
                    questionCount: p.questionCount || 0,
                }));
            }

            if (rpcError) {
                console.warn('[useUsers] admin_get_all_users RPC failed, executing fallback queries:', rpcError.message);
            }

            // 2. Fallback: Direct queries
            const { data: profiles, error: profilesError } = await supabase
                .from('profiles')
                .select(`
                  id,
                  user_id,
                  full_name,
                  email,
                  phone,
                  school,
                  specialty,
                  fin,
                  utis_code,
                  status,
                  subscription_tier,
                  created_at,
                  last_active_at
                `)
                .order('created_at', { ascending: false });

            if (profilesError) throw profilesError;

            const { data: roles, error: rolesError } = await supabase
                .from('user_roles')
                .select('user_id, role');

            if (rolesError) throw rolesError;

            const rolesMap = (roles || []).reduce((acc, curr) => {
                acc[curr.user_id] = curr.role;
                return acc;
            }, {} as Record<string, string>);

            return (profiles || []).map(p => ({
                id: p.user_id,
                name: p.full_name || "İstifadəçi",
                email: p.email || "",
                phone: p.phone,
                school: p.school,
                specialty: p.specialty,
                fin: p.fin,
                utisCode: p.utis_code,
                status: p.status || 'active',
                role: rolesMap[p.user_id] || 'student',
                subscriptionTier: (p.subscription_tier as 'vip' | 'quest') || 'quest',
                createdAt: p.created_at,
                lastActiveAt: p.last_active_at,
            }));
        },
    });

    const createUser = useMutation({
        mutationFn: async (payload: {
            email: string;
            password: string;
            fullName: string;
            role: AppRole;
            phone?: string;
            school?: string;
            specialty?: string;
            fin?: string;
        }) => {
            const { data, error } = await supabase.rpc('admin_create_user', {
                p_email: payload.email.trim(),
                p_password: payload.password,
                p_full_name: payload.fullName.trim(),
                p_role: payload.role,
                p_phone: payload.phone?.trim() || null,
                p_school: payload.school?.trim() || null,
                p_specialty: payload.specialty?.trim() || null,
                p_fin: payload.fin?.trim()?.toUpperCase() || null,
            });

            if (error) throw error;
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin_users"] });
            toast.success("Yeni istifadəçi uğurla yaradıldı!");
        },
        onError: (err: Error) => {
            toast.error(err.message || "İstifadəçi yaradılarkən xəta baş verdi");
        }
    });

    const updateUserProfile = useMutation({
        mutationFn: async (payload: {
            userId: string;
            fullName?: string;
            phone?: string | null;
            school?: string | null;
            specialty?: string | null;
            fin?: string | null;
            role?: AppRole;
            tier?: 'vip' | 'quest';
            status?: string;
        }) => {
            const { error } = await supabase.rpc('admin_update_user_profile', {
                p_user_id: payload.userId,
                p_full_name: payload.fullName || null,
                p_phone: payload.phone !== undefined ? payload.phone : null,
                p_school: payload.school !== undefined ? payload.school : null,
                p_specialty: payload.specialty !== undefined ? payload.specialty : null,
                p_fin: payload.fin !== undefined ? payload.fin : null,
                p_role: payload.role || null,
                p_tier: payload.tier || null,
                p_status: payload.status || null,
            });

            if (error) {
                // Fallback direct update on profiles
                console.warn('[useUsers] admin_update_user_profile RPC failed, trying direct:', error.message);
                const updateData: Record<string, unknown> = {};
                if (payload.fullName !== undefined) updateData.full_name = payload.fullName;
                if (payload.phone !== undefined) updateData.phone = payload.phone;
                if (payload.school !== undefined) updateData.school = payload.school;
                if (payload.specialty !== undefined) updateData.specialty = payload.specialty;
                if (payload.fin !== undefined) updateData.fin = payload.fin;
                if (payload.tier !== undefined) updateData.subscription_tier = payload.tier;
                if (payload.status !== undefined) updateData.status = payload.status;

                if (Object.keys(updateData).length > 0) {
                    const { error: profError } = await supabase
                        .from('profiles')
                        .update(updateData)
                        .eq('user_id', payload.userId);
                    if (profError) throw profError;
                }

                if (payload.role) {
                    const { error: roleError } = await supabase
                        .from('user_roles')
                        .update({ role: payload.role })
                        .eq('user_id', payload.userId);
                    if (roleError) throw roleError;
                }
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin_users"] });
            toast.success("İstifadəçi məlumatları uğurla yeniləndi");
        },
        onError: (err: Error) => {
            toast.error(err.message || "Məlumatları yeniləyərkən xəta baş verdi");
        }
    });

    const updateStatus = useMutation({
        mutationFn: async ({ userId, status }: { userId: string, status: string }) => {
            const { error, data } = await supabase
                .from('profiles')
                .update({ status })
                .eq('user_id', userId)
                .select('user_id');

            if (error) throw error;

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
            const { error: rpcError } = await supabase.rpc('admin_delete_user', {
                p_user_id: userId
            });

            if (rpcError) {
                console.warn('[useUsers] admin_delete_user RPC failed, executing direct delete:', rpcError.message);
                const { error, data } = await supabase
                    .from('profiles')
                    .delete()
                    .eq('user_id', userId)
                    .select('user_id');

                if (error) throw error;

                if (!data || data.length === 0) {
                    throw new Error('İstifadəçi tapılmadı və ya artıq silinib.');
                }
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

    const approveTeacher = useMutation({
        mutationFn: async (userId: string) => {
            const { error: rpcError } = await supabase.rpc('admin_approve_teacher', {
                p_user_id: userId
            });

            if (rpcError) {
                console.warn('[useUsers] admin_approve_teacher RPC failed, executing direct update:', rpcError.message);
                const [statusRes, roleRes] = await Promise.all([
                    supabase.from('profiles').update({ status: 'active' }).eq('user_id', userId).select('user_id'),
                    supabase.from('user_roles').upsert({ user_id: userId, role: 'teacher' }, { onConflict: 'user_id' }).select('user_id'),
                ]);

                if (statusRes.error) throw statusRes.error;
                if (roleRes.error) throw roleRes.error;
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin_users"] });
            toast.success("Müəllim hesabı təsdiqləndi və aktivləşdirildi!");
        },
        onError: (err: Error) => {
            toast.error(err.message || "Təsdiqləmə zamanı xəta baş verdi");
        }
    });

    const approveAllTeachers = useMutation({
        mutationFn: async (userIds: string[]) => {
            if (!userIds || userIds.length === 0) return;
            const [statusRes, roleRes] = await Promise.all([
                supabase.from('profiles').update({ status: 'active' }).in('user_id', userIds).select('user_id'),
                supabase.from('user_roles').upsert(
                    userIds.map(uid => ({ user_id: uid, role: 'teacher' as AppRole })),
                    { onConflict: 'user_id,role' }
                ).select('user_id')
            ]);

            if (statusRes.error) throw statusRes.error;
            if (roleRes.error) throw roleRes.error;
        },
        onSuccess: (_data, variables) => {
            queryClient.invalidateQueries({ queryKey: ["admin_users"] });
            toast.success(`${variables.length} müəllim hesabı uğurla təsdiqləndi!`);
        },
        onError: (err: Error) => {
            toast.error(err.message || "Toplu təsdiqləmə zamanı xəta baş verdi");
        }
    });

    return {
        users,
        isLoading,
        error,
        createUser,
        updateUserProfile,
        updateStatus,
        updateRole,
        updateTier,
        deleteUser,
        approveTeacher,
        approveAllTeachers
    };
}

export function useTeacherStats() {
    const { data: teacherStats, isLoading, error, refetch } = useQuery({
        queryKey: ["admin_teacher_stats"],
        queryFn: async (): Promise<TeacherStatItem[]> => {
            const { data, error } = await supabase.rpc('admin_get_teacher_stats');
            if (error) {
                console.error('[useTeacherStats] Error fetching teacher stats:', error);
                throw error;
            }
            return (data as TeacherStatItem[]) || [];
        },
    });

    return {
        teacherStats,
        isLoading,
        error,
        refetch
    };
}
