import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, Users, Star, Award, Zap, Database } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { SubscriptionGate } from "@/components/subscription/SubscriptionGate";

interface TeacherProfileProps {
    stats: {
        teacherStats?: {
            totalCreated: number;
            totalPlays: number;
            averageRating: string;
        }
    } | null;
}

export function TeacherProfile({ stats }: TeacherProfileProps) {
    const { profile } = useAuth();
    const isVip = profile?.subscription_tier === 'vip';

    const item = {
        hidden: { y: 20, opacity: 0 },
        show: { y: 0, opacity: 1 }
    };

    const teacherStats = stats?.teacherStats || {
        totalCreated: 0,
        totalPlays: 0,
        averageRating: "0"
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
                                    <p className="text-sm text-muted-foreground">Yaradılan Quiz</p>
                                    <p className="text-2xl font-bold">{teacherStats.totalCreated}</p>
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
                                    <Users className="h-6 w-6 text-secondary" />
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Ümumi Oynanılma</p>
                                    <p className="text-2xl font-bold">{teacherStats.totalPlays}</p>
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
                                    <Star className="h-6 w-6 text-accent" />
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Orta Reytinq</p>
                                    <p className="text-2xl font-bold">{teacherStats.averageRating}/5</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Recent Activity / Created Quizzes placeholder or more stats */}
                <motion.div variants={item} className="lg:col-span-2 space-y-6">
                    <h2 className="text-2xl font-bold tracking-tight">Müəllim İmtiyazları</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Card className="bg-card/50 backdrop-blur-sm border-border/50">
                            <CardContent className="p-6 space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-primary/10 rounded-lg">
                                        <Zap className="h-5 w-5 text-primary" />
                                    </div>
                                    <h3 className="font-bold">AI Assistant</h3>
                                </div>
                                <p className="text-sm text-muted-foreground">
                                    Süni intellekt köməyi ilə saniyələr içində peşəkar quiz-lər yaradın.
                                </p>
                                <SubscriptionGate feature="ai_assistant" variant="inline">
                                    <Button variant="outline" size="sm" className="w-full" onClick={() => window.location.href = '/ai-assistant'}>
                                        İstifadə Et
                                    </Button>
                                </SubscriptionGate>
                            </CardContent>
                        </Card>

                        <Card className="bg-card/50 backdrop-blur-sm border-border/50">
                            <CardContent className="p-6 space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-secondary/10 rounded-lg">
                                        <Database className="h-5 w-5 text-secondary" />
                                    </div>
                                    <h3 className="font-bold">Sual Bankı</h3>
                                </div>
                                <p className="text-sm text-muted-foreground">
                                    Minlərlə hazır sualdan istifadə edərərk imtahanlarınızı sürətləndirin.
                                </p>
                                <SubscriptionGate feature="question_bank_write" variant="inline">
                                    <Button variant="outline" size="sm" className="w-full" onClick={() => window.location.href = '/question-bank'}>
                                        Bankı İdarə Et
                                    </Button>
                                </SubscriptionGate>
                            </CardContent>
                        </Card>
                    </div>
                </motion.div>

                {/* VIP Status Card */}
                <motion.div variants={item} className="space-y-6">
                    <h2 className="text-2xl font-bold tracking-tight">Status</h2>
                    <Card className={`relative overflow-hidden border-none ${isVip ? 'bg-gradient-to-br from-primary/20 to-accent/20' : 'bg-muted/30'}`}>
                        {isVip && (
                            <div className="absolute -right-4 -top-4 opacity-10">
                                <Award className="h-32 w-32" />
                            </div>
                        )}
                        <CardContent className="p-6 flex flex-col items-center text-center space-y-4">
                            <div className={`p-4 rounded-full ${isVip ? 'bg-primary/20 text-primary' : 'bg-muted text-muted-foreground'}`}>
                                <Award className="h-10 w-10" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold">{isVip ? 'VİP Müəllim' : 'Quest Müəllim'}</h3>
                                <p className="text-sm text-muted-foreground mt-2">
                                    {isVip
                                        ? 'Bütün üstünlüklərdən məhdudiyyətsiz istifadə edirsiniz.'
                                        : 'VİP-ə keçid edərək limitsiz quiz yaratma və AI dəstəyi qazanın.'}
                                </p>
                            </div>
                            {!isVip && (
                                <Button className="w-full shadow-lg">Abunə Ol</Button>
                            )}
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        </div>
    );
}
