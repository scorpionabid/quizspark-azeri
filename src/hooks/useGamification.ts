/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface GamificationStats {
    xp_points: number;
    level: number;
    streak_count: number;
    last_active_at: string | null;
}

export const useGamification = () => {
    const queryClient = useQueryClient();

    const { data: profile, isLoading } = useQuery({
        queryKey: ['profile-gamification'],
        queryFn: async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return null;

            const { data, error } = await (supabase
                .from('profiles')
                .select('xp_points, level, streak_count, last_active_at') as any)
                .eq('user_id', user.id)
                .single();

            if (error) {
                console.error('Error fetching gamification stats:', error);
                return null;
            }
            return data as GamificationStats;
        },
    });

    const updateXP = useMutation({
        mutationFn: async (xpGain: number) => {
            const { data, error } = await (supabase.rpc as any)('update_user_gamification', {
                p_xp_gain: xpGain,
            });

            if (error) throw error;
            return data;
        },
        onSuccess: (data: any) => {
            queryClient.invalidateQueries({ queryKey: ['profile-gamification'] });

            // Notify about XP gain if it's significant or for feedback
            if (data.xp_gained > 0) {
                toast.info(`+${data.xp_gained} XP qazandınız!`, {
                    duration: 2000,
                });
            }

            if (data.level_up) {
                toast.success(`Təbriklər! Yeni səviyyəyə (Level ${data.new_level}) çatdınız!`, {
                    icon: '🎊',
                    duration: 5000,
                });
            }
        },
        onError: (error) => {
            console.error('Gamification update error:', error);
        },
    });

    return {
        profile,
        isLoading,
        updateXP: updateXP.mutate,
        updateXPAsync: updateXP.mutateAsync,
        isUpdating: updateXP.isPending,
    };
};

export const useLeaderboard = () => {
    return useQuery({
        queryKey: ['leaderboard'],
        queryFn: async () => {
            const { data, error } = await (supabase
                .from('profiles')
                .select('id, full_name, avatar_url, xp_points, level') as any)
                .order('xp_points', { ascending: false })
                .limit(10);

            if (error) throw error;
            return data;
        },
    });
};
