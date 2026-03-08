/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { useLeaderboard } from '@/hooks/useGamification';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { Trophy, Medal, Award } from 'lucide-react';
import { motion } from 'framer-motion';

export const SimpleLeaderboard: React.FC = () => {
    const { data: leaders, isLoading } = useLeaderboard();

    if (isLoading) {
        return (
            <div className="space-y-3 p-5 border rounded-[2rem] bg-card w-full">
                <Skeleton className="h-7 w-32 mb-6" />
                {[...Array(5)].map((_, i) => (
                    <div key={i} className="flex items-center gap-3">
                        <Skeleton className="w-6 h-6 rounded" />
                        <Skeleton className="w-9 h-9 rounded-full" />
                        <div className="space-y-1 flex-1">
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-3 w-12" />
                        </div>
                        <Skeleton className="h-4 w-10" />
                    </div>
                ))}
            </div>
        );
    }

    return (
        <div className="space-y-4 p-6 border rounded-[2rem] bg-card shadow-sm hover:shadow-md transition-shadow duration-500 w-full">
            <div className="flex items-center justify-between mb-4">
                <h3 className="font-black text-xl flex items-center gap-2">
                    <Trophy className="h-5 w-5 text-yellow-500" />
                    Liderlər
                </h3>
                <span className="text-[9px] font-black text-muted-foreground uppercase bg-muted/50 px-3 py-1 rounded-full tracking-widest">
                    TOP 10
                </span>
            </div>

            <div className="space-y-1">
                {(leaders as any)?.map((user: any, index: number) => (
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        key={user.id}
                        className="flex items-center justify-between p-2.5 rounded-2xl hover:bg-muted/40 transition-colors group"
                    >
                        <div className="flex items-center gap-3">
                            <div className="w-6 text-center font-black text-sm text-muted-foreground flex justify-center">
                                {index === 0 ? <Medal className="h-5 w-5 text-yellow-500 drop-shadow-sm" /> :
                                    index === 1 ? <Medal className="h-5 w-5 text-slate-400 drop-shadow-sm" /> :
                                        index === 2 ? <Medal className="h-5 w-5 text-orange-400 drop-shadow-sm" /> :
                                            <span className="opacity-50">{index + 1}</span>}
                            </div>
                            <Avatar className="h-10 w-10 border-2 border-background shadow-sm ring-2 ring-transparent group-hover:ring-primary/20 transition-all">
                                <AvatarImage src={user.avatar_url || ''} />
                                <AvatarFallback className="bg-primary/5 text-primary font-black text-xs">
                                    {user.full_name?.substring(0, 2).toUpperCase() || 'ST'}
                                </AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col overflow-hidden">
                                <span className="text-sm font-bold truncate max-w-[140px] group-hover:text-primary transition-colors">
                                    {user.full_name || 'Gizli Şagird'}
                                </span>
                                <span className="text-[10px] text-muted-foreground font-black uppercase tracking-tighter opacity-70">
                                    Level {user.level || 1}
                                </span>
                            </div>
                        </div>

                        <div className="text-right flex flex-col items-end">
                            <span className="text-sm font-black text-foreground group-hover:scale-110 transition-transform">
                                {user.xp_points || 0}
                            </span>
                            <span className="text-[7px] font-black text-muted-foreground uppercase tracking-widest">XP</span>
                        </div>
                    </motion.div>
                ))}

                {(!leaders || leaders.length === 0) && (
                    <div className="text-center py-12 opacity-30 flex flex-col items-center">
                        <Award className="h-12 w-12 mb-3" />
                        <p className="text-sm font-black uppercase tracking-widest">Hələ rəqabət başlamayıb</p>
                    </div>
                )}
            </div>
        </div>
    );
};
