import React, { useState, useEffect } from 'react';
import { GripVertical, Check, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { RendererProps } from './types';

import {
  DndContext,
  closestCenter,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
  arrayMove,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface SortableItemProps {
  id: string;
  item: string;
  index: number;
  disabled: boolean;
  showFeedback: boolean;
  isCorrectPos: boolean;
  correctPosition: number;
}

const SortableItem: React.FC<SortableItemProps> = ({
  id,
  item,
  index,
  disabled,
  showFeedback,
  isCorrectPos,
  correctPosition,
}) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id, disabled: disabled || showFeedback });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  let statusClass = 'border-border/60 bg-card';
  if (showFeedback) {
    statusClass = isCorrectPos
      ? 'border-green-500 bg-green-50 dark:bg-green-900/10 text-green-700 dark:text-green-300'
      : 'border-red-400 bg-red-50 dark:bg-red-900/10 text-red-700 dark:text-red-300';
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        'flex items-center gap-3 p-3 rounded-2xl border shadow-sm transition-all duration-200 select-none',
        statusClass,
        isDragging && 'opacity-60 shadow-lg scale-[1.02] z-50',
        !disabled && !showFeedback && 'hover:border-primary/40 hover:shadow-md',
      )}
    >
      {!showFeedback && (
        <div
          {...attributes}
          {...listeners}
          className={cn(
            'flex items-center justify-center h-8 w-6 rounded-lg text-muted-foreground shrink-0',
            !disabled ? 'cursor-grab active:cursor-grabbing hover:bg-muted hover:text-foreground' : 'cursor-default opacity-40',
          )}
          aria-label="Sürüklə"
        >
          <GripVertical className="h-4 w-4" />
        </div>
      )}

      <div
        className={cn(
          'h-8 w-8 flex items-center justify-center rounded-xl font-bold text-sm shrink-0',
          showFeedback
            ? isCorrectPos
              ? 'bg-green-200/50 text-green-800'
              : 'bg-red-200/50 text-red-800'
            : 'bg-primary/10 text-primary',
        )}
      >
        {index + 1}
      </div>

      <span className="flex-1 text-sm font-medium leading-snug">{item}</span>

      {showFeedback && (
        <div className="shrink-0 ml-2">
          {isCorrectPos ? (
            <Check className="h-5 w-5 text-green-600" />
          ) : (
            <div className="flex items-center gap-1 text-[10px] bg-white/50 px-2 py-1 rounded-full border border-red-200">
              <X className="h-3 w-3 text-red-500" />
              <span className="text-red-600 font-bold whitespace-nowrap">Düzgün: {correctPosition + 1}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export const OrderingRenderer: React.FC<RendererProps> = ({
  question,
  value,
  onChange,
  disabled,
  showFeedback,
}) => {
  const [sequence, setSequence] = useState<string[]>([]);

  useEffect(() => {
    if (sequence.length === 0 && question.sequence_items?.length) {
      if (value) {
        setSequence(value.split('|||'));
      } else {
        setSequence([...question.sequence_items].sort(() => Math.random() - 0.5));
      }
    }
  }, [question.id, question.sequence_items, value, sequence.length]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 200, tolerance: 5 } }),
  );

  const handleDragEnd = (event: DragEndEvent) => {
    if (disabled || showFeedback) return;
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = sequence.indexOf(active.id as string);
    const newIndex = sequence.indexOf(over.id as string);
    if (oldIndex === -1 || newIndex === -1) return;

    const newSeq = arrayMove(sequence, oldIndex, newIndex);
    setSequence(newSeq);
    onChange(newSeq.join('|||'));
  };

  const getCorrectSequence = () =>
    (question.sequence_items?.length
      ? question.sequence_items
      : (question.correct_answer || '').split('|||')
    ).map(s => s.trim());

  const correctSeq = getCorrectSequence();

  return (
    <div className="space-y-3">
      <p className="text-xs text-muted-foreground italic mb-1 flex items-center gap-1">
        <GripVertical className="h-3.5 w-3.5 text-primary" />
        Elementləri sürükləyərək düzgün ardıcıllıqla düzün
      </p>
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={sequence} strategy={verticalListSortingStrategy}>
          <div className="space-y-2">
            {sequence.map((item, idx) => {
              const isCorrectPos = showFeedback && item.trim() === (correctSeq[idx] || '').trim();
              const correctPosition = correctSeq.findIndex(c => c.trim() === item.trim());
              return (
                <SortableItem
                  key={item}
                  id={item}
                  item={item}
                  index={idx}
                  disabled={disabled}
                  showFeedback={showFeedback}
                  isCorrectPos={isCorrectPos}
                  correctPosition={correctPosition}
                />
              );
            })}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
};
