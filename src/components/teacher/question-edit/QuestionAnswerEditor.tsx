import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MultipleChoiceEditor } from './MultipleChoiceEditor';
import { MatchingEditor } from './MatchingEditor';
import { OrderingEditor } from './OrderingEditor';
import { NumericalEditor } from './NumericalEditor';
import { FillBlankEditor } from './FillBlankEditor';
import { CodeQuestionEditor } from './CodeQuestionEditor';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

interface QuestionAnswerEditorProps {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    formData: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setFormData: (data: any) => void;
    /** Validasiya xətaları — boş olarsa heç nə göstərilmir */
    validationErrors?: Record<string, string>;
}

/**
 * Sual tipinə görə uyğun cavab editorunu render edir.
 * Yeni tiplər: fill_blank, code
 */
export function QuestionAnswerEditor({ formData, setFormData, validationErrors = {} }: QuestionAnswerEditorProps) {
    const { question_type } = formData;

    const isMCQ = question_type === 'multiple_choice' || question_type === 'video';
    const isMS = question_type === 'multiple_select';
    const isTF = question_type === 'true_false';
    const isMatching = question_type === 'matching';
    const isOrdering = question_type === 'ordering';
    const isNumerical = question_type === 'numerical';
    const isFillBlank = question_type === 'fill_blank';
    const isCode = question_type === 'code';

    // fill_blank: correct_answer çoxlu boşluq üçün | ilə ayrılır
    const fillBlankAnswers = isFillBlank
        ? (formData.correct_answer || '').split('|').map((a: string) => a.trim()).filter(Boolean)
        : [];

    // code: dil hint sahəsindən oxunur — "lang:python" formatı
    const codeLang = isCode
        ? (formData.hint || '').startsWith('lang:')
            ? formData.hint.slice(5)
            : 'python'
        : 'python';

    return (
        <div className="space-y-4">
            {/* MCQ / Multi-select */}
            {(isMCQ || isMS) && (
                <MultipleChoiceEditor
                    options={formData.options || []}
                    onChange={(options) => setFormData({ ...formData, options })}
                    correctAnswer={formData.correct_answer || ''}
                    onCorrectAnswerChange={(answer) => setFormData({ ...formData, correct_answer: answer })}
                    isMultiple={isMS}
                />
            )}

            {/* True/False */}
            {isTF && (
                <div className="space-y-3">
                    <Label className="text-base px-1">Düzgün Cavab *</Label>
                    <RadioGroup
                        value={formData.correct_answer}
                        onValueChange={(answer) => setFormData({ ...formData, correct_answer: answer })}
                        className="flex gap-4 px-1"
                    >
                        <div className="flex items-center gap-2 bg-green-50/50 dark:bg-green-950/20 px-4 py-3 rounded-lg border border-green-100 dark:border-green-900/30 cursor-pointer hover:bg-green-50 dark:hover:bg-green-950/30 transition-colors">
                            <RadioGroupItem value="A" id="tf-true" className="text-green-600" />
                            <Label htmlFor="tf-true" className="cursor-pointer font-semibold text-green-600">
                                Doğru
                            </Label>
                        </div>
                        <div className="flex items-center gap-2 bg-red-50/50 dark:bg-red-950/20 px-4 py-3 rounded-lg border border-red-100 dark:border-red-900/30 cursor-pointer hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors">
                            <RadioGroupItem value="B" id="tf-false" className="text-red-600" />
                            <Label htmlFor="tf-false" className="cursor-pointer font-semibold text-red-600">
                                Yanlış
                            </Label>
                        </div>
                    </RadioGroup>
                    <p className="text-[10px] text-muted-foreground px-1 italic">Məlumat: A = Doğru · B = Yanlış</p>
                    {validationErrors.correct_answer && (
                        <p className="text-xs text-destructive px-1">{validationErrors.correct_answer}</p>
                    )}
                </div>
            )}

            {/* Matching */}
            {isMatching && (
                <MatchingEditor
                    pairs={formData.matching_pairs || []}
                    onChange={(pairs) => setFormData({ ...formData, matching_pairs: pairs })}
                />
            )}
            {isMatching && validationErrors.matching_pairs && (
                <p className="text-xs text-destructive">{validationErrors.matching_pairs}</p>
            )}

            {/* Ordering */}
            {isOrdering && (
                <OrderingEditor
                    items={formData.sequence_items || []}
                    onChange={(items) => setFormData({ ...formData, sequence_items: items })}
                />
            )}
            {isOrdering && validationErrors.sequence_items && (
                <p className="text-xs text-destructive">{validationErrors.sequence_items}</p>
            )}

            {/* Numerical */}
            {isNumerical && (
                <NumericalEditor
                    value={formData.numerical_answer}
                    tolerance={formData.numerical_tolerance}
                    onChange={(val, tol) => setFormData({ ...formData, numerical_answer: val, numerical_tolerance: tol })}
                />
            )}
            {isNumerical && validationErrors.numerical_answer && (
                <p className="text-xs text-destructive">{validationErrors.numerical_answer}</p>
            )}

            {/* Fill Blank */}
            {isFillBlank && (
                <FillBlankEditor
                    questionText={formData.question_text || ''}
                    correctAnswers={fillBlankAnswers}
                    onCorrectAnswersChange={(answers) =>
                        setFormData({
                            ...formData,
                            correct_answer: answers.join('|'),
                            fill_blank_template: formData.question_text || '',
                        })
                    }
                />
            )}
            {isFillBlank && validationErrors.correct_answer && (
                <p className="text-xs text-destructive">{validationErrors.correct_answer}</p>
            )}

            {/* Code */}
            {isCode && (
                <CodeQuestionEditor
                    codeLanguage={codeLang}
                    onLanguageChange={(lang) =>
                        setFormData({ ...formData, hint: `lang:${lang}` })
                    }
                    codeSnippet={formData.fill_blank_template || ''}
                    onCodeSnippetChange={(code) =>
                        setFormData({ ...formData, fill_blank_template: code })
                    }
                    correctAnswer={formData.correct_answer}
                    onCorrectAnswerChange={(answer) =>
                        setFormData({ ...formData, correct_answer: answer })
                    }
                />
            )}
            {isCode && validationErrors.correct_answer && (
                <p className="text-xs text-destructive">{validationErrors.correct_answer}</p>
            )}

            {/* Plain text answer for other types (short_answer, essay, hotspot) */}
            {!isMCQ && !isTF && !isMatching && !isOrdering && !isNumerical && !isFillBlank && !isCode && (
                <div className="space-y-2">
                    <Label htmlFor="correct_answer">Düzgün Cavab *</Label>
                    <Input
                        id="correct_answer"
                        value={formData.correct_answer}
                        onChange={(e) => setFormData({ ...formData, correct_answer: e.target.value })}
                        placeholder="Düzgün cavabı daxil edin"
                    />
                    {validationErrors.correct_answer && (
                        <p className="text-xs text-destructive">{validationErrors.correct_answer}</p>
                    )}
                </div>
            )}

            {/* Hint — kod tipindən başqa (kod tipi hint-i dil üçün istifadə edir) */}
            {!isCode && (
                <div className="space-y-2">
                    <Label htmlFor="hint">İpucu (Hint)</Label>
                    <Input
                        id="hint"
                        value={formData.hint}
                        onChange={(e) => setFormData({ ...formData, hint: e.target.value })}
                        placeholder="Tələbə üçün ipucu..."
                    />
                </div>
            )}

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
