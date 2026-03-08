import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Plus, Trash2 } from 'lucide-react';
import { Label } from '@/components/ui/label';

interface MultipleChoiceEditorProps {
    options: string[];
    onChange: (options: string[]) => void;
}

export function MultipleChoiceEditor({ options, onChange }: MultipleChoiceEditorProps) {
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
        <div className="space-y-2">
            <Label>Variantlar</Label>
            <div className="space-y-2">
                {options.map((option, index) => (
                    <div key={index} className="flex gap-2">
                        <Input
                            value={option}
                            onChange={(e) => updateOption(index, e.target.value)}
                            placeholder={`Variant ${String.fromCharCode(65 + index)}`}
                        />
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => removeOption(index)}
                            disabled={options.length <= 2}
                        >
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>
                ))}
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addOption}
                    className="mt-2"
                >
                    <Plus className="h-4 w-4 mr-1" />
                    Variant əlavə et
                </Button>
            </div>
        </div>
    );
}
