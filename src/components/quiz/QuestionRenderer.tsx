import React, { useState } from 'react';
import { QuestionAnswer, QuestionType } from '@/types/question';
import { Question } from '@/hooks/useQuestions';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { QuestionVideoPlayer } from '../question-bank/QuestionVideoPlayer';
import { Question3DViewer } from '../question-bank/Question3DViewer';
import { cn } from '@/lib/utils';

interface Props {
    question: Question;
    onAnswer: (answer: QuestionAnswer) => void;
    showFeedback?: boolean;
    disabled?: boolean;
}

export function QuestionRenderer({ question, onAnswer, showFeedback, disabled }: Props) {
    const [selectedValue, setSelectedValue] = useState<string>('');

    const handleSelect = (val: string) => {
        if (disabled || showFeedback) return;
        setSelectedValue(val);

        let isCorrect = false;
        // basic exact comparison
        if (val === question.correct_answer) {
            isCorrect = true;
        }

        onAnswer({
            questionId: question.id,
            questionType: question.question_type as QuestionType,
            textAnswer: val,
            isCorrect,
            pointsEarned: isCorrect ? (question.weight || 1) : 0,
            selectedOptionIndex: question.options ? question.options.indexOf(val) : undefined
        });
    };

    const renderContent = () => {
        switch (question.question_type) {
            case 'video':
                return (
                    <div className="space-y-4">
                        {question.video_url && (
                            <QuestionVideoPlayer
                                videoUrl={question.video_url}
                                startTime={question.video_start_time || undefined}
                                endTime={question.video_end_time || undefined}
                            />
                        )}
                        <Input
                            disabled={disabled || showFeedback}
                            placeholder="Sizin cavabınız..."
                            value={selectedValue}
                            onChange={(e) => handleSelect(e.target.value)}
                        />
                    </div>
                );
            case 'model_3d':
                return (
                    <div className="space-y-4">
                        {question.model_3d_url && (
                            <Question3DViewer modelUrl={question.model_3d_url} />
                        )}
                        <Input
                            disabled={disabled || showFeedback}
                            placeholder="3D əsasında cavabınız..."
                            value={selectedValue}
                            onChange={(e) => handleSelect(e.target.value)}
                        />
                    </div>
                );
            case 'true_false':
                return (
                    <RadioGroup value={selectedValue} onValueChange={handleSelect} disabled={disabled || showFeedback} className="flex gap-4">
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="true" id="true" />
                            <Label htmlFor="true">Doğru</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="false" id="false" />
                            <Label htmlFor="false">Yanlış</Label>
                        </div>
                    </RadioGroup>
                );
            case 'multiple_choice':
                return (
                    <RadioGroup value={selectedValue} onValueChange={handleSelect} disabled={disabled || showFeedback} className="space-y-2">
                        {question.options?.map((opt, i) => (
                            <div key={i} className="flex items-center space-x-2">
                                <RadioGroupItem value={opt} id={`opt-${i}`} />
                                <Label htmlFor={`opt-${i}`}>{opt}</Label>
                            </div>
                        ))}
                    </RadioGroup>
                );
            case 'short_answer':
            case 'numerical':
            case 'fill_blank':
                return (
                    <Input
                        disabled={disabled || showFeedback}
                        placeholder="Sizin cavabınız..."
                        value={selectedValue}
                        onChange={(e) => handleSelect(e.target.value)}
                    />
                );
            case 'essay':
                return (
                    <Textarea
                        disabled={disabled || showFeedback}
                        placeholder="Esse yazın..."
                        value={selectedValue}
                        onChange={(e) => handleSelect(e.target.value)}
                    />
                );
            // Geri qalan tiplər üçün "Kod sualı", "Matching", "Ordering" (bunlar üçün MVP olaraq textArea və inkişaf səviyyəsində əlavə edilər)
            default:
                return (
                    <Textarea
                        disabled={disabled || showFeedback}
                        placeholder="Cavabınız..."
                        value={selectedValue}
                        onChange={(e) => handleSelect(e.target.value)}
                    />
                );
        }
    };

    return (
        <div className="space-y-4">
            {renderContent()}

            {showFeedback && (
                <div className={cn(
                    "p-4 mt-4 rounded-xl border transition-all duration-300 animate-scale-in",
                    selectedValue === question.correct_answer
                        ? "bg-success/10 border-success/30 text-success"
                        : "bg-destructive/10 border-destructive/30 text-destructive"
                )}>
                    <h4 className="font-black mb-2 flex items-center gap-2">
                        {selectedValue === question.correct_answer ? (
                            <><span>✅</span> Doğru!</>
                        ) : (
                            <><span>❌</span> Yanlış!</>
                        )}
                    </h4>

                    {question.explanation && (
                        <div className="text-sm mt-2 opacity-90 leading-relaxed bg-background/40 p-3 rounded-lg border border-current/10">
                            <strong className="block mb-1 uppercase text-[10px] font-black tracking-widest opacity-70">Açıqlama</strong>
                            {question.explanation}
                        </div>
                    )}

                    {question.per_option_explanations && selectedValue && question.options && (
                        <div className="text-sm mt-3 p-3 rounded-lg bg-background/20 font-medium">
                            {question.per_option_explanations[question.options.indexOf(selectedValue)?.toString()]}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
