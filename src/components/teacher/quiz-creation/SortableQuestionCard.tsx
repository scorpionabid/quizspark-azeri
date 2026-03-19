import { GripVertical, Pencil, Trash2, Lightbulb, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { QUESTION_TYPES, QuestionType } from '@/types/question';

export interface DraftQuestion {
    localId: string;
    question_text: string;
    question_type: QuestionType;
    options: string[] | null;
    correct_answer: string;
    explanation: string | null;
    order_index: number;
    title?: string | null;
    weight?: number | null;
    hint?: string | null;
    time_limit?: number | null;
    per_option_explanations?: Record<string, string> | null;
    video_url?: string | null;
    video_start_time?: number | null;
    video_end_time?: number | null;
    model_3d_url?: string | null;
    model_3d_type?: string | null;
    hotspot_data?: unknown;
    matching_pairs?: unknown;
    sequence_items?: string[] | null;
    fill_blank_template?: string | null;
    numerical_answer?: number | null;
    numerical_tolerance?: number | null;
    question_image_url?: string | null;
    media_type?: string | null;
    media_url?: string | null;
}

export function getAnswerSummary(q: DraftQuestion): string {
    switch (q.question_type) {
        case 'true_false':
            return q.correct_answer || 'Cavab seçilməyib';
        case 'numerical':
            return q.numerical_answer != null
                ? `${q.numerical_answer}${q.numerical_tolerance ? ` ± ${q.numerical_tolerance}` : ''}`
                : 'Rəqəm daxil edilməyib';
        case 'matching':
            return Array.isArray(q.matching_pairs)
                ? `${q.matching_pairs.length} cütlük`
                : 'Cütlər yoxdur';
        case 'ordering':
            return q.sequence_items ? `${q.sequence_items.length} element` : 'Elementlər yoxdur';
        case 'fill_blank':
            return q.fill_blank_template ?? 'Şablon yoxdur';
        case 'essay':
        case 'short_answer':
            return q.correct_answer ? q.correct_answer.substring(0, 60) : 'Açıq cavab';
        default:
            return q.correct_answer ? q.correct_answer.substring(0, 60) : 'Cavab seçilməyib';
    }
}

interface SortableQuestionCardProps {
    question: DraftQuestion;
    index: number;
    onEdit: (q: DraftQuestion) => void;
    onRemove: (localId: string) => void;
    onDuplicate: (localId: string) => void;
}

export function SortableQuestionCard({ question, index, onEdit, onRemove, onDuplicate }: SortableQuestionCardProps) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
        useSortable({ id: question.localId });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
        zIndex: isDragging ? 10 : undefined,
    };

    const typeInfo = QUESTION_TYPES.find((t) => t.value === question.question_type);

    return (
        <div
            ref={setNodeRef}
            style={style}
            className="rounded-2xl bg-gradient-card border border-border/50 p-5 animate-scale-in"
        >
            <div className="flex items-start gap-3">
                {/* Drag Handle */}
                <button
                    {...attributes}
                    {...listeners}
                    className="mt-1 cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground p-1 rounded"
                    aria-label="Sürükle"
                >
                    <GripVertical className="h-4 w-4" />
                </button>

                <div className="flex-1 min-w-0">
                    {/* Top row */}
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary/20 text-xs font-bold text-primary">
                            {index + 1}
                        </div>
                        <Badge variant="secondary" className="text-xs gap-1">
                            {typeInfo?.icon} {typeInfo?.label ?? question.question_type}
                        </Badge>
                        {question.weight != null && question.weight !== 1 && (
                            <Badge variant="outline" className="text-xs font-mono">
                                {question.weight} xal
                            </Badge>
                        )}
                        {question.time_limit && (
                            <Badge variant="outline" className="text-xs">
                                ⏱ {question.time_limit}s
                            </Badge>
                        )}
                    </div>

                    {/* Question text */}
                    <p className="text-sm font-medium text-foreground line-clamp-2 mb-1">
                        {question.question_text || <span className="text-muted-foreground italic">Sual mətni yoxdur</span>}
                    </p>

                    {/* Answer summary */}
                    <p className="text-xs text-muted-foreground truncate">
                        ✓ {getAnswerSummary(question)}
                    </p>

                    {/* Hint */}
                    {question.hint && (
                        <p className="text-xs text-primary mt-1 flex items-center gap-1">
                            <Lightbulb className="h-3 w-3" />
                            {question.hint.substring(0, 70)}
                            {question.hint.length > 70 ? '...' : ''}
                        </p>
                    )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1 shrink-0">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onEdit(question)}
                        className="h-8 w-8 text-muted-foreground hover:text-primary"
                        title="Redaktə et"
                    >
                        <Pencil className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onDuplicate(question.localId)}
                        className="h-8 w-8 text-muted-foreground hover:text-primary"
                        title="Kopyala"
                    >
                        <Copy className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onRemove(question.localId)}
                        className="h-8 w-8 text-muted-foreground hover:text-destructive"
                        title="Sil"
                    >
                        <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                </div>
            </div>
        </div>
    );
}
