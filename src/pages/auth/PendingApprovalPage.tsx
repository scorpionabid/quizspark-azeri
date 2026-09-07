import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Clock, LogOut, Mail, RefreshCw, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export default function PendingApprovalPage() {
    const navigate = useNavigate();
    const { signOut, profile, user, role, refreshProfile, isAuthenticated, isLoading } = useAuth();
    const [isChecking, setIsChecking] = useState(false);

    // Smart redirects: active teacher goes to dashboard, student goes home, unauthenticated goes to auth
    useEffect(() => {
        if (!isLoading) {
            if (!isAuthenticated) {
                navigate('/auth');
            } else if (role === 'teacher' && profile?.status === 'active') {
                toast.success('Müəllim hesabınız artıq təsdiqlənib!');
                navigate('/teacher/dashboard');
            } else if (role === 'student') {
                navigate('/');
            }
        }
    }, [isLoading, isAuthenticated, role, profile, navigate]);

    // Realtime channel: listen to admin updating profiles.status to 'active'
    useEffect(() => {
        if (!user) return;

        const channel = supabase
            .channel(`pending_approval_${user.id}`)
            .on(
                'postgres_changes',
                {
                    event: 'UPDATE',
                    schema: 'public',
                    table: 'profiles',
                    filter: `user_id=eq.${user.id}`,
                },
                async (payload) => {
                    const newStatus = payload.new?.status;
                    if (newStatus === 'active') {
                        toast.success('Təbriklər! Hesabınız admin tərəfindən təsdiqləndi!');
                        await refreshProfile();
                        navigate('/teacher/dashboard');
                    }
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [user, refreshProfile, navigate]);

    const handleCheckStatus = async () => {
        setIsChecking(true);
        try {
            await refreshProfile();
            if (profile?.status === 'active') {
                toast.success('Təbriklər! Hesabınız təsdiqləndi.');
                navigate('/teacher/dashboard');
            } else {
                toast.info('Hesabınız hələ də nəzərdən keçirilir. Zəhmət olmasa bir az gözləyin.');
            }
        } finally {
            setIsChecking(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
            {/* Background decorations */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-yellow-500/5 rounded-full blur-3xl" />
                <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="relative max-w-md w-full text-center space-y-7"
            >
                {/* Icon */}
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                    className="flex justify-center"
                >
                    <div className="w-24 h-24 bg-yellow-500/10 border-2 border-yellow-500/30 rounded-3xl flex items-center justify-center shadow-lg shadow-yellow-500/10">
                        <Clock className="w-12 h-12 text-yellow-500 animate-pulse" />
                    </div>
                </motion.div>

                {/* Title */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="space-y-2.5"
                >
                    <h1 className="text-3xl font-black text-foreground tracking-tight">
                        Hesabınız Gözləmədədir
                    </h1>
                    <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
                        Salam, <span className="font-bold text-foreground">{profile?.full_name || 'Müəllim'}</span>!
                        Müəllim hesabınız təhlükəsizlik məqsədilə admin tərəfindən
                        <strong> təsdiqlənməyi gözləyir</strong>.
                    </p>
                </motion.div>

                {/* Info Card */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="bg-card/70 border-2 border-border/70 rounded-2xl p-5 text-left space-y-3.5 shadow-sm backdrop-blur-sm"
                >
                    <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-primary" />
                        <span>Proses necə işləyir?</span>
                    </h3>
                    <ol className="space-y-2 text-xs text-muted-foreground list-decimal list-inside leading-relaxed">
                        <li>Admin qeydiyyat məlumatlarınızı nəzərdən keçirir</li>
                        <li>Təsdiqləndikdən sonra müəllim kabinetiniz avtomatik açılacaq</li>
                        <li>Bu səhifədə qalaraq statusu canlı izləyə bilərsiniz</li>
                    </ol>

                    {user?.email && (
                        <div className="flex items-center gap-2 mt-3 pt-3 border-t border-border/50 text-xs text-muted-foreground">
                            <Mail className="w-4 h-4 flex-shrink-0 text-primary" />
                            <span>Bildiriş ünvanı: <strong className="text-foreground">{user.email}</strong></span>
                        </div>
                    )}
                </motion.div>

                {/* Actions */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-1"
                >
                    <Button
                        variant="default"
                        onClick={handleCheckStatus}
                        disabled={isChecking}
                        className="w-full sm:w-auto h-11 px-6 rounded-xl font-bold gap-2 shadow-md"
                    >
                        <RefreshCw className={`w-4 h-4 ${isChecking ? 'animate-spin' : ''}`} />
                        <span>{isChecking ? 'Yoxlanılır...' : 'Statusu Yoxla'}</span>
                    </Button>

                    <Button
                        variant="outline"
                        onClick={() => signOut()}
                        className="w-full sm:w-auto h-11 px-5 rounded-xl font-bold gap-2"
                    >
                        <LogOut className="w-4 h-4" />
                        <span>Çıxış et</span>
                    </Button>
                </motion.div>
            </motion.div>
        </div>
    );
}
