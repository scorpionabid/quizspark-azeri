import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent,
} from '@dnd-kit/core';
import {
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SortableQuestionCard, DraftQuestion } from './SortableQuestionCard';
import { QuestionType } from '@/types/question';

interface QuizQuestionListProps {
    questions: DraftQuestion[];
    onDragEnd: (event: DragEndEvent) => void;
    onEdit: (q: DraftQuestion) => void;
    onRemove: (localId: string) => void;
    onDuplicate: (localId: string) => void;
    onAddQuestion: (type: QuestionType) => void;
}

export function QuizQuestionList({
    questions,
    onDragEnd,
    onEdit,
    onRemove,
    onDuplicate,
    onAddQuestion,
}: QuizQuestionListProps) {
    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    return (
        <>
            {questions.length > 0 ? (
                <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={onDragEnd}
                >
                    <SortableContext
                        items={questions.map((q) => q.localId)}
                        strategy={verticalListSortingStrategy}
                    >
                        <div className="space-y-3">
                            {questions.map((question, index) => (
                                <SortableQuestionCard
                                    key={question.localId}
                                    question={question}
                                    index={index}
                                    onEdit={onEdit}
                                    onRemove={onRemove}
                                    onDuplicate={onDuplicate}
                                />
                            ))}
                        </div>
                    </SortableContext>
                </DndContext>
            ) : (
                <div className="rounded-2xl border-2 border-dashed border-border/50 p-12 text-center">
                    <p className="text-muted-foreground mb-4">Hələ sual yoxdur</p>
                    <Button variant="outline" onClick={() => onAddQuestion('multiple_choice')}>
                        <Plus className="mr-2 h-4 w-4" />
                        İlk Sualı Əlavə Et
                    </Button>
                </div>
            )}

            {/* Add Question Button at the bottom */}
            {questions.length > 0 && (
                <div className="mt-6 flex justify-center">
                    <Button variant="outline" size="lg" onClick={() => onAddQuestion('multiple_choice')}>
                        <Plus className="mr-2 h-5 w-5" />
                        Sual Əlavə Et
                    </Button>
                </div>
            )}
        </>
    );
}
