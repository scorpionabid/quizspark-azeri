import React from 'react';
import { useGamification } from '@/hooks/useGamification';
import { XPProgressCircle } from './XPProgressCircle';
import { Flame, Trophy } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

export const StudentGamificationHeader: React.FC = () => {
    const { profile, isLoading } = useGamification();

    if (isLoading) {
        return (
            <div className="flex items-center gap-3 p-1.5 rounded-full bg-muted/20 border border-muted/30 w-44 animate-pulse">
                <Skeleton className="w-8 h-8 rounded-full" />
                <div className="space-y-1">
                    <Skeleton className="w-16 h-3" />
                    <Skeleton className="w-10 h-2" />
                </div>
            </div>
        );
    }

    if (!profile) return null;

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-4 px-4 py-1.5 rounded-2xl bg-card border shadow-sm hover:shadow-md transition-shadow duration-300"
        >
            <XPProgressCircle
                xp={profile.xp_points || 0}
                level={profile.level || 1}
                size={38}
                strokeWidth={3}
            />

            <div className="flex flex-col min-w-[60px]">
                <div className="flex items-center gap-1">
                    <span className="text-sm font-black text-foreground">
                        {profile.xp_points || 0}
                        <span className="ml-1 text-[9px] font-bold text-muted-foreground uppercase tracking-tight">XP</span>
                    </span>
                </div>
                <div className="text-[9px] font-bold text-muted-foreground flex items-center gap-2">
                    <div className="flex items-center gap-1 text-primary">
                        <Trophy className="h-2.5 w-2.5" />
                        <span>TOP 10%</span>
                    </div>
                </div>
            </div>

            <div className="h-8 w-px bg-border mx-1" />

            <div className={cn(
                "flex flex-col items-center justify-center min-w-[50px] px-2 py-0.5 rounded-xl transition-all duration-500",
                (profile.streak_count || 0) > 0
                    ? "bg-orange-500/10 text-orange-500"
                    : "bg-muted/50 text-muted-foreground grayscale"
            )}>
                <div className="flex items-center gap-1">
                    <Flame
                        className={cn(
                            "h-4 w-4",
                            (profile.streak_count || 0) > 0 && "animate-bounce"
                        )}
                        fill="currentColor"
                    />
                    <span className="text-sm font-black">{profile.streak_count || 0}</span>
                </div>
                <span className="text-[7px] uppercase font-black tracking-tighter">Streak</span>
            </div>
        </motion.div>
    );
};
