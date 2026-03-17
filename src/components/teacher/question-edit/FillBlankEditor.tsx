import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Plus, Trash2, Info } from 'lucide-react';

interface FillBlankEditorProps {
    questionText: string;
    correctAnswers: string[];
    onCorrectAnswersChange: (answers: string[]) => void;
}

/**
 * Sual mətnindəki ___ sayını hesablayır.
 */
function countBlanks(text: string): number {
    return (text.match(/___+/g) || []).length;
}

/**
 * Boşluq doldurun tipi üçün düzgün cavab editoru.
 *
 * Sual mətnindəki hər ___ üçün bir cavab sahəsi göstərir.
 * Cavablar | ilə ayrılmış şəkildə saxlanır: "Bakı|Azərbaycan"
 */
export function FillBlankEditor({
    questionText,
    correctAnswers,
    onCorrectAnswersChange,
}: FillBlankEditorProps) {
    const blankCount = countBlanks(questionText);

    // Cavab siyahısını blank sayına uyğunlaşdır
    const answers = Array.from({ length: Math.max(blankCount, correctAnswers.length, 1) }, (_, i) =>
        correctAnswers[i] ?? ''
    );

    const handleChange = (index: number, value: string) => {
        const updated = [...answers];
        updated[index] = value;
        onCorrectAnswersChange(updated.filter((_, i) => i < Math.max(blankCount, updated.length)));
    };

    const handleAdd = () => {
        onCorrectAnswersChange([...answers, '']);
    };

    const handleRemove = (index: number) => {
        const updated = answers.filter((_, i) => i !== index);
        onCorrectAnswersChange(updated.length > 0 ? updated : ['']);
    };

    // Önizləmə: ___ → sarı vurğulama
    const renderPreview = () => {
        if (!questionText.trim()) return null;
        const parts = questionText.split(/(___+)/g);
        let blankIdx = 0;
        return (
            <div className="text-sm p-3 rounded-md border bg-muted/30 leading-relaxed">
                {parts.map((part, i) => {
                    if (/^___+$/.test(part)) {
                        const idx = blankIdx++;
                        const answer = answers[idx];
                        return (
                            <span
                                key={i}
                                className={`inline-block min-w-[60px] border-b-2 text-center mx-0.5 font-medium ${answer ? 'border-green-500 text-green-700 dark:text-green-400' : 'border-amber-400 text-amber-600'}`}
                            >
                                {answer || `_${idx + 1}_`}
                            </span>
                        );
                    }
                    return <span key={i}>{part}</span>;
                })}
            </div>
        );
    };

    return (
        <div className="space-y-3">
            {/* Köməkçi məlumat */}
            <div className="flex items-start gap-2 p-3 rounded-md bg-blue-50/60 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/30 text-xs text-blue-700 dark:text-blue-400">
                <Info className="h-3.5 w-3.5 mt-0.5 shrink-0" />
                <span>
                    Yuxarıdakı sual mətnindəki boşluqları{' '}
                    <code className="font-mono bg-blue-100 dark:bg-blue-900/40 px-1 rounded">___</code>{' '}
                    (3+ alt xətt) ilə işarələyin. Hər boşluq üçün aşağıda bir cavab sahəsi yaranacaq.
                </span>
            </div>

            {/* Canlı önizləmə */}
            {questionText.trim() && (
                <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">Önizləmə</Label>
                    {renderPreview()}
                </div>
            )}

            {/* Cavab sahələri */}
            <div className="space-y-2">
                <Label>Düzgün Cavab(lar) *</Label>
                {answers.map((answer, index) => (
                    <div key={index} className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground w-6 text-right shrink-0">
                            {index + 1}.
                        </span>
                        <Input
                            value={answer}
                            onChange={(e) => handleChange(index, e.target.value)}
                            placeholder={`${index + 1}-ci boşluğun cavabı`}
                            className="flex-1"
                        />
                        {answers.length > 1 && (
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-destructive hover:text-destructive"
                                onClick={() => handleRemove(index)}
                            >
                                <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                        )}
                    </div>
                ))}

                {/* Yalnız boşluq sayından artıq cavab əlavə etmək lazım gəldikdə */}
                {blankCount === 0 && (
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="text-xs h-7"
                        onClick={handleAdd}
                    >
                        <Plus className="h-3 w-3 mr-1" />
                        Cavab Əlavə Et
                    </Button>
                )}
            </div>

            {blankCount > 0 && answers.length < blankCount && (
                <p className="text-xs text-amber-600">
                    ⚠ Sual mətnində {blankCount} boşluq var, amma yalnız {answers.length} cavab daxil edilib.
                </p>
            )}
        </div>
    );
}
