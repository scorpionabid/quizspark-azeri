import { ReactNode } from 'react';
import { Lock, Sparkles, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useSubscription, SubscriptionFeature } from '@/hooks/useSubscription';

interface SubscriptionGateProps {
    feature: SubscriptionFeature;
    children: ReactNode;
    /** Optional custom message shown to Quest users */
    description?: string;
}

export function SubscriptionGate({ feature, children, description }: SubscriptionGateProps) {
    const { canAccess } = useSubscription();

    if (canAccess(feature)) {
        return <>{children}</>;
    }

    return (
        <div className="min-h-[60vh] flex items-center justify-center p-6">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="w-full max-w-md"
            >
                <Card className="border-2 border-yellow-400/30 bg-gradient-to-br from-yellow-50/50 to-orange-50/30 dark:from-yellow-900/10 dark:to-orange-900/10 shadow-2xl overflow-hidden">
                    <CardContent className="p-10 text-center space-y-6">
                        {/* Badge */}
                        <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-3xl flex items-center justify-center mx-auto shadow-xl shadow-yellow-500/30">
                            <Lock className="h-10 w-10 text-white" />
                        </div>

                        {/* Title */}
                        <div className="space-y-3">
                            <div className="inline-flex items-center gap-2 px-4 py-1 bg-yellow-400/20 rounded-full text-yellow-700 dark:text-yellow-400 text-xs font-black uppercase tracking-widest">
                                <Sparkles className="h-3 w-3" />
                                VIP Xüsusiyyəti
                            </div>
                            <h2 className="text-2xl font-black text-foreground">Bu funksiya VIP üçündür</h2>
                            <p className="text-muted-foreground font-medium leading-relaxed">
                                {description ?? 'Bu xüsusiyyəti istifadə etmək üçün VIP abunəliyinə keçin.'}
                            </p>
                        </div>

                        {/* Features list */}
                        <div className="bg-background/60 rounded-2xl p-5 space-y-3 text-left border border-yellow-400/20">
                            {[
                                'AI Köməkçiyə tam giriş',
                                'Limitsiz quiz yaratmaq',
                                'Sual bankına tam giriş',
                                'VIP badge və üstünlüklər',
                            ].map((item) => (
                                <div key={item} className="flex items-center gap-3 text-sm font-medium text-foreground">
                                    <div className="w-4 h-4 bg-yellow-400/20 rounded-full flex items-center justify-center flex-shrink-0">
                                        <Sparkles className="h-2.5 w-2.5 text-yellow-600" />
                                    </div>
                                    {item}
                                </div>
                            ))}
                        </div>

                        <Button
                            className="w-full h-14 rounded-2xl text-base font-black bg-gradient-to-r from-yellow-400 to-orange-500 text-white border-0 shadow-xl shadow-yellow-500/30 hover:shadow-yellow-500/50 transition-all active:scale-95"
                            onClick={() => window.location.href = 'mailto:admin@quizspark.az?subject=VIP Abunəlik'}
                        >
                            VIP-ə Keçin <ArrowRight className="ml-2 h-5 w-5" />
                        </Button>
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    );
}
