import { motion } from 'framer-motion';
import { Clock, LogOut, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';

export default function PendingApprovalPage() {
    const { signOut, profile, user } = useAuth();

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
                className="relative max-w-md w-full text-center space-y-8"
            >
                {/* Icon */}
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                    className="flex justify-center"
                >
                    <div className="w-24 h-24 bg-yellow-500/10 border-2 border-yellow-500/30 rounded-3xl flex items-center justify-center">
                        <Clock className="w-12 h-12 text-yellow-500" />
                    </div>
                </motion.div>

                {/* Title */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="space-y-3"
                >
                    <h1 className="text-3xl font-bold text-foreground">
                        Hesabınız Gözləmədədir
                    </h1>
                    <p className="text-muted-foreground text-lg leading-relaxed">
                        Salam, <span className="font-semibold text-foreground">{profile?.full_name || 'Müəllim'}</span>!
                        Qeydiyyatınız tamamlandı, lakin müəllim hesabınız admin tərəfindən
                        <strong> təsdiqlənməyi gözləyir</strong>.
                    </p>
                </motion.div>

                {/* Info Card */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="bg-muted/50 border border-border rounded-2xl p-6 text-left space-y-4"
                >
                    <h3 className="font-semibold text-foreground">📋 Prosess necə işləyir?</h3>
                    <ol className="space-y-2 text-sm text-muted-foreground list-decimal list-inside">
                        <li>Admin hesabınızı nəzərdən keçirir</li>
                        <li>Təsdiqləndikdən sonra sisteminizə giriş açılır</li>
                        <li>Email ünvanınıza bildiriş göndəriləcək</li>
                    </ol>

                    {user?.email && (
                        <div className="flex items-center gap-2 mt-4 pt-4 border-t border-border text-sm text-muted-foreground">
                            <Mail className="w-4 h-4 flex-shrink-0" />
                            <span>Bildiriş göndəriləcək: <strong className="text-foreground">{user.email}</strong></span>
                        </div>
                    )}
                </motion.div>

                {/* Action */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                >
                    <Button
                        variant="outline"
                        onClick={() => signOut()}
                        className="gap-2"
                    >
                        <LogOut className="w-4 h-4" />
                        Çıxış et
                    </Button>
                </motion.div>
            </motion.div>
        </div>
    );
}
