import { useState, useRef } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useProfileStats } from "@/hooks/useProfileStats";
import { useUpdateProfile } from "@/hooks/useUpdateProfile";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogTrigger
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Trophy, Target, BookOpen, Settings, Edit2, Calendar, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { formatDistanceToNow } from "date-fns";
import { az } from "date-fns/locale";

export default function ProfilePage() {
    const { user, profile, role } = useAuth();
    const { data: stats, isLoading: statsLoading } = useProfileStats();
    const { updateProfile, uploadAvatar, isUpdating } = useUpdateProfile();

    const [newFullName, setNewFullName] = useState(profile?.full_name || "");
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const item = {
        hidden: { y: 20, opacity: 0 },
        show: { y: 0, opacity: 1 }
    };

    const handleUpdateName = async () => {
        const { error } = await updateProfile({ full_name: newFullName });
        if (!error) setIsEditDialogOpen(false);
    };

    const handleAvatarClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            await uploadAvatar(file);
        }
    };

    const getInitials = () => {
        if (profile?.full_name) {
            return profile.full_name
                .split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase()
                .slice(0, 2);
        }
        return user?.email?.slice(0, 2).toUpperCase() || "U";
    };

    if (statsLoading) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="container mx-auto py-8 px-4 max-w-6xl">
            <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="space-y-8"
            >
                {/* Profile Header */}
                <motion.div variants={item} className="relative overflow-hidden rounded-3xl bg-card border border-border/50 shadow-xl">
                    <div className="h-32 bg-gradient-to-r from-primary/20 via-primary/10 to-accent/20" />
                    <div className="px-8 pb-8 flex flex-col md:flex-row items-end -mt-12 gap-6">
                        <div className="relative group cursor-pointer" onClick={handleAvatarClick}>
                            <Avatar className="h-32 w-32 border-4 border-background shadow-2xl transition-transform group-hover:scale-95 duration-200">
                                <AvatarImage src={profile?.avatar_url || ""} />
                                <AvatarFallback className="text-4xl bg-primary/10 text-primary uppercase">
                                    {getInitials()}
                                </AvatarFallback>
                            </Avatar>
                            <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                                {isUpdating ? <Loader2 className="h-8 w-8 animate-spin text-white" /> : <Edit2 className="h-8 w-8 text-white" />}
                            </div>
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileChange}
                                className="hidden"
                                accept="image/*"
                            />
                        </div>

                        <div className="flex-1 space-y-2 mb-2">
                            <div className="flex items-center gap-3">
                                <h1 className="text-3xl font-bold tracking-tight">{profile?.full_name || "İstifadəçi"}</h1>
                                <Badge variant={role === 'student' ? 'outline' : role === 'teacher' ? 'secondary' : 'destructive'} className="capitalize">
                                    {role === 'student' ? 'Şagird' : role === 'teacher' ? 'Müəllim' : 'Admin'}
                                </Badge>
                            </div>
                            <p className="text-muted-foreground flex items-center gap-2 text-sm">
                                <Calendar className="h-4 w-4" />
                                Üzvilik: {user?.created_at ? new Date(user.created_at).toLocaleDateString('az-AZ', { month: 'long', year: 'numeric' }) : 'Yanvar 2024'}
                            </p>
                        </div>

                        <div className="flex gap-3 mb-2">
                            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                                <DialogTrigger asChild>
                                    <Button size="sm" className="gap-2 shadow-lg">
                                        <Edit2 className="h-4 w-4" />
                                        Redaktə Et
                                    </Button>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>Profili Redaktə Et</DialogTitle>
                                    </DialogHeader>
                                    <div className="space-y-4 py-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="fullName">Ad Soyad</Label>
                                            <Input
                                                id="fullName"
                                                value={newFullName}
                                                onChange={(e) => setNewFullName(e.target.value)}
                                                placeholder="Adınız Soyadınız"
                                            />
                                        </div>
                                    </div>
                                    <DialogFooter>
                                        <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Ləğv Et</Button>
                                        <Button onClick={handleUpdateName} disabled={isUpdating}>
                                            {isUpdating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                            Yadda Saxla
                                        </Button>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                        </div>
                    </div>
                </motion.div>

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
                                        {(stats?.recentActivity as unknown[]).map((attemptObj, i: number) => {
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
                                                            <p className="font-semibold text-foreground">{(attempt.quizzes as { title: string } | null)?.title || 'Adsız Quiz'}</p>
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
            </motion.div>
        </div>
    );
}
