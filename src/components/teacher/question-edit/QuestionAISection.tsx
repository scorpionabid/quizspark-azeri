import { Button } from '@/components/ui/button';
import { Loader2, Sparkles } from 'lucide-react';

interface QuestionAISectionProps {
    onAnalyze: () => void;
    isEnhancing: boolean;
    disabled: boolean;
}

export function QuestionAISection({ onAnalyze, isEnhancing, disabled }: QuestionAISectionProps) {
    return (
        <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute right-2 top-8 text-primary hover:text-primary hover:bg-primary/10"
            onClick={onAnalyze}
            disabled={isEnhancing || disabled}
            title="AI ilə Analiz Et"
        >
            {isEnhancing ? (
                <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
                <Sparkles className="h-4 w-4" />
            )}
        </Button>
    );
}
