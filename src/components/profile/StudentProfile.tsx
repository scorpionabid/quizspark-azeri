import { Card, CardContent } from "@/components/ui/card";
import { BookOpen, Target, Trophy } from "lucide-react";
import { motion } from "framer-motion";
import { formatDistanceToNow } from "date-fns";
import { az } from "date-fns/locale";

interface StudentProfileProps {
    stats: {
        totalQuizzes: number;
        averageScore: number;
        totalPoints: number;
        recentActivity: unknown[];
    } | null;
}

export function StudentProfile({ stats }: StudentProfileProps) {
    const item = {
        hidden: { y: 20, opacity: 0 },
        show: { y: 0, opacity: 1 }
    };

    return (
        <div className="space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <motion.div variants={item}>
                    <Card className="bg-card/50 backdrop-blur-sm border-border/50 hover:shadow-lg transition-shadow">
                        <CardContent className="pt-6">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-primary/10 rounded-2xl">
                                    <BookOpen className="h-6 w-6 text-primary" />
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Cəmi Quiz</p>
                                    <p className="text-2xl font-bold">{stats?.totalQuizzes || 0}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                <motion.div variants={item}>
                    <Card className="bg-card/50 backdrop-blur-sm border-border/50 hover:shadow-lg transition-shadow">
                        <CardContent className="pt-6">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-secondary/10 rounded-2xl">
                                    <Target className="h-6 w-6 text-secondary" />
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Orta Nəticə</p>
                                    <p className="text-2xl font-bold">{stats?.averageScore || 0}%</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                <motion.div variants={item}>
                    <Card className="bg-card/50 backdrop-blur-sm border-border/50 hover:shadow-lg transition-shadow">
                        <CardContent className="pt-6">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-accent/10 rounded-2xl">
                                    <Trophy className="h-6 w-6 text-accent" />
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Qazanılan Xal</p>
                                    <p className="text-2xl font-bold">{stats?.totalPoints?.toLocaleString() || 0}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>

            {/* Main Content Areas */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Recent Activity */}
                <motion.div variants={item} className="lg:col-span-2 space-y-6">
                    <h2 className="text-2xl font-bold tracking-tight">Son fəaliyyətlər</h2>
                    <Card className="bg-card/50 backdrop-blur-sm border-border/50">
                        <CardContent className="p-0">
                            {stats?.recentActivity && stats.recentActivity.length > 0 ? (
                                <div className="divide-y divide-border/50">
                                    {(stats.recentActivity as unknown[]).map((attemptObj, i: number) => {
                                        const attempt = attemptObj as {
                                            id: string;
                                            quizzes: { title: string } | null;
                                            completed_at: string | null;
                                            score: number;
                                            total_questions: number;
                                        };
                                        return (
                                            <div key={attempt.id} className="p-4 flex items-center justify-between hover:bg-muted/50 transition-colors cursor-pointer">
                                                <div className="flex items-center gap-4">
                                                    <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold">
                                                        {i + 1}
                                                    </div>
                                                    <div>
                                                        <p className="font-semibold text-foreground">{attempt.quizzes?.title || 'Adsız Quiz'}</p>
                                                        <p className="text-xs text-muted-foreground">
                                                            {attempt.completed_at ? formatDistanceToNow(new Date(attempt.completed_at), { addSuffix: true, locale: az }) : 'Naməlum vaxt'}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <p className={`font-bold ${((attempt.score / (attempt.total_questions || 1)) * 100) >= 80 ? 'text-success' : 'text-warning'}`}>
                                                        {Math.round(((attempt.score || 0) / (attempt.total_questions || 1)) * 100)}%
                                                    </p>
                                                    <p className="text-xs text-muted-foreground">{attempt.score}/{attempt.total_questions} düz</p>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            ) : (
                                <div className="p-12 text-center text-muted-foreground">
                                    <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-20" />
                                    <p>Hələ heç bir quiz-də iştirak etməmisiniz.</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Achievements/Badges */}
                <motion.div variants={item} className="space-y-6">
                    <h2 className="text-2xl font-bold tracking-tight">Nailiyyətlər</h2>
                    <Card className="bg-card/50 backdrop-blur-sm border-border/50">
                        <CardContent className="grid grid-cols-2 gap-4 p-6">
                            {[
                                { name: "İlk Qələbə", icon: Trophy, active: (stats?.totalQuizzes || 0) >= 1 },
                                { name: "Tələbə", icon: BookOpen, active: (stats?.totalQuizzes || 0) >= 5 },
                                { name: "Ekspert", icon: Target, active: (stats?.averageScore || 0) >= 90 },
                                { name: "Top 10", icon: Trophy, active: false },
                            ].map((badge, i) => (
                                <div
                                    key={i}
                                    className={`flex flex-col items-center gap-2 p-3 rounded-2xl border border-border/10 transition-all ${badge.active ? 'bg-primary/5 text-primary' : 'bg-muted/30 grayscale opacity-50'}`}
                                >
                                    <badge.icon className={`h-8 w-8 ${badge.active ? 'text-primary' : 'text-muted-foreground'}`} />
                                    <span className="text-[10px] uppercase tracking-wider font-bold text-center line-clamp-1">{badge.name}</span>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        </div>
    );
}
