import { Plus, Upload, Sparkles, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { QUESTION_TYPES, QuestionType } from '@/types/question';

interface QuizQuickActionsProps {
    onAddQuestion: (type: QuestionType) => void;
    onOpenPicker: () => void;
    onOpenImport: () => void;
    onAiAssistant: () => void;
}

export function QuizQuickActions({ onAddQuestion, onOpenPicker, onOpenImport, onAiAssistant }: QuizQuickActionsProps) {
    const quickTypes: QuestionType[] = ['multiple_choice', 'true_false', 'short_answer'];
    const moreTypes = QUESTION_TYPES.filter((t) => !quickTypes.includes(t.value as QuestionType));

    return (
        <div className="mb-6 flex flex-wrap gap-2">
            <Button variant="outline" onClick={() => onAddQuestion('multiple_choice')}>
                <Plus className="mr-2 h-4 w-4" />
                Çoxseçimli
            </Button>
            <Button variant="outline" onClick={() => onAddQuestion('true_false')}>
                <Plus className="mr-2 h-4 w-4" />
                Doğru/Yanlış
            </Button>
            <Button variant="outline" onClick={() => onAddQuestion('short_answer')}>
                <Plus className="mr-2 h-4 w-4" />
                Qısa Cavab
            </Button>

            {/* More types dropdown */}
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline">
                        Daha çox
                        <ChevronDown className="ml-2 h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-52">
                    {moreTypes.map((t) => (
                        <DropdownMenuItem
                            key={t.value}
                            onClick={() => onAddQuestion(t.value as QuestionType)}
                            className="gap-2"
                        >
                            <span>{t.icon}</span>
                            {t.label}
                        </DropdownMenuItem>
                    ))}
                </DropdownMenuContent>
            </DropdownMenu>

            <Button
                variant="outline"
                onClick={onOpenImport}
                className="border-primary/50 text-primary hover:bg-primary/5 hover:text-primary transition-all shadow-sm"
            >
                <Upload className="mr-2 h-4 w-4" />
                Fayldan İdxal Et
            </Button>
            <Button
                variant="outline"
                onClick={onOpenPicker}
            >
                <Upload className="mr-2 h-4 w-4" />
                Sual Bankından İdxal
            </Button>
            <Button variant="outline" onClick={onAiAssistant}>
                <Sparkles className="mr-2 h-4 w-4" />
                AI ilə Yarat
            </Button>
        </div>
    );
}
