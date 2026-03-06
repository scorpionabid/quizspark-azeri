import { motion } from 'framer-motion';
import { GraduationCap, UserCircle, CheckCircle2, ArrowRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AppRole } from '@/types/auth';
import { useState } from 'react';

interface RoleSelectionProps {
    onSelect: (role: AppRole) => Promise<void>;
    isSubmitting: boolean;
}

export function RoleSelection({ onSelect, isSubmitting }: RoleSelectionProps) {
    const [selected, setSelected] = useState<AppRole | null>(null);

    const roles = [
        {
            id: 'student' as AppRole,
            title: 'Şagird',
            description: 'Quizlərdə iştirak etmək və biliklərimi yoxlamaq istəyirəm.',
            icon: UserCircle,
            color: 'blue',
        },
        {
            id: 'teacher' as AppRole,
            title: 'Müəllim',
            description: 'Yeni quizlər yaratmaq və şagirdlərin nəticələrini izləmək istəyirəm.',
            icon: GraduationCap,
            color: 'purple',
        },
    ];

    const handleConfirm = async () => {
        if (selected) {
            await onSelect(selected);
        }
    };

    return (
        <div className="space-y-8 py-4">
            <div className="text-center space-y-2">
                <h3 className="text-2xl font-bold tracking-tight">Siz kimsiniz?</h3>
                <p className="text-muted-foreground">Davam etmək üçün rolunuzu seçin</p>
            </div>

            <div className="grid grid-cols-1 gap-4">
                {roles.map((role) => {
                    const Icon = role.icon;
                    const isSelected = selected === role.id;

                    return (
                        <motion.div
                            key={role.id}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => setSelected(role.id)}
                            className="cursor-pointer"
                        >
                            <Card className={`relative overflow-hidden border-2 transition-all duration-300 ${isSelected
                                    ? 'border-primary bg-primary/5 shadow-md'
                                    : 'border-border hover:border-primary/50 bg-card'
                                }`}>
                                <CardContent className="p-6">
                                    <div className="flex items-center gap-6">
                                        <div className={`p-4 rounded-2xl ${isSelected ? 'bg-primary text-white' : 'bg-muted text-muted-foreground'
                                            } transition-colors duration-300`}>
                                            <Icon className="h-8 w-8" />
                                        </div>

                                        <div className="flex-1 space-y-1">
                                            <div className="flex items-center justify-between">
                                                <h4 className="text-lg font-bold">{role.title}</h4>
                                                {isSelected && (
                                                    <motion.div
                                                        initial={{ scale: 0 }}
                                                        animate={{ scale: 1 }}
                                                    >
                                                        <CheckCircle2 className="h-6 w-6 text-primary fill-primary/10" />
                                                    </motion.div>
                                                )}
                                            </div>
                                            <p className="text-sm text-muted-foreground leading-relaxed">
                                                {role.description}
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    );
                })}
            </div>

            <Button
                className="w-full h-14 text-lg font-bold rounded-2xl shadow-lg transition-all duration-300"
                disabled={!selected || isSubmitting}
                onClick={handleConfirm}
            >
                {isSubmitting ? (
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                    >
                        <ArrowRight className="h-5 w-5" />
                    </motion.div>
                ) : (
                    <div className="flex items-center justify-center gap-2">
                        Təsdiqlə və Davam et
                        <ArrowRight className="h-5 w-5" />
                    </div>
                )}
            </Button>
        </div>
    );
}
