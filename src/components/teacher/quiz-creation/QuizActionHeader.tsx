import { ArrowLeft, Save, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

interface QuizActionHeaderProps {
    onBack: () => void;
    onSave: (publish?: boolean) => void;
    isSubmitting: boolean;
    questionCount: number;
}

export function QuizActionHeader({ onBack, onSave, isSubmitting, questionCount }: QuizActionHeaderProps) {
    return (
        <div className="mb-8 flex items-center justify-between gap-2">
            <div className="flex items-center gap-3">
                <Button
                    variant="ghost"
                    onClick={onBack}
                    className="text-muted-foreground hover:text-foreground shrink-0"
                >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Geri
                </Button>
                {questionCount > 0 && (
                    <span className="text-sm font-medium text-muted-foreground">
                        {questionCount} sual
                    </span>
                )}
            </div>
            <div className="flex gap-2">
                <Button
                    variant="outline"
                    onClick={() => onSave(false)}
                    disabled={isSubmitting}
                >
                    {isSubmitting ? <LoadingSpinner size="sm" className="mr-2" /> : <Save className="mr-2 h-4 w-4" />}
                    Qaralama
                </Button>
                <Button
                    variant="game"
                    onClick={() => onSave(true)}
                    disabled={isSubmitting}
                >
                    {isSubmitting ? <LoadingSpinner size="sm" className="mr-2" /> : <CheckCircle className="mr-2 h-4 w-4" />}
                    Dərc Et
                </Button>
            </div>
        </div>
    );
}
