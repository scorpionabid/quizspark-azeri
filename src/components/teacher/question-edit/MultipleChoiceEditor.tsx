import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Plus, Trash2 } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

interface MultipleChoiceEditorProps {
    options: string[];
    onChange: (options: string[]) => void;
    correctAnswer: string;
    onCorrectAnswerChange: (answer: string) => void;
    readOnly?: boolean;
}

export function MultipleChoiceEditor({
    options,
    onChange,
    correctAnswer,
    onCorrectAnswerChange,
    readOnly = false
}: MultipleChoiceEditorProps) {
    const updateOption = (index: number, value: string) => {
        const newOptions = [...options];
        newOptions[index] = value;
        onChange(newOptions);
    };

    const addOption = () => {
        onChange([...options, '']);
    };

    const removeOption = (index: number) => {
        if (options.length <= 2) return;
        onChange(options.filter((_, i) => i !== index));
    };

    return (
        <div className="space-y-3">
            <Label className="text-base">Variantlar və Düzgün Cavab</Label>
            <RadioGroup
                value={correctAnswer}
                onValueChange={onCorrectAnswerChange}
                className="space-y-2"
            >
                {options.map((option, index) => {
                    const letter = String.fromCharCode(65 + index); // A, B, C, D...
                    return (
                        <div key={index} className="flex items-center gap-2">
                            <RadioGroupItem
                                value={letter}
                                id={`option-radio-${index}`}
                                className="shrink-0"
                            />
                            <Label
                                htmlFor={`option-radio-${index}`}
                                className="w-5 shrink-0 font-semibold text-muted-foreground cursor-pointer text-center"
                            >
                                {letter}
                            </Label>
                            <Input
                                value={option}
                                onChange={(e) => updateOption(index, e.target.value)}
                                placeholder={`Variant ${letter}`}
                                readOnly={readOnly}
                                className={readOnly ? 'bg-muted/50 cursor-not-allowed' : ''}
                            />
                            {!readOnly && (
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => removeOption(index)}
                                    disabled={options.length <= 2}
                                    className="shrink-0 text-muted-foreground hover:text-destructive"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            )}
                        </div>
                    );
                })}
            </RadioGroup>

            {!readOnly && (
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addOption}
                    className="mt-1"
                >
                    <Plus className="h-4 w-4 mr-1" />
                    Variant əlavə et
                </Button>
            )}
        </div>
    );
}
