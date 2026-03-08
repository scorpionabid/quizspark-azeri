import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { QUESTION_TYPES, QuestionType } from '@/types/question';

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
                    {QUESTION_TYPES.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                            <div className="flex items-center gap-2">
                                <span>{type.icon}</span>
                                <span>{type.label}</span>
                            </div>
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    );
}
