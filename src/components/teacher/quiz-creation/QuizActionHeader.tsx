import { ArrowLeft, Save, CheckCircle, FileEdit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

interface QuizActionHeaderProps {
    onBack: () => void;
    onSave: (publish?: boolean) => void;
    isSubmitting: boolean;
    questionCount: number;
    isAlreadyPublished?: boolean;
}

export function QuizActionHeader({ onBack, onSave, isSubmitting, questionCount, isAlreadyPublished = false }: QuizActionHeaderProps) {
    return (
        <div className="sticky top-0 z-30 mb-6 -mx-4 px-4 py-3 sm:-mx-6 sm:px-6 bg-background/85 backdrop-blur-md border-b border-border/40 flex items-center justify-between gap-2 shadow-xs transition-all">
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
                {isAlreadyPublished ? (
                    <>
                        <Button
                            variant="outline"
                            onClick={() => {
                                if (window.confirm('Bu quiz hazırda dərc olunub. Qaralamaya keçirmək istədiyinizdən əminsiniz? Şagirdlər üçün əlçatmaz olacaq.')) {
                                    onSave(false);
                                }
                            }}
                            disabled={isSubmitting}
                            className="text-amber-600 dark:text-amber-400 hover:text-amber-700"
                        >
                            {isSubmitting ? <LoadingSpinner size="sm" className="mr-2" /> : <Save className="mr-2 h-4 w-4" />}
                            Qaralamaya Keçir
                        </Button>
                        <Button
                            variant="game"
                            onClick={() => onSave(true)}
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? <LoadingSpinner size="sm" className="mr-2" /> : <CheckCircle className="mr-2 h-4 w-4" />}
                            Yadda Saxla
                        </Button>
                    </>
                ) : (
                    <>
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
                    </>
                )}
            </div>
        </div>
    );
}
