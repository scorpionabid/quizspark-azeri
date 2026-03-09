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
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Image as ImageIcon, Video, Music, Box, MonitorPlay } from 'lucide-react';

interface Props {
    question: Question;
    value: string;
    onChange: (val: string) => void;
    showFeedback?: boolean;
    disabled?: boolean;
}

export function QuestionRenderer({ question, value, onChange, showFeedback, disabled }: Props) {
    const [matchingSelection, setMatchingSelection] = useState<{ left?: string, right?: string }>({});
    const [orderingSequence, setOrderingSequence] = useState<string[]>([]);

    // Initialize ordering sequence if empty
    React.useEffect(() => {
        if (question.question_type === 'ordering' && orderingSequence.length === 0 && question.sequence_items) {
            setOrderingSequence([...question.sequence_items].sort(() => Math.random() - 0.5));
        }
    }, [question.id, question.question_type, question.sequence_items, orderingSequence.length]);

    const handleSelect = (val: string) => {
        if (disabled || showFeedback) return;
        onChange(val);
    };

    const handleOrderingSwap = (idx: number) => {
        if (disabled || showFeedback) return;
        // Simple tap to move to front or swap logic
        // For now, let's do a simple swap with the one above it
        if (idx > 0) {
            const newSeq = [...orderingSequence];
            [newSeq[idx - 1], newSeq[idx]] = [newSeq[idx], newSeq[idx - 1]];
            setOrderingSequence(newSeq);
            onChange(newSeq.join('|||'));
        }
    };

    const renderMedia = () => {
        return (
            <div className="space-y-4 mb-4">
                {/* Image Section */}
                {(question.question_image_url || (question.media_type === 'image' && question.media_url)) && (
                    <div className="relative group">
                        <img
                            src={question.question_image_url || question.media_url!}
                            alt="Sual şəkli"
                            className="max-h-80 w-auto mx-auto rounded-2xl border-2 border-primary/10 shadow-lg object-contain bg-background/50"
                        />
                    </div>
                )}

                {/* Video Section */}
                {(question.question_type === 'video' || question.media_type === 'video') && (question.video_url || question.media_url) && (
                    <div className="space-y-2">
                        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-primary/60 px-1">
                            <MonitorPlay className="w-3 h-3" />
                            <span>Video Material</span>
                        </div>
                        <QuestionVideoPlayer
                            videoUrl={question.video_url || question.media_url!}
                            startTime={question.video_start_time || undefined}
                            endTime={question.video_end_time || undefined}
                        />
                    </div>
                )}

                {/* 3D Model Section */}
                {(question.question_type === 'model_3d' || question.model_3d_url) && (
                    <div className="space-y-2">
                        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-secondary/60 px-1">
                            <Box className="w-3 h-3" />
                            <span>3D Model</span>
                        </div>
                        <Question3DViewer modelUrl={question.model_3d_url || question.media_url!} />
                    </div>
                )}

                {/* Audio Section */}
                {question.media_type === 'audio' && question.media_url && (
                    <div className="p-4 bg-primary/5 rounded-2xl border border-primary/10 flex flex-col gap-2">
                        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-primary/60">
                            <Music className="w-3 h-3" />
                            <span>Səs Yazısı</span>
                        </div>
                        <audio src={question.media_url} controls className="w-full h-10" />
                    </div>
                )}
            </div>
        );
    };

    const renderContent = () => {
        switch (question.question_type) {
            case 'video':
                return (
                    <div className="space-y-4">
                        <Input
                            disabled={disabled || showFeedback}
                            placeholder="Sizin cavabınız..."
                            value={value}
                            onChange={(e) => handleSelect(e.target.value)}
                        />
                    </div>
                );
            case 'model_3d':
                return (
                    <div className="space-y-4">
                        <Input
                            disabled={disabled || showFeedback}
                            placeholder="3D əsasında cavabınız..."
                            value={value}
                            onChange={(e) => handleSelect(e.target.value)}
                        />
                    </div>
                );
            case 'true_false':
                return (
                    <RadioGroup value={value} onValueChange={handleSelect} disabled={disabled || showFeedback} className="flex gap-4">
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
                    <RadioGroup value={value} onValueChange={handleSelect} disabled={disabled || showFeedback} className="space-y-2">
                        {question.options?.map((opt, i) => (
                            <div key={i} className="flex items-center space-x-2">
                                <RadioGroupItem value={opt} id={`opt-${i}`} />
                                <Label htmlFor={`opt-${i}`}>{opt}</Label>
                            </div>
                        ))}
                    </RadioGroup>
                );
            case 'numerical':
                return (
                    <Input
                        type="number"
                        inputMode="decimal"
                        className="h-14 text-lg font-bold text-center border-2 border-primary/20 focus:border-primary rounded-2xl"
                        disabled={disabled || showFeedback}
                        placeholder="Rəqəmi daxil edin..."
                        value={value}
                        onChange={(e) => handleSelect(e.target.value)}
                    />
                );
            case 'short_answer':
            case 'fill_blank':
                return (
                    <Input
                        className="h-12 border-2 border-primary/10 focus:border-primary rounded-xl"
                        disabled={disabled || showFeedback}
                        placeholder="Sizin cavabınız..."
                        value={value}
                        onChange={(e) => handleSelect(e.target.value)}
                    />
                );
            case 'essay':
                return (
                    <Textarea
                        disabled={disabled || showFeedback}
                        placeholder="Esse yazın..."
                        value={value}
                        onChange={(e) => handleSelect(e.target.value)}
                    />
                );
            // Geri qalan tiplər üçün "Kod sualı", "Matching", "Ordering" (bunlar üçün MVP olaraq textArea və inkişaf səviyyəsində əlavə edilər)
            case 'ordering': {
                return (
                    <div className="space-y-2">
                        <p className="text-xs text-muted-foreground mb-2 italic">Elementlərin üzərinə toxunaraq ardıcıllığı qurun</p>
                        <div className="grid gap-2">
                            {orderingSequence.map((item, idx) => (
                                <div
                                    key={idx}
                                    className="flex items-center gap-3 p-3 rounded-xl bg-card border border-border shadow-sm active:scale-95 transition-transform cursor-pointer hover:bg-muted/30"
                                    onClick={() => handleOrderingSwap(idx)}
                                >
                                    <div className="h-8 w-8 flex items-center justify-center rounded-lg bg-primary/10 text-primary font-bold">{idx + 1}</div>
                                    <span className="flex-1 text-sm">{item}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                );
            }
            case 'matching': {
                const pairs = question.matching_pairs || [];
                // Simplified matching: click left, click right -> match
                const handleMatch = (side: 'left' | 'right', val: string) => {
                    const newSelection = { ...matchingSelection, [side]: val };
                    if (newSelection.left && newSelection.right) {
                        const matchStr = `${newSelection.left}:${newSelection.right}`;
                        const currentMatches = value ? value.split('|||') : [];
                        if (!currentMatches.includes(matchStr)) {
                            onChange([...currentMatches, matchStr].join('|||'));
                        }
                        setMatchingSelection({});
                    } else {
                        setMatchingSelection(newSelection);
                    }
                };

                const currentMatches = value ? value.split('|||') : [];

                return (
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <p className="text-[10px] font-bold uppercase text-muted-foreground px-1">Sütun A</p>
                                {Object.keys(pairs).map((leftKey, i) => (
                                    <Button
                                        key={i}
                                        variant={matchingSelection.left === leftKey ? "default" : "outline"}
                                        className={cn(
                                            "w-full justify-start text-xs h-auto py-3 px-3 whitespace-normal text-left rounded-xl transition-all",
                                            currentMatches.some(m => m.startsWith(leftKey + ':')) && "opacity-50 border-success/50 bg-success/5"
                                        )}
                                        onClick={() => handleMatch('left', leftKey)}
                                        disabled={disabled || showFeedback}
                                    >
                                        {leftKey}
                                    </Button>
                                ))}
                            </div>
                            <div className="space-y-2">
                                <p className="text-[10px] font-bold uppercase text-muted-foreground px-1">Sütun B</p>
                                {Object.values(pairs).map((rightVal, i) => (
                                    <Button
                                        key={i}
                                        variant={matchingSelection.right === rightVal ? "default" : "outline"}
                                        className={cn(
                                            "w-full justify-start text-xs h-auto py-3 px-3 whitespace-normal text-left rounded-xl transition-all",
                                            currentMatches.some(m => m.endsWith(':' + rightVal)) && "opacity-50 border-success/50 bg-success/5"
                                        )}
                                        onClick={() => handleMatch('right', rightVal)}
                                        disabled={disabled || showFeedback}
                                    >
                                        {rightVal}
                                    </Button>
                                ))}
                            </div>
                        </div>
                        {currentMatches.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-2">
                                {currentMatches.map((m, idx) => (
                                    <Badge key={idx} variant="secondary" className="px-2 py-1 text-[10px]">
                                        {m.replace(':', ' ↔ ')}
                                    </Badge>
                                ))}
                            </div>
                        )}
                    </div>
                );
            }
            default:
                return (
                    <Textarea
                        className="min-h-[120px] rounded-xl border-2 border-primary/5 focus:border-primary"
                        disabled={disabled || showFeedback}
                        placeholder="Cavabınız..."
                        value={value}
                        onChange={(e) => handleSelect(e.target.value)}
                    />
                );
        }
    };

    return (
        <div className="space-y-4">
            {renderMedia()}
            {renderContent()}

            {showFeedback && (
                <div className={cn(
                    "p-4 mt-4 rounded-xl border transition-all duration-300 animate-scale-in",
                    value === question.correct_answer
                        ? "bg-success/10 border-success/30 text-success"
                        : "bg-destructive/10 border-destructive/30 text-destructive"
                )}>
                    <h4 className="font-black mb-2 flex items-center gap-2">
                        {value === question.correct_answer ? (
                            <><span>✅</span> Doğru!</>
                        ) : (
                            <><span>❌</span> Yanlış!</>
                        )}
                    </h4>

                    {question.explanation && (
                        <div className="text-sm mt-2 opacity-90 leading-relaxed bg-background/40 p-3 rounded-lg border border-border/20">
                            <strong className="block mb-1 uppercase text-[10px] font-black tracking-widest opacity-70">Açıqlama</strong>
                            {question.explanation}
                        </div>
                    )}

                    {question.per_option_explanations && value && Array.isArray(question.options) && (
                        <div className="text-sm mt-3 p-3 rounded-lg bg-background/20 font-medium">
                            {question.per_option_explanations[question.options.indexOf(value)?.toString()]}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
