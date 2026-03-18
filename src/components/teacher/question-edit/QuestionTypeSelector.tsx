import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    List,
    ToggleLeft,
    Type,
    FileText,
    Underline,
    GitMerge,
    ListOrdered,
    Crosshair,
    Hash,
    Code,
    Video,
    Box,
    ListChecks
} from 'lucide-react';
import { QUESTION_TYPES, QuestionType } from '@/types/question';

const ICON_MAP: Record<string, React.ElementType> = {
    'list': List,
    'toggle-left': ToggleLeft,
    'type': Type,
    'file-text': FileText,
    'underline': Underline,
    'git-merge': GitMerge,
    'list-ordered': ListOrdered,
    'crosshair': Crosshair,
    'hash': Hash,
    'code': Code,
    'video': Video,
    'box': Box,
    'list-checks': ListChecks,
};

interface QuestionTypeSelectorProps {
    value: string;
    onChange: (value: QuestionType) => void;
    disabled?: boolean;
}

export function QuestionTypeSelector({ value, onChange, disabled }: QuestionTypeSelectorProps) {
    return (
        <div className="space-y-2">
            <Label>Sual Tipi *</Label>
            <Select
                value={value}
                onValueChange={(val) => onChange(val as QuestionType)}
                disabled={disabled}
            >
                <SelectTrigger>
                    <SelectValue />
                </SelectTrigger>
                <SelectContent>
                    {QUESTION_TYPES.map((type) => {
                        const Icon = ICON_MAP[type.icon] || List;
                        return (
                            <SelectItem key={type.value} value={type.value}>
                                <div className="flex items-center gap-2">
                                    <Icon className="h-4 w-4 text-muted-foreground" />
                                    <span>{type.label}</span>
                                </div>
                            </SelectItem>
                        );
                    })}
                </SelectContent>
            </Select>
        </div>
    );
}
