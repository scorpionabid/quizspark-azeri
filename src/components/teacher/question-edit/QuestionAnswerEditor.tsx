import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MultipleChoiceEditor } from './MultipleChoiceEditor';

interface QuestionAnswerEditorProps {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    formData: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setFormData: (data: any) => void;
}

export function QuestionAnswerEditor({ formData, setFormData }: QuestionAnswerEditorProps) {
    const showOptions = formData.question_type === 'multiple_choice' || formData.question_type === 'true_false';

    return (
        <div className="space-y-4">
            {/* Options for MC and TF */}
            {showOptions && (
                <MultipleChoiceEditor
                    options={formData.options}
                    onChange={(options) => setFormData({ ...formData, options })}
                />
            )}

            {/* Correct Answer */}
            <div className="space-y-2">
                <Label htmlFor="correct_answer">Düzgün Cavab *</Label>
                <Input
                    id="correct_answer"
                    value={formData.correct_answer}
                    onChange={(e) => setFormData({ ...formData, correct_answer: e.target.value })}
                    placeholder={showOptions ? 'Məs: A, B, C, D' : 'Düzgün cavabı daxil edin'}
                />
            </div>

            {/* Hint */}
            <div className="space-y-2">
                <Label htmlFor="hint">İpucu (Hint)</Label>
                <Input
                    id="hint"
                    value={formData.hint}
                    onChange={(e) => setFormData({ ...formData, hint: e.target.value })}
                    placeholder="Tələbə üçün ipucu..."
                />
            </div>

            {/* Explanation */}
            <div className="space-y-2">
                <Label htmlFor="explanation">İzahat</Label>
                <textarea
                    id="explanation"
                    className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    value={formData.explanation}
                    onChange={(e) => setFormData({ ...formData, explanation: e.target.value })}
                    placeholder="Cavabın izahatı..."
                    rows={2}
                />
            </div>
        </div>
    );
}
